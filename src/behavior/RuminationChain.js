/**
 * Real (small, discrete) Markov chain over 3 mood states {negative, neutral,
 * positive} with an attractor well on `negative` when rumination is active:
 * the transition matrix gives a high self-loop probability (p > 0.9) for
 * staying in the negative state once there, versus a much lower self-loop
 * for neutral/positive — a negative thought loop is "sticky" the way real
 * rumination is, rather than a simple additive decay. Activated during
 * `idle()` when the mood is already negative, giving IdleProcessing a
 * genuine chance of *staying* stuck instead of drifting back to baseline.
 */
function pickState( probabilities ) {

	const roll = Math.random()
	let acc      = 0
	for ( const [ state, p ] of Object.entries( probabilities ) ) {

		acc += p
		if ( roll <= acc ) return state

	}
	return Object.keys( probabilities )[ 0 ]

}

const TRANSITION_MATRIX = {
	negative : { negative: 0.92, neutral: 0.07, positive: 0.01 },
	neutral  : { negative: 0.2, neutral: 0.6, positive: 0.2 },
	positive : { negative: 0.05, neutral: 0.25, positive: 0.7 },
}

export class RuminationChain {

	constructor() {

		this.state       = 'neutral'
		this.negativeBias = 0

	}

	/** Seed the chain's current state from a real mood valence reading. */
	sync( moodValence ) {

		this.state = moodValence < -0.2 ? 'negative' : moodValence > 0.2 ? 'positive' : 'neutral'

	}

	/**
	 * Raises rumination proneness for a while — the "Echo" life-event area's real hook:
	 * an Echo-tagged event (e.g. discovering a partner's lie) doesn't just spike the mood
	 * once, it makes getting stuck in the negative attractor more likely for a while after.
	 * Reallocates real probability mass from {neutral, positive} into {negative} in every
	 * row of the transition matrix, proportional to `amount`, keeping each row a valid
	 * distribution (sums to 1) rather than just adding an unnormalized nudge.
	 */
	biasTowardNegative( amount ) {

		this.negativeBias = Math.min( 1, this.negativeBias + Math.max( 0, amount ) )

	}

	/** Exponential decay of the bias — same shape as CortisolEngine/Sensitization, own tuning. */
	decayBias( dt, lambda = 0.05 ) {

		this.negativeBias = Math.max( 0, this.negativeBias - lambda * dt )

	}

	#biasedRow( state ) {

		const base = TRANSITION_MATRIX[ state ]
		if ( this.negativeBias <= 0 ) return base

		const negative     = base.negative + this.negativeBias * ( 1 - base.negative )
		const remainder      = 1 - negative
		const restSum          = base.neutral + base.positive
		const scale               = restSum > 0 ? remainder / restSum : 0

		return { negative, neutral: base.neutral * scale, positive: base.positive * scale }

	}

	/** One Markov step. Returns the new state and a small valence/arousal nudge to apply if ruminating. */
	step() {

		this.state = pickState( this.#biasedRow( this.state ) )

		if ( this.state === 'negative' ) return { state: this.state, spike: { valence: -0.05, arousal: 0.03 } }
		if ( this.state === 'positive' ) return { state: this.state, spike: { valence: 0.03, arousal: 0.01 } }
		return { state: this.state, spike: { valence: 0, arousal: 0 } }

	}

}
