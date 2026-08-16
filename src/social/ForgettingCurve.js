/**
 * Ebbinghaus (1885) forgetting curve: retention decays exponentially with
 * time since encoding, and decays slower the more "stable" (rehearsed /
 * salient) the memory is — R(t) = e^(-t/S). Ebbinghaus's original nonlinear
 * curve was fit to his own memorized-syllable data, not to conversational
 * emotional memory, so `stability` here is an engineering parameter tuned
 * for this system's timescale, not a reproduction of his measured constants.
 * Entries flagged `permanent` (emotional peak > 0.9, set by
 * EpisodicMemory.store) bypass the curve entirely and never get pruned.
 *
 * Real bug fixed here (found by IntelligentMockGenerator's
 * `rupture_implies_wound_created` invariant, a long-horizon scenario with
 * enough accumulated tick(dt) to cross pruneBelow): an `unresolved` wound
 * was ONLY protected from pruning if it also happened to be `permanent`.
 * EpisodicMemory.js's own store() documents the real intent — "it stays
 * unresolved until something explicitly heals it" — but ForgettingCurve
 * never actually enforced that; an unresolved memory below the permanence
 * magnitude threshold (most of them) could silently vanish from
 * episodicMemory.memories after enough idle/tick time while the REST of
 * the system (getUnresolvedMemories(), the "HERIDA SIN RESOLVER" system-
 * prompt block, LoveHateEngine's own rupture wound) kept assuming it was
 * still there. Fixed by exempting `unresolved` the same way `permanent`
 * already was — it can still be healed by markResolved() (after which it
 * decays normally), it just can't be forgotten by time alone.
 */
export class ForgettingCurve {

	tick( episodicMemory, dt, { pruneBelow = 0.05, stability = 8 } = {} ) {

		if ( episodicMemory.adapter ) return // external store manages its own retention

		episodicMemory.memories = episodicMemory.memories.filter( entry => {

			if ( entry.permanent || entry.resolution === 'unresolved' ) return true

			entry.retention *= Math.exp( -dt / ( stability * ( 1 + entry.importance ) ) )
			return entry.retention > pruneBelow

		} )

	}

}
