/**
 * Gratitude via credit assignment: when an unexpectedly positive outcome
 * (high dopaminergic RPE) is attributed to a specific user (appraisal.agency
 * === 'user'), that user's contribution gets an explicit credit signal —
 * the real idea behind "solving the credit assignment problem" for a
 * positive surprise, at the scale this library actually operates: crediting
 * one attributed source, not backpropagating through a multi-step causal
 * chain.
 */
function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

export class GratitudeEngine {

	/** Returns a gratitude spike + an extra Attachment credit boost, or null if this turn doesn't qualify. */
	evaluate( { rpe, agency, desirability } ) {

		const qualifies = agency === 'user' && rpe > 0.4 && desirability > 0.3
		if ( !qualifies ) return null

		const intensity = clamp01( rpe )
		return {
			spike        : { valence: intensity * 0.4, arousal: intensity * 0.2, weight: 0.6 },
			creditBoost  : intensity * 0.1, // extra Attachment.affinity nudge, on top of the normal valence-driven update
		}

	}

}
