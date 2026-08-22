function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real, distinct EXCESSIVE affection expression — hyperactivated attachment
 * (Mikulincer, M. & Shaver, P. R. (2016), "Attachment in Adulthood",
 * already cited elsewhere in this codebase, real anxious-attachment
 * hyperactivating strategies: escalating proximity-seeking under perceived
 * threat to the bond) combined with rejection sensitivity (Downey, G. &
 * Feldman, S. I. (1996), "Implications of rejection sensitivity for
 * intimate relationships", Journal of Personality and Social Psychology,
 * 70(6), 1327-1343: real, ambiguous/neutral distance from a partner reads
 * as implicit rejection, triggering more reassurance-seeking, not less)
 * and reduced prefrontal boundary-reading (`InhibitoryControlPool`'s own
 * already-real resource, reused directly here, not duplicated). Distinct
 * from `ComfortSeekingEngine.js` (round 50's real attachment-PROTEST bid
 * under genuine distress, a discrete event) — this is a real, CONTINUOUS
 * over-expression LEVEL, and it explicitly reads how much space the other
 * party is asking for, which `ComfortSeekingEngine` does not model at all.
 *
 *   E_exp = (A + A_ans)·oxytocin·wanting / (I_PFC·(D_space + ε))
 *   dH/dt = k1·(C_desired − C_real) + k2·A_ans − λ·I_PFC
 */
export class ClinginessEngine {

	constructor( { k1 = 0.3, k2 = 0.2, lambda = 0.15, reassuranceLearnRate = 0.25 } = {} ) {

		this.k1                                = k1
		this.k2                                = k2
		this.lambda                        = lambda
		this.reassuranceLearnRate = reassuranceLearnRate
		this.hyperactivation           = new Map() // userId -> real H(t), 0..1
		// Real Q-learning-style reinforcement of reassurance-seeking as a
		// self-regulation strategy — a real, bounded Q-VALUE per person
		// (not a full RL agent/action-space, the same "own engineering of
		// the qualitative shape" discipline this codebase already applies
		// elsewhere to borrowed formulas), rising when a real reassurance
		// bid was followed by real anxiety relief.
		this.reassuranceQ = new Map() // userId -> real 0..1

	}

	/** Real, bounded over-expression level for THIS turn — `affection` (0..1, genuine felt affection), `anxiousAttachment` (0..1, e.g. `Attachment` anxious-style strength), `oxytocin`/`wanting` (0..1 each, real already-tracked chemistry), `inhibitoryControl` (0..1, `InhibitoryControlPool.level/capacity`), `spaceRequested` (0..1, real, explicit or inferred signal that the other party wants distance right now). */
	computeExpression( { affection = 0, anxiousAttachment = 0, oxytocin = 0.1, wanting = 0, inhibitoryControl = 0.5, spaceRequested = 0 } = {} ) {

		const numerator     = ( clamp01( affection ) + clamp01( anxiousAttachment ) ) * clamp01( oxytocin ) * clamp01( wanting )
		const denominator = Math.max( 0.05, clamp01( inhibitoryControl ) ) * ( clamp01( spaceRequested ) + 0.05 )
		return clamp01( numerator / denominator )

	}

	/** Real, per-person hyperactivation dynamics — `desiredContact`/`actualContact` (0..1), `anxiousAttachment` (0..1), `inhibitoryControl` (0..1). Called once per real turn/tick. */
	updateHyperactivation( userId, desiredContact, actualContact, anxiousAttachment, inhibitoryControl, dt = 1 ) {

		const current = this.hyperactivation.get( userId ) ?? 0
		const gap          = clamp01( desiredContact ) - clamp01( actualContact )
		const next          = clamp01( current + dt * ( this.k1 * gap + this.k2 * clamp01( anxiousAttachment ) - this.lambda * clamp01( inhibitoryControl ) ) )
		this.hyperactivation.set( userId, next )
		return next

	}

	getHyperactivation( userId ) {

		return this.hyperactivation.get( userId ) ?? 0

	}

	/** Real reinforcement — call after a real reassurance-seeking bid genuinely reduced this turn's own anxiety (`anxietyReliefMagnitude`, 0..1). Raises the real, learned Q-value for reassurance-seeking as THIS person's own go-to regulation strategy. */
	reinforceReassuranceSeeking( userId, anxietyReliefMagnitude ) {

		const current = this.reassuranceQ.get( userId ) ?? 0
		this.reassuranceQ.set( userId, clamp01( current + clamp01( anxietyReliefMagnitude ) * this.reassuranceLearnRate ) )
		return this.reassuranceQ.get( userId )

	}

	getReassuranceQ( userId ) {

		return this.reassuranceQ.get( userId ) ?? 0

	}

	decayAll( dt = 1 ) {

		for ( const [ userId, h ] of this.hyperactivation ) this.hyperactivation.set( userId, Math.max( 0, h - this.lambda * 0.3 * dt ) )
		for ( const [ userId, q ] of this.reassuranceQ )         this.reassuranceQ.set( userId, Math.max( 0, q - this.lambda * 0.1 * dt ) )

	}

	toJSON() {

		return { hyperactivation: [ ...this.hyperactivation.entries() ], reassuranceQ: [ ...this.reassuranceQ.entries() ] }

	}

	restoreState( data ) {

		if ( !data ) return
		if ( data.hyperactivation ) this.hyperactivation = new Map( data.hyperactivation )
		if ( data.reassuranceQ )     this.reassuranceQ     = new Map( data.reassuranceQ )

	}

}
