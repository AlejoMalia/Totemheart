/**
 * Real Mamdani-style fuzzy inference (triangular membership functions +
 * min/max rule aggregation), not just a threshold. Where CognitiveDissonance
 * gives a single continuous conflict score, this asks a fuzzier question:
 * "given how much this conflicts AND how much I trust the source, how
 * acceptable is it?" — degrees of membership in [0,1], not a crisp cutoff.
 */
function triangular( x, a, b, c ) {

	if ( x <= a || x >= c ) return 0
	if ( x === b ) return 1
	return x < b ? ( x - a ) / ( b - a ) : ( c - x ) / ( c - b )

}

const CONFLICT_SETS = {
	low    : x => triangular( x, -0.1, 0, 0.4 ),
	medium : x => triangular( x, 0.2, 0.5, 0.8 ),
	high   : x => triangular( x, 0.6, 1, 1.1 ),
}

const TRUST_SETS = {
	low    : x => triangular( x, -0.1, 0, 0.4 ),
	medium : x => triangular( x, 0.2, 0.5, 0.8 ),
	high   : x => triangular( x, 0.6, 1, 1.1 ),
}

/**
 * Rules (Mamdani, min for AND, max for aggregation):
 *  IF conflict=low                          THEN acceptable=high
 *  IF conflict=medium AND trust=high        THEN acceptable=medium
 *  IF conflict=medium AND trust=low         THEN acceptable=low
 *  IF conflict=high                          THEN acceptable=low
 * Own rule base — a defensible small set for this domain, not a reproduction
 * of a published rule set.
 */
export class FuzzyNormativeCheck {

	/** Returns a 0..1 "acceptability" degree via centroid defuzzification over 3 output singletons. */
	evaluate( conflictScore, trust ) {

		const conflict = { low: CONFLICT_SETS.low( conflictScore ), medium: CONFLICT_SETS.medium( conflictScore ), high: CONFLICT_SETS.high( conflictScore ) }
		const trustDeg  = { low: TRUST_SETS.low( trust ), medium: TRUST_SETS.medium( trust ), high: TRUST_SETS.high( trust ) }

		const ruleStrength = {
			high   : conflict.low,
			medium : Math.min( conflict.medium, trustDeg.high ),
			low    : Math.max( Math.min( conflict.medium, trustDeg.low ), conflict.high ),
		}

		// Centroid of singletons at 0 (low), 0.5 (medium), 1 (high), weighted by rule strength.
		const weights = [ [ 0, ruleStrength.low ], [ 0.5, ruleStrength.medium ], [ 1, ruleStrength.high ] ]
		const totalWeight = weights.reduce( ( sum, [ , w ] ) => sum + w, 0 )
		if ( totalWeight === 0 ) return 0.5 // no rule fired meaningfully — neutral default

		return weights.reduce( ( sum, [ v, w ] ) => sum + v * w, 0 ) / totalWeight

	}

}
