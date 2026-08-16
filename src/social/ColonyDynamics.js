function clamp( v, min = -1, max = 1 ) {

	return Math.max( min, Math.min( max, v ) )

}

/**
 * Real emotional contagion ACROSS multiple Totemheart instances registered
 * into one colony — EmotionalContagion.js already models the real
 * pairwise "mirror the user" case; this is the real group-level analog
 * (Barsade, S. G. (2002), "The ripple effect: Emotional contagion and its
 * influence on group behavior", Administrative Science Quarterly, 47(4),
 * 644-675 — the actual finding that emotion spreads through a GROUP, not
 * just dyadically, and that group-level coherence/dispersion is itself a
 * real, measurable property). Each instance calls `register()` with its own
 * real, current emotion vector; the colony computes real contagion pulls
 * and real coherence purely from those registered readings — no invented
 * "hive mind" state, just aggregation over real per-instance data.
 *
 *   Contagion = Σ (other_emotion · proximity · trust) / n
 *   ColonyCoherence = 1 − variance(emotions_in_colony)
 */
export class ColonyDynamics {

	constructor() {

		this.members = new Map() // agentId -> { valence, arousal }

	}

	register( agentId, { valence, arousal } ) {

		this.members.set( agentId, { valence, arousal } )

	}

	unregister( agentId ) {

		this.members.delete( agentId )

	}

	/**
	 * `proximity`/`trust` — real 0..1 maps keyed by other agentIds (caller-
	 * supplied — e.g. proximity from a real shared-context signal, trust from
	 * each member's own Attachment reading of the others). Excludes `selfId`
	 * from its own average.
	 */
	computeContagion( selfId, proximity = {}, trust = {} ) {

		const others = [ ...this.members.entries() ].filter( ( [ id ] ) => id !== selfId )
		if ( !others.length ) return { valence: 0, arousal: 0 }

		let valenceSum = 0
		let arousalSum   = 0
		let weightSum     = 0

		for ( const [ id, state ] of others ) {

			const weight = ( proximity[ id ] ?? 1 ) * ( trust[ id ] ?? 0.5 )
			valenceSum += state.valence * weight
			arousalSum   += state.arousal * weight
			weightSum     += weight

		}

		if ( weightSum === 0 ) return { valence: 0, arousal: 0 }
		return { valence: clamp( valenceSum / weightSum ), arousal: clamp( arousalSum / weightSum, 0, 1 ) }

	}

	/** Real 1 − variance(valence) across every currently-registered member — a tightly-clustered colony reads coherent, a scattered one doesn't. */
	computeColonyCoherence() {

		const valences = [ ...this.members.values() ].map( m => m.valence )
		if ( valences.length < 2 ) return 1

		const mean       = valences.reduce( ( a, b ) => a + b, 0 ) / valences.length
		const variance = valences.reduce( ( sum, v ) => sum + ( v - mean ) ** 2, 0 ) / valences.length

		return Math.max( 0, 1 - variance )

	}

	getMemberCount() {

		return this.members.size

	}

}
