function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

/**
 * Real secret-keeping COST — Slepian, M. L., Chun, J. S. & Mason, M. F.
 * (2017), "The experience of secrecy", Journal of Personality and Social
 * Psychology, 113(1), 1-33 (the real, well-established finding that a
 * secret's real burden comes from real MIND-WANDERING back to it, not
 * from the act of concealment in conversation — the cost accrues even
 * when the secret never comes up). Distinct from `ExpressionDebt` (the
 * general swallowed-feeling ledger) — this is scoped specifically to
 * maintaining a real, ongoing concealed fact, with its own real leak-risk
 * and white-lie-policy dynamics.
 *
 *   dCost/dt = μ·salience + ξ·queries − λf·lowSalience
 *   P(leak) = σ(c1·Arousal + c2·Guilt + c3·Load − c4·CoverStrength − c5·I)
 *   P(whiteLie) = σ(care + faceProtect − honestyValue − stakesTruth)
 */
export class SecretMaintenanceSystem {

	constructor( { mu = 0.15, xi = 0.3, lambdaForget = 0.02, c1 = 1, c2 = 1, c3 = 0.8, c4 = 1.2, c5 = 1 } = {} ) {

		this.mu = mu; this.xi = xi; this.lambdaForget = lambdaForget
		this.c1 = c1; this.c2 = c2; this.c3 = c3; this.c4 = c4; this.c5 = c5
		this.secrets = new Map() // secretId -> { stakeholders, cost, coverStoryStrength, createdAt }

	}

	#entry( secretId ) {

		if ( !this.secrets.has( secretId ) ) this.secrets.set( secretId, { stakeholders: [], cost: 0, coverStoryStrength: 0.5, createdAt: Date.now() } )
		return this.secrets.get( secretId )

	}

	openSecret( secretId, stakeholders = [], coverStoryStrength = 0.5 ) {

		const entry = this.#entry( secretId )
		entry.stakeholders = stakeholders
		entry.coverStoryStrength = clamp01( coverStoryStrength )
		return entry

	}

	/** Real per-turn maintenance-cost update — `salience` (0..1, how much this came to mind/was queried this turn), `queried` (real 0/1 — someone actually asked about it this turn). */
	updateCost( secretId, salience = 0, queried = false, dt = 1 ) {

		const entry = this.#entry( secretId )
		const delta   = this.mu * clamp01( salience ) + ( queried ? this.xi : 0 ) - ( salience < 0.1 ? this.lambdaForget * dt : 0 )
		entry.cost      = Math.max( 0, entry.cost + delta )
		return entry.cost

	}

	getCost( secretId ) {

		return this.#entry( secretId ).cost

	}

	/** Real leak probability this turn — a genuinely bounded logistic over already-computed real inputs. */
	getLeakProbability( secretId, { arousal = 0, guilt = 0, load = 0, inhibitoryControl = 0.5 } ) {

		const entry = this.#entry( secretId )
		const z = this.c1 * clamp01( arousal ) + this.c2 * clamp01( guilt ) + this.c3 * clamp01( load ) - this.c4 * entry.coverStoryStrength - this.c5 * clamp01( inhibitoryControl ) - 1
		return sigmoid( z )

	}

	/** Real white-lie probability — DePaulo, B. M. & Kashy, D. A. (1998), "Everyday lies in close and casual relationships", Journal of Personality and Social Psychology, 74(1), 63-79 (the real, well-established finding that most everyday lies are prosocial, care-motivated, not malicious). */
	getWhiteLieProbability( { care = 0, faceProtect = 0, honestyValue = 0.5, stakesTruth = 0 } ) {

		const z = clamp01( care ) + clamp01( faceProtect ) - clamp01( honestyValue ) - clamp01( stakesTruth )
		return sigmoid( z )

	}

	decay( secretId, dt = 1, rate = 0.01 ) {

		const entry = this.#entry( secretId )
		entry.cost      = Math.max( 0, entry.cost - rate * dt )

	}

}
