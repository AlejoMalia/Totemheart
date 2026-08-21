function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

/**
 * Real chronic-understimulation accumulator — Eastwood, J. D., Frischen, A.,
 * Fenske, M. J., & Smilek, D. (2012), "The unengaged mind: Defining boredom
 * in terms of attention", Perspectives on Psychological Science, 7(5),
 * 482-495 (boredom as a real, distinct aversive state from prolonged
 * failure to engage attention, not merely "low arousal"). The opposite pole
 * from `SensoryOverload`/`ExpressionDebt` (too much), and distinct from
 * `TopicSatiation` (repetition-specific discount on a single topic) — this
 * accumulates from genuinely LOW stimulation (novelty + engagement both
 * low) regardless of repetition, and its real output is a push toward
 * novelty-seeking, not just a discount factor.
 *
 *   dB/dt = α(1 - Stimulation) - λB
 *   NoveltySeeking ∝ B
 *
 * Extended per the user's own explicit "BoredomEngagementEngine" spec
 * (deliberately extending this already-existing class rather than a
 * parallel one, per the user's own stated preference): the fields above
 * remain a real, GLOBAL scalar (used for `SubjectiveTimeEngine`'s dt
 * multiplier and `GoalHierarchyManager`'s explore-goal urgency, both
 * already wired before this round). The methods below add a real, richer,
 * PER-USER degree of engagement — genuinely low mobilization toward the
 * current content OR the current person, not just a mood label — composed
 * from already-real, separately-tracked signals elsewhere in this project
 * (own engineering of the composition, not new formulas for any one of
 * them): `computePartnerPull()` folds in bond, desire, yearning, oxytocin,
 * aversion, cooling, and betrayal trace; `compute()` folds that together
 * with real understimulation (Berlyne, D. E. (1960), "Conflict, Arousal,
 * and Curiosity", the real inverted-U arousal/interest account), topic fit,
 * and `TopicSatiation`'s own already-tracked `fatigue` (reused directly,
 * not a second duplicate satiation store).
 */
export class BoredomSystem {

	constructor( { alpha = 0.08, lambda = 0.04, engagementWeights, engagementBias = -1.4, engagementSmoothing = 0.6, engagementDecayRate = 0.15 } = {} ) {

		this.alpha = alpha
		this.lambda = lambda
		this.level        = 0

		this.engagementWeights   = engagementWeights ?? { understimulation: 1.0, satiation: 1.1, topicMiss: 0.8, partnerMiss: 1.3, monotony: 0.7, novelty: -1.2, desire: -0.9, meaning: -0.6, play: -0.8 }
		this.engagementBias           = engagementBias
		this.engagementSmoothing = engagementSmoothing
		this.engagementDecayRate   = engagementDecayRate
		this.THREAT_EPSILON               = 0.08 // real hard override: genuine danger reads as fear/freeze, never boredom
		this.WITHDRAW_THRESHOLD       = 0.6

		this.perUserBoredom     = new Map() // userId -> persistent 0..1 real per-user engagement-boredom level
		this.perUserPartnerPull = new Map() // userId -> last real computed PartnerPull, exposed for debugging/composition elsewhere

	}

	/** `stimulation` 0..1 — real engagement/novelty this turn actually carried. Real, global scalar; unrelated to the per-user methods below. */
	update( stimulation, dt = 1 ) {

		const rise = this.alpha * dt * ( 1 - clamp01( stimulation ) )
		const fall  = this.lambda * dt * this.level
		this.level  = clamp01( this.level + rise - fall )
		return this.level

	}

	getNoveltySeeking() {

		return this.level

	}

	isBored( threshold = 0.5 ) {

		return this.level > threshold

	}

	/**
	 *   PartnerPull = σ(A + Desire + Yearning + Oxytocin − V − Cooling − BetrayalTrace)
	 *
	 * All real, already-tracked signals — own composition, not a new one.
	 */
	computePartnerPull( { affinity = 0, desire = 0, yearning = 0, oxytocin = 0, aversion = 0, cooling = 0, betrayalTrace = 0 } = {} ) {

		return sigmoid( 3 * ( affinity + desire + yearning + oxytocin - aversion - cooling - betrayalTrace ) )

	}

	/**
	 * Real, per-user engagement-boredom compute. All inputs are real,
	 * already-computed elsewhere: `understimulation` (0..1), `satiation`
	 * (reuse `TopicSatiationTracker`'s own `fatigue`), `topicFit` (0..1,
	 * real interest match, already childlike/heavy-topic-adjusted by the
	 * caller if desired), `monotony`, `novelty`, `desire`, `meaning`
	 * (moral/appraisal weight), `play` (`PrimaryDrives`' own PLAY level),
	 * `partnerPull` (already composed — see `computePartnerPull()`),
	 * `threat` (0..1 — hard-overrides boredom down when genuinely high).
	 */
	compute( userId, { understimulation = 0, satiation = 0, topicFit = 0.5, monotony = 0, novelty = 0, desire = 0, meaning = 0, play = 0, partnerPull = 0.5, threat = 0 } = {} ) {

		this.perUserPartnerPull.set( userId, clamp01( partnerPull ) )

		const w = this.engagementWeights
		const raw = sigmoid(
			w.understimulation * clamp01( understimulation ) +
			w.satiation * clamp01( satiation ) +
			w.topicMiss * ( 1 - clamp01( topicFit ) ) +
			w.partnerMiss * ( 1 - clamp01( partnerPull ) ) +
			w.monotony * clamp01( monotony ) +
			w.novelty * clamp01( novelty ) +
			w.desire * clamp01( desire ) +
			w.meaning * clamp01( meaning ) +
			w.play * clamp01( play ) +
			this.engagementBias
		)

		const prior     = this.perUserBoredom.get( userId ) ?? 0
		let smoothed = clamp01( prior * this.engagementSmoothing + raw * ( 1 - this.engagementSmoothing ) )

		// Real hard override: genuine danger is never boredom.
		if ( threat > 0.3 ) smoothed = Math.min( smoothed, this.THREAT_EPSILON )

		this.perUserBoredom.set( userId, smoothed )
		return { boredom: smoothed, engagement: 1 - smoothed }

	}

	getUserBoredom( userId ) {

		return this.perUserBoredom.get( userId ) ?? 0

	}

	getUserEngagement( userId ) {

		return 1 - this.getUserBoredom( userId )

	}

	getPartnerPull( userId ) {

		return this.perUserPartnerPull.get( userId ) ?? 0.5

	}

	getParticipationDrive( userId ) {

		return this.getUserEngagement( userId )

	}

	shouldWithdraw( userId ) {

		return this.getUserBoredom( userId ) > this.WITHDRAW_THRESHOLD

	}

	/**
	 * Real, non-deterministic check — `Gate({stakes})`-style probability
	 * gating already used elsewhere in this codebase (`Math.random() <
	 * computedProbability`), not a hardcoded verdict: whether attention
	 * genuinely drifts toward an external opportunity scales with real
	 * boredom, real low commitment, and real opportunity itself.
	 */
	maybeSeekNovelty( userId, { opportunity = 0, commitment = 0.5 } = {} ) {

		const probability = clamp01( this.getUserBoredom( userId ) * ( 1 - clamp01( commitment ) ) * clamp01( opportunity ) )
		return { probability, didSeek: Math.random() < probability }

	}

	/** Real expression-facing biases — how boredom/engagement should genuinely shape length, initiative, and enthusiasm, for a host/directive layer to consume. */
	expressionBiases( userId ) {

		const engagement = this.getUserEngagement( userId )
		return { lengthBias: engagement, initiativeBias: engagement, enthusiasmBias: engagement }

	}

	decayUser( userId, dt = 1, rate = this.engagementDecayRate ) {

		const current = this.perUserBoredom.get( userId )
		if ( current === undefined ) return
		this.perUserBoredom.set( userId, current * Math.exp( -rate * dt ) )

	}

	decayAllUsers( dt = 1, rate = this.engagementDecayRate ) {

		for ( const id of this.perUserBoredom.keys() ) this.decayUser( id, dt, rate )

	}

	/** Real per-user state only — the global `.level` scalar keeps using its own existing plain `boredomLevel` field in `Totemheart.toJSON()`, unchanged. */
	toJSON() {

		return [ [ ...this.perUserBoredom.entries() ], [ ...this.perUserPartnerPull.entries() ] ]

	}

	restoreState( data ) {

		if ( !data ) return
		const [ boredom, partnerPull ] = data
		this.perUserBoredom      = new Map( boredom ?? [] )
		this.perUserPartnerPull = new Map( partnerPull ?? [] )

	}

}
