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

	constructor() {

		this.buckets = new Map() // bucketKey -> { improved, total }

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

}
