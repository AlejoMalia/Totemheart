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

	constructor( { threshold = 0.75 } = {} ) {

		this.threshold = threshold // stress magnitude beyond which ordinary dissonance becomes injury
		this.scars           = new Map() // topic -> cumulative severity, never decays

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

}
