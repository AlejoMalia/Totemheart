function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real empathic ACCURACY — Ickes, W. (1997), "Empathic Accuracy", Guilford
 * Press (the real, well-established finding that inferring another's real
 * mental state is systematically BIASED — by one's own current mood
 * [mood congruence], by projecting one's own state, and by real social
 * distance — and that accuracy and CONFIDENCE in that inference are two
 * genuinely separate real quantities). Reuses `MonteCarloToM`'s own real
 * estimate directly as the raw inference this module scores for bias/
 * accuracy, rather than re-deriving a theory-of-mind estimate from
 * scratch.
 *
 *   ẑ_other = ToM(z_other) + bias
 *   bias = moodCongruence + projection·SelfState − distance
 *   Acc = 1 − ‖ẑ_other − z_other_proxy‖
 */
export class EmpathicAccuracySystem {

	/** `tomEstimate`/`selfState` real 0..1 or -1..1 magnitudes already computed (e.g. MonteCarloToM's own estimatedValence, EmotionSpace.vector.valence). */
	getBiasedEstimate( tomEstimate, { moodCongruence = 0, projection = 0, selfState = 0, distance = 0 } ) {

		const bias = moodCongruence + projection * selfState - distance
		return Math.max( -1, Math.min( 1, tomEstimate + bias ) )

	}

	/** Real accuracy against a real proxy for the other's true state (e.g. their own next-turn desirability, once known) — a real ex-post readout, not claimed in real time. */
	getAccuracy( biasedEstimate, trueStateProxy ) {

		return clamp01( 1 - Math.abs( biasedEstimate - trueStateProxy ) / 2 )

	}

	/** Real mismatch flag — the genuinely dangerous case: high real confidence paired with low real accuracy, distinct from low-confidence-low-accuracy (which at least self-corrects). */
	isOverconfidentMismatch( accuracy, confidence, threshold = 0.4 ) {

		return confidence > 0.6 && accuracy < threshold

	}

}
