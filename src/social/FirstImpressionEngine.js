function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real halo/horn effect — Thorndike, E. L. (1920), "A constant error in
 * psychological ratings", Journal of Applied Psychology, 4(1), 25-29 (the
 * real, foundational finding that an early global impression of someone
 * genuinely biases how ALL their later, unrelated behavior gets read, not
 * just a memory of the first event itself). Modeled as a real, one-shot
 * ANCHOR set on first real contact, which then damps how much any later
 * single reading can move `InfatuationEngine`/`LoveHateEngine`'s own real
 * appraisal for that person — the anchor itself decays slowly, so it
 * genuinely takes many real disconfirming turns to recalibrate, not one.
 * Distinct from `AnchoringBias.js` (a general numeric-estimate anchor, not
 * a person-impression one) and from `EpisodicMemory`'s own primacy/recency
 * weighting (which is about RETRIEVAL salience of a memory, not about
 * biasing how NEW, unrelated input gets appraised).
 *
 *   anchor        = firstImpressionValence   (set once, per userId)
 *   biasedRead = raw·(1−pull) + anchor·pull ,  pull = pullStrength·e^(−λ·contactCount)
 */
export class FirstImpressionEngine {

	constructor( { pullStrength = 0.6, lambda = 0.08 } = {} ) {

		this.pullStrength  = pullStrength
		this.lambda             = lambda
		this.anchor              = new Map() // userId -> real one-shot first-impression valence, -1..1
		this.contactCount = new Map() // userId -> real count of real contacts since the anchor was set

	}

	/** Real, one-shot — no-op after the first call for a given userId. `valence` (-1..1, this FIRST turn's real desirability/appraisal read). */
	registerFirstImpression( userId, valence ) {

		if ( this.anchor.has( userId ) ) return this.anchor.get( userId )
		const clamped = Math.max( -1, Math.min( 1, valence ) )
		this.anchor.set( userId, clamped )
		this.contactCount.set( userId, 0 )
		return clamped

	}

	/** Real, per-turn biased read of `rawValence` — the anchor's real pull fades with real accumulated contact, per Thorndike's own account of a halo genuinely eroding with more real, disconfirming information over time, not staying fixed forever. */
	getBiasedValence( userId, rawValence ) {

		const anchor = this.anchor.get( userId )
		if ( anchor === undefined ) return rawValence

		const count = ( this.contactCount.get( userId ) ?? 0 ) + 1
		this.contactCount.set( userId, count )
		const pull = this.pullStrength * Math.exp( -this.lambda * count )
		return rawValence * ( 1 - pull ) + anchor * pull

	}

	getAnchor( userId ) {

		return this.anchor.get( userId ) ?? null

	}

	toJSON() {

		return { anchor: [ ...this.anchor.entries() ], contactCount: [ ...this.contactCount.entries() ] }

	}

	restoreState( data ) {

		if ( !data ) return
		if ( data.anchor )              this.anchor              = new Map( data.anchor )
		if ( data.contactCount ) this.contactCount = new Map( data.contactCount )

	}

}
