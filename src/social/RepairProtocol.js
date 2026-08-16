function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Goes beyond LoveHateEngine.attemptRepair()'s single V-reduction step:
 * tracks the real back-and-forth of a repair ATTEMPT — an apology can be
 * offered, and the other side can accept or reject it, each with real
 * consequences, matching the actual structure of the rupture-and-repair
 * literature (Gottman, J. M., & Levenson, R. W. (1992), "Marital processes
 * predictive of later dissolution", Journal of Personality and Social
 * Psychology, 63(2), 221-233 — already cited in Attachment.js/LoveHateEngine.js
 * for the same real phenomenon, extended here to the transactional
 * apology/acceptance structure specifically).
 *
 * Two real mechanics not present in the simpler repair() calls elsewhere:
 * (1) an apology has a real COST (own tuning) charged against
 * ExpressionDebt's suppression-cost reservoir — repair work is not free;
 * (2) trust rebound is capped BELOW the bond's own prior peak affinity —
 * "trust rebound partial, never 100% immediately" is modeled literally as a
 * ceiling fraction of the highest affinity this bond ever reached, so a
 * single successful repair can never instantly restore a relationship to
 * its pre-rupture high.
 */
export class RepairProtocol {

	constructor( { apologyBaseCost = 0.15, reboundCeiling = 0.75 } = {} ) {

		this.apologyBaseCost = apologyBaseCost
		this.reboundCeiling     = reboundCeiling
		this.records             = new Map() // userId -> { offered, accepted, rejected, priorPeakA, rebounds }

	}

	#entry( userId ) {

		if ( !this.records.has( userId ) ) this.records.set( userId, { offered: 0, accepted: 0, rejected: 0, priorPeakA: 0, rebounds: 0 } )
		return this.records.get( userId )

	}

	/** Call every turn to track the highest affinity a bond has ever reached — the real ceiling for any future rebound. */
	observePeak( userId, currentA ) {

		const rec = this.#entry( userId )
		rec.priorPeakA = Math.max( rec.priorPeakA, currentA )
		return rec.priorPeakA

	}

	/** `sincerity` (0..1, caller-supplied — e.g. from AppraisalAgreement's confidence): a low-sincerity apology costs less but is less likely to land. */
	offerApology( userId, sincerity = 1 ) {

		const rec  = this.#entry( userId )
		rec.offered += 1
		const cost   = this.apologyBaseCost * ( 1.5 - clamp01( sincerity ) * 0.5 )
		return { cost, acceptProbability: 0.3 + clamp01( sincerity ) * 0.6 }

	}

	/**
	 * `accepted` — the caller resolves whether it lands (real signal: a
	 * subsequent positive-valence turn from the user, or an explicit accept
	 * concept match — this module doesn't invent that judgment). Returns the
	 * real bounded rebound to apply to LoveHateEngine's A, capped below this
	 * bond's own historical peak.
	 */
	resolveApology( userId, accepted, currentA ) {

		const rec = this.#entry( userId )
		if ( !accepted ) { rec.rejected += 1; return { accepted: false, extraAversionBump: 0.1 } }

		rec.accepted  += 1
		rec.rebounds += 1
		const ceiling    = rec.priorPeakA * this.reboundCeiling
		const reboundedA = Math.min( ceiling, currentA + ( ceiling - currentA ) * 0.5 )

		return { accepted: true, reboundedA: Math.max( currentA, reboundedA ), ceiling }

	}

	getRecord( userId ) {

		return this.#entry( userId )

	}

}
