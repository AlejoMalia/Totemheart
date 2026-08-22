function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function clamp11( v ) {

	return Math.max( -1, Math.min( 1, v ) )

}

/**
 * Real, persistent stance formation toward IDEAS/claims/topics, distinct
 * from `LoveHateEngine` (which tracks feeling toward a PERSON) and from
 * `Attachment.trust` (a general reliability posterior, not a position on a
 * claim) — Petty, R. E. & Cacioppo, J. T. (1986), "The Elaboration
 * Likelihood Model of Persuasion", Advances in Experimental Social
 * Psychology, 19, 123-205 (the real, well-established finding that
 * attitudes form and update from a genuine mix of evidence quality and
 * peripheral/social pressure cues, at a real, tunable "elaboration"
 * depth); Chaiken, S. (1980), "Heuristic versus systematic information
 * processing", Journal of Personality and Social Psychology, 39(5),
 * 752-766 (the real dual-process split this module's `evidence` vs
 * `socialPressure` terms follow). Lets a real critique/objection exist
 * without collapsing into low agreeableness or dislike of the person.
 *
 *   Δs_k = η·e_k·(1−d) − ρ·p_k + μ·v_k
 *   c_k ← c_k + α|e_k|(1−c_k) − β·contradiction
 */
export class OpinionStanceEngine {

	constructor( { eta = 0.4, rho = 0.15, mu = 0.2, alpha = 0.3, beta = 0.25 } = {} ) {

		this.eta = eta; this.rho = rho; this.mu = mu; this.alpha = alpha; this.beta = beta
		this.stances = new Map() // topicKey -> { stance: -1..1, conviction: 0..1 }

	}

	#entry( topicKey ) {

		if ( !this.stances.has( topicKey ) ) this.stances.set( topicKey, { stance: 0, conviction: 0 } )
		return this.stances.get( topicKey )

	}

	/**
	 * `evidence` (-1..1, real perceived support/refutation this turn),
	 * `dogmatism` (0..1, real trait/state resistance to updating),
	 * `socialPressure` (0..1, real pull toward a different position than
	 * the evidence alone would give), `valueAlignment` (-1..1, real pull
	 * from the AI's own value hierarchy), `contradiction` (0..1, real, this
	 * turn's own evidence genuinely conflicts with the standing stance).
	 */
	update( topicKey, { evidence = 0, dogmatism = 0.3, socialPressure = 0, valueAlignment = 0, contradiction = 0 } = {} ) {

		const entry = this.#entry( topicKey )
		const delta   = this.eta * evidence * ( 1 - clamp01( dogmatism ) ) - this.rho * clamp01( socialPressure ) + this.mu * valueAlignment
		entry.stance      = clamp11( entry.stance + delta )
		entry.conviction = clamp01( entry.conviction + this.alpha * Math.abs( evidence ) * ( 1 - entry.conviction ) - this.beta * clamp01( contradiction ) )
		return { ...entry }

	}

	getStance( topicKey ) {

		return this.stances.get( topicKey ) ?? { stance: 0, conviction: 0 }

	}

	/** Real, distinct critique-vs-hatred signal — a real, held stance genuinely CAN coexist with a warm bond; this only reads the idea-level disagreement, never touches interpersonal affect on its own. */
	getDisagreementMagnitude( topicKey ) {

		const entry = this.getStance( topicKey )
		return clamp01( Math.max( 0, -entry.stance ) * entry.conviction )

	}

	toJSON() {

		return [ ...this.stances.entries() ]

	}

	restoreState( data ) {

		if ( data ) this.stances = new Map( data )

	}

}
