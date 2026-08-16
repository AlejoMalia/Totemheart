function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Tracks how the AI believes it is being perceived. A hit to perceived
 * competence damages "ego health"; the reaction to that damage depends on
 * personality — agreeable minds fold into shame (submission), the rest
 * double down into wounded pride (which EgoProjection can turn into blame).
 */
export class ReputationEngine {

	constructor() {

		this.egoHealth = 0.7

	}

	evaluate( appraisal, personality ) {

		if ( appraisal.agency !== 'self' || appraisal.desirability >= -0.1 ) return { damaged: false }

		const damage = Math.abs( appraisal.desirability ) * 0.3
		this.egoHealth = clamp01( this.egoHealth - damage )

		const reaction = personality.get( 'agreeableness' ) > 0.5 ? 'shame' : 'wounded_pride'
		return { damaged: true, damage, reaction, egoHealth: this.egoHealth }

	}

	regenerate( dt, lambda = 0.02 ) {

		this.egoHealth = clamp01( this.egoHealth + lambda * dt )

	}

	getEgoHealth() {

		return this.egoHealth

	}

}
