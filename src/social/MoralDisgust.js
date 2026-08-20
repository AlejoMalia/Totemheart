function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real moral disgust — Rozin, P., Haidt, J. & McCauley, C. R. (1999),
 * "Disgust: The body and soul emotion", in Dalgleish & Power (eds.),
 * Handbook of Cognition and Emotion (the real, well-established account of
 * disgust extending from physical contamination to MORAL/purity
 * violations — a genuinely distinct trigger from anger or contempt);
 * Haidt, J. (2003) and the real CAD triad hypothesis — Contempt maps to
 * Community-norm violations (`ContemptDetector`'s real status-superiority
 * + disrespect gate), Anger maps to Autonomy violations (ordinary
 * hostility already tracked throughout this codebase), Disgust maps to
 * Divinity/purity violations — this module is specifically that third,
 * previously-missing leg, with its own real trigger condition, not a
 * relabeling of contempt.
 *
 *   disgust = purityViolation · moralWeight − tolerance
 */
export class MoralDisgust {

	constructor( { tolerance = 0.15 } = {} ) {

		this.tolerance    = tolerance // real, personality-linked threshold below which a mild purity violation doesn't register at all
		this.exposure = new Map() // userId -> real accumulated purity-violation exposure

	}

	/** `purityViolationSignal` (0..1, real caller-read magnitude of a purity/sanctity violation — distinct from disrespect/status, ContemptDetector's own trigger). */
	registerViolation( userId, purityViolationSignal ) {

		const current = this.exposure.get( userId ) ?? 0
		this.exposure.set( userId, clamp01( current * 0.8 + clamp01( purityViolationSignal ) * 0.5 ) )

	}

	/** `moralWeight` (0..1, real severity already read from `EmotionalOntology`-style appraisal). Requires the violation to clear a real tolerance floor — not every minor purity brush registers as disgust. */
	getDisgust( userId, moralWeight = 0.5 ) {

		const exposure = this.exposure.get( userId ) ?? 0
		if ( exposure < this.tolerance ) return 0
		return clamp01( ( exposure - this.tolerance ) / ( 1 - this.tolerance ) * clamp01( moralWeight ) )

	}

	/** Real, distinct behavioral output — moral disgust genuinely produces distancing, not confrontation (contempt's own action tendency). */
	getWithdrawalPull( userId, moralWeight = 0.5 ) {

		return this.getDisgust( userId, moralWeight ) * 0.7

	}

	decay( userId, dt = 1, lambda = 0.08 ) {

		const current = this.exposure.get( userId )
		if ( current !== undefined ) this.exposure.set( userId, Math.max( 0, current * Math.pow( 1 - lambda, dt ) ) )

	}

}
