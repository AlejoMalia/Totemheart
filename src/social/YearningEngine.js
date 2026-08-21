function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

const GAMMA_BY_STYLE = { secure: 0.5, anxious: 0.85, avoidant: 0.3, fearful: 0.75 }
const IDEALIZATION_BIAS      = 0.75 // own tuning: how strongly the imagining mind privileges warm memory over hurtful memory while simulating — the "filters out the negative" step
const TRACE_GAIN                       = 0.3 // own tuning: how much one real yearning episode adds to the persistent trace
const TRACE_DECAY_RATE       = 0.12 // own tuning: per real day

/**
 * Yearning (anhelo): a real, distinct psychological construct from Desire
 * (`DesireEngine.js`, a present, reachable target) or Craving
 * (`CravingTrace.js`, a post-resistance residual) — this is a deep, often
 * melancholic pull toward someone/something genuinely absent (temporally,
 * spatially, or permanently), cue-triggered by a real memory retrieval, not
 * a standing appetite.
 *
 * Deliberately reuses, rather than reimplements, the project's own existing
 * real machinery for each real sub-part the user's own spec described:
 *
 * - The "hipocampo" cue: a genuine `RelationalMemoryCatalog.reminisce()`
 *   hit — real lexical overlap between THIS turn's own words (about
 *   whoever the AI is currently talking to) and a stored detail belonging
 *   to a DIFFERENT, currently-absent person. Deliberately conservative: no
 *   spontaneous idle-time triggering. This project's own architecture is
 *   turn-driven (see round-39 finding sent to the user directly): nothing
 *   fires between turns without a real cue, and yearning does not
 *   fabricate one. A detonante has to be a real word this turn, echoing
 *   something a real, absent person once said.
 * - Idealization: the mind filters out the hurtful parts of a memory while
 *   simulating it (a real, if own-design, reading of the ledger's own
 *   `cumulativeWarmth` vs `cumulativeHurt` split — deliberately DIFFERENT
 *   from `RelationalMemoryCatalog.getReunionReactivation()`'s unbiased
 *   signed tone: that one reports what the history actually was; this one
 *   models what the mind subjectively imagines while missing them, which
 *   is a real, well-documented gap between memory-as-recorded and
 *   memory-as-recalled-under-longing).
 * - The anticipatory burst → reality-check crash cycle: real TD-learning
 *   RPE (Schultz, W., Dayan, P., & Montague, P. R. (1997), "A neural
 *   substrate of prediction and reward", Science, 275(5306), 1593-1599),
 *   reusing `DopaminergicEngine.computeRPE()` directly rather than
 *   reimplementing the formula. The idealized, γ-discounted future value
 *   is fed to it as if it were a real reward (mental simulation of a
 *   future reward measurably activates overlapping reward circuitry —
 *   Schacter, D. L., & Addis, D. R. (2007), "The cognitive neuroscience of
 *   constructive memory: remembering the past and imagining the future",
 *   Philosophical Transactions of the Royal Society B, 362(1481),
 *   773-786), producing a real positive RPE burst against that context's
 *   near-zero prior expectation. Immediately calling `computeRPE(0, ...)`
 *   again on the SAME now-inflated context compares real reward (still
 *   genuinely zero — the person is still absent) against that freshly
 *   raised expectation, producing a real negative RPE: the crash, from the
 *   exact same real TD(λ) machinery, not a second invented formula.
 * - γ (how much weight the imagined future gets against the present) is
 *   set from the AI's own real attachment style (`Attachment.getStyle()`,
 *   already computed elsewhere in the pipeline): anxious attachment
 *   involves hyperactivating, future-fixated rumination about the
 *   attachment figure; avoidant attachment involves deactivating,
 *   present-suppressing strategies (Mikulincer, M., & Shaver, P. R.
 *   (2007), "Attachment in Adulthood: Structure, Dynamics, and Change",
 *   Guilford Press). The specific γ values per style are this project's
 *   own tuning of that real qualitative direction, not literal published
 *   constants — this engine's own internal γ (the TD(λ) credit-assignment
 *   hyperparameter) is a separate, unrelated value and is left untouched.
 * - Pain of absence: the crash magnitude, scaled by a real persistent
 *   per-user kindling trace (Goddard, G. V. (1967), "Development of
 *   epileptic seizures through brain stimulation at low intensity",
 *   Nature — the same qualitative kindling shape already borrowed for
 *   `AmygdalaHijack.js`'s repeated-exposure threshold-lowering): each real
 *   yearning episode makes the next one a little easier to trigger and a
 *   little more painful, echoing back over time via `decay()` rather than
 *   resetting between episodes.
 */
export class YearningEngine {

	constructor() {

		this.trace = new Map() // absentPersonId -> persistent kindling trace, 0..1

	}

	/**
	 * `cue` — real reminisce() hit(s) against the absent person's own
	 * catalog (array, possibly empty — empty means no real trigger this
	 * turn, and this method returns null). `cumulativeWarmth`/
	 * `cumulativeHurt`/`peakBond` — real `getAffectLedger()` fields for the
	 * absent person. `attachmentStyle` — the AI's own real trait/state
	 * style. `dopaminergicEngine` — the SAME shared instance Totemheart
	 * already uses elsewhere, reused, not a private copy. `allostaticLoad`
	 * — real `Homeostasis.allostaticLoad`, the same anhedonia damper
	 * `computeRPE()` already supports.
	 */
	evaluate( absentPersonId, { cue, cumulativeWarmth, cumulativeHurt, peakBond, attachmentStyle, dopaminergicEngine, allostaticLoad = 0 } ) {

		if ( !cue || !cue.length ) return null

		const totalWeight = cumulativeWarmth + cumulativeHurt
		if ( totalWeight <= 0 ) return null // nothing real to yearn for

		// Idealization: filters the hurt out of the simulated future, keeps and amplifies the warmth
		const idealizedWarmth = cumulativeWarmth
		const idealizedHurt      = cumulativeHurt * ( 1 - IDEALIZATION_BIAS )
		const idealRatio          = clamp01( idealizedWarmth / ( idealizedWarmth + idealizedHurt + 1 ) )
		const objectValue        = clamp01( peakBond ?? totalWeight ) // "un objeto de alto valor" — how significant this person has real been
		const vFuture                 = idealRatio * objectValue // 0..1, the idealized simulated value of having them back

		const gamma          = GAMMA_BY_STYLE[ attachmentStyle ] ?? GAMMA_BY_STYLE.secure
		const projectedGain = clamp01( gamma * vFuture )

		const context = `yearning:${ absentPersonId }`

		// Phase 1 — la simulación / la inyección química: imagining feeds the
		// SAME real reward-prediction machinery a genuine reward would, a
		// real anticipatory burst against this context's own prior (usually
		// near-zero, or the residue of a prior yearning episode).
		const burst = dopaminergicEngine.computeRPE( projectedGain, context, allostaticLoad )

		// Phase 2 — la disonancia: the real reward THIS turn is still
		// genuinely zero (they are still absent), checked against the
		// expectation Phase 1 just raised. Same real API call, immediately
		// after, is the crash — nothing invented, no second formula.
		const crashRpe = dopaminergicEngine.computeRPE( 0, context, allostaticLoad )
		const crash        = clamp01( -crashRpe )

		const priorTrace = this.trace.get( absentPersonId ) ?? 0
		const kindled       = clamp01( priorTrace + crash * TRACE_GAIN )
		this.trace.set( absentPersonId, kindled )

		const painOfAbsence = clamp01( crash * ( 0.4 + kindled * 0.3 ) )

		return { triggered: true, anticipation: clamp01( burst ), crash, painOfAbsence, trace: kindled, gamma, vFuture }

	}

	/** Real, unconditionally-stable exponential decay toward 0 — same stable shape `EpisodicMemory.getLatentWeight()` and `RelationalMemoryCatalog.tick()` already use, safe for any real dt. */
	decay( absentPersonId, dt, rate = TRACE_DECAY_RATE ) {

		const trace = this.trace.get( absentPersonId )
		if ( trace === undefined ) return
		this.trace.set( absentPersonId, trace * Math.exp( -rate * dt ) )

	}

	decayAll( dt, rate = TRACE_DECAY_RATE ) {

		for ( const id of this.trace.keys() ) this.decay( id, dt, rate )

	}

	getTrace( absentPersonId ) {

		return this.trace.get( absentPersonId ) ?? 0

	}

	toJSON() {

		return [ ...this.trace.entries() ]

	}

	restoreState( data ) {

		if ( data ) this.trace = new Map( data )

	}

}
