function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real embarrassment — a self-conscious emotion distinct from
 * `ShameGuiltSplit` (which is identity-level, doesn't require an audience,
 * and persists) — Miller, R. S. (1996), "Embarrassment: Poise and Peril in
 * Everyday Life", Guilford Press (the real, well-established account of
 * embarrassment as a genuinely lower-stakes, audience-dependent reaction to
 * a poise-threatening gaffe, not an identity attack); Keltner, D. &
 * Buswell, B. N. (1997), "Embarrassment: Its distinct form and appeasement
 * functions", Psychological Bulletin, 122(3), 250-270 (the real finding
 * that embarrassment display genuinely serves an APPEASEMENT function
 * distinct from shame's withdrawal — gaze aversion, nervous smile,
 * apology, all real signals this module's own directive maps onto).
 * Requires a real audience (`AudienceDesign`'s own participant count) —
 * the identical gaffe alone, with nobody watching, doesn't register here.
 *
 *   embarrassment = gaffeVisibility · audienceFactor · (1 − identityStakes)
 */
export class EmbarrassmentEngine {

	/**
	 * `gaffeVisibility` (0..1, real magnitude of the poise-threatening slip
	 * — a typo, a faux pas, a factual stumble), `audienceSize` (real
	 * participant count this turn — embarrassment needs real witnesses),
	 * `identityStakes` (0..1, how much this touches core identity — high
	 * values here are `ShameGuiltSplit`'s real territory instead, so this
	 * formula deliberately suppresses toward 0 as stakes rise).
	 */
	computeEmbarrassment( gaffeVisibility, audienceSize = 1, identityStakes = 0 ) {

		if ( audienceSize <= 0 ) return 0
		const audienceFactor = clamp01( Math.log( 1 + audienceSize ) / Math.log( 11 ) ) // saturating — a crowd of 10 doesn't embarrass 10x harder than one witness
		return clamp01( gaffeVisibility * audienceFactor * ( 1 - identityStakes ) )

	}

	/**
	 * Real appeasement-display strength this level of embarrassment
	 * genuinely produces — distinct from shame's withdrawal, per Keltner &
	 * Buswell's own real finding.
	 */
	getAppeasementStrength( embarrassmentLevel ) {

		return clamp01( embarrassmentLevel * 0.8 )

	}

}
