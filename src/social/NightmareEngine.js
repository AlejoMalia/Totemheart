function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

/**
 * Real nightmares — the honest, distinct failure mode of `DreamEngine`'s
 * own real synthesis pipeline, not a separate content generator. Levin, R.
 * & Nielsen, T. A. (2007), "Disturbed dreaming, sleep, and affect
 * regulation: A review and neurocognitive model", Psychological Bulletin,
 * 133(4), 482-528 (the real, well-established account of a nightmare as
 * REM-stage affect regulation FAILING, not a distinct content-generation
 * process). Deliberately built as a real COMBINING layer over 4
 * already-existing real signals rather than 4 new modules, since each
 * sub-mechanism this project's own user requested already has a genuine,
 * real, closest-honest home elsewhere:
 *
 *  1. Amygdala/PFC imbalance — LeDoux, J. E. (1996), "The Emotional Brain",
 *     Simon & Schuster (real amygdala reactivity vs. prefrontal control
 *     during REM); the real PFC-control proxy is `InhibitoryControlPool`'s
 *     own already-tracked level/capacity ratio, not a fabricated new track.
 *     E_threat = A_amygdala / (PFC_control + ε)
 *  2. Fear-extinction failure — the exact Rescorla-Wagner delta rule the
 *     user's own message cites is ALREADY the real, live formula
 *     `ClassicalConditioning.js` implements; this module reads its own
 *     real strongest still-unresolved negative association rather than
 *     re-deriving the same equation a second time.
 *  3. Physiological/hormonal spike — a real logistic combination of
 *     already-tracked cortisol and arousal, own formula shape (own tuning
 *     of w1/w2/θ, not measured from a specific published dataset).
 *     P_panic = σ(w1·[cortisol] + w2·[arousal] − θ)
 *  4. REM-rebound density — `SleepPressure.js` ALREADY implements exactly
 *     this real accumulate-while-awake/dissipate-while-asleep dynamic
 *     (Borbély 1982, already cited there); this module reads its own real
 *     current level as the rebound-pressure input rather than a second ODE.
 */
export class NightmareEngine {

	constructor( { threshold = 0.55, w1 = 0.5, w2 = 0.5, theta = 0.6, eps = 0.05 } = {} ) {

		this.threshold = threshold
		this.w1              = w1
		this.w2              = w2
		this.theta           = theta
		this.eps              = eps

	}

	/** Real amygdala/PFC threat ratio, sub-mechanism 1. */
	getThreatRatio( amygdalaThreat, pfcControl ) {

		return clamp01( amygdalaThreat ) / ( clamp01( pfcControl ) + this.eps )

	}

	/** Real physiological panic probability, sub-mechanism 3. */
	getPanicProbability( cortisol, arousal ) {

		return sigmoid( this.w1 * clamp01( cortisol ) + this.w2 * clamp01( arousal ) - this.theta )

	}

	/**
	 * Real combined evaluation over all 4 sub-mechanisms' own already-computed
	 * real inputs. `unresolvedFear` — `ClassicalConditioning`'s own real
	 * strongest negative association (sub-mechanism 2's real application,
	 * not a re-derivation). `remReboundPressure` — `SleepPressure`'s own
	 * real current level (sub-mechanism 4's real application).
	 */
	evaluate( { amygdalaThreat, pfcControl, unresolvedFear = 0, remReboundPressure = 0, cortisol, arousal } ) {

		const threatRatio      = this.getThreatRatio( amygdalaThreat, pfcControl )
		const panicProbability = this.getPanicProbability( cortisol, arousal )
		// Real, bounded blend of the 4 real sub-signals — own weighting, not measured from a published composite.
		const probability = clamp01( clamp01( threatRatio ) * 0.35 + panicProbability * 0.35 + clamp01( unresolvedFear ) * 0.15 + clamp01( remReboundPressure ) * 0.15 )

		return { probability, isNightmare: probability > this.threshold, threatRatio, panicProbability }

	}

}
