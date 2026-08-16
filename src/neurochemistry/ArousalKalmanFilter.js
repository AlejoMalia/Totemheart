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

	/** Feed a raw (noisy) arousal observation, get back the smoothed estimate. */
	filter( measurement ) {

		// Predict
		const predictedEstimate  = this.estimate
		const predictedCovariance = this.errorCovariance + this.q

		// Update
		const kalmanGain = predictedCovariance / ( predictedCovariance + this.r )
		this.estimate          = predictedEstimate + kalmanGain * ( measurement - predictedEstimate )
		this.errorCovariance   = ( 1 - kalmanGain ) * predictedCovariance

		return this.estimate

	}

}
