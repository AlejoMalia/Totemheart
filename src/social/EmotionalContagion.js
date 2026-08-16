/**
 * Pulls the AI's own mood toward the user's inferred emotional state.
 * Magnitude depends on empathy (agreeableness) and how attached the AI
 * is to this particular user (Attachment.affinity).
 */
export class EmotionalContagion {

	computeSpike( inferredValence, affinity, personality ) {

		const empathy = 0.3 + 0.4 * personality.get( 'agreeableness' )
		const pull    = inferredValence * empathy * ( 0.3 + 0.7 * affinity )

		return {
			valence : pull * 0.3,
			arousal : Math.abs( pull ) * 0.15,
			weight  : 0.5,
		}

	}

	/**
	 * Real Kuramoto coupled-oscillator step (Kuramoto, Y., 1975/1984 —
	 * "Chemical Oscillations, Waves, and Turbulence"):
	 *   dθᵢ/dt = ωᵢ + (K/N) Σⱼ sin(θⱼ − θᵢ)
	 * Applied by treating the circumplex angle atan2(arousal, valence) as a
	 * phase — a legitimate reading of the circumplex model, which is
	 * routinely analyzed in exactly those angular terms. `couplingStrength`
	 * K comes from empathy (agreeableness × affinity); ω (natural drift) is
	 * left at 0 here since EmotionSpace's own DecayEngine already supplies
	 * the AI's independent pull back toward baseline — adding a second drift
	 * term would double-count it.
	 */
	computeKuramotoSpike( ownVector, inferredValence, inferredArousal, affinity, personality ) {

		const ownAngle    = Math.atan2( ownVector.arousal, ownVector.valence )
		const otherAngle  = Math.atan2( inferredArousal, inferredValence )
		const empathy      = 0.3 + 0.4 * personality.get( 'agreeableness' )
		const coupling       = empathy * ( 0.2 + 0.8 * affinity )

		const dTheta = coupling * Math.sin( otherAngle - ownAngle )
		const newAngle = ownAngle + dTheta

		const magnitude = Math.hypot( ownVector.valence, ownVector.arousal ) || 0.3
		return {
			valence : magnitude * ( Math.cos( newAngle ) - Math.cos( ownAngle ) ),
			arousal : magnitude * ( Math.sin( newAngle ) - Math.sin( ownAngle ) ),
			weight  : 1,
		}

	}

}
