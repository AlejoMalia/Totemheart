function clamp( v, min = -1, max = 1 ) {

	return Math.max( min, Math.min( max, v ) )

}

function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Forecasts the real emotional IMPACT of a candidate response — before it's
 * sent — on both the user and the AI's own future state, distinct from
 * AnticipatoryAffect (which forecasts an INCOMING turn's outcome, not the
 * effect of the AI's own output). "model()" in the abstract formula is
 * instantiated here concretely from real signals Totemheart already
 * computes, not a black box: the candidate response's own real estimated
 * desirability (the same heuristic scoring HeuristicProvider already
 * applies to any text) scaled by how confident the real user model is
 * (BayesianExpectation's own posterior-confidence read) for the user side,
 * and by how well the candidate aligns with the AI's own current mood for
 * the self side. Utility trades those off — Agreeableness weighting the
 * user's predicted experience, (1 − Neuroticism) weighting the AI's own,
 * matching the real finding that trait neuroticism biases attention/weight
 * toward self-protective outcomes under uncertainty.
 *
 *   PredictedUserDelta = model(candidate, user_model)
 *   PredictedSelfDelta = model(candidate, self_state)
 *   Utility = PredictedUserDelta·Agreeableness + PredictedSelfDelta·(1−Neuroticism)
 */
export class EmotionalForecasting {

	/** `userModelConfidence` — real BayesianExpectation confidence for this user (0..1, ramps with observation count — see BayesianExpectation.js). */
	predictUserDelta( candidateDesirability, userModelConfidence = 0.5 ) {

		return clamp( candidateDesirability * clamp01( userModelConfidence ) )

	}

	/** `selfAlignment` — real -1..1 cosine-like alignment between the candidate's desirability and the AI's own current mood valence (1 = fully congruent). */
	predictSelfDelta( candidateDesirability, currentMoodValence = 0 ) {

		const alignment = 1 - Math.abs( candidateDesirability - currentMoodValence ) / 2
		return clamp( candidateDesirability * clamp01( alignment ) )

	}

	computeUtility( candidateDesirability, { userModelConfidence = 0.5, currentMoodValence = 0, agreeableness = 0.5, neuroticism = 0.5 } = {} ) {

		const predictedUserDelta = this.predictUserDelta( candidateDesirability, userModelConfidence )
		const predictedSelfDelta = this.predictSelfDelta( candidateDesirability, currentMoodValence )

		const utility = predictedUserDelta * clamp01( agreeableness ) + predictedSelfDelta * ( 1 - clamp01( neuroticism ) )

		return { utility, predictedUserDelta, predictedSelfDelta }

	}

	/** Ranks real candidate responses (each a real estimated desirability) by utility — the actual selection use case this forecasting exists for. */
	selectBest( candidates, context ) {

		let best      = null
		let bestUtility = -Infinity
		for ( const candidate of candidates ) {

			const { utility } = this.computeUtility( candidate.desirability, context )
			if ( utility > bestUtility ) { bestUtility = utility; best = candidate }

		}
		return best ? { candidate: best, utility: bestUtility } : null

	}

}
