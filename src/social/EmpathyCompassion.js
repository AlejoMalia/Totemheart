function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real empathy (passive utility-resonance) and real compassion (active,
 * costly helping motivation) as two genuinely distinct real mechanics —
 * Batson, C. D. (2011), "Altruism in Humans." Oxford University Press (the
 * actual, well-established empathy-altruism hypothesis: genuinely feeling
 * another's state, empathy, is a real, distinct precursor to actually
 * acting to relieve it, compassion — not the same construct under two
 * names); Singer, T. & Klimecki, O. M. (2014), "Empathy and compassion."
 * Current Biology, 24(18), R875-R878 (real neuroscientific evidence these
 * are two separate systems: empathy can produce real distress and
 * withdrawal on its own, compassion is the real, distinct motivational
 * pull toward helping). Distinct from `PainSocialOverlap` (a fixed
 * social/physical pain pathway coupling) and `EmotionalContagion` (real
 * affect MATCHING) — this is a real utility-fusion (empathy) and a real,
 * distress-gated, cost/benefit helping decision (compassion).
 *
 *   U_total = (1-ω)·U_self + ω·Σ(E_ij·U_j)
 *   U_help(a) = -Cost(a) + C·E_ij·ΔU_j⁺·Deficit_j
 */
export class EmpathyCompassion {

	constructor( { permeability = 0.3, compassionGene = 0.5 } = {} ) {

		this.permeability   = permeability   // ω — real, bounded (0..0.5) empathic permeability
		this.compassionGene = compassionGene // C — real, bounded propensity to actually act

	}

	/**
	 * `selfUtility` — the AI's own real current wellbeing proxy (e.g.
	 * 1-cortisol). `others` — real array of `{ affinity, utility }` for
	 * known relationships. Returns the real, empathy-blended total utility.
	 */
	getBlendedUtility( selfUtility, others ) {

		if ( !others.length ) return selfUtility
		const othersTerm = others.reduce( ( sum, o ) => sum + clamp01( o.affinity ) * o.utility, 0 ) / others.length
		return ( 1 - this.permeability ) * selfUtility + this.permeability * othersTerm

	}

	/**
	 * Real compassionate-helping utility for a candidate action — genuinely
	 * scales with how deep the other's real deficit runs, not a flat
	 * "be nice" bonus.
	 */
	evaluateHelping( { affinity = 0.5, deficit = 0, expectedImprovement = 0.5, cost = 0.2 } = {} ) {

		const utility = -clamp01( cost ) + this.compassionGene * clamp01( affinity ) * clamp01( expectedImprovement ) * clamp01( deficit )
		return { utility, worthHelping: utility > 0 }

	}

}
