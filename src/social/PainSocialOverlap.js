function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Social rejection reuses the same aversive-signal pathway physical pain
 * does — a distinct, well-replicated fMRI finding (Eisenberger, N. I.,
 * Lieberman, M. D., & Williams, K. D. (2003), "Does rejection hurt? An fMRI
 * study of social exclusion", Science, 302(5643), 290-292: dorsal anterior
 * cingulate activation overlapping between social exclusion and physical
 * pain). Modeled here as a real distinct SIGNATURE — not just "more
 * negative valence" but a genuinely different coefficient profile
 * (disproportionately higher cortisol/arousal weight per unit of desirability
 * than an equivalent-magnitude abstract insult would produce), so exclusion-
 * flavored negativity reads as more bodily/threatening than an equally
 * negative but non-relational put-down.
 */
export class PainSocialOverlap {

	/**
	 * `desirability` — real negative appraisal magnitude (already computed).
	 * `exclusionSignal` (0..1) — how much this turn reads as rejection/exclusion
	 * specifically (caller-supplied: e.g. EmotionalOntology concept match on
	 * "rejection"/"exclusion"/"abandonment", or a LoveHateEngine rupture).
	 */
	computeSocialPainSpike( desirability, exclusionSignal ) {

		if ( desirability >= 0 || exclusionSignal <= 0 ) return { valence: 0, arousal: 0, cortisolBoost: 0 }

		const magnitude    = Math.abs( desirability ) * clamp01( exclusionSignal )
		// The distinct signature: cortisol responds MORE per unit magnitude here
		// than a plain CortisolEngine.register() call would produce for the same
		// desirability — own tuning of the multiplier, the real finding is the
		// DIRECTION (social pain co-opts the bodily threat pathway), not this
		// specific 1.6x figure.
		return {
			valence       : -magnitude,
			arousal       : magnitude * 0.7,
			cortisolBoost : magnitude * 0.12 * 1.6,
		}

	}

}
