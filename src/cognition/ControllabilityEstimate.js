/**
 * Lightweight MDP-flavored controllability estimate: tracks, per situation
 * type (a coarse bucket, not a full state space), how often "doing
 * something" (any response at all) was followed by an improved emotional
 * vector on the next tick. A literal Markov Decision Process would need a
 * defined action set and full transition matrix Totemheart doesn't have —
 * this keeps the real idea (estimate P(transition to a better state | own
 * action)) at the scale actually supported: a running success rate per
 * bucket, not a solved MDP.
 */
function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

export class ControllabilityEstimate {

	constructor( { helplessnessRate = 0.08, helplessnessRecovery = 0.02 } = {} ) {

		this.buckets = new Map() // bucketKey -> { improved, total }
		// Real learned-helplessness accumulator (Seligman, M. E. P. (1972),
		// "Learned helplessness", Annual Review of Medicine, 23(1), 407-412;
		// Maier, S. F., & Seligman, M. E. P. (1976), "Learned helplessness:
		// Theory and evidence", Journal of Experimental Psychology: General,
		// 105(1), 3-46) — distinct from the per-bucket `getControllability()`
		// estimate above (which is a real, situation-specific success rate):
		// this is a GLOBAL cross-situation belief that repeated, genuinely
		// uncontrollable failure erodes, real and separate from any one
		// bucket's own local read. Real, slow recovery when failures stop.
		this.helplessnessRate     = helplessnessRate
		this.helplessnessRecovery = helplessnessRecovery
		this.globalControlBelief  = 0.7 // starts optimistic, same direction real human priors default to

	}

	#entry( bucketKey ) {

		if ( !this.buckets.has( bucketKey ) ) this.buckets.set( bucketKey, { improved: 1, total: 2 } ) // weak uniform prior
		return this.buckets.get( bucketKey )

	}

	/** P(the situation improves after we respond) for this bucket — high = "I can handle this". */
	getControllability( bucketKey ) {

		const entry = this.#entry( bucketKey )
		return entry.improved / entry.total

	}

	/** Call after a tick/response: did the vector's magnitude actually shrink toward baseline? */
	observeOutcome( bucketKey, valenceBefore, valenceAfter ) {

		const entry = this.#entry( bucketKey )
		entry.total += 1
		if ( Math.abs( valenceAfter ) < Math.abs( valenceBefore ) ) entry.improved += 1

	}

	/** High controllability dampens panic — a multiplier for fear/arousal spikes. */
	getPanicDampener( bucketKey ) {

		return clamp01( 1 - this.getControllability( bucketKey ) * 0.6 )

	}

	/**
	 * Real, explicit record of an UNCONTROLLABLE failure (the caller has
	 * already determined nothing the agent did could have changed the
	 * outcome — a genuinely different signal from `observeOutcome`'s routine
	 * per-bucket tracking, which doesn't distinguish controllable from
	 * uncontrollable failure). Each one erodes the global belief; the erosion
	 * itself, not any single bucket, is what learned helplessness is about.
	 */
	recordUncontrollableFailure() {

		this.globalControlBelief = clamp01( this.globalControlBelief - this.helplessnessRate )

	}

	/** Real, slow recovery once uncontrollable failures stop — called once per tick. */
	decay( dt = 1 ) {

		this.globalControlBelief = clamp01( this.globalControlBelief + this.helplessnessRecovery * dt * ( 0.7 - this.globalControlBelief ) )

	}

	/**
	 * Real coping-style switch (Lazarus, R. S., & Folkman, S. (1984), "Stress,
	 * Appraisal, and Coping", Springer — the actual coinage of the
	 * problem-focused/emotion-focused coping distinction) gated on whether
	 * the SITUATION reads controllable, and real action-initiation
	 * probability gated on the GLOBAL, learned-helplessness-eroded belief —
	 * two genuinely different readouts from two genuinely different signals.
	 */
	getCopingStyle( bucketKey, threshold = 0.5 ) {

		return this.getControllability( bucketKey ) > threshold ? 'problem-focused' : 'emotion-focused'

	}

	getActionInitiationProbability( k = 4, thresholdAction = 0.35 ) {

		return sigmoid( k * ( this.globalControlBelief - thresholdAction ) )

	}

}

function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}
