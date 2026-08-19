function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real style-shift by who's actually present, distinct from per-user
 * attachment-weighted mimicry — Bell, A. (1984), "Language style as
 * audience design", Language in Society, 13(2), 145-204 (the real,
 * well-established finding that speakers genuinely shift register based on
 * who is listening, including real "referee design" for a non-present but
 * imagined third party). Distinct from `StyleMimicry` (converging toward
 * ONE addressee's own style over time): this reads how many/who is present
 * THIS turn and adjusts formality/disclosure accordingly.
 *
 *   formality = base + κ·log(1+audienceSize) - intimacyWithPrimary
 */
export class AudienceDesign {

	constructor( { kappa = 0.15 } = {} ) {

		this.kappa = kappa

	}

	/** `audienceSize` (real participant count this turn), `intimacyWithPrimary` (0..1, real affinity with the main addressee). */
	getFormalityLevel( audienceSize = 1, intimacyWithPrimary = 0.5 ) {

		const base = 0.3
		return clamp01( base + this.kappa * Math.log( 1 + Math.max( 0, audienceSize - 1 ) ) - intimacyWithPrimary * 0.3 )

	}

	/** Real disclosure dampening — how much a genuinely private/personal detail should be held back given who else is present. */
	getDisclosureDampening( audienceSize = 1, disclosureSensitivity = 0.5 ) {

		if ( audienceSize <= 1 ) return 0
		return clamp01( disclosureSensitivity * Math.min( 1, Math.log( audienceSize ) / 2 ) )

	}

}
