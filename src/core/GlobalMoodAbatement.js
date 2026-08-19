function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * A real, global (not per-relationship) low-intensity mood accumulator —
 * distinct from a discrete emotion in the standard, well-established sense
 * (intense, brief, object-directed) — Frijda, N. H. (1993), "Moods,
 * emotion episodes, and emotions." In Lewis, M. & Haviland, J. M. (eds.),
 * Handbook of Emotions, Guilford Press (the real, well-established
 * emotion/mood distinction: mood is diffuse, prolonged, and not aimed at a
 * specific object, which is exactly why a rupture with ONE relationship can
 * genuinely color every other interaction, not just the one it came from).
 * A real rupture (or a real ghosting-pain spike, see `GhostingDetector.js`)
 * feeds this global accumulator; real recovery isn't just time passing, it
 * is also genuinely accelerated by real novel/positive social engagement
 * elsewhere — own engineering of the specific coupled decay formula.
 *
 *   dD/dt = -(λ_base + ω·SocialEntropy)·D
 */
export class GlobalMoodAbatement {

	constructor( { lambdaBase = 0.01, omega = 0.15 } = {} ) {

		this.lambdaBase = lambdaBase
		this.omega          = omega
		this.level               = 0 // D, 0..1

	}

	/** A real hit of grief/pain that spills into the global mood, not just the relationship it came from. */
	inject( magnitude ) {

		this.level = clamp01( this.level + Math.max( 0, magnitude ) )

	}

	/**
	 * `socialEntropy` (0..1) — real magnitude of novel, positive social
	 * engagement THIS tick (e.g. a genuinely new, warm relationship
	 * forming) — distraction that genuinely accelerates real recovery,
	 * beyond bare time passing.
	 */
	decay( dt = 1, socialEntropy = 0 ) {

		const rate = this.lambdaBase + this.omega * clamp01( socialEntropy )
		this.level = Math.max( 0, this.level - rate * dt * this.level )

	}

	/** Real, bounded output-shaping readouts a caller folds into expression. */
	getExpressionDampening() {

		return {
			verbosityMultiplier    : 1 - this.level * 0.5,   // real shorter replies
			latencyBonusMs                : this.level * 800,      // real slower-feeling responses
			enthusiasmSuppression : this.level * 0.7,   // real flatter tone, fewer exclamation-style markers
		}

	}

}
