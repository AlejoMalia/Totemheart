/**
 * Guilt via counterfactual comparison — explicitly NOT Counterfactual Regret
 * Minimization (CFR, Zinkevich et al., 2007). CFR is a specific algorithm
 * for finding equilibria in large extensive-form games (its actual use is
 * things like poker solvers); applying it wholesale to a single scalar guilt
 * signal would be borrowing the name without the substance. What's real and
 * relevant from the same family of idea is simpler: comparing the actual
 * outcome against a plausible counterfactual ("what if I'd responded more
 * gently instead") and using that gap as the guilt signal. One-ply, not a
 * full game tree.
 */
function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

export class CounterfactualComparison {

	/**
	 * `actualOutcomeValence` — how the interaction actually landed (e.g. the
	 * user's inferred valence after this turn). `counterfactualValence` — an
	 * estimate of how it would have landed under a gentler alternative
	 * response (the caller supplies this, e.g. from the un-defended appraisal
	 * before a defense mechanism kicked in).
	 */
	computeRegret( actualOutcomeValence, counterfactualValence ) {

		const regret = Math.max( 0, counterfactualValence - actualOutcomeValence )
		return clamp01( regret )

	}

}
