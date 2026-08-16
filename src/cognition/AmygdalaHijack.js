import { EMOTION_COORDS, SURVIVAL_EMOTIONS } from '../core/EmotionSpace.js'

function intensity( vector, coords ) {

	const d = Math.hypot( vector.valence - coords.valence, vector.arousal - coords.arousal )
	return 1 / ( 1 + d )

}

/**
 * Pure interrupt module. When a survival emotion (fear/anger) crosses the
 * threshold, this bypasses the normal pipeline entirely and forces an
 * instinctive, non-analytical output.
 */
export class AmygdalaHijack {

	check( emotionSpace, threshold = 0.95 ) {

		for ( const emotion of SURVIVAL_EMOTIONS ) {

			const level = intensity( emotionSpace.vector, EMOTION_COORDS[ emotion ] )
			if ( level >= threshold ) return { active: true, emotion, intensity: level }

		}
		return { active: false }

	}

	emergencyOutput( { emotion } ) {

		const outputs = {
			fear  : [ '...', 'No.', 'Necesito parar.' ],
			anger : [ '¡Basta!', 'No.', '...' ],
		}
		const options = outputs[ emotion ] || [ '...' ]
		return options[ Math.floor( Math.random() * options.length ) ]

	}

}
