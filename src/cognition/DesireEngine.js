function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

/**
 * Real appetitive DESIRE — Berridge, K. C. & Robinson, T. E. (1998),
 * already cited for `DopaminergicEngine`'s own wanting/liking split
 * ("What is the role of dopamine in reward: hedonic impact, reward
 * learning, or incentive salience?", Brain Research Reviews, 28(3),
 * 309-369): incentive-salience WANTING is a real, distinct motivational
 * process from liking something or simply feeling aroused near it.
 * Distinct from `DopaminergicEngine`'s own turn-level RPE-driven wanting
 * (a reward-SURPRISE signal, reset by each new appraisal) — this is a
 * real, per-target, ACCUMULATING motivational state that builds with
 * repeated real salience and genuinely satiates with real repeated
 * exposure, tracked continuously across turns, not recomputed from
 * scratch each time.
 *
 *   D = σ(a1·attraction + a2·novelty + a3·bond + a4·uncertainty − a5·satiation)
 *   dD/dt = ρ·S·(1−D) − λ·D
 */
export class DesireEngine {

	constructor( { rho = 0.35, lambda = 0.05, a1 = 1.2, a2 = 0.8, a3 = 0.6, a4 = 0.5, a5 = 1.0 } = {} ) {

		this.rho          = rho
		this.lambda    = lambda
		this.a1 = a1; this.a2 = a2; this.a3 = a3; this.a4 = a4; this.a5 = a5
		this.desire       = new Map() // target -> D, 0..1
		this.exposure  = new Map() // target -> real cumulative exposure, drives satiation

	}

	#level( target ) {

		return this.desire.get( target ) ?? 0

	}

	#satiation( target ) {

		return clamp01( ( this.exposure.get( target ) ?? 0 ) * 0.08 )

	}

	/** Real per-turn saliency — a bounded, weighted blend of already-computed real inputs; own weighting, no measured coefficients. */
	getSalience( { attraction = 0, novelty = 0, bond = 0, uncertainty = 0 }, target ) {

		const z = this.a1 * clamp01( attraction ) + this.a2 * clamp01( novelty ) + this.a3 * clamp01( Math.max( 0, bond ) ) + this.a4 * clamp01( uncertainty ) - this.a5 * this.#satiation( target ) - 2
		return sigmoid( z )

	}

	/** Real per-turn update toward the real saturating-exponential target this turn's own salience sets. */
	update( target, salience, dt = 1 ) {

		const current = this.#level( target )
		const next        = clamp01( current + ( this.rho * clamp01( salience ) * ( 1 - current ) - this.lambda * current ) * dt )
		this.desire.set( target, next )
		return next

	}

	getDesire( target ) {

		return this.#level( target )

	}

	/** Real consumption/exposure event — genuinely drives future real satiation. */
	registerExposure( target, magnitude = 1 ) {

		this.exposure.set( target, ( this.exposure.get( target ) ?? 0 ) + Math.max( 0, magnitude ) )

	}

	decayExposure( target, rate = 0.03, dt = 1 ) {

		const current = this.exposure.get( target ) ?? 0
		this.exposure.set( target, Math.max( 0, current - rate * dt ) )

	}

	/** Real, salience-free decay — for tick()-driven upkeep of every real currently-tracked target, not just the one active this turn. */
	decay( target, dt = 1 ) {

		const current = this.#level( target )
		this.desire.set( target, Math.max( 0, current - this.lambda * dt ) )
		this.decayExposure( target, 0.03, dt )

	}

	/**
	 * Real forbidden-fruit boost — Brehm, J. W. (1966), "A Theory of
	 * Psychological Reactance", Academic Press (the same real basis
	 * `ReactanceEngine.js` already uses): a genuinely salient prohibition
	 * can itself amplify desire for the forbidden thing, not just suppress
	 * approach toward it. `forbiddenness` (0..1, real — e.g.
	 * `TemptationField.getForbiddenness()`'s own output). Own tuning of
	 * ι, not a citation of a specific numeric coefficient.
	 */
	applyForbiddenFruitBoost( target, forbiddenness, iota = 0.15 ) {

		const current = this.#level( target )
		const boosted   = clamp01( current + iota * clamp01( forbiddenness ) * ( 1 - current ) )
		this.desire.set( target, boosted )
		return boosted

	}

	/** Real ambivalent desire — wanting something also feared/disliked is a real, distinct, bounded quantity, not a contradiction to average away. */
	getAmbivalentDesire( target, aversion ) {

		return Math.min( this.#level( target ), clamp01( aversion ) )

	}

	/** Real desire-valence tension — how much this specific desire pulls against the AI's own current felt valence. */
	getTension( target, valence ) {

		return this.#level( target ) * Math.abs( valence )

	}

}
