/**
 * Envy/jealousy triggered by the *sign of the derivative* of relative
 * status, not the absolute level — matching the real phenomenon that envy
 * spikes when your standing is falling while a comparison target's is
 * rising, not just from someone else generally having more. Status here is
 * approximated by Attachment.powerDynamic (already tracked per user); this
 * module only adds the trend comparison across two users' status.
 */
export class StatusEnvy {

	constructor() {

		this.history = new Map() // userId -> last observed status

	}

	/** Call once per turn per known user with their current status (e.g. relation.powerDynamic). */
	observe( userId, status ) {

		const previous = this.history.get( userId )
		this.history.set( userId, status )
		return previous === undefined ? 0 : status - previous

	}

	/** Compares self's status trend against a rival's — positive envyTrigger = classic "falling while they rise". */
	checkEnvy( selfTrend, rivalTrend ) {

		const triggered = selfTrend < 0 && rivalTrend > 0
		return { triggered, intensity: triggered ? Math.min( 1, Math.abs( selfTrend ) + rivalTrend ) : 0 }

	}

}
