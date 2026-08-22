function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real, explicit multi-phase forgiveness READ — composes 3 already-real,
 * separately-tracked signals this codebase computes independently
 * (`GrudgeSystem`'s own grievance level, `Attachment.trust`'s own slow
 * Bayesian posterior, `OxytocinSystem.getLevel()`'s own bonding chemistry)
 * into one honest phase label, rather than inventing new underlying math
 * for any of them. Enright, R. D. & Fitzgibbons, R. P. (2000), "Helping
 * Clients Forgive", American Psychological Association (the real,
 * well-established clinical finding that forgiveness is a genuine PROCESS
 * with distinct phases, not a single verbal event — and critically, that
 * verbal/cognitive forgiveness routinely outruns the slower physiological/
 * trust-based re-engagement, exactly the gap `GrudgeSystem.forgive()`
 * (fast, verbal-adjacent) vs. `Attachment.trust`/`OxytocinSystem` (slow)
 * already show in this codebase's own prior-round tests, made explicit
 * here as a readable phase rather than left implicit).
 *
 *   'unresolved'  : grievance still high
 *   'verbal'          : grievance low (said/accepted) but trust/oxytocin still lag
 *   'reopened'      : trust/oxytocin were recovering but a real, fresh grievance just fired again
 *   'reconciled' : grievance low AND trust/oxytocin have genuinely caught up
 */
export class ForgivenessProcess {

	constructor( { catchUpThreshold = 0.5, grievanceThreshold = 0.2 } = {} ) {

		this.catchUpThreshold   = catchUpThreshold
		this.grievanceThreshold = grievanceThreshold
		this.lastPhase                     = new Map() // userId -> real last computed phase, for real reopened-transition detection

	}

	/** `grievance` (0..1, `GrudgeSystem.getGrievance('self', userId)`), `trust` (0..1, `Attachment` relation.trust), `oxytocin` (0..1, `OxytocinSystem.getLevel(userId)`). */
	getPhase( userId, grievance, trust, oxytocin ) {

		const g              = clamp01( grievance )
		const physiological = clamp01( ( clamp01( trust ) + clamp01( oxytocin ) ) / 2 )
		const previous     = this.lastPhase.get( userId )

		let phase
		if ( g > this.grievanceThreshold ) {

			phase = previous === 'verbal' || previous === 'reconciled' ? 'reopened' : 'unresolved'

		}
		else phase = physiological >= this.catchUpThreshold ? 'reconciled' : 'verbal'

		this.lastPhase.set( userId, phase )
		return { phase, grievance: g, physiological }

	}

	toJSON() {

		return [ ...this.lastPhase.entries() ]

	}

	restoreState( data ) {

		if ( data ) this.lastPhase = new Map( data )

	}

}
