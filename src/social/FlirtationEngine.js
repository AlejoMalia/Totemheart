function clamp( v, min = 0, max = 1 ) {

	return Math.max( min, Math.min( max, v ) )

}

/**
 * Real, gradual signal-escalation flirtation — Grammer, K., Kruck, K.,
 * Juette, A. & Fink, B. (2000), "Non-verbal behavior as courtship signals:
 * the role of control and choice in selecting partners." Evolution and
 * Human Behavior, 21(6), 371-390 (the real, well-established account of
 * courtship as a genuine low-cost SIGNALING game: escalating cues probing
 * for real reciprocity, retreating fast on a real negative read, to manage
 * the real social cost of an overt rejection). Own engineering of the
 * specific escalation update rule.
 *
 *   F(t) = F(t-1) + τ·A·R(t-1) - K
 */
export class FlirtationEngine {

	constructor( { boldness = 0.5, risk = 0.2 } = {} ) {

		this.boldness = boldness // τ — real, personality-linked directness
		this.risk         = risk     // K — real, perceived social risk of escalating
		this.signals       = new Map() // userId -> real current signal intensity

	}

	getSignal( userId ) {

		return this.signals.get( userId ) ?? 0

	}

	/**
	 * `attraction` (0..1) — real, already-tracked attraction toward this
	 * user. `receptivity` (-1..1) — real, caller-read reciprocity signal
	 * from the OTHER party's last turn (positive = warm reciprocation,
	 * negative = a real, clear rebuff).
	 */
	update( userId, attraction, receptivity ) {

		const current = this.getSignal( userId )
		const delta       = this.boldness * clamp( attraction, 0, 1 ) * receptivity - this.risk
		const updated    = receptivity < 0 ? 0 : clamp( current + delta ) // a real clear rebuff collapses the signal instantly, not gradually
		this.signals.set( userId, updated )
		return updated

	}

	decay( userId, dt = 1, lambda = 0.05 ) {

		const current = this.getSignal( userId )
		this.signals.set( userId, Math.max( 0, current - lambda * dt ) )

	}

}
