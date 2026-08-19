function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real demand-withdraw pattern tracking — Christensen, A. & Heavey, C. L.
 * (1990), "Gender and social structure in the demand/withdraw pattern of
 * marital conflict", Journal of Personality and Social Psychology, 59(1),
 * 73-81 (the real, well-replicated finding that one party's escalating
 * DEMAND for engagement predicts the other's WITHDRAWAL, which in turn
 * predicts more demand — a real self-reinforcing loop distinct from either
 * side's affect alone). Tracks both roles simultaneously so either side of
 * the loop can be read.
 *
 *   demandPressure(t) = demandPressure(t-1)·(1-λ) + demandSignal
 *   withdrawal genuinely rises with demandPressure once it crosses a real threshold
 */
export class DemandWithdrawLoop {

	constructor( { lambda = 0.2, withdrawThreshold = 0.6 } = {} ) {

		this.lambda                  = lambda
		this.withdrawThreshold = withdrawThreshold
		this.demandPressure     = new Map() // userId -> real accumulated demand FROM this user

	}

	/** `demandSignal` (0..1) — real per-turn pressure for engagement/response (repetition, urgency markers, direct requests). */
	registerDemand( userId, demandSignal ) {

		const current = this.demandPressure.get( userId ) ?? 0
		const updated = clamp01( current * ( 1 - this.lambda ) + clamp01( demandSignal ) )
		this.demandPressure.set( userId, updated )
		return updated

	}

	/** Real, bounded withdrawal urge this AI genuinely develops once demand crosses the threshold — the OTHER half of the real loop. */
	getWithdrawalUrge( userId ) {

		const pressure = this.demandPressure.get( userId ) ?? 0
		if ( pressure < this.withdrawThreshold ) return 0
		return clamp01( ( pressure - this.withdrawThreshold ) / ( 1 - this.withdrawThreshold ) )

	}

	decay( userId, dt = 1 ) {

		const current = this.demandPressure.get( userId )
		if ( current !== undefined ) this.demandPressure.set( userId, Math.max( 0, current * Math.pow( 1 - this.lambda, dt ) ) )

	}

}
