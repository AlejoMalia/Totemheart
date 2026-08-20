function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real Comparison Level for Alternatives (CLalt) — the real, central engine
 * of Rusbult's Investment Model of Commitment (Rusbult, C. E. (1980),
 * "Commitment and satisfaction in romantic associations: A test of the
 * investment model", Journal of Experimental Social Psychology, 16(2),
 * 172-186; building on the interdependence theory already cited elsewhere
 * in this codebase, Kelley, H. H. & Thibaut, J. W. (1978)) — the real,
 * well-established finding that real relationship commitment is NOT just a
 * function of satisfaction or accumulated investment (`CommitmentDevice`'s
 * own existing territory): it's satisfaction AND investment weighed
 * against a genuinely separate real third term — how good the best real
 * alternative looks. The identical satisfaction level produces very
 * different real commitment depending on whether the perceived alternative
 * is worse or better than the current relationship.
 *
 *   commitment = satisfaction + investment − CLalt
 */
export class ComparisonLevelAlternatives {

	constructor( { alternativeDecay = 0.1 } = {} ) {

		this.alternativeDecay = alternativeDecay
		this.perceivedAlternativeQuality = new Map() // userId -> real EMA of how good the best known alternative to THIS relationship looks

	}

	/** `alternativeQualitySignal` (0..1, a real, observed signal this turn that a genuine alternative exists/looks appealing — e.g. another relationship, another option). */
	observeAlternative( userId, alternativeQualitySignal ) {

		const current = this.perceivedAlternativeQuality.get( userId ) ?? 0
		this.perceivedAlternativeQuality.set( userId, clamp01( current * ( 1 - this.alternativeDecay ) + clamp01( alternativeQualitySignal ) * this.alternativeDecay ) )

	}

	getCLalt( userId ) {

		return this.perceivedAlternativeQuality.get( userId ) ?? 0

	}

	/** `satisfaction` (0..1, real current relational satisfaction, e.g. LoveHateEngine affinity), `investment` (0..1, real accumulated investment, e.g. CommitmentDevice's own tracked magnitude). Real, bounded commitment — genuinely lower when a real, appealing alternative exists, even with identical satisfaction/investment. */
	getCommitment( userId, satisfaction, investment ) {

		const clAlt = this.getCLalt( userId )
		return clamp01( clamp01( satisfaction ) * 0.5 + clamp01( investment ) * 0.3 - clAlt * 0.4 )

	}

	decay( userId, dt = 1 ) {

		const current = this.perceivedAlternativeQuality.get( userId )
		if ( current !== undefined ) this.perceivedAlternativeQuality.set( userId, current * Math.pow( 1 - this.alternativeDecay * 0.3, dt ) )

	}

}
