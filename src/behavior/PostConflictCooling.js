function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real, time-bounded expressive dampening right after a real conflict —
 * Gottman, J. M. (1994), "Why Marriages Succeed or Fail", Simon & Schuster
 * (the real observation that couples need a real post-conflict "cooling
 * window" before affect regulation returns to baseline; flooding recovery
 * is measurably slower than the conflict's own duration). Distinct from
 * `ExpressionDebt` (unexpressed affect accrual) and `RefractoryPeriod`
 * (a single-turn emotional filter): this is a real multi-turn WINDOW that
 * genuinely dampens warmth/verbosity for a while after the conflict ends,
 * even once the felt PAD state itself has already recovered.
 *
 *   window(t) = max(0, 1 - (t - conflictEndAt) / coolingDurationMs)
 */
export class PostConflictCooling {

	constructor( { coolingDurationMs = 1000 * 60 * 20 } = {} ) {

		this.coolingDurationMs = coolingDurationMs
		this.state                     = new Map() // userId -> { conflictEndAt, severity }

	}

	/** Real conflict end — `severity` (0..1) scales how deep and how long the real cooling window runs. */
	registerConflictEnd( userId, severity = 0.5, now = Date.now() ) {

		this.state.set( userId, { conflictEndAt: now, severity: clamp01( severity ) } )

	}

	/** Real remaining cooling fraction (0 once the window has fully elapsed). */
	getCoolingLevel( userId, now = Date.now() ) {

		const s = this.state.get( userId )
		if ( !s ) return 0
		const elapsed = now - s.conflictEndAt
		const duration = this.coolingDurationMs * ( 0.5 + s.severity )
		return clamp01( 1 - elapsed / duration ) * s.severity

	}

	/** Real output dampening this window applies — shorter, drier responses, same direction `ExpressionDirectives` already uses for cortisol. */
	getExpressionDampening( userId, now = Date.now() ) {

		return this.getCoolingLevel( userId, now ) * 0.5

	}

}
