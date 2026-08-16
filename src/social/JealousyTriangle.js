function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Three-node relational threat model (self, other, rival), for real
 * multi-user conversations where a third party's rising status with a user
 * the AI cares about is a genuinely different signal than that user simply
 * being cold. Reuses StatusEnvy's real trend-comparison mechanic (envy from
 * the SIGN of the derivative, not the absolute level) but scores it against
 * Attachment/LoveHateEngine's real bond strength for that "other" — jealousy
 * requires a bond worth losing, which plain envy doesn't (White, G. L., &
 * Mullen, P. E. (1989), "Jealousy: Theory, Research, and Clinical Strategies",
 * Guilford Press — the self/other/rival triadic structure is standard in
 * that literature; the specific scoring below is our own engineering).
 */
export class JealousyTriangle {

	/**
	 * `selfTrend`/`rivalTrend` — real per-turn deltas of status/affinity with
	 * the shared "other" (from StatusEnvy.observe() or Attachment affinity
	 * deltas). `bondValue` — the AI's own real bond strength with "other"
	 * (LoveHateEngine.getNetBond or Attachment.affinity) — jealousy is scaled
	 * by how much there actually is to lose.
	 */
	evaluate( selfTrend, rivalTrend, bondValue ) {

		const exclusionThreat = selfTrend < 0 && rivalTrend > 0
		if ( !exclusionThreat || bondValue <= 0 ) return { threatened: false, vigilance: 0, devaluationTarget: null }

		const intensity = clamp01( ( Math.abs( selfTrend ) + rivalTrend ) * clamp01( bondValue ) )

		// Devaluation target: personality-agnostic default — a caller with a
		// real personality signal (e.g. agreeableness) can override which way
		// this leans; absent that, more of the two forces (loss vs. rival gain)
		// decides which gets devalued.
		const devaluationTarget = Math.abs( selfTrend ) >= rivalTrend ? 'bond' : 'rival'

		return { threatened: true, vigilance: intensity, intensity, devaluationTarget }

	}

	/** Vigilance raises attentional sampling of this specific relationship — a real multiplier for how often StatusEnvy/Attachment should be re-observed for this user pair. */
	getVigilanceSamplingMultiplier( vigilance ) {

		return 1 + clamp01( vigilance ) * 2

	}

}
