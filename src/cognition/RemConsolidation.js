/**
 * Real elapsed-time trigger (Date.now() gap since the last turn, not a
 * turn-count heuristic) that runs a background-style sweep before the next
 * turn is processed. Cools stored episodic memories' arousal while leaving
 * their valence/concepts untouched (the semantic "lesson" survives, the raw
 * intensity doesn't — inspired by the general shape of memory-consolidation
 * research on episodic traces stabilizing over rest, not a citation of any
 * specific study's numbers), prunes stale Hebbian associations, and applies
 * the existing DecayEngine over the REAL elapsed hours instead of a per-turn
 * dt — the same machinery, driven by wall-clock time this one time. Identity-
 * level state (SelfModel, Attachment/tribal loyalty, CoreBeliefs) is
 * deliberately untouched: rest cools feelings, it doesn't erase what was
 * learned.
 */
export class RemConsolidation {

	constructor( { idleThresholdMs = 1000 * 60 * 60 * 4, lambdaRem = 0.3, arousalCoolingThreshold = 0.5 } = {} ) {

		this.idleThresholdMs           = idleThresholdMs
		this.lambdaRem                     = lambdaRem
		this.arousalCoolingThreshold = arousalCoolingThreshold
		this.lastTurnAt                     = null

	}

	shouldTrigger( now = Date.now() ) {

		return this.lastTurnAt !== null && ( now - this.lastTurnAt ) > this.idleThresholdMs

	}

	recordTurn( now = Date.now() ) {

		this.lastTurnAt = now

	}

	sweep( { episodicMemory, hebbianPlasticity, cortisolEngine, expressionDebt, sensitization, emotionSpace, moodTracker, decayEngine, personality }, now = Date.now() ) {

		const elapsedMs      = this.lastTurnAt !== null ? now - this.lastTurnAt : 0
		const elapsedHours = elapsedMs / ( 1000 * 60 * 60 )

		// Episodic replay: cool peak arousal on high-magnitude memories, real-cite-free
		// exponential dampening, valence/concepts left exactly as stored.
		let cooled = 0
		for ( const m of episodicMemory.memories ) {

			const arousal = m.emotionalSignature?.arousal ?? 0
			if ( Math.abs( arousal ) > this.arousalCoolingThreshold ) {

				m.emotionalSignature.arousal = arousal * Math.exp( -this.lambdaRem )
				cooled++

			}
			if ( m.importance > 0.6 || m.permanent ) episodicMemory.tagRemSalient( m.id, now )

		}

		// Synaptic pruning — extra decay on associations that went stale during the gap.
		if ( hebbianPlasticity ) hebbianPlasticity.decayOnly( Math.min( elapsedHours * 0.05, 0.9 ) )

		// Basal reset — the felt state cools by REAL elapsed time via the same
		// DecayEngine machinery every tick() already uses, just driven by hours
		// instead of turns.
		const mood = moodTracker.getMood()
		const restDt = Math.min( elapsedHours, 24 * 30 ) // cap at ~1 simulated month so a multi-year gap doesn't do anything pathological
		decayEngine.apply( emotionSpace, mood, personality, restDt )
		cortisolEngine.decay( restDt )
		expressionDebt.decay( restDt )
		sensitization.decay( restDt )

		const topUnresolved = episodicMemory.getUnresolvedMemories( null, 1 )[ 0 ] ?? null
		this.recordTurn( now )

		return { elapsedHours, memoriesCooled: cooled, topUnresolvedConcepts: topUnresolved?.concepts ?? [] }

	}

}
