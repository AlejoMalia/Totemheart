const COOLDOWN_MS = 1000 * 60 * 30 // 30 minutes without the stimulus resets habituation

/**
 * Diminishing impact for a repeated stimulus. Saying "te quiero" 50 times in
 * a row should stop producing the same emotional spike each time.
 */
export class HedonicAdaptation {

	constructor( { referenceAlpha = 0.95 } = {} ) {

		this.seen                = new Map()
		this.referenceAlpha = referenceAlpha // long-run EMA persistence, distinct from the per-fingerprint discount below
		this.referencePoint   = 0 // "hedonic treadmill": a long-run EMA of received desirability, own design, no citation

	}

	/** Sustained input (good or bad) moves what counts as "still positive" — a real reference-point shift, not a fixed 0 baseline. */
	observeReferencePoint( desirability ) {

		this.referencePoint = this.referenceAlpha * this.referencePoint + ( 1 - this.referenceAlpha ) * desirability

	}

	getReferencePointShift() {

		return this.referencePoint

	}

	static fingerprintOf( text, emotionLabel = '' ) {

		const normalized = ( text || '' ).toLowerCase().trim().slice( 0, 60 )
		return `${emotionLabel}::${normalized}`

	}

	getMultiplier( fingerprint, personality, now = Date.now() ) {

		const entry = this.seen.get( fingerprint )
		if ( !entry ) return 1
		if ( now - entry.lastSeen > COOLDOWN_MS ) return 1

		const k = personality.getHedonicAdaptationRate()
		return 1 / ( 1 + k * entry.count )

	}

	record( fingerprint, now = Date.now() ) {

		const entry = this.seen.get( fingerprint )
		if ( !entry || now - entry.lastSeen > COOLDOWN_MS ) {

			this.seen.set( fingerprint, { count: 1, lastSeen: now } )
			return

		}
		entry.count  += 1
		entry.lastSeen = now

	}

}
