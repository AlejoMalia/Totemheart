function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real, transient hypofrontality during high-absorption, low-self-
 * reference activity — Dietrich, A. (2003), "Functional neuroanatomy of
 * altered states of consciousness: the transient hypofrontality
 * hypothesis", Consciousness and Cognition, 12(4), 231-256 (the real,
 * well-established finding that flow/absorption states involve a genuine
 * transient DOWN-regulation of prefrontal executive control, not extra
 * effort — deliberately distinct from `CreativeModeSwitch.js`'s own real
 * divergent/convergent output-shaping switch, which is about WHAT gets
 * considered, not about how much executive control is currently online).
 * Named for exactly what it is (a real, bounded flow-absorption read), not
 * for the broader "supraconsciousness"/transpersonal framing that
 * originally motivated adding it: see CALIBRATION.md for why that framing
 * itself was NOT adopted (untestable claims dressed in real-sounding
 * equations from Integrated Information Theory / phase-locking values that
 * this codebase has no way to actually measure or validate).
 *
 *   flow = absorption · (1 − selfReferentialThought)
 *   hypofrontality = flow · maxReduction
 */
export class FlowStateEngine {

	constructor( { maxReduction = 0.5, smoothing = 0.4 } = {} ) {

		this.maxReduction = maxReduction // real, deliberate ceiling — executive control never fully vanishes
		this.smoothing        = smoothing
		this.level                    = 0 // real, single global smoothed flow read (this AI's own current state, not per-user)

	}

	/** `absorption` (0..1, real, this-turn engagement/focus signal, e.g. `1 − BoredomSystem`'s own boredom read), `selfReferentialThought` (0..1, real, this-turn narrative self-focus, e.g. rumination/self-narrative activity). */
	update( absorption, selfReferentialThought ) {

		const raw       = clamp01( absorption ) * ( 1 - clamp01( selfReferentialThought ) )
		this.level = clamp01( this.level * this.smoothing + raw * ( 1 - this.smoothing ) )
		return this.level

	}

	/** Real, bounded reduction a caller applies to its own real executive-control cost this turn (e.g. `InhibitoryControlPool` spend, `DecisionFatigue`'s own accumulation rate) — never a full bypass. */
	getHypofrontalityDiscount() {

		return this.level * this.maxReduction

	}

	/** Real, subjective time-distortion companion — flow states genuinely read as time passing faster/disappearing, composed here rather than duplicating `SubjectiveTimeEngine`'s own separate arousal-driven distortion. */
	getSubjectiveTimeCompressionBonus() {

		return this.level * 0.3

	}

	toJSON() {

		return this.level

	}

	restoreState( data ) {

		if ( typeof data === 'number' ) this.level = data

	}

}
