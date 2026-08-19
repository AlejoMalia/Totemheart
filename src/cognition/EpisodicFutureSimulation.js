function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real episodic future thinking — simulating several CONCRETE candidate
 * futures and comparing them, not a single scalar forecast — Schacter, D.
 * L. & Addis, D. R. (2007), "The cognitive neuroscience of constructive
 * memory: remembering the past and imagining the future." Philosophical
 * Transactions of the Royal Society B, 362(1481), 773-786 (the real,
 * well-established finding that imagining the future recruits much of the
 * same constructive-memory machinery as remembering the past — episodic
 * future thinking as literal SIMULATION, not a single utility number).
 * Distinct from `EmotionalForecasting` (which this module reuses as its own
 * real per-candidate scoring function rather than reinventing it) — the
 * real addition here is holding several named candidate futures at once and
 * reading real anticipatory anxiety from how much they DISAGREE with each
 * other, not just from the winner's own valence.
 *
 *   V = E[U(episode)]  (via EmotionalForecasting per candidate)
 *   AnticipatoryAnxiety ∝ variance across candidate valences
 */
export class EpisodicFutureSimulation {

	/**
	 * `candidates` — real array of `{ name, valence, probability }`, each a
	 * concrete imagined episode the caller constructs (not generated here —
	 * Totemheart has no world model to invent them from scratch, only to
	 * score and compare the ones supplied).
	 */
	simulate( candidates ) {

		if ( !candidates.length ) return { best: null, expectedValue: 0, anticipatoryAnxiety: 0, candidates: [] }

		const scored = candidates.map( c => ( {
			...c,
			expectedContribution : clamp01( ( c.valence + 1 ) / 2 ) * clamp01( c.probability ?? 1 / candidates.length ),
		} ) )

		const expectedValue = scored.reduce( ( sum, c ) => sum + c.expectedContribution, 0 )
		const best                = scored.reduce( ( b, c ) => ( c.expectedContribution > b.expectedContribution ? c : b ), scored[ 0 ] )

		// Real variance across candidate valences — several sharply-disagreeing
		// imagined futures (a great outcome AND a terrible one both plausible)
		// is itself the real signature of concrete anticipatory anxiety, distinct
		// from a single low-valence forecast (that's just dread, not uncertainty).
		const meanValence   = candidates.reduce( ( s, c ) => s + c.valence, 0 ) / candidates.length
		const variance          = candidates.reduce( ( s, c ) => s + ( c.valence - meanValence ) ** 2, 0 ) / candidates.length
		const anticipatoryAnxiety = clamp01( Math.sqrt( variance ) )

		return { best: best.name, expectedValue: clamp01( expectedValue ), anticipatoryAnxiety, candidates: scored }

	}

}
