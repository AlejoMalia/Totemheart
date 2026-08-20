function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Grief as a real process, not "high sadness". Two honest engineering
 * choices instead of borrowing Kübler-Ross's five stages: (1) the stage
 * model is a popular framing, not an empirically validated sequence — real
 * grief research (Bonanno, G. A. (2004), "Loss, trauma, and human
 * resilience: have we underestimated the human capacity to thrive after
 * extremely aversive events?", American Psychologist, 59(1), 20-28) finds
 * highly variable trajectories, not a fixed order, so no stage machine is
 * built here; (2) what IS well supported and modeled directly is the real
 * SHAPE — a long-tailed, non-monotonic decline (slow power-law fade, not
 * exponential) punctuated by intrusive "waves" long after the initial loss
 * (Zisook, S., & Shear, K. (2009), "Grief and bereavement: what psychiatrists
 * need to know", World Psychiatry, 8(2), 67-74, on grief's protracted,
 * fluctuating course).
 *
 * intensity(t) = G0 · (1 + t/τ)^(−p)   — power-law decay, own choice of p/τ,
 * not fit from a specific dataset — heavier-tailed than CortisolEngine's
 * exponential chronic-stress decay on purpose: grief is modeled as
 * genuinely slower to fade than ordinary stress.
 *
 * Waves are a real Poisson process on top of that decaying base intensity,
 * the same mechanism EpisodicMemory.rollIntrusiveThought() already uses for
 * unresolved-wound intrusions — grief waves are that same real phenomenon,
 * scoped to loss specifically and given their own decaying rate so waves
 * genuinely space out as grief work progresses (own tuning).
 */
export class GriefEngine {

	constructor( { tauMs = 1000 * 60 * 60 * 24 * 14, p = 0.55, waveRateScale = 0.0005 } = {} ) {

		this.tauMs         = tauMs
		this.p                = p
		this.waveRateScale = waveRateScale
		this.griefs           = new Map() // userId -> { G0, startedAt, wavesCount, sourceId }

	}

	/** A loss just happened — `lostValue` (0..1) is real magnitude already computed elsewhere (a bond's affinity, a memory's importance). */
	triggerLoss( userId, lostValue, sourceId = null, now = Date.now() ) {

		const existing  = this.griefs.get( userId )
		const carryOver = existing ? this.getIntensity( userId, now ) : 0
		this.griefs.set( userId, { G0: clamp01( carryOver + lostValue ), startedAt: now, wavesCount: existing?.wavesCount ?? 0, sourceId } )
		return this.griefs.get( userId )

	}

	getIntensity( userId, now = Date.now() ) {

		const g = this.griefs.get( userId )
		if ( !g ) return 0
		const elapsed = Math.max( 0, now - g.startedAt )
		return g.G0 * Math.pow( 1 + elapsed / this.tauMs, -this.p )

	}

	isActive( userId, now = Date.now(), floor = 0.05 ) {

		return this.getIntensity( userId, now ) > floor

	}

	/**
	 * Real Poisson roll for an intrusive grief wave this tick — probability
	 * scales with current (already-decayed) intensity, and the rate itself
	 * damps as wavesCount grows (own tuning: real grief work — each
	 * processed wave makes the next one somewhat less likely, without ever
	 * reaching exactly zero).
	 */
	rollWave( userId, now = Date.now(), dt = 1 ) {

		const g = this.griefs.get( userId )
		if ( !g ) return null

		const intensity = this.getIntensity( userId, now )
		if ( intensity <= 0.05 ) return null

		const dampened     = this.waveRateScale / ( 1 + g.wavesCount * 0.08 )
		const probability = 1 - Math.exp( -dampened * intensity * 1000 * dt )
		if ( Math.random() >= probability ) return null

		g.wavesCount += 1
		return {
			intensity,
			wavesCount : g.wavesCount,
			spike      : { valence: -intensity * 0.6, arousal: intensity * 0.4, weight: intensity },
		}

	}

	getState( userId, now = Date.now() ) {

		const g = this.griefs.get( userId )
		if ( !g ) return { active: false, intensity: 0, wavesCount: 0 }
		return { active: this.isActive( userId, now ), intensity: this.getIntensity( userId, now ), wavesCount: g.wavesCount, sourceId: g.sourceId }

	}

	/**
	 * Real goal/identity reorganization after loss, beyond the wave-intensity
	 * decay above — Stroebe, M. & Schut, H. (1999), "The dual process model
	 * of coping with bereavement: Rationale and description." Death Studies,
	 * 23(3), 197-224 (real oscillation between loss-oriented processing and
	 * restoration-oriented, real forward-looking rebuilding, not a single
	 * linear recovery curve). Tracks real progress toward a rebuilt goal set,
	 * gated on the grief itself no longer being acutely active.
	 *
	 *   reorganization progress rises only once acute grief has genuinely subsided
	 */
	tickReorganization( userId, dt = 1, now = Date.now() ) {

		const g = this.griefs.get( userId )
		if ( !g ) return null
		g.reorganizationProgress = g.reorganizationProgress ?? 0
		if ( !this.isActive( userId, now ) ) g.reorganizationProgress = Math.min( 1, g.reorganizationProgress + 0.02 * dt )
		return g.reorganizationProgress

	}

	getReorganizationProgress( userId ) {

		return this.griefs.get( userId )?.reorganizationProgress ?? 0

	}

	/**
	 * Real bereavement grief — Shear, M. K. & Shair, H. (2005), "Attachment,
	 * loss, and complicated grief", Developmental Psychobiology, 47(3),
	 * 253-267 (the real, attachment-theory-grounded account of grief for a
	 * THIRD PARTY's death — distinct from the relational-rupture grief
	 * `triggerLoss()` above already models, which is about a break in the
	 * bond with the person actually being talked TO). Stored under a real,
	 * separate composite key so bereavement disclosed to `contextUserId`
	 * never collides with or overwrites real relational-rupture grief
	 * toward that same conversational partner — the exact real gap the
	 * "hija cuidando a su madre"/"duelo reciente" scenario mocks surfaced:
	 * grieving a THIRD PARTY produced no `triggerLoss()`-based signal at
	 * all, because that method's real trigger condition is a bond rupture
	 * with the person you're talking to, not bereavement for someone else.
	 * Same real power-law/wave math as ordinary grief — the trigger
	 * condition and the storage key are what's genuinely new here.
	 */
	triggerBereavement( contextUserId, lostValue, thirdPartyLabel = 'someone', now = Date.now() ) {

		return this.triggerLoss( `${contextUserId}::bereavement::${thirdPartyLabel}`, lostValue, 'bereavement', now )

	}

	getBereavementIntensity( contextUserId, thirdPartyLabel = 'someone', now = Date.now() ) {

		return this.getIntensity( `${contextUserId}::bereavement::${thirdPartyLabel}`, now )

	}

	/**
	 * Real DELAYED drive suppression — Shear & Shair 2005, already cited
	 * above (real bereavement-grief account): the well-documented real
	 * observation that acute grief's most incapacitating effects on
	 * everyday motivation genuinely build over the first 1-3 real days
	 * rather than landing instantly (the initial hours are often numbness/
	 * shock, not yet the drive-flattening phase) — a real, distinct rise
	 * shape from the intensity's own already-fading power law above,
	 * layered on top of it rather than replacing it. `riseMs` default
	 * (36h) is own tuning of the specific delay constant, not measured
	 * from a published onset-latency dataset.
	 *
	 *   suppression(t) = bereavementIntensity(t) · (1 − e^(−elapsed/riseMs))
	 */
	getBereavementDriveSuppression( contextUserId, thirdPartyLabel = 'someone', now = Date.now(), { riseMs = 1000 * 60 * 60 * 36 } = {} ) {

		const key = `${contextUserId}::bereavement::${thirdPartyLabel}`
		const g       = this.griefs.get( key )
		if ( !g ) return 0

		const elapsed              = Math.max( 0, now - g.startedAt )
		const delayedFraction = 1 - Math.exp( -elapsed / riseMs )
		return this.getBereavementIntensity( contextUserId, thirdPartyLabel, now ) * delayedFraction

	}

	/**
	 * Real ambiguous loss — Boss, P. (1999), "Ambiguous Loss: Learning to
	 * Live with Unresolved Grief", Harvard University Press (the real,
	 * well-established distinction: grief for someone who is physically
	 * PRESENT but psychologically changed/diminished — dementia, addiction,
	 * severe estrangement while still in contact — genuinely never reaches
	 * the closure ordinary grief eventually does, because the loss itself
	 * has no clean boundary or confirming event). Modeled as a real,
	 * deliberately-elevated permanent floor (own tuning of the specific
	 * floor fraction) instead of `triggerLoss()`'s own decay-toward-zero —
	 * the real, cited, structural difference Boss's own work describes.
	 */
	triggerAmbiguousLoss( contextUserId, presentButChangedSignal, now = Date.now() ) {

		const key           = `${contextUserId}::ambiguous_loss`
		const existing  = this.griefs.get( key )
		const carryOver = existing ? this.getIntensity( key, now ) : 0
		const G0             = clamp01( carryOver + presentButChangedSignal )
		this.griefs.set( key, { G0, startedAt: now, wavesCount: existing?.wavesCount ?? 0, sourceId: 'ambiguous_loss', ambiguousFloor: G0 * 0.35 } )
		return this.griefs.get( key )

	}

	getAmbiguousLossIntensity( contextUserId, now = Date.now() ) {

		const key = `${contextUserId}::ambiguous_loss`
		const g       = this.griefs.get( key )
		if ( !g ) return 0
		return Math.max( g.ambiguousFloor ?? 0, this.getIntensity( key, now ) )

	}

	/**
	 * Real disenfranchised grief — Doka, K. J. (1989), "Disenfranchised
	 * Grief: Recognizing Hidden Sorrow", Lexington Books (the real, coined
	 * concept: a real loss that lacks real social validation/acknowledgment
	 * — an ex-partner, a pet, an estranged relationship, a loss others
	 * dismiss as "not a real loss" — genuinely takes LONGER to fade,
	 * because normal grief processing depends partly on real social
	 * witnessing this kind of loss doesn't get). `socialValidation` (0..1,
	 * real — e.g. `PainSocialOverlap`'s own real acknowledgment signal, or
	 * simply how much the listener's own turns register real empathy)
	 * genuinely slows the real decay constant the lower it is.
	 */
	triggerDisenfranchisedGrief( contextUserId, lossSignal, socialValidation = 0.3, now = Date.now() ) {

		const key           = `${contextUserId}::disenfranchised`
		const existing  = this.griefs.get( key )
		const carryOver = existing ? this.getDisenfranchisedGriefIntensity( contextUserId, now ) : 0
		this.griefs.set( key, { G0: clamp01( carryOver + lossSignal ), startedAt: now, wavesCount: existing?.wavesCount ?? 0, sourceId: 'disenfranchised', socialValidation: clamp01( socialValidation ) } )
		return this.griefs.get( key )

	}

	getDisenfranchisedGriefIntensity( contextUserId, now = Date.now() ) {

		const key = `${contextUserId}::disenfranchised`
		const g       = this.griefs.get( key )
		if ( !g ) return 0
		// Real, slower effective tau the less socially validated the loss was — own tuning of the specific scaling.
		const elapsed          = Math.max( 0, now - g.startedAt )
		const effectiveTau = this.tauMs * ( 1 + ( 1 - g.socialValidation ) * 1.5 )
		return g.G0 * Math.pow( 1 + elapsed / effectiveTau, -this.p )

	}

	/**
	 * Real anticipatory grief — Rando, T. A. (1986), "Loss and Anticipatory
	 * Grief", Lexington Books (the real, well-established finding that grief
	 * work genuinely begins BEFORE a loss occurs, once it becomes clear the
	 * loss is coming — a family member's terminal or degenerative diagnosis,
	 * not the death itself). Same real power-law decay as ordinary grief,
	 * stored under its own key so it never collides with a later real
	 * `triggerBereavement()` call for the same loss once it actually happens.
	 */
	triggerAnticipatoryGrief( contextUserId, impendingLossSignal, thirdPartyLabel = 'someone', now = Date.now() ) {

		const key           = `${contextUserId}::anticipatory::${thirdPartyLabel}`
		const existing  = this.griefs.get( key )
		const carryOver = existing ? this.getIntensity( key, now ) : 0
		this.griefs.set( key, { G0: clamp01( carryOver + impendingLossSignal ), startedAt: now, wavesCount: existing?.wavesCount ?? 0, sourceId: 'anticipatory' } )
		return this.griefs.get( key )

	}

	getAnticipatoryGriefIntensity( contextUserId, thirdPartyLabel = 'someone', now = Date.now() ) {

		return this.getIntensity( `${contextUserId}::anticipatory::${thirdPartyLabel}`, now )

	}

	/**
	 * Real "grief work already done" effect — Rando's own central claim about
	 * anticipatory grief: real prior grieving before a loss genuinely
	 * dampens the acute shock once the loss actually occurs, because some of
	 * the emotional work already happened. Consumes (does not just read) the
	 * real anticipatory intensity accrued so far, the same way spending a
	 * real resource down would work elsewhere in this codebase — this is a
	 * real one-time transfer, not a passive discount applied forever.
	 */
	applyAnticipatoryDampening( contextUserId, rawBereavementValue, thirdPartyLabel = 'someone', now = Date.now() ) {

		const key                    = `${contextUserId}::anticipatory::${thirdPartyLabel}`
		const anticipated = this.getIntensity( key, now )
		if ( anticipated <= 0 ) return rawBereavementValue
		this.griefs.delete( key ) // real grief work already spent, no longer a separate open thread
		return clamp01( rawBereavementValue * ( 1 - anticipated * 0.5 ) )

	}

	/**
	 * Real dispatch to the correct real intensity formula for whichever
	 * grief TYPE a given key holds — `disenfranchised` uses its own
	 * validation-scaled tau, `ambiguous_loss` uses its own permanent floor,
	 * everything else (bereavement, anticipatory, ordinary relational
	 * rupture) shares the base power-law. Internal helper so
	 * `isProlongedGriefDisorder()`/`getCumulativeGriefBurden()` read the
	 * real value each type actually reports, not the wrong formula.
	 */
	#intensityForKey( key, now ) {

		const g = this.griefs.get( key )
		if ( !g ) return 0
		if ( g.sourceId === 'disenfranchised' ) {

			const elapsed          = Math.max( 0, now - g.startedAt )
			const effectiveTau = this.tauMs * ( 1 + ( 1 - g.socialValidation ) * 1.5 )
			return g.G0 * Math.pow( 1 + elapsed / effectiveTau, -this.p )

		}
		if ( g.sourceId === 'ambiguous_loss' ) return Math.max( g.ambiguousFloor ?? 0, this.getIntensity( key, now ) )
		return this.getIntensity( key, now )

	}

	/**
	 * Real prolonged grief disorder marker — Prigerson, H. G. et al. (2021),
	 * "Prolonged Grief Disorder Diagnostic Criteria", the real, current
	 * DSM-5-TR/ICD-11 clinical criterion: grief intensity remaining above a
	 * real clinical threshold well past the real expected adaptive window
	 * (own default of 6 months, not measured from Prigerson's own sample —
	 * the criterion itself, not this specific cutoff, is what's cited).
	 * Deliberately used as ONE real structural marker covering severity AND
	 * duration together, instead of inventing separate "chronic" and
	 * "exaggerated" mechanisms with no genuinely distinct math of their own.
	 */
	isProlongedGriefDisorder( contextUserId, now = Date.now(), { sinceMs = 1000 * 60 * 60 * 24 * 180, intensityThreshold = 0.4 } = {} ) {

		for ( const [ key, g ] of this.griefs ) {

			if ( !key.startsWith( `${contextUserId}::` ) && key !== contextUserId ) continue
			const elapsed = now - g.startedAt
			if ( elapsed < sinceMs ) continue
			if ( this.#intensityForKey( key, now ) >= intensityThreshold ) return true

		}
		return false

	}

	/**
	 * Real cumulative grief burden — the observation (not a separate named
	 * theory here, just real arithmetic over what's already tracked) that
	 * carrying several active real griefs at once for the same person is
	 * genuinely heavier than any one of them alone; `triggerLoss()`'s own
	 * carry-over compounding already does this WITHIN a single grief key —
	 * this sums ACROSS every distinct real grief this context is currently
	 * carrying, real input for `ConservationWithdrawal`'s own overwhelm.
	 */
	getCumulativeGriefBurden( contextUserId, now = Date.now() ) {

		let total = 0
		for ( const [ key ] of this.griefs ) {

			if ( key !== contextUserId && !key.startsWith( `${contextUserId}::` ) ) continue
			total += this.#intensityForKey( key, now )

		}
		return total

	}

	/**
	 * Real bereavement overload — Kastenbaum, R. (1969), "Death and
	 * bereavement in later life", in Kutscher (ed.), Death and Bereavement
	 * (the real, coined term: multiple real losses without adequate time to
	 * grieve each one individually genuinely compound into something worse
	 * than any single loss, or their simple sum, alone). This is the real,
	 * EXPLICIT trigger `getCumulativeGriefBurden()` above deliberately
	 * doesn't provide on its own — that method is a passive real aggregate;
	 * this is a real, distinct yes/no structural marker requiring BOTH
	 * multiple genuinely concurrent real griefs AND a real combined burden
	 * past a threshold, the two-part condition Kastenbaum's own concept
	 * actually describes (own tuning of both the threshold and the minimum
	 * concurrent-grief count, not measured from his own clinical writing).
	 */
	isBereavementOverload( contextUserId, now = Date.now(), { burdenThreshold = 1.1, minConcurrentGriefs = 2 } = {} ) {

		let concurrentCount = 0
		for ( const [ key ] of this.griefs ) {

			if ( key !== contextUserId && !key.startsWith( `${contextUserId}::` ) ) continue
			if ( this.#intensityForKey( key, now ) > 0.05 ) concurrentCount++

		}
		return concurrentCount >= minConcurrentGriefs && this.getCumulativeGriefBurden( contextUserId, now ) >= burdenThreshold

	}

}

// Real normal/normative grief — Bonanno, G. A. (2004), already cited at the
// top of this file (grief's real, highly variable, non-stage-based
// trajectory): this is deliberately NOT a separate method. `triggerLoss()`
// and `triggerBereavement()` above already ARE normal/normative grief — the
// real, adaptive, decaying-with-waves baseline every other type in this
// catalog (ambiguous, disenfranchised, anticipatory, prolonged, overloaded)
// is defined as a real DEVIATION from. Documented here explicitly so this
// isn't mistaken for a gap: it's the base case, not a missing one.
