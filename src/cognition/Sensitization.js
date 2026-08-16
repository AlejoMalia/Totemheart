/**
 * Repeated negative stimuli lower the firing threshold for the next one — a
 * real (if simplified) analogue of long-term potentiation strengthening a
 * pathway with repeated activation: the more a negative-valence spike has
 * fired recently, the less it takes to fire again. Concretely: a running
 * "sensitized" level that rises on each negative spike and decays over
 * ticks, exposed as a threshold multiplier consumers (AmygdalaHijack,
 * CortisolEngine) can apply to become more trigger-happy under a recent run
 * of negative stimuli — i.e. irritability. Engineering approximation of LTP,
 * not a spiking-neural-network simulation — see CALIBRATION.md.
 */
function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

export class Sensitization {

	constructor() {

		this.level = 0

	}

	observe( valence ) {

		if ( valence < -0.15 ) this.level = clamp01( this.level + Math.abs( valence ) * 0.2 )

	}

	decay( dt, lambda = 0.05 ) {

		this.level = Math.max( 0, this.level - lambda * dt )

	}

	/** <1 = fires more easily (sensitized/irritable). */
	getThresholdMultiplier() {

		return 1 - this.level * 0.3

	}

}
