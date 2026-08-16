function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Damage to a core value, distinct from ordinary guilt — a "perpetrating,
 * failing to prevent, or bearing witness to acts that transgress deeply
 * held moral beliefs" (Litz, B. T., Stein, N., Delaney, E., Lebowitz, L.,
 * Nash, W. P., Silva, C., & Maguen, S. (2009), "Moral injury and moral
 * repair in war veterans: A preliminary model and intervention strategy",
 * Clinical Psychology Review, 29(8), 695-706 — the term and its distinction
 * from ordinary guilt/PTSD symptomatology originates here). Unlike ordinary
 * dissonance (CognitiveDissonance.js, which recovers as the triggering
 * input passes), a moral injury leaves a PERMANENT scar — CoreBeliefs
 * themselves are immutable by design (see CoreBeliefs.js), so this tracks
 * scarring as its own separate, non-decaying ledger keyed by belief topic,
 * exactly the way a real core belief can't be "fixed" once violated deeply
 * enough, only carried.
 */
export class MoralInjury {

	constructor( { threshold = 0.75, redemptionThreshold = 1 } = {} ) {

		this.threshold           = threshold // stress magnitude beyond which ordinary dissonance becomes injury
		this.redemptionThreshold = redemptionThreshold // cumulative repair-action credit needed before a real redemption arc can start reducing a scar
		this.scars                     = new Map() // topic -> cumulative severity, never decays on its own
		this.redemptionProgress   = new Map() // topic -> accumulated real repair-action credit

	}

	/**
	 * `dissonanceStress` — real magnitude from CognitiveDissonance for a hit
	 * against a HIGH-polarity core belief (caller filters for polarity/importance).
	 * Only crosses into injury territory above `threshold` — ordinary disagreement
	 * doesn't scar, a genuine violation of a deeply held value does.
	 */
	evaluate( topic, dissonanceStress, beliefPolarity = 1 ) {

		if ( dissonanceStress < this.threshold ) return { injured: false }

		const severity = clamp01( ( dissonanceStress - this.threshold ) / ( 1 - this.threshold ) ) * Math.abs( beliefPolarity )
		this.scars.set( topic, clamp01( ( this.scars.get( topic ) ?? 0 ) + severity ) )

		return { injured: true, severity, totalScar: this.scars.get( topic ) }

	}

	getScar( topic ) {

		return this.scars.get( topic ) ?? 0

	}

	/** Total permanent scarring across all topics — a real, never-decaying signal DefenseMechanisms' regression weighting can read. */
	getTotalScar() {

		return [ ...this.scars.values() ].reduce( ( a, b ) => a + b, 0 )

	}

	/**
	 * A real redemption arc — moral injury doesn't heal by itself, only by
	 * repeated, real conscientious repair action over real time (consistent
	 * with the actual moral-injury/moral-repair literature this module already
	 * cites: Litz et al. 2009 explicitly frame repair as a real, effortful
	 * process, not spontaneous remission). `dt` — real elapsed ticks since the
	 * last call for this topic.
	 */
	recordRepairAction( topic, conscientiousness = 0.5, dt = 1 ) {

		if ( !this.scars.has( topic ) ) return { progress: 0 }
		const progress = ( this.redemptionProgress.get( topic ) ?? 0 ) + clamp01( conscientiousness ) * dt
		this.redemptionProgress.set( topic, progress )
		return { progress }

	}

	/**
	 * Only once enough real repair credit has accumulated does the scar start
	 * to genuinely fade — and even then it's a real PROGRESSIVE decay
	 * (own tuning: `decayRate` per call), not full erasure. A scar below the
	 * redemption threshold stays exactly as permanent as documented above —
	 * this never claims a scar can vanish instantly or on a single act.
	 */
	attemptRedemption( topic, decayRate = 0.1 ) {

		const progress = this.redemptionProgress.get( topic ) ?? 0
		const scar         = this.scars.get( topic ) ?? 0
		if ( progress < this.redemptionThreshold || scar <= 0 ) return { healed: false, scar }

		const reduced = clamp01( scar * ( 1 - decayRate ) )
		this.scars.set( topic, reduced )
		return { healed: true, scar: reduced, reduction: scar - reduced }

	}

}
