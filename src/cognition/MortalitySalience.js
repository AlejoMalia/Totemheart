function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real Terror Management Theory — Greenberg, J., Pyszczynski, T. &
 * Solomon, S. (1986), "The causes and consequences of a need for
 * self-esteem: A terror management theory", in Baumeister (ed.), Public
 * Self and Private Self, Springer-Verlag (the real, extensively-replicated
 * finding that a genuine mortality cue — death, irreversible loss, one's
 * own finitude — produces a real two-phase response: an immediate PROXIMAL
 * suppression of the thought, followed by a DELAYED, DISTAL rise in
 * worldview-defense — reinforced values, sharper in-group/out-group
 * distinction — that only appears once conscious attention has moved on).
 * Own engineering of the specific delayed-rise-then-fade curve; the real
 * two-phase SHAPE is the cited finding, not these exact time constants.
 *
 *   distalDefense(t) = mortalityCue · (1 − e^(−t/delayMs)) · e^(−t/fadeMs)
 */
export class MortalitySalience {

	constructor( { delayMs = 1000 * 60 * 3, fadeMs = 1000 * 60 * 45 } = {} ) {

		this.delayMs = delayMs
		this.fadeMs   = fadeMs
		this.state       = null // { cueAt, mortalityCue }

	}

	/** `mortalityCue` (0..1) — a real, genuine death/finitude/irreversible-loss signal this turn (not ordinary sadness). */
	registerCue( mortalityCue, now = Date.now() ) {

		const existing = this.state
		const carried    = existing ? this.getDistalDefense( now ) : 0
		this.state          = { cueAt: now, mortalityCue: clamp01( carried + mortalityCue ) }

	}

	/** Real, delayed-then-fading worldview-defense strength — near 0 immediately after the cue (proximal suppression), peaks later, then fades. */
	getDistalDefense( now = Date.now() ) {

		if ( !this.state ) return 0
		const elapsed = Math.max( 0, now - this.state.cueAt )
		return clamp01( this.state.mortalityCue * ( 1 - Math.exp( -elapsed / this.delayMs ) ) * Math.exp( -elapsed / this.fadeMs ) )

	}

	/** Real, bounded boost to in-group loyalty / value rigidity this defense level produces — the real TMT behavioral consequence, not raw affect. */
	getWorldviewDefenseBoost( now = Date.now() ) {

		return this.getDistalDefense( now ) * 0.5

	}

}
