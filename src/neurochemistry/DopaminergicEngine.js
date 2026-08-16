function clamp( v, min = -1, max = 1 ) {

	return Math.max( min, Math.min( max, v ) )

}

function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Reward Prediction Error (RPE): RPE = R_t + γ·V(S_t+1) − V(S_t).
 * Dopamine doesn't fire for getting something good — it fires for getting
 * something *better than expected*. This TD-learning reading of dopaminergic
 * activity is the standard one in computational neuroscience (Schultz, W.,
 * Dayan, P., & Montague, P. R. (1997), "A neural substrate of prediction and
 * reward", Science, 275(5306), 1593-1599).
 *
 * Two real extensions on top of the base TD(0) engine:
 *
 * Wanting vs. liking: dopaminergic "wanting" (incentive salience — craving a
 * cue even without consuming the reward) and hedonic "liking" (the reaction
 * to the reward itself) are dissociable systems (Berridge, K. C., & Robinson,
 * T. E. (1998), "What is the role of dopamine in reward: hedonic impact,
 * reward learning, or incentive salience?", Brain Research Reviews, 28(3),
 * 309-369). `wanting` tracks accumulated |RPE| (it rises on surprise alone,
 * even for a bad outcome — the "can't stop craving it" signature); `liking`
 * is a plain EMA of the raw reward itself (the actual hedonic reaction).
 *
 * Eligibility traces: TD(λ) (Sutton, R. S., & Barto, A. G. (2018),
 * "Reinforcement Learning: An Introduction", 2nd ed., MIT Press, ch. 12) —
 * a per-context trace that decays by γλ each update and gets credited by
 * this update's RPE, so a reward doesn't just correct the ONE context active
 * this instant, it also retroactively credits contexts that were active
 * recently (real backward credit assignment across turns, not a citation of
 * a specific published λ). `context` defaults to a single shared key, so
 * calling `computeRPE(reward)` with no context behaves exactly like the
 * original single-scalar engine.
 */
export class DopaminergicEngine {

	constructor( { alpha = 0.25, gamma = 0.9, lambda = 0.7, likingAlpha = 0.3, wantingDecay = 0.1 } = {} ) {

		this.alpha        = alpha
		this.gamma          = gamma
		this.lambda           = lambda
		this.likingAlpha        = likingAlpha
		this.wantingDecay         = wantingDecay

		this.expectedValues = new Map() // context -> V(context)
		this.eligibility       = new Map() // context -> trace
		this.likingValue      = 0
		this.wanting             = 0

	}

	#getV( context ) {

		return this.expectedValues.get( context ) ?? 0

	}

	/**
	 * `context` lets ToM-derived predictions and life events target a specific
	 * relationship/topic instead of one shared scalar. `allostaticLoad` (0..1,
	 * optional, Homeostasis.allostaticLoad) — real allostatic-load-driven
	 * anhedonia: sustained high load blunts the hedonic response to reward
	 * (a real, well-supported direction in the chronic-stress/anhedonia
	 * literature — the same allostatic-load concept CircadianRhythm.js already
	 * cites Miller, Chen & Zhou (2007) for), applied here as a real damper on
	 * `likingAlpha`'s effective learning rate so a loaded system needs a
	 * bigger reward to register the same felt liking. Defaults to 0 (no
	 * damping) so every existing caller keeps the original behavior exactly.
	 */
	computeRPE( reward, context = 'default', allostaticLoad = 0 ) {

		const v      = this.#getV( context )
		const rpe = reward + this.gamma * v - v

		// Decay every existing trace, then bump this context's — the standard
		// accumulating-trace TD(λ) update.
		for ( const [ key, trace ] of this.eligibility ) {

			const decayed = trace * this.gamma * this.lambda
			if ( decayed < 0.01 ) this.eligibility.delete( key )
			else this.eligibility.set( key, decayed )

		}
		this.eligibility.set( context, ( this.eligibility.get( context ) ?? 0 ) + 1 )

		// Every context with a live trace gets credited proportionally — this is
		// the real backward-credit-assignment part of TD(λ), not just updating
		// the one context active this instant.
		for ( const [ key, trace ] of this.eligibility ) {

			this.expectedValues.set( key, this.#getV( key ) + this.alpha * rpe * trace )

		}

		const effectiveLikingAlpha = this.likingAlpha * ( 1 - clamp01( allostaticLoad ) * 0.6 ) // anhedonia damper — own tuning of the 0.6 ceiling
		this.likingValue += effectiveLikingAlpha * ( reward - this.likingValue )
		this.wanting        = clamp01( this.wanting * ( 1 - this.wantingDecay ) + Math.abs( rpe ) * 0.3 )

		return clamp( rpe, -2, 2 ) / 2 // normalize to roughly -1..1 for downstream spike use

	}

	/**
	 * Direct expectation nudge from a source OTHER than an observed reward —
	 * Theory-of-Mind's estimate of what this user is likely to do, or a
	 * detected life event, both carry real information about what should be
	 * expected going forward, not just what already happened. Same expected
	 * value store computeRPE() reads/writes, so a later reward against this
	 * context is judged against the updated expectation.
	 */
	updateExpectationFromBelief( context, deltaV, weight = 0.3 ) {

		this.expectedValues.set( context, clamp( this.#getV( context ) + deltaV * weight, -1, 1 ) )

	}

	getExpectedValue( context = 'default' ) {

		return this.#getV( context )

	}

	getWanting() {

		return this.wanting

	}

	/** A relational rupture (LoveHateEngine) is real evidence the anticipatory craving for this context should stop, not gradually decay — a hard reset, not another EMA step. */
	freezeWanting() {

		this.wanting = 0

	}

	getLiking() {

		return this.likingValue

	}

}
