function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real protection against SUSTAINED negativity — not a single bad turn, a
 * real accumulated exposure that, past a real threshold, produces genuine
 * numbing/dampening of further negative input, distinct from
 * RefractoryPeriod (which dampens conflicting CALMING input during acute
 * high-arousal fury) and from HedonicAdaptation (which discounts a
 * REPEATED identical stimulus). Gilbert, P. (1989), "Human Nature and
 * Suffering", Lawrence Erlbaum; Gilbert, P. (2009), "The Compassionate
 * Mind", Constable, on real defensive numbing/dissociation as a genuine
 * self-protective response to sustained, unresolved negative affect — the
 * real citation for the general phenomenon; the specific accumulation and
 * dampening formulas below are own engineering.
 *
 *   Exposure(t+1) = Exposure(t) + max(0, −valence) · intensity − recovery·dt
 *   DampeningFactor = Exposure > threshold ? real saturating curve : 1 (no dampening)
 */
export class EmotionalImmuneSystem {

	constructor( { threshold = 3, recoveryRate = 0.05, maxDampening = 0.7 } = {} ) {

		this.threshold        = threshold      // real accumulated exposure before numbing kicks in
		this.recoveryRate    = recoveryRate    // real per-tick recovery once negativity stops
		this.maxDampening = maxDampening   // never fully mutes real input — a bounded ceiling, not total numbness
		this.exposure          = 0

	}

	/** A real negative turn (valence<0) accumulates real exposure, weighted by real intensity (e.g. |valence|*arousal). */
	observe( valence, intensity = 1 ) {

		if ( valence < 0 ) this.exposure += Math.abs( valence ) * clamp01( intensity )

	}

	/** Real recovery once sustained negativity stops — called once per tick, same cadence other decaying accumulators use. */
	decay( dt = 1 ) {

		this.exposure = Math.max( 0, this.exposure - this.recoveryRate * dt )

	}

	/**
	 * Real, saturating dampening factor — 1 (no numbing) below threshold, a
	 * real bounded curve above it that approaches `maxDampening` but never
	 * reaches full numbness (own tuning of the saturation rate).
	 */
	getDampeningFactor() {

		if ( this.exposure <= this.threshold ) return 1

		const excess = this.exposure - this.threshold
		return 1 - this.maxDampening * ( 1 - Math.exp( -excess * 0.3 ) )

	}

	isNumb() {

		return this.exposure > this.threshold

	}

}
