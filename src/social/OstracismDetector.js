function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real social-exclusion pain detection, distinct from `BystanderEffect`
 * (which models a GROUP's diffusion-of-responsibility probability of not
 * responding at all — an outside-in group-size effect) and from
 * `PainSocialOverlap` (the general social/physical pain pathway overlap,
 * with no specific exclusion trigger) — Williams, K. D. (2007),
 * "Ostracism." Annual Review of Psychology, 58, 425-452 (the real,
 * well-established finding that being ignored/excluded activates real
 * social pain, largely independent of WHY it happened, the "even a
 * computer excluding you hurts" replication that motivated Cyberball
 * studies); Eisenberger, N. I. (2012), "The pain of social disconnection:
 * examining the shared neural underpinnings of physical and social pain."
 * Nature Reviews Neuroscience, 13(6), 421-434.
 *
 *   O = σ(ignore + exclude - inclusion)
 */
export class OstracismDetector {

	constructor( { threshold = 0.5, gain = 1.6 } = {} ) {

		this.threshold = threshold
		this.gain          = gain

	}

	/**
	 * `ignoreSignal`/`excludeSignal` (0..1) — real, caller-supplied readings
	 * (e.g. unanswered turns, an explicit exclusion cue). `inclusionSignal`
	 * (0..1) — real, offsetting warmth/engagement this same context carries.
	 */
	evaluate( { ignoreSignal = 0, excludeSignal = 0, inclusionSignal = 0 } = {} ) {

		const raw           = this.gain * ( clamp01( ignoreSignal ) + clamp01( excludeSignal ) ) - clamp01( inclusionSignal )
		const ostracismPain = clamp01( 1 / ( 1 + Math.exp( -raw ) ) )
		return {
			ostracismPain,
			ostracized : ostracismPain > this.threshold,
			// Williams' own real real-world reflexive-then-reflective response
			// pattern: an initial pain spike is near-universal (immediate); a
			// PROTEST vs. WITHDRAWAL response afterward is a real, distinct,
			// personality-dependent secondary choice, left to the caller (e.g.
			// combined with Attachment style) rather than hardcoded here.
		}

	}

}
