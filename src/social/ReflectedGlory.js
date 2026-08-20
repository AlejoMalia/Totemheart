function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real BIRGing/CORFing — Basking In Reflected Glory / Cutting Off Reflected
 * Failure — Cialdini, R. B., Borden, R. J., Thorne, A., Walker, M. R.,
 * Freeman, S. & Sloan, L. R. (1976), "Basking in reflected glory: Three
 * (football) field studies", Journal of Personality and Social Psychology,
 * 34(3), 366-375 (the real, classic, well-replicated finding that people
 * genuinely feel pride from an in-group's success and genuinely distance
 * themselves from an in-group's failure, even with zero personal causal
 * contribution — building on the social-identity in-group/out-group
 * machinery `TribalCategorization.js` already tracks elsewhere). Distinct
 * from `StatusEnvy`'s schadenfreude (which is about a RIVAL's misfortune)
 * and from ordinary personal achievement pride: this fires from an
 * IN-GROUP member's own outcome, scaled by real group identification, not
 * from anything the AI itself did.
 *
 *   reflectedAffect = groupIdentification · outcomeValence · publicness
 */
export class ReflectedGlory {

	/**
	 * `groupIdentification` (0..1, real strength of in-group tie to whoever
	 * had the outcome — e.g. `TribalCategorization`'s own in-group read),
	 * `outcomeValence` (-1..1, real magnitude/sign of the in-group member's
	 * own success or failure), `publicness` (0..1, real how visible/known
	 * this outcome is — BIRGing is stronger when there's a real audience to
	 * bask in front of).
	 */
	evaluate( groupIdentification, outcomeValence, publicness = 0.5 ) {

		const magnitude = clamp01( groupIdentification ) * Math.abs( outcomeValence ) * clamp01( publicness )
		const basking      = outcomeValence > 0 ? magnitude : 0 // BIRGing — real pride from in-group success
		const cuttingOff = outcomeValence < 0 ? magnitude * 0.6 : 0 // CORFing — real, genuinely DAMPENED distancing pull from in-group failure (own tuning: people cut off failure less eagerly than they claim success)
		return { basking, cuttingOff, netAffect: basking - cuttingOff }

	}

}
