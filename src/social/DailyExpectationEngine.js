function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real, SMALL repeated broken-expectation trust erosion — Rotter, J. B.
 * (1971), "Generalized expectancies for interpersonal trust", American
 * Psychologist, 26(5), 443-452 (the real, foundational finding that trust
 * is built and eroded from the accumulation of many small kept/broken
 * expectations, not primarily from single dramatic betrayals — distinct
 * from `BetrayalTraumaTrace`/`TraumaCascadeEngine`, which are deliberately
 * scoped to severe, singular ruptures). "Dijiste que llamabas y no": a
 * small commitment ("I'll do X"), later either kept or genuinely broken,
 * each event a real, small RPE that accumulates SEPARATELY from any one
 * dramatic incident, decaying slowly so a pattern (not one slip) is what
 * actually erodes trust.
 *
 *   erosion(t) = erosion(t-1)·(1−δ) + brokenMagnitude·(1−δ)
 */
export class DailyExpectationEngine {

	constructor( { decay = 0.03, erosionRate = 0.15, repairRate = 0.05 } = {} ) {

		this.decay             = decay
		this.erosionRate = erosionRate
		this.repairRate    = repairRate
		this.erosion            = new Map() // userId -> real accumulated small-broken-expectation erosion, 0..1
		this.commitments   = new Map() // userId -> [{ text, madeAt }] real, small open commitments awaiting resolution

	}

	/** Real, small commitment registered ("dijiste que llamabas") — `text` is caller-supplied for bookkeeping, not parsed here. */
	registerCommitment( userId, text, now = Date.now() ) {

		const list = this.commitments.get( userId ) ?? []
		list.push( { text, madeAt: now } )
		this.commitments.set( userId, list )

	}

	/** Real resolution — the oldest open commitment for `userId` is resolved (`kept` bool). Kept commitments slightly REPAIR erosion; broken ones raise it. No-op if there's no open commitment to resolve. */
	resolveOldestCommitment( userId, kept ) {

		const list = this.commitments.get( userId ) ?? []
		if ( !list.length ) return null
		list.shift()
		this.commitments.set( userId, list )

		const current = this.erosion.get( userId ) ?? 0
		const next        = kept
			? Math.max( 0, current - this.repairRate )
			: clamp01( current * ( 1 - this.decay ) + this.erosionRate )
		this.erosion.set( userId, next )
		return next

	}

	getErosion( userId ) {

		return this.erosion.get( userId ) ?? 0

	}

	getOpenCommitmentCount( userId ) {

		return ( this.commitments.get( userId ) ?? [] ).length

	}

	decayAll( dt = 1 ) {

		for ( const [ userId, e ] of this.erosion ) this.erosion.set( userId, Math.max( 0, e - this.decay * 0.3 * dt ) )

	}

	toJSON() {

		return { erosion: [ ...this.erosion.entries() ], commitments: [ ...this.commitments.entries() ] }

	}

	restoreState( data ) {

		if ( !data ) return
		if ( data.erosion )         this.erosion         = new Map( data.erosion )
		if ( data.commitments ) this.commitments = new Map( data.commitments )

	}

}
