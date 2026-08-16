/**
 * Approximate position of each named emotion on the valence/arousal/dominance
 * space. The 2-axis circumplex is Russell, J. A. (1980), "A circumplex model
 * of affect", Journal of Personality and Social Psychology, 39(6), 1161-1178.
 * The third axis (dominance — felt sense of control/power vs. submissiveness)
 * extends this toward the PAD framework (Pleasure-Arousal-Dominance,
 * Mehrabian & Russell's line of work) — direction of the axis taken from
 * that tradition, the actual placement of these 20 labels on all three axes
 * is our own, not a published mapping — see CALIBRATION.md.
 */
export const EMOTION_COORDS = {
	joy         : { valence: 0.8, arousal: 0.5, dominance: 0.4 },
	sadness     : { valence: -0.6, arousal: -0.4, dominance: -0.4 },
	fear        : { valence: -0.7, arousal: 0.7, dominance: -0.6 },
	anger       : { valence: -0.6, arousal: 0.8, dominance: 0.5 },
	surprise    : { valence: 0.2, arousal: 0.8, dominance: 0.1 },
	disgust     : { valence: -0.7, arousal: 0.2, dominance: 0.2 },
	love        : { valence: 0.9, arousal: 0.3, dominance: 0.2 },
	shame       : { valence: -0.6, arousal: -0.2, dominance: -0.8 },
	pride       : { valence: 0.7, arousal: 0.4, dominance: 0.7 },
	guilt       : { valence: -0.5, arousal: -0.1, dominance: -0.5 },
	hope        : { valence: 0.6, arousal: 0.3, dominance: 0.3 },
	frustration : { valence: -0.4, arousal: 0.6, dominance: -0.2 },
	despair     : { valence: -0.8, arousal: -0.5, dominance: -0.7 },
	compassion  : { valence: 0.5, arousal: 0.1, dominance: 0.3 },
	gratitude   : { valence: 0.7, arousal: 0.2, dominance: 0.1 },
	trust       : { valence: 0.5, arousal: -0.1, dominance: 0.3 },
	remorse     : { valence: -0.5, arousal: -0.3, dominance: -0.5 },
	envy        : { valence: -0.4, arousal: 0.3, dominance: -0.3 },
	jealousy    : { valence: -0.5, arousal: 0.4, dominance: -0.2 },
	nostalgia   : { valence: 0.1, arousal: -0.3, dominance: -0.1 },
	neutral     : { valence: 0, arousal: 0, dominance: 0 },
}

/** "Survival" emotions AmygdalaHijack watches for. */
export const SURVIVAL_EMOTIONS = [ 'fear', 'anger' ]

function clamp( v, min = -1, max = 1 ) {

	return Math.max( min, Math.min( max, v ) )

}

function distance( a, b ) {

	return Math.hypot( a.valence - b.valence, a.arousal - b.arousal, ( a.dominance ?? 0 ) - ( b.dominance ?? 0 ) )

}

/**
 * Blend of the top-K nearest named emotions to a point, inverse-distance
 * weighted. `neuroticism` (0..1, optional) nudges the query point deeper
 * into whichever quadrant it's already in before matching — the same raw
 * state reads as milder for a low-neuroticism personality and as more
 * intense for a high-neuroticism one. The *direction* of this effect is
 * grounded in Costa & McCrae (1992) on neuroticism and emotional
 * reactivity; the specific 0.15 magnitude is our own tuning, not a
 * measured coefficient — see CALIBRATION.md. Dominance is left unbiased —
 * neuroticism research speaks to emotional reactivity/valence, not felt
 * control, so there's no basis for nudging that axis the same way.
 */
export function classify( point, topK = 3, neuroticism = 0 ) {

	const biasedPoint = neuroticism > 0
		? {
			valence   : point.valence + Math.sign( point.valence ) * neuroticism * 0.15,
			arousal   : point.arousal + Math.sign( point.arousal ) * neuroticism * 0.1,
			dominance : point.dominance ?? 0,
		}
		: point

	const scored = Object.entries( EMOTION_COORDS ).map( ( [ name, coords ] ) => {

		const d = distance( biasedPoint, coords )
		return { name, weight: 1 / ( 0.05 + d ) }

	} )

	scored.sort( ( a, b ) => b.weight - a.weight )
	const top   = scored.slice( 0, topK )
	const total = top.reduce( ( sum, e ) => sum + e.weight, 0 )

	return top.reduce( ( blend, e ) => {

		blend[ e.name ] = e.weight / total
		return blend

	}, {} )

}

/**
 * Central emotional engine: a {valence, arousal, dominance} vector (PAD)
 * plus a derived blend of named emotions. `applySpike` squashes valence and
 * dominance through tanh (a smooth saturating nonlinearity, not a hard clip)
 * — the real technique behind item #10 of the appraisal-to-affect mapping:
 * accumulated cognitive evaluations pass through a sigmoid-family activation
 * rather than being summed and truncated. `setVector`/`getState` keep a hard
 * clamp since those are used for direct state assignment (restore, tests),
 * where exact values matter more than a smooth curve.
 */
export class EmotionSpace {

	constructor() {

		this.vector = { valence: 0, arousal: 0, dominance: 0 }

	}

	setVector( valence, arousal, dominance = this.vector.dominance ?? 0 ) {

		this.vector = { valence: clamp( valence ), arousal: clamp( arousal ), dominance: clamp( dominance ) }

	}

	/** Additively apply a weighted spike (from MicroEmotions) to the current vector. */
	applySpike( { valence = 0, arousal = 0, dominance = 0, weight = 1 } ) {

		this.vector = {
			valence   : Math.tanh( this.vector.valence + valence * weight ),
			arousal   : clamp( this.vector.arousal + arousal * weight ),
			dominance : Math.tanh( ( this.vector.dominance ?? 0 ) + dominance * weight ),
		}

	}

	getBlend( topK = 3, neuroticism = 0 ) {

		return classify( this.vector, topK, neuroticism )

	}

	getDominantEmotion( neuroticism = 0 ) {

		const blend = this.getBlend( 1, neuroticism )
		return Object.keys( blend )[ 0 ]

	}

	getState( neuroticism = 0 ) {

		return { vector: { ...this.vector }, blend: this.getBlend( 3, neuroticism ) }

	}

}
