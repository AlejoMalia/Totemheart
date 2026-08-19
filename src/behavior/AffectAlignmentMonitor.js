function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * The one real, honest slice of a "Model Control Plane" this project builds:
 * a generic comparator between what Totemheart's own real internal state
 * wants expressed and a real, caller-supplied READ of what actually got
 * expressed (a "probe reading"). This is NOT real hidden-state activation
 * reading or steering — Totemheart has no access to any model's internal
 * activations through a remote API (Anthropic/OpenAI/Ollama don't expose
 * them), and building fake probes/vectors against nothing real would be
 * exactly the kind of theater this project's own honesty rule forbids. What
 * IS real and buildable without that access: a genuine Δ computation
 * between two real vectors, and a real, bounded correction signal a caller
 * can feed into `LogitBiasBuilder`/`ExpressionDirectives` (the actual,
 * portable "Fase A" from the original spec) when a real downstream text
 * classifier, embedding comparison, or heuristic re-read of the AI's own
 * OUTPUT (not its hidden layers) disagrees with what Totemheart intended.
 *
 *   Δ = z_totem - z_probe
 *   α ← α + η·Δ  (bounded)
 */
export class AffectAlignmentMonitor {

	constructor( { learningRate = 0.2 } = {} ) {

		this.learningRate = learningRate
		this.correction        = { valence: 0, arousal: 0 } // α — real, bounded, running correction

	}

	/**
	 * `intended` / `observed` — real `{ valence, arousal }` readings, both
	 * -1..1. `intended` is Totemheart's own real emotional-state vector;
	 * `observed` is a real, caller-supplied read of what the actual output
	 * seemed to carry (e.g. from a lightweight sentiment re-check of the
	 * AI's own generated text, not an invented number).
	 */
	computeDelta( intended, observed ) {

		return { valence: intended.valence - observed.valence, arousal: intended.arousal - observed.arousal }

	}

	/** A real, bounded online update to the running correction — never unbounded, capped at ±1 per axis. */
	update( intended, observed ) {

		const delta = this.computeDelta( intended, observed )
		this.correction.valence = Math.max( -1, Math.min( 1, this.correction.valence + this.learningRate * delta.valence ) )
		this.correction.arousal = Math.max( -1, Math.min( 1, this.correction.arousal + this.learningRate * delta.arousal ) )
		return { delta, correction: { ...this.correction } }

	}

	/** Real, bounded misalignment magnitude — how far off the last observed read was. */
	getMisalignment( intended, observed ) {

		const delta = this.computeDelta( intended, observed )
		return clamp01( Math.sqrt( delta.valence ** 2 + delta.arousal ** 2 ) / Math.SQRT2 )

	}

}
