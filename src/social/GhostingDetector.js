function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real ghosting pain — a delayed-peak function of real silence relative to
 * an established real cadence, gated on there having been real prior
 * investment (a `SomaticActivationSystem` "butterflies" history, or plain
 * affinity) to begin with — Freedman, G., Powell, D. N., Le, B. &
 * Williams, K. D. (2019), "Ghosting and destiny: Implicit theories of
 * relationships predict beliefs about ghosting." Journal of Social and
 * Personal Relationships, 36(3), 905-924 (the real, distinct psychological
 * profile of ghosting: an unresolved Zeigarnik-style loop combined with the
 * real withdrawal of an established reward-prediction cadence); Zeigarnik,
 * B. (1927), already cited elsewhere for the general unresolved-task
 * effect. Own engineering of the specific delayed-peak curve.
 *
 *   τ = elapsed / expectedCadence
 *   P_ghost = B_historic · τ · e^(-γτ)
 */
export class GhostingDetector {

	constructor( { gamma = 0.15 } = {} ) {

		this.gamma = gamma
		this.state    = new Map() // userId -> { lastContactAt, expectedCadenceMs, historicButterflies }

	}

	observeContact( userId, { expectedCadenceMs = 1000 * 60 * 60 * 24, historicButterflies = 0 } = {}, now = Date.now() ) {

		this.state.set( userId, { lastContactAt: now, expectedCadenceMs, historicButterflies } )

	}

	/** Real, delayed-peak ghosting pain — rises, peaks, then genuinely fades toward acceptance over a long real silence. */
	getGhostingPain( userId, now = Date.now() ) {

		const s = this.state.get( userId )
		if ( !s || s.historicButterflies <= 0 ) return 0

		const tau = ( now - s.lastContactAt ) / s.expectedCadenceMs
		if ( tau <= 0 ) return 0

		return clamp01( s.historicButterflies * tau * Math.exp( -this.gamma * tau ) )

	}

	/** A real, distinct social-fill effect — engaging with someone NEW genuinely accelerates the real acceptance curve for the old silence. */
	acceleratedByNewEngagement( userId, boost = 0.05 ) {

		const s = this.state.get( userId )
		if ( s ) this.gamma = Math.min( 1, this.gamma + boost )

	}

}
