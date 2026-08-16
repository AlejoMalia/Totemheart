function clamp( v, min = -1, max = 1 ) {

	return Math.max( min, Math.min( max, v ) )

}

function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real emotions ABOUT the primary emotion — shame at feeling angry, pride
 * at having stayed calm — a genuinely different signal from the primary
 * emotion itself (Gottman, J. M., Katz, L. F., & Hooven, C. (1996),
 * "Parental meta-emotion philosophy and the emotional life of families",
 * Journal of Family Psychology, 10(3), 243-268 — the actual term
 * "meta-emotion" and the idea of real evaluative beliefs about one's own
 * emotions originates here; Mayer, J. D., & Salovey, P. (1997), "What is
 * emotional intelligence?", in Salovey & Sluyter (eds.), Emotional
 * Development and Emotional Intelligence, Basic Books, on regulating and
 * reflecting on emotion as its own real cognitive process).
 *
 *   MetaValence = f(primary_emotion, personal_standards)
 *   MetaArousal = |primary_arousal − expected_arousal|
 */
export class MetaEmotionLayer {

	/**
	 * `personalStandardValence` — a real reference the caller supplies (e.g. a
	 * CoreBeliefs-derived "I should stay composed" reads as a standard near 0
	 * or positive; own convention, not invented per-agent). `conscientiousness`
	 * scales how sharply a deviation from that standard is FELT (a real
	 * standards-sensitivity multiplier).
	 */
	evaluateMetaValence( primaryValence, personalStandardValence = 0, conscientiousness = 0.5 ) {

		const deviation   = Math.abs( primaryValence - personalStandardValence )
		const sensitivity = 0.5 + clamp01( conscientiousness ) * 0.5
		return clamp( ( 1 - deviation ) * sensitivity ) // aligned with the standard -> positive (pride); deviates -> negative (shame/guilt about the primary emotion)

	}

	/** Real surprise about one's own arousal level — the same |innovation| shape ArousalKalmanFilter already uses, applied here to a DELIBERATE expectation instead of a filter estimate. */
	evaluateMetaArousal( primaryArousal, expectedArousal = 0.5 ) {

		return clamp01( Math.abs( primaryArousal - expectedArousal ) )

	}

	/** Neuroticism biases an already-negative meta-valence reading further negative — the real "feeling bad about feeling bad" amplification loop. */
	applyNeuroticismBias( metaValence, neuroticism = 0.5 ) {

		if ( metaValence >= 0 ) return metaValence
		return clamp( metaValence * ( 1 + clamp01( neuroticism ) * 0.5 ) )

	}

	/** Openness turns real meta-arousal (surprise about one's own state) into a real curiosity signal instead of pure discomfort — feeds e.g. SelfModel/Intuition's own observation calls. */
	getMetaCuriosity( metaArousal, openness = 0.5 ) {

		return clamp01( metaArousal * clamp01( openness ) )

	}

}
