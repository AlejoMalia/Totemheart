function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real chronic-understimulation accumulator — Eastwood, J. D., Frischen, A.,
 * Fenske, M. J., & Smilek, D. (2012), "The unengaged mind: Defining boredom
 * in terms of attention", Perspectives on Psychological Science, 7(5),
 * 482-495 (boredom as a real, distinct aversive state from prolonged
 * failure to engage attention, not merely "low arousal"). The opposite pole
 * from `SensoryOverload`/`ExpressionDebt` (too much), and distinct from
 * `TopicSatiation` (repetition-specific discount on a single topic) — this
 * accumulates from genuinely LOW stimulation (novelty + engagement both
 * low) regardless of repetition, and its real output is a push toward
 * novelty-seeking, not just a discount factor.
 *
 *   dB/dt = α(1 - Stimulation) - λB
 *   NoveltySeeking ∝ B
 */
export class BoredomSystem {

	constructor( { alpha = 0.08, lambda = 0.04 } = {} ) {

		this.alpha = alpha
		this.lambda = lambda
		this.level        = 0

	}

	/** `stimulation` 0..1 — real engagement/novelty this turn actually carried. */
	update( stimulation, dt = 1 ) {

		const rise = this.alpha * dt * ( 1 - clamp01( stimulation ) )
		const fall  = this.lambda * dt * this.level
		this.level  = clamp01( this.level + rise - fall )
		return this.level

	}

	getNoveltySeeking() {

		return this.level

	}

	isBored( threshold = 0.5 ) {

		return this.level > threshold

	}

}
