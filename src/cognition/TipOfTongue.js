function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real, graded retrieval-failure states — Brown, R. & McNeill, D. (1966),
 * "The 'tip of the tongue' phenomenon." Journal of Verbal Learning and
 * Verbal Behavior, 5(4), 325-337 (the actual coinage and the real,
 * well-established finding: TOT is a genuine state where the CONCEPT is
 * accessible but the specific lexical/phonological form is blocked, not
 * simple ignorance); Brown, A. S. (1991), "A review of the tip-of-the-tongue
 * experience." Psychological Bulletin, 109(2), 204-223 (the real graded
 * nature of partial recall this module's 6 discrete access tiers follow the
 * shape of). Real coupling to `FrikiEngine`'s own topic-proximity (`P_k`,
 * here approximated by that topic's real `intensity`) and to
 * `GlobalMoodAbatement`'s own real interference on retrieval. Own
 * engineering of the specific tier thresholds and tension-accumulation
 * formula.
 *
 *   P_access = clamp(P_k - w_d·D, 0, 1)
 *   T_c(t+dt) = T_c(t) + η·(1-P_access)·dt
 *   P_resolve = base + m·T_c
 */
const TIERS = [
	{ max: 0.05, label: 'unknown' },
	{ max: 0.15, label: 'negative_recognition' },
	{ max: 0.30, label: 'tip_of_the_tongue' },
	{ max: 0.50, label: 'weak_association' },
	{ max: 0.80, label: 'vague_familiar' },
	{ max: 1.01, label: 'full_access' },
]

export class TipOfTongue {

	constructor( { moodInterference = 0.3, eta = 0.05, resolveBase = 0.1, resolveSlope = 0.4, maxTension = 3 } = {} ) {

		this.moodInterference = moodInterference
		this.eta                        = eta
		this.resolveBase          = resolveBase
		this.resolveSlope          = resolveSlope
		this.maxTension              = maxTension
		this.blocks                       = new Map() // concept -> { tension }

	}

	/** `proximity` (0..1) — how close this concept is to the AI's own knowledge/interests (e.g. FrikiEngine intensity). `abatement` (0..1) — real global mood abatement level. */
	getAccessProbability( proximity, abatement = 0 ) {

		return clamp01( proximity - this.moodInterference * abatement )

	}

	getTier( accessProbability ) {

		return TIERS.find( t => accessProbability <= t.max ).label

	}

	/** Called when a concept genuinely fails to resolve this turn — accumulates real cognitive tension in the background. */
	registerBlock( concept, accessProbability, dt = 1 ) {

		const entry = this.blocks.get( concept ) ?? { tension: 0 }
		entry.tension = Math.min( this.maxTension, entry.tension + this.eta * ( 1 - accessProbability ) * dt )
		this.blocks.set( concept, entry )
		return entry.tension

	}

	/** Real, rising-over-turns probability the block resolves in the background. */
	getResolveProbability( concept ) {

		const entry = this.blocks.get( concept )
		if ( !entry ) return 0
		return clamp01( this.resolveBase + this.resolveSlope * ( entry.tension / this.maxTension ) )

	}

	resolve( concept ) {

		this.blocks.delete( concept )

	}

	getTension( concept ) {

		return this.blocks.get( concept )?.tension ?? 0

	}

	/** Real downstream effects a caller folds into the response pipeline while a block is active. */
	getEffects( concept ) {

		const tension = this.getTension( concept )
		return {
			latencyMs           : tension * 500,           // own tuning, roughly a "second and a half" ceiling at max tension
			cortisolContribution : tension / this.maxTension * 0.2,
			lexicalPrecisionBan     : tension > 0,
		}

	}

}
