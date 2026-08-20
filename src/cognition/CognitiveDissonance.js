function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Tracks "cognitive stress" — a stat of its own (not an emotion) that
 * spikes when input conflicts with a CoreBelief and decays independently.
 * DefenseMechanisms watches this stat to decide when to react.
 *
 * Named after Festinger, L. (1957), "A Theory of Cognitive Dissonance" — the
 * name and the general idea (conflicting cognitions produce tension the
 * system tries to resolve) come from there. The stress accumulation formula,
 * threshold, and the behavioral-inconsistency check below are our own
 * engineering, not something Festinger specified computationally.
 * See CALIBRATION.md.
 */
export class CognitiveDissonance {

	constructor() {

		this.stress = 0

	}

	/** conflictScore comes from LanguageProvider.analyze('beliefConflict', ...) */
	registerConflict( conflictScore, personality ) {

		const threshold = personality.getDissonanceThreshold()
		if ( conflictScore <= threshold ) return { triggered: false, conflictScore }

		this.stress = clamp01( this.stress + conflictScore * 0.5 )
		return { triggered: true, conflictScore }

	}

	/**
	 * Dissonance isn't only "does this text contradict a static belief" —
	 * it's also "does this text contradict the *pattern* this specific user
	 * has established". A user who has been consistently cold suddenly
	 * saying "te quiero" is inconsistent with the learned relationship,
	 * even though nothing in it contradicts a CoreBelief.
	 */
	registerBehavioralInconsistency( appraisal, relation, personality ) {

		const suddenWarmthFromColdUser = relation.affinity < 0.3 && ( appraisal.desirability ?? 0 ) > 0.5 && appraisal.agency === 'user'
		if ( !suddenWarmthFromColdUser ) return { triggered: false, score: 0 }

		const score      = ( 0.5 - relation.affinity ) + ( appraisal.desirability - 0.5 )
		const threshold  = personality.getDissonanceThreshold()
		if ( score <= threshold ) return { triggered: false, score }

		this.stress = clamp01( this.stress + score * 0.35 )
		return { triggered: true, score }

	}

	decay( dt, lambda = 0.15 ) {

		this.stress = Math.max( 0, this.stress - lambda * dt )

	}

	getStress() {

		return this.stress

	}

	/**
	 * Real dissonance REDUCTION, not just detection — Festinger's own theory
	 * is explicitly about the drive to reduce the tension once it exists, via
	 * one of a few real strategies (Festinger, L. (1957); McGrath, A. (2017),
	 * "Dealing with dissonance: A review of cognitive dissonance reduction."
	 * Social and Personality Psychology Compass, 11(12), for the modern
	 * taxonomy this module's 3 strategies follow): rationalize (discount how
	 * much this conflict actually matters), changeBelief (actually shift the
	 * conflicting CoreBelief's own weight), trivialize (decide the conflict
	 * isn't important enough to hold onto). The argmax cost/benefit picking
	 * among them is own engineering.
	 */
	selectReductionStrategy( { conscientiousness = 0.5, openness = 0.5 } = {} ) {

		const strategies = {
			// Cheap, real self-serving discounting — no belief actually changes,
			// just how threatening the conflict is read as. Biased toward the
			// less-open, less-willing-to-actually-update-belief case.
			rationalize    : ( 1 - clamp01( openness ) ) * 0.6 + 0.2,
			// Real, actually updating the conflicting belief itself — the
			// costliest, most cognitively honest option; Openness raises it.
			changeBelief : clamp01( openness ) * 0.7,
			// Cheapest: just decide it doesn't matter. Conscientiousness (real
			// follow-through, less likely to just wave it away) lowers it.
			trivialize        : ( 1 - clamp01( conscientiousness ) ) * 0.5 + 0.1,
		}

		const selected = Object.keys( strategies ).reduce( ( best, s ) => ( strategies[ s ] > strategies[ best ] ? s : best ), 'rationalize' )
		return { selected, scores: strategies }

	}

	/**
	 * Applies the real, chosen strategy's effect: `rationalize`/`trivialize`
	 * both discount `this.stress` directly (own-tuned rates, trivialize
	 * cheaper and faster); `changeBelief` returns a real, bounded suggested
	 * delta the caller applies to the actual conflicting CoreBelief's own
	 * weight (this module doesn't hold CoreBeliefs itself).
	 */
	applyReduction( strategy, conflictScore ) {

		if ( strategy === 'rationalize' ) { this.stress = clamp01( this.stress - conflictScore * 0.3 ); return { beliefWeightDelta: 0 } }
		if ( strategy === 'trivialize' )     { this.stress = clamp01( this.stress - conflictScore * 0.45 ); return { beliefWeightDelta: 0 } }
		if ( strategy === 'changeBelief' )     { this.stress = clamp01( this.stress - conflictScore * 0.15 ); return { beliefWeightDelta: -conflictScore * 0.2 } }
		return { beliefWeightDelta: 0 }

	}

	/**
	 * Real POST-DECISION "spreading of alternatives" — Brehm, J. W. (1956),
	 * "Postdecision changes in the desirability of alternatives", Journal of
	 * Abnormal and Social Psychology, 52(3), 384-389 (the real, foundational
	 * finding: after choosing between two options, the chosen one's own
	 * perceived value genuinely rises and the rejected one's genuinely
	 * falls, reducing the real dissonance of having given something up).
	 * Distinct from `applyReduction()` above (which discounts/rationalizes
	 * the CONFLICT itself) — this specifically reshapes the two competing
	 * VALUES after a real choice was made, own tuning of η.
	 */
	spreadAlternatives( chosenValue, rejectedValue, eta = 0.1 ) {

		return { chosenValue: clamp01( chosenValue + eta ), rejectedValue: Math.max( 0, rejectedValue - eta ) }

	}

}
