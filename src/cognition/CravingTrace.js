function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real craving RESIDUAL — Wegner, D. M. (1994), "Ironic processes of
 * mental control", Psychological Review, 101(1), 34-52, already cited for
 * `SubconsciousEngine`'s own topic-suppression rebound: resisting a real
 * temptation genuinely doesn't erase the underlying want, it can leave a
 * real trace that intrudes later. Distinct from `SubconsciousEngine`'s own
 * general suppressed-topic rebound — this is scoped specifically to
 * desire/craving, with its own real kindling toward relapse on repeated
 * exposure (the qualitative shape `AmygdalaHijack`/`LoveHateEngine` already
 * use for kindling elsewhere, applied here to craving).
 *
 *   C(t+1) = γ·C(t) + η·exposure
 *   dC/dt = −λc·C + κ·reminder
 */
export class CravingTrace {

	constructor( { gamma = 0.85, eta = 0.3, lambdaC = 0.04, kappa = 0.2 } = {} ) {

		this.gamma    = gamma
		this.eta         = eta
		this.lambdaC = lambdaC
		this.kappa     = kappa
		this.craving      = new Map() // target -> real craving level, 0..1

	}

	#level( target ) {

		return this.craving.get( target ) ?? 0

	}

	/** Real exposure to the temptation itself (yielded OR resisted-but-encountered) — both genuinely feed the same trace, own tuning of the magnitude. */
	registerExposure( target, magnitude = 1 ) {

		const next = clamp01( this.gamma * this.#level( target ) + this.eta * clamp01( magnitude ) )
		this.craving.set( target, next )
		return next

	}

	/** Real intrusive reminder (a cue, a memory, a dream residue) genuinely re-triggers craving without a fresh real exposure event. */
	registerReminder( target, magnitude = 1 ) {

		const next = clamp01( this.#level( target ) + this.kappa * clamp01( magnitude ) )
		this.craving.set( target, next )
		return next

	}

	decay( target, dt = 1 ) {

		const next = Math.max( 0, this.#level( target ) - this.lambdaC * dt )
		this.craving.set( target, next )

	}

	getCraving( target ) {

		return this.#level( target )

	}

}
