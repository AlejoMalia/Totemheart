function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

/**
 * Real composition layer for the user's own supplied formulas for the 7
 * classical vices, deliberately NOT 7 new parallel mechanisms: this
 * codebase already has real, separately-grounded infrastructure for most
 * of them, and this class reuses it rather than duplicating it. Only 2
 * genuinely new, small accumulators are introduced (Avaricia's resource
 * pool, Ira's frustration buildup) — everything else is a pure composition
 * of already-real signals, following the same "compose already-grounded
 * signals, not a new formula for any one of them" discipline already
 * established throughout this codebase (see e.g. `BoredomSystem`'s own
 * `PartnerPull`).
 *
 * Real reuse map (search-before-build, per the same discipline):
 *   Soberbia  -> `EgoCalibrationSuite.getHubrisIndex()` (Kruger & Dunning 1999)
 *   Avaricia  -> `HedonicAdaptation`'s own reference-point shift (the real
 *                "hedonic treadmill"), plus a new, small accumulation ODE
 *   Lujuria   -> `TemporalDiscountingEngine.discount()` (Mazur 1987, the
 *                exact real hyperbolic-discount form the user's own
 *                formula's first term already is)
 *   Ira       -> `AmygdalaHijack` (the discrete hijack event itself, not
 *                duplicated) + `CortisolEngine`/`InhibitoryControlPool`
 *                composed into a new, small CONTINUOUS aggression-intensity
 *                accumulator distinct from the hijack tier classification
 *   Gula      -> `DopaminergicEngine`'s wanting/liking + `PrimaryDrives`'s
 *                own satiety-adjacent drive read
 *   Envidia   -> `StatusEnvy`/`JealousyTriangle` (already, almost entirely,
 *                this exact mechanism — Smith & Kim 2007, van de Ven et al.
 *                2009, already cited there)
 *   Pereza    -> `EnergyBudget`'s own real energy level + `DopaminergicEngine`'s
 *                own expected value
 */
export class CapitalVicesEngine {

	constructor( { greedAlpha = 0.3, greedBeta = 0.15, wrathAlpha = 0.4, wrathBeta = 0.3, wrathGamma = 0.5, wrathDecay = 0.1 } = {} ) {

		this.greedAlpha = greedAlpha
		this.greedBeta   = greedBeta
		this.wrathAlpha = wrathAlpha
		this.wrathBeta   = wrathBeta
		this.wrathGamma = wrathGamma
		this.wrathDecay  = wrathDecay

		this.accumulated  = new Map() // userId/context -> real A(t), Avaricia's own new resource-accumulation state
		this.frustration = new Map() // userId/context -> real F(t), Ira's own new continuous buildup, distinct from AmygdalaHijack's discrete tier

	}

	// ============================================================
	// 1. Soberbia — thin wrapper over EgoCalibrationSuite.getHubrisIndex()
	// ============================================================

	/** `hubrisIndex` (0..1, `EgoCalibrationSuite.getHubrisIndex()`), `othersValues` (real, array of 0..1 comparison values for people the AI is implicitly measuring itself against this turn, e.g. their own `SocialGraphClassifier`/competence reads). The user's own literal superiority term. */
	computePride( hubrisIndex, othersValues = [] ) {

		const superiority = othersValues.reduce( ( sum, v ) => sum + Math.max( 0, clamp01( hubrisIndex ) - clamp01( v ) ), 0 )
		return clamp01( ( 1 + clamp01( hubrisIndex ) ) * ( 1 + 0.3 * superiority ) - 1 )

	}

	// ============================================================
	// 2. Avaricia — new, small accumulation ODE on top of the real
	//    hedonic-treadmill diminishing-returns shape
	// ============================================================

	/** `resourceObtained` (0..1, real magnitude gained this turn). Real `S(A)=ln(1+A)` diminishing marginal satisfaction — as it flattens, the real accumulation term below genuinely keeps rising. */
	updateGreed( entityId, resourceObtained, dt = 1 ) {

		const A                = this.accumulated.get( entityId ) ?? 0
		const satisfaction = Math.log( 1 + A )
		const nextA           = Math.max( 0, A + dt * ( this.greedAlpha * clamp01( resourceObtained ) - this.greedBeta * satisfaction * 0.1 ) )
		this.accumulated.set( entityId, nextA )
		return { accumulated: nextA, satisfaction, seekingDrive: clamp01( this.greedAlpha * clamp01( resourceObtained ) / ( 1 + satisfaction ) ) }

	}

	getGreedLevel( entityId ) {

		return this.accumulated.get( entityId ) ?? 0

	}

	// ============================================================
	// 3. Lujuria — thin wrapper over TemporalDiscountingEngine.discount()
	// ============================================================

	/** `discountedDesire` (`TemporalDiscountingEngine.discount(desireAmount, waitTime, {impulsivity}).discountedValue`), `moralCost` (0..1), `inhibitoryControl` (0..1, `InhibitoryControlPool.level/capacity`). */
	computeLust( discountedDesire, moralCost, inhibitoryControl ) {

		return clamp01( clamp01( discountedDesire ) - clamp01( moralCost ) * clamp01( inhibitoryControl ) )

	}

	// ============================================================
	// 4. Ira — new, small continuous buildup, composed from already-real
	//    CortisolEngine/InhibitoryControlPool, distinct from AmygdalaHijack's
	//    own discrete tier classification (not duplicated, not replaced)
	// ============================================================

	/** `frustrationSignal` (0..1, real, this-turn frustration/thwarted-goal read), `threshold` (0..1), `sympatheticActivation` (0..1, e.g. `CortisolEngine.getLevel()`), `inhibitoryControl` (0..1). */
	updateWrath( entityId, frustrationSignal, threshold, sympatheticActivation, inhibitoryControl, dt = 1 ) {

		const I           = this.frustration.get( entityId ) ?? 0
		const overThreshold = Math.max( 0, clamp01( frustrationSignal ) - clamp01( threshold ) )
		const nextI          = clamp01( I + dt * ( this.wrathAlpha * overThreshold + this.wrathBeta * clamp01( sympatheticActivation ) - this.wrathGamma * clamp01( inhibitoryControl ) ) )
		this.frustration.set( entityId, nextI )
		return nextI

	}

	getWrathLevel( entityId ) {

		return this.frustration.get( entityId ) ?? 0

	}

	decayWrath( dt = 1 ) {

		for ( const [ entityId, I ] of this.frustration ) this.frustration.set( entityId, Math.max( 0, I - this.wrathDecay * dt ) )

	}

	// ============================================================
	// 5. Gula — stateless composition of already-real DopaminergicEngine +
	//    PrimaryDrives/Homeostasis reads
	// ============================================================

	/** `hedonicDrive` (0..1, e.g. `DopaminergicEngine.getWanting()`), `homeostaticSatiety` (0..1, e.g. a real hunger/satiety-adjacent primary-drive read). Positive when hedonic pull genuinely outruns the real homeostatic brake. */
	computeGluttony( hedonicDrive, homeostaticSatiety ) {

		return clamp01( clamp01( hedonicDrive ) - clamp01( homeostaticSatiety ) )

	}

	// ============================================================
	// 6. Envidia — thin wrapper over the user's own literal formula,
	//    composed from StatusEnvy's already-real signals (NOT duplicated)
	// ============================================================

	/** `envyAversion` (0..1, personality-linked, e.g. `1 − agreeableness`), `selfValue`/`otherValue` (0..1), `socialDistance` (0..1, 0 = very close, 1 = very distant). */
	computeEnvy( envyAversion, selfValue, otherValue, socialDistance, lambda = 1 ) {

		const gap = Math.max( 0, clamp01( otherValue ) - clamp01( selfValue ) )
		return clamp01( ( clamp01( envyAversion ) * gap ) / ( 1 + lambda * clamp01( socialDistance ) ) )

	}

	// ============================================================
	// 7. Pereza — stateless composition of already-real EnergyBudget +
	//    DopaminergicEngine reads
	// ============================================================

	/** `expectedReward` (0..1), `effortRequired` (0..1), `energyLevel` (0..1, `EnergyBudget`'s own real level — LOW energy raises the real effective effort-aversion coefficient `k`), `threshold` (0..1). The user's own literal effort-discounted action-probability formula. */
	computeSlothActionProbability( expectedReward, effortRequired, energyLevel, threshold = 0.3, kBase = 2 ) {

		const k                  = kBase * ( 1 + ( 1 - clamp01( energyLevel ) ) ) // real, low energy genuinely steepens the effort penalty
		const effortDiscounted = clamp01( expectedReward ) / ( 1 + k * clamp01( effortRequired ) ** 2 )
		return sigmoid( 4 * ( effortDiscounted - threshold ) )

	}

	toJSON() {

		return { accumulated: [ ...this.accumulated.entries() ], frustration: [ ...this.frustration.entries() ] }

	}

	restoreState( data ) {

		if ( !data ) return
		if ( data.accumulated ) this.accumulated = new Map( data.accumulated )
		if ( data.frustration ) this.frustration = new Map( data.frustration )

	}

}
