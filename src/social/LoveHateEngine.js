function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Dual-valence relational field, distinct from Attachment.js's single-axis
 * affinity: Affinity (A) and Aversion (V) are tracked as two SEPARATE
 * accumulators per user, not two ends of one scale — a relationship can
 * genuinely hold both at once ("te quiero pero me estás haciendo daño" is
 * high-A AND high-V simultaneously, not a wash to a neutral midpoint). The
 * general shape (two independent affect accumulators, an asymmetric decay
 * profile where the negative one lingers longer, and a kindling-sensitized
 * threshold for a relational "rupture") is our own engineering design, not
 * a computational reproduction of any specific published model; the
 * qualitative direction of each piece (loss aversion in relational trust,
 * rupture-and-repair, kindling) draws on the same real literature already
 * cited in Attachment.js and AmygdalaHijack.js. See CALIBRATION.md.
 *
 * Update equations (one explicit-Euler step per call, dt in turn/tick units
 * — the same numerical-integration convention DecayEngine.js already uses,
 * not a continuous-time ODE solver):
 *
 *   A(t+dt) = A + dt · [ α · L_eff · (1 − A)^γ − λ_A(t) · A ]
 *   V(t+dt) = V + dt · [ β · H_eff · (1 + κ · V) − λ_V(t) · V ]
 *
 * A has strong diminishing returns ((1-A)^γ) — trust is hard-won and each
 * increment buys less the closer it gets to full. V has a SELF-REINFORCING
 * slope ((1+κV)) — kindling/rumination, real resentment snowballs instead of
 * plateauing. λ_V is set well below λ_A by default (aversion outlasts
 * affinity), and both are further modulated by real chronic-stress signals
 * (cortisol/circadian) at call time, not baked into a fixed constant.
 */
export class LoveHateEngine {

	constructor( {
		alpha = 0.3, beta = 0.4, gammaExp = 1.6, kappa = 0.5,
		lambdaA = 0.015, lambdaV = 0.005,
		thetaR = 0.45, thetaP = 0.35, thetaCalm = 0.4,
		c1 = 0.25, c2 = 0.18,
	} = {} ) {

		this.alpha     = alpha
		this.beta        = beta
		this.gammaExp     = gammaExp
		this.kappa          = kappa
		this.lambdaA          = lambdaA
		this.lambdaV            = lambdaV
		this.thetaR                = thetaR
		this.thetaP                  = thetaP
		this.thetaCalm                 = thetaCalm
		this.c1                          = c1
		this.c2                             = c2

		this.bonds       = new Map() // userId -> BondState
		this.kindling = new Map() // userId -> accumulated kindling level (0..1), lowers thetaR further per-user

	}

	#entry( userId ) {

		if ( !this.bonds.has( userId ) ) {

			this.bonds.set( userId, { A: 0, V: 0, lastUpdate: Date.now(), ruptured: false, ruptureCount: 0, lastRuptureTick: null, repairCount: 0 } )

		}
		return this.bonds.get( userId )

	}

	getBond( userId ) {

		return this.#entry( userId )

	}

	getNetBond( userId ) {

		const b = this.#entry( userId )
		return b.A - b.V

	}

	/** Real, public read of whether a real rupture is still open (not yet repaired) — a real, distinct "still raw" signal other mechanisms (e.g. `RelationalMemoryCatalog.getReunionReactivation()`) can fold in without reaching into this engine's own private bond state. */
	isRuptured( userId ) {

		return this.#entry( userId ).ruptured

	}

	/** How much the relationship is BOTH loved and hated at once — min(A,V), not |A-V|, since ambivalence is about co-presence, not imbalance. */
	getAmbivalence( userId ) {

		const b = this.#entry( userId )
		return Math.min( b.A, b.V )

	}

	/** A·V — the real interaction term: only nonzero when BOTH are present, unlike ambivalence's min(). */
	getTension( userId ) {

		const b = this.#entry( userId )
		return b.A * b.V

	}

	getDominance( userId ) {

		const b = this.#entry( userId )
		return Math.abs( b.A - b.V )

	}

	/**
	 * Phase 2 (History & Attachment Gate): real modulation of the raw (L, H)
	 * polarization BEFORE it's injected into the A/V update — high existing
	 * trust dampens how much a positive signal can add (sublinear, an
	 * already-secure bond doesn't spike from one more nice turn); unresolved
	 * wounds and chronic cortisol amplify how much a negative signal lands
	 * (superlinear, the opposite curve — a relationship with open wounds
	 * reads the SAME negative signal as worse). `context`: { trust=0.5,
	 * woundPressure=0, cortisol=0, egoHealth=0.7 } — all optional, all real
	 * signals already computed elsewhere in Totemheart (Attachment.trust,
	 * EpisodicMemory.getZeigarnikPressure(), CortisolEngine.getLevel(),
	 * ReputationEngine.getEgoHealth()), not invented for this module.
	 */
	#gate( L, H, { trust = 0.5, woundPressure = 0, cortisol = 0, egoHealth = 0.7 } = {} ) {

		const gA = 1 - trust * 0.35 // sublinear damping: a securely trusted bond needs less convincing, but also gains less per compliment
		const gV = 1 + Math.min( 1, woundPressure ) * 0.6 + cortisol * 0.4 + ( 1 - egoHealth ) * 0.2 // superlinear amplification under real load

		return { Leff: L * gA, Heff: H * gV }

	}

	/**
	 * Real dynamic decay rates: chronic cortisol erodes affinity faster
	 * (a stressed relationship's warmth degrades quicker even without a new
	 * bad turn) and makes aversion linger LONGER (grudges outlast their
	 * trigger under chronic stress) — the direction is a real, defensible
	 * extension of the same allostatic-load reasoning in Homeostasis.js;
	 * the magnitude is own tuning.
	 */
	#dynamicRates( cortisol = 0 ) {

		return {
			lambdaAEff : this.lambdaA * ( 1 + cortisol * 0.5 ),
			lambdaVEff : this.lambdaV * Math.max( 0.3, 1 - cortisol * 0.4 ),
		}

	}

	/**
	 * Main per-turn entry point: Phase 1's (L, H) polarization is computed by
	 * the CALLER (Totemheart already has real desirability/ontology-concept/
	 * life-event signals — duplicating a second lexicon here would be exactly
	 * the kind of theater this project avoids) and handed in directly.
	 * Applies phase 2 (gating) and phase 3 (the A/V update) in one call.
	 */
	observe( userId, { L = 0, H = 0 }, context = {}, dt = 1 ) {

		const bond                     = this.#entry( userId )
		const { Leff, Heff }    = this.#gate( L, H, context )
		const { lambdaAEff, lambdaVEff } = this.#dynamicRates( context.cortisol ?? 0 )

		const kindlingLevel = this.kindling.get( userId ) ?? 0
		const effectiveKappa = this.kappa * ( 1 + kindlingLevel )

		const dA = this.alpha * Leff * Math.pow( 1 - bond.A, this.gammaExp ) - lambdaAEff * bond.A
		const dV = this.beta * Heff * ( 1 + effectiveKappa * bond.V ) - lambdaVEff * bond.V

		bond.A          = clamp01( bond.A + dA * dt )
		bond.V          = clamp01( bond.V + dV * dt )
		bond.lastUpdate = Date.now()

		return { A: bond.A, V: bond.V, Leff, Heff, netBond: bond.A - bond.V }

	}

	/** Background decay only (no new L/H injection) — called from Totemheart.tick() between turns, same real-chronic-rate coupling as observe(). */
	tick( dt = 1, { cortisol = 0 } = {} ) {

		const { lambdaAEff, lambdaVEff } = this.#dynamicRates( cortisol )
		for ( const bond of this.bonds.values() ) {

			bond.A = clamp01( bond.A - lambdaAEff * bond.A * dt )
			bond.V = clamp01( bond.V - lambdaVEff * bond.V * dt )

		}

	}

	/**
	 * Rupture condition, WITH hysteresis (kindling): V exceeding A by more
	 * than a real threshold that itself gets easier to cross the more this
	 * user has ruptured before — the same qualitative "repeated activation
	 * lowers its own future threshold" idea AmygdalaHijack.js's kindling
	 * already models, applied here to relational rupture instead of survival
	 * emotion. `cortisol` (real, from CortisolEngine) and this bond's own
	 * `ambivalence` both lower the effective bar further — a stressed AI, or
	 * a bond already carrying real ambivalence, ruptures more easily.
	 */
	checkRupture( userId, { cortisol = 0 } = {} ) {

		const bond = this.#entry( userId )
		// A real debounce, the same one-shot-until-repaired pattern Attachment.js's
		// rupture flag already uses: without this, every subsequent turn while the
		// gap stays past threshold would re-fire the FULL cross-module side effect
		// (freeze wanting, damage ego health, another wound memory) again — a
		// relationship doesn't re-rupture every single turn it stays bad, it
		// ruptures ONCE and then stays ruptured until something repairs it.
		if ( bond.ruptured ) return { ruptured: false, alreadyRuptured: true }

		const ambivalence  = this.getAmbivalence( userId )
		const kindlingLevel = this.kindling.get( userId ) ?? 0
		const effectiveTheta = Math.max( 0.1, this.thetaR - kindlingLevel * 0.2 )

		const crossed = ( bond.V - bond.A ) > ( effectiveTheta + this.c1 * cortisol + this.c2 * ambivalence )
		if ( !crossed ) return { ruptured: false }

		bond.ruptured           = true
		bond.ruptureCount   += 1
		bond.lastRuptureTick = Date.now()
		this.kindling.set( userId, clamp01( kindlingLevel + 0.15 ) )

		return { ruptured: true, ruptureCount: bond.ruptureCount, netBond: bond.A - bond.V, ambivalence }

	}

	/**
	 * Repair condition: only possible when A genuinely exceeds V by a real
	 * margin AND the AI itself isn't currently under chronic stress (a
	 * flooded/stressed state can't do real repair work, a real finding from
	 * the couples-repair literature Gottman & Levenson's rupture-and-repair
	 * work motivates, already cited in Attachment.js). A successful repair
	 * accelerates V's decay (own tuning: an extra one-off pull, not full
	 * reset — repair heals, it doesn't erase the scar) and returns real
	 * hints for the caller to apply elsewhere (dopamine liking boost, ego
	 * health restoration) rather than reaching into those modules itself.
	 */
	attemptRepair( userId, { cortisol = 0 } = {} ) {

		const bond = this.#entry( userId )
		// Repair only means something as closing an ACTUAL open rupture — without
		// this gate, a bond that merely still has A > V by a margin during an
		// ONGOING run of hostile turns would keep "repairing" itself every turn,
		// perpetually cutting V back down and making a real rupture unreachable
		// no matter how hostile the input gets. A bond that was never ruptured has
		// nothing to repair.
		if ( !bond.ruptured ) return { repaired: false }
		const canRepair = ( bond.A - bond.V ) > this.thetaP && cortisol < this.thetaCalm
		if ( !canRepair ) return { repaired: false }

		const vBefore = bond.V
		bond.V             = clamp01( bond.V * 0.6 ) // accelerated but not-to-zero reduction — the scar tissue (kindling) is untouched
		bond.repairCount += 1
		bond.ruptured        = false // closes an open rupture, if there was one — a fresh checkRupture() can fire again from here

		return { repaired: true, repairCount: bond.repairCount, vReduced: vBefore - bond.V, dopamineLikingBoost: 0.15, egoHealthRestore: 0.05 }

	}

	toJSON() {

		return {
			bonds        : [ ...this.bonds.entries() ],
			kindling : [ ...this.kindling.entries() ],
		}

	}

	restoreState( data = {} ) {

		if ( data.bonds ) this.bonds = new Map( data.bonds )
		if ( data.kindling ) this.kindling = new Map( data.kindling )

	}

}
