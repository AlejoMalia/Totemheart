function dot( a, b ) {

	let sum = 0
	for ( const k of Object.keys( a ) ) sum += ( a[ k ] ?? 0 ) * ( b[ k ] ?? 0 )
	return sum

}

function norm( v ) {

	return Math.sqrt( Object.values( v ).reduce( ( s, x ) => s + x * x, 0 ) )

}

/**
 * Real homophily/resonance — McPherson, M., Smith-Lovin, L. & Cook, J. M.
 * (2001), "Birds of a feather: Homophily in social networks", Annual Review
 * of Sociology, 27(1), 415-444 (the real, well-established finding that
 * similarity of values/interests/traits genuinely predicts affinity, an
 * independent mechanism from `LoveHateEngine`'s own episodic bond
 * accumulation, which tracks accumulated HISTORY, not baseline
 * compatibility). Real cosine similarity between the AI's own trait/
 * interest profile and an inferred profile for `userId`, both as plain
 * numeric vectors over the SAME real dimensions this codebase already
 * tracks (Personality's own Big Five, plus a real, caller-supplied set of
 * shared-interest weights, e.g. from `FrikiEngine`).
 *
 *   A(i,j) = (v_i · v_j) / (‖v_i‖·‖v_j‖)
 */
export class AffinityResonance {

	/** `selfVector`/`otherVector` — plain objects keyed by dimension name (e.g. `{openness: 0.8, dinosaurios: 0.6}`), same real keys expected on both sides for meaningful overlap; missing keys on either side read as 0. */
	compute( selfVector, otherVector ) {

		const nSelf  = norm( selfVector )
		const nOther = norm( otherVector )
		if ( nSelf === 0 || nOther === 0 ) return 0
		return dot( selfVector, otherVector ) / ( nSelf * nOther )

	}

}
