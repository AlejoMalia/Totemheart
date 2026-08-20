function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real anticipated regret — Zeelenberg, M. (1999), "Anticipated regret,
 * expected feedback and behavioral decision making", Journal of Behavioral
 * Decision Making, 12(2), 93-106 (the real, well-established finding that
 * decisions are genuinely biased by imagining a FUTURE regretful self, not
 * just by weighing present reward against present risk). Distinct from
 * `CounterfactualComparison` (a real RETROSPECTIVE "how would gentler have
 * landed" check on an action already taken) — this is scoped to a real
 * PROSPECTIVE brake applied before a decision.
 *
 *   U(a) = R_now(a) − λ·E[Regret(a)] − β·Risk(a)
 *   E[Regret(a)] = P(bad|a)·Severity·SelfRelevance
 */
export class AnticipatedRegretEngine {

	constructor( { lambda = 1, beta = 0.5 } = {} ) {

		this.lambda = lambda
		this.beta      = beta

	}

	getExpectedRegret( pBad, severity, selfRelevance ) {

		return clamp01( pBad ) * clamp01( severity ) * clamp01( selfRelevance )

	}

	getUtility( rewardNow, expectedRegret, risk ) {

		return rewardNow - this.lambda * clamp01( expectedRegret ) - this.beta * clamp01( risk )

	}

	/** Real, bounded dampener for YieldController's own P(yield) — a real, distinct brake on top of guilt/commitment, not a duplicate of either. */
	getYieldDampening( expectedRegret ) {

		return clamp01( expectedRegret ) * 0.5

	}

}
