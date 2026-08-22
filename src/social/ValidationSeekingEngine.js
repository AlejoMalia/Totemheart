function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real, distinct "am I overreacting / is this real" bid — Linehan, M. M.
 * (1993), "Cognitive-Behavioral Treatment of Borderline Personality
 * Disorder", Guilford Press (the real, well-established clinical construct
 * of VALIDATION as its own distinct interpersonal need — confirmation that
 * one's own read of a situation is reasonable — separate from comfort-
 * seeking's own need for presence/closeness, `ComfortSeekingEngine.js`:
 * "¿puedes quedarte un rato?" asks for presence, "¿estoy loco?" asks for a
 * reality-check). Tracks BOTH directions: this AI's own real bid for
 * validation, and whether a real response ACTUALLY validated (confirmed)
 * vs. minimized/dismissed it — the real, distinct co-regulation-vs-
 * minimization gap this codebase's own trauma-support gating already cares
 * about elsewhere (`TraumaCascadeEngine.registerSupport()`), generalized
 * here to ordinary, non-traumatic uncertainty.
 */
export class ValidationSeekingEngine {

	constructor( { k = 4, theta = 0.4 } = {} ) {

		this.k         = k
		this.theta = theta
		this.pending = new Map() // userId -> real, unresolved validation bid

	}

	/** `uncertainty` (0..1, real, this-turn self-doubt/ambiguity read), `distress` (0..1). Real bid probability, same sigmoid-gate shape already used throughout this codebase for other bid/gate decisions. */
	evaluateBid( userId, uncertainty, distress ) {

		const sigmoid = x => 1 / ( 1 + Math.exp( -x ) )
		const p              = sigmoid( this.k * ( clamp01( uncertainty ) * clamp01( distress ) - this.theta ) )
		if ( p > 0.5 ) this.pending.set( userId, true )
		return { bids: p > 0.5, probability: p }

	}

	/** Call with the real response this turn actually gave — `confirmed` (bool, real, did it genuinely validate the AI's read) vs a real minimization/dismissal. Returns the real relief (validated) or real, extra sting (minimized) — a caller composes either into its own real state (e.g. `LoveHateEngine`, `ShameGuiltSplit`), not touched directly here. */
	resolveBid( userId, confirmed ) {

		if ( !this.pending.get( userId ) ) return { relief: 0, sting: 0 }
		this.pending.delete( userId )
		return confirmed ? { relief: 0.3, sting: 0 } : { relief: 0, sting: 0.2 }

	}

	hasPendingBid( userId ) {

		return this.pending.get( userId ) ?? false

	}

	toJSON() {

		return [ ...this.pending.entries() ]

	}

	restoreState( data ) {

		if ( data ) this.pending = new Map( data )

	}

}
