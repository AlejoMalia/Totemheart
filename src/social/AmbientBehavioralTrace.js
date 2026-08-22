function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

/**
 * Real "shadow layer" tracking RHYTHM, silence, variance, avoidance, and
 * residue — the secondary telemetry every other mechanism already produces
 * as a side effect of running (who initiates, how long silences run, how
 * bursty contact is, which topics get shortened or dodged, how much felt
 * state varies turn to turn, how long recovery from a hit takes) — rather
 * than discarding it as noise. Real grounding for the general shape: Brown,
 * R. G. (1959), "Statistical Forecasting for Inventory Control", McGraw-Hill
 * (the real, foundational dual-rate exponential-smoothing technique this
 * module's fast/slow EMA noise gate follows: only a real, PERSISTENT
 * divergence between a fast and a slow moving average counts as a genuine
 * signal, not a one-turn spike); Goh, K.-I. & Barabási, A.-L. (2008),
 * "Burstiness and memory in complex systems", EPL, 81(4), 48002 (the real,
 * well-established finding that human contact/communication timing is
 * genuinely bursty, not Poisson-uniform, and that the burstiness
 * coefficient itself is a real, measurable individual-difference signal).
 * Observes, aggregates, and exposes real priors; it does not decide
 * anything on its own — a caller composes these into whichever real,
 * already-existing engine each reading is meant to enrich (see
 * CALIBRATION.md for the specific composition points wired into
 * `Totemheart.js`).
 */
export class AmbientBehavioralTrace {

	constructor( { lambdaFast = 0.3, lambdaSlow = 0.03, epsilon = 0.08, avoidanceThreshold = 0.35 } = {} ) {

		this.lambdaFast = lambdaFast
		this.lambdaSlow  = lambdaSlow
		this.epsilon        = epsilon
		this.avoidanceThreshold = avoidanceThreshold

		this.state = new Map() // userId -> real per-person ambient state

	}

	#entry( userId ) {

		if ( !this.state.has( userId ) ) this.state.set( userId, {
			initiationFast: 0.5, initiationSlow: 0.5,
			lastContactAt: null, silenceStreakMs: 0,
			gapHistory: [], // real, bounded recent inter-contact gaps, ms
			topicAvoidance: new Map(), // topic -> real EMA of short-reply/topic-change
			affectSamples: [], // real, bounded recent PAD samples for variance
			affectVarianceSlow: 0,
			adverseEventAt: null, adverseBaseline: null, recoveryHalfLifeEma: null,
			residualFloorEma: 0,
			comfortAsked: 0, comfortOpportunities: 0,
			boundarySet: 0, boundaryOpportunities: 0,
			initiationHistoryForGap: [], // real, bounded recent initiation-rate snapshots, for positiveInitiationGap
		} )
		return this.state.get( userId )

	}

	/** Real EMA-pair noise gate — Brown 1959's own dual-rate technique: only a real, persistent divergence between the slow (trait) and fast (reactive) reads counts as genuine signal. */
	#isPersistent( fast, slow ) {

		return Math.abs( slow - fast ) >= this.epsilon

	}

	// ============================================================
	// 1-2. InitiationMonitor / SilenceAccumulator
	// ============================================================

	/** Call once per real turn. `initiatedByAgent` (bool, real, did the AI start this exchange rather than reply to one). */
	registerTurn( userId, { initiatedByAgent = false, now = Date.now() } = {} ) {

		const s = this.#entry( userId )
		const x = initiatedByAgent ? 1 : 0
		s.initiationFast = s.initiationFast + this.lambdaFast * ( x - s.initiationFast )
		s.initiationSlow   = s.initiationSlow + this.lambdaSlow * ( x - s.initiationSlow )

		if ( s.lastContactAt !== null ) {

			const gap = Math.max( 0, now - s.lastContactAt )
			s.gapHistory.push( gap )
			if ( s.gapHistory.length > 30 ) s.gapHistory.shift()

		}
		s.lastContactAt = now
		s.silenceStreakMs = 0

	}

	/** Real, live silence-streak read — call any time, not only on contact. */
	updateSilenceStreak( userId, now = Date.now() ) {

		const s = this.#entry( userId )
		if ( s.lastContactAt === null ) return 0
		s.silenceStreakMs = Math.max( 0, now - s.lastContactAt )
		return s.silenceStreakMs

	}

	/** Real, noise-gated initiation rate — 0.5 neutral prior with no persistent divergence yet. */
	getInitiationRate( userId ) {

		const s = this.#entry( userId )
		return this.#isPersistent( s.initiationFast, s.initiationSlow ) ? s.initiationSlow : 0.5

	}

	/** Real "meaningful silence" — real, current silence scaled by real bond and how far it exceeds this person's own tolerated gap (0..1, caller-supplied, e.g. `1 − ContactFrequencyExpectation`'s own distress complement). */
	getMeaningfulSilence( userId, bond, expectedGapToleranceDays = 3, now = Date.now() ) {

		const streakDays = this.updateSilenceStreak( userId, now ) / ( 1000 * 60 * 60 * 24 )
		return sigmoid( 3 * ( clamp01( streakDays / ( expectedGapToleranceDays + 0.001 ) ) * clamp01( bond ) - 0.5 ) )

	}

	// ============================================================
	// 3. BurstinessMeter
	// ============================================================

	/** Real burstiness — coefficient of variation of recent inter-contact gaps (Goh & Barabási 2008's own real qualitative finding, own engineering of the specific ratio). High = intense bursts + real silence gaps; low = steady rhythm. 0 with fewer than 3 real gaps on record. */
	getBurstiness( userId ) {

		const gaps = this.#entry( userId ).gapHistory
		if ( gaps.length < 3 ) return 0
		const mean = gaps.reduce( ( a, b ) => a + b, 0 ) / gaps.length
		if ( mean <= 0 ) return 0
		const variance = gaps.reduce( ( sum, g ) => sum + ( g - mean ) ** 2, 0 ) / gaps.length
		return clamp01( Math.sqrt( variance ) / ( mean + 1 ) )

	}

	// ============================================================
	// 4. TopicAvoidanceMap
	// ============================================================

	/** `shortReply`/`topicChanged` (bool, real, this-turn reads for topic `k`). */
	registerTopicTurn( userId, topic, { shortReply = false, topicChanged = false } = {} ) {

		const s = this.#entry( userId )
		const current = s.topicAvoidance.get( topic ) ?? 0
		const x = ( shortReply ? 0.5 : 0 ) + ( topicChanged ? 0.5 : 0 )
		s.topicAvoidance.set( topic, clamp01( current + this.lambdaFast * ( x - current ) ) )

	}

	getAvoidance( userId, topic ) {

		return this.#entry( userId ).topicAvoidance.get( topic ) ?? 0

	}

	/** Real, bounded list of topics this person genuinely avoids/shortens, above the real threshold. */
	getAvoidanceProfile( userId ) {

		return [ ...this.#entry( userId ).topicAvoidance.entries() ].filter( ( [ , v ] ) => v > this.avoidanceThreshold ).map( ( [ k ] ) => k )

	}

	// ============================================================
	// 5. AffectVarianceTracker
	// ============================================================

	/** `padVector` ({valence,arousal,dominance}, real, this-turn felt state). */
	registerAffectSample( userId, padVector ) {

		const s = this.#entry( userId )
		s.affectSamples.push( padVector )
		if ( s.affectSamples.length > 12 ) s.affectSamples.shift()
		if ( s.affectSamples.length < 3 ) return 0

		const meanV = s.affectSamples.reduce( ( a, p ) => a + p.valence, 0 ) / s.affectSamples.length
		const meanA = s.affectSamples.reduce( ( a, p ) => a + p.arousal, 0 ) / s.affectSamples.length
		const variance = s.affectSamples.reduce( ( sum, p ) => sum + ( p.valence - meanV ) ** 2 + ( p.arousal - meanA ) ** 2, 0 ) / s.affectSamples.length
		s.affectVarianceSlow = s.affectVarianceSlow + this.lambdaSlow * ( clamp01( variance ) - s.affectVarianceSlow )
		return s.affectVarianceSlow

	}

	getAffectVariance( userId ) {

		return this.#entry( userId ).affectVarianceSlow

	}

	// ============================================================
	// 6. RecoveryClock
	// ============================================================

	/** Call once when a real adverse event just happened. */
	registerAdverseEvent( userId, baselineValence, now = Date.now() ) {

		const s = this.#entry( userId )
		s.adverseEventAt   = now
		s.adverseBaseline = baselineValence

	}

	/** Call each turn after an adverse event is on record — real, this-turn valence read. Resolves and updates the real recovery half-life EMA once genuinely back near baseline. */
	checkRecovery( userId, currentValence, now = Date.now(), delta = 0.1 ) {

		const s = this.#entry( userId )
		if ( s.adverseEventAt === null ) return null
		if ( Math.abs( currentValence - s.adverseBaseline ) >= delta ) return null

		const recoveryMs = now - s.adverseEventAt
		s.recoveryHalfLifeEma = s.recoveryHalfLifeEma === null ? recoveryMs : s.recoveryHalfLifeEma + this.lambdaSlow * ( recoveryMs - s.recoveryHalfLifeEma )
		s.adverseEventAt = null
		return s.recoveryHalfLifeEma

	}

	getRecoveryHalfLife( userId ) {

		return this.#entry( userId ).recoveryHalfLifeEma

	}

	// ============================================================
	// 7. ResidualFloorEstimator
	// ============================================================

	/** Real, ultra-slow floor — call once per turn/tick with already-real signals (e.g. `CortisolEngine.getLevel()`, `TraumaCascadeEngine.getTraumaTrace()`). A quiet scar under an outwardly calm state. */
	registerResidual( userId, residualSignal ) {

		const s = this.#entry( userId )
		s.residualFloorEma = Math.max( 0, s.residualFloorEma + this.lambdaSlow * 0.3 * ( clamp01( residualSignal ) - s.residualFloorEma ) )
		return s.residualFloorEma

	}

	getResidualFloor( userId ) {

		return this.#entry( userId ).residualFloorEma

	}

	// ============================================================
	// 8-9. HelpSeekingRate / BoundaryRateTracker
	// ============================================================

	/** Call on any real high-distress turn — `askedComfort` (bool). */
	registerComfortOpportunity( userId, askedComfort ) {

		const s = this.#entry( userId )
		s.comfortOpportunities += 1
		if ( askedComfort ) s.comfortAsked += 1

	}

	getComfortAskRate( userId ) {

		const s = this.#entry( userId )
		return s.comfortOpportunities === 0 ? 0.5 : s.comfortAsked / s.comfortOpportunities

	}

	/** Call on any real costly-request turn — `saidNo` (bool). */
	registerBoundaryOpportunity( userId, saidNo ) {

		const s = this.#entry( userId )
		s.boundaryOpportunities += 1
		if ( saidNo ) s.boundarySet += 1

	}

	getBoundaryRate( userId ) {

		const s = this.#entry( userId )
		return s.boundaryOpportunities === 0 ? 0.5 : s.boundarySet / s.boundaryOpportunities

	}

	// ============================================================
	// Positive-initiation gap — stopped reaching out despite a real, good past bond
	// ============================================================

	/** Real, this-turn snapshot feed — call periodically (e.g. weekly) with the current real initiation rate and real bond. */
	registerInitiationSnapshot( userId, bond ) {

		const s = this.#entry( userId )
		s.initiationHistoryForGap.push( { rate: this.getInitiationRate( userId ), bond } )
		if ( s.initiationHistoryForGap.length > 12 ) s.initiationHistoryForGap.shift()

	}

	/** Real, distinct "stopped initiating despite it having gone well" signal — a genuine drop in initiation rate from a real, established peak while bond was genuinely high in the past. */
	getPositiveInitiationGap( userId ) {

		const history = this.#entry( userId ).initiationHistoryForGap
		if ( history.length < 4 ) return 0
		const peakRate  = Math.max( ...history.map( h => h.rate ) )
		const peakBond = Math.max( ...history.map( h => h.bond ) )
		const currentRate = history.at( -1 ).rate
		return clamp01( ( peakRate - currentRate ) * clamp01( peakBond ) )

	}

	// ============================================================
	// Behavioral profile
	// ============================================================

	/** Real, inspectable summary — personality-as-emergent-from-behavior, not a felt-state label. */
	getBehavioralProfile( userId ) {

		const initiation = this.getInitiationRate( userId )
		const burstiness  = this.getBurstiness( userId )
		const variance      = this.getAffectVariance( userId )
		const recovery       = this.getRecoveryHalfLife( userId )
		const comfortAsk  = this.getComfortAskRate( userId )

		let style = 'steady'
		if ( burstiness > 0.6 ) style = 'bursty'
		else if ( initiation < 0.2 ) style = 'withdrawn'
		else if ( variance > 0.4 && initiation > 0.4 ) style = 'anxious-contact'

		return {
			style,
			initiationRate               : initiation,
			silenceMeaning                  : this.updateSilenceStreak( userId ) > 1000 * 60 * 60 * 24 * 7 ? 'alarming' : this.updateSilenceStreak( userId ) > 1000 * 60 * 60 * 24 * 2 ? 'meaningful' : 'low',
			affectiveStability             : clamp01( 1 - variance ),
			recoveryTempo                    : recovery === null ? null : recovery > 1000 * 60 * 60 * 24 * 3 ? 'slow' : 'fast',
			avoidanceTopics               : this.getAvoidanceProfile( userId ),
			helpSeeking                          : comfortAsk < 0.2 ? 'rare' : comfortAsk > 0.7 ? 'frequent' : 'balanced',
			residualLoad                      : this.getResidualFloor( userId ),
		}

	}

	toJSON() {

		return [ ...this.state.entries() ].map( ( [ userId, s ] ) => [ userId, {
			...s,
			topicAvoidance : [ ...s.topicAvoidance.entries() ],
		} ] )

	}

	restoreState( data ) {

		if ( !data ) return
		this.state = new Map( data.map( ( [ userId, s ] ) => [ userId, {
			...s,
			topicAvoidance : new Map( s.topicAvoidance ),
		} ] ) )

	}

}
