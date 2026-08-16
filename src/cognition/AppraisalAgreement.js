function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Each turn already produces several independent valence estimates that
 * never get compared against each other before being fused into one number:
 * the appraisal's own desirability, situational.joy minus situational.stress,
 * a semantic-similarity hostility read (when an embedding backend is
 * configured), and a detected life event's valence. Nothing today measures
 * whether those signals actually agree — this does, with a real population
 * variance over whichever of them are available this turn, no citation
 * (this is a plain statistical spread, not a reproduction of any named
 * confidence model). High variance across sources means the turn is
 * genuinely ambiguous; that's real information about how confidently the
 * projected emotion should be expressed, not noise to discard.
 */
export class AppraisalAgreement {

	evaluate( estimates ) {

		const values = estimates.filter( v => typeof v === 'number' && Number.isFinite( v ) )
		if ( values.length < 2 ) return { agreement: 1, variance: 0, mean: values[ 0 ] ?? 0, n: values.length }

		const mean       = values.reduce( ( a, b ) => a + b, 0 ) / values.length
		const variance = values.reduce( ( sum, v ) => sum + ( v - mean ) ** 2, 0 ) / values.length

		// valence estimates live in [-1, 1], so max possible spread (all mass split
		// between -1 and 1) bounds variance at 1 — sqrt(variance) is then already
		// a 0..1 "disagreement" reading, and agreement is just its complement.
		const agreement = clamp01( 1 - Math.sqrt( variance ) )

		return { agreement, variance, mean, n: values.length }

	}

}
