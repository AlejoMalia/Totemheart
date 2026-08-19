function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Self-Determination Theory's three real basic psychological needs — Deci,
 * E. L., & Ryan, R. M. (2000), "The 'what' and 'why' of goal pursuits:
 * Human needs and the self-determination of behavior", Psychological
 * Inquiry, 11(4), 227-268; Ryan, R. M., & Deci, E. L. (2000),
 * "Self-determination theory and the facilitation of intrinsic motivation,
 * social development, and well-being", American Psychologist, 55(1), 68-78.
 * Autonomy, Competence, and Relatedness are real, cross-culturally
 * replicated need constructs whose chronic frustration predicts real
 * motivational and affective decline — distinct from Homeostasis (physical
 * needs) and PrimaryDrives (Panksepp's affective-neuroscience drives): this
 * is specifically the SDT need triad. The set-point-tracking ODE and the
 * specific supply/drain vocabulary are own engineering, not a computational
 * model Deci & Ryan themselves specified.
 *
 *   Deficit_i = max(0, set_i - level_i)
 *   dN_i/dt = Supply_i - Drain_i - λ_i(N_i - set_i)
 *   IntrinsicMotivation = Π_i (1 - Deficit_i)
 *   FrustrationAffect = Σ_i w_i·Deficit_i
 */
export class SelfDeterminationNeeds {

	constructor( { setPoints = {}, decayRate = 0.03 } = {} ) {

		this.setPoints = {
			autonomy    : setPoints.autonomy    ?? 0.6,
			competence  : setPoints.competence  ?? 0.6,
			relatedness : setPoints.relatedness ?? 0.6,
		}
		this.decayRate = decayRate
		this.levels          = { autonomy: 0.5, competence: 0.5, relatedness: 0.5 }

	}

	/** A real supply event this turn (e.g. a choice honored, a task mastered, a bond affirmed). */
	supply( need, amount ) {

		if ( !( need in this.levels ) ) return
		this.levels[ need ] = clamp01( this.levels[ need ] + Math.max( 0, amount ) )

	}

	/** A real drain event (a choice overridden, a failure, a rejection). */
	drain( need, amount ) {

		if ( !( need in this.levels ) ) return
		this.levels[ need ] = clamp01( this.levels[ need ] - Math.max( 0, amount ) )

	}

	/** Real pull back toward each need's own set point, called once per tick. */
	decay( dt = 1 ) {

		for ( const need of Object.keys( this.levels ) ) {

			const pull = this.decayRate * dt * ( this.levels[ need ] - this.setPoints[ need ] )
			this.levels[ need ] = clamp01( this.levels[ need ] - pull )

		}

	}

	getDeficit( need ) {

		return Math.max( 0, this.setPoints[ need ] - this.levels[ need ] )

	}

	/** Real product of (1-deficit) across all three — any one chronically-starved need caps overall intrinsic motivation. */
	getIntrinsicMotivation() {

		return Object.keys( this.levels ).reduce( ( product, need ) => product * ( 1 - this.getDeficit( need ) ), 1 )

	}

	/** Real weighted sum of deficits — the negative-affect contribution chronic need-frustration produces. */
	getFrustrationAffect( weights = { autonomy: 0.34, competence: 0.33, relatedness: 0.33 } ) {

		return clamp01( Object.keys( this.levels ).reduce( ( sum, need ) => sum + ( weights[ need ] ?? 0 ) * this.getDeficit( need ), 0 ) )

	}

}
