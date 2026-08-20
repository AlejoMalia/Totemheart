function clamp( v, min = -1, max = 1 ) {

	return Math.max( min, Math.min( max, v ) )

}

/**
 * Real framing effects — Tversky, A. & Kahneman, D. (1981), "The framing of
 * decisions and the psychology of choice", Science, 211(4481), 453-458
 * (the real, classic, extensively-replicated finding that IDENTICAL
 * objective outcomes are evaluated differently depending on whether they're
 * described in gain-framed or loss-framed language — "90% survival" reads
 * better than "10% mortality" for the same real number); Tversky, A. &
 * Kahneman, D. (1992), "Advances in Prospect Theory: Cumulative
 * Representation of Uncertainty" (already cited elsewhere for loss
 * aversion — this is prospect theory's OTHER, genuinely distinct real
 * finding: `LossAversion.js` models the asymmetric VALUE FUNCTION curve
 * itself; this models the real DESCRIPTION-DEPENDENT bias on top of it —
 * the same outcome, same value function, different read depending purely
 * on how it was phrased). Own engineering of the specific frame-shift
 * magnitude.
 *
 *   perceivedValue = objectiveValue + frameSign · frameStrength · ambiguity
 */
export class FramingEffect {

	/**
	 * `objectiveValue` (-1..1, the real underlying outcome magnitude,
	 * independent of how it's described), `frame` ('gain'|'loss'|'neutral'
	 * — how the SAME outcome was actually phrased this turn),
	 * `ambiguity` (0..1, real uncertainty in the situation — framing bites
	 * harder the less clear-cut the real outcome is; a completely
	 * unambiguous outcome resists reframing).
	 */
	applyFrame( objectiveValue, frame, ambiguity = 0.5 ) {

		if ( frame !== 'gain' && frame !== 'loss' ) return objectiveValue

		const frameSign         = frame === 'gain' ? 1 : -1
		const frameStrength = 0.35
		return clamp( objectiveValue + frameSign * frameStrength * clamp( ambiguity, 0, 1 ) )

	}

	/** Real, bounded magnitude of how much a gain-frame vs. loss-frame of the identical outcome would diverge — useful for exposing the real bias itself, not just its output. */
	getFrameSensitivity( ambiguity = 0.5 ) {

		return clamp( ambiguity, 0, 1 ) * 0.7

	}

}
