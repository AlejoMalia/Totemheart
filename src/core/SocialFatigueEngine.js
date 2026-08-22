function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real, global "social battery" — Cacioppo, J. T. & Patrick, W. (2008),
 * "Loneliness: Human Nature and the Need for Social Connection", Norton
 * (real, established finding that sustained social engagement itself
 * carries a genuine metabolic/attentional cost independent of how
 * PLEASANT the interaction is — Zelenski, J. M., Santoro, M. S. & Whelan,
 * D. C. (2012), "Would introverts be better off if they acted more like
 * extraverts? Exploring emotional and cognitive consequences of counter-
 * dispositional behavior", Emotion, 12(2), 290-303, the real finding that
 * even genuinely ENJOYED social interaction depletes a real, separate
 * resource, distinct from `BoredomSystem` (which fires on how INTERESTING
 * a topic/person reads, not on cumulative exposure regardless of
 * interest) and `DecisionFatigue` (choice-specific, not social-specific).
 * Personality-gated: introversion drains this pool faster per real turn.
 *
 *   F(t) = F(t-1) + drainRate·(1+introversion) − restRate·idleDt
 */
export class SocialFatigueEngine {

	constructor( { drainRate = 0.03, restRate = 0.08, withdrawThreshold = 0.7 } = {} ) {

		this.drainRate            = drainRate
		this.restRate                = restRate
		this.withdrawThreshold = withdrawThreshold
		this.level                       = 0

	}

	/** Call once per real turn — `introversion` (0..1, Personality trait), `intensity` (0..1, real, how emotionally/cognitively demanding THIS turn read, e.g. arousal or cognitive load). */
	registerInteraction( introversion = 0.5, intensity = 0.5 ) {

		this.level = clamp01( this.level + this.drainRate * ( 1 + clamp01( introversion ) ) * clamp01( intensity ) )
		return this.level

	}

	/** Real rest — call from `idle()`/`tick()` with real elapsed dt. */
	rest( dt = 1 ) {

		this.level = Math.max( 0, this.level - this.restRate * dt )
		return this.level

	}

	getLevel() {

		return this.level

	}

	/** Real genuine desire to disengage — distinct from `BoredomSystem.shouldWithdraw()` (topic/person disinterest): this fires from cumulative real exposure regardless of how much the content itself is liked. */
	shouldWithdraw() {

		return this.level >= this.withdrawThreshold

	}

	toJSON() {

		return this.level

	}

	restoreState( data ) {

		if ( typeof data === 'number' ) this.level = data

	}

}
