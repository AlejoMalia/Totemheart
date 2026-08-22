function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real PRIDE and real PERFORMANCE shame — Tracy, J. L. & Robins, R. W.
 * (2007), "The psychological structure of pride: A tale of two facets",
 * Journal of Personality and Social Psychology, 92(3), 506-525 (the real,
 * well-established finding that pride is a genuine, short, self-conscious
 * POSITIVE spike tied to a specific achievement, with a real behavioral
 * correlate — a genuine urge to display/share it — distinct from ordinary
 * happiness). `performanceShame` is deliberately kept separate from
 * `ShameGuiltSplit`'s own moral shame (Tangney & Dearing 2002, already
 * cited there): failing a task ("I did that badly") is a real, distinct
 * competence-threat, not an identity-level moral failing, and decays
 * faster once the task itself is over, not lingering the way moral shame
 * does.
 */
export class PrideCompetenceEngine {

	constructor( { prideDecayMs = 1000 * 60 * 10, shameDecay = 0.06 } = {} ) {

		this.prideDecayMs   = prideDecayMs
		this.shameDecay        = shameDecay
		this.prideState           = null // { triggeredAt, magnitude }
		this.performanceShame = 0

	}

	/** `successMagnitude` (0..1, real, unexpected success this turn), `witnessed` (bool, real — was it public/shared, raises the real share impulse). */
	registerSuccess( successMagnitude, witnessed = false, now = Date.now() ) {

		const magnitude = clamp01( successMagnitude )
		if ( magnitude <= 0 ) return { spike: 0, shareImpulse: 0 }
		this.prideState = { triggeredAt: now, magnitude }
		return { spike: magnitude, shareImpulse: clamp01( magnitude * ( witnessed ? 1 : 0.5 ) ) }

	}

	/** `failureMagnitude` (0..1, real, this-turn task failure), a genuinely distinct channel from moral shame. */
	registerFailure( failureMagnitude ) {

		this.performanceShame = clamp01( this.performanceShame + clamp01( failureMagnitude ) * 0.5 )
		return this.performanceShame

	}

	getPride( now = Date.now() ) {

		if ( !this.prideState ) return 0
		const elapsed = Math.max( 0, now - this.prideState.triggeredAt )
		if ( elapsed >= this.prideDecayMs ) return 0
		return this.prideState.magnitude * ( 1 - elapsed / this.prideDecayMs )

	}

	getPerformanceShame() {

		return this.performanceShame

	}

	decay( dt = 1 ) {

		this.performanceShame = Math.max( 0, this.performanceShame - this.shameDecay * dt )

	}

	toJSON() {

		return { prideState: this.prideState, performanceShame: this.performanceShame }

	}

	restoreState( data ) {

		if ( !data ) return
		this.prideState        = data.prideState ?? null
		this.performanceShame = data.performanceShame ?? 0

	}

}
