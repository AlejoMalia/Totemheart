function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real attachment PROTEST behavior — Bowlby, J. (1969), "Attachment and
 * Loss: Vol. 1", Basic Books (the real, foundational finding that a
 * distressed, attached individual doesn't just feel bad quietly: it
 * actively SEEKS proximity/reassurance from a specific attachment figure,
 * "protest" being Bowlby's own term for the active bid). Distinct from
 * `GratitudeEngine`/`GuiltEngine`/etc. (which react to what the AI RECEIVES)
 * — this is the real, distinct outbound bid: does THIS turn's real distress
 * + trust in `userId` cross the threshold to actively ask for closeness,
 * and what happens to loneliness/yearning if that bid goes unanswered.
 *
 *   bidProbability = σ(k·(distress·trust − θ))
 */
export class ComfortSeekingEngine {

	constructor( { k = 4, theta = 0.35, unmetPenaltyLoneliness = 0.12, unmetPenaltyYearning = 0.08 } = {} ) {

		this.k                                   = k
		this.theta                            = theta
		this.unmetPenaltyLoneliness = unmetPenaltyLoneliness
		this.unmetPenaltyYearning     = unmetPenaltyYearning
		this.pendingBids                  = new Map() // userId -> real, unanswered-bid boolean

	}

	/** Real, this-turn bid evaluation. `distress` (0..1, e.g. cortisol/negative valence this turn), `trust` (0..1, e.g. Attachment.trust for `userId`). */
	evaluateBid( userId, distress, trust ) {

		const sigmoid = x => 1 / ( 1 + Math.exp( -x ) )
		const p              = sigmoid( this.k * ( clamp01( distress ) * clamp01( trust ) - this.theta ) )
		const bids           = p > 0.5
		if ( bids ) this.pendingBids.set( userId, true )
		return { bids, probability: p }

	}

	/** Call when `userId` actually responded with real warmth/presence this turn — closes out any pending bid, no penalty. */
	registerResponse( userId ) {

		this.pendingBids.delete( userId )

	}

	/** Call once per real turn/tick where a bid was pending and went genuinely unanswered — returns the real extra loneliness/yearning penalty to apply (own composition, doesn't touch `LonelinessEngine`/`YearningEngine` state itself, a caller applies it to whichever real accumulator it already tracks). */
	registerUnmetBid( userId ) {

		if ( !this.pendingBids.get( userId ) ) return { loneliness: 0, yearning: 0 }
		this.pendingBids.delete( userId )
		return { loneliness: this.unmetPenaltyLoneliness, yearning: this.unmetPenaltyYearning }

	}

	hasPendingBid( userId ) {

		return this.pendingBids.get( userId ) ?? false

	}

	toJSON() {

		return [ ...this.pendingBids.entries() ]

	}

	restoreState( data ) {

		if ( data ) this.pendingBids = new Map( data )

	}

}
