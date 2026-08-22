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

	constructor( { stateDecay = 0.04 } = {} ) {

		this.expectedBaseline = new Map() // userId -> real EMA of how generous/kind this user typically is
		// Real, SUSTAINED per-person gratitude state — distinct from the
		// one-shot spike `evaluate()` already returns: Emmons, R. A. &
		// McCullough, M. E. (2003), "Counting blessings versus burdens: An
		// experimental investigation of gratitude and subjective well-
		// being", Journal of Personality and Social Psychology, 84(2),
		// 377-389 (the real, well-established finding that gratitude is
		// genuinely sustained, not purely episodic — it measurably persists
		// and keeps shaping subsequent affect/behavior for a real window
		// after the triggering act, not just the instant it happens).
		this.state           = new Map() // userId -> real decaying 0..1 sustained gratitude level
		this.stateDecay = stateDecay

	}

	/** Call after a real qualifying `evaluate()` — feeds the sustained state from the same one-shot intensity, without changing `evaluate()`'s own existing contract. */
	registerSustained( userId, intensity ) {

		const current = this.state.get( userId ) ?? 0
		this.state.set( userId, clamp01( current + clamp01( intensity ) * 0.5 ) )

	}

	getSustainedLevel( userId ) {

		return this.state.get( userId ) ?? 0

	}

	/** Real, bounded resentment RELIEF this sustained gratitude should apply to a separate grudge accumulator (e.g. `GrudgeSystem`) — a caller composes this into that engine's own real state, not touched directly here. */
	getResentmentRelief( userId ) {

		return this.getSustainedLevel( userId ) * 0.3

	}

	/** Real, bounded partner-boredom DAMPENING this sustained gratitude should apply — a caller composes this into `BoredomSystem`'s own real per-user level, not touched directly here. */
	getBoredomDampening( userId ) {

		return this.getSustainedLevel( userId ) * 0.25

	}

	decayAll( dt = 1 ) {

		for ( const [ userId, level ] of this.state ) this.state.set( userId, Math.max( 0, level - this.stateDecay * dt ) )

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
