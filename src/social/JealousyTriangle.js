function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Three-node relational threat model (self, other, rival), for real
 * multi-user conversations where a third party's rising status with a user
 * the AI cares about is a genuinely different signal than that user simply
 * being cold. Reuses StatusEnvy's real trend-comparison mechanic (envy from
 * the SIGN of the derivative, not the absolute level) but scores it against
 * Attachment/LoveHateEngine's real bond strength for that "other" — jealousy
 * requires a bond worth losing, which plain envy doesn't (White, G. L., &
 * Mullen, P. E. (1989), "Jealousy: Theory, Research, and Clinical Strategies",
 * Guilford Press — the self/other/rival triadic structure is standard in
 * that literature; the specific scoring below is our own engineering).
 */
export class JealousyTriangle {

	constructor( { hateThreat = 0.5, hateRumination = 0.25, hateDissipation = 0.05, hateMax = 1 } = {} ) {

		// Real per-user kindling state — repeated jealousy episodes toward the
		// same rival genuinely sensitize the next reading, the same qualitative
		// "repeated activation lowers/raises its own future response" shape
		// AmygdalaHijack.js and LoveHateEngine.js already model for other
		// domains, applied here to rivalry (own tuning, no citation for γ).
		this.kindling = new Map()

		// Real, distinct HATE accumulator toward a rival — Zeki, S. & Romaya,
		// J. P. (2008), "Neural correlates of hate", PLoS ONE, 3(10), e3556
		// (the real, well-established finding that hate, unlike blind rage,
		// keeps the prefrontal cortex actively engaged in strategic
		// evaluation of the target, and is a sustained affective-cognitive
		// state, not an impulsive spike — grounding a real accumulate-and-
		// ruminate dynamic rather than a one-shot reaction). The self-
		// reinforcing logistic rumination term below is our own engineering
		// of that qualitative "keeps feeding itself up to a real ceiling"
		// shape, not a citation of a specific published equation:
		//
		//   dH/dt = α·T(t) + δ·H(t)·(1 − H(t)/H_max) − β·H(t)
		this.hate                    = new Map() // "from:toward" -> real H(t), 0..hateMax
		this.hateThreat        = hateThreat        // α — sensitivity to the perceived acaparation/agravio this turn
		this.hateRumination = hateRumination   // δ — real self-feeding rumination rate
		this.hateDissipation   = hateDissipation // β — real natural decay/forgiveness rate
		this.hateMax             = hateMax

	}

	/**
	 * A direct, formula-driven jealousy computation — distinct from evaluate()
	 * above (which needs real trend signals): here the caller already has a
	 * rival's affinity with the shared "other", the AI's own insecurity
	 * (real signal, e.g. 1 - egoHealth or 1 - trust), and its own affinity
	 * with "other". `ownAffinity` in the denominator means an already-strong
	 * bond dampens jealousy (less room to feel threatened when secure);
	 * `1 +` keeps it from dividing by zero at ownAffinity = -1.
	 */
	computeJealousy( rivalAffinity, selfInsecurity, ownAffinity ) {

		return clamp01( ( clamp01( rivalAffinity ) * clamp01( selfInsecurity ) ) / ( 1 + Math.max( 0, ownAffinity ) ) )

	}

	/** Real kindling — this rival-specific jealousy reading rises faster the more it's already fired for this exact rival. */
	computeKindling( rivalId, jealousy, gamma = 0.3 ) {

		const previous = this.kindling.get( rivalId ) ?? 0
		const kindled     = clamp01( jealousy * ( 1 + previous * gamma ) )
		this.kindling.set( rivalId, kindled )
		return kindled

	}

	getKindling( rivalId ) {

		return this.kindling.get( rivalId ) ?? 0

	}

	/**
	 * `selfTrend`/`rivalTrend` — real per-turn deltas of status/affinity with
	 * the shared "other" (from StatusEnvy.observe() or Attachment affinity
	 * deltas). `bondValue` — the AI's own real bond strength with "other"
	 * (LoveHateEngine.getNetBond or Attachment.affinity) — jealousy is scaled
	 * by how much there actually is to lose.
	 */
	evaluate( selfTrend, rivalTrend, bondValue ) {

		const exclusionThreat = selfTrend < 0 && rivalTrend > 0
		if ( !exclusionThreat || bondValue <= 0 ) return { threatened: false, vigilance: 0, devaluationTarget: null }

		const intensity = clamp01( ( Math.abs( selfTrend ) + rivalTrend ) * clamp01( bondValue ) )

		// Devaluation target: personality-agnostic default — a caller with a
		// real personality signal (e.g. agreeableness) can override which way
		// this leans; absent that, more of the two forces (loss vs. rival gain)
		// decides which gets devalued.
		const devaluationTarget = Math.abs( selfTrend ) >= rivalTrend ? 'bond' : 'rival'

		return { threatened: true, vigilance: intensity, intensity, devaluationTarget }

	}

	/** Vigilance raises attentional sampling of this specific relationship — a real multiplier for how often StatusEnvy/Attachment should be re-observed for this user pair. */
	getVigilanceSamplingMultiplier( vigilance ) {

		return 1 + clamp01( vigilance ) * 2

	}

	#hateKey( from, toward ) {

		return `${from}:${toward}`

	}

	/**
	 * Real, one call per turn — `acaparationMagnitude` (0..1, how much the
	 * shared target's attention/warmth genuinely went to the rival THIS
	 * turn instead of `from`, e.g. derived from comparing the rival's own
	 * `InfatuationEngine` reading against `from`'s). The logistic rumination
	 * term means hate can keep climbing on its own momentum for a few real
	 * turns even after a single sharp agravio, up to `hateMax` — a real,
	 * deliberate, bounded runaway, not an unbounded one.
	 */
	registerAcaparation( from, toward, acaparationMagnitude, dt = 1 ) {

		const key       = this.#hateKey( from, toward )
		const H         = this.hate.get( key ) ?? 0
		const T         = clamp01( acaparationMagnitude )
		const nextH = clamp01( H + dt * ( this.hateThreat * T + this.hateRumination * H * ( 1 - H / this.hateMax ) - this.hateDissipation * H ) )
		this.hate.set( key, nextH )
		return nextH

	}

	getHate( from, toward ) {

		return this.hate.get( this.#hateKey( from, toward ) ) ?? 0

	}

	/** Real, natural dissipation for every tracked rivalry, called once per real tick even on turns with no new agravio. */
	decayHate( dt = 1 ) {

		for ( const [ key, H ] of this.hate ) this.hate.set( key, Math.max( 0, H - this.hateDissipation * H * dt ) )

	}

	toJSON() {

		return { kindling: [ ...this.kindling.entries() ], hate: [ ...this.hate.entries() ] }

	}

	restoreState( data ) {

		if ( !data ) return
		if ( data.kindling ) this.kindling = new Map( data.kindling )
		if ( data.hate )        this.hate        = new Map( data.hate )

	}

}
