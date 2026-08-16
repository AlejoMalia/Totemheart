/**
 * Runs between interactions (call `totemheart.idle()` from a cron/timer, or
 * manually). Re-samples a recent memory and lets it nudge the mood a little
 * — a cheap analogue of rumination/dreaming — and lets the other ticking
 * stats (homeostasis, fatigue) drain on their own schedule.
 */
function weightedPick( items, weightOf ) {

	const weights = items.map( weightOf )
	const total       = weights.reduce( ( a, b ) => a + b, 0 )
	if ( total <= 0 ) return items[ Math.floor( Math.random() * items.length ) ]

	let roll = Math.random() * total
	for ( let i = 0; i < items.length; i++ ) {

		roll -= weights[ i ]
		if ( roll <= 0 ) return items[ i ]

	}
	return items[ items.length - 1 ]

}

export class IdleProcessing {

	async runIdleCycle( { episodicMemory, moodTracker, homeostasis, decisionFatigue, cortisolEngine = null }, dt = 1 ) {

		// Unresolved (unhealed) memories resurface preferentially — the rumination
		// isn't purely random, it keeps circling back to whatever hasn't been
		// processed yet. Zeigarnik weighting: among the unresolved pool, the ones
		// that have gone longest without resolution get picked more often, not a
		// uniform draw — a thread interrupted an hour ago nags harder than one from
		// thirty seconds ago.
		const unresolved = episodicMemory.getUnresolvedMemories()
		const pool         = unresolved.length ? unresolved : episodicMemory.getInfluentialMemories( 10 )

		if ( pool.length ) {

			const memory = unresolved.length
				? weightedPick( pool, m => episodicMemory.getZeigarnikPriority( m ) )
				: pool[ Math.floor( Math.random() * pool.length ) ]
			moodTracker.push( {
				valence : ( memory.emotionalSignature?.valence ?? 0 ) * 0.2,
				arousal : ( memory.emotionalSignature?.arousal ?? 0 ) * 0.2,
			} )

		}

		// Ambient anxiety from too many open threads — real pressure, not per-memory.
		if ( cortisolEngine && unresolved.length ) {

			const pressure = episodicMemory.getZeigarnikPressure()
			if ( pressure > 1.5 ) cortisolEngine.register( 0, true )

		}

		homeostasis.tick( dt * 0.5, { getSocialDecayRate: () => 0.004 } )
		decisionFatigue.decay( dt * 2 )

		return { sampledMemory: pool.length ? true : false, resurfacedUnresolved: unresolved.length > 0 }

	}

}
