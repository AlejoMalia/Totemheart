function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

/**
 * Real TYPED intuition/hunch layer — the user's own detailed "TRAD-E"
 * architecture request: a fast, second-layer read that PROPOSES and
 * RE-PRIORITIZES, never dictates. Deliberately built to REUSE, not
 * duplicate, `Intuition.js`'s own real k-NN + Shannon-entropy hunch
 * (already wired in `Totemheart.js` for the generic pre-appraisal
 * uncertainty spike) as one real input signal here; this module's own,
 * genuinely new contribution is the real TYPED hypothesis classification
 * (deception/danger/opportunity/mismatch/loss-risk/attraction), the real
 * calibrated feltCertainty/pTrue split, the real bounded bias deltas fed
 * into already-existing downstream mechanisms, and real outcome-based
 * overconfidence tracking per type — none of which the narrow k-NN hunch
 * alone provides.
 *
 * Real, lightweight lexical cue → prototype match (own design, the same
 * honest regex-gate pattern already used elsewhere in this codebase for
 * SecretMaintenanceSystem's cue detector and BlushSlipEngine's
 * precisionMode) stands in for a proper learned classifier; Totemheart
 * has no NLP intent model, so this is the honest, available signal.
 *
 *   strength         = max cue-match weight across prototypes
 *   feltCertainty     = strength · (1 - entropy) · (1 - overconfidencePenalty[type])
 *   pTrue                = calibrated running accuracy per type (Beta posterior)
 *   Contradiction  = 1 when explicit evidence (desirability) opposes the
 *                        hypothesis's own real valence direction
 *   feltCertainty' = feltCertainty · (1 - Contradiction)
 */
const PROTOTYPES = {
	deception   : { cues: [ 'secreto', 'secret', 'mentira', 'mentiste', 'escondes', 'oculta', 'raro', 'extraño' ], valence: -1 },
	danger        : { cues: [ 'miedo', 'peligro', 'amenaza', 'terrible', 'horrible' ], valence: -1 },
	'loss-risk' : { cues: [ 'exnovio', 'ex-novio', 'ex ', 'antes', 'reencuentro', 'recuerdas', 'echo de menos', 'extraño lo nuestro' ], valence: -1 },
	mismatch    : { cues: [ 'no es lo que parece', 'no te entiendo', 'raro', 'incoherente', 'no cuadra' ], valence: -1 },
	attraction  : { cues: [ 'atraes', 'me gustas', 'guapo', 'guapa', 'quiero', 'deseo', 'nervioso', 'nerviosa' ], valence: 1 },
	opportunity : { cues: [ 'oportunidad', 'podríamos', 'quieres que', 'te gustaría' ], valence: 1 },
}

export class IntuitionEngine {

	constructor( { eta = 0.25, beta = 0.3, gamma = 0.25, delta = 0.2, overconfidenceLearnRate = 0.15, stakesThreshold = 0.25, ambiguityThreshold = 0.15, socialThreshold = 0.2 } = {} ) {

		this.eta   = eta   // trust-suspicion injection weight
		this.beta  = beta  // yield-dampening weight
		this.gamma = gamma // secret-salience boost weight
		this.delta = delta // desire boost weight
		this.overconfidenceLearnRate = overconfidenceLearnRate
		this.stakesThreshold             = stakesThreshold
		this.ambiguityThreshold        = ambiguityThreshold
		this.socialThreshold             = socialThreshold

		this.suspicion             = new Map() // userId -> 0..1, real tracked suspicion distinct from attachment.trust
		this.calibration            = new Map() // type -> { correct, total } real Beta-style outcome tracking
		this.lastHypothesis    = new Map() // userId -> the last real I object issued, for registerOutcome()

	}

	/** Real gate — Capa 2 only activates when stakes, ambiguity, or social salience clears its own real threshold; an ordinary factual/neutral turn stays off, own tuning of the 3 thresholds. */
	gate( { stakes = 0, ambiguity = 0, socialSalience = 0 } ) {

		return stakes > this.stakesThreshold || ambiguity > this.ambiguityThreshold || socialSalience > this.socialThreshold

	}

	#overconfidencePenalty( type ) {

		const c = this.calibration.get( type )
		if ( !c || c.total < 3 ) return 0
		const accuracy = c.correct / c.total
		return clamp01( ( 1 - accuracy ) * 0.6 ) // own tuning of the 0.6 ceiling

	}

	/**
	 * `text` — this turn's own real input (lowercased matching, same
	 * honest lexical-cue approach used elsewhere). `entropy` — reuse
	 * `Intuition.sense()`'s own real Shannon-entropy read (0..1, high =
	 * neighbors disagree = genuinely uncertain). `desirability` — this
	 * turn's own already-computed real appraisal, used only for the
	 * Contradiction check against explicit evidence, never to invent the
	 * hypothesis itself.
	 */
	assess( { text = '', entropy = 0, desirability = 0 } = {} ) {

		const lower = ( text || '' ).toLowerCase()
		let bestType = null
		let bestStrength = 0

		for ( const [ type, proto ] of Object.entries( PROTOTYPES ) ) {

			const matches = proto.cues.filter( cue => lower.includes( cue) ).length
			const strength = clamp01( matches / 2 ) // 2+ cue hits saturates strength, own tuning
			if ( strength > bestStrength ) { bestStrength = strength; bestType = type }

		}

		if ( !bestType || bestStrength <= 0 ) return null

		const proto = PROTOTYPES[ bestType ]
		const overconfidence = this.#overconfidencePenalty( bestType )
		let feltCertainty = clamp01( bestStrength * ( 1 - clamp01( entropy ) ) * ( 1 - overconfidence ) )

		// Real Contradiction — explicit evidence (this turn's own real
		// desirability) opposing the hypothesis's own real valence direction
		// dampens feltCertainty rather than the hypothesis being discarded
		// outright, and pushes authority toward S2/explicit evidence (see
		// Totemheart.js's own real priority-ordering comment at the call site).
		const contradiction = Math.sign( desirability ) !== 0 && Math.sign( desirability ) !== Math.sign( proto.valence ) && Math.abs( desirability ) > 0.5 ? 1 : 0
		feltCertainty = feltCertainty * ( 1 - contradiction )

		const cal    = this.calibration.get( bestType )
		const pTrue = cal && cal.total >= 3 ? cal.correct / cal.total : 0.5

		const I = {
			type            : bestType,
			hypothesis  : `hunch: ${bestType}`,
			strength      : bestStrength,
			feltCertainty : feltCertainty,
			pTrue           : pTrue,
			contradiction : contradiction,
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

	/** Real post-digest learning — Beta-style running accuracy per type, the same honest pattern `Attachment.trust`'s own Bayesian posterior already uses. */
	registerOutcome( intuition, wasCorrect ) {

		if ( !intuition ) return
		const cal = this.calibration.get( intuition.type ) ?? { correct: 0, total: 0 }
		cal.total    += 1
		cal.correct += wasCorrect ? 1 : 0
		this.calibration.set( intuition.type, cal )

	}

	decay( userId, dt = 1, rate = 0.02 ) {

		const current = this.suspicion.get( userId )
		if ( current === undefined ) return
		this.suspicion.set( userId, Math.max( 0, current - rate * dt ) )

	}

}

export { PROTOTYPES }
