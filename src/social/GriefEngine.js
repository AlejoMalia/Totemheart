function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Grief as a real process, not "high sadness". Two honest engineering
 * choices instead of borrowing Kübler-Ross's five stages: (1) the stage
 * model is a popular framing, not an empirically validated sequence — real
 * grief research (Bonanno, G. A. (2004), "Loss, trauma, and human
 * resilience: have we underestimated the human capacity to thrive after
 * extremely aversive events?", American Psychologist, 59(1), 20-28) finds
 * highly variable trajectories, not a fixed order, so no stage machine is
 * built here; (2) what IS well supported and modeled directly is the real
 * SHAPE — a long-tailed, non-monotonic decline (slow power-law fade, not
 * exponential) punctuated by intrusive "waves" long after the initial loss
 * (Zisook, S., & Shear, K. (2009), "Grief and bereavement: what psychiatrists
 * need to know", World Psychiatry, 8(2), 67-74, on grief's protracted,
 * fluctuating course).
 *
 * intensity(t) = G0 · (1 + t/τ)^(−p)   — power-law decay, own choice of p/τ,
 * not fit from a specific dataset — heavier-tailed than CortisolEngine's
 * exponential chronic-stress decay on purpose: grief is modeled as
 * genuinely slower to fade than ordinary stress.
 *
 * Waves are a real Poisson process on top of that decaying base intensity,
 * the same mechanism EpisodicMemory.rollIntrusiveThought() already uses for
 * unresolved-wound intrusions — grief waves are that same real phenomenon,
 * scoped to loss specifically and given their own decaying rate so waves
 * genuinely space out as grief work progresses (own tuning).
 */
export class GriefEngine {

	constructor( { tauMs = 1000 * 60 * 60 * 24 * 14, p = 0.55, waveRateScale = 0.0005 } = {} ) {

		this.tauMs         = tauMs
		this.p                = p
		this.waveRateScale = waveRateScale
		this.griefs           = new Map() // userId -> { G0, startedAt, wavesCount, sourceId }

	}

	/** A loss just happened — `lostValue` (0..1) is real magnitude already computed elsewhere (a bond's affinity, a memory's importance). */
	triggerLoss( userId, lostValue, sourceId = null, now = Date.now() ) {

		const existing  = this.griefs.get( userId )
		const carryOver = existing ? this.getIntensity( userId, now ) : 0
		this.griefs.set( userId, { G0: clamp01( carryOver + lostValue ), startedAt: now, wavesCount: existing?.wavesCount ?? 0, sourceId } )
		return this.griefs.get( userId )

	}

	getIntensity( userId, now = Date.now() ) {

		const g = this.griefs.get( userId )
		if ( !g ) return 0
		const elapsed = Math.max( 0, now - g.startedAt )
		return g.G0 * Math.pow( 1 + elapsed / this.tauMs, -this.p )

	}

	isActive( userId, now = Date.now(), floor = 0.05 ) {

		return this.getIntensity( userId, now ) > floor

	}

	/**
	 * Real Poisson roll for an intrusive grief wave this tick — probability
	 * scales with current (already-decayed) intensity, and the rate itself
	 * damps as wavesCount grows (own tuning: real grief work — each
	 * processed wave makes the next one somewhat less likely, without ever
	 * reaching exactly zero).
	 */
	rollWave( userId, now = Date.now(), dt = 1 ) {

		const g = this.griefs.get( userId )
		if ( !g ) return null

		const intensity = this.getIntensity( userId, now )
		if ( intensity <= 0.05 ) return null

		const dampened     = this.waveRateScale / ( 1 + g.wavesCount * 0.08 )
		const probability = 1 - Math.exp( -dampened * intensity * 1000 * dt )
		if ( Math.random() >= probability ) return null

		g.wavesCount += 1
		return {
			intensity,
			wavesCount : g.wavesCount,
			spike      : { valence: -intensity * 0.6, arousal: intensity * 0.4, weight: intensity },
		}

	}

	getState( userId, now = Date.now() ) {

		const g = this.griefs.get( userId )
		if ( !g ) return { active: false, intensity: 0, wavesCount: 0 }
		return { active: this.isActive( userId, now ), intensity: this.getIntensity( userId, now ), wavesCount: g.wavesCount, sourceId: g.sourceId }

	}

}
