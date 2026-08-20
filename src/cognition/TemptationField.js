function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

/**
 * Real TEMPTATION — desire under genuine normative/relational conflict,
 * not desire alone. Mischel, W. (1996), "From good intentions to willpower",
 * in Gollwitzer & Bargh (eds.), The Psychology of Action, Guilford Press
 * (the real "hot/cool system" distinction: a hot, appetitive pull that only
 * becomes genuinely temptation once it collides with a real constraint —
 * a norm, a loyalty, a real cost). Reuses `DesireEngine`'s own real D
 * rather than recomputing wanting, and reuses whatever real forbiddenness
 * signals the caller already has (`loyaltyConflict`, `FaceThreatSensitivity`,
 * `CognitiveDissonance`) rather than inventing new ones.
 *
 *   T = D · P · O
 *   O = σ(normViolation + loyaltyCost + faceThreat + selfDiscord)
 */
export class TemptationField {

	constructor( { b1 = 1, b2 = 1, b3 = 1, b4 = 1 } = {} ) {

		this.b1 = b1; this.b2 = b2; this.b3 = b3; this.b4 = b4

	}

	/** Real forbiddenness — a bounded blend of already-computed real conflict signals. */
	getForbiddenness( { normViolation = 0, loyaltyCost = 0, faceThreat = 0, selfDiscord = 0 } ) {

		const z = this.b1 * clamp01( normViolation ) + this.b2 * clamp01( loyaltyCost ) + this.b3 * clamp01( faceThreat ) + this.b4 * clamp01( selfDiscord ) - 2
		return sigmoid( z )

	}

	/** `desire`/`opportunity`/`forbiddenness` all 0..1 real, already-computed magnitudes. */
	getTemptation( desire, opportunity, forbiddenness ) {

		return clamp01( desire ) * clamp01( opportunity ) * clamp01( forbiddenness )

	}

}
