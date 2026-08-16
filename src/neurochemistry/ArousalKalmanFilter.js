/**
 * Real scalar Kalman filter smoothing the arousal signal: predict, then
 * correct with each new noisy observation. Standard discrete 1D form
 * (no control input, constant-velocity-free — a static-state model, since
 * "true" arousal isn't assumed to follow known dynamics):
 *   predict:  x̂⁻ = x̂,  P⁻ = P + Q
 *   update:   K = P⁻ / (P⁻ + R),  x̂ = x̂⁻ + K(z − x̂⁻),  P = (1 − K)P⁻
 * Q = process noise (how much we trust arousal drifts on its own between
 * observations), R = measurement noise (how noisy a single turn's raw
 * arousal spike is as a signal of the "true" underlying activation level).
 */
export class ArousalKalmanFilter {

	constructor( { processNoise = 0.01, measurementNoise = 0.1, initial = 0 } = {} ) {

		this.q         = processNoise
		this.r         = measurementNoise
		this.estimate = initial
		this.errorCovariance = 1

	}

	/**
	 * Feed a raw (noisy) arousal observation, get back the smoothed estimate.
	 * `noiseMultiplier` (optional, default 1) lets a caller genuinely inform
	 * R per-observation from real interoceptive signals instead of a fixed
	 * constant: InteroceptiveSignals' attentional-narrowing/novelty reading is
	 * evidence THIS measurement is more likely a real signal than noise (a
	 * surprising, attention-grabbing spike), so it can pass a multiplier < 1
	 * (trust this one more); a high-threat/erratic-load reading is evidence
	 * the raw signal itself is noisier right now, so it can pass > 1 (trust it
	 * less). Same filter equations, R just isn't a hardcoded constant anymore.
	 */
	filter( measurement, noiseMultiplier = 1 ) {

		// Predict
		const predictedEstimate  = this.estimate
		const predictedCovariance = this.errorCovariance + this.q

		// Update
		const effectiveR   = Math.max( 0.001, this.r * noiseMultiplier )
		const kalmanGain = predictedCovariance / ( predictedCovariance + effectiveR )
		this.estimate          = predictedEstimate + kalmanGain * ( measurement - predictedEstimate )
		this.errorCovariance   = ( 1 - kalmanGain ) * predictedCovariance

		return this.estimate

	}

}
