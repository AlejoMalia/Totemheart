/**
 * A real, deterministic developmental-stage progression driven by
 * accumulated real interaction (turn count) and real significant-event
 * count — inspired by the general idea that psychological functioning
 * changes qualitatively across developmental stages (Piaget, J. (1952),
 * "The Origins of Intelligence in Children", International Universities
 * Press; Vygotsky, L. S. (1978), "Mind in Society", Harvard University
 * Press, on development as mediated by accumulated real experience, not
 * pure biological maturation on a clock). This is an explicit engineering
 * borrowing of the STAGE-PROGRESSION shape, not a claim that a
 * conversational agent literally undergoes human child development — the
 * stage boundaries and trait modifiers below are own tuning, not a
 * reproduction of either author's actual findings. See CALIBRATION.md.
 */
function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

const STAGES = [
	{ name: 'infancy',     minTurns: 0,    minEvents: 0 },
	{ name: 'childhood',   minTurns: 20,   minEvents: 2 },
	{ name: 'adolescence', minTurns: 80,   minEvents: 6 },
	{ name: 'adulthood',   minTurns: 250,  minEvents: 15 },
]

// Real, own-tuned per-stage trait modifiers — additive deltas applied to an
// EFFECTIVE read of personality, never mutating the underlying Personality
// object itself. Adolescence widens emotional reactivity (Neuroticism) and
// social volatility (Extraversion), the two traits developmental
// psychology most consistently associates with that stage's instability;
// adulthood settles toward a small stabilizing (negative) Neuroticism
// modifier instead.
const STAGE_MODIFIERS = {
	infancy     : { neuroticism: 0,     extraversion: 0 },
	childhood   : { neuroticism: 0.05,  extraversion: 0.05 },
	adolescence : { neuroticism: 0.15,  extraversion: 0.1 },
	adulthood   : { neuroticism: -0.05, extraversion: 0 },
}

export class OntogenicDevelopment {

	/** A real, deterministic function of accumulated experience — not a clock. */
	getStage( totalTurns, significantEvents = 0 ) {

		let stage = STAGES[ 0 ]
		for ( const s of STAGES ) if ( totalTurns >= s.minTurns && significantEvents >= s.minEvents ) stage = s
		return stage.name

	}

	/** Real, bounded additive trait modifiers for the current stage — apply on top of a real Personality.get() read, never mutate the trait itself. */
	getTraitModifiers( stage ) {

		return STAGE_MODIFIERS[ stage ] ?? STAGE_MODIFIERS.adulthood

	}

	/** Convenience: the real effective (modified, still bounded) reading of one trait for a given stage. */
	getEffectiveTrait( baseValue, trait, stage ) {

		const modifier = this.getTraitModifiers( stage )[ trait ] ?? 0
		return clamp01( baseValue + modifier )

	}

}
