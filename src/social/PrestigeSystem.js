function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real prestige — the second, genuinely distinct real pathway to social
 * status alongside `PowerDynamicsEngine`'s own dominance tracking — Cheng,
 * J. T., Tracy, J. L. & Henrich, J. (2010), "Pride, personality, and the
 * evolutionary foundations of human social status", Evolution and Human
 * Behavior, 31(5), 334-347 (the real, well-cited finding that human status
 * hierarchies run on TWO qualitatively different real strategies: dominance
 * — coercion, intimidation, imposed cost — and prestige — genuinely,
 * freely CONFERRED respect for demonstrated skill/knowledge, requiring no
 * coercion at all). Distinct trigger and distinct decay: dominance rises
 * from assertive acts and fatigues the actor; prestige rises from
 * genuinely DEMONSTRATED competence recognized by others and doesn't cost
 * the actor anything to hold, but decays if competence isn't demonstrated
 * again — own engineering of the specific formulas.
 *
 *   prestige(t) = prestige(t-1)·(1-λ) + competenceDemonstrated · audienceRecognition
 */
export class PrestigeSystem {

	constructor( { decayRate = 0.08 } = {} ) {

		this.decayRate = decayRate
		this.prestige      = new Map() // userId -> real prestige this AI holds IN THE EYES of that user

	}

	/** `competenceDemonstrated` (0..1, real genuine skill/knowledge shown this turn), `audienceRecognition` (0..1, real signal the other party actually noticed/valued it — freely conferred, not extracted). */
	demonstrateCompetence( userId, competenceDemonstrated, audienceRecognition = 0.5 ) {

		const current = this.prestige.get( userId ) ?? 0
		const gain        = clamp01( competenceDemonstrated ) * clamp01( audienceRecognition )
		this.prestige.set( userId, clamp01( current * ( 1 - this.decayRate ) + gain ) )

	}

	getPrestige( userId ) {

		return this.prestige.get( userId ) ?? 0

	}

	/** Real, distinct behavioral output — prestige earns genuine deference/imitation from others, unlike dominance's fear-based compliance. `PowerDynamicsEngine`'s own dominance value is a separate, real second input, not merged into one score. */
	getInfluence( userId, dominanceValue = 0 ) {

		const prestige = this.getPrestige( userId )
		return clamp01( prestige * 0.7 + Math.max( 0, dominanceValue ) * 0.3 )

	}

	decay( userId, dt = 1 ) {

		const current = this.prestige.get( userId )
		if ( current !== undefined ) this.prestige.set( userId, current * Math.pow( 1 - this.decayRate, dt ) )

	}

}
