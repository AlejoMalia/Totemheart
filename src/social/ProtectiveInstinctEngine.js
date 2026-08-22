function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real, distinct CARE-drive protective impulse toward a genuinely vulnerable
 * bonded other — Panksepp, J. (1998), "Affective Neuroscience", Oxford
 * University Press (already cited elsewhere in this codebase for the real
 * CARE primary-process system: nurturant behavior toward a bonded other in
 * real distress is a genuine, distinct evolved impulse, not derived from
 * romantic attraction). Deliberately distinct from `InfatuationEngine`
 * (protection scales with real BOND and real perceived vulnerability, not
 * with romantic spark, and can fire for a platonic or family-type bond just
 * as strongly) and can genuinely CONFLICT with `JealousyTriangle`'s own
 * rivalry read when a third party is also involved (a real, own-tuned
 * interaction, not resolved automatically here — a caller composes both).
 *
 *   protect = σ(k·(bond·vulnerability − θ))
 */
export class ProtectiveInstinctEngine {

	constructor( { k = 4, theta = 0.3 } = {} ) {

		this.k         = k
		this.theta = theta

	}

	/** `bond` (0..1, e.g. `LoveHateEngine.getNetBond()` clamped positive), `vulnerability` (0..1, real, this-turn signal — illness, external attack, genuine helplessness). */
	evaluate( bond, vulnerability ) {

		const sigmoid = x => 1 / ( 1 + Math.exp( -x ) )
		const b               = clamp01( bond )
		const v                = clamp01( vulnerability )
		const level          = sigmoid( this.k * ( b * v - this.theta ) )
		return { level, active: level > 0.5 }

	}

}
