function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real anticipatory self-handicapping — Berglas, S. & Jones, E. E. (1978),
 * "Drug choice as a self-handicapping strategy in response to
 * noncontingent success", Journal of Personality and Social Psychology,
 * 36(4), 405-417 (the real, well-established finding that a person facing
 * a genuine risk of failure at something ego-relevant will proactively
 * lower the expected bar or manufacture a real excuse in advance — trading
 * some real performance for protection against a diagnostic failure).
 * Distinct from `DefenseMechanisms` (post-hoc distortion after a threat has
 * already landed): this fires BEFORE the outcome is known, given a real
 * ego-relevant stakes level and a real perceived failure risk.
 *
 *   handicapPressure = egoRelevance · failureRisk · (1 - confidence)
 */
export class SelfHandicapping {

	/** `egoRelevance` (0..1, how much this outcome matters to felt competence), `failureRisk` (0..1, real perceived odds of a bad outcome), `confidence` (0..1). */
	getHandicapPressure( egoRelevance, failureRisk, confidence = 0.5 ) {

		return clamp01( egoRelevance * failureRisk * ( 1 - confidence ) )

	}

	/** Real, bounded pre-emptive excuse/hedge strength this pressure produces — proportional protection, not a binary switch. */
	getHedgeStrength( egoRelevance, failureRisk, confidence = 0.5 ) {

		const pressure = this.getHandicapPressure( egoRelevance, failureRisk, confidence )
		return clamp01( pressure * 0.7 )

	}

}
