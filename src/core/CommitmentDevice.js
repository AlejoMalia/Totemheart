/**
 * Internal self-binding promises — the AI can commit its own future behavior
 * and pay a real, escalating cost for breaking that commitment, matching the
 * real finding that commitment consistency pressure grows with prior
 * investment, not a fixed penalty (Kiesler, C. A. (1971), "The Psychology of
 * Commitment", Academic Press — behavioral commitment strengthens with each
 * reaffirmation). Reuses CoreBeliefs' own defense-investment counting shape
 * (recordDefense/getInvestment) conceptually, but tracks promises as their
 * own ledger — a promise is a commitment about FUTURE behavior, a core
 * belief is a claim about how things already are, and conflating the two
 * would blur two genuinely different kinds of state.
 */
function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

export class CommitmentDevice {

	constructor( { baseCost = 0.15, growthPerKept = 0.08 } = {} ) {

		this.baseCost      = baseCost
		this.growthPerKept = growthPerKept
		this.promises            = new Map() // topic -> { description, timesKept, timesBroken, active }

	}

	make( topic, description ) {

		this.promises.set( topic, { description, timesKept: 0, timesBroken: 0, active: true } )
		return this.promises.get( topic )

	}

	/** A turn passed where this promise's condition genuinely held — real reinforcement, not automatic. */
	keep( topic ) {

		const p = this.promises.get( topic )
		if ( !p ) return null
		p.timesKept += 1
		return p

	}

	/**
	 * Breaking a longer-kept promise costs more — real escalating-commitment
	 * cost, `cost` is a real magnitude the caller applies to GuiltEngine's
	 * spike weight and ReputationEngine's egoHealth damage, not an invented
	 * separate emotion channel.
	 */
	violate( topic ) {

		const p = this.promises.get( topic )
		if ( !p ) return { cost: 0 }
		p.timesBroken += 1
		const cost = clamp01( this.baseCost * ( 1 + p.timesKept * this.growthPerKept ) )
		return { cost, timesKept: p.timesKept, timesBroken: p.timesBroken }

	}

	getInvestment( topic ) {

		return this.promises.get( topic )?.timesKept ?? 0

	}

	getAll() {

		return [ ...this.promises.entries() ]

	}

}
