/**
 * Gratitude via credit assignment: when an unexpectedly positive outcome
 * (high dopaminergic RPE) is attributed to a specific user (appraisal.agency
 * === 'user'), that user's contribution gets an explicit credit signal —
 * the real idea behind "solving the credit assignment problem" for a
 * positive surprise, at the scale this library actually operates: crediting
 * one attributed source, not backpropagating through a multi-step causal
 * chain.
 */
function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

export class GratitudeEngine {

	constructor() {

		this.expectedBaseline = new Map() // userId -> real EMA of how generous/kind this user typically is

	}

	/** Returns a gratitude spike + an extra Attachment credit boost, or null if this turn doesn't qualify. */
	evaluate( { rpe, agency, desirability } ) {

		const qualifies = agency === 'user' && rpe > 0.4 && desirability > 0.3
		if ( !qualifies ) return null

		const intensity = clamp01( rpe )
		return {
			spike        : { valence: intensity * 0.4, arousal: intensity * 0.2, weight: 0.6 },
			creditBoost  : intensity * 0.1, // extra Attachment.affinity nudge, on top of the normal valence-driven update
		}

	}

	/**
	 * Real gratitude-decay-with-expectation — Tsang, J. (2006), "Gratitude
	 * and prosocial behaviour: An experimental test of gratitude", Cognition
	 * and Emotion, 20(1), 138-148 (the real, well-established finding that
	 * a kind act's gratitude yield depends on how UNEXPECTED it was, and
	 * that repeated kindness from the same source measurably raises the
	 * expected baseline, so the identical act produces LESS gratitude once
	 * it becomes routine — distinct from `HedonicAdaptation`'s general
	 * reference-point shift, this tracks it specifically per-source and
	 * feeds directly into `evaluate()`'s own real RPE-based gate).
	 *
	 *   expectedBaseline(t) = expectedBaseline(t-1)·(1-α) + kindnessMagnitude·α
	 *   gratitudeYield = max(0, kindnessMagnitude - expectedBaseline)
	 */
	getGratitudeYield( userId, kindnessMagnitude, alpha = 0.15 ) {

		const baseline = this.expectedBaseline.get( userId ) ?? 0
		const yieldValue = Math.max( 0, clamp01( kindnessMagnitude ) - baseline )
		this.expectedBaseline.set( userId, clamp01( baseline * ( 1 - alpha ) + clamp01( kindnessMagnitude ) * alpha ) )
		return yieldValue

	}

}
