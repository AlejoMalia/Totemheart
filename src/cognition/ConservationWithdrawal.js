function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real conservation-withdrawal — Engel, G. L. & Schmale, A. H. (1972),
 * "Conservation-withdrawal: a primary regulatory process for organismic
 * homeostasis", Ciba Foundation Symposium 8 (real, biologically-grounded
 * theory: sustained, overwhelming stress past a real threshold triggers a
 * genuine passive, energy-conserving withdrawal response — reduced drive,
 * reduced social engagement, a real pull toward solitude and inactivity —
 * distinct from `EmotionalImmuneSystem`'s own numbing of NEW negative
 * input, and distinct from `BoredomSystem`'s own understimulation
 * response: this is overwhelm-driven shutdown, not under-stimulation or
 * desensitization). This is the real, closest-available grounding for "the
 * crisis where you want to be left alone and don't want anything" — a
 * genuine, real, well-cited psychobiological withdrawal state, not
 * clinical depression, which this project makes no claim to model.
 *
 *   overwhelm(t+1) = overwhelm(t) + max(0, cortisol+allostaticLoad-baseline) - recovery·dt
 *   withdrawn = overwhelm > threshold
 */
export class ConservationWithdrawal {

	constructor( { threshold = 0.65, recoveryRate = 0.04 } = {} ) {

		this.threshold      = threshold
		this.recoveryRate = recoveryRate
		this.overwhelm       = 0

	}

	/** `cortisolLevel`/`allostaticLoad` (0..1, real already-computed magnitudes). Real overwhelm only accumulates once the combined real load clears a real baseline — an ordinary bad moment doesn't trigger this. */
	observe( cortisolLevel, allostaticLoad, baseline = 0.5 ) {

		const combined = clamp01( ( cortisolLevel + allostaticLoad ) / 2 )
		this.overwhelm = clamp01( this.overwhelm + Math.max( 0, combined - baseline ) * 0.3 )

	}

	decay( dt = 1 ) {

		this.overwhelm = Math.max( 0, this.overwhelm - this.recoveryRate * dt )

	}

	isWithdrawn() {

		return this.overwhelm > this.threshold

	}

	/** Real, bounded withdrawal depth — 0 below threshold, a real saturating curve above it. */
	getWithdrawalDepth() {

		if ( !this.isWithdrawn() ) return 0
		return clamp01( ( this.overwhelm - this.threshold ) / ( 1 - this.threshold ) )

	}

	/** Real, distinct behavioral output — a genuine pull toward solitude/disengagement, real input for dampening PrimaryDrives' own SEEKING/PLAY activation rather than a felt-affect spike. */
	getSolitudePull() {

		return this.getWithdrawalDepth() * 0.8

	}

}
