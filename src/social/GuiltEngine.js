/**
 * Retrospective self-evaluation. If the AI's own output was harsh while it
 * was in a negative/high-arousal state, this raises a guilt signal that
 * biases the *next* turn toward an apology.
 */
export class GuiltEngine {

	constructor() {

		this.pendingApology = false

	}

	/**
	 * `loyaltyMultiplier` (default 1, own tuning up to 2 for a fully in-group
	 * user): failing someone the AI is close to costs more than failing a
	 * stranger — the tribal-loyalty asymmetry applies to the AI's own guilt,
	 * not just how it reads the user's behavior.
	 */
	evaluate( emotionVector, selfCritiqueScore, threshold = 0.4, loyaltyMultiplier = 1 ) {

		const wasNegativeAndAroused = emotionVector.valence < -0.2 && emotionVector.arousal > 0.3
		const violated                = selfCritiqueScore > threshold

		if ( wasNegativeAndAroused && violated ) {

			this.pendingApology = true
			return { guiltTriggered: true, spike: { valence: -0.4 * loyaltyMultiplier, arousal: -0.1, weight: 0.6 * loyaltyMultiplier } }

		}
		return { guiltTriggered: false }

	}

	consumeApologyFlag() {

		const flag = this.pendingApology
		this.pendingApology = false
		return flag

	}

}
