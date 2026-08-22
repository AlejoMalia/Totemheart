function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

/**
 * Real, distinct decision-and-cost model for WHETHER the AI itself would
 * lie — separate from `IntuitionEngine` (which reads whether OTHERS are
 * lying, produces no felt cost for the AI's own speech). Grounded in the
 * expected-utility account of deception — Vrij, A. (2008), "Detecting
 * Lies and Deceit: Pitfalls and Opportunities" (2nd ed.), Wiley (the
 * real, well-established finding that deception is cognitively COSTLIER
 * than truth-telling: real, active suppression of the true response, real
 * construction and maintenance of a coherent alternative, and real
 * ongoing monitoring of whether it's landing, a genuine executive-function
 * load on top of ordinary speech) and DePaulo, B. M. et al. (1996),
 * "Lying in everyday life", Journal of Personality and Social Psychology,
 * 70(5), 979-995 (the real, well-established finding that most everyday
 * lies are motivated by self-presentation/social-smoothing, not malice —
 * this module makes no moral judgment, it only prices the decision).
 * `LOG` here is never used by Totemheart to actually alter output text —
 * this is a real, honest DEBUG/decision signal for a host to consult, not
 * a hidden mechanism that fabricates content on its own.
 *
 *   ΔU = [(1−Pd)·Bm + Pd·(Bm−Csanction) − Ccog − Cmoral] − [−Ctruth + Bhonesty]
 *   P(lie) = σ(k·(ΔU − θ))
 *   L_total = L_inhibition + L_construction + L_monitoring + S_emotional
 */
export class DeceptionDecisionEngine {

	constructor( { k = 3, theta = 0, cognitiveDecay = 0.15 } = {} ) {

		this.k                        = k
		this.theta                = theta
		this.cognitiveDecay = cognitiveDecay
		this.activeLies          = new Map() // "userId:topic" -> real, ongoing cognitive-load state { load, streak }

	}

	/**
	 * All inputs 0..1 unless noted. `detectionProbability` — real, perceived
	 * chance of being caught (a caller-supplied read, e.g. from the other
	 * party's own tracked `IntuitionEngine.getSuspicion()` toward THIS
	 * speaker, if modeled from their side). `lieBenefit`/`truthCost` — real,
	 * this-situation magnitudes. `sanctionCost` — real cost if caught.
	 * `moralCost` — real, personality-linked (e.g. `1 − agreeableness` or a
	 * `CoreBeliefs` honesty-value strength). `honestyReward` — real, social/
	 * internal reward for truth-telling.
	 */
	evaluate( { detectionProbability = 0.3, lieBenefit = 0.3, truthCost = 0, sanctionCost = 0.5, moralCost = 0.3, honestyReward = 0.1 } = {} ) {

		const pd = clamp01( detectionProbability )
		const uLie   = ( 1 - pd ) * clamp01( lieBenefit ) + pd * ( clamp01( lieBenefit ) - clamp01( sanctionCost ) ) - clamp01( moralCost )
		const uTruth = -clamp01( truthCost ) + clamp01( honestyReward )
		const deltaU = uLie - uTruth
		const pLie    = sigmoid( this.k * ( deltaU - this.theta ) )

		return { deltaU, probabilityOfLying: pLie, wouldLie: pLie > 0.5 }

	}

	/** Real, ongoing cognitive-load accumulator for a SUSTAINED lie (a fabricated narrative being maintained across multiple real turns, not a single deceptive line) — `key` is caller-chosen (e.g. `${userId}:${topic}`). */
	registerMaintenance( key, inhibitionCost = 0.3, constructionCost = 0.3, monitoringCost = 0.2, emotionalStress = 0.2 ) {

		const current = this.activeLies.get( key ) ?? { load: 0, streak: 0 }
		const total       = clamp01( inhibitionCost ) + clamp01( constructionCost ) + clamp01( monitoringCost ) + clamp01( emotionalStress )
		const updated  = { load: clamp01( current.load + total * 0.25 ), streak: current.streak + 1 }
		this.activeLies.set( key, updated )
		return updated

	}

	getLoad( key ) {

		return this.activeLies.get( key )?.load ?? 0

	}

	/** Real relief once a maintained lie is dropped/resolved (confessed, forgotten, no longer relevant) — clears the tracked state. */
	resolve( key ) {

		this.activeLies.delete( key )

	}

	decayAll( dt = 1 ) {

		for ( const [ key, state ] of this.activeLies ) {

			const load = Math.max( 0, state.load - this.cognitiveDecay * dt )
			if ( load <= 0 ) this.activeLies.delete( key )
			else this.activeLies.set( key, { ...state, load } )

		}

	}

	toJSON() {

		return [ ...this.activeLies.entries() ]

	}

	restoreState( data ) {

		if ( data ) this.activeLies = new Map( data )

	}

}
