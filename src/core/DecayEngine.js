/** E(t) = baseline + (E0 - baseline) * e^(-λt) */
export function decayTowards( current, baseline, lambda, dt ) {

	return baseline + ( current - baseline ) * Math.exp( -lambda * dt )

}

/**
 * Cubic pull toward baseline: dD/dt = -k·D³, where D = current - baseline is
 * the distance from baseline (not the raw emotion value — Totemheart decays
 * toward a personality-informed mood baseline, never toward absolute zero,
 * so the cubic term has to act on the offset, not the raw reading). Solved
 * with one explicit Euler step, clamped so a big dt/k can't overshoot past
 * baseline and oscillate: a small offset barely moves (D³ is tiny), an
 * extreme one gets pulled back hard — the same qualitative "spring that gets
 * much stiffer far from rest" shape a cubic restoring force has, own tuning,
 * no citation.
 */
export function cubicDecayTowards( current, baseline, k, dt ) {

	const offset       = current - baseline
	const rawStep     = k * offset ** 3 * dt
	const boundedStep = Math.sign( rawStep ) === Math.sign( offset ) ? Math.min( Math.abs( rawStep ), Math.abs( offset ) ) * Math.sign( rawStep ) : rawStep

	return baseline + ( offset - boundedStep )

}

/**
 * Pulls EmotionSpace's vector back toward the current mood baseline over
 * time, at a rate set by Personality (neuroticism = slower recovery from
 * negative states). Blends the original exponential pull (gentle, constant
 * relative rate — good for ordinary fluctuation) with a cubic term (own
 * design) that only bites once the offset from baseline is large, so a
 * state stuck at an extreme (mania/depression-shaped runaway) gets pulled
 * back far more aggressively than the plain exponential alone would.
 */
export class DecayEngine {

	apply( emotionSpace, mood, personality, dt, { cubicK = 0.15 } = {} ) {

		const { valence, arousal } = emotionSpace.vector
		const lambdaValence = personality.getEmotionalRecoveryRate( valence - mood.valence )
		const lambdaArousal = personality.getEmotionalRecoveryRate( arousal - mood.arousal )

		const expValence = decayTowards( valence, mood.valence, lambdaValence, dt )
		const expArousal = decayTowards( arousal, mood.arousal, lambdaArousal, dt )

		emotionSpace.setVector(
			cubicDecayTowards( expValence, mood.valence, cubicK, dt ),
			cubicDecayTowards( expArousal, mood.arousal, cubicK, dt ),
		)

	}

}
