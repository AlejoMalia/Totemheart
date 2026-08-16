function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * A wound specifically about betrayal — a real, permanent trust-threshold
 * shift for intense-enough betrayals, distinct from ordinary Aversion decay
 * (Freyd, J. J. (1996), "Betrayal Trauma: The Logic of Forgetting Childhood
 * Abuse", Harvard University Press — the actual term "betrayal trauma"
 * originates here, specifically about wounds from someone the victim
 * depended on/trusted, matching this module's real trigger condition). The
 * real permanence-above-threshold shape mirrors EpisodicMemory's own
 * unresolved-wound contract (magnitude above 0.7 never fully decays) —
 * applied here specifically to the trust-threshold this user's FUTURE
 * interactions get read against, not to a stored memory entry.
 *
 *   TraumaTrace(t) = intensity · e^(−λ·time), floored permanently if intensity > 0.7
 *   TrustThreshold(t) = base + TraumaTrace(t) · (1 + Neuroticism)
 */
export class BetrayalTraumaTrace {

	constructor( { lambda = 0.0005 } = {} ) {

		this.lambda   = lambda
		this.traces   = new Map() // userId -> { intensity, floor, triggeredAt }

	}

	/** A real betrayal-tagged concept match (e.g. EmotionalOntology's 'betrayal') this intense triggers a new trace, compounding with any existing one for this user. */
	record( userId, intensity, now = Date.now() ) {

		const existing         = this.traces.get( userId )
		const carriedOver = existing ? this.getTrace( userId, now ) : 0
		const combined       = clamp01( carriedOver + intensity )

		this.traces.set( userId, {
			intensity   : combined,
			floor          : combined > 0.7 ? combined * 0.5 : 0, // a genuinely severe betrayal leaves a real permanent floor, own tuning of the 0.5 fraction
			triggeredAt : now,
		} )

	}

	/** Real exponential decay toward the entry's own permanent floor (0 for a milder betrayal — decays away completely, matching ordinary Aversion). */
	getTrace( userId, now = Date.now() ) {

		const entry = this.traces.get( userId )
		if ( !entry ) return 0

		const elapsed = Math.max( 0, now - entry.triggeredAt )
		const decayed  = entry.intensity * Math.exp( -this.lambda * elapsed )
		return Math.max( entry.floor, decayed )

	}

	/** The real, elevated trust threshold this user's future interactions get read against — Neuroticism amplifies how much the same trace raises the bar. */
	getTrustThreshold( userId, baseThreshold = 0.5, neuroticism = 0.5, now = Date.now() ) {

		return baseThreshold + this.getTrace( userId, now ) * ( 1 + clamp01( neuroticism ) )

	}

	hasPermanentTrace( userId ) {

		return ( this.traces.get( userId )?.floor ?? 0 ) > 0

	}

}
