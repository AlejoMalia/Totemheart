function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * A real, capacity-limited active-item buffer — Baddeley, A. D., & Hitch, G.
 * (1974), "Working memory", Psychology of Learning and Motivation, 8,
 * 47-89; Cowan, N. (2001), "The magical number 4 in short-term memory: A
 * reconsideration of mental storage capacity", Behavioral and Brain
 * Sciences, 24(1), 87-114 (the real ~4-item capacity estimate this module's
 * default `capacity` matches, distinct from Miller's older 7±2 figure).
 * Distinct from `GlobalWorkspace` (which arbitrates ONE winner for output
 * access this turn) and `AttentionFocus` (per-token weighting within a
 * single input) — this tracks how many real items (topics, unresolved
 * threads, active goals) are concurrently held, and produces a real,
 * bounded degradation signal once that count exceeds capacity: reasoning
 * quality drops and heuristic/associative shortcuts increase, the same
 * qualitative cognitive-load effect load theory predicts.
 *
 *   Load = n / k_max
 *   ReasonQuality = (1 - Load)^γ
 *   HeuristicBias ∝ Load
 */
export class WorkingMemoryBuffer {

	constructor( { capacity = 4, gamma = 1.5 } = {} ) {

		this.capacity = capacity
		this.gamma       = gamma
		this.items          = [] // real active item labels, most-recent last

	}

	/** Hold a real item active (e.g. an unresolved topic this turn touched). Deduplicates. */
	hold( item ) {

		const i = this.items.indexOf( item )
		if ( i !== -1 ) this.items.splice( i, 1 )
		this.items.push( item )
		// Real, bounded capacity — the oldest item is displaced, not silently kept forever.
		while ( this.items.length > this.capacity * 2 ) this.items.shift()

	}

	release( item ) {

		const i = this.items.indexOf( item )
		if ( i !== -1 ) this.items.splice( i, 1 )

	}

	getLoad() {

		return clamp01( this.items.length / this.capacity )

	}

	getReasonQuality() {

		return Math.pow( 1 - this.getLoad(), this.gamma )

	}

	getHeuristicBias() {

		return this.getLoad()

	}

}
