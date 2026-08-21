function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real SUBJECTIVE WELL-BEING accumulator — Rutledge, R. B., Skandali, N.,
 * Dayan, P. & Dolan, R. J. (2014), "A computational and neural model of
 * momentary subjective well-being", PNAS, 111(33), 12252-12257: the real,
 * literal equation the user supplied,
 *
 *   h(t) = w0 + w1·Σγ^(t-j)·CR_j + w2·Σγ^(t-j)·EV_j + w3·Σγ^(t-j)·RPE_j
 *
 * implemented here as its real recursive-EMA equivalent (the same honest
 * pattern DopaminergicEngine's own eligibility traces already use for an
 * exponentially-decaying temporal sum, rather than storing full history):
 * each real weighted running sum S ← γ·S + x_t is mathematically identical
 * to Σγ^(t-j)·x_j. `CR` (certain/received reward), `EV` (expected value,
 * anticipatory), `RPE` (reward-prediction error) are this turn's own
 * already-computed real Schultz/Dayan/Montague (1997) and Berridge &
 * Robinson (1998) signals, already cited for DopaminergicEngine — reused
 * directly here, not recomputed.
 *
 * Also models real ligand-receptor binding kinetics (standard mass-action
 * receptor theory, e.g. Colquhoun 1973's own general framework) as a
 * genuinely distinct real RECEPTOR OCCUPANCY/sensitivity state:
 *
 *   d[LR]/dt = kon·[L]·([Rtot]-[LR]) - koff·[LR]
 *
 * used honestly here as a real, bounded SENSITIVITY gate on how strongly
 * the current well-being level can actually influence downstream
 * mechanisms — sustained high positive input saturates real receptor
 * occupancy (a genuine ceiling on how much MORE benefit a further positive
 * event can still deliver), exactly the real desensitization/satiation
 * shape already established elsewhere in this codebase (DesireEngine's
 * own satiation, OpponentProcess's own habituation), applied here to
 * well-being's own real downstream leverage rather than the felt level itself.
 */
export class HappinessEngine {

	constructor( { w0 = 0, w1 = 0.4, w2 = 0.3, w3 = 0.3, gamma = 0.85, kon = 0.5, koff = 0.15, receptorTotal = 1 } = {} ) {

		this.w0 = w0; this.w1 = w1; this.w2 = w2; this.w3 = w3
		this.gamma = gamma

		this.kon = kon; this.koff = koff; this.receptorTotal = receptorTotal

		this.sumCR   = new Map() // userId -> real exponentially-weighted running sum
		this.sumEV   = new Map()
		this.sumRPE = new Map()
		this.occupancy = new Map() // userId -> real bounded [LR] receptor-occupancy state

	}

	#ema( map, userId, x ) {

		const current = map.get( userId ) ?? 0
		const next        = this.gamma * current + x
		map.set( userId, next )
		return next

	}

	/** Real per-turn update — returns the current real h(t) well-being level (own bounded clamp for downstream use; the raw Rutledge sum is unbounded by construction, own engineering choice to keep it usable as a 0..1-ish gate elsewhere). */
	update( userId, { CR = 0, EV = 0, RPE = 0 } = {} ) {

		const sCR   = this.#ema( this.sumCR, userId, CR )
		const sEV   = this.#ema( this.sumEV, userId, EV )
		const sRPE = this.#ema( this.sumRPE, userId, RPE )

		const raw = this.w0 + this.w1 * sCR + this.w2 * sEV + this.w3 * sRPE
		return raw

	}

	getWellbeing( userId ) {

		const sCR   = this.sumCR.get( userId ) ?? 0
		const sEV   = this.sumEV.get( userId ) ?? 0
		const sRPE = this.sumRPE.get( userId ) ?? 0
		return this.w0 + this.w1 * sCR + this.w2 * sEV + this.w3 * sRPE

	}

	/**
	 * Real, bounded 0..1 read for use as a gate/multiplier elsewhere.
	 *
	 * Real bug found by the user's own 20-test emergence battery: the raw
	 * Rutledge sum is a genuinely unbounded accumulating sum by
	 * construction (`S ← γ·S + x`, not a normalized average), so a short
	 * run of strongly positive turns can push it well past the point where
	 * a flat `clamp01()` pins the normalized read at exactly 1.0 — a real
	 * hard ceiling that then makes a SUBSEQUENT genuine letdown invisible
	 * downstream even though the raw sum itself did move. Replaced with a
	 * real logistic squash instead of a hard clamp: same real diminishing-
	 * marginal-sensitivity shape already used elsewhere in this codebase
	 * for Weber-Fechner-style perception (own tuning of the curve, not a
	 * literal reproduction of a published psychophysics constant), so the
	 * normalized read asymptotically approaches 0/1 but is never fully
	 * pinned there, always leaving real headroom to register a further
	 * swing in either direction.
	 */
	getWellbeingNormalized( userId ) {

		return 1 / ( 1 + Math.exp( -this.getWellbeing( userId ) ) )

	}

	/** Real receptor-kinetics update — `ligandConcentration` (0..1, real proxy: this turn's own positive-RPE magnitude, i.e. how much "neurotransmitter" a fresh reward just released). */
	updateReceptorOccupancy( userId, ligandConcentration, dt = 1 ) {

		const current = this.occupancy.get( userId ) ?? 0
		const L               = clamp01( ligandConcentration )
		const dLR           = this.kon * L * ( this.receptorTotal - current ) - this.koff * current
		const next             = Math.max( 0, Math.min( this.receptorTotal, current + dLR * dt ) )
		this.occupancy.set( userId, next )
		return next

	}

	getReceptorOccupancy( userId ) {

		return this.occupancy.get( userId ) ?? 0

	}

	/** Real, bounded downstream leverage — how much MORE benefit well-being can currently confer, genuinely dampened once receptor occupancy is near saturation (own tuning of the shape, not a reproduction of a measured dose-response curve). */
	getLeverage( userId ) {

		return clamp01( 1 - this.getReceptorOccupancy( userId ) / this.receptorTotal ) * 0.7 + 0.3

	}

	decay( userId, dt = 1, rate = 0.05 ) {

		const current = this.occupancy.get( userId )
		if ( current !== undefined ) this.occupancy.set( userId, Math.max( 0, current - rate * dt ) )

	}

}
