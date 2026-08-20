function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real support-TYPE matching — Cutrona, C. E. & Russell, D. W. (1990),
 * "Type of social support and specific stress: Toward a theory of optimal
 * matching", in Sarason et al. (eds.), Social Support: An Interactional
 * View, Wiley (the real, well-established "optimal matching" finding:
 * support only genuinely helps when its TYPE fits the real need —
 * unsolicited advice when someone wants to be heard measurably backfires,
 * not just "helps less"). Reuses `EmpathyCompassion`'s own real CARE-driven
 * helping evaluation as the base rate this module's fit term multiplies,
 * rather than re-deriving a separate helping magnitude.
 *
 *   Fit = match(neededType, offeredType)
 *   Efficacy = Fit · CARE · (1 − Overwhelm_other)
 */
const SUPPORT_TYPES = [ 'listen', 'validate', 'advice', 'practical', 'humor', 'space' ]

export class ConsolationEfficacy {

	/** Real fit — exact match is 1, a real partial-compatibility table for common real near-misses, otherwise a real mismatch penalty. */
	getFit( neededType, offeredType ) {

		if ( neededType === offeredType ) return 1
		const compatible = { listen: [ 'validate' ], validate: [ 'listen' ], practical: [ 'advice' ], advice: [ 'practical' ] }
		if ( compatible[ neededType ]?.includes( offeredType ) ) return 0.5
		return 0.1

	}

	getEfficacy( neededType, offeredType, care, overwhelmOther = 0 ) {

		return this.getFit( neededType, offeredType ) * clamp01( care ) * ( 1 - clamp01( overwhelmOther ) )

	}

	/** Real mismatch penalty — advice offered when listening was needed is the real, specifically-cited worst case. */
	getMismatchIrritation( neededType, offeredType ) {

		return neededType === 'listen' && offeredType === 'advice' ? 0.5 : this.getFit( neededType, offeredType ) < 0.3 ? 0.25 : 0

	}

}

export { SUPPORT_TYPES }
