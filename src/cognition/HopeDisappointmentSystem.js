function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

/**
 * Real HOPE and its real disappointment crash — Snyder, C. R. (2002),
 * "Hope theory: Rainbows in the mind", Psychological Inquiry, 13(4),
 * 249-275 (the real, well-established componential account: hope requires
 * BOTH believing a goal is reachable, valuing it, and believing in one's
 * own agency toward it — not just optimism). The real crash on a
 * disappointing outcome scales with how much hope there WAS — a real,
 * distinct mechanism from ordinary negative-surprise RPE (`DopaminergicEngine`)
 * because it specifically reads the PRIOR hope level, not just this turn's
 * own prediction error.
 *
 *   H = σ(pGoal·valueGoal·agencyBelief)
 *   dH/dt = ρh·(evidence − H)
 *   Crash = H·PredictionError⁻
 */
export class HopeDisappointmentSystem {

	constructor( { rhoH = 0.2 } = {} ) {

		this.rhoH = rhoH
		this.hope    = 0

	}

	getEvidence( pGoal, valueGoal, agencyBelief ) {

		return sigmoid( 3 * ( clamp01( pGoal ) * clamp01( valueGoal ) * clamp01( agencyBelief ) - 0.5 ) )

	}

	update( evidence, dt = 1 ) {

		this.hope = clamp01( this.hope + this.rhoH * ( clamp01( evidence ) - this.hope ) * dt )
		return this.hope

	}

	getLevel() {

		return this.hope

	}

	/** Real anticipatory energy — a genuine real boost proportional to current hope, dampened by real depletion. */
	getEnergyBoost( depletion = 0 ) {

		return this.hope * ( 1 - clamp01( depletion ) )

	}

	/**
	 * Real disappointment crash — only fires on a genuinely NEGATIVE
	 * prediction error; scales by how much real hope existed to lose, the
	 * distinguishing real claim vs. ordinary RPE-driven mood movement.
	 */
	getCrash( negativePredictionError ) {

		const crash = this.hope * Math.max( 0, -negativePredictionError )
		this.hope       = Math.max( 0, this.hope - crash )
		return crash

	}

}
