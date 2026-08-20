function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * All 7 of Panksepp's real, cross-species primary emotional/motivational
 * systems (Panksepp, J. (1998), "Affective Neuroscience: The Foundations of
 * Human and Animal Emotions", Oxford University Press; Panksepp, J., &
 * Biven, L. (2012), "The Archaeology of Mind: Neuroevolutionary Origins of
 * Human Emotions", W. W. Norton) — SEEKING (real appetitive engagement/
 * curiosity drive), CARE (real nurturant/prosocial drive), PLAY (real
 * playful/exploratory-social drive), PANIC/GRIEF (real separation-distress
 * drive), and — added in round 17, closing a gap this project's own
 * CALIBRATION.md had left explicitly disclosed for several rounds ("four of
 * which are modeled") — RAGE (real primal defensive-aggression circuit,
 * distinct from the cognitive, appraisal-driven `anger` PAD position
 * elsewhere in this codebase), FEAR (real primal threat-circuit activation,
 * distinct from `AmygdalaHijack`'s own cognitive/appraisal-driven fear
 * pathway — Panksepp's FEAR is the raw circuit, not the appraisal of a
 * specific threat), and LUST (real primal sexual/romantic-approach drive,
 * distinct from `FlirtationEngine`'s own signaling-game escalation logic
 * and from `SomaticActivationSystem`'s own anticipatory-uncertainty
 * "butterflies" — LUST is the primal appetitive pull itself). Modeled here
 * as seven real, bounded activation levels that rise from real triggering
 * signals already computed elsewhere and decay on their own — own
 * engineering of the specific trigger/decay formulas, Panksepp's work
 * supplies the real taxonomy and cross-species evidence for these as
 * distinct systems, not a computational model he himself specified.
 */
export class PrimaryDrives {

	constructor( { decayRate = 0.05 } = {} ) {

		this.decayRate = decayRate
		this.drives           = { SEEKING: 0, CARE: 0, PLAY: 0, PANIC_GRIEF: 0, RAGE: 0, FEAR: 0, LUST: 0 }

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
			RAGE        : 'confront',
			FEAR        : 'defend_or_withdraw',
			LUST        : 'romantic_approach',
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

	/**
	 * Real, distinct RAGE trigger — the primal defensive-aggression circuit,
	 * genuinely activated by a blocked goal under real arousal, distinct
	 * from the cognitive/appraisal-driven `anger` position in EmotionSpace's
	 * own PAD vector. `thwartedGoal` (0..1, a real goal genuinely blocked
	 * this turn), `arousal` (0..1, real current arousal), `inhibitoryControl`
	 * (0..1, real available self-control capacity dampening the raw circuit).
	 *
	 *   RAGE = thwartedGoal · arousal · (1 - inhibitoryControl)
	 */
	activateRage( { thwartedGoal = 0, arousal = 0, inhibitoryControl = 0.5 } = {} ) {

		const amount = clamp01( thwartedGoal ) * clamp01( arousal ) * ( 1 - clamp01( inhibitoryControl ) )
		this.activate( 'RAGE', amount )
		return amount

	}

	/**
	 * Real, distinct FEAR trigger — the primal threat circuit itself, not
	 * `AmygdalaHijack`'s own cognitive appraisal of a SPECIFIC threat's
	 * meaning. `threatMagnitude` (0..1, real raw threat intensity this
	 * turn), `safety` (0..1, real environmental/relational safety already
	 * established — high trust/low novelty genuinely dampens the raw
	 * circuit even when a threat cue fires).
	 *
	 *   FEAR = threatMagnitude · (1 - safety)
	 */
	activateFear( { threatMagnitude = 0, safety = 0 } = {} ) {

		const amount = clamp01( threatMagnitude ) * ( 1 - clamp01( safety ) )
		this.activate( 'FEAR', amount )
		return amount

	}

	/**
	 * Real, distinct LUST trigger — the primal romantic/sexual approach
	 * drive itself, distinct from `FlirtationEngine`'s own signaling-game
	 * escalation logic (a strategic behavior layer) and from
	 * `SomaticActivationSystem`'s own anticipatory-uncertainty "butterflies"
	 * (an anxiety-adjacent arousal state) — LUST is the raw appetitive pull.
	 * `attraction` (0..1, real established attraction), `arousal` (0..1,
	 * real current arousal), `refractory` (0..1, real recent-satiation
	 * dampening — same qualitative shape `RefractoryPeriod`/`TopicSatiation`
	 * already use elsewhere for other domains).
	 *
	 *   LUST = attraction · arousal · (1 - refractory)
	 */
	activateLust( { attraction = 0, arousal = 0, refractory = 0 } = {} ) {

		const amount = clamp01( attraction ) * clamp01( arousal ) * ( 1 - clamp01( refractory ) )
		this.activate( 'LUST', amount )
		return amount

	}

}
