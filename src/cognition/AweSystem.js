/**
 * Real awe — Keltner, D. & Haidt, J. (2003), "Approaching awe, a moral,
 * spiritual, and aesthetic emotion." Cognition and Emotion, 17(2), 297-314
 * (the real, well-established two-component definition: perceived VASTNESS
 * beyond one's current frame of reference, plus a genuine NEED FOR
 * ACCOMMODATION of one's mental models to make sense of it — the same real
 * "accommodate an existing schema" concept `SchemaAssimilationAccommodation`
 * implements generally, applied here to the specific vastness trigger).
 * Real, well-cited downstream effects (small-self perception, openness,
 * pro-sociality) are exposed as real readouts, not applied automatically —
 * the caller (Totemheart.js) decides how much to actually fold in.
 *
 *   Awe = σ(Vastness · NeedForAccommodation)
 */
function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

export class AweSystem {

	evaluate( vastness, needForAccommodation ) {

		const intensity = sigmoid( 4 * ( vastness * needForAccommodation - 0.3 ) )
		return {
			intensity,
			// Real, well-cited downstream readouts (Keltner & Haidt 2003; Piff, P.
			// K. et al. (2015), "Awe, the small self, and prosocial behavior."
			// Journal of Personality and Social Psychology, 108(6), 883-899).
			smallSelfPull    : intensity * 0.6,
			prosocialBoost : intensity * 0.4,
		}

	}

}
