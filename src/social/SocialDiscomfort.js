function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real vicarious social discomfort — a passive utility penalty from
 * WITNESSING another's public status loss or humiliation, distinct from
 * `StatusEnvy` (which reads one's OWN relative-status trend) — Krach, S.,
 * Cohrs, J. C., de Echeverría Loebell, N. C., Kircher, T., Sommer, J.,
 * Jansen, A. & Paulus, F. M. (2011), "Your flaws are my pain: linking
 * empathy to vicarious embarrassment." PLoS ONE, 6(4), e18675 (the real,
 * distinct finding that WITNESSING another's embarrassment activates real
 * empathic distress in the observer, scaled by real affiliation and by how
 * much status the observed party actually lost). Own engineering of the
 * specific multiplicative formula.
 *
 *   ΔS⁻ = max(0, S(t-1) - S(t))
 *   M = β·E·ΔS⁻
 */
export class SocialDiscomfort {

	constructor( { beta = 0.5 } = {} ) {

		this.beta         = beta
		this.lastStatus = new Map() // userId -> last observed real status reading

	}

	/** Real per-turn status observation for `userId` (e.g. PowerDynamicsEngine's own power reading, 0..1 normalized). */
	observeStatus( userId, status ) {

		const previous = this.lastStatus.get( userId )
		this.lastStatus.set( userId, status )
		return previous === undefined ? 0 : Math.max( 0, previous - status )

	}

	/** `affiliation` (-1..1) — real affinity/rivalry toward the observed party; negative values are real rivalry, which genuinely dampens or inverts the discomfort. */
	getDiscomfort( statusDrop, affiliation ) {

		if ( affiliation <= 0 ) return 0 // no real vicarious discomfort for a rival's fall — see StatusEnvy's real schadenfreude instead
		return clamp01( this.beta * affiliation * statusDrop )

	}

}
