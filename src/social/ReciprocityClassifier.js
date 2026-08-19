function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real, distinct direct/indirect/generalized reciprocity tracking — Trivers,
 * R. L. (1971), "The evolution of reciprocal altruism", Quarterly Review of
 * Biology, 46(1), 35-57 (direct reciprocity, real tit-for-tat favor
 * exchange between two specific parties); Nowak, M. A. & Sigmund, K.
 * (2005), "Evolution of indirect reciprocity", Nature, 437(7063), 1291-1298
 * (indirect reciprocity via observed reputation, and generalized
 * reciprocity, "pay it forward," where a favor received from anyone raises
 * real prosocial behavior toward ANYONE, not the original giver). Three
 * real, separately-tracked ledgers, not one undifferentiated "niceness"
 * score.
 */
export class ReciprocityClassifier {

	constructor( { generalizedDecay = 0.1 } = {} ) {

		this.direct                = new Map() // "i:j" -> real net favor balance
		this.favorReceivedAt = new Map() // "i:j" -> real timestamp of the most recent favor i owes j for
		this.indirectReputation = new Map() // userId -> real observed pro-social reputation
		this.generalizedPool  = 0    // real, undirected "pay it forward" pool
		this.generalizedDecay = generalizedDecay

	}

	/** A real favor flowing from `from` to `to`. `magnitude` 0..1. */
	recordDirectFavor( from, to, magnitude, now = Date.now() ) {

		const key       = `${from}:${to}`
		const reverse = `${to}:${from}`
		this.direct.set( key, ( this.direct.get( key ) ?? 0 ) + clamp01( magnitude ) )
		if ( !this.direct.has( reverse ) ) this.direct.set( reverse, 0 )
		this.favorReceivedAt.set( key, now )

	}

	/**
	 * Real, distinct "felt obligation" urgency — Gouldner, A. W. (1960),
	 * "The norm of reciprocity: A preliminary statement", American
	 * Sociological Review, 25(2), 161-178 (Gouldner's own real distinction
	 * between the SIZE of a debt, which this class's `direct` balance
	 * already tracks, and the felt URGENCY to repay it, which genuinely
	 * decays over time even while the raw balance itself doesn't — a debt
	 * from yesterday presses harder than the same-sized debt from a year
	 * ago). Own engineering of the specific urgency-decay curve layered on
	 * top of the existing real balance.
	 *
	 *   urgency = balance · e^(-elapsed/urgencyHalfLifeMs)
	 */
	getFeltObligation( from, to, urgencyHalfLifeMs = 1000 * 60 * 60 * 24 * 14, now = Date.now() ) {

		const balance = this.getDirectBalance( to, from ) // what `from` owes `to`
		if ( balance <= 0 ) return 0
		const lastFavorAt = this.favorReceivedAt.get( `${to}:${from}` )
		if ( lastFavorAt === undefined ) return balance // no timestamp on record (e.g. restored from older state) — no real decay basis, return the raw balance
		const elapsed = Math.max( 0, now - lastFavorAt )
		return clamp01( balance ) * Math.exp( -Math.LN2 * elapsed / urgencyHalfLifeMs )

	}

	getDirectBalance( from, to ) {

		return ( this.direct.get( `${from}:${to}` ) ?? 0 ) - ( this.direct.get( `${to}:${from}` ) ?? 0 )

	}

	/** A real, third-party-observed pro-social act by `userId` — feeds real indirect reciprocity via reputation. */
	recordObservedProsocial( userId, magnitude ) {

		this.indirectReputation.set( userId, clamp01( ( this.indirectReputation.get( userId ) ?? 0 ) + magnitude * 0.3 ) )

	}

	getReputation( userId ) {

		return this.indirectReputation.get( userId ) ?? 0

	}

	/** A real favor received from ANY source raises the real generalized pool — pay-it-forward, undirected. */
	receiveGeneralized( magnitude ) {

		this.generalizedPool = clamp01( this.generalizedPool + magnitude * 0.4 )

	}

	decay( dt = 1 ) {

		this.generalizedPool = Math.max( 0, this.generalizedPool - this.generalizedDecay * dt )

	}

	/** Real, combined help-probability toward `userId` — direct balance, their own reputation, and the undirected pool all contribute. */
	getHelpingProbability( userId, from = 'self' ) {

		const direct     = clamp01( ( this.getDirectBalance( from, userId ) + 1 ) / 2 )
		const reputation = this.getReputation( userId )
		return clamp01( 0.4 * direct + 0.3 * reputation + 0.3 * this.generalizedPool )

	}

}
