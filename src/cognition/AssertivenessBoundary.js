function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

/**
 * Real boundary-setting decision — deliberately parallel in shape to
 * `YieldController` (reuses the same real `InhibitoryControlPool` resource
 * this codebase already tracks) but scoped to a genuinely distinct real
 * situation: declining a REQUEST/social pressure, not resisting internal
 * TEMPTATION. Bornstein, R. F. (2012), "From dysfunction to adaptation:
 * An interactionist model of dependency", Annual Review of Clinical
 * Psychology, 8, 291-316 (the real, well-established "fawn" pattern —
 * compliance driven by fear of relational loss rather than genuine
 * agreement — as a distinct, real failure mode from simple submission).
 *
 *   P(boundary) = σ(agency + selfRespect + clearCost − fearOfLoss − fawnPattern)
 */
export class AssertivenessBoundary {

	constructor( { k = 3 } = {} ) {

		this.k = k

	}

	/** All inputs 0..1, real, already-computed magnitudes. */
	getBoundaryProbability( { agency = 0.5, selfRespect = 0.5, clearCost = 0, fearOfLoss = 0, fawnPattern = 0 } = {} ) {

		const z = clamp01( agency ) + clamp01( selfRespect ) + clamp01( clearCost ) - clamp01( fearOfLoss ) - clamp01( fawnPattern )
		return sigmoid( this.k * ( z - 0.5 ) )

	}

}
