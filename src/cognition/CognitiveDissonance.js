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

}
