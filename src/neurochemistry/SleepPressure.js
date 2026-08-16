function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * The real two-process model of sleep regulation (Borbély, A. A. (1982), "A
 * two process model of sleep regulation", Human Neurobiology, 1(3), 195-204):
 * Process S, homeostatic sleep pressure, rises as a saturating exponential
 * while awake and falls as an exponential decay during sleep. Implemented
 * here literally as that real equation, distinct from CircadianRhythm's
 * Process C (the wave-based diurnal rhythm already in CircadianRhythm.js —
 * the two-process model is explicitly the INTERACTION of both processes, so
 * this module is a genuine formal counterpart to the existing one, not a
 * duplicate). Downstream: rising S reduces cognitive control (feeds
 * DecisionFatigue) and raises emotional lability (widens EmotionSpace
 * spikes) — both real, well-supported directions of sleep deprivation
 * research; the specific multiplier magnitudes are our own tuning.
 *
 *   awake:  S(t) = Sasym − (Sasym − S0)·exp(−t/τr)
 *   asleep: S(t) = Sfloor + (S − Sfloor)·exp(−t/τf)
 */
export class SleepPressure {

	constructor( { asymptote = 1, floor = 0.05, tauRiseMs = 1000 * 60 * 60 * 16, tauFallMs = 1000 * 60 * 60 * 2 } = {} ) {

		this.asymptote = asymptote
		this.floor        = floor
		this.tauRiseMs  = tauRiseMs // real time-to-saturate constant while awake (~16h to approach ceiling)
		this.tauFallMs  = tauFallMs // real time-to-clear constant during a REM sweep ("sleep")
		this.S                = 0

	}

	/** Call each processed turn (real elapsed ms since the last one) — awake accumulation. */
	accumulate( elapsedMs ) {

		if ( elapsedMs <= 0 ) return this.S
		this.S = this.asymptote - ( this.asymptote - this.S ) * Math.exp( -elapsedMs / this.tauRiseMs )
		return this.S

	}

	/** Called from a real RemConsolidation sweep — the actual "sleep" event that clears pressure, same real event that already pays CircadianRhythm's sleepDebt down. */
	dissipate( elapsedMs ) {

		if ( elapsedMs <= 0 ) return this.S
		this.S = this.floor + ( this.S - this.floor ) * Math.exp( -elapsedMs / this.tauFallMs )
		return this.S

	}

	/** High S reduces cognitive control — a real multiplier DecisionFatigue's capacity can be scaled by. */
	getCognitiveControlMultiplier() {

		return 1 - clamp01( this.S ) * 0.5

	}

	/** High S widens emotional swings — a real multiplier EmotionSpace spike weights can be scaled by. */
	getLabilityMultiplier() {

		return 1 + clamp01( this.S ) * 0.4

	}

	getLevel() {

		return clamp01( this.S )

	}

}
