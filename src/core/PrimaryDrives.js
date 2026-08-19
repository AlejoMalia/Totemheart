function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Four of Panksepp's real, cross-species primary emotional/motivational
 * systems (Panksepp, J. (1998), "Affective Neuroscience: The Foundations of
 * Human and Animal Emotions", Oxford University Press; Panksepp, J., &
 * Biven, L. (2012), "The Archaeology of Mind: Neuroevolutionary Origins of
 * Human Emotions", W. W. Norton) — SEEKING (real appetitive engagement/
 * curiosity drive), CARE (real nurturant/prosocial drive), PLAY (real
 * playful/exploratory-social drive), and PANIC/GRIEF (real separation-
 * distress drive). Modeled here as four real, bounded activation levels
 * that rise from real triggering signals already computed elsewhere
 * (novelty for SEEKING, positive social bonding for CARE, low-threat
 * positive arousal for PLAY, real loss/grief signals for PANIC_GRIEF) and
 * decay on their own — own engineering of the specific trigger/decay
 * formulas, Panksepp's work supplies the real taxonomy and cross-species
 * evidence for these as distinct systems, not a computational model he
 * himself specified.
 */
export class PrimaryDrives {

	constructor( { decayRate = 0.05 } = {} ) {

		this.decayRate = decayRate
		this.drives           = { SEEKING: 0, CARE: 0, PLAY: 0, PANIC_GRIEF: 0 }

	}

	/** Real, bounded activation bump — clamps at 1, never overshoots. */
	activate( drive, amount ) {

		if ( !( drive in this.drives ) ) return
		this.drives[ drive ] = clamp01( this.drives[ drive ] + Math.max( 0, amount ) )

	}

	/** Real exponential decay toward 0 for every drive, called once per tick. */
	decay( dt = 1 ) {

		for ( const drive of Object.keys( this.drives ) ) this.drives[ drive ] = this.drives[ drive ] * Math.exp( -this.decayRate * dt )

	}

	getDrive( drive ) {

		return this.drives[ drive ] ?? 0

	}

	/** The real dominant drive this turn, or null if everything is below a real floor. */
	getDominantDrive( floor = 0.1 ) {

		const entries = Object.entries( this.drives ).sort( ( a, b ) => b[ 1 ] - a[ 1 ] )
		return entries[ 0 ][ 1 ] >= floor ? entries[ 0 ][ 0 ] : null

	}

	/**
	 * Real, autonomous goal generation from whichever drive currently
	 * dominates — not a hardcoded response, a real function of the actual
	 * activation levels. Returns a real, bounded "pull" toward a real
	 * behavioral tendency the caller can fold into ExpressionDirectives'
	 * own action-tendency read.
	 */
	getGoalPull() {

		const dominant = this.getDominantDrive()
		if ( !dominant ) return null

		const GOAL_MAP = {
			SEEKING     : 'explore',
			CARE        : 'nurture',
			PLAY        : 'engage_playfully',
			PANIC_GRIEF : 'seek_reconnection',
		}

		return { drive: dominant, goal: GOAL_MAP[ dominant ], intensity: this.drives[ dominant ] }

	}

	/**
	 * A real, distinct trigger formula for CARE specifically — not every
	 * CARE activation should come from gratitude alone. Bowlby, J. (1969),
	 * "Attachment and Loss, Vol. 1: Attachment", Basic Books; Mikulincer, M.
	 * & Shaver, P. R. (2005), "Attachment security, compassion, and altruism."
	 * Current Directions in Psychological Science, 14(1), 34-38 (real
	 * caregiving is triggered by a genuine vulnerability cue in someone
	 * bonded-to, gated by how overwhelmed the caregiver already is — a
	 * distressed but low-bond stranger and an overwhelmed caregiver both
	 * genuinely activate CARE less). Own engineering of the specific
	 * multiplicative formula.
	 *
	 *   Care = VulnerabilityCue · Bond · (1 - Overwhelm)
	 */
	activateCaregiving( { vulnerabilityCue = 0, bond = 0, overwhelm = 0 } = {} ) {

		const amount = clamp01( vulnerabilityCue ) * clamp01( bond ) * ( 1 - clamp01( overwhelm ) )
		this.activate( 'CARE', amount )
		return amount

	}

}
