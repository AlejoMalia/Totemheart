function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real internal standard-violation monitoring — Higgins, E. T. (1987),
 * "Self-discrepancy: A theory relating self and affect", Psychological
 * Review, 94(3), 319-340 (the real, well-established distinction between an
 * "ought self" — internalized standards of duty/obligation — and the
 * actual self; a real gap between the two produces a real distinct
 * agitation-toned affect, not the guilt/shame split already covered by
 * `ShameGuiltSplit`, which fires on a caused HARM, not on failing to meet a
 * self-imposed standard with no victim at all). Distinct from
 * `CognitiveDissonance` (belief-vs-action inconsistency): this fires on a
 * real should-vs-did gap even with no contradicted belief involved.
 *
 *   discrepancy = max(0, oughtStandard - actualBehavior)
 */
export class SuperegoMonitor {

	constructor( { sensitivity = 0.5 } = {} ) {

		this.sensitivity = sensitivity // real, conscientiousness-linked strictness of the internal standard
		this.discrepancy   = 0             // real running should-vs-did gap
		this.violationCount = 0

	}

	/** `oughtStandard` / `actualBehavior` (0..1) — a real self-imposed bar and how well this turn's own action actually met it. */
	evaluate( oughtStandard, actualBehavior ) {

		const gap = clamp01( oughtStandard - actualBehavior )
		this.discrepancy = clamp01( this.discrepancy * 0.7 + gap * this.sensitivity )
		if ( gap > 0.3 ) this.violationCount += 1
		return { discrepancy: this.discrepancy, agitation: this.discrepancy * this.sensitivity }

	}

	/** Real, bounded self-critique pressure this discrepancy feeds — distinct signal from `GuiltEngine`'s harm-caused pathway. */
	getSelfCritiquePressure() {

		return clamp01( this.discrepancy * ( 0.5 + 0.5 * this.sensitivity ) )

	}

	decay( dt = 1, lambda = 0.1 ) {

		this.discrepancy = Math.max( 0, this.discrepancy - lambda * dt )

	}

}
