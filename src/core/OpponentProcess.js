function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Opponent-process theory of acquired motivation (Solomon, R. L., & Corbit,
 * J. D. (1974), "An opponent-process theory of motivation: I. Temporal
 * dynamics of affect", Psychological Review, 81(2), 119-145): a strong
 * hedonic event (the "a-process") is automatically followed by an opposite-
 * valence "b-process" that undershoots baseline once the a-process ends —
 * and with REPEATED exposure, the a-process habituates (tolerance) while the
 * b-process grows and lasts longer (withdrawal), literally the theory's
 * central claim. Modeled directly as those two real trends, keyed by the
 * same fingerprint idea HedonicAdaptation already uses for a repeated
 * stimulus.
 */
export class OpponentProcess {

	constructor( { baseB = 0.3, growthRate = 0.15, aHabituationRate = 0.08 } = {} ) {

		this.baseB              = baseB
		this.growthRate        = growthRate
		this.aHabituationRate = aHabituationRate
		this.exposures            = new Map() // fingerprint -> exposureCount

	}

	/**
	 * `peakValence` — the real magnitude of this hedonic spike (already
	 * computed elsewhere). Returns the real, GROWING after-effect (undershoot,
	 * opposite sign) the caller should apply as a spike shortly after, and the
	 * HABITUATED (shrinking) magnitude the a-process itself should actually
	 * be felt at this time around.
	 */
	trigger( fingerprint, peakValence ) {

		const exposureCount = ( this.exposures.get( fingerprint ) ?? 0 ) + 1
		this.exposures.set( fingerprint, exposureCount )

		const habituatedPeak = peakValence / ( 1 + this.aHabituationRate * ( exposureCount - 1 ) )
		const bMagnitude          = this.baseB * ( 1 + this.growthRate * ( exposureCount - 1 ) )
		const afterEffectValence = -Math.sign( peakValence ) * clamp01( Math.abs( peakValence ) * bMagnitude )

		return { exposureCount, habituatedPeak, afterEffectValence }

	}

	getExposureCount( fingerprint ) {

		return this.exposures.get( fingerprint ) ?? 0

	}

}
