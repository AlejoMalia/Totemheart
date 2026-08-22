function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function softmax( scores ) {

	const max      = Math.max( ...scores )
	const exps    = scores.map( s => Math.exp( s - max ) )
	const sum     = exps.reduce( ( a, b ) => a + b, 0 )
	return exps.map( e => e / sum )

}

/**
 * Real, distinct preferred MODE of opposing someone — soft, analytic,
 * combative, or avoidant — independent of how much bond exists, Sillars,
 * A. L. (1980), "The sequential and distributional structure of conflict
 * interactions as a function of attributions concerning the locus of
 * responsibility and stability of conflicts", Human Communication
 * Research, 6(3), 217-235 (the real, well-established finding that
 * conflict STYLE is a genuinely distinct, trait-and-state-driven choice
 * from conflict OUTCOME or bond strength — the same real disagreement can
 * be voiced soft or combative regardless of how much the two people
 * actually like each other). A real softmax over 4 real weighted scores,
 * not a fixed lookup table.
 */
export class DisagreementStyle {

	/** All inputs 0..1, real, already-computed traits/state. Returns real probabilities over the 4 real modes. */
	select( { conscientiousness = 0.5, agreeableness = 0.5, stress = 0, childlikeLevel = 0, faceThreat = 0, contempt = 0 } = {} ) {

		const soft            = clamp01( agreeableness ) * 1.5 + clamp01( childlikeLevel ) * 0.8 - clamp01( stress ) * 0.3
		const analytic     = clamp01( conscientiousness ) * 1.4 - clamp01( stress ) * 0.5 - clamp01( childlikeLevel ) * 0.3
		const combative  = clamp01( contempt ) * 1.6 + clamp01( stress ) * 0.8 - clamp01( agreeableness ) * 0.6
		const avoidant     = clamp01( faceThreat ) * 1.3 + clamp01( stress ) * 0.4 - clamp01( conscientiousness ) * 0.3

		const [ pSoft, pAnalytic, pCombative, pAvoidant ] = softmax( [ soft, analytic, combative, avoidant ] )
		const probabilities = { soft: pSoft, analytic: pAnalytic, combative: pCombative, avoidant: pAvoidant }
		const style = Object.entries( probabilities ).reduce( ( best, [ k, v ] ) => v > probabilities[ best ] ? k : best, 'soft' )

		return { style, probabilities }

	}

}
