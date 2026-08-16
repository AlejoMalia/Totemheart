function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * "No central clock, components react to instability" reframed honestly:
 * Totemheart's mechanics have real data dependencies (appraisal needs to
 * exist before dissonance can check it) — they cannot self-organize into
 * arbitrary execution order like independent swarm workers. What CAN be
 * genuinely load-adaptive is *which optional mechanics run at all* this
 * turn. `DecisionFatigue.isShallow()` already does a binary version of this;
 * LoadScheduler generalizes it into a graded "instability" reading
 * (cortisol + arousal + fatigue) that decides, per optional mechanic,
 * whether to spend the cycles — the computational budget flows toward the
 * turn's actual bottleneck (an active threat/crisis) instead of always
 * running the full fixed pipeline. Engineering design, no citation.
 */
export class LoadScheduler {

	/** instability: 0 = calm, 1 = maximally overloaded. */
	computeInstability( { cortisol = 0, arousal = 0, fatigue = 0 } ) {

		return clamp01( cortisol * 0.4 + Math.max( 0, arousal ) * 0.35 + fatigue * 0.25 )

	}

	/** Which optional stages to run this turn, given the instability reading. */
	gate( instability ) {

		return {
			runOntology            : instability < 0.85,
			runSituationalContext    : true, // cheap, and precisely what's needed to detect instability in the first place
			runSelfModelUpdate         : instability < 0.9,
			runBehavioralInconsistency   : instability < 0.75,
		}

	}

}
