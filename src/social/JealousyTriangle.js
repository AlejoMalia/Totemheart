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

	constructor() {

		// Real per-user kindling state — repeated jealousy episodes toward the
		// same rival genuinely sensitize the next reading, the same qualitative
		// "repeated activation lowers/raises its own future response" shape
		// AmygdalaHijack.js and LoveHateEngine.js already model for other
		// domains, applied here to rivalry (own tuning, no citation for γ).
		this.kindling = new Map()

	}

	/**
	 * A direct, formula-driven jealousy computation — distinct from evaluate()
	 * above (which needs real trend signals): here the caller already has a
	 * rival's affinity with the shared "other", the AI's own insecurity
	 * (real signal, e.g. 1 - egoHealth or 1 - trust), and its own affinity
	 * with "other". `ownAffinity` in the denominator means an already-strong
	 * bond dampens jealousy (less room to feel threatened when secure);
	 * `1 +` keeps it from dividing by zero at ownAffinity = -1.
	 */
	computeJealousy( rivalAffinity, selfInsecurity, ownAffinity ) {

		return clamp01( ( clamp01( rivalAffinity ) * clamp01( selfInsecurity ) ) / ( 1 + Math.max( 0, ownAffinity ) ) )

	}

	/** Real kindling — this rival-specific jealousy reading rises faster the more it's already fired for this exact rival. */
	computeKindling( rivalId, jealousy, gamma = 0.3 ) {

		const previous = this.kindling.get( rivalId ) ?? 0
		const kindled     = clamp01( jealousy * ( 1 + previous * gamma ) )
		this.kindling.set( rivalId, kindled )
		return kindled

	}

	getKindling( rivalId ) {

		return this.kindling.get( rivalId ) ?? 0

	}

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
