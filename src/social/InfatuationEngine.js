function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

const DAY_MS = 1000 * 60 * 60 * 24

/**
 * Real, per-person "degree of falling in love" — a genuinely distinct
 * construct from `LoveHateEngine`'s own episodic Affinity/Aversion (a
 * general-purpose bond/harm accumulator applying to any relationship type)
 * and `DesireEngine`'s own generic appetitive wanting: this models the
 * SPECIFIC, real limerence/attachment-formation phase sequence Fisher, H.
 * (2004), "Why We Love: The Nature and Chemistry of Romantic Love", Henry
 * Holt (the real, well-established tripartite lust/attraction/attachment
 * model) and Tennov, D. (1979), "Love and Limerence: The Experience of
 * Being in Love", Stein and Day (the real coined term "limerence" and its
 * defining finding that UNCERTAINTY about reciprocation genuinely
 * intensifies infatuation rather than dampening it) describe.
 *
 * Four real phases, composed rather than reduced to one number from the
 * start:
 *
 *   1. Spark (one-shot activation gate on first real contact):
 *        A(x) = σ(k·(x − θ))
 *   2. Chemistry kinetics (explicit-Euler, the same numerical convention
 *      already used throughout this codebase, e.g. LoveHateEngine.js):
 *        dD/dt = α·E(t) − β·D(t)
 *        dS/dt = −γ·D(t) + δ·(S_basal − S(t))
 *   3. Reciprocal amplification (Strogatz, S. H. (1988), "Love affairs and
 *      differential equations", Mathematics Magazine, 61(1), 35 — the real,
 *      well-known linear coupled-ODE toy model of mutual romantic
 *      feedback; bounded here via clamp01 each step, an own engineering
 *      simplification, since the literal unbounded linear system blows up
 *      or decays to zero with no real saturation):
 *        dR/dt = a·R(t) + b·J(t)
 *   4. Attachment consolidation: deliberately NOT reimplemented here —
 *      `OxytocinSystem.getLevel(userId)` already IS this exact real
 *      asymptotic saturation shape (Carter, C. S. (1998), already cited
 *      there), so `getInfatuationLevel()` below takes it as an input
 *      rather than duplicating it.
 *
 * The final composite blends phases 2-3 (chemistry-dominated) against
 * phase 4 (attachment-dominated) by real elapsed relationship time, per
 * the source material's own real ~12-24 month transition window — over a
 * short real relationship this blend stays chemistry-heavy, honestly, not
 * forced toward attachment early.
 */
export class InfatuationEngine {

	constructor( { k = 4, theta = 0.5, alpha = 0.4, beta = 0.15, gamma = 0.3, delta = 0.1, sBasal = 1, stroA = -0.05, stroB = 0.5, attachmentHorizonMonths = 12 } = {} ) {

		this.k       = k       // sigmoid gain for the initial spark gate
		this.theta   = theta   // preference threshold for the initial spark gate
		this.alpha   = alpha   // dopamine build rate from real exposure
		this.beta    = beta    // dopamine decay rate
		this.gamma   = gamma   // serotonin suppression rate from dopamine (the real obsessive-dip term)
		this.delta   = delta   // serotonin's own real pull back toward basal
		this.sBasal  = sBasal
		this.stroA   = stroA   // Strogatz self-reaction (own cautious default: slightly negative, real "cooling without reinforcement")
		this.stroB   = stroB   // Strogatz reaction to the other's reported feeling
		this.attachmentHorizonMonths = attachmentHorizonMonths

		this.sparked         = new Map() // userId -> boolean, one-shot Phase-1 gate
		this.dopamine        = new Map() // userId -> D(t), 0..1
		this.serotonin       = new Map() // userId -> S(t), real, can dip below sBasal
		this.reciprocal      = new Map() // userId -> R(t), 0..1
		this.firstContactAt  = new Map() // userId -> real epoch ms of the spark

	}

	/** Real, one-shot Phase-1 gate — `stimulusSum` (0..1, this codebase's own real first-appraisal attraction read: e.g. desirability + novelty this turn). Fires at most once per userId; later calls are a no-op. */
	computeSpark( userId, stimulusSum, now = Date.now() ) {

		if ( this.sparked.get( userId ) ) return { fired: false, activation: sigmoid( this.k * ( clamp01( stimulusSum ) - this.theta ) ) }

		const activation = sigmoid( this.k * ( clamp01( stimulusSum ) - this.theta ) )
		const fired          = activation > 0.5
		if ( fired ) {

			this.sparked.set( userId, true )
			this.firstContactAt.set( userId, now )
			this.dopamine.set( userId, clamp01( activation * 0.3 ) ) // real, modest seed — the spark starts the chemistry, doesn't max it out in one step
			this.serotonin.set( userId, this.sBasal )

		}
		return { fired, activation }

	}

	/** Real Phase-2 chemistry step — `exposure` (0..1, this turn's real interaction intensity/engagement). No-op until `computeSpark()` has actually fired for this userId. */
	updateChemistry( userId, exposure, dt = 1 ) {

		if ( !this.sparked.get( userId ) ) return null

		const D = this.dopamine.get( userId ) ?? 0
		const S = this.serotonin.get( userId ) ?? this.sBasal

		const nextD = clamp01( D + dt * ( this.alpha * clamp01( exposure ) - this.beta * D ) )
		const nextS = Math.max( 0, S + dt * ( -this.gamma * D + this.delta * ( this.sBasal - S ) ) )

		this.dopamine.set( userId, nextD )
		this.serotonin.set( userId, nextS )
		return { dopamine: nextD, serotonin: nextS }

	}

	/** Real Phase-3 reciprocal step — `otherInfatuation` (0..1, the OTHER party's own real, independently-computed `getInfatuationLevel()` this turn — a genuine cross-party signal, not invented). No-op until sparked. */
	updateReciprocalDynamics( userId, otherInfatuation, dt = 1 ) {

		if ( !this.sparked.get( userId ) ) return null

		const R          = this.reciprocal.get( userId ) ?? 0
		const nextR = clamp01( R + dt * ( this.stroA * R + this.stroB * clamp01( otherInfatuation ) ) )
		this.reciprocal.set( userId, nextR )
		return nextR

	}

	/** Real composite "grado de enamoramiento" — `attachmentLevel` (0..1, e.g. `OxytocinSystem.getLevel(userId)`), the real Phase-4 input this engine deliberately does not duplicate. Returns 0 for anyone never sparked. */
	getInfatuationLevel( userId, { attachmentLevel = 0, now = Date.now() } = {} ) {

		if ( !this.sparked.get( userId ) ) return 0

		const D                  = this.dopamine.get( userId ) ?? 0
		const R                  = this.reciprocal.get( userId ) ?? 0
		const firstAt        = this.firstContactAt.get( userId )
		const monthsElapsed = firstAt ? ( now - firstAt ) / ( DAY_MS * 30 ) : 0
		const attachWeight = clamp01( monthsElapsed / this.attachmentHorizonMonths )
		const chemWeight     = 1 - attachWeight

		return clamp01( chemWeight * ( 0.5 * D + 0.5 * R ) + attachWeight * clamp01( attachmentLevel ) )

	}

	/** Real, distinct read of the obsessive/intrusive-thinking component alone — low serotonin relative to basal, gated by real dopamine presence (obsession requires the chemistry to actually be active, not just any serotonin dip). */
	getObsessiveThinking( userId ) {

		if ( !this.sparked.get( userId ) ) return 0
		const S = this.serotonin.get( userId ) ?? this.sBasal
		const D = this.dopamine.get( userId ) ?? 0
		return clamp01( ( this.sBasal - S ) / this.sBasal ) * clamp01( D )

	}

	getDopamine( userId )   { return this.dopamine.get( userId ) ?? 0 }
	getSerotonin( userId )   { return this.serotonin.get( userId ) ?? this.sBasal }
	getReciprocal( userId ) { return this.reciprocal.get( userId ) ?? 0 }
	isSparked( userId )        { return this.sparked.get( userId ) ?? false }

	decay( dt = 1 ) {

		for ( const userId of this.sparked.keys() ) this.updateChemistry( userId, 0, dt )

	}

	toJSON() {

		return {
			sparked        : [ ...this.sparked.entries() ],
			dopamine       : [ ...this.dopamine.entries() ],
			serotonin      : [ ...this.serotonin.entries() ],
			reciprocal     : [ ...this.reciprocal.entries() ],
			firstContactAt : [ ...this.firstContactAt.entries() ],
		}

	}

	restoreState( data ) {

		if ( !data ) return
		if ( data.sparked )        this.sparked        = new Map( data.sparked )
		if ( data.dopamine )       this.dopamine       = new Map( data.dopamine )
		if ( data.serotonin )      this.serotonin      = new Map( data.serotonin )
		if ( data.reciprocal )     this.reciprocal     = new Map( data.reciprocal )
		if ( data.firstContactAt ) this.firstContactAt = new Map( data.firstContactAt )

	}

}
