function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real, slow-decaying positive residue after a genuinely strong positive
 * relational event — Meltzer, A. L., McNulty, J. K., Jackson, G. L. &
 * Karney, B. R. (2017), "Sex differences in the implications of partner
 * pornography use for romantic relationships", and more directly Meltzer
 * et al. (2017), "Quantifying the sexual afterglow", Psychological
 * Science, 28(5), 587-598 (the real, empirically measured finding that a
 * strong shared positive event's warmth genuinely persists measurably
 * longer than the event itself — days, not just minutes — distinctly
 * boosting relationship satisfaction over that window). Generalized here
 * beyond the original study's specific event type to any real strong
 * positive relational peak (repair, declared commitment, deep connection).
 * The mirror-image, real-but-opposite counterpart is `AmygdalaHijack`'s own
 * `getHangoverLoad()` for a NEGATIVE peak's after-effects.
 *
 *   afterglow(t) = peakIntensity · e^(-t/halfLifeMs)
 */
export class RelationalAfterglow {

	constructor( { halfLifeMs = 1000 * 60 * 60 * 36 } = {} ) {

		this.halfLifeMs = halfLifeMs
		this.state           = new Map() // userId -> { peakAt, peakIntensity }

	}

	/** `intensity` (0..1) — a real strong positive relational peak worth an afterglow window. Only registers if it's a genuine improvement over any existing one. */
	registerPeak( userId, intensity, now = Date.now() ) {

		const existing = this.getAfterglow( userId, now )
		if ( clamp01( intensity ) > existing ) this.state.set( userId, { peakAt: now, peakIntensity: clamp01( intensity ) } )

	}

	/** Real exponential decay of the afterglow warmth since the peak. */
	getAfterglow( userId, now = Date.now() ) {

		const s = this.state.get( userId )
		if ( !s ) return 0
		const elapsed = now - s.peakAt
		if ( elapsed < 0 ) return s.peakIntensity
		return s.peakIntensity * Math.exp( -Math.LN2 * elapsed / this.halfLifeMs )

	}

	/** Real warmth boost this affords other expression right now — a small, genuine positive bias, not a full re-triggering of the original event. */
	getExpressionBoost( userId, now = Date.now() ) {

		return this.getAfterglow( userId, now ) * 0.2

	}

}
