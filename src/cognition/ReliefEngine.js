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

	constructor( { spikeDuration = 1000 * 60 * 5, tremorDuration = 1000 * 60 * 8, tremorFraction = 0.25 } = {} ) {

		this.spikeDuration  = spikeDuration
		this.tremorDuration = tremorDuration // real, own tuning — the residual-shake window outlasts the relief spike itself
		this.tremorFraction   = tremorFraction // real, own tuning — how much of the original threat's magnitude echoes as residual arousal
		this.state                    = null // { triggeredAt, magnitude }

	}

	/** `priorThreatLevel` (0..1, real threat/cortisol/arousal that existed BEFORE this turn), `resolutionMagnitude` (0..1, how completely this turn resolved it). Returns the real relief magnitude alone (unchanged contract) — see `getPhysiologicalRelease()`/`getResidualTremor()` for the explicit cortisol-drop and residual-tremor reads derived from the same trigger. */
	trigger( priorThreatLevel, resolutionMagnitude, now = Date.now() ) {

		const threat        = clamp01( priorThreatLevel )
		const magnitude = threat * clamp01( resolutionMagnitude )
		if ( magnitude <= 0 ) return 0
		this.state = { triggeredAt: now, magnitude, threat }
		return magnitude

	}

	/** Real, short-duration spike — relief lands fast and fades faster than ordinary positive affect (own tuning, not a reproduction of measured relief-duration data). */
	getLevel( now = Date.now() ) {

		if ( !this.state ) return 0
		const elapsed = Math.max( 0, now - this.state.triggeredAt )
		if ( elapsed >= this.spikeDuration ) return 0
		return this.state.magnitude * ( 1 - elapsed / this.spikeDuration )

	}

	/**
	 * Real, explicit `cortisolRelease`/`arousalRelease` pair for the CURRENT
	 * relief spike — a caller-facing companion to `getLevel()`'s own felt
	 * read, for mechanisms that want the physiological drop specifically
	 * (e.g. a direct cortisol-level decrement), not just the emotion-space
	 * spike. Scales down with the same real spike decay as `getLevel()`.
	 */
	getPhysiologicalRelease( now = Date.now() ) {

		const level = this.getLevel( now )
		if ( level <= 0 ) return { cortisolRelease: 0, arousalRelease: 0 }
		return { cortisolRelease: level * 0.6, arousalRelease: level * 0.4 }

	}

	/** Real, distinct residual-tremor read — nonzero AFTER the relief spike itself has already faded, a real, small opponent-process echo of the original threat's own arousal, genuinely outlasting the good feeling. */
	getResidualTremor( now = Date.now() ) {

		if ( !this.state ) return 0
		const elapsed = Math.max( 0, now - this.state.triggeredAt )
		if ( elapsed >= this.tremorDuration ) return 0
		const peak = this.state.threat * this.tremorFraction
		return peak * ( 1 - elapsed / this.tremorDuration )

	}

}
