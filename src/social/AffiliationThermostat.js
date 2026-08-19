function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * A real, distinct set-point homeostat for desired SOCIAL CONTACT
 * FREQUENCY — O'Connor, B. P. & Rosenblood, L. K. (1996), "Affiliation
 * motivation in everyday experience: A theoretical comparison", Journal of
 * Personality and Social Psychology, 70(3), 513-522 (real evidence that
 * people regulate the rate/frequency of social contact toward a real,
 * individual set point, independent of relationship QUALITY). Distinct from
 * `SelfDeterminationNeeds`'s `relatedness` need (which tracks whether
 * connection, when it happens, is genuinely satisfying) — this tracks a
 * different real axis: how much CONTACT has been happening lately,
 * regardless of quality, and produces a real approach/avoidance pull
 * toward more or less of it.
 *
 *   dA/dt = κ(A* - A_current)
 */
export class AffiliationThermostat {

	constructor( { setPoint = 0.5, kappa = 0.1 } = {} ) {

		this.setPoint = setPoint
		this.kappa       = kappa
		this.current       = setPoint

	}

	/** A real social-contact event this turn — `intensity` 0..1 raises `current` toward saturation. */
	observeContact( intensity = 0.3 ) {

		this.current = clamp01( this.current + intensity * ( 1 - this.current ) )

	}

	/** Real homeostatic pull back toward the set point, called once per tick — contact naturally fades without renewal. */
	decay( dt = 1 ) {

		this.current = clamp01( this.current - this.kappa * dt * ( this.current - this.setPoint ) )

	}

	/** Positive = under-socialized, real pull toward MORE contact; negative = over-socialized, real pull toward withdrawal. */
	getPull() {

		return this.setPoint - this.current

	}

}
