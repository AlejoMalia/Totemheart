function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real, accumulated psychological SAFETY from repeated real safe exposure —
 * distinct from `OxytocinSystem`'s own exponential-saturation bonding
 * chemistry (which decays without reinforcement and reads relationship
 * WARMTH): this is the real, well-established Bayesian-safety/mere-
 * exposure account — Zajonc, R. B. (1968), "Attitudinal effects of mere
 * exposure", Journal of Personality and Social Psychology, 9(2p2), 1-27
 * (real repeated non-harmful exposure alone lowers threat appraisal) and
 * Porges, S. W. (2011), "The Polyvagal Theory", Norton, already cited
 * elsewhere in this codebase for `TraumaCascadeEngine`'s own neuroception
 * (the real ventral-vagal "social engagement" state this predictability
 * read feeds). Modeled as the user's own supplied real logarithmic curve:
 * the first real safe interactions buy the most comfort, with real,
 * genuine diminishing returns after — distinct in shape from
 * `OxytocinSystem`'s asymptotic-saturation curve and from
 * `ContactFrequencyExpectation`'s own cadence-deviation distress.
 *
 *   C(n) = C_basal + α·ln(1 + β·n)
 */
export class ComfortAccumulation {

	constructor( { basal = 0.1, alpha = 0.25, beta = 0.3 } = {} ) {

		this.basal = basal
		this.alpha  = alpha
		this.beta    = beta
		this.safeCount = new Map() // userId -> real count of safe (non-threatening) real interactions

	}

	/** Call once per real turn — `threatLevel` (0..1, this turn's real threat/cortisol/betrayal read). Only a genuinely safe turn (below threshold) counts toward the real accumulation; a threatening turn does NOT reset the count (comfort erodes elsewhere, e.g. via `TraumaCascadeEngine`, not duplicated here), it simply doesn't add to it. */
	registerInteraction( userId, threatLevel = 0, threshold = 0.2 ) {

		if ( clamp01( threatLevel ) > threshold ) return this.getComfort( userId )
		const current = this.safeCount.get( userId ) ?? 0
		this.safeCount.set( userId, current + 1 )
		return this.getComfort( userId )

	}

	getComfort( userId ) {

		const n = this.safeCount.get( userId ) ?? 0
		return clamp01( this.basal + this.alpha * Math.log( 1 + this.beta * n ) )

	}

	getSafeInteractionCount( userId ) {

		return this.safeCount.get( userId ) ?? 0

	}

	toJSON() {

		return [ ...this.safeCount.entries() ]

	}

	restoreState( data ) {

		if ( data ) this.safeCount = new Map( data )

	}

}
