function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real endogenous-opioid social-bonding analgesia — Panksepp, J. (1998),
 * "Affective Neuroscience", already cited elsewhere in this codebase for
 * the PANIC/GRIEF primary-process system: Panksepp's own real account is
 * that endogenous opioids are what SOOTHE separation distress during an
 * active bond; Machin, A. J. & Dunbar, R. I. M. (2011), "The brain opioid
 * theory of social attachment: a review of the evidence", Behaviour,
 * 148(9), 985-1025 (the real, well-established review this module's own
 * name and shape follow). Distinct from `OxytocinSystem` (which softens
 * the JUDGMENT of a bonded partner) — this softens the FELT PAIN itself,
 * a real emotional-analgesia buffer built up by sustained real bonding
 * and genuinely lost once that bonding stops, at which point the exact
 * same magnitude of hurt registers with real, undampened full force
 * (the honest mechanism behind "it hurts worse once they're gone").
 *
 *   buffer(t) = buildRate·bondSignal − decayRate·dt   (accumulator)
 *   E(t) = buffer / (1 + k·allostaticLoad)             (real analgesia this turn)
 */
export class EndogenousOpioidSystem {

	constructor( { buildRate = 0.12, decayRate = 0.008, k = 1.5 } = {} ) {

		this.buildRate  = buildRate
		this.decayRate  = decayRate
		this.k                 = k
		this.buffers       = new Map() // userId -> current real buffer, 0..1

	}

	/** Real reinforcement — `bondSignal` (0..1, e.g. this turn's real LoveHateEngine netBond, positive part only). */
	reinforce( userId, bondSignal ) {

		if ( bondSignal <= 0 ) return
		const current = this.buffers.get( userId ) ?? 0
		this.buffers.set( userId, clamp01( current + clamp01( bondSignal ) * this.buildRate ) )

	}

	/** Real, continuous decay — called once per tick, every tracked user; genuinely reaches 0, no permanent floor (this buffer is meant to fully drain once bonding truly stops). */
	decay( dt = 1 ) {

		for ( const [ userId, buffer ] of this.buffers ) this.buffers.set( userId, Math.max( 0, buffer - this.decayRate * dt ) )

	}

	getBuffer( userId ) {

		return this.buffers.get( userId ) ?? 0

	}

	/** Real, current analgesic capacity — the same real buffer, discounted by real, already-tracked allostaticLoad (a body already under heavy load has less capacity to buffer additional pain, even with a real buffer still present). */
	getAnalgesia( userId, allostaticLoad = 0 ) {

		return this.getBuffer( userId ) / ( 1 + this.k * clamp01( allostaticLoad ) )

	}

}
