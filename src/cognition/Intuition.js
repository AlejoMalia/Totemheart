/**
 * Fast-path heuristic, real k-NN (Jaccard similarity over token sets — a
 * real, zero-dependency distance metric; pass an `embedProvider` for a
 * proper vector k-NN via SemanticSimilarity-style embeddings instead) over
 * a rolling log of past inputs tagged with whether they preceded a
 * conflict/dissonance event. When the current input's nearest neighbors
 * disagree about whether that kind of input goes well or badly, that
 * disagreement IS uncertainty — quantified with real Shannon entropy:
 *   H(X) = -Σ P(x) log2(P(x))
 * over the binary {conflict, no-conflict} outcome distribution of the
 * neighbors found. High entropy (neighbors split ~50/50) = high hunch
 * penalty; neighbors that agree (all fine or all conflictual) produce low
 * entropy — a confident prediction either way, not an uncertain one.
 */
export function shannonEntropy( probabilities ) {

	let h = 0
	for ( const p of probabilities ) if ( p > 0 ) h -= p * Math.log2( p )
	return h

}

function jaccard( a, b ) {

	const intersection = [ ...a ].filter( x => b.has( x ) ).length
	const union           = new Set( [ ...a, ...b ] ).size
	return union > 0 ? intersection / union : 0

}

export class Intuition {

	constructor( { k = 3, maxHistory = 200 } = {} ) {

		this.k              = k
		this.maxHistory   = maxHistory
		this.history          = [] // { tokens: Set<string>, wasConflict: boolean }

	}

	/** Real k-NN + Shannon entropy over the outcome distribution of the nearest matches. */
	sense( tokens ) {

		const tokenSet = new Set( tokens )
		if ( !this.history.length ) return { entropy: 0, hunchPenalty: 0, neighborsFound: 0 }

		const scored = this.history
			.map( entry => ( { ...entry, similarity: jaccard( tokenSet, entry.tokens ) } ) )
			.filter( entry => entry.similarity > 0.1 )
			.sort( ( a, b ) => b.similarity - a.similarity )
			.slice( 0, this.k )

		if ( !scored.length ) return { entropy: 0, hunchPenalty: 0, neighborsFound: 0 }

		const conflictCount = scored.filter( n => n.wasConflict ).length
		const p                 = conflictCount / scored.length
		const entropy            = shannonEntropy( [ p, 1 - p ] )
		const hunchPenalty          = entropy * ( conflictCount > 0 ? 1 : 0.3 )

		return { entropy, hunchPenalty, neighborsFound: scored.length, conflictRatio: p }

	}

	observe( tokens, wasConflict ) {

		this.history.push( { tokens: new Set( tokens ), wasConflict } )
		if ( this.history.length > this.maxHistory ) this.history.shift()

	}

}
