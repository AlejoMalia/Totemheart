/**
 * Ebbinghaus (1885) forgetting curve: retention decays exponentially with
 * time since encoding, and decays slower the more "stable" (rehearsed /
 * salient) the memory is — R(t) = e^(-t/S). Ebbinghaus's original nonlinear
 * curve was fit to his own memorized-syllable data, not to conversational
 * emotional memory, so `stability` here is an engineering parameter tuned
 * for this system's timescale, not a reproduction of his measured constants.
 * Entries flagged `permanent` (emotional peak > 0.9, set by
 * EpisodicMemory.store) bypass the curve entirely and never get pruned.
 */
export class ForgettingCurve {

	tick( episodicMemory, dt, { pruneBelow = 0.05, stability = 8 } = {} ) {

		if ( episodicMemory.adapter ) return // external store manages its own retention

		episodicMemory.memories = episodicMemory.memories.filter( entry => {

			if ( entry.permanent ) return true

			entry.retention *= Math.exp( -dt / ( stability * ( 1 + entry.importance ) ) )
			return entry.retention > pruneBelow

		} )

	}

}
