function clamp( v, lo = -1, hi = 1 ) {

	return Math.max( lo, Math.min( hi, v ) )

}

/**
 * EmotionalContagion (Kuramoto) handles short-term, per-turn synchronization
 * with the user's *current* inferred state. This tracks something different:
 * a slow, long-run EMA of a user's historical valence — a chronic pessimist
 * doesn't produce stress "spikes", they produce a gradual drag on the AI's
 * baseline. dV/dt = -k(V_AI - V_userHist) solved as one real EMA-driven pull
 * per turn (own design, no citation — a plain exponential attraction, not a
 * reproduction of any named contagion model).
 */
export class ChronicContagion {

	constructor( { alpha = 0.95, k = 0.05 } = {} ) {

		this.alpha    = alpha // EMA persistence: close to 1 = genuinely long-run, not per-turn reactive
		this.k          = k
		this.history = new Map() // userId -> EMA of inferred valence

	}

	observe( userId, valence ) {

		const prior = this.history.get( userId ) ?? 0
		this.history.set( userId, this.alpha * prior + ( 1 - this.alpha ) * valence )

	}

	getHistory( userId ) {

		return this.history.get( userId ) ?? 0

	}

	/** Real exponential-pull spike to drift the AI's own baseline toward this user's long-run valence. */
	getPull( userId, currentValence ) {

		const userHist = this.getHistory( userId )
		const delta       = -this.k * ( currentValence - userHist )
		return { delta: clamp( delta, -0.3, 0.3 ), userHist }

	}

}
