function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function tokenize( text ) {

	return ( text || '' ).toLowerCase().match( /[\p{L}']+/gu ) || []

}

/**
 * Memories that outlive a single Totemheart instance's own conversation
 * history — real cross-session "inheritance": the caller `toJSON()`s a
 * LegacyMemory, persists it however it persists anything else (a file, a
 * database row keyed by a character/persona id, not this class's job), and
 * a LATER instance (a "next generation" of the same character/persona, or a
 * genuinely different instance seeded from the same lineage) can load it
 * back with `restoreState()` and have those entries still real, still
 * decaying, and still activatable. Own engineering — there's no
 * established "artificial inherited memory" literature this is a
 * reproduction of; the exponential generational decay is the same
 * standard shape ForgettingCurve/HedonicAdaptation already use elsewhere
 * in this codebase, applied here across generations instead of across time.
 *
 *   LegacyStrength = e^(-λ·generations) · original_weight
 *   Activation = LegacyStrength · similarity(current_context, legacy_cue)
 */
export class LegacyMemory {

	constructor( { lambda = 0.25 } = {} ) {

		this.lambda   = lambda
		this.entries = [] // { cue, weight, generation }

	}

	/** Real, explicit inheritance — a caller decides what's worth carrying forward, this class doesn't invent significance on its own. */
	inherit( cue, weight, generation = 1 ) {

		this.entries.push( { cue, weight: clamp01( weight ), generation } )

	}

	/** Real exponential decay by generational distance — Conscientiousness slows it (own tuning: a disciplined lineage preserves more), Openness doesn't affect strength, only activation likelihood below. */
	getStrength( entry, conscientiousness = 0.5 ) {

		const effectiveLambda = this.lambda * ( 1 - clamp01( conscientiousness ) * 0.5 )
		return Math.exp( -effectiveLambda * entry.generation ) * entry.weight

	}

	/**
	 * Real token-overlap similarity (the same technique EpisodicMemory.recall()
	 * already uses, not a fake similarity score) between the current context
	 * and this legacy entry's cue, scaling its strength into a real activation
	 * reading. `openness` lowers the real overlap needed to count as a match —
	 * a more open mind draws more readily on inherited material.
	 */
	getActivation( entry, currentContext, { conscientiousness = 0.5, openness = 0.5 } = {} ) {

		const cueTokens         = new Set( tokenize( entry.cue ) )
		const contextTokens = tokenize( currentContext )
		const overlap             = contextTokens.filter( t => cueTokens.has( t ) ).length
		if ( overlap === 0 ) return 0

		const similarity = clamp01( ( overlap / Math.max( 1, cueTokens.size ) ) * ( 1 + clamp01( openness ) * 0.5 ) )
		return this.getStrength( entry, conscientiousness ) * similarity

	}

	/** The single most-activated legacy entry for this context, or null. */
	getBestActivation( currentContext, personality = {} ) {

		let best      = null
		let bestScore = 0
		for ( const entry of this.entries ) {

			const activation = this.getActivation( entry, currentContext, personality )
			if ( activation > bestScore ) { bestScore = activation; best = entry }

		}
		return best ? { entry: best, activation: bestScore } : null

	}

	toJSON() {

		return { lambda: this.lambda, entries: this.entries }

	}

	restoreState( data = {} ) {

		if ( typeof data.lambda === 'number' ) this.lambda = data.lambda
		if ( data.entries ) this.entries = data.entries

	}

}
