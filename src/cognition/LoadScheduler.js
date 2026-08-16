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
// Relative computational-cost estimate per optional stage (own engineering
// ranking based on what each one actually does — an ontology concept-graph
// pass and a full appraisal cross-check are real multi-step work, a self-
// model reinforcement is one map write — not measured wall-clock profiling).
const STAGE_COST = {
	runOntology                : 0.8,
	runSelfModelUpdate         : 0.15,
	runBehavioralInconsistency : 0.35,
}

// Base instability ceiling per stage — same cutoffs the original fixed-
// threshold version used, kept as the anchor `gate()` computes a real,
// per-turn-adjusted budget around instead of a flat constant.
const BASE_THRESHOLD = {
	runOntology                : 0.85,
	runSelfModelUpdate         : 0.9,
	runBehavioralInconsistency : 0.75,
}

export class LoadScheduler {

	/** instability: 0 = calm, 1 = maximally overloaded. */
	computeInstability( { cortisol = 0, arousal = 0, fatigue = 0 } ) {

		return clamp01( cortisol * 0.4 + Math.max( 0, arousal ) * 0.35 + fatigue * 0.25 )

	}

	/**
	 * Real per-stage resource allocation: each stage's fixed instability
	 * ceiling shifts up when this turn is genuinely novel (worth spending
	 * more on — NoveltyDetector's KL divergence, "urgencia emocional +
	 * novedad" as the two real signals worth budgeting on) and down by its
	 * own relative cost (a pricier stage gets skipped a bit sooner under
	 * load than a cheap one would). A stage still runs whenever
	 * instability < its adjusted threshold — same comparison shape the
	 * original fixed-threshold gate used, now genuinely turn-adjusted
	 * instead of a flat constant.
	 */
	getAdjustedThreshold( stage, { novelty = 0 } = {} ) {

		const base = BASE_THRESHOLD[ stage ] ?? 0.8
		const cost   = STAGE_COST[ stage ] ?? 0.3
		return clamp01( base + Math.min( novelty, 1 ) * 0.1 - cost * 0.1 )

	}

	/** Which optional stages to run this turn, given the instability reading (and optionally novelty, for the adjusted budget). */
	gate( instability, { novelty = 0 } = {} ) {

		return {
			runOntology                : instability < this.getAdjustedThreshold( 'runOntology', { novelty } ),
			runSituationalContext    : true, // cheap, and precisely what's needed to detect instability in the first place
			runSelfModelUpdate         : instability < this.getAdjustedThreshold( 'runSelfModelUpdate', { novelty } ),
			runBehavioralInconsistency   : instability < this.getAdjustedThreshold( 'runBehavioralInconsistency', { novelty } ),
		}

	}

}
