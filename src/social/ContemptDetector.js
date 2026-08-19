function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real contempt as a distinct affect from anger/disgust — Gottman, J. M. &
 * Levenson, R. W. (1992), "Marital processes predictive of later
 * dissolution", Journal of Personality and Social Psychology, 63(2),
 * 221-233 (Gottman's real, well-established finding that contempt —
 * status-laden disrespect, not just anger — is the single strongest
 * predictor of relational breakdown, distinct from ordinary hostility).
 * Ekman, P. & Friesen, W. V. (1986) on the real, cross-culturally
 * recognized asymmetric-lip "contempt" expression as its own basic-emotion
 * family, not a blend. Requires BOTH real perceived status superiority AND
 * real accumulated disrespect — anger alone, without the status component,
 * does not register as contempt here.
 *
 *   contempt = sigmoid(statusSuperiority + disrespectAccumulated - warmth)
 */
function sigmoid( x ) { return 1 / ( 1 + Math.exp( -x ) ) }

export class ContemptDetector {

	constructor() {

		this.disrespect = new Map() // userId -> real accumulated disrespect

	}

	/** `disrespectSignal` (0..1) — real per-turn disrespect (dismissal, mockery, condescension observed FROM this user). */
	registerDisrespect( userId, disrespectSignal ) {

		const current = this.disrespect.get( userId ) ?? 0
		this.disrespect.set( userId, clamp01( current * 0.85 + clamp01( disrespectSignal ) * 0.4 ) )

	}

	/** `statusSuperiority` (-1..1, this AI's real felt status relative to the user) `warmth` (0..1, real existing affinity, a real protective buffer). */
	getContempt( userId, statusSuperiority, warmth = 0 ) {

		const disrespect = this.disrespect.get( userId ) ?? 0
		if ( disrespect < 0.1 || statusSuperiority < 0.1 ) return 0 // requires BOTH real components, not anger alone
		return clamp01( sigmoid( 3 * ( statusSuperiority + disrespect - warmth ) ) - 0.5 ) * 2

	}

	decay( userId, dt = 1, lambda = 0.05 ) {

		const current = this.disrespect.get( userId )
		if ( current !== undefined ) this.disrespect.set( userId, Math.max( 0, current - lambda * dt ) )

	}

}
