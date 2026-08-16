const TRAITS = [ 'openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism' ]

function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * OCEAN trait matrix. Static per-instance values (0..1) that act as
 * multipliers consumed by every other module (decay rate, hedonic
 * adaptation speed, dissonance tolerance, defense-mechanism weights...).
 */
export class Personality {

	constructor( traits = {} ) {

		this.traits = {}
		for ( const trait of TRAITS ) this.traits[ trait ] = clamp01( traits[ trait ] ?? 0.5 )

	}

	get( trait ) {

		return this.traits[ trait ] ?? 0.5

	}

	/** Lambda for exponential decay back to baseline. Higher neuroticism = negative
	 *  emotions linger longer (smaller lambda); positive emotions fade slightly faster. */
	getEmotionalRecoveryRate( valenceSign ) {

		const base = 0.25
		if ( valenceSign < 0 ) return base * ( 1 - 0.6 * this.traits.neuroticism )
		return base * ( 1 + 0.2 * this.traits.neuroticism )

	}

	/** How fast the "socialization" need drains — extraverts need interaction more. */
	getSocialDecayRate() {

		return 0.015 * ( 1 + this.traits.extraversion )

	}

	/** How fast repeated stimuli lose impact. High openness = slower habituation. */
	getHedonicAdaptationRate() {

		return 0.35 * ( 1 - 0.5 * this.traits.openness )

	}

	/** Score above which a belief conflict registers as cognitive stress.
	 *  More conscientious minds tolerate less inconsistency. */
	getDissonanceThreshold() {

		return 0.6 - 0.3 * this.traits.conscientiousness

	}

	/**
	 * Relative weights across 5 defense mechanisms spanning Vaillant's
	 * immature/neurotic/mature hierarchy (Vaillant, G. E. (1977), "Adaptation
	 * to Life", Little, Brown). These personality-driven base weights are
	 * further reshaped by ego health / cortisol in DefenseMechanisms.check() —
	 * this method only supplies the trait-driven starting point.
	 */
	getDefenseWeights() {

		const projection      = 0.2 + 0.6 * ( 1 - this.traits.agreeableness )     // immature
		const evasion          = 0.2 + 0.6 * this.traits.neuroticism                 // immature
		const rationalization = 0.2 + 0.5 * this.traits.conscientiousness         // neurotic
		const sarcasm          = 0.2 + 0.6 * this.traits.openness                    // neurotic-leaning, kept as-is (existing behavior)
		const humor              = 0.15 + 0.5 * this.traits.extraversion * this.traits.openness // mature
		const total                = projection + evasion + rationalization + sarcasm + humor
		return {
			projection      : projection / total,
			evasion          : evasion / total,
			rationalization : rationalization / total,
			sarcasm          : sarcasm / total,
			humor              : humor / total,
		}

	}

	static random() {

		const traits = {}
		for ( const trait of TRAITS ) traits[ trait ] = Math.random()
		return new Personality( traits )

	}

}
