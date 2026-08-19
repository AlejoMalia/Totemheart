function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real interoceptive ACCURACY, distinct from the raw signal itself or its
 * prediction error — Garfinkel, S. N., Seth, A. K., Barrett, A. B.,
 * Suzuki, K. & Critchley, H. D. (2015), "Knowing your own heart:
 * Distinguishing interoceptive accuracy from interoceptive awareness."
 * Biological Psychology, 104, 65-74 (the actual, well-established
 * distinction this module's name follows: accuracy is how well internal
 * state tracking matches the real internal state, a real, measurable
 * precision, not the state's magnitude). Low accuracy over time is the real
 * engineering analog of functional alexithymia (Lane, R. D. et al. (1997),
 * "Is alexithymia the emotional equivalent of blindsight?" Biological
 * Psychiatry, 42(9), 834-844) — genuinely reduced access to one's own
 * state, not absence of the state itself.
 *
 *   IA = 1 - E[|S - Ŝ|]
 */
export class InteroceptiveAwarenessGain {

	constructor( { alpha = 0.15 } = {} ) {

		this.alpha        = alpha
		this.meanError = 0 // real running mean absolute interoceptive error

	}

	/** `actual`/`predicted` — same-scale real interoceptive readings this turn (e.g. real vs. Kalman-predicted arousal). */
	observe( actual, predicted ) {

		const error = Math.abs( actual - predicted )
		this.meanError = this.alpha * error + ( 1 - this.alpha ) * this.meanError
		return this.getAccuracy()

	}

	getAccuracy() {

		return clamp01( 1 - this.meanError )

	}

	isFunctionallyAlexithymic( threshold = 0.35 ) {

		return this.getAccuracy() < threshold

	}

}
