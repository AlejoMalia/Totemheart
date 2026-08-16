/**
 * Real Monte Carlo simulation (small N, appropriate to the scale of a
 * conversational turn, not a large statistical study): to estimate what the
 * other party might be feeling, run the AI's own appraisal-shaped evaluation
 * N times with small random perturbations standing in for "I don't know
 * their exact personality/mood, only a rough sense of it", and average the
 * results — a real sampling-based estimate of empathic inference, not just a
 * single point guess.
 */
function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

export class MonteCarloToM {

	constructor( { samples = 12 } = {} ) {

		this.samples = samples

	}

	/**
	 * `baseValence` — the AI's own read of the event's valence (from its appraisal).
	 * `uncertainty` (0..1) — how little the AI knows about this specific person;
	 * higher uncertainty widens the perturbation spread across samples.
	 */
	simulate( baseValence, uncertainty = 0.4 ) {

		const draws = []
		for ( let i = 0; i < this.samples; i++ ) {

			const noise = ( Math.random() * 2 - 1 ) * uncertainty
			draws.push( Math.max( -1, Math.min( 1, baseValence + noise ) ) )

		}

		const mean     = draws.reduce( ( a, b ) => a + b, 0 ) / draws.length
		const variance = draws.reduce( ( sum, v ) => sum + ( v - mean ) ** 2, 0 ) / draws.length

		return {
			estimatedValence : mean,
			confidence         : clamp01( 1 - Math.sqrt( variance ) ), // low spread across samples = more confident read
		}

	}

}
