/**
 * "Runtime-evolutionary architecture that rewrites hot paths into static
 * functions" reframed honestly: Totemheart cannot rewrite its own source at
 * runtime, and doesn't need to — the real, buildable version of this idea is
 * memoization. A fingerprint (same input shape + emotional context) seen
 * often enough stops paying for a fresh appraisal/ontology pass and reuses
 * the last one — the pipeline "stabilizes" around familiar interactions
 * instead of recomputing them from scratch every time, without skipping the
 * parts that must still run fresh every turn (spike application, decay,
 * memory). Engineering technique (memoization with a promotion threshold),
 * not a literal self-rewriting graph compiler.
 */
export class WornPathCache {

	constructor( { promotionThreshold = 5, maxEntries = 200, authorityHalfLifeMs = 1000 * 60 * 60 * 24 * 7 } = {} ) {

		this.promotionThreshold = promotionThreshold
		this.maxEntries           = maxEntries
		// A path "worn in" a week ago that hasn't been walked since shouldn't
		// carry the same authority as one walked an hour ago — real confidence
		// decay by wall-clock time since LAST observed, not since creation.
		// Half-life default (~1 week) is own tuning, not a citation.
		this.authorityLambda = Math.log( 2 ) / authorityHalfLifeMs
		this.entries              = new Map() // fingerprint -> { count, appraisal, lastObservedAt }

	}

	/** Fraction of full authority this entry still carries, given how long it's been since it was last actually walked. */
	getAuthority( entry, now = Date.now() ) {

		return Math.exp( -this.authorityLambda * Math.max( 0, now - entry.lastObservedAt ) )

	}

	/** Returns the cached appraisal if this fingerprint is worn in AND its authority hasn't decayed below the threshold, else null. */
	consult( fingerprint, { authorityThreshold = 0.5, now = Date.now() } = {} ) {

		const entry = this.entries.get( fingerprint )
		if ( !entry || entry.count < this.promotionThreshold ) return null
		return this.getAuthority( entry, now ) >= authorityThreshold ? entry.appraisal : null

	}

	/** Full purge — used by allostasis reset when the pipeline is stuck reusing stale cached readings. */
	clear() {

		this.entries.clear()

	}

	observe( fingerprint, appraisal, now = Date.now() ) {

		const entry = this.entries.get( fingerprint )
		if ( entry ) {

			entry.count += 1
			entry.appraisal        = appraisal // keep the freshest version once promoted
			entry.lastObservedAt = now

		}
		else {

			if ( this.entries.size >= this.maxEntries ) this.entries.delete( this.entries.keys().next().value )
			this.entries.set( fingerprint, { count: 1, appraisal, lastObservedAt: now } )

		}

	}

}
