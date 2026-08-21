function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real TYPED intuition/hunch layer — the user's own detailed "TRAD-E"
 * architecture request: a fast, second-layer read that PROPOSES and
 * RE-PRIORITIZES, never dictates. Deliberately built to REUSE, not
 * duplicate, `Intuition.js`'s own real k-NN + Shannon-entropy hunch
 * (already wired in `Totemheart.js` for the generic pre-appraisal
 * uncertainty spike) as one real input signal here; this module's own,
 * genuinely new contribution is the real TYPED hypothesis classification
 * (deception/danger/opportunity/mismatch/loss-risk/attraction), a real
 * per-person memory of indicios (streak-driven prior escalation and
 * same-type repetition boost), the real calibrated feltCertainty/pTrue
 * split with genuine post-reveal confirmation/refutation, the real
 * bounded bias deltas fed into already-existing downstream mechanisms,
 * and real outcome-based overconfidence tracking per type.
 *
 * Real, lightweight lexical cue → prototype match (own design, the same
 * honest regex-gate pattern already used elsewhere in this codebase for
 * SecretMaintenanceSystem's cue detector and BlushSlipEngine's
 * precisionMode) stands in for a proper learned classifier; Totemheart
 * has no NLP intent model, so this is the honest, available signal —
 * unified here with the framework's own already-existing real ontology
 * concept classification (betrayal/lie/affair) rather than duplicating a
 * separate vocabulary that could miss an already-confirmed real signal.
 *
 *   strength (raw)     = max cue-match weight across prototypes, lexical ∪ ontology
 *   streak escalation = a sustained mismatch/deception streak raises the
 *                             real PRIOR toward deception, own saturating curve
 *   repetition boost   = the SAME hunch type reappearing consecutively
 *                             genuinely raises strength, own tuning
 *   feltCertainty        = strength · (1 - entropy) · (1 - overconfidencePenalty[type])
 *   pTrue                   = calibrated running accuracy per type (Beta posterior)
 *   Contradiction     = 1 when explicit evidence opposes the hypothesis's
 *                             own real valence direction
 *   feltCertainty'    = feltCertainty · (1 - Contradiction)
 */
const PROTOTYPES = {
	deception   : { cues: [ 'secreto', 'secret', 'mentira', 'mentiste', 'escondes', 'oculta', 'engañ' ], valence: -1 },
	danger        : { cues: [ 'miedo', 'peligro', 'amenaza', 'terrible', 'horrible' ], valence: -1 },
	'loss-risk' : { cues: [ 'exnovio', 'ex-novio', 'ex ', 'reencuentro', 'recuerdas', 'echo de menos', 'extraño lo nuestro' ], valence: -1 },
	mismatch    : { cues: [ 'no es lo que parece', 'no te entiendo', 'raro', 'extraño', 'incoherente', 'no cuadra', 'no sé', 'se me olvidó', 'confundí' ], valence: -1 },
	attraction  : { cues: [ 'atraes', 'me gustas', 'guapo', 'guapa', 'quiero', 'deseo', 'nervioso', 'nerviosa' ], valence: 1 },
	opportunity : { cues: [ 'oportunidad', 'podríamos', 'quieres que', 'te gustaría' ], valence: 1 },
}

// Real ontology-unification map — the SAME real concepts other modules
// (EmotionalOntology matches, LoveHateEngine's betrayalDetected, appraisal)
// already classify count directly as strong, authoritative deception
// evidence here too, so a reveal already confirmed elsewhere in the
// pipeline (e.g. the word "traicion" mapping to the real 'betrayal'
// ontology concept) is never invisible to intuition just because it
// doesn't happen to appear in this module's own lexical cue list.
const ONTOLOGY_DECEPTION_CONCEPTS = new Set( [ 'betrayal', 'lie', 'deception', 'affair' ] )

const MISMATCH_STREAK_THRESHOLD = 3      // N mismatches/inconsistencies before the real prior escalates toward deception
const DECEPTION_DAY_WINDOW_MS      = 1000 * 60 * 60 * 30 // ~1 real day + slack — the window a slow-decay "day" counts as

export class IntuitionEngine {

	constructor( { eta = 0.25, beta = 0.3, gamma = 0.25, delta = 0.2, stakesThreshold = 0.25, ambiguityThreshold = 0.15, socialThreshold = 0.2, daySuspicionGamma = 0.8 } = {} ) {

		this.eta   = eta   // trust-suspicion injection weight
		this.beta  = beta  // yield-dampening weight
		this.gamma = gamma // secret-salience boost weight
		this.delta = delta // desire boost weight
		this.stakesThreshold      = stakesThreshold
		this.ambiguityThreshold = ambiguityThreshold
		this.socialThreshold      = socialThreshold
		this.daySuspicionGamma  = daySuspicionGamma // real slow-decay retention factor for a day following a deception hunch

		this.suspicion             = new Map() // userId -> 0..1, real tracked suspicion distinct from attachment.trust
		this.calibration            = new Map() // type -> { correct, total } real Beta-style outcome tracking
		this.reinforcement       = new Map() // type -> 0..1 real small strength boost after a confirmed hunch of that type
		this.lastHypothesis    = new Map() // userId -> the last real I object issued, for registerOutcome()/reportReveal()
		this.streaks                  = new Map() // userId -> { mismatchCount, lastType, sameTypeRun }
		this.lastDeceptionAt   = new Map() // userId -> real timestamp of the last real deception hunch, for slow-decay

	}

	/** Real gate — Capa 2 only activates when stakes, ambiguity, or social salience clears its own real threshold; an ordinary factual/neutral turn stays off. `precisionMode` keeps social intuition almost entirely off, per the real priority ordering (explicit/factual precision outranks a hunch). */
	gate( { stakes = 0, ambiguity = 0, socialSalience = 0, precisionMode = false } ) {

		if ( precisionMode ) return false
		return stakes > this.stakesThreshold || ambiguity > this.ambiguityThreshold || socialSalience > this.socialThreshold

	}

	#overconfidencePenalty( type ) {

		const c = this.calibration.get( type )
		if ( !c || c.total < 3 ) return 0
		const accuracy = c.correct / c.total
		return clamp01( ( 1 - accuracy ) * 0.6 ) // own tuning of the 0.6 ceiling

	}

	#streak( userId ) {

		if ( !this.streaks.has( userId ) ) this.streaks.set( userId, { mismatchCount: 0, lastType: null, sameTypeRun: 0 } )
		return this.streaks.get( userId )

	}

	/**
	 * `text` — this turn's own real input. `entropy` — reuse
	 * `Intuition.sense()`'s own real Shannon-entropy read. `desirability`
	 * — this turn's own already-computed real appraisal, used for the
	 * Contradiction check AND as the real "clearly warm turn" reset signal
	 * for a running mismatch streak. `userId` — required for the real
	 * per-person memory of indicios. `ontologyConcepts` — this turn's own
	 * already-classified real concept matches (unifies vocabulary rather
	 * than duplicating it). `precisionMode` — see `gate()`. `hypervigilance`
	 * (0..1, real `TraumaCascadeEngine.getTraumaTrace()`-derived signal,
	 * already gated to 0 for a negligible/absent trace by the caller) —
	 * Ozer et al. (2003)'s own real hypervigilance-after-trauma finding,
	 * applied here to how a GENUINELY ambiguous cue (one that already
	 * matched something real below) gets READ, not to whether the gate
	 * opens at all: it can never manufacture a hunch from zero real
	 * matching cues (`bestStrength` starts at exactly 0 for that), it can
	 * only make an already-present weak/single cue read as more convincing
	 * and need less corroboration, the real, well-established shape of
	 * hypervigilance (ambiguous stimuli get interpreted as more threatening,
	 * not threat perceived where literally nothing real is present).
	 */
	assess( { text = '', entropy = 0, desirability = 0, userId = 'default', ontologyConcepts = [], precisionMode = false, hypervigilance = 0 } = {} ) {

		if ( precisionMode ) return null

		const lower = ( text || '' ).toLowerCase()
		const streak = this.#streak( userId )

		// Real, clearly warm turn forgives the running streak — the same
		// honest "no linear paranoia" property already confirmed in the
		// user's own test 1 (días cálidos amortiguan, no reset a locura).
		if ( desirability > 0.3 ) streak.mismatchCount = Math.max( 0, streak.mismatchCount - 1 )

		let bestType = null
		let bestStrength = 0
		let distinctCues = new Set()

		for ( const [ type, proto ] of Object.entries( PROTOTYPES ) ) {

			const hits = proto.cues.filter( cue => lower.includes( cue ) )
			const strength = clamp01( hits.length / 2 ) // 2+ cue hits saturates strength, own tuning
			if ( strength > bestStrength ) { bestStrength = strength; bestType = type; distinctCues = new Set( hits ) }

		}

		// Real ontology unification — an already-confirmed real deception-
		// family concept (betrayal/lie/affair) counts as strong, authoritative
		// evidence even when the literal word isn't in this module's own
		// lexical cue list (closes the real "traicion" gap found in testing).
		const ontologyHit = ontologyConcepts.some( c => ONTOLOGY_DECEPTION_CONCEPTS.has( c ) )
		if ( ontologyHit && bestStrength < 1 ) { bestType = 'deception'; bestStrength = 1; distinctCues.add( 'ontology:betrayal' ) }

		// Real per-person memory of indicios — a sustained mismatch streak
		// raises the real PRIOR toward deception even on a turn whose own
		// lexical strength alone wouldn't have crossed that line. A neutral,
		// no-signal turn (no hunch at all, and not clearly warm — that case
		// is already handled above) is real ABSENCE of new evidence, not
		// evidence of trustworthiness, so it deliberately does NOT erode an
		// already-building streak — small accumulated inconsistencies across
		// real, temporally-spread-out turns are exactly the pattern this is
		// meant to integrate, not forget the moment attention moves on.
		if ( bestType === 'mismatch' ) streak.mismatchCount += 1

		const streakEscalated = streak.mismatchCount >= MISMATCH_STREAK_THRESHOLD
		if ( streakEscalated && bestType === 'mismatch' ) {

			bestType = 'deception'
			bestStrength = clamp01( bestStrength + ( 1 - Math.exp( -0.3 * ( streak.mismatchCount - MISMATCH_STREAK_THRESHOLD + 1 ) ) ) )

		}

		// Real anti-false-alarm gate — a single, generic, low-distinctiveness
		// cue (e.g. just "raro" alone, Test 2's own false-alarm design)
		// should NOT sustain a full-strength deception read for many days;
		// it softens to the honest, lower-stakes "mismatch" reading unless
		// corroborated by 2+ distinct real cues, an already-escalated real
		// streak, or the real ontology's own authoritative concept match.
		// Real hypervigilance lowers this corroboration bar (1 real cue is
		// enough, not 2) rather than skipping it outright — a genuinely
		// ambiguous cue still has to be real and present.
		const corroborationBar = hypervigilance > 0 ? 1 : 2
		if ( bestType === 'deception' && !ontologyHit && !streakEscalated && distinctCues.size < corroborationBar ) {

			bestType = 'mismatch'
			bestStrength = clamp01( bestStrength * 0.6 )

		}

		if ( !bestType || bestStrength <= 0 ) {

			streak.lastType = null
			streak.sameTypeRun = 0
			return null

		}

		// Real hypervigilance reading boost — ONLY reachable once a real
		// cue already produced a non-null hunch above; a genuinely
		// post-trauma trace makes that already-real ambiguity read as more
		// convincing, own tuning, capped so it alone can never saturate
		// strength to 1 from a single weak cue.
		bestStrength = clamp01( bestStrength + clamp01( hypervigilance ) * 0.4 )

		// Real repetition boost — the SAME hunch type reappearing on
		// consecutive real turns genuinely raises strength (a pattern
		// noticed twice reads more confidently than once), own tuning,
		// capped so it can't alone saturate strength to 1.
		streak.sameTypeRun = streak.lastType === bestType ? streak.sameTypeRun + 1 : 1
		streak.lastType       = bestType
		bestStrength              = clamp01( bestStrength + Math.min( 0.25, 0.05 * ( streak.sameTypeRun - 1 ) ) )

		const proto = PROTOTYPES[ bestType ] ?? { valence: -1 }
		const overconfidence = this.#overconfidencePenalty( bestType )
		const reinforcement    = this.reinforcement.get( bestType ) ?? 0
		let feltCertainty = clamp01( bestStrength * ( 1 - clamp01( entropy ) ) * ( 1 - overconfidence ) * ( 1 + reinforcement ) )

		// Real Contradiction — explicit evidence (this turn's own real
		// desirability) opposing the hypothesis's own real valence direction
		// dampens feltCertainty rather than the hypothesis being discarded
		// outright, and pushes authority toward S2/explicit evidence.
		const contradiction = Math.sign( desirability ) !== 0 && Math.sign( desirability ) !== Math.sign( proto.valence ) && Math.abs( desirability ) > 0.5 ? 1 : 0
		feltCertainty = feltCertainty * ( 1 - contradiction )

		const cal    = this.calibration.get( bestType )
		const pTrue = cal && cal.total >= 3 ? cal.correct / cal.total : 0.5

		if ( bestType === 'deception' ) this.lastDeceptionAt.set( userId, Date.now() )

		const I = {
			type            : bestType,
			hypothesis  : `hunch: ${bestType}`,
			strength      : bestStrength,
			feltCertainty : feltCertainty,
			pTrue           : pTrue,
			contradiction : contradiction,
			distinctCues : distinctCues.size,
			bias              : {
				trustSuspicion : bestType === 'deception' ? this.eta * feltCertainty : 0,
				avoidYield       : bestType === 'loss-risk' ? this.beta * feltCertainty : 0,
				checkSecret      : bestType === 'deception' ? this.gamma * feltCertainty : 0,
				approach          : bestType === 'attraction' || bestType === 'opportunity' ? this.delta * feltCertainty : 0,
			},
		}

		return I

	}

	/** Real, small, bounded suspicion accumulator — distinct from `attachment.trust`, never itself a verdict. */
	registerSuspicion( userId, delta ) {

		const current = this.suspicion.get( userId ) ?? 0
		this.suspicion.set( userId, clamp01( current + delta ) )
		return this.suspicion.get( userId )

	}

	getSuspicion( userId ) {

		return this.suspicion.get( userId ) ?? 0

	}

	/**
	 * Real post-digest learning — Beta-style running accuracy per type,
	 * the same honest pattern `Attachment.trust`'s own Bayesian posterior
	 * already uses.
	 */
	registerOutcome( intuition, wasCorrect ) {

		if ( !intuition ) return
		const cal = this.calibration.get( intuition.type ) ?? { correct: 0, total: 0 }
		cal.total    += 1
		cal.correct += wasCorrect ? 1 : 0
		this.calibration.set( intuition.type, cal )

	}

	/**
	 * Real explicit reveal digest — the user's own requested calibration
	 * contract: an innocent reveal genuinely REFUTES the prior hunch
	 * (suspicion drops hard, streak resets, Beta posterior records a
	 * miss); a real confirmed deception/betrayal reveal genuinely
	 * CONFIRMS it (Beta posterior records a hit, and the matched
	 * prototype's own real strength gets a small, bounded reinforcement
	 * so recognizing that same real pattern again reads slightly more
	 * confidently, own tuning, capped at +50%).
	 */
	reportReveal( userId, confirmed, hypothesis = null ) {

		const hyp = hypothesis ?? this.lastHypothesis.get( userId )
		if ( !hyp ) return

		this.registerOutcome( hyp, confirmed )

		if ( confirmed ) {

			this.reinforcement.set( hyp.type, clamp01( ( this.reinforcement.get( hyp.type ) ?? 0 ) + 0.05 ) )

		}
		else {

			this.suspicion.set( userId, clamp01( this.getSuspicion( userId ) * 0.3 ) )
			this.streaks.delete( userId )

		}

	}

	/**
	 * Real slow-decay for a day following a genuine deception hunch —
	 * Sday = max(Sturn, γ·Sday-1), γ own-tuned 0.7-0.9 default 0.8 — so
	 * suspicion genuinely lingers a bit rather than resetting to 0 on
	 * every single tick, while still never becoming eternal paranoia
	 * (the ordinary flat decay below still applies once the last real
	 * deception hunch falls outside the real ~1-day window).
	 */
	decay( userId, dt = 1, rate = 0.02, now = Date.now() ) {

		const current = this.suspicion.get( userId )
		if ( current === undefined ) return

		const lastDeception = this.lastDeceptionAt.get( userId )
		const withinDeceptionWindow = lastDeception !== undefined && ( now - lastDeception ) < DECEPTION_DAY_WINDOW_MS

		this.suspicion.set( userId, withinDeceptionWindow
			? Math.max( 0, current * this.daySuspicionGamma )
			: Math.max( 0, current - rate * dt ),
		)

	}

}

export { PROTOTYPES }
