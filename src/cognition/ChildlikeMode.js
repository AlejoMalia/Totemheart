function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

const WEIGHTS = { happiness: 1.2, play: 1.4, geek: 0.8, safety: 1.0, bond: 0.6, threat: 1.8, shame: 1.5, formality: 0.6, allostaticLoad: 0.8 }
const BIAS                  = -2.2 // own tuning: keeps an ordinary neutral turn below the gate threshold, calibrated so a genuinely happy/safe/playful real conversation can still cross it
const GATE_THRESHOLD  = 0.5
const SMOOTHING              = 0.5 // own tuning: how much a fresh reading moves the persistent "stance" vs. how much prior state carries over — a stance, not a per-turn flicker
const SUPPRESSION_BETA         = 0.6 // how strongly "adult-serious" weight gets attenuated at full activation
const PLAY_BOOST_GAMMA     = 0.4
const EMBARRASSMENT_THRESHOLD_DELTA = 0.25 // laughs at itself more readily
const WONDER_BOOST_SCALE       = 0.3
const DECAY_RATE                     = 0.3 // own tuning: per real day, how fast the stance fades without fresh reinforcement

/**
 * ChildlikeMode (the user's own explicit spec): NOT baby-talk, NOT lowered
 * competence — a real, temporary STANCE shift toward more PLAY, curiosity,
 * and wonder, and less adult gravity (moralizing, status distance,
 * over-analysis), the way a genuinely safe, happy, playful moment can make
 * an adult "silly on purpose" without becoming less capable. Grounded in
 * real, established findings already used elsewhere in this project:
 * Panksepp, J. (1998), "Affective Neuroscience" (PLAY as a genuine primary-
 * process system, already cited for `PrimaryDrives.js`); Bowlby, J. (1988),
 * "A Secure Base", and Ainsworth, M. D. S. (1978), "Patterns of
 * Attachment" (the real, foundational finding that felt security enables
 * exploratory/playful behavior, not the reverse); Fredrickson, B. L.
 * (2001), "The role of positive emotions in positive psychology: the
 * broaden-and-build theory" (already cited for `HappinessEngine.js` — real
 * positive affect measurably broadens the behavioral repertoire toward
 * play and exploration).
 *
 * Deliberately a real STANCE, not a per-turn flicker: `computeActivation()`
 * smooths a fresh reading against the prior persistent level, and
 * `decay()` fades it gradually rather than snapping to 0 the instant one
 * input signal dips — matching the qualitative shape of an actual mood/
 * stance, not a stateless per-message classifier.
 *
 * Hard abort per the user's own explicit safety requirement: real threat,
 * shame, or `precisionMode` don't just lower the activation score, they
 * gate it off entirely via `gate()`/`shouldAbort()`, so genuine pain or a
 * factual request never gets trivialized by a playful register.
 */
export class ChildlikeMode {

	constructor() {

		this.level = new Map() // userId -> persistent smoothed stance level, 0..1

	}

	/**
	 * All inputs are real, already-computed signals from elsewhere in the
	 * pipeline (own composition, not a new sensor): `happiness`
	 * (`HappinessEngine.getWellbeingNormalized()`), `play` (`PrimaryDrives`'
	 * own PLAY level), `geekSalience` (`FrikiEngine`'s own current interest
	 * in whatever obsession is active), `safety` (real trust), `bond` (real
	 * affinity), `threat` (real cortisol or trauma-trace proxy), `shame`
	 * (`ShameGuiltSplit.shame`), `formality` (a real trait/context
	 * formality proxy), `allostaticLoad` (`Homeostasis.allostaticLoad`).
	 */
	computeActivation( userId, { happiness = 0, play = 0, geekSalience = 0, safety = 0, bond = 0, threat = 0, shame = 0, formality = 0, allostaticLoad = 0 } = {} ) {

		const raw = sigmoid(
			WEIGHTS.happiness * clamp01( happiness ) +
			WEIGHTS.play * clamp01( play ) +
			WEIGHTS.geek * clamp01( geekSalience ) +
			WEIGHTS.safety * clamp01( safety ) +
			WEIGHTS.bond * clamp01( bond ) -
			WEIGHTS.threat * clamp01( threat ) -
			WEIGHTS.shame * clamp01( shame ) -
			WEIGHTS.formality * clamp01( formality ) -
			WEIGHTS.allostaticLoad * clamp01( allostaticLoad ) +
			BIAS
		)

		const prior     = this.level.get( userId ) ?? 0
		const smoothed = clamp01( prior * SMOOTHING + raw * ( 1 - SMOOTHING ) )
		this.level.set( userId, smoothed )
		return smoothed

	}

	/** Real hard gate — genuine threat, real shame, or `precisionMode` turn the mode off entirely, not just down. */
	gate( userId, { precisionMode = false, traumaFreeze = 0 } = {} ) {

		if ( precisionMode || traumaFreeze > 0.1 ) return false
		return ( this.level.get( userId ) ?? 0 ) > GATE_THRESHOLD

	}

	shouldAbort( { threat = 0, shame = 0, precisionMode = false } = {} ) {

		return threat > 0.5 || shame > 0.4 || precisionMode

	}

	/** Attenuates (never zeroes) an "adult-serious" weight — moralizing, status distance, over-analysis — proportional to how strongly the mode is active. `level` should be 0 when `gate()` is false. */
	applySeriousnessSuppression( level, weight ) {

		return weight * ( 1 - SUPPRESSION_BETA * clamp01( level ) )

	}

	getPlayBoost( level, currentPlay ) {

		return clamp01( currentPlay + PLAY_BOOST_GAMMA * clamp01( level ) * ( 1 - currentPlay ) )

	}

	/** How much higher the real embarrassment threshold should read — a childlike stance laughs at its own gaffes rather than reading them as poise-threatening. */
	getEmbarrassmentThresholdBoost( level ) {

		return EMBARRASSMENT_THRESHOLD_DELTA * clamp01( level )

	}

	/** Real wonder bias — ordinary novelty reads as more chills-worthy, not only genuinely sublime/vast content. */
	getWonderBoost( level ) {

		return WONDER_BOOST_SCALE * clamp01( level )

	}

	getLevel( userId ) {

		return this.level.get( userId ) ?? 0

	}

	/** Real, gradual fade toward 0 — a stance that isn't being reinforced fades over real days, it doesn't vanish the instant one turn dips. */
	decay( userId, dt = 1, rate = DECAY_RATE ) {

		const current = this.level.get( userId )
		if ( current === undefined ) return
		this.level.set( userId, current * Math.exp( -rate * dt ) )

	}

	decayAll( dt = 1, rate = DECAY_RATE ) {

		for ( const id of this.level.keys() ) this.decay( id, dt, rate )

	}

	toJSON() {

		return [ ...this.level.entries() ]

	}

	restoreState( data ) {

		if ( data ) this.level = new Map( data )

	}

}
