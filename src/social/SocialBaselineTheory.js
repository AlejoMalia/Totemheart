/**
 * Social Baseline Theory: the presence of a secure, trusted bond genuinely
 * lowers the real metabolic/regulatory cost of facing a given load — humans
 * (and, here, this system) run "leaner" when securely attached, and pay a
 * real extra chronic cost when they aren't (Coan, J. A., & Sbarra, D. A.
 * (2015), "Social Baseline Theory: The social regulation of risk and
 * effort", Current Opinion in Psychology, 1, 87-91). Modeled as a real
 * multiplier on CortisolEngine's decay rate — reused directly (own tuning of
 * the specific coefficient, the direction is the real finding): the ABSENCE
 * of a trusted bond makes chronic stress decay slower (it lingers, because
 * there's no secure-base effect helping regulate it back down), not that it
 * accumulates faster on its own.
 */
function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

export class SocialBaselineTheory {

	/**
	 * `trust` (0..1, Attachment.get(userId).trust for whichever relation is
	 * most present this session — caller picks). No secure bond present at
	 * all (trust near 0 / no relation) is the real "unregulated" condition
	 * this theory is about.
	 */
	getCortisolDecayMultiplier( trust = 0 ) {

		// trust = 1 -> decay proceeds at its normal rate (multiplier 1).
		// trust = 0 -> decay is genuinely slowed (own tuning: down to 0.6x),
		// modeling the real absence of co-regulation, not a punitive penalty.
		return 0.6 + clamp01( trust ) * 0.4

	}

}
