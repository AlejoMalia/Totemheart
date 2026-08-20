function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

/**
 * Real LONELINESS — Cacioppo, J. T. & Patrick, W. (2008), "Loneliness:
 * Human Nature and the Need for Social Connection", W. W. Norton (the
 * real, well-established distinction: loneliness is a real deficit in
 * felt CONNECTION QUALITY/meaningfulness, genuinely independent of how
 * much real social contact is happening — "lonely in a crowd" is real,
 * not a contradiction). Distinct from `AffiliationThermostat` (which
 * tracks real contact FREQUENCY, regardless of quality) — this tracks the
 * real gap between desired and effective connection.
 *
 *   L = σ(desiredConnection − effectiveConnection − meaningfulness)
 *   dL/dt = ρ(L* − L)
 */
export class LonelinessEngine {

	constructor( { rho = 0.15 } = {} ) {

		this.rho          = rho
		this.loneliness = 0

	}

	/** Real target this turn from already-computed real inputs (0..1 each). */
	getTarget( { desiredConnection = 0.5, effectiveConnection = 0, meaningfulness = 0 } ) {

		return sigmoid( 3 * ( clamp01( desiredConnection ) - clamp01( effectiveConnection ) - clamp01( meaningfulness ) ) )

	}

	update( target, dt = 1 ) {

		this.loneliness = clamp01( this.loneliness + this.rho * ( clamp01( target ) - this.loneliness ) * dt )
		return this.loneliness

	}

	getLevel() {

		return this.loneliness

	}

	/** Real, distinct downstream real multipliers — own tuning, direction only cited. */
	getHypervigilanceBoost() {

		return this.loneliness * 0.4

	}

	getInitiativeDamping() {

		return this.loneliness * 0.3

	}

}
