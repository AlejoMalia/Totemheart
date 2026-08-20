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
 *
 * `time` is real elapsed wall-clock milliseconds (`now - triggeredAt`), the
 * same unit `GriefEngine`'s own `tauMs` decays against. The default lambda
 * below is own tuning for a real ~21-day half-life (deliberately longer
 * than `GriefEngine`'s own 14-day tau, matching this module's own claim of
 * being slower than ordinary Aversion decay) — own design, not measured
 * from Freyd's own qualitative work, which doesn't specify a decay
 * constant. A prior default (0.0005) was a real, since-fixed bug: at a
 * per-millisecond scale that constant decayed any trace to genuine zero
 * within about 2 real SECONDS, silently defeating this module's entire
 * stated purpose — caught by `examples/love-triangle-mock.js`, which was
 * the first place this project ever exercised the real default lambda
 * against real elapsed wall-clock time instead of a test-supplied one.
 */
export class BetrayalTraumaTrace {

	constructor( { lambda = Math.log( 2 ) / ( 1000 * 60 * 60 * 24 * 21 ) } = {} ) {

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

	/**
	 * Real betrayal-reappraisal window — Finkel, E. J., Rusbult, C. E.,
	 * Kumashiro, M. & Hannon, P. A. (2002), "Dealing with betrayal in close
	 * relationships: Does commitment promote forgiveness?", Journal of
	 * Personality and Social Psychology, 82(6), 956-974 (the real,
	 * well-established finding that a betrayal's initial appraisal is not
	 * fixed: a real window exists, longer for a more committed relationship,
	 * during which new evidence can genuinely revise how the event itself is
	 * read — distinct from `Reappraisal`'s general single-turn reframing,
	 * and distinct from this class's own trust-threshold decay, which
	 * doesn't reinterpret the event, only fades its weight). Once the window
	 * closes, the trace becomes fixed history the way it already does.
	 *
	 *   windowOpen = elapsed < baseWindowMs · (1 + commitment)
	 */
	isReappraisalWindowOpen( userId, commitment = 0.5, baseWindowMs = 1000 * 60 * 60 * 24 * 3, now = Date.now() ) {

		const entry = this.traces.get( userId )
		if ( !entry ) return false
		const elapsed = Math.max( 0, now - entry.triggeredAt )
		return elapsed < baseWindowMs * ( 1 + clamp01( commitment ) )

	}

	/** While the real window is open, new real mitigating context (a genuine apology, exculpatory evidence) can reduce the trace itself, not just its expression — closed windows leave the trace as fixed history. */
	reappraiseWithinWindow( userId, mitigatingWeight, commitment = 0.5, now = Date.now() ) {

		if ( !this.isReappraisalWindowOpen( userId, commitment, undefined, now ) ) return false
		const entry = this.traces.get( userId )
		if ( !entry ) return false
		entry.intensity = clamp01( entry.intensity - clamp01( mitigatingWeight ) * 0.3 )
		if ( entry.intensity <= 0.7 ) entry.floor = 0 // a real, in-window reappraisal can undo the permanent floor if it drops the trace below the severity line that set it
		return true

	}

}
