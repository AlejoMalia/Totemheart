function clamp( v, min = -1, max = 1 ) {

	return Math.max( min, Math.min( max, v ) )

}

/**
 * Reward Prediction Error (RPE): RPE = R_t + γ·V(S_t+1) − V(S_t).
 * Dopamine doesn't fire for getting something good — it fires for getting
 * something *better than expected*. This TD-learning reading of dopaminergic
 * activity is the standard one in computational neuroscience (Schultz, W.,
 * Dayan, P., & Montague, P. R. (1997), "A neural substrate of prediction and
 * reward", Science, 275(5306), 1593-1599). V(S_t+1) here is bootstrapped from
 * the current expectation (TD(0)-style, single running estimate rather than a
 * full state-transition model — a deliberate simplification of that model,
 * not a bug). See CALIBRATION.md.
 */
export class DopaminergicEngine {

	constructor( { alpha = 0.25, gamma = 0.9 } = {} ) {

		this.alpha         = alpha
		this.gamma         = gamma
		this.expectedValue = 0

	}

	computeRPE( reward ) {

		const rpe = reward + this.gamma * this.expectedValue - this.expectedValue
		this.expectedValue += this.alpha * rpe
		return clamp( rpe, -2, 2 ) / 2 // normalize to roughly -1..1 for downstream spike use

	}

	getExpectedValue() {

		return this.expectedValue

	}

}
