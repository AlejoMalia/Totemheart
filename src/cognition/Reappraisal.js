/**
 * Cognitive reappraisal — a second interpretive pass over an appraisal that
 * deliberately reframes it toward a less extreme reading. The request that
 * prompted this module named a GAN (Generative Adversarial Network) as the
 * implementation technique; that's not applied here on purpose — a GAN
 * needs a generator/discriminator pair trained against real reframing data,
 * which does not exist for this library, and claiming one on a
 * deterministic reweighting would be mislabeling, not an implementation.
 * What's built instead is the real *effect* reappraisal is meant to have —
 * "reinterpret the meaning of the event to change its emotional impact" —
 * as an explicit, deterministic bias mask. Own design, no citation.
 */
function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

export class Reappraisal {

	/** `strength` (0..1) — how much this reframing pass pulls the appraisal toward neutral. */
	reframe( appraisal, strength = 0.4 ) {

		const dampened = clamp01( strength )
		return {
			...appraisal,
			desirability : ( appraisal.desirability ?? 0 ) * ( 1 - dampened ),
			moralWeight   : ( appraisal.moralWeight ?? 0 ) * ( 1 - dampened * 0.6 ),
			reappraised   : true,
		}

	}

}
