/**
 * Honest version of a "sparse activation router": the proposal's literal
 * form (Mt = σ(Wr·Embedding(Xt) + θ)) needs trained router weights Wr —
 * there's no labeled dataset or training loop in this environment to
 * produce those honestly, so fabricating a JSON of "learned" weights would
 * be exactly the kind of simulation this project refuses to do. What's real
 * and buildable instead: a cheap keyword/regex + prior-state-residual gate,
 * checked BEFORE a secondary mechanism's actual computation runs. A rule
 * with no keywords and no residual check always activates (a primary layer
 * that should always run).
 */
export class TriggerSentinel {

	constructor( rules = {} ) {

		this.rules = rules // name -> { keywords?: string[], residualThreshold?: number }

	}

	/**
	 * `tokens` — this turn's tokenized input. `residual` — the mechanism's own
	 * carried-over state magnitude (e.g. ExpressionDebt.debt), compared against
	 * its own residualThreshold. Fires on keyword match OR residual carryover
	 * exceeding threshold; a mechanism with no rule registered is always active.
	 */
	check( name, tokens = [], residual = 0 ) {

		const rule = this.rules[ name ]
		if ( !rule ) return { active: true, reason: 'no-rule' }

		const keywordHit = rule.keywords?.some( k => tokens.includes( k ) ) ?? false
		const residualHit  = rule.residualThreshold !== undefined && residual > rule.residualThreshold

		return { active: keywordHit || residualHit, reason: keywordHit ? 'keyword' : residualHit ? 'residual' : 'none' }

	}

}
