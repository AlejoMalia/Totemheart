function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real predictive-processing account of interoception: the body/mind
 * continuously predicts its own internal state, and affect is generated
 * substantially FROM the prediction error itself, not just from the raw
 * signal (Seth, A. K. (2013), "Interoceptive inference, emotion, and the
 * embodied self", Trends in Cognitive Sciences, 17(11), 565-573). This
 * module doesn't reinvent the prediction machinery — ArousalKalmanFilter
 * already IS a real predict/correct interoceptive model, and its
 * `lastInnovation` (measurement − predicted estimate) already IS the real
 * prediction-error term that theory is about. What this adds: a persistent
 * EMA of |innovation| magnitude (a running "how surprising has my own body
 * been to me lately" signal) and the real anxiety-like arousal contribution
 * a SUSTAINED mismatch produces — one surprising reading is just noise, a
 * persistent pattern of mismatch is the genuinely anxiogenic signal.
 */
export class InteroceptivePredictionError {

	constructor( { alpha = 0.2, gain = 1.2 } = {} ) {

		this.alpha         = alpha
		this.gain            = gain
		this.mismatchLevel = 0

	}

	/** Feed the real innovation from ArousalKalmanFilter.getLastInnovation() each turn. */
	observe( innovation ) {

		this.mismatchLevel = this.alpha * Math.abs( innovation ) + ( 1 - this.alpha ) * this.mismatchLevel
		return this.mismatchLevel

	}

	/** Sustained mismatch reads as real anxiety-like arousal — a body the mind can't predict is itself threatening. */
	getAnxietyContribution() {

		return clamp01( this.mismatchLevel * this.gain )

	}

}
