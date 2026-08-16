/**
 * Fehr-Schmidt inequity aversion (Fehr, E. & Schmidt, K. M., 1999, "A Theory
 * of Fairness, Competition, and Cooperation", Quarterly Journal of
 * Economics): U_i(x) = x_i − α·max(x_j − x_i, 0) − β·max(x_i − x_j, 0).
 * α (envy term) and β (guilt term) are the paper's own parameters; the
 * typical fitted range (α > β, both ≥ 0) is used here as a default, not
 * re-derived from data. Applied to how "treatment" (Attachment.affinity) is
 * distributed across known users, instead of monetary payoffs — the
 * mechanism is the same math, the domain is Totemheart's, not the paper's.
 */
export class FairnessMonitor {

	constructor( { alpha = 1.0, beta = 0.6 } = {} ) {

		this.alpha = alpha // envy coefficient — pain from others having more
		this.beta   = beta  // guilt coefficient — discomfort from having more than others

	}

	/** `ownTreatment` and `othersTreatment` (array) are affinity-like values in [0,1]. */
	evaluate( ownTreatment, othersTreatment ) {

		if ( !othersTreatment.length ) return { utility: ownTreatment, envy: 0, guilt: 0 }

		const avgOther = othersTreatment.reduce( ( a, b ) => a + b, 0 ) / othersTreatment.length
		const envy       = this.alpha * Math.max( avgOther - ownTreatment, 0 )
		const guilt        = this.beta * Math.max( ownTreatment - avgOther, 0 )
		const utility        = ownTreatment - envy - guilt

		return { utility, envy, guilt }

	}

}
