function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real sub-threshold irritation carry-over — Berkowitz, L. (1990),
 * "On the formation and regulation of anger and aggression: A
 * cognitive-neoassociationistic analysis", American Psychologist, 45(4),
 * 494-503 (the real finding that minor negative affect below the threshold
 * needed to register as a full emotional event still primes and lowers the
 * bar for the NEXT irritant — distinct from `Sensitization`'s general LTP
 * amplitude growth and from `GrudgeSystem`'s explicit, above-threshold
 * grievance ledger: this tracks residue from things too small to become a
 * grudge at all). Own engineering of the specific leaky-accumulator decay.
 *
 *   trace(t) = trace(t-1)·(1-λ) + irritant
 */
export class ResidualAnnoyanceTrace {

	constructor( { lambda = 0.15 } = {} ) {

		this.lambda = lambda
		this.trace     = 0

	}

	/** `irritant` (0..1) — a real minor negative signal too small on its own to register as a full spike. */
	register( irritant ) {

		this.trace = clamp01( this.trace * ( 1 - this.lambda ) + clamp01( irritant ) )
		return this.trace

	}

	/** Real amplification this residue applies to the NEXT genuine irritant's felt intensity. */
	getPrimingMultiplier() {

		return 1 + this.trace * 0.6

	}

	decay( dt = 1 ) {

		this.trace = Math.max( 0, this.trace * Math.pow( 1 - this.lambda, dt ) )

	}

}
