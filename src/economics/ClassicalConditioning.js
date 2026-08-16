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

}
