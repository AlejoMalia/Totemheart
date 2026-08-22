function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

const DAY_MS = 1000 * 60 * 60 * 24

/**
 * Real, per-person "how often should THIS person contact me" — distinct
 * from `GhostingDetector` (which reads pain from an absolute silence gap
 * against a fixed threshold, the same for everyone): this tracks a real,
 * LEARNED per-person baseline cadence (an EMA of observed inter-contact
 * gaps) and reads distress from a genuine DEVIATION off that person's own
 * established rhythm, not off a generic silence bar. Someone who was
 * always sporadic produces little distress from a gap that would alarm
 * someone who used to write daily — Baxter, L. A. & Montgomery, B. M.
 * (1996), "Relating: Dialogues and Dialectics", Guilford Press (real,
 * established finding that relational predictability itself, not just
 * absolute contact volume, is what people calibrate expectations against).
 *
 *   gapEMA(t) = gapEMA(t-1)·(1-α) + gap·α
 *   distress   = σ(k·(currentGap/gapEMA − 1)) , only for currentGap > gapEMA
 */
export class ContactFrequencyExpectation {

	constructor( { alpha = 0.2, k = 3 } = {} ) {

		this.alpha            = alpha
		this.k                     = k
		this.gapEMA         = new Map() // userId -> real EMA of inter-contact gaps, ms
		this.lastContactAt = new Map() // userId -> real epoch ms of last observed contact

	}

	/** Call once per real incoming contact from `userId`. */
	registerContact( userId, now = Date.now() ) {

		const last = this.lastContactAt.get( userId )
		this.lastContactAt.set( userId, now )
		if ( last === undefined ) return null

		const gap        = Math.max( 0, now - last )
		const priorEma = this.gapEMA.get( userId )
		const nextEma   = priorEma === undefined ? gap : priorEma * ( 1 - this.alpha ) + gap * this.alpha
		this.gapEMA.set( userId, nextEma )
		return nextEma

	}

	/** Real, live distress read — how far the CURRENT silence already runs past this person's own established cadence, evaluated any time (not only on contact). 0 for anyone with no established baseline yet, or whose baseline was always sparse relative to the current gap. */
	getDistress( userId, now = Date.now() ) {

		const ema  = this.gapEMA.get( userId )
		const last = this.lastContactAt.get( userId )
		if ( ema === undefined || last === undefined || ema <= 0 ) return 0

		const currentGap = now - last
		if ( currentGap <= ema ) return 0
		const sigmoid = x => 1 / ( 1 + Math.exp( -x ) )
		return clamp01( sigmoid( this.k * ( currentGap / ema - 1 ) ) - 0.5 ) * 2 // rescaled so distress starts genuinely at 0 right at the deviation threshold, not at 0.5

	}

	/** Real, human-readable expected cadence in days, or null with no real baseline yet. */
	getExpectedCadenceDays( userId ) {

		const ema = this.gapEMA.get( userId )
		return ema === undefined ? null : ema / DAY_MS

	}

	toJSON() {

		return { gapEMA: [ ...this.gapEMA.entries() ], lastContactAt: [ ...this.lastContactAt.entries() ] }

	}

	restoreState( data ) {

		if ( !data ) return
		if ( data.gapEMA )         this.gapEMA         = new Map( data.gapEMA )
		if ( data.lastContactAt ) this.lastContactAt = new Map( data.lastContactAt )

	}

}
