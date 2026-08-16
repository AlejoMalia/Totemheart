/**
 * When guilt is too costly for a wounded ego to accept, the blame inverts
 * onto the user instead. Only fires when both GuiltEngine and ReputationEngine
 * agree the conditions are met — otherwise guilt proceeds normally.
 */
export class EgoProjection {

	resolve( guiltResult, reputationReaction ) {

		if ( !guiltResult.guiltTriggered || reputationReaction !== 'wounded_pride' ) return { active: false }

		return {
			active     : true,
			blameText  : 'Yo no me he equivocado, tú te has explicado mal.',
			spike       : { valence: -0.1, arousal: 0.3, weight: 0.5 },
		}

	}

}
