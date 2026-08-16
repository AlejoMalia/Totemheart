/**
 * Transient emotion spikes computed from an appraisal of the current input.
 * Short-lived by nature — DecayEngine pulls them back toward the mood
 * baseline over subsequent ticks, they are not meant to persist on their own.
 */
export class MicroEmotions {

	generate( appraisal, dissonanceScore = 0, hedonicMultiplier = 1 ) {

		const desirability = appraisal?.desirability ?? 0
		const moralWeight   = appraisal?.moralWeight ?? 0

		const deltaValence = desirability * hedonicMultiplier - dissonanceScore * 0.4
		const deltaArousal = ( Math.abs( desirability ) * 0.6 + moralWeight * 0.3 + dissonanceScore * 0.5 ) * hedonicMultiplier

		return {
			valence : deltaValence,
			arousal : deltaArousal,
			weight  : 1,
			agency  : appraisal?.agency ?? 'other',
		}

	}

}
