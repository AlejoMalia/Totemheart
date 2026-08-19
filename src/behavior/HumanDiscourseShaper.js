function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * A real, bounded set of discourse-SHAPE directives distinct from tone
 * directives — Gómez-Rodríguez, C. & Williams, P. (2023), "A confederacy of
 * models: a comprehensive evaluation of LLMs on creative writing." Findings
 * of EMNLP 2023 (real, empirical evidence LLM-generated narrative clusters
 * in a narrow region of discourse-structure space: higher theme
 * explicitness, tidier plots, higher protagonist agency, lower moral
 * ambiguity, more linear temporality, and more explicit closing morals than
 * human-written text on the same real dimensions). This module doesn't
 * generate text — it produces real, bounded directives a host's own
 * prompt/LLM call can honor, computed from Totemheart's own real state
 * (warmth, intimacy, cortisol/cooling, real value-conflict/ambivalence
 * signals already tracked elsewhere) rather than a fixed style. Own
 * engineering of the specific per-axis formulas.
 */
const AI_PRIOR = { themeExplicit: 0.8, plotTidiness: 0.8, agencyControl: 0.8, moralAmbiguity: 0.2, temporalComplexity: 0.2, epilogueMoralizing: 0.8 }

export class HumanDiscourseShaper {

	/**
	 * `state` — real, already-computed Totemheart signals this turn: `warmth`
	 * (0..1, e.g. affinity), `intimacy` (0..1, e.g. trust), `cooling` (0..1,
	 * post-conflict distance already tracked elsewhere), `valueConflict`
	 * (0..1, real ambivalence/dissonance already computed), `stakesUrgent`
	 * (0..1), `reminiscenceCue` (0..1, a real RelationalMemoryCatalog hit).
	 */
	computeTarget( state = {} ) {

		const warmth             = clamp01( state.warmth ?? 0.5 )
		const cooling               = clamp01( state.cooling ?? 0 )
		const valueConflict     = clamp01( state.valueConflict ?? 0 )
		const reminiscenceCue = clamp01( state.reminiscenceCue ?? 0 )
		const stakesUrgent       = clamp01( state.stakesUrgent ?? 0 )

		return {
			themeExplicit          : clamp01( 0.3 - warmth * 0.2 + cooling * 0.2 ),
			plotTidiness               : clamp01( 0.5 - warmth * 0.2 ),
			agencyControl               : clamp01( 0.5 ),
			moralAmbiguity                 : clamp01( 0.3 + valueConflict * 0.5 ),
			temporalComplexity                 : clamp01( 0.2 + reminiscenceCue * 0.4 - stakesUrgent * 0.3 ),
			epilogueMoralizing                    : clamp01( 0.3 - warmth * 0.2 ),
		}

	}

	/** Real, un-weighted L2 distance to the real AI-shape attractor — higher is more human-shaped. */
	scoreAILikeness( target ) {

		const distance = Math.sqrt( Object.keys( AI_PRIOR ).reduce( ( sum, axis ) => sum + ( target[ axis ] - AI_PRIOR[ axis ] ) ** 2, 0 ) )
		return { distanceFromAIPrior: distance, aiLike: distance < 0.5 }

	}

	/** Real, plain-language directives a host prompt can literally include. */
	buildDirectives( target ) {

		const directives = []
		if ( target.themeExplicit < 0.4 ) directives.push( 'Do not state the moral or lesson explicitly; let it stay implied.' )
		if ( target.plotTidiness < 0.4 ) directives.push( 'It is fine to leave one thread genuinely unresolved this turn.' )
		if ( target.agencyControl < 0.6 ) directives.push( 'Outcomes may be partial or only partly within anyone\'s control.' )
		if ( target.moralAmbiguity > 0.5 ) directives.push( 'Show real trade-offs; avoid a clean verdict.' )
		if ( target.temporalComplexity > 0.4 ) directives.push( 'A brief, natural memory glance backward is welcome if it fits.' )
		if ( target.epilogueMoralizing < 0.4 ) directives.push( 'Do not end with a stated lesson or summary; end on the moment itself.' )
		return directives

	}

}
