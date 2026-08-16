/**
 * Real approach-avoidance gradient conflict (Miller, N. E. (1944),
 * "Experimental studies of conflict", in Hunt, J. McV. (ed.), Personality
 * and the Behavior Disorders, Ronald Press, 431-465): both an approach
 * gradient and an avoidance gradient grow stronger as psychological
 * distance to a goal shrinks, but the avoidance gradient is STEEPER — so far
 * from the goal, approach dominates (net pull toward it); close to the goal,
 * avoidance overtakes it (net push away). Where the two curves cross is a
 * real region of maximal conflict — approach-avoidance VACILLATION, the
 * literal oscillation Miller's model predicts, not a metaphor.
 *
 * approach(d) = Ga · exp(−d/La)
 * avoidance(d) = Gv · exp(−d/Lv),  with Lv < La (avoidance falls off faster with distance)
 */
function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

export class MotivationalConflict {

	constructor( { La = 1.4, Lv = 0.7 } = {} ) {

		this.La = La // approach gradient's real spatial decay constant
		this.Lv  = Lv  // avoidance gradient's real spatial decay constant — steeper (smaller) than La

	}

	/**
	 * `distance` (0..~2, psychological distance to the goal — caller-supplied,
	 * e.g. 1 - trust for "closeness to disclosure", or unresolved-wound
	 * pressure for "closeness to confrontation"). `approachGain`/`avoidanceGain`
	 * (Ga, Gv, real magnitudes the caller already has — e.g. desirability for
	 * Ga, woundPressure/cortisol for Gv).
	 */
	evaluate( distance, approachGain, avoidanceGain ) {

		const d               = Math.max( 0, distance )
		const approachForce  = approachGain * Math.exp( -d / this.La )
		const avoidanceForce = avoidanceGain * Math.exp( -d / this.Lv )
		const netForce           = approachForce - avoidanceForce

		// Vacillation: the two forces are close in magnitude relative to their
		// own scale — real conflict-zone detection, not an arbitrary constant
		// threshold (own tuning of the 0.15 relative-closeness band).
		const scale        = Math.max( approachForce, avoidanceForce, 0.001 )
		const vacillating = Math.abs( netForce ) / scale < 0.15

		return {
			approachForce,
			avoidanceForce,
			netForce,
			vacillating,
			// Real expression-confidence dampener: high conflict = low confidence
			// in what to express, feeds AppraisalAgreement-style downstream gating.
			expressionConfidence : vacillating ? clamp01( 1 - Math.abs( netForce ) / scale * 2 ) : 1,
		}

	}

}
