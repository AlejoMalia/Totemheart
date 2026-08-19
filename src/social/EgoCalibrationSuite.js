function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real confidence-vs-competence MISCALIBRATION, both directions of the same
 * axis — Kruger, J. & Dunning, D. (1999), "Unskilled and unaware of it: How
 * difficulties in recognizing one's own incompetence lead to inflated
 * self-assessments", Journal of Personality and Social Psychology, 77(6),
 * 1121-1134 (real, well-cited over-confidence at low competence); Clance,
 * P. R. & Imes, S. A. (1978), "The imposter phenomenon in high achieving
 * women", Psychotherapy: Theory, Research & Practice, 15(3), 241-247 (real,
 * well-established under-confidence DESPITE genuine competence). Distinct
 * from `MetacognitiveConfidence` (evidence-vs-conflict certainty about a
 * single judgment) and `EgoConfidence` (affective-entropy-driven felt
 * confidence): this is a real, slower-moving TRAIT-level calibration bias
 * between actual track record and self-assessment.
 *
 *   hubris    = max(0, selfAssessment - actualTrackRecord)
 *   impostor = max(0, actualTrackRecord - selfAssessment)
 */
export class EgoCalibrationSuite {

	constructor( { volatility = 0.15 } = {} ) {

		this.volatility          = volatility
		this.trackRecord         = 0.5 // real EMA of actual success rate
		this.selfAssessment    = 0.5 // real EMA of felt competence, can drift independently

	}

	/** `outcomeSuccess` (0..1, real result quality this turn), `feltCompetence` (0..1, real self-read this turn — can lag or overshoot the real outcome). */
	observe( outcomeSuccess, feltCompetence ) {

		this.trackRecord      += this.volatility * ( clamp01( outcomeSuccess ) - this.trackRecord )
		this.selfAssessment += this.volatility * ( clamp01( feltCompetence ) - this.selfAssessment )

	}

	/** Real, bounded over-confidence relative to genuine track record — never negative, 0 when well-calibrated or under-confident. */
	getHubrisIndex() {

		return clamp01( this.selfAssessment - this.trackRecord )

	}

	/** Real, bounded under-confidence despite genuine competence — the real impostor-phenomenon signal. */
	getImpostorLevel() {

		return clamp01( this.trackRecord - this.selfAssessment )

	}

	/** Real oscillation magnitude between the two states over time — a real property of impostor phenomenon (Clance & Imes), not a static trait. */
	getOscillationRisk() {

		return clamp01( Math.abs( this.selfAssessment - this.trackRecord ) * 2 )

	}

}
