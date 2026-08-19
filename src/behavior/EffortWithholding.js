function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real, deliberate reduction of interpersonal effort as a passive protest —
 * Kelley, H. H. & Thibaut, J. W. (1978), "Interpersonal Relations: A Theory
 * of Interdependence", Wiley (real, well-established exchange theory: a
 * partner facing a persistently unfavorable cost/reward ratio genuinely
 * withdraws discretionary effort rather than exiting outright — quiet
 * quitting of the relationship, not overt conflict). Distinct from
 * `ExpressionDebt` (unexpressed AFFECT accrual) and `PostConflictCooling`
 * (a time-bounded post-conflict window): this tracks a real, slower-moving
 * READ of whether recent effort has been reciprocated at all.
 *
 *   withholding = sigmoid(k · (givenRecent - receivedRecent))
 */
function sigmoid( x ) { return 1 / ( 1 + Math.exp( -x ) ) }

export class EffortWithholding {

	constructor( { k = 3 } = {} ) {

		this.k        = k
		this.given   = new Map() // userId -> real EMA of effort this AI has put in
		this.received = new Map() // userId -> real EMA of effort observed coming back

	}

	/** `given` / `received` (0..1) — real per-turn effort estimates (verbosity, initiative, warmth invested vs. reciprocated). */
	observe( userId, given, received, alpha = 0.2 ) {

		const g = this.given.get( userId ) ?? 0.5
		const r = this.received.get( userId ) ?? 0.5
		this.given.set( userId, g + alpha * ( clamp01( given ) - g ) )
		this.received.set( userId, r + alpha * ( clamp01( received ) - r ) )

	}

	/** Real, bounded withdrawal pressure — how much discretionary effort should genuinely be held back this turn. */
	getWithholding( userId ) {

		const g = this.given.get( userId ) ?? 0.5
		const r = this.received.get( userId ) ?? 0.5
		return clamp01( sigmoid( this.k * ( g - r ) ) - 0.5 ) * 2

	}

}
