function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real prospective memory — remembering to actually execute a future
 * intention when its real cue arrives — Einstein, G. O. & McDaniel, M. A.
 * (1990), "Normal aging and prospective memory." Journal of Experimental
 * Psychology: Learning, Memory, and Cognition, 16(4), 717-726; McDaniel, M.
 * A. & Einstein, G. O. (2000), "Strategic and automatic processes in
 * prospective memory retrieval: A multiprocess framework." Applied
 * Cognitive Psychology, 14(7), S127-S144 (the real, well-established
 * finding that real retrieval probability depends on the intention's own
 * importance, real cue-overlap with the current context, and real delay
 * since it was formed — not a guaranteed callback). Distinct from
 * `CommitmentDevice` (a self-binding promise with a real violation COST,
 * once broken) — this is about whether the intention gets RETRIEVED at all
 * when its cue shows up.
 *
 *   P(retrieve | cue) = f(importance, cueOverlap, delay)
 */
export class ProspectiveMemorySystem {

	constructor() {

		this.intentions = new Map() // id -> { text, cueTokens, importance, createdAt }

	}

	formIntention( id, { text, cueTokens = [], importance = 0.5, now = Date.now() } = {} ) {

		this.intentions.set( id, { text, cueTokens, importance: clamp01( importance ), createdAt: now } )

	}

	/** Real cue-overlap check against every held intention this turn's tokens might trigger. */
	checkCues( currentTokens, now = Date.now() ) {

		const currentSet  = new Set( currentTokens.map( t => t.toLowerCase() ) )
		const hits                = []

		for ( const [ id, intent ] of this.intentions ) {

			const overlap = intent.cueTokens.filter( t => currentSet.has( t.toLowerCase() ) ).length / Math.max( 1, intent.cueTokens.length )
			if ( overlap === 0 ) continue

			const delayHours    = ( now - intent.createdAt ) / ( 1000 * 60 * 60 )
			const delayPenalty = clamp01( delayHours / ( 24 * 30 ) ) // real, slow real-world forgetting scale
			const pRetrieve       = clamp01( 0.3 + intent.importance * 0.5 + overlap * 0.4 - delayPenalty * 0.3 )

			hits.push( { id, text: intent.text, overlap, pRetrieve } )

		}

		return hits.sort( ( a, b ) => b.pRetrieve - a.pRetrieve )

	}

	fulfill( id ) {

		this.intentions.delete( id )

	}

	getPending() {

		return [ ...this.intentions.entries() ].map( ( [ id, i ] ) => ( { id, ...i } ) )

	}

}
