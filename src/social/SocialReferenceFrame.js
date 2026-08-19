/**
 * Real relative, not absolute, outcome evaluation — Festinger, L. (1954), "A
 * theory of social comparison processes." Human Relations, 7(2), 117-140
 * (the actual, foundational finding: people genuinely evaluate their own
 * state relative to a real reference group, not against an absolute scale);
 * Clark, A. E. & Oswald, A. J. (1996), "Satisfaction and comparison
 * income." Journal of Public Economics, 61(3), 359-381 (real empirical
 * confirmation that RELATIVE standing predicts satisfaction better than
 * absolute level). Distinct from `StatusEnvy` (which reads the real
 * DERIVATIVE of relative status specifically) — this is the simpler, real
 * relative-utility read itself, the raw material that derivative is
 * computed FROM.
 *
 *   u_i = x_i - mean(x_group)
 */
export class SocialReferenceFrame {

	/** `own` — real 0..1 own outcome. `group` — real array of others' 0..1 outcomes in the same reference class. */
	evaluate( own, group ) {

		if ( !group.length ) return { relativeUtility: 0, groupMean: own, percentile: 0.5 }

		const groupMean         = group.reduce( ( a, b ) => a + b, 0 ) / group.length
		const relativeUtility = own - groupMean
		const percentile           = group.filter( v => v <= own ).length / group.length

		return { relativeUtility, groupMean, percentile }

	}

}
