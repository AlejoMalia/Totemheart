function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Psychological time as its own real variable, distinct from wall-clock dt.
 * Two well-supported directions from the time-perception literature, both
 * modeled here as a real dt-multiplier applied on top of the caller's raw dt
 * (decay, rumination frequency, REM pressure all consume this multiplied
 * value instead of raw dt):
 *
 * High arousal/threat DENSIFIES subjective time — real duration judgments
 * lengthen retrospectively under fear/high arousal (Stetson, C., Fiesta, M. P.,
 * & Eagleman, D. M. (2007), "Does time really slow down during a frightening
 * event?", PLoS ONE, 2(12), e1295), which this models as MORE subjective
 * time elapsing per real tick while aroused — rumination and decay both
 * process more "felt" time per real turn during a hijack.
 *
 * Boredom/satiation also STRETCHES subjective time — the classic "time
 * drags" experience under low-stimulation monotony (Zakay, D., & Block, R. A.
 * (1997), "Temporal cognition", Current Directions in Psychological Science,
 * 6(1), 12-16, on attention-to-time models of duration judgment: more
 * attention allocated to the passage of time itself, whether from
 * hypervigilant threat-monitoring or from having nothing else to attend to,
 * lengthens the subjective estimate). Both routes land on the SAME real
 * outcome (more felt time per real tick, not opposite signs) — what differs
 * between them is the cause, not the direction.
 */
export class SubjectiveTimeEngine {

	constructor( { arousalGain = 1.5, boredomGain = 0.6 } = {} ) {

		this.arousalGain = arousalGain
		this.boredomGain  = boredomGain

	}

	/** `arousal` (0..1, above-baseline reading) and `boredomLevel` (0..1, e.g. TopicSatiation's own scalar) are both real signals this engine only combines, not invents. */
	getSubjectiveDtMultiplier( arousal = 0, boredomLevel = 0 ) {

		const densify = clamp01( arousal ) * this.arousalGain
		const stretch  = clamp01( boredomLevel ) * this.boredomGain

		// Both forces push in the same direction (more felt time per real tick) —
		// densification and stretching are two real routes to the same
		// subjective outcome (time "feels longer"), not opposites here; what
		// differs between them is what they're driven by, not their sign.
		return Math.max( 0.1, 1 + densify + stretch )

	}

}
