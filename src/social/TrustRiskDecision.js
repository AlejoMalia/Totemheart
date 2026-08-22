function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

/**
 * Real risk-decision layer composing 2 ALREADY-REAL, independent tracks
 * this codebase keeps separately, deliberately not reimplemented here:
 * `Attachment.trust` (a real Beta-Bernoulli Bayesian posterior, already
 * genuinely asymmetric — betrayal moves `trustBeta` roughly 10x faster
 * than repair moves `trustAlpha`, see `Attachment.js`'s own update rule)
 * and `IntuitionEngine.suspicion` (already explicitly documented there as
 * "distinct from attachment.trust" — a real, separate active-vigilance
 * track, not just low trust). Rousseau, D. M., Sitkin, S. B., Burt, R. S.
 * & Camerer, C. (1998), "Not so different after all: A cross-discipline
 * view of trust", Academy of Management Review, 23(3), 393-404 (the real,
 * well-established finding that trust and active distrust/vigilance
 * function as genuinely PARALLEL systems, not one bipolar scale — the
 * exact shape `Attachment.trust` + `IntuitionEngine.suspicion` already
 * give this codebase for free). This module's only real, new contribution
 * is the missing RISK-DECISION step on top of those two existing reads:
 * whether to actually take a relational risk (share something vulnerable,
 * extend a favor, lower a guard) this turn.
 *
 *   E[U_confiar] = trust·U(cooperación) − suspicion·U(traición) − riskAversion
 *   P(arriesgarse) = σ(k·(E[U_confiar] − θ))
 */
export class TrustRiskDecision {

	constructor( { k = 4, theta = 0.1, cooperationValue = 0.6, betrayalCost = 0.8 } = {} ) {

		this.k                        = k
		this.theta                = theta
		this.cooperationValue = cooperationValue
		this.betrayalCost       = betrayalCost

	}

	/** `trust` (0..1, `Attachment` relation.trust), `suspicion` (0..1, `IntuitionEngine.getSuspicion(userId)`), `riskAversion` (0..1, personality-linked, e.g. `1 − openness` or `neuroticism`). */
	evaluate( trust, suspicion, riskAversion = 0.3 ) {

		const t              = clamp01( trust )
		const s               = clamp01( suspicion )
		const expected = t * this.cooperationValue - s * this.betrayalCost - clamp01( riskAversion )
		const p               = sigmoid( this.k * ( expected - this.theta ) )

		return { expectedUtility: expected, probabilityOfRisking: p, wouldRisk: p > 0.5 }

	}

}
