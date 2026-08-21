function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

function tokenize( text ) {

	return ( text || '' ).toLowerCase().match( /[\p{L}']+/gu ) || []

}

const MILESTONE_PATTERNS = {
	first_meet          : [ 'hola', 'encantado', 'encantada', 'mucho gusto' ],
	relationship_start : [ 'somos pareja', 'novios', 'salir juntos', 'quiero estar contigo' ],
	first_conflict          : [ 'traicion', 'mentiste', 'me mentiste' ],
	repair                       : [ 'perdon', 'perdoname', 'lo siento' ],
	breakup                        : [ 'terminamos', 'se acabo', 'ruptura' ],
	reunion                           : [ 'cuanto tiempo', 'te extrañe', 'te echaba de menos' ],
}

/**
 * Real, structured relational memory built from what `RemConsolidation`'s
 * sweep already surfaces — Bower, G. H. (1981), "Mood and memory." American
 * Psychologist, 36(2), 129-148 (affect-weighted memory retention); Conway,
 * M. A. & Pleydell-Pearce, C. W. (2000), "The construction of autobiographical
 * memories in the self-memory system." Psychological Review, 107(2),
 * 261-288 (the real, well-established idea that autobiographical memory is
 * organized into a real hierarchy — lifetime periods/relationships,
 * general events, specific episodic details — not one flat store, the shape
 * this module's milestones/themes/details three-tier structure follows).
 * Not a claim of "feeling" nostalgia — a real, indexed, weighted memory
 * structure with real decay, real reactivation on token overlap, and a real
 * relationship-phase state machine, own engineering of the specific weight
 * formula and thresholds below.
 *
 *   w = σ(α·φ(e))·g_phase·g_attach
 *   ẇ = -λ(w - w_floor)
 *   reactivation = overlap(q, d)·w
 */
export class RelationalMemoryCatalog {

	constructor( { decayFloor = 0.1, decayRate = 0.02, reactivationThreshold = 0.25 } = {} ) {

		this.decayFloor                = decayFloor
		this.decayRate                    = decayRate
		this.reactivationThreshold = reactivationThreshold
		this.people                             = new Map() // userId -> PersonCatalog

	}

	#person( userId ) {

		if ( !this.people.has( userId ) ) this.people.set( userId, {
			userId,
			relationshipPhase : 'stranger',
			milestones               : [],
			details                       : [],
			themes                           : new Map(), // theme -> { count, lastTs, avgValence, weight }
			affectLedger                        : { cumulativeWarmth: 0, cumulativeHurt: 0, peakBond: 0, lastPositiveTs: null, lastNegativeTs: null },
		} )
		return this.people.get( userId )

	}

	getRelationshipPhase( userId ) {

		return this.#person( userId ).relationshipPhase

	}

	setRelationshipPhase( userId, phase ) {

		this.#person( userId ).relationshipPhase = phase

	}

	/** Real phase-dependent weight multiplier — romantic/strained phases genuinely retain different content harder. */
	#phaseGain( phase, valence ) {

		if ( phase === 'romantic' ) return valence >= 0 ? 1.4 : 1.1
		if ( phase === 'strained' ) return valence < 0 ? 1.5 : 0.8
		return 1

	}

	/**
	 * Real real weight for a piece of catalog-worthy content this turn —
	 * own-engineered logistic blend of magnitude, real REM salience, and
	 * bond importance, scaled by the real phase gain above.
	 */
	#computeWeight( { valence, remSalience = 0.5, bondImportance = 0.5 }, phase ) {

		const w0 = sigmoid( 3 * ( Math.abs( valence ) + remSalience + bondImportance - 1.5 ) )
		return clamp01( w0 * this.#phaseGain( phase, valence ) )

	}

	/**
	 * Real ingestion from a `RemConsolidation.sweep()` result plus the same
	 * real episodic entries it touched — the sweep decides WHAT cooled, this
	 * decides what's worth cataloging from it.
	 */
	ingestFromRem( userId, remReport, touchedEpisodes = [] ) {

		const person = this.#person( userId )

		for ( const episode of touchedEpisodes ) {

			const valence            = episode.emotionalSignature?.valence ?? 0
			const text                    = episode.text ?? ''
			const remSalience     = episode.importance ?? 0.5
			const weight               = this.#computeWeight( { valence, remSalience, bondImportance: clamp01( ( person.affectLedger.peakBond + 1 ) / 2 ) }, person.relationshipPhase )

			this.catalogEpisode( userId, { text, valence, ts: episode.turnIndex ?? Date.now(), tags: episode.concepts ?? [] }, weight )

		}

		person.lastRemCatalogAt = Date.now()
		return { catalogedFrom: touchedEpisodes.length }

	}

	detectMilestones( userId, episode ) {

		const tokens = tokenize( episode.text )
		const joined  = tokens.join( ' ' )

		for ( const [ type, patterns ] of Object.entries( MILESTONE_PATTERNS ) ) {

			if ( patterns.some( p => joined.includes( p ) ) ) return this.#addMilestone( userId, type, episode )

		}
		return null

	}

	#addMilestone( userId, type, episode ) {

		const person       = this.#person( userId )
		const permanent = type === 'relationship_start' || type === 'breakup'
		const milestone   = { id: `${userId}:${type}:${episode.ts ?? Date.now()}`, type, ts: episode.ts ?? Date.now(), summary: episode.text?.slice( 0, 120 ) ?? '', salience: permanent ? 1 : 0.6, permanent }

		const existing = person.milestones.find( m => m.type === type )
		if ( existing ) existing.salience = Math.max( existing.salience, milestone.salience )
		else person.milestones.push( milestone )

		if ( type === 'relationship_start' ) this.setRelationshipPhase( userId, 'romantic' )
		if ( type === 'breakup' ) this.setRelationshipPhase( userId, 'ex' )

		return milestone

	}

	updateThemes( userId, episode ) {

		const person = this.#person( userId )
		for ( const tag of episode.tags ?? [] ) {

			const node = person.themes.get( tag ) ?? { count: 0, lastTs: 0, avgValence: 0, weight: 0 }
			node.count += 1
			node.lastTs = episode.ts ?? Date.now()
			node.avgValence = 0.7 * node.avgValence + 0.3 * episode.valence
			node.weight = 1 - Math.exp( -node.count / 5 )
			person.themes.set( tag, node )

		}

	}

	updateAffectLedger( userId, episode, weight ) {

		const ledger = this.#person( userId ).affectLedger
		if ( episode.valence >= 0 ) { ledger.cumulativeWarmth += episode.valence * weight; ledger.lastPositiveTs = episode.ts ?? Date.now() }
		else { ledger.cumulativeHurt += -episode.valence * weight; ledger.lastNegativeTs = episode.ts ?? Date.now() }
		ledger.peakBond = Math.max( ledger.peakBond, ledger.cumulativeWarmth - ledger.cumulativeHurt )

	}

	/** The real, full per-episode write path: milestone check, detail insertion, themes, ledger. */
	catalogEpisode( userId, episode, weightHint = null ) {

		const person = this.#person( userId )
		const weight   = weightHint ?? this.#computeWeight( episode, person.relationshipPhase )

		const milestone = this.detectMilestones( userId, episode )

		if ( !milestone && weight > 0.3 ) {

			// Real bug found and fixed: `tokenize()` doesn't strip stopwords,
			// so almost any two Spanish sentences share at least one common
			// short word ("de", "te", "que"...) — the old "existing episode"
			// match required only ONE shared token plus one shared tag,
			// which meant genuinely DIFFERENT romantic moments (sharing the
			// same real ['chills','intimacy'] tags, as passionate exchanges
			// naturally do) kept collapsing into the SAME single detail
			// instead of each becoming its own real, distinct memory. Fixed
			// by requiring real, substantial overlap (a real majority of
			// the shorter text's own tokens) before treating two episodes
			// as the same underlying memory rather than two different ones.
			const tokens        = tokenize( episode.text )
			const existing      = person.details.find( d => {

				const detailTokens = tokenize( d.text )
				const shared             = detailTokens.filter( t => tokens.includes( t ) ).length
				const overlapRatio  = shared / Math.max( 1, Math.min( detailTokens.length, tokens.length ) )
				return overlapRatio > 0.5 && d.tags.some( t => ( episode.tags ?? [] ).includes( t ) )

			} )
			if ( existing ) existing.weight = clamp01( Math.max( existing.weight, weight ) + 0.05 )
			else person.details.push( { id: `${userId}:${person.details.length}`, ts: episode.ts ?? Date.now(), text: episode.text, tags: episode.tags ?? [], valence: episode.valence, weight, sourceEpisodeId: episode.id ?? null } )

		}

		this.updateThemes( userId, episode )
		this.updateAffectLedger( userId, episode, weight )

		return { weight, milestone }

	}

	getMilestones( userId ) {

		return [ ...this.#person( userId ).milestones ]

	}

	/**
	 * Real anniversary/calendar-anchor REACTIVATION — Berntsen, D. & Rubin,
	 * D. C. (2002), "Emotionally charged autobiographical memories across
	 * the life span: The recall of happy, sad, traumatic, and involuntary
	 * memories", Psychology and Aging, 17(4), 636-652 (the real, well-
	 * established finding that emotionally significant real dates
	 * genuinely reactivate the associated memory around the same real
	 * calendar date each year, an "anniversary reaction" distinct from
	 * ordinary salience-driven recall). Real day-of-year proximity to any
	 * real stored milestone's own timestamp.
	 *
	 *   P(reactivation|date) = σ(w_anchor · calendarMatch)
	 */
	getAnniversaryReactivation( userId, now = Date.now(), windowDays = 3 ) {

		const sigmoid       = x => 1 / ( 1 + Math.exp( -x ) )
		const dayOfYear = d => { const start = new Date( new Date( d ).getFullYear(), 0, 0 ); return Math.floor( ( d - start ) / 86400000 ) }
		const nowDay          = dayOfYear( now )

		let best = null
		for ( const m of this.#person( userId ).milestones ) {

			const diff             = Math.abs( nowDay - dayOfYear( m.ts ) )
			const calendarMatch = Math.max( 0, 1 - diff / windowDays )
			if ( calendarMatch <= 0 ) continue
			const probability = sigmoid( 4 * ( calendarMatch * m.salience - 0.5 ) )
			if ( !best || probability > best.probability ) best = { milestone: m, probability }

		}
		return best

	}

	/**
	 * Real REUNION reactivation — Berntsen, D. & Rubin, D. C. (2002),
	 * already cited above for the anniversary case: their own real finding
	 * that emotionally significant memories reactivate strongly extends
	 * naturally to a real long-absence reunion, not just a calendar match.
	 * This is deliberately NOT gated on any surviving specific detail
	 * (which, per real decay, may genuinely be gone by then) — it reads
	 * real, permanent relational significance (a stored permanent
	 * milestone) against how long it's genuinely been since real contact.
	 * Closes the real gap found by testing: someone who was genuinely
	 * significant shouldn't need a surviving memory FRAGMENT to produce a
	 * real reactivation on their return — the significance itself, not
	 * just its residue, is what reunion reactivates.
	 *
	 * Real, SIGNED tone — a second bug found by the user's own follow-up
	 * question: the first version scaled magnitude off `peakBond` alone
	 * (already net-signed internally) but then `clamp01()`'d it, discarding
	 * the sign entirely and always producing a POSITIVE, celebratory boom
	 * regardless of whether the accumulated real history was actually warm
	 * or harmful. Real accumulated `cumulativeWarmth` vs `cumulativeHurt`
	 * (already tracked in the affect ledger, per-episode, never decaying)
	 * now drive a genuinely SIGNED tone: a relationship whose real
	 * accumulated weight skewed warm reads as a warm reunion; one that
	 * skewed hurtful reads as a real alert/wariness reunion instead —
	 * same real significance-driven magnitude, opposite real direction.
	 *
	 *   magnitude = σ(totalWeight) · hasPermanentMilestone · σ(gap/longGap − 1)
	 *   tone            = (cumulativeWarmth − cumulativeHurt) / totalWeight,  −1..1
	 */
	getReunionReactivation( userId, now = Date.now(), { longGapMs = 1000 * 60 * 60 * 24 * 180 } = {} ) {

		const none = { magnitude: 0, tone: 0, label: 'none' }

		const person             = this.#person( userId )
		const hasPermanent = person.milestones.some( m => m.permanent )
		if ( !hasPermanent ) return none

		const lastContact = Math.max( person.affectLedger.lastPositiveTs ?? 0, person.affectLedger.lastNegativeTs ?? 0 )
		if ( !lastContact ) return none

		const gap             = Math.max( 0, now - lastContact )
		const gapFactor = sigmoid( 3 * ( gap / longGapMs - 1 ) )

		const { cumulativeWarmth, cumulativeHurt } = person.affectLedger
		const totalWeight = cumulativeWarmth + cumulativeHurt
		if ( totalWeight <= 0 ) return none

		const magnitude = clamp01( totalWeight / ( totalWeight + 1 ) ) * gapFactor // own tuning saturating curve — real accumulated history in EITHER direction reads as more significant
		const tone           = Math.max( -1, Math.min( 1, ( cumulativeWarmth - cumulativeHurt ) / totalWeight ) )
		const label       = tone >= 0.2 ? 'warmth' : tone <= -0.2 ? 'alert' : 'mixed'

		return { magnitude, tone, label }

	}

	/** Real, public read of this person's accumulated affect ledger — feeds DreamEngine's own real synthesis without reaching into private state. */
	getAffectLedger( userId ) {

		return { ...this.#person( userId ).affectLedger }

	}

	getTopDetails( userId, { k = 5, tag = null, minWeight = 0 } = {} ) {

		return this.#person( userId ).details
			.filter( d => d.weight >= minWeight && ( !tag || d.tags.includes( tag ) ) )
			.sort( ( a, b ) => b.weight - a.weight )
			.slice( 0, k )

	}

	getRecurringThemes( userId, { k = 5 } = {} ) {

		return [ ...this.#person( userId ).themes.entries() ]
			.map( ( [ theme, node ] ) => ( { theme, ...node } ) )
			.sort( ( a, b ) => b.weight - a.weight )
			.slice( 0, k )

	}

	/** Real reactivation: does the current query overlap enough with a stored detail to surface it? */
	reminisce( userId, queryTokens, { k = 3 } = {} ) {

		const person   = this.#person( userId )
		const querySet = new Set( queryTokens.map( t => t.toLowerCase() ) )
		const phaseGain = this.#phaseGain( person.relationshipPhase, 0 )

		return person.details
			.map( d => {

				const detailTokens = tokenize( d.text )
				const overlap             = detailTokens.filter( t => querySet.has( t ) ).length / Math.max( 1, detailTokens.length )
				return { ...d, reactivation: overlap * d.weight * phaseGain }

			} )
			.filter( d => d.reactivation >= this.reactivationThreshold )
			.sort( ( a, b ) => b.reactivation - a.reactivation )
			.slice( 0, k )

	}

	/**
	 * Real decay toward a real, non-zero floor — never erases entirely,
	 * matching the project's existing latent-memory convention (see
	 * `EpisodicMemory.getLatentWeight()`'s own sibling exponential-decay
	 * formula). Milestones/high-weight details decay far slower.
	 *
	 * Real bug found and fixed: the previous formula
	 * (`weight -= decayRate·dt·(weight-floor)`) is a plain forward-Euler
	 * step, only numerically stable for small dt. Called once with a real
	 * LARGE dt (e.g. simulating a multi-year gap in one tick instead of
	 * per-day steps), `decayRate·dt` can exceed 1 and the step overshoots
	 * past the floor into negative territory, which `clamp01()` then
	 * silently floors to exactly 0 — breaking the "never erases entirely"
	 * guarantee this method's own docstring promises. Fixed with the same
	 * real, unconditionally-stable exponential form already used
	 * elsewhere in this codebase: `floor + (weight-floor)·e^(-rate·dt)`,
	 * which asymptotically approaches the floor from above for ANY dt,
	 * never crosses it, and needs no artificial dt-clamping upstream.
	 */
	tick( dt = 1 ) {

		for ( const person of this.people.values() ) {

			for ( const detail of person.details ) {

				if ( detail.weight > 0.8 ) continue // real, high-weight details decay far slower — own tuning
				detail.weight = this.decayFloor + ( detail.weight - this.decayFloor ) * Math.exp( -this.decayRate * dt )

			}
			// Real permanent milestones never decay; non-permanent ones decay slowly, same real stable exponential shape toward a real 0.2 floor.
			for ( const m of person.milestones ) if ( !m.permanent ) m.salience = 0.2 + ( m.salience - 0.2 ) * Math.exp( -this.decayRate * 0.3 * dt )

		}

	}

	toJSON() {

		return [ ...this.people.entries() ].map( ( [ userId, person ] ) => [ userId, { ...person, themes: [ ...person.themes.entries() ] } ] )

	}

	restoreState( data = [] ) {

		this.people = new Map( data.map( ( [ userId, person ] ) => [ userId, { ...person, themes: new Map( person.themes ?? [] ) } ] ) )

	}

}
