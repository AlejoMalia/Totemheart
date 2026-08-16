let nextId = 1

// Common function words — excluded from token-overlap matching so two unrelated
// sentences don't "match" just because both happen to contain "el"/"que"/"the".
// Real bug found via a two-personality REM conversation mock: an unrelated control
// message ("¿qué tal el tiempo hoy?") reactivated a months-old memory purely because
// both sentences contained "el", which isn't a topical match by any real measure.
const STOPWORDS = new Set( [
	'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'a', 'al', 'en', 'y', 'o', 'que',
	'es', 'son', 'ser', 'esta', 'está', 'estan', 'están', 'con', 'por', 'para', 'se', 'su', 'sus', 'lo',
	'me', 'te', 'le', 'les', 'mi', 'tu', 'yo', 'no', 'si', 'sí', 'como', 'mas', 'más', 'pero', 'muy',
	'the', 'a', 'an', 'of', 'to', 'in', 'is', 'are', 'was', 'were', 'and', 'or', 'but', 'for', 'with',
	'this', 'that', 'it', 'i', 'you', 'he', 'she', 'we', 'they',
] )

function tokenize( text ) {

	return ( text || '' ).toLowerCase().match( /[\p{L}']+/gu ) || []

}

function significantTokens( text ) {

	return tokenize( text ).filter( t => !STOPWORDS.has( t ) )

}

function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Memories tagged with a full emotional signature (vector + label blend).
 * Uses a simple in-memory keyword-overlap store by default. Pass an
 * `adapter` ({ upsert(entry), query(text, topK) }) to back this with an
 * external vector DB (Pinecone, Weaviate, ...) instead.
 */
export class EpisodicMemory {

	constructor( { adapter = null } = {} ) {

		this.adapter  = adapter
		this.memories = []

	}

	async store( { text, userId, emotionalSignature, importance, concepts = [], turnIndex = null, surprise = 0, lifeEvent = null } ) {

		const magnitude = Math.hypot( emotionalSignature?.valence ?? 0, emotionalSignature?.arousal ?? 0 ) / Math.SQRT2
		const valence     = emotionalSignature?.valence ?? 0
		// Trauma consolidation: a surprising event (high |RPE|, from DopaminergicEngine)
		// needs less raw magnitude to get permanently consolidated — a mundane strong
		// emotion still requires real intensity, but a shocking one gets remembered
		// more readily. Threshold shifts by up to 0.3 at full surprise; own tuning,
		// not a reproduction of any specific consolidation/learning-rate schedule.
		const permanenceThreshold = 0.9 - clamp01( surprise ) * 0.3
		const entry                  = {
			id         : nextId++,
			text,
			userId,
			concepts,
			turnIndex,
			emotionalSignature,
			lifeEvent,
			importance : importance ?? magnitude,
			retention  : 1,
			permanent  : magnitude > permanenceThreshold,
			// A strongly negative, high-magnitude memory doesn't just decay away like
			// a trivial one — it stays "unresolved" until something explicitly heals it
			// (see Totemheart's guardedness handling and markResolved()). This is an
			// engineering take on the everyday observation that unresolved negative
			// experiences keep affecting behavior — not a citation of any specific
			// trauma-processing formula. See CALIBRATION.md.
			resolution : magnitude > 0.6 && valence < -0.2 ? 'unresolved' : 'resolved',
			timestamp  : Date.now(),
		}

		if ( this.adapter ) await this.adapter.upsert( entry )
		else this.memories.push( entry )

		return entry

	}

	markResolved( id ) {

		const entry = this.memories.find( m => m.id === id )
		if ( entry ) entry.resolution = 'resolved'

	}

	getUnresolvedMemories( userId = null, topK = 10 ) {

		return this.memories
			.filter( m => m.resolution === 'unresolved' && ( !userId || m.userId === userId ) )
			.slice( 0, topK )

	}

	/**
	 * The Zeigarnik effect: an interrupted/unresolved thread doesn't fade
	 * with time the way an ordinary memory does — it keeps nagging, and if
	 * anything gets MORE prominent the longer it goes unaddressed, up to an
	 * asymptotic ceiling (own design, no citation — a bounded-growth curve
	 * with the right qualitative shape, not a reproduction of Zeigarnik's
	 * original experimental measurements). `k` is tuned so the curve is
	 * roughly two-thirds of the way to its ceiling after ~30 real minutes,
	 * the same real-world timescale HedonicAdaptation's cooldown uses.
	 */
	getZeigarnikPriority( entry, now = Date.now(), k = 1 / ( 1000 * 60 * 27 ) ) {

		const interruptedMs = Math.max( 0, now - entry.timestamp )
		return entry.importance * ( 2 - Math.exp( -k * interruptedMs ) )

	}

	/** Total ambient pressure from every unresolved thread (optionally for one user) — feeds CortisolEngine. */
	getZeigarnikPressure( userId = null, now = Date.now() ) {

		return this.getUnresolvedMemories( userId, Infinity )
			.reduce( ( sum, entry ) => sum + this.getZeigarnikPriority( entry, now ), 0 )

	}

	/** Milliseconds since the most recent memory tagged with `concept` for this user, or null if none. */
	msSinceLastConcept( userId, concept, now = Date.now() ) {

		const matches = this.memories.filter( m => m.userId === userId && m.concepts?.includes( concept ) )
		if ( !matches.length ) return null

		const mostRecent = matches.reduce( ( a, b ) => ( a.timestamp > b.timestamp ? a : b ) )
		return now - mostRecent.timestamp

	}

	async recall( queryText, topK = 5 ) {

		if ( this.adapter ) return await this.adapter.query( queryText, topK )

		const queryTokens = new Set( tokenize( queryText ) )
		return this.memories
			.map( entry => {

				const overlap = tokenize( entry.text ).filter( t => queryTokens.has( t ) ).length
				const score   = overlap * ( 0.5 + entry.retention ) * ( 0.5 + entry.importance )
				return { entry, score }

			} )
			.filter( ( { score } ) => score > 0 )
			.sort( ( a, b ) => b.score - a.score )
			.slice( 0, topK )
			.map( ( { entry } ) => entry )

	}

	/**
	 * Mood-congruent recall: real k-nearest-neighbors in emotional-signature
	 * space (not text). The state-dependent-memory effect (recalling sad
	 * things more readily while sad) falls out naturally from weighting
	 * distance in this space rather than needing a special-cased rule.
	 */
	recallMoodCongruent( currentVector, topK = 5 ) {

		const pool = this.adapter ? [] : this.memories // adapter-backed stores don't expose raw vectors to sort here
		return pool
			.map( entry => {

				const sig = entry.emotionalSignature ?? { valence: 0, arousal: 0 }
				const d    = Math.hypot(
					( sig.valence ?? 0 ) - ( currentVector.valence ?? 0 ),
					( sig.arousal ?? 0 ) - ( currentVector.arousal ?? 0 ),
				)
				return { entry, score: 1 / ( 0.1 + d ) }

			} )
			.sort( ( a, b ) => b.score - a.score )
			.slice( 0, topK )
			.map( ( { entry } ) => entry )

	}

	/** Average valence of this user's `topK` most recent memories — the real "recent context" SarcasmDetector compares against. */
	getRecentValence( userId, topK = 3 ) {

		const recent = this.memories
			.filter( m => m.userId === userId )
			.slice( -topK )

		if ( !recent.length ) return 0
		return recent.reduce( ( sum, m ) => sum + ( m.emotionalSignature?.valence ?? 0 ), 0 ) / recent.length

	}

	/**
	 * Marks a memory as REM-consolidated "standout" — the raw material for a latent,
	 * slow-decaying salience distinct from `importance` (which never changes) and from
	 * `resolution` (which is binary). Only a REM sweep calls this, not every turn.
	 */
	tagRemSalient( id, now = Date.now() ) {

		const entry = this.memories.find( m => m.id === id )
		if ( entry ) { entry.remSalient = true; entry.remTaggedAt = now }

	}

	/**
	 * Asymptotic decay toward a non-zero latent floor — an important REM-tagged memory
	 * never fully vanishes from relevance, it just goes quiet, real wall-clock time
	 * (not turns/ticks) since it was tagged. `lambda` default: ~45 real days to
	 * approach the floor. Own design, no citation (inspired by the general shape of
	 * memory-consolidation research — episodic traces stabilizing into more durable,
	 * lower-amplitude traces over time — not a reproduction of any specific model's
	 * numbers).
	 */
	getLatentWeight( entry, now = Date.now(), lambda = 1 / ( 1000 * 60 * 60 * 24 * 45 ), floor = 0.05 ) {

		if ( !entry.remSalient ) return 0
		const elapsed = Math.max( 0, now - ( entry.remTaggedAt ?? entry.timestamp ) )
		return entry.importance * Math.exp( -lambda * elapsed ) + floor

	}

	/**
	 * The "spark": real keyword-token overlap between this turn and a latent memory's
	 * text (same overlap technique `recall()` already uses, not embeddings unless a
	 * caller separately supplies one) multiplies the latent weight back up — a memory
	 * that's gone quiet for months can still resurface at real strength the instant a
	 * matching topic comes up again.
	 */
	getReactivation( entry, tokens ) {

		const entryTokens = new Set( significantTokens( entry.text ) )
		const overlap         = tokens.filter( t => !STOPWORDS.has( t ) && entryTokens.has( t ) ).length
		if ( overlap === 0 ) return 0

		return this.getLatentWeight( entry ) * ( 1 + overlap * 0.5 )

	}

	/** The single most-reactivated REM-salient memory for this turn's tokens, or null. */
	getBestReactivation( tokens, now = Date.now() ) {

		let best          = null
		let bestScore = 0
		for ( const entry of this.memories ) {

			if ( !entry.remSalient ) continue
			const score = this.getReactivation( entry, tokens, now )
			if ( score > bestScore ) { bestScore = score; best = entry }

		}
		return best ? { entry: best, score: bestScore } : null

	}

	getInfluentialMemories( topK = 5 ) {

		return [ ...this.memories ]
			.sort( ( a, b ) => b.importance - a.importance )
			.slice( 0, topK )

	}

}
