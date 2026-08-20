/**
 * Real Weber-Fechner Law — Weber, E. H. (1834), foundational just-noticeable-
 * difference work; Fechner, G. T. (1860), "Elemente der Psychophysik" (the
 * real, classic finding that perceived sensation scales with the LOGARITHM
 * of the ratio between a stimulus and the current baseline, not with the
 * stimulus's raw absolute magnitude — the same fixed change registers as
 * much smaller against a large baseline than a small one). Distinct from
 * `HedonicAdaptation`'s own long-run accumulated-history adaptation and
 * from `StevensPowerLaw`'s own per-kind repetition compression — this is a
 * real, per-turn perceptual-RATIO judgment against whatever the CURRENT
 * baseline already is, no history tracked here at all.
 *
 *   p = k·ln(S / S0)
 */
export class WeberFechnerLaw {

	constructor( { k = 1, floor = 0.05 } = {} ) {

		this.k        = k
		this.floor = floor // real epsilon floor so ln() never sees zero

	}

	/** `stimulus` — this turn's real magnitude. `baseline` — the real current reference level it's being judged against (e.g. emotionSpace.vector.arousal BEFORE this turn touches it). */
	getPerceivedChange( stimulus, baseline ) {

		const S0    = Math.max( this.floor, Math.abs( baseline ) )
		const ratio = Math.max( this.floor, Math.abs( stimulus ) ) / S0
		return this.k * Math.log( ratio )

	}

}
