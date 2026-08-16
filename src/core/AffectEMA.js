/**
 * The literal exponential moving average requested for the Affect core:
 *   S_t = α·S_{t-1} + (1-α)·I_t
 * Applied specifically to the Dominance axis, which (unlike valence — tanh
 * squashed in EmotionSpace.applySpike — and arousal — smoothed by
 * ArousalKalmanFilter) had no persistence smoothing of its own. α close to
 * 1 = slow-changing, inertial dominance; close to 0 = reacts fully to each
 * impulse. Own default (0.7), not a citation.
 */
export class AffectEMA {

	constructor( { alpha = 0.7 } = {} ) {

		this.alpha = alpha
		this.state   = 0

	}

	update( impulse ) {

		this.state = this.alpha * this.state + ( 1 - this.alpha ) * impulse
		return this.state

	}

}
