function clamp( v, min = -1, max = 1 ) {

	return Math.max( min, Math.min( max, v ) )

}

function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

const DAY_MS = 1000 * 60 * 60 * 24

/**
 * Positive reconsolidation bias for genuinely old memories — the well-
 * documented "fading affect bias" (Walker, W. R., Skowronski, J. J., &
 * Thompson, C. P. (2003), "Life is pleasant — and memory helps to keep it
 * that way!", Review of General Psychology, 7(2), 203-210): the negative
 * affect attached to memories fades faster with age than the positive
 * affect does, so old memories drift bittersweet-positive on average without
 * literally erasing what happened. Applied here as a real, bounded blend
 * toward positive valence that grows with age (age-gated: EpisodicMemory's
 * own `reconsolidate()` already handles the RECENT retrieval-window case;
 * this is the separate, slow, age-driven case for memories well outside
 * that window). The blend is capped well short of full erasure — a
 * nostalgic memory of a real hurt should read bittersweet, not simply happy.
 */
export class NostalgiaEngine {

	constructor( { minAgeMs = DAY_MS * 60, maxBlend = 0.35, growthDays = 365, peakDecay = 0.01 } = {} ) {

		this.minAgeMs   = minAgeMs   // memory must be at least this old before nostalgia applies at all
		this.maxBlend    = maxBlend    // hard ceiling — never blend more than this fraction toward positive
		this.growthDays = growthDays // real time to approach half of maxBlend
		// Real, per-person tracked PEAK warmth — "el nosotros de antes" needs
		// a real high-water mark to compare the CURRENT relationship against,
		// distinct from the fading-affect-bias transform above (which
		// operates on one retrieved memory at a time, not a running
		// relationship-level trend). A real, slow-decaying peak so an old
		// high point still means something months later, not reset by any
		// single dip.
		this.peakWarmth = new Map() // userId -> real, slow-decaying historical peak
		this.peakDecay    = peakDecay

	}

	/** Call once per real turn — `currentWarmth` (0..1, e.g. `LoveHateEngine.getNetBond()` normalized). Updates the real tracked peak and returns it. */
	registerWarmth( userId, currentWarmth ) {

		const prior = this.peakWarmth.get( userId ) ?? 0
		const decayed = Math.max( 0, prior - this.peakDecay )
		this.peakWarmth.set( userId, Math.max( decayed, clamp01( currentWarmth ) ) )
		return this.peakWarmth.get( userId )

	}

	/** Real "antes nos reíamos más" comparison — a real, bounded decline signal only when the CURRENT read genuinely sits well below the real tracked peak, not from ordinary turn-to-turn noise. */
	compareToPast( userId, currentWarmth ) {

		const peak = this.peakWarmth.get( userId ) ?? 0
		if ( peak <= 0 ) return 0
		return clamp01( Math.max( 0, peak - clamp01( currentWarmth ) - 0.15 ) )

	}

	toJSON() {

		return [ ...this.peakWarmth.entries() ]

	}

	restoreState( data ) {

		if ( data ) this.peakWarmth = new Map( data )

	}

	/** Real bittersweet blend applied to a stored memory's valence when recalled — doesn't mutate the entry, returns the nostalgic reading for THIS recall. */
	getNostalgicValence( entry, now = Date.now() ) {

		const ageMs = now - ( entry.timestamp ?? now )
		if ( ageMs < this.minAgeMs ) return entry.emotionalSignature?.valence ?? 0

		const ageDays = ageMs / DAY_MS
		const blend      = this.maxBlend * ( ageDays / ( ageDays + this.growthDays ) ) // saturating growth toward maxBlend, never exceeds it

		const original = entry.emotionalSignature?.valence ?? 0
		return clamp( original * ( 1 - blend ) + blend ) // pulled toward +1, original sign/magnitude never fully erased

	}

	/**
	 * Ambivalence raised by recalling something bittersweet — real min(original
	 * negativity, nostalgic positivity) co-presence, same structural idea
	 * LoveHateEngine.getAmbivalence() uses for Affinity/Aversion co-presence.
	 */
	getAmbivalenceBoost( entry, now = Date.now() ) {

		const original     = entry.emotionalSignature?.valence ?? 0
		const nostalgic = this.getNostalgicValence( entry, now )
		if ( original >= 0 ) return 0 // only a real originally-negative memory can read bittersweet

		return clamp01( Math.min( Math.abs( original ), Math.abs( nostalgic - original ) ) )

	}

}
