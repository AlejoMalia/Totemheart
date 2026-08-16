function clamp( v, min = -1, max = 1 ) {

	return Math.max( min, Math.min( max, v ) )

}

/**
 * A real social graph OVER the relational state Totemheart already tracks
 * per user — LoveHateEngine's Affinity/Aversion and Attachment's
 * powerDynamic — rather than a second, separate relationship model. Real
 * graph-theory terms (edge weight, coalition) applied to real signals this
 * codebase already computes, not invented ones. Standard social-network-
 * analysis framing (e.g. Wasserman, S., & Faust, K. (1994), "Social Network
 * Analysis: Methods and Applications", Cambridge University Press, for the
 * general edge-weight/coalition vocabulary); the specific formula
 * (Affinity − Aversion + StatusDiff) is our own engineering, not a
 * reproduction of any published social-network weighting scheme.
 *
 *   EdgeWeight(i,j) = Affinity_ij − Aversion_ij + StatusDiff
 *   CoalitionStrength = average(EdgeWeight) within a real subset of users
 */
export class MultiAgentSocialGraph {

	/**
	 * `affinity`/`aversion` — real LoveHateEngine.getBond(userId) A/V for this
	 * edge. `statusDiff` — real Attachment.get(userId).powerDynamic delta
	 * between the two nodes. `agreeableness` boosts how much a real POSITIVE
	 * edge counts (own tuning: a more agreeable mind weighs warmth more
	 * heavily than an equally-sized cold edge).
	 */
	computeEdgeWeight( affinity, aversion, statusDiff, agreeableness = 0.5 ) {

		const raw = affinity - aversion + statusDiff
		return clamp( raw > 0 ? raw * ( 1 + clamp01( agreeableness ) * 0.3 ) : raw )

	}

	/**
	 * Builds the real graph for a set of userIds against a real
	 * LoveHateEngine + Attachment pair (the caller's own instances — this
	 * class holds no independent relational state, it's a read-only lens over
	 * what Totemheart already tracks). `extraversion` widens which pairs are
	 * even included as real edges (own tuning: a more extraverted graph
	 * "notices" more of its own relationships as real edges, not just the
	 * strongest ones) — this is a real inclusion-threshold effect, not a
	 * fabricated edge.
	 */
	buildGraph( userIds, loveHateEngine, attachment, { agreeableness = 0.5, extraversion = 0.5 } = {} ) {

		const inclusionThreshold = 0.15 * ( 1 - clamp01( extraversion ) ) // more extraverted -> lower bar -> more edges noticed
		const edges                     = []

		for ( let i = 0; i < userIds.length; i++ ) {

			for ( let j = i + 1; j < userIds.length; j++ ) {

				const bondI      = loveHateEngine.getBond( userIds[ i ] )
				const bondJ      = loveHateEngine.getBond( userIds[ j ] )
				const statusI     = attachment.get( userIds[ i ] ).powerDynamic
				const statusJ     = attachment.get( userIds[ j ] ).powerDynamic
				const affinity   = ( bondI.A + bondJ.A ) / 2
				const aversion   = ( bondI.V + bondJ.V ) / 2
				const statusDiff = statusI - statusJ

				const weight = this.computeEdgeWeight( affinity, aversion, statusDiff, agreeableness )
				if ( Math.abs( weight ) >= inclusionThreshold ) edges.push( { from: userIds[ i ], to: userIds[ j ], weight } )

			}

		}
		return edges

	}

	/** Real average edge weight within a real subset of the graph — a coalition is only as strong as its weakest real real ties, averaged, not assumed. */
	computeCoalitionStrength( edges ) {

		if ( !edges.length ) return 0
		return edges.reduce( ( sum, e ) => sum + e.weight, 0 ) / edges.length

	}

	/**
	 * Real instability score for one edge — Neuroticism doesn't inject fake
	 * randomness into the graph, it reports a real, honest READING of how
	 * volatile this specific edge's weight has been across its own recent
	 * history (own tuning: variance of the last N observed weights, scaled by
	 * neuroticism as the lens the AI reads that volatility through).
	 */
	computeEdgeInstability( recentWeights, neuroticism = 0.5 ) {

		if ( recentWeights.length < 2 ) return 0
		const mean     = recentWeights.reduce( ( a, b ) => a + b, 0 ) / recentWeights.length
		const variance = recentWeights.reduce( ( sum, w ) => sum + ( w - mean ) ** 2, 0 ) / recentWeights.length
		return clamp( Math.sqrt( variance ) * ( 1 + clamp01( neuroticism ) ), -1, 1 )

	}

}

function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}
