function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real, distinct grievance accumulation, retributive utility, and
 * multi-mode forgiveness — Axelrod, R. (1984), "The Evolution of
 * Cooperation." Basic Books (the real, well-established game-theoretic
 * account of retaliation as a real, conditional strategy, not blind
 * aggression); McCullough, M. E., Kurzban, R. & Tabak, B. A. (2013),
 * "Cognitive systems for revenge and forgiveness." Behavioral and Brain
 * Sciences, 36(1), 1-15 (the real, well-established finding that revenge
 * and forgiveness are two outputs of the SAME real cost-benefit
 * deterrence system, not opposites — and that real forgiveness is
 * genuinely gated on different signals for different people: material
 * repair, social submission, or simply time, matching this module's 3
 * real forgiveness modes). Distinct from `RepairProtocol` (a single
 * apology-accept/reject transaction with a real trust-rebound ceiling) —
 * this tracks the real, separate GRIEVANCE accumulator revenge itself
 * draws down from, and the real personality-weighted choice of WHICH kind
 * of repair signal actually counts toward reducing it.
 *
 *   G(t) = δ·G(t-1) + I·max(0, ΔU⁻)
 *   U_total(a) = U_base(a) - C(a) + α·G(t)·D(a)
 *   ΔG = -(π₁·C_ji + π₂·S_ji + π₃·time) · G(t)
 */
export class GrudgeSystem {

	constructor( { delta = 0.9, alpha = 0.6, forgivenessWeights = { material: 0.3, submission: 0.3, time: 0.4 } } = {} ) {

		this.delta                    = delta   // real memory-persistence rate for grievance
		this.alpha                     = alpha    // real "revenge gene" — how much accumulated grievance amplifies retributive utility
		this.forgivenessWeights = forgivenessWeights
		this.grievances                    = new Map() // "i:j" -> real grievance level

	}

	#key( from, toward ) {

		return `${from}:${toward}`

	}

	getGrievance( from, toward ) {

		return this.grievances.get( this.#key( from, toward ) ) ?? 0

	}

	/**
	 * `intentionality` (0..1) — real perceived deliberateness of the harm.
	 * `lossMagnitude` (0..1) — real utility loss suffered. Called once per
	 * real harmful turn.
	 */
	registerHarm( from, toward, intentionality, lossMagnitude ) {

		const key      = this.#key( from, toward )
		const current = this.grievances.get( key ) ?? 0
		const updated = this.delta * current + clamp01( intentionality ) * Math.max( 0, lossMagnitude )
		this.grievances.set( key, clamp01( updated ) )
		return this.grievances.get( key )

	}

	/**
	 * Real, altered utility for a candidate retributive action — positive
	 * once accumulated grievance and real inflictable damage outweigh its
	 * own real cost.
	 */
	evaluateRetribution( from, toward, { baseUtility = 0, cost = 0.3, damageInflictable = 0.5 } = {} ) {

		const grievance     = this.getGrievance( from, toward )
		const totalUtility = baseUtility - cost + this.alpha * grievance * clamp01( damageInflictable )
		return { totalUtility, worthIt: totalUtility > 0, grievance }

	}

	/**
	 * Real, personality-weighted forgiveness — a real material-repair
	 * signal, a real submission/apology signal, and real elapsed time all
	 * genuinely reduce grievance, weighted by how much THIS AI's own
	 * personality actually values each mode (own-tuned defaults; a caller
	 * can pass real Personality-derived weights instead).
	 */
	forgive( from, toward, { materialRepair = 0, submission = 0, elapsedNormalized = 0 } = {} ) {

		const key       = this.#key( from, toward )
		const current = this.grievances.get( key ) ?? 0
		if ( current <= 0 ) return 0

		const w         = this.forgivenessWeights
		const relief = clamp01( w.material * clamp01( materialRepair ) + w.submission * clamp01( submission ) + w.time * clamp01( elapsedNormalized ) )
		const updated = clamp01( current * ( 1 - relief ) )
		this.grievances.set( key, updated )
		return current - updated

	}

	decay( dt = 1, lambda = 0.01 ) {

		for ( const [ key, g ] of this.grievances ) this.grievances.set( key, Math.max( 0, g - lambda * dt ) )

	}

}
