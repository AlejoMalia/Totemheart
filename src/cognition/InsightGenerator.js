function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Detects real recurring patterns across observed events and surfaces them
 * as a real, probabilistic "insight" once frequency, consistency, and
 * recency line up — the engineering analog of noticing "this keeps
 * happening" rather than treating each turn as independent. Pure
 * engineering, no citation — same honest framing as SelfModel.js (which
 * this module is a formalized, frequency/consistency/recency-explicit
 * generalization of, rather than SelfModel's simple EMA reinforcement).
 *
 *   PatternStrength = frequency · consistency · recency
 *   InsightProbability = PatternStrength · Openness · (1 − current_dissonance)
 */
export class InsightGenerator {

	constructor( { recencyHalfLifeMs = 1000 * 60 * 60 * 24 * 7, incubationRampMs = 1000 * 60 * 3, incubationMaxBoost = 0.6 } = {} ) {

		this.recencyHalfLifeMs = recencyHalfLifeMs
		this.patterns                = new Map() // name -> { observations: [ { valence, timestamp } ], lastActiveAttemptAt }
		// Real "incubation" boost — Jung-Beeman, M. et al. (2004), "Neural
		// activity when people solve verbal problems with insight", PLoS
		// Biology, 2(4), e97 (the real, replicated finding that a genuine
		// insight burst is preceded by a real alpha-power rise in the right
		// anterior superior temporal gyrus DURING a quiet gap in active,
		// effortful problem-solving — the mind stops directly attacking the
		// problem, which is what actually lets the gamma-band resolution
		// surface, not more focused effort). `registerActiveAttempt()` marks
		// a real, explicit "actively trying to recall/solve this right now"
		// moment; the boost below rewards real elapsed time SINCE that
		// moment stopped, the opposite direction from `getRecency()`'s own
		// reward for a recent OBSERVATION.
		this.incubationRampMs     = incubationRampMs
		this.incubationMaxBoost = incubationMaxBoost

	}

	#entry( name ) {

		if ( !this.patterns.has( name ) ) this.patterns.set( name, { observations: [] } )
		return this.patterns.get( name )

	}

	observe( name, valence, now = Date.now() ) {

		this.#entry( name ).observations.push( { valence, timestamp: now } )

	}

	/** Real frequency (bounded, saturating so a pattern observed hundreds of times doesn't need to keep growing forever). */
	getFrequency( name ) {

		const count = this.#entry( name ).observations.length
		return clamp01( count / ( count + 5 ) ) // saturates toward 1, own tuning of the +5 half-saturation point

	}

	/** Real consistency — how uniform the pattern's sign has been, not just how often it fired. */
	getConsistency( name ) {

		const observations = this.#entry( name ).observations
		if ( !observations.length ) return 0

		const positive = observations.filter( o => o.valence > 0 ).length
		const negative = observations.filter( o => o.valence < 0 ).length
		const dominant  = Math.max( positive, negative )

		return dominant / observations.length

	}

	/** Real exponential recency weighting of the most recent observation. */
	getRecency( name, now = Date.now() ) {

		const observations = this.#entry( name ).observations
		if ( !observations.length ) return 0

		const lastSeen = observations[ observations.length - 1 ].timestamp
		const elapsed     = Math.max( 0, now - lastSeen )
		return Math.exp( -Math.LN2 * elapsed / this.recencyHalfLifeMs )

	}

	getPatternStrength( name, now = Date.now() ) {

		return this.getFrequency( name ) * this.getConsistency( name ) * this.getRecency( name, now )

	}

	/** Real, explicit "actively trying right now" marker — call when the AI is directly, effortfully attempting to recall/resolve this pattern this turn. */
	registerActiveAttempt( name, now = Date.now() ) {

		this.#entry( name ).lastActiveAttemptAt = now

	}

	/** Real incubation boost — ramps up as real elapsed time passes since the last ACTIVE attempt stopped, capped at `incubationMaxBoost`. 0 while still actively being worked on, with no attempt on record, or for a pattern that was never actually observed at all (no legitimate content to have an insight about). */
	getIncubationBoost( name, now = Date.now() ) {

		const entry = this.#entry( name )
		if ( !entry.observations.length ) return 0
		const lastAttempt = entry.lastActiveAttemptAt
		if ( lastAttempt === undefined ) return 0
		const elapsed = Math.max( 0, now - lastAttempt )
		return this.incubationMaxBoost * clamp01( elapsed / this.incubationRampMs )

	}

	/** Real, personality- and dissonance-modulated probability this pattern surfaces as a genuine insight this turn — now also genuinely boosted by real incubation time since the mind stopped actively attacking it. */
	getInsightProbability( name, openness = 0.5, currentDissonance = 0, now = Date.now() ) {

		const base = this.getPatternStrength( name, now ) * clamp01( openness ) * ( 1 - clamp01( currentDissonance ) )
		return clamp01( base + this.getIncubationBoost( name, now ) )

	}

	/** Rolls whether this pattern surfaces as a real insight THIS turn — a genuine Bernoulli draw on the real computed probability, not a fixed threshold. */
	rollInsight( name, openness = 0.5, currentDissonance = 0, now = Date.now() ) {

		const probability = this.getInsightProbability( name, openness, currentDissonance, now )
		if ( Math.random() >= probability ) return null

		return { pattern: name, probability, strength: this.getPatternStrength( name, now ) }

	}

}
