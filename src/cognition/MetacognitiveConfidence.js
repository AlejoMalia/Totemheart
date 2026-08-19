function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

/**
 * Real confidence-in-one's-own-judgment (metacognitive confidence), distinct
 * from `EgoConfidence` (which reads a real Shannon-entropy "how flat is my
 * emotion blend" signal — affective self-clarity, not judgment certainty) —
 * Fleming, S. M. & Lau, H. C. (2014), "How to measure metacognition."
 * Frontiers in Human Neuroscience, 8, 443; Yeung, N. & Summerfield, C.
 * (2012), "Metacognition in human decision-making: confidence and error
 * monitoring." Philosophical Transactions of the Royal Society B, 367,
 * 1310-1321 (confidence as a real, separate readout from the decision
 * itself, driven by evidence strength net of conflicting evidence and
 * noise).
 *
 *   c = σ(evidence - conflict - noise)
 */
export class MetacognitiveConfidence {

	/**
	 * `evidence` (0..1) — real strength of supporting signal for this turn's
	 * judgment (e.g. AppraisalAgreement's own agreement score). `conflict`
	 * (0..1) — real disagreement/contradiction magnitude. `noise` (0..1,
	 * optional) — real estimated input ambiguity (e.g. low semantic
	 * similarity confidence).
	 */
	evaluate( { evidence = 0.5, conflict = 0, noise = 0 } = {} ) {

		const confidence = sigmoid( 4 * ( clamp01( evidence ) - clamp01( conflict ) - clamp01( noise ) * 0.5 ) )
		return {
			confidence,
			// Real, distinct downstream behaviors this confidence read should
			// drive: low confidence -> hedge/seek more info; high -> state
			// plainly. Left as a threshold read, not hardcoded text, since the
			// actual phrasing lives in ExpressionDirectives/LinguisticModulation.
			shouldHedge          : confidence < 0.4,
			shouldSeekInfo    : confidence < 0.3,
			canStatePlainly : confidence > 0.7,
		}

	}

}
