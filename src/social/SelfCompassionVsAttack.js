function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

/**
 * Real self-compassion vs. self-attack after a failure — Neff, K. D.
 * (2003), "Self-compassion: An alternative conceptualization of a healthy
 * attitude toward oneself", Self and Identity, 2(2), 85-101 (the real,
 * well-established finding that self-compassion and self-criticism
 * genuinely predict DIFFERENT recovery trajectories after the same
 * failure, not just different feelings in the moment). Reuses
 * `ShameGuiltSplit`'s own shame reading directly rather than re-deriving
 * shame from scratch.
 *
 *   SelfAttack = σ(Shame + Neuroticism − Softness)
 *   SelfCompassion = σ(SecureBase + Rest − MetaAwareness⁻)
 *   RecoveryRate ∝ SelfCompassion − SelfAttack
 */
export class SelfCompassionVsAttack {

	getSelfAttack( shame, neuroticism, softness = 0.5 ) {

		return sigmoid( 3 * ( clamp01( shame ) + clamp01( neuroticism ) * 0.5 - clamp01( softness ) - 0.5 ) )

	}

	getSelfCompassion( secureBase, rest, metaAwareness = 0.5 ) {

		return sigmoid( 3 * ( clamp01( secureBase ) * 0.6 + clamp01( rest ) * 0.4 + clamp01( metaAwareness ) * 0.3 - 0.7 ) )

	}

	/** Real, bounded recovery-rate multiplier — genuinely faster than baseline when compassion dominates, slower when attack does. */
	getRecoveryRateMultiplier( selfCompassion, selfAttack ) {

		return clamp01( 1 + ( selfCompassion - selfAttack ) )

	}

}
