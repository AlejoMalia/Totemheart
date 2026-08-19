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
 *
 * Real bug fixed: the original default risk=0.2 was picked without
 * checking it against the magnitudes τ·A·R actually reaches when driven by
 * the real pipeline (Totemheart.js passes Attachment's `relation.affinity`,
 * which starts at 0.5 and moves gradually, as A, and a desirability-derived
 * receptivity that's rarely near ±1). At boldness=0.5, K=0.2 required
 * A·R > 0.4 just to keep the signal from decaying every single turn — with
 * realistic A≈0.5 that meant R > 0.8 every turn, a bar the real pipeline
 * essentially never reaches, so the signal stayed at 0 in genuine multi-day
 * conversations regardless of how much real reciprocity was present (see
 * examples/three-day-ai-romance.js, which surfaced this before the fix).
 * Lowered to risk=0.05, still a real, non-zero social-risk cost that a
 * genuine rebuff (receptivity<0) still collapses instantly to 0, and that a
 * caller can still raise back toward the original value for a
 * risk-averse/timid personality — just no longer a threshold the pipeline's
 * own realistic signal magnitudes could never clear by construction.
 */
export class FlirtationEngine {

	constructor( { boldness = 0.5, risk = 0.05 } = {} ) {

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
