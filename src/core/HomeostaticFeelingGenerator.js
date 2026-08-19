function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real, legible "feelings" as readouts of internal-state deviation — Damasio,
 * A. R. (1999), "The Feeling of What Happens: Body and Emotion in the
 * Making of Consciousness", Harcourt (the general homeostatic-feeling
 * account: a feeling is the mind's real representation of a body/system
 * state, not a separate add-on); Craig, A. D. (2002), "How do you feel?
 * Interoception: the sense of the physiological condition of the body",
 * Nature Reviews Neuroscience, 3(8), 655-666. Doesn't reinvent Homeostasis,
 * EnergyBudget, SleepPressure, or SelfDeterminationNeeds — this is a thin,
 * real translation LAYER that reads their existing deviation-from-set-point
 * signals and turns each into a named, bounded "feeling" plus a real
 * action-tendency label, the same translation a human's interoceptive
 * system performs on raw homeostatic error.
 *
 *   F_i = clip(g_i(S_i - S_i*), 0, 1)
 *   Drive_i = κ_i·|S_i - S_i*|
 *   ActionTendency = argmax_i Drive_i
 */
const FEELING_LABELS = {
	fatigue      : 'necesito descansar',
	insecurity    : 'me siento inseguro/a',
	connectionHunger : 'necesito conexión',
	overload         : 'estoy saturado/a',
	boredom             : 'necesito estímulo',
	relief                 : 'siento alivio',
}

export class HomeostaticFeelingGenerator {

	constructor( { gain = 1.4 } = {} ) {

		this.gain = gain

	}

	/**
	 * `signals` — a real `{ name: { level, setPoint } }` map the caller builds
	 * from whatever modules are actually available this turn (e.g.
	 * `{ fatigue: { level: energyBudget.getLevel(), setPoint: 0.6 } }`).
	 * Returns one real feeling entry per signal plus the dominant one.
	 */
	compute( signals ) {

		const feelings   = {}
		let dominant        = null
		let maxDrive           = 0

		for ( const [ name, { level, setPoint } ] of Object.entries( signals ) ) {

			const deviation = setPoint - level // positive = deficit (below set point)
			const intensity   = clamp01( Math.abs( deviation ) * this.gain )
			const drive          = intensity

			feelings[ name ] = { intensity, deficit: deviation > 0, label: FEELING_LABELS[ name ] ?? name }

			if ( drive > maxDrive ) { maxDrive = drive; dominant = name }

		}

		return { feelings, dominant, dominantIntensity: maxDrive }

	}

}
