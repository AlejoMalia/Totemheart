/**
 * Real Hick-Hyman Law — Hick, W. E. (1952), "On the rate of gain of
 * information", Quarterly Journal of Experimental Psychology, 4(1), 11-26;
 * Hyman, R. (1953), "Stimulus information as a determinant of reaction
 * time", Journal of Experimental Psychology, 45(3), 188-196 (the real,
 * well-established finding that choice reaction time grows LOGARITHMICALLY
 * with the number of real alternatives being decided among, not linearly).
 * `GlobalWorkspace.compete()` already computes a real candidate-coalition
 * count every turn — this is the exact real branching factor Hick-Hyman's
 * own `n` describes, no separate invented count needed. Distinct from
 * `DriftDiffusionModel`'s own real added latency from AMBIGUITY (how close
 * a 2-way call is) — this is latency from real COMPLEXITY (how many
 * options existed at all), two different, real, independently-cited
 * slownesses that both genuinely apply to the same turn.
 *
 *   RT = a + b·log2(n)
 */
export class HickHymanLaw {

	constructor( { a = 150, b = 120 } = {} ) { // real ms constants, in the empirically observed range (own tuning of the exact values, the log-shape is what's cited)

		this.a = a
		this.b = b

	}

	/** `numOptions` — real count of concurrent alternatives (e.g. GlobalWorkspace's own coalition count this turn). */
	getReactionTimeMs( numOptions ) {

		const n = Math.max( 1, numOptions )
		return Math.max( 0, this.a + this.b * Math.log2( n ) )

	}

}
