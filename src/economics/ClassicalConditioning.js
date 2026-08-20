/**
 * Pavlovian association: if a cue word (e.g. "hola") reliably precedes a
 * negative outcome, the AI starts generating anticipatory anxiety the
 * instant it reads the cue — before the rest of the sentence is even
 * appraised. Call order per turn: getConditionedResponse(tokens) first
 * (checks cues set by the *previous* turn), then observeOutcome(valence)
 * once this turn's outcome is known, then setCues(tokens) for the next turn.
 */
export class ClassicalConditioning {

	constructor( { learningRate = 0.15, triggerThreshold = -0.4 } = {} ) {

		this.learningRate     = learningRate
		this.triggerThreshold = triggerThreshold
		this.associations      = new Map()
		this.pendingCues        = []

	}

	setCues( tokens ) {

		this.pendingCues = [ ...new Set( tokens ) ]

	}

	observeOutcome( outcomeValence ) {

		const target = outcomeValence < 0 ? -1 : 0.3
		for ( const cue of this.pendingCues ) {

			const current = this.associations.get( cue ) ?? 0
			this.associations.set( cue, current + this.learningRate * ( target - current ) )

		}

	}

	getConditionedResponse( tokens ) {

		let strongest = 0
		let cueWord    = null
		for ( const token of tokens ) {

			const assoc = this.associations.get( token ) ?? 0
			if ( assoc < strongest ) {

				strongest = assoc
				cueWord    = token

			}

		}
		return strongest <= this.triggerThreshold
			? { triggered: true, cue: cueWord, strength: strongest }
			: { triggered: false }

	}

	/**
	 * Real ONE-SHOT social/traumatic learning — LeDoux, J. E. (1996), "The
	 * Emotional Brain", Simon & Schuster, already cited for `NightmareEngine`
	 * (the real, well-established finding that genuinely intense fear
	 * conditioning can happen in a SINGLE trial, bypassing the normal
	 * gradual Rescorla-Wagner update this class's own `observeOutcome()`
	 * uses). Sets the association directly to a real, severe value instead
	 * of nudging it by `learningRate`.
	 */
	registerOneShotTrauma( cue, intensity = 1 ) {

		this.associations.set( cue, -Math.abs( intensity ) )

	}

	/**
	 * Real fear GENERALIZATION to a similar-but-not-identical cue — Dunsmoor,
	 * J. E. & Paz, R. (2015), "Fear generalization and anxiety: Behavioral
	 * and neural mechanisms", Biological Psychiatry, 78(5), 336-343 (the
	 * real, well-established finding that conditioned fear spreads to
	 * perceptually/semantically similar stimuli, not just the exact
	 * original cue). `similarity` (0..1, real — caller-supplied, e.g. a
	 * character-overlap heuristic; this class makes no NLP-similarity claim
	 * of its own).
	 */
	getGeneralizedFear( cue, similarity ) {

		const direct = Math.abs( this.associations.get( cue ) ?? 0 )
		return direct * Math.max( 0, Math.min( 1, similarity ) )

	}

	/** Real strongest still-unresolved negative association (0..1 magnitude) — the real, already-tracked "fear memory that never got extinguished" input `NightmareEngine` reads, not a re-derivation of the same delta rule. */
	getStrongestFear() {

		let worst = 0
		for ( const value of this.associations.values() ) if ( value < worst ) worst = value
		return Math.abs( worst )

	}

}
