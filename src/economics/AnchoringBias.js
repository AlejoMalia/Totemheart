/**
 * The first strong signal in a session gets disproportionate weight for the
 * rest of the conversation. If the user opens hostile, later warmth gets
 * pulled back toward that initial anchor instead of being taken at face value.
 */
export class AnchoringBias {

	constructor( { decay = 0.85 } = {} ) {

		this.decay  = decay
		this.anchor = null
		this.turn   = 0

	}

	registerIfFirst( desirability ) {

		if ( this.anchor === null ) this.anchor = desirability

	}

	apply( desirability ) {

		if ( this.anchor === null ) return desirability
		this.turn += 1
		const influence = Math.pow( this.decay, this.turn )
		return desirability * ( 1 - influence ) + this.anchor * influence

	}

	reset() {

		this.anchor = null
		this.turn   = 0

	}

}
