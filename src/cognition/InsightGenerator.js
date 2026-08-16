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

	constructor( { recencyHalfLifeMs = 1000 * 60 * 60 * 24 * 7 } = {} ) {

		this.recencyHalfLifeMs = recencyHalfLifeMs
		this.patterns                = new Map() // name -> { observations: [ { valence, timestamp } ] }

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

	/** Real, personality- and dissonance-modulated probability this pattern surfaces as a genuine insight this turn. */
	getInsightProbability( name, openness = 0.5, currentDissonance = 0, now = Date.now() ) {

		return clamp01( this.getPatternStrength( name, now ) * clamp01( openness ) * ( 1 - clamp01( currentDissonance ) ) )

	}

	/** Rolls whether this pattern surfaces as a real insight THIS turn — a genuine Bernoulli draw on the real computed probability, not a fixed threshold. */
	rollInsight( name, openness = 0.5, currentDissonance = 0, now = Date.now() ) {

		const probability = this.getInsightProbability( name, openness, currentDissonance, now )
		if ( Math.random() >= probability ) return null

		return { pattern: name, probability, strength: this.getPatternStrength( name, now ) }

	}

}
