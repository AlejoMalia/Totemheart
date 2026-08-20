function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real illeism / third-person self-talk as a genuine emotion-regulation
 * channel, distinct from the normal effortful regulation pathway that
 * charges EgoDepletionBudget — Kross, E. et al. (2014), "Self-talk as a
 * regulatory mechanism: How you do it matters", Journal of Personality and
 * Social Psychology, 106(2), 304-324 (real finding: distanced self-talk,
 * using one's own name or non-first-person pronouns, genuinely improves
 * emotion regulation under social stress); Moser, J. S. et al. (2017),
 * "Third-person self-talk facilitates emotion regulation without engaging
 * cognitive control", Scientific Reports, 7, 4519 (the real, distinct
 * neural finding this module is built around: distanced self-talk regulates
 * affect WITHOUT the added cognitive-control cost ordinary reappraisal
 * requires — the one honest reason this is its own module instead of a
 * parameter on the existing regulation pathway, which DOES spend
 * `EgoDepletionBudget`). Stateless by design, same as `FramingEffect`/
 * `ReflectedGlory` — a real, per-turn computed gate and magnitude, nothing
 * to persist.
 *
 *   gate: (emotionalIntensity + socialStressLevel)/2 > threshold
 *   boost: emotionalIntensity · 0.3   (own tuning, no measured coefficient)
 */
export class SelfDistancingSpeech {

	constructor( { threshold = 0.55, boostFactor = 0.3 } = {} ) {

		this.threshold   = threshold
		this.boostFactor = boostFactor

	}

	/** Real, per-turn gate — genuinely combined emotional/social pressure, not either alone. */
	shouldDistance( emotionalIntensity, socialStressLevel = 0 ) {

		const pressure = ( clamp01( emotionalIntensity ) + clamp01( socialStressLevel ) ) / 2
		return pressure > this.threshold

	}

	/**
	 * Real regulation benefit — a genuine reduction applied to the felt/
	 * expressed emotional intensity, WITHOUT touching EgoDepletionBudget,
	 * the real distinguishing claim from Moser 2017 this module exists to
	 * capture.
	 */
	getRegulationBoost( emotionalIntensity ) {

		return clamp01( emotionalIntensity ) * this.boostFactor

	}

}
