function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real relief — Frijda, N. H. (1986), "The Emotions", Cambridge University
 * Press (already cited elsewhere in this codebase for appraisal theory;
 * Frijda's own real taxonomy of relational themes explicitly names
 * "distress abating" as relief's real, distinct trigger condition — a
 * genuine positive emotion that specifically requires a PRIOR real threat
 * to have existed and then resolved, not just any positive appraisal).
 * Distinct from ordinary positive valence: an input that was never
 * threatening in the first place cannot produce relief here, no matter how
 * positive it reads — the magnitude is bounded by how much real threat was
 * actually present beforehand.
 *
 *   relief = priorThreatLevel · resolutionMagnitude
 */
export class ReliefEngine {

	constructor( { spikeDuration = 1000 * 60 * 5 } = {} ) {

		this.spikeDuration = spikeDuration
		this.state                = null // { triggeredAt, magnitude }

	}

	/** `priorThreatLevel` (0..1, real threat/cortisol/arousal that existed BEFORE this turn), `resolutionMagnitude` (0..1, how completely this turn resolved it). */
	trigger( priorThreatLevel, resolutionMagnitude, now = Date.now() ) {

		const magnitude = clamp01( priorThreatLevel ) * clamp01( resolutionMagnitude )
		if ( magnitude <= 0 ) return 0
		this.state = { triggeredAt: now, magnitude }
		return magnitude

	}

	/** Real, short-duration spike — relief lands fast and fades faster than ordinary positive affect (own tuning, not a reproduction of measured relief-duration data). */
	getLevel( now = Date.now() ) {

		if ( !this.state ) return 0
		const elapsed = Math.max( 0, now - this.state.triggeredAt )
		if ( elapsed >= this.spikeDuration ) return 0
		return this.state.magnitude * ( 1 - elapsed / this.spikeDuration )

	}

}
