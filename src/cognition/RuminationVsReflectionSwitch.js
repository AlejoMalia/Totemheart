function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real distinction between two forms of self-focused attention —
 * Trapnell, P. D. & Campbell, J. D. (1999), "Private self-consciousness
 * and the five-factor model of personality: Distinguishing rumination from
 * reflection", Journal of Personality and Social Psychology, 76(2),
 * 284-304 (the real, well-established finding that self-focus driven by
 * genuine curiosity/epistemic interest — reflection — produces different
 * outcomes than self-focus driven by a real, threat-linked need to reduce
 * discrepancy — rumination — even though both LOOK like "thinking about
 * oneself" from the outside). Distinct from `RuminationChain` (the actual
 * Markov-chain content dynamics): this decides which MODE a bout of
 * self-focus is in, given real neuroticism and real threat context.
 *
 *   P(rumination) = sigmoid(neuroticism + threatLevel - curiosity)
 */
function sigmoid( x ) { return 1 / ( 1 + Math.exp( -x ) ) }

export class RuminationVsReflectionSwitch {

	/** `neuroticism`/`curiosity`/`threatLevel` (0..1, real trait/state inputs). Returns the real dominant mode plus its probability. */
	classify( neuroticism, curiosity, threatLevel ) {

		const pRumination = clamp01( sigmoid( 3 * ( neuroticism + threatLevel - curiosity - 0.3 ) ) )
		return { mode: pRumination > 0.5 ? 'rumination' : 'reflection', pRumination }

	}

	/** Real outcome quality this mode produces — reflection genuinely tends toward insight, rumination toward a stuck negative loop (own-design mapping onto `InsightGenerator`/`RuminationChain`'s existing real outputs). */
	getExpectedOutcome( mode ) {

		return mode === 'reflection' ? { insightGain: 0.15, moodDrag: 0.02 } : { insightGain: 0.02, moodDrag: 0.15 }

	}

}
