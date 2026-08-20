function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real Stevens' Power Law — Stevens, S. S. (1957), "On the psychophysical
 * law", Psychological Review, 64(3), 153-181 (the real, foundational
 * psychophysics relationship between physical stimulus intensity and
 * PERCEIVED sensation magnitude, S = k·I^a — real sub-linear exponents,
 * a<1, compress perceived intensity as it repeats, the real signature of
 * sensory habituation "the brain stops fully registering an unchanging
 * stimulus"). Distinct from `AmusementEngine`'s own narrow humor-bit
 * repetition habituation, and from `HedonicAdaptation`'s own separate
 * hedonic-VALUE diminishing-returns curve — this is raw perceived
 * INTENSITY compression for any real stimulus "kind" a caller tracks
 * (shouting, repeated insults, ...), the actual psychophysics domain
 * Stevens' own law describes. The exponent decay RATE and floor are own
 * tuning, not measured from Stevens' own data.
 *
 *   S = k·I^a
 */
export class StevensPowerLaw {

	constructor( { k = 1, baseExponent = 0.9, floor = 0.35 } = {} ) {

		this.k                = k
		this.baseExponent = baseExponent
		this.floor           = floor
		this.exponents      = new Map() // stimulus kind -> current real exponent

	}

	#exponent( kind ) {

		return this.exponents.get( kind ) ?? this.baseExponent

	}

	/** `physicalIntensity` (0..1) — real, already-computed raw magnitude (e.g. this turn's ontologyArousalBoost). */
	perceivedIntensity( kind, physicalIntensity ) {

		return this.k * Math.pow( clamp01( physicalIntensity ), this.#exponent( kind ) )

	}

	/** Real, repeated exposure to the SAME kind of intense stimulus genuinely compresses how it's perceived next time. */
	habituate( kind, rate = 0.03 ) {

		this.exponents.set( kind, Math.max( this.floor, this.#exponent( kind ) - rate ) )

	}

	decay( kind, rate = 0.01 ) {

		this.exponents.set( kind, Math.min( this.baseExponent, this.#exponent( kind ) + rate ) )

	}

}
