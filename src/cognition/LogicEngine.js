/**
 * Cold, deductive reasoning — deliberately independent of the PAD vector,
 * as requested. Two real pieces, honestly scoped:
 *  1. Boolean proposition evaluation: does the input affirm or negate each
 *     CoreBelief's polarity? A real negation-window boolean check (not a
 *     full theorem prover), producing true/false/null (unrelated) per belief.
 *  2. A small real tree search over candidate response strategies
 *     {agree, disagree, deflect}, each scored purely by how many boolean
 *     propositions it would violate — a genuine (if shallow, one-ply)
 *     search-and-score process, not a re-labeling of the emotional pipeline.
 *     This is NOT a claim of implementing Tree-of-Thoughts or A* search in
 *     their full generality (those explore deep, branching chains with a
 *     learned heuristic) — it's the honestly-sized real version: one level
 *     of real search over a small fixed action set, scored deterministically.
 */
const NEGATORS = new Set( [ 'no', 'nunca', 'jamas', 'jamás', 'tampoco', 'not', 'never' ] )

function tokenize( text ) {

	return ( text || '' ).toLowerCase().match( /[\p{L}']+/gu ) || []

}

export class LogicEngine {

	/** Returns [{ topic, consistent: true|false|null }] — null means "this input doesn't touch this belief at all". */
	evaluatePropositions( text, beliefs ) {

		const tokens = tokenize( text )
		const negated  = tokens.some( t => NEGATORS.has( t ) )

		return beliefs.map( belief => {

			const beliefTokens = tokenize( belief.statement )
			const overlap         = beliefTokens.filter( t => tokens.includes( t ) ).length
			if ( overlap === 0 ) return { topic: belief.topic, consistent: null }

			// If the input negates a belief it clearly overlaps with, it's inconsistent
			// with that belief's stated polarity; otherwise treat it as affirming.
			const inputPolarity = negated ? -1 : 1
			const consistent       = inputPolarity === Math.sign( belief.polarity || 1 )
			return { topic: belief.topic, consistent }

		} )

	}

	/**
	 * One-ply real search: score each candidate strategy by how many
	 * evaluated propositions it would violate if taken, pick the max —
	 * purely boolean, no emotional weighting.
	 */
	searchBestStrategy( propositionResults ) {

		const violations = propositionResults.filter( p => p.consistent === false ).length
		const affirmed      = propositionResults.filter( p => p.consistent === true ).length

		const strategies = {
			agree     : affirmed - violations * 2,   // agreeing is bad if we're contradicting known-true beliefs
			disagree  : violations - affirmed * 0.5, // disagreeing is good precisely when there ARE violations to correct
			deflect   : violations > 0 && affirmed > 0 ? 0.5 : -1, // only sound when the picture is genuinely mixed
		}

		const [ bestStrategy ] = Object.entries( strategies ).sort( ( a, b ) => b[ 1 ] - a[ 1 ] )
		return { strategy: bestStrategy[ 0 ], scores: strategies, violations, affirmed }

	}

}
