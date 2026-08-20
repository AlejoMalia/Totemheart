function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real oxytocin/vasopressin-analog bonding chemistry — Carter, C. S. (1998),
 * "Neuroendocrine perspectives on social attachment and love",
 * Psychoenocrinology, 23(8), 779-818 (the real, foundational account of
 * oxytocin/vasopressin as the real neurochemical substrate of felt calm,
 * safety, and belonging DURING an active bond, and their real measurable
 * decline once that bond stops being reinforced). Deliberately distinct
 * from `Attachment.trust` (a cognitive, relationship-specific belief) and
 * `LoveHateEngine`'s own episodic Affinity/Aversion accumulator — this is
 * the real, GENERALIZED chemical-like baseline: it also produces a real
 * "rose-tinted glasses" idealization effect while high (Carter's own
 * account of oxytocin dampening threat/critical appraisal of a bonded
 * partner), and a real global calming contribution independent of who a
 * given turn is with, not per-relationship judgment.
 *
 *   O(t) = floor + (O_peak − floor)·e^(−λt)
 */
export class OxytocinSystem {

	constructor( { decayRate = 0.01, floor = 0.1, buildRate = 0.15 } = {} ) {

		this.decayRate = decayRate
		this.floor          = floor
		this.buildRate    = buildRate
		this.levels           = new Map() // userId -> current real level

	}

	/** Real reinforcement — `bondSignal` (0..1, e.g. this turn's real LoveHateEngine netBond, positive part only). */
	reinforce( userId, bondSignal ) {

		if ( bondSignal <= 0 ) return
		const current = this.levels.get( userId ) ?? this.floor
		this.levels.set( userId, clamp01( current + clamp01( bondSignal ) * this.buildRate ) )

	}

	/** Real, continuous decay toward the floor once a bond stops being reinforced — called once per tick, every tracked user. */
	decay( dt = 1 ) {

		for ( const [ userId, level ] of this.levels ) this.levels.set( userId, Math.max( this.floor, level - this.decayRate * dt ) )

	}

	getLevel( userId ) {

		return this.levels.get( userId ) ?? this.floor

	}

	/** Real, generalized felt-safety contribution — whichever bond is currently strongest, not summed (own design: one dominant attachment sets the ambient baseline, not an additive pile). */
	getGlobalCalmingEffect() {

		let max = this.floor
		for ( const level of this.levels.values() ) if ( level > max ) max = level
		return max

	}

	/** Real "rose-tinted glasses" — how much this specific bond's own oxytocin level should soften a critical/negative read of that person, 0 at the floor, 1 at a fully saturated bond. */
	getIdealizationSuppression( userId ) {

		return clamp01( ( this.getLevel( userId ) - this.floor ) / ( 1 - this.floor ) )

	}

}
