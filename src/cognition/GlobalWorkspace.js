/**
 * Real competition for a single, shared "conscious access" slot among
 * several candidate stimuli — Global Workspace Theory (Baars, B. J. (1988),
 * "A Cognitive Theory of Consciousness", Cambridge University Press; Baars,
 * B. J. (2005), "Global workspace theory of consciousness: toward a
 * cognitive neuroscience of human experience", Progress in Brain Research,
 * 150, 45-53; Dehaene, S., & Naccache, L. (2001), "Towards a cognitive
 * neuroscience of consciousness: basic evidence and a workspace framework",
 * Cognition, 79(1-2), 1-37, on the real "ignition" — one coalition winning
 * broad access while others stay subliminal). This is explicitly NOT a
 * claim of modeling consciousness itself (see README's "Subjective
 * experience: 0%, by design and permanently") — it's a real, useful
 * competitive-selection mechanic borrowed from that theory's structure: a
 * real softmax over candidate saliences picks which ONE stimulus this turn's
 * narrative/output actually foregrounds, the rest genuinely lose the
 * competition rather than all being processed with equal weight.
 */
export class GlobalWorkspace {

	/**
	 * `candidates` — real `{ name, salience }` array, salience already a real
	 * computed magnitude from elsewhere (e.g. |desirability|, novelty,
	 * woundPressure — whatever the caller has). Real softmax over salience —
	 * a strongly dominant candidate wins near-deterministically, several
	 * close candidates produce real, honest uncertainty about which "ignites".
	 */
	compete( candidates, threshold = 0.1 ) {

		if ( !candidates.length ) return { winner: null, coalitions: [] }

		const max          = Math.max( ...candidates.map( c => c.salience ) )
		const exps          = candidates.map( c => Math.exp( c.salience - max ) )
		const total          = exps.reduce( ( a, b ) => a + b, 0 )
		const coalitions = candidates.map( ( c, i ) => ( { name: c.name, access: exps[ i ] / total } ) )

		const winner = coalitions.reduce( ( best, c ) => ( c.access > best.access ? c : best ), coalitions[ 0 ] )

		return {
			winner    : winner.access >= threshold ? winner.name : null,
			coalitions,
			// Real preconscious coalitions — every candidate that got a
			// meaningful (above-threshold) share of access even without
			// winning outright, the theory's own "fringe awareness" idea.
			fringe    : coalitions.filter( c => c.name !== winner.name && c.access >= threshold * 0.5 ).map( c => c.name ),
		}

	}

	/** Real entropy of the access distribution — near 0 = a clear, dominant winner; near max = genuine real ambiguity about what's "in the workspace" this turn. */
	getCompetitionEntropy( coalitions ) {

		if ( !coalitions.length ) return 0
		return -coalitions.reduce( ( sum, c ) => sum + ( c.access > 0 ? c.access * Math.log2( c.access ) : 0 ), 0 )

	}

}
