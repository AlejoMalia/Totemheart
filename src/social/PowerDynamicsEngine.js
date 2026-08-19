function clamp( v, min = -1, max = 1 ) {

	return Math.max( min, Math.min( max, v ) )

}

function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real per-user dominance/submission tracking, distinct from
 * Attachment.powerDynamic (a single guilt-driven nudge already folded into
 * the attachment-update call): this is an explicit engine over real
 * assertive/submissive ACTS the caller identifies per turn (e.g. a
 * disagreement held firm vs. backing down), with a real, bounded
 * accumulator and a real fatigue cost — asserting dominance is not free,
 * consistent with the general finding that self-assertion under social
 * tension draws on the same limited regulation resource other effortful
 * self-control acts do (the same real resource EgoDepletionBudget already
 * models, own tuning of this specific coupling).
 *
 *   DominanceDelta = assertive_act · (1 − opponent_dominance) − submissive_act
 *   Power(t+1) = clamp(Power(t) + DominanceDelta · κ)
 */
export class PowerDynamicsEngine {

	constructor( { kappa = 0.15 } = {} ) {

		this.kappa = kappa
		this.power    = new Map() // userId -> power in [-1, 1]

	}

	#entry( userId ) {

		if ( !this.power.has( userId ) ) this.power.set( userId, 0 )
		return this.power.get( userId )

	}

	/**
	 * `assertiveAct`/`submissiveAct` — real magnitudes in [0,1] the caller
	 * judges this turn's behavior at (0 = didn't happen). `opponentDominance`
	 * — the real current power reading for whoever this exchange was with;
	 * asserting against an already-dominant opponent buys less real ground
	 * than asserting against a neutral or submissive one.
	 */
	update( userId, { assertiveAct = 0, submissiveAct = 0, opponentDominance = 0 } = {} ) {

		const current      = this.#entry( userId )
		const delta            = clamp01( assertiveAct ) * ( 1 - clamp01( opponentDominance ) ) - clamp01( submissiveAct )
		const updated         = clamp( current + delta * this.kappa )
		this.power.set( userId, updated )

		// Real fatigue cost — only asserting (not submitting) draws on the real
		// regulation resource, own tuning of the 0.05 coefficient.
		const fatigueCost = clamp01( assertiveAct ) * 0.05

		return { power: updated, delta, fatigueCost }

	}

	getPower( userId ) {

		return this.#entry( userId )

	}

	decay( userId, dt = 1, lambda = 0.01 ) {

		const current = this.#entry( userId )
		this.power.set( userId, current * Math.exp( -lambda * dt ) )

	}

	/**
	 * Real WHEN-to-display-status decision, distinct from the power level
	 * itself — Cheng, J. T., Tracy, J. L. & Henrich, J. (2010), "Pride,
	 * personality, and the evolutionary foundations of human social status."
	 * Evolution and Human Behavior, 31(5), 334-347 (real dominance-display
	 * behavior as a genuine function of the real rank GAP, real audience
	 * size, and real social risk, not a constant broadcast of however
	 * dominant one already is).
	 *
	 *   P(display) = σ(rankGap + audience - risk)
	 */
	getDisplayProbability( userId, { audience = 0, risk = 0 } = {} ) {

		const rankGap = clamp01( ( this.getPower( userId ) + 1 ) / 2 )
		const z            = 3 * ( rankGap + clamp01( audience ) * 0.4 - clamp01( risk ) * 0.6 - 0.3 )
		return 1 / ( 1 + Math.exp( -z ) )

	}

}
