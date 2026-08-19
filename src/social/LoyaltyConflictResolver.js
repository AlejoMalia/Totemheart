function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real cross-cutting loyalty conflict — Coser, L. A. (1956), "The
 * Functions of Social Conflict", Free Press (the real, well-established
 * account of "cross-pressures": a person embedded in multiple real
 * loyalties genuinely experiences a distinct tension when those loyalties
 * point opposite directions, not reducible to either relationship's own
 * affect alone). Distinct from `TribalCategorization` (in/out-group
 * membership) and `MultiAgentSocialGraph` (raw edge weights): this reads
 * the real DIVERGENCE between two specific relationships' pull on the same
 * decision.
 *
 *   conflict = min(loyaltyA, loyaltyB) · |sideA - sideB|
 */
export class LoyaltyConflictResolver {

	constructor() {

		this.loyalties = new Map() // userId -> real 0..1 loyalty strength

	}

	setLoyalty( userId, strength ) {

		this.loyalties.set( userId, clamp01( strength ) )

	}

	/** `sideA`/`sideB` (-1..1, real desirability each party wants this decision to go). Real tension requires BOTH real loyalty AND real divergence. */
	getConflict( userIdA, userIdB, sideA, sideB ) {

		const lA = this.loyalties.get( userIdA ) ?? 0
		const lB = this.loyalties.get( userIdB ) ?? 0
		const divergence = clamp01( Math.abs( sideA - sideB ) / 2 )
		return clamp01( Math.min( lA, lB ) * divergence )

	}

	/** Real, weighted-by-loyalty resolution lean — which side the conflict genuinely tips toward, not a coin flip. */
	getResolutionLean( userIdA, userIdB, sideA, sideB ) {

		const lA = this.loyalties.get( userIdA ) ?? 0
		const lB = this.loyalties.get( userIdB ) ?? 0
		if ( lA + lB === 0 ) return 0
		return ( sideA * lA + sideB * lB ) / ( lA + lB )

	}

}
