function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real ideal-self discrepancy — the second, genuinely distinct real gap
 * from Higgins' own self-discrepancy theory, alongside `SuperegoMonitor`'s
 * existing ought-self gap — Higgins, E. T. (1987), "Self-discrepancy: A
 * theory relating self and affect", Psychological Review, 94(3), 319-340
 * (the real, well-established finding that a person's actual self is
 * compared against TWO qualitatively different standards with TWO
 * genuinely different emotional signatures: the "ought self" — duty,
 * obligation — produces AGITATION-related affect, anxiety and guilt,
 * already `SuperegoMonitor`'s real territory; the "ideal self" — hopes,
 * aspirations, wishes — produces DEJECTION-related affect instead,
 * disappointment and sadness, genuinely distinct and previously
 * unmodeled). Own engineering of the specific gap-to-dejection mapping.
 *
 *   dejection = max(0, idealStandard - actualBehavior) · aspirationalWeight
 */
export class IdealSelfDiscrepancy {

	constructor( { sensitivity = 0.5 } = {} ) {

		this.sensitivity = sensitivity
		this.discrepancy   = 0

	}

	/** `idealStandard` (0..1, a real self-aspiration — not a duty), `actualAchievement` (0..1, real how well this turn's own outcome measured up). */
	evaluate( idealStandard, actualAchievement ) {

		const gap = clamp01( idealStandard - actualAchievement )
		this.discrepancy = clamp01( this.discrepancy * 0.75 + gap * this.sensitivity )
		return { discrepancy: this.discrepancy, dejection: this.discrepancy * this.sensitivity }

	}

	/** Real, bounded dejection-family affect this gap produces — sadness/disappointment, deliberately NOT the agitation/guilt family SuperegoMonitor's own ought-gap produces. */
	getDejectionPressure() {

		return clamp01( this.discrepancy * ( 0.5 + 0.5 * this.sensitivity ) )

	}

	decay( dt = 1, lambda = 0.08 ) {

		this.discrepancy = Math.max( 0, this.discrepancy - lambda * dt )

	}

}
