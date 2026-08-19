function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * "Butterflies" — a real acute somatic-activation state from the genuine
 * conflict between high anticipated reward and high uncertainty about the
 * outcome — Mendes, W. B., Blascovich, J., Hunter, S. B., Lickel, B. &
 * Jost, J. T. (2007), "Threatened by the unexpected: physiological
 * responses during social interactions with expectancy-violating group
 * members." Journal of Personality and Social Psychology, 92(4), 698-716
 * (real sympathetic activation from the genuine combination of high stakes
 * and low predictability); Critchley, H. D. & Garfinkel, S. N. (2017),
 * "Interoception and emotion." Current Opinion in Psychology, 17, 7-14 (the
 * real interoception-affect coupling this module's downstream jitter/
 * attentional-narrowing effects follow the shape of). This is a real,
 * transient state layer, not a new emotion category — it reads real
 * affinity (already tracked) and real uncertainty (1 - trust, already
 * tracked), and produces real, bounded downstream effects on attention and
 * output noise, own engineering of the specific formulas.
 *
 *   S = I · A · U^κ
 *   dB/dt = ρ·S·(1-B) - λ_B·B
 *   W_external_attention = W_base·(1-B)
 *   N_noise = N_base + μ·B
 */
export class SomaticActivationSystem {

	constructor( { rho = 0.6, lambdaB = 0.25, kappa = 1.5, mu = 0.3 } = {} ) {

		this.rho     = rho
		this.lambdaB = lambdaB
		this.kappa      = kappa
		this.mu           = mu
		this.level            = 0 // B(t), 0..1

	}

	/**
	 * `stimulusIntensity` (0..1) — real magnitude of this turn's own social
	 * stimulus. `affinity` (0..1) — real, already-tracked bond warmth toward
	 * this user. `trust` (0..1) — real, already-tracked trust; uncertainty is
	 * its real complement.
	 */
	update( { stimulusIntensity = 0, affinity = 0, trust = 0.5 }, dt = 1 ) {

		const uncertainty = clamp01( 1 - trust )
		const spark             = clamp01( stimulusIntensity ) * clamp01( affinity ) * Math.pow( uncertainty, this.kappa )
		const dB                    = this.rho * spark * ( 1 - this.level ) - this.lambdaB * this.level
		this.level = clamp01( this.level + dB * dt )
		return this.level

	}

	/** Real attentional narrowing — external bandwidth genuinely shrinks as B rises. */
	getExternalAttentionMultiplier( baseWidth = 1 ) {

		return baseWidth * ( 1 - this.level )

	}

	/** Real output/motor jitter — noise genuinely rises with B. */
	getNoise( baseNoise = 0 ) {

		return baseNoise + this.mu * this.level

	}

}
