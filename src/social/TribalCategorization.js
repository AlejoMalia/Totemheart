/**
 * Buckets a user into in-group/out-group based on accrued Attachment
 * affinity. In-group gets the benefit of the doubt (confirmation bias
 * toward the positive); out-group gets systemic skepticism.
 */
export class TribalCategorization {

	classify( relation, { inThreshold = 0.65, outThreshold = 0.35 } = {} ) {

		if ( relation.affinity >= inThreshold ) return 'ingroup'
		if ( relation.affinity <= outThreshold ) return 'outgroup'
		return 'neutral'

	}

	biasMultiplier( group, desirability ) {

		if ( group === 'ingroup' ) return desirability >= 0 ? 1.3 : 0.6
		if ( group === 'outgroup' ) return desirability >= 0 ? 0.6 : 1.3
		return 1

	}

}
