function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Actively CHOOSES a real regulation strategy each turn, rather than always
 * running the same fixed suppression pipeline — real strategy taxonomy from
 * Gross's process model of emotion regulation (Gross, J. J. (1998), "The
 * emerging field of emotion regulation: An integrative review", Review of
 * General Psychology, 2(3), 271-299; Gross, J. J., & John, O. P. (2003),
 * "Individual differences in two emotion regulation processes:
 * Implications for affect, relationships, and well-being", Journal of
 * Personality and Social Psychology, 85(2), 348-362, on reappraisal vs.
 * suppression specifically differing in real downstream cost/effectiveness,
 * the direction this module's own base costs are tuned to match). The
 * argmax selection and specific cost/benefit numbers are own engineering,
 * not a computational reproduction of Gross's model.
 *
 *   Cost_i = base_cost_i · (1 + ego_depletion)
 *   Benefit_i = expected_reduction_i · strategy_fit_i
 *   Selected = argmax(Benefit_i − Cost_i · Conscientiousness)
 */
const BASE_COST = {
	reappraisal : 0.35, // real cognitive-effort cost — the most expensive up front, but Gross & John found it the most effective long-run
	suppression : 0.15, // cheap in the moment, real downstream cost lives elsewhere (ExpressionDebt's suppression-cost reservoir)
	distraction : 0.1,  // cheapest, least durable
}

export class RegulationStrategySelector {

	getStrategies() {

		return Object.keys( BASE_COST )

	}

	computeCost( strategy, egoDepletion = 0 ) {

		return ( BASE_COST[ strategy ] ?? 0.2 ) * ( 1 + clamp01( egoDepletion ) )

	}

	computeBenefit( expectedReduction, strategyFit ) {

		return clamp01( expectedReduction ) * clamp01( strategyFit )

	}

	/**
	 * `strategyFits` — real `{ reappraisal, suppression, distraction }` map,
	 * 0..1 how well each strategy fits THIS situation (caller-supplied — e.g.
	 * reappraisal fits low-arousal ambiguous situations better than a
	 * full-blown hijack). `expectedReduction` — how much distress this turn's
	 * regulation could realistically remove (0..1). Personality: Conscientiousness
	 * weighs cost more heavily (a disciplined mind won't reach for the cheap
	 * option just because it's cheap, real cost-benefit deliberation);
	 * Neuroticism biases toward suppression's real lower up-front cost;
	 * Openness biases toward reappraisal's real cognitive-flexibility demand.
	 */
	select( strategyFits, { expectedReduction = 0.5, egoDepletion = 0, conscientiousness = 0.5, neuroticism = 0.5, openness = 0.5 } = {} ) {

		const personalityBias = {
			reappraisal : 1 + clamp01( openness ) * 0.3,
			suppression : 1 + clamp01( neuroticism ) * 0.3,
			distraction : 1,
		}

		let selected      = null
		let bestScore     = -Infinity
		const scores          = {}

		for ( const strategy of this.getStrategies() ) {

			const fit         = strategyFits[ strategy ] ?? 0
			const cost         = this.computeCost( strategy, egoDepletion )
			const benefit    = this.computeBenefit( expectedReduction, fit ) * personalityBias[ strategy ]
			const score        = benefit - cost * clamp01( conscientiousness )

			scores[ strategy ] = score
			if ( score > bestScore ) { bestScore = score; selected = strategy }

		}

		return { selected, scores, cost: this.computeCost( selected, egoDepletion ) }

	}

}
