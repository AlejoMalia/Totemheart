function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real psychological reactance — Brehm, J. W. (1966), "A Theory of
 * Psychological Reactance", Academic Press (the real, foundational,
 * extensively replicated finding that a perceived threat to a free
 * behavior produces a genuine MOTIVATIONAL push back toward that behavior,
 * proportional to how important the threatened freedom was — distinct from
 * ordinary disagreement or anger, which don't require a freedom-restriction
 * framing at all). Distinct from `DefenseMechanisms` (ego-protective
 * distortion of a threatening BELIEF): reactance is about a threatened
 * BEHAVIORAL freedom, and it genuinely increases the appeal of the
 * restricted option itself, not just discomfort.
 *
 *   reactance = freedomImportance · restrictionMagnitude
 *   restoredAppeal = baseAppeal + reactance · boomerangFactor
 */
export class ReactanceEngine {

	constructor( { boomerangFactor = 0.4 } = {} ) {

		this.boomerangFactor = boomerangFactor

	}

	/** `freedomImportance` (0..1, real value placed on the restricted behavior/opinion), `restrictionMagnitude` (0..1, real perceived pressure/coercion). */
	getReactance( freedomImportance, restrictionMagnitude ) {

		return clamp01( freedomImportance * restrictionMagnitude )

	}

	/** Real boomerang effect: the restricted option's appeal genuinely rises, not just resistance to complying. */
	getRestoredAppeal( baseAppeal, freedomImportance, restrictionMagnitude ) {

		const reactance = this.getReactance( freedomImportance, restrictionMagnitude )
		return clamp01( baseAppeal + reactance * this.boomerangFactor )

	}

}
