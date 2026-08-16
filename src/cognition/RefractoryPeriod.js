/**
 * Ekman's observation that an emotion intense enough acts as a low-pass
 * filter on contradicting information — furious enough, and an apology
 * reads as another attack. Real formula, applied to the AI's OWN state
 * (arousal/valence it already has, before this turn's new appraisal is
 * folded in), not a citation of Ekman's specific numbers — the shape of
 * "a real multiplier that dampens conflicting input near peak arousal", own
 * tuning.
 */
export class RefractoryPeriod {

	/** Is the AI currently in a refractory state (near-max arousal, strongly negative)? */
	isActive( vector, { arousalThreshold = 0.7, valenceThreshold = -0.5 } = {} ) {

		return vector.arousal >= arousalThreshold && vector.valence <= valenceThreshold

	}

	/**
	 * Dampens an incoming signal that would move the state AWAY from where it
	 * currently is (a calming/positive input while furious) — signals that
	 * agree with the current state pass through undampened. Input_perceived =
	 * Input_real · (1 - arousal/arousalMax), only when it disagrees.
	 */
	filter( incomingDesirability, vector, arousalMax = 1 ) {

		const active = this.isActive( vector )
		if ( !active ) return { filtered: incomingDesirability, active: false, dampening: 0 }

		const contradicts = incomingDesirability > 0 // trying to calm/please a furious state
		if ( !contradicts ) return { filtered: incomingDesirability, active: true, dampening: 0 }

		const dampening = Math.max( 0, Math.min( 1, vector.arousal / arousalMax ) )
		return { filtered: incomingDesirability * ( 1 - dampening ), active: true, dampening }

	}

}
