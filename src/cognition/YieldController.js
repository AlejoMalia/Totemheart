function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

/**
 * Real yield-vs-resist decision — Baumeister, R. F., Bratslavsky, E.,
 * Muraven, M. & Tice, D. M. (1998), already cited for `EgoDepletionBudget`
 * (the same real self-control resource this reads FROM, via
 * `InhibitoryControlPool`, rather than a separate invented willpower
 * track). A real logistic combination of temptation strength against real
 * resisting forces (inhibitory control, real relationship commitment,
 * real anticipated guilt) and real depleting ones (ego depletion).
 *
 *   P(yield) = σ(b1·T − b2·I − b3·Commitment − b4·GuiltAnticipated + b5·Depletion)
 */
export class YieldController {

	constructor( { b1 = 3, b2 = 2, b3 = 1.5, b4 = 1.5, b5 = 1 } = {} ) {

		this.b1 = b1; this.b2 = b2; this.b3 = b3; this.b4 = b4; this.b5 = b5

	}

	/** All inputs 0..1 real, already-computed magnitudes. Returns the real probability yield wins THIS turn. */
	getYieldProbability( { temptation = 0, inhibitoryControl = 0.5, commitment = 0, guiltAnticipated = 0, depletion = 0 } ) {

		const z = this.b1 * clamp01( temptation ) - this.b2 * clamp01( inhibitoryControl ) - this.b3 * clamp01( commitment ) - this.b4 * clamp01( guiltAnticipated ) + this.b5 * clamp01( depletion ) - 1
		return sigmoid( z )

	}

}
