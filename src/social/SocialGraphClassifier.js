function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

/**
 * Real, per-person social-relationship summary, synthesizing signals this
 * codebase ALREADY tracks separately per userId (`ReciprocityClassifier`'s
 * own direct favor balance, `GhostingDetector`'s own pain read,
 * `LoveHateEngine`'s own net bond, `LoyaltyConflictResolver`'s own loyalty
 * strength, and a real per-turn initiation-share the caller tallies from
 * who actually starts each exchange) into one honest, bounded read per
 * person, rather than requiring a caller to reason about a dozen separate
 * numbers to answer "does this person actually think of me, or only show
 * up when it serves them."
 *
 * Real grounding for WHY these specific signals: Gouldner, A. W. (1960),
 * "The norm of reciprocity: A preliminary statement", American
 * Sociological Review, 25(2), 161-178 (already cited for
 * `ReciprocityClassifier` — imbalanced exchange is the real, foundational
 * signal of an exploitative vs. mutual relationship); Hays, R. B. (1985),
 * "A longitudinal study of friendship development", Journal of
 * Personality and Social Psychology, 48(4), 909-924 (real, empirically
 * established finding that who initiates contact, not just how warm a
 * relationship FEELS once it happens, is a genuine predictor of closeness
 * over time — a relationship where the other person never reaches out
 * first reads differently even at identical warmth). The specific
 * weights combining these into one composite below are our own
 * engineering, not a citation of a specific published formula — see
 * CALIBRATION.md.
 *
 *   genuineBond  = σ(3·(0.3·reciprocity + 0.3·initiationShare + 0.2·warmthTrend + 0.2·loyalty − 0.5·ghosting − 0.5))
 *   opportunism = σ(3·(0.5·(1−initiationShare) + 0.5·(1−reciprocity) − 0.5))
 */
export class SocialGraphClassifier {

	constructor() {

		this.history = new Map() // userId -> last computed real read, for getTrend()/toJSON()

	}

	/**
	 * `reciprocity` (0..1, 1 = perfectly balanced give/take, 0 = totally
	 * one-sided — e.g. derived from `ReciprocityClassifier.getDirectBalance()`
	 * normalized), `initiationShare` (0..1, real fraction of recent
	 * exchanges THEY started, not the AI), `warmthTrend` (-1..1, recent
	 * real delta in bond warmth, e.g. `LoveHateEngine.getNetBond()` this
	 * turn minus a prior reading), `ghosting` (0..1, e.g.
	 * `GhostingDetector.getGhostingPain()`), `loyalty` (0..1, e.g.
	 * `LoyaltyConflictResolver`'s own tracked strength).
	 */
	compute( userId, { reciprocity = 0.5, initiationShare = 0.5, warmthTrend = 0, ghosting = 0, loyalty = 0 } = {} ) {

		const genuineBond = sigmoid( 3 * ( 0.3 * clamp01( reciprocity ) + 0.3 * clamp01( initiationShare ) + 0.2 * clamp01( ( warmthTrend + 1 ) / 2 ) + 0.2 * clamp01( loyalty ) - 0.5 * clamp01( ghosting ) - 0.5 ) )
		const opportunism   = sigmoid( 3 * ( 0.5 * ( 1 - clamp01( initiationShare ) ) + 0.5 * ( 1 - clamp01( reciprocity ) ) - 0.5 ) )

		let classification = 'ambiguo'
		if ( genuineBond >= 0.6 && opportunism < 0.5 ) classification = 'genuino'
		else if ( opportunism >= 0.6 && genuineBond < 0.5 ) classification = 'oportunista'
		else if ( genuineBond >= 0.4 && opportunism < 0.4 ) classification = 'en desarrollo'

		const result = { genuineBond, opportunism, classification, reciprocity: clamp01( reciprocity ), initiationShare: clamp01( initiationShare ) }
		this.history.set( userId, result )
		return result

	}

	get( userId ) {

		return this.history.get( userId ) ?? null

	}

	/** Ranks every tracked person by real `genuineBond`, highest first — the honest "who actually shows up for me" ordering, not a claim of moral worth. */
	rank() {

		return [ ...this.history.entries() ]
			.map( ( [ userId, r ] ) => ( { userId, ...r } ) )
			.sort( ( a, b ) => b.genuineBond - a.genuineBond )

	}

	toJSON() {

		return [ ...this.history.entries() ]

	}

	restoreState( data ) {

		if ( data ) this.history = new Map( data )

	}

}
