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

	constructor( { promotionThreshold = 5, maxEntries = 200 } = {} ) {

		this.promotionThreshold = promotionThreshold
		this.maxEntries           = maxEntries
		this.entries                = new Map() // fingerprint -> { count, appraisal }

	}

	/** Returns the cached appraisal if this fingerprint has been "worn in", else null. */
	consult( fingerprint ) {

		const entry = this.entries.get( fingerprint )
		if ( entry && entry.count >= this.promotionThreshold ) return entry.appraisal
		return null

	}

	/** Full purge — used by allostasis reset when the pipeline is stuck reusing stale cached readings. */
	clear() {

		this.entries.clear()

	}

	observe( fingerprint, appraisal ) {

		const entry = this.entries.get( fingerprint )
		if ( entry ) {

			entry.count += 1
			entry.appraisal = appraisal // keep the freshest version once promoted

		}
		else {

			if ( this.entries.size >= this.maxEntries ) this.entries.delete( this.entries.keys().next().value )
			this.entries.set( fingerprint, { count: 1, appraisal } )

		}

	}

}
