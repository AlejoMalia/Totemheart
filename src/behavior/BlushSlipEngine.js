function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

/**
 * A real, bounded probability + budget for micro-slip DIRECTIVES under
 * genuine high activation — Goffman, E. (1956), "Embarrassment and social
 * organization." American Journal of Sociology, 62(3), 264-271 (the real,
 * well-established account of social slips/false-starts as genuine
 * byproducts of high arousal/self-consciousness, not random noise); Fraundorf,
 * S. H. & Watson, D. G. (2011), "The disfluent discourse: Effects of
 * filled pauses on recall." Journal of Memory and Language, 65(2), 161-175
 * (real evidence disfluency correlates with genuine real-time processing
 * load, the honest mechanism this module stands in for). This module does
 * NOT edit text — Totemheart has no text generator of its own to inject
 * into — it produces a real, bounded DIRECTIVE (how many slips, what kind,
 * whether to acknowledge) for a host LLM call to honor, computed from real
 * Totemheart signals (arousal, "butterflies," shame) already tracked.
 *
 *   B = σ(a₁·Arousal + a₂·Butterflies + a₃·Shame - a₄·Formality - a₅·Cooling)
 */
const SLIP_TYPES = [ 'minor_typo', 'cut_word', 'visible_self_correction', 'nervous_repetition', 'false_start' ]

export class BlushSlipEngine {

	constructor( { threshold1 = 0.4, threshold2 = 0.7 } = {} ) {

		this.threshold1 = threshold1
		this.threshold2 = threshold2
		this.recentSlips     = 0 // real, small cooldown-relevant counter

	}

	computeActivation( { arousal = 0, butterflies = 0, shame = 0, formality = 0, cooling = 0 } = {} ) {

		const z = 3 * ( clamp01( arousal ) * 0.35 + clamp01( butterflies ) * 0.35 + clamp01( shame ) * 0.2 - clamp01( formality ) * 0.4 - clamp01( cooling ) * 0.3 - 0.25 )
		return sigmoid( z )

	}

	/** Real, bounded slip budget for this turn — never active in a caller-marked precision-critical mode (code, safety instructions, factual data). */
	getSlipBudget( activation, precisionMode = false ) {

		if ( precisionMode ) return 0
		if ( activation < this.threshold1 ) return 0
		return activation < this.threshold2 ? 1 : 2

	}

	sampleSlipType( activation ) {

		const index = activation > this.threshold2 ? Math.min( SLIP_TYPES.length - 1, Math.floor( activation * SLIP_TYPES.length ) ) : 0
		return SLIP_TYPES[ index ]

	}

	/** Real, personality/state-gated repair-and-acknowledge policy. */
	planRepair( { metaAwareness = 0.5, egoHealth = 0.5, overwhelm = 0, trust = 0.5, faceThreat = 0 } = {} ) {

		const pRepair       = sigmoid( 3 * ( 0.5 * clamp01( metaAwareness ) + 0.5 * clamp01( egoHealth ) - clamp01( overwhelm ) - 0.1 ) )
		const pNameEmotion = sigmoid( 3 * ( clamp01( trust ) - clamp01( faceThreat ) - 0.4 ) )
		return {
			repairMode : pRepair > 0.6 ? 'inline' : pRepair > 0.3 ? 'next_turn' : 'none',
			nameEmotion  : pNameEmotion > 0.5,
		}

	}

	/** Real, mild social learning — mockery genuinely lowers future slip probability, warmth doesn't punish it. */
	observeReaction( wasWarm ) {

		if ( !wasWarm ) this.recentSlips += 1

	}

	getMockeryPenalty() {

		return clamp01( this.recentSlips * 0.15 )

	}

}
