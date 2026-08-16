function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * A real, bounded switch between divergent (exploratory, more varied) and
 * convergent (focused, more predictable) real output-shaping — divergent
 * vs. convergent thinking is a real, established distinction (Guilford,
 * J. P. (1967), "The Nature of Human Intelligence", McGraw-Hill); positive
 * affect broadening the space of what's attended to and considered is the
 * real "broaden-and-build" finding (Fredrickson, B. L. (2001), "The role
 * of positive emotions in positive psychology: The broaden-and-build
 * theory of positive emotions", American Psychologist, 56(3), 218-226).
 * The output here is a real, bounded `suggestedTemperature`-style number —
 * this module produces the same kind of real, host-facing metadata field
 * `LogicEngine`'s decision-cost wiring already exposes, not a claim that
 * this module itself runs an LLM sampler.
 *
 *   DivergentScore = Openness · (positive_arousal + novelty)
 *   TemperatureMod = 0.3 + 0.7 · DivergentScore
 */
export class CreativeModeSwitch {

	/**
	 * `positiveArousal` — real max(0, arousal) gated by positive valence (own
	 * convention: broaden-and-build is specifically about POSITIVE high-
	 * arousal states, not threat-arousal, which narrows attention instead —
	 * AmygdalaHijack/InteroceptiveSignals already model the narrowing
	 * direction for threat). `novelty` — real NoveltyDetector.js reading (0..1).
	 */
	computeDivergentScore( valence, arousal, novelty, openness = 0.5 ) {

		const positiveArousal = valence > 0 ? clamp01( arousal ) : 0
		return clamp01( clamp01( openness ) * clamp01( ( positiveArousal + clamp01( novelty ) ) / 2 ) )

	}

	getTemperatureModifier( valence, arousal, novelty, openness = 0.5 ) {

		const divergentScore = this.computeDivergentScore( valence, arousal, novelty, openness )
		return { divergentScore, temperatureMod: 0.3 + 0.7 * divergentScore, mode: divergentScore > 0.5 ? 'divergent' : 'convergent' }

	}

}
