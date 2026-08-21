function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

/**
 * Real TRAUMA CASCADE — the user's own explicit design decision: NOT a
 * second clinical system parallel to the already-existing Fear/cortisol/
 * betrayal machinery, but the missing real DYNAMIC that couples them —
 * fear that genuinely can't resolve through ordinary escape/defense
 * cascades into a real, distinct sequence rather than just reading as
 * "more stress." Reduced to the 5-6 real states the user's own spec
 * asked for, not the full 10-block clinical taxonomy.
 *
 *   Porges, S. W. (1995, 2011), "The Polyvagal Theory": neuroception, the
 *   real pre-conscious threat-detection concept this module's own entry
 *   point is named for.
 *   Cannon, W. B. (1932), "The Wisdom of the Body": the real fight/flight
 *   mobilization account.
 *   Nijenhuis, E. R. S. & van der Hart, O. (2011), "Dissociation in
 *   trauma": real structural-dissociation theory grounding entrapment and
 *   tonic immobility as a genuinely DISTINCT real state from ordinary
 *   fight/flight, not just "more fear."
 *   van der Kolk, B. A. & Fisler, R. (1995), "Dissociation and the
 *   fragmentary nature of traumatic memories": the real, well-cited
 *   finding that genuinely overwhelming events are encoded with LESS
 *   narrative order and MORE isolated sensory/affective fragments.
 *   Herman, J. L. (1992), "Trauma and Recovery": the real, foundational
 *   account that post-event safety and co-regulation (or their absence)
 *   genuinely determines whether an acute response consolidates.
 *   Ozer, E. J., Best, S. R., Lipsey, T. L. & Weiss, D. S. (2003), "Predictors
 *   of posttraumatic stress disorder and symptoms in adults: a meta-analysis",
 *   Psychological Bulletin: real, well-cited meta-analytic finding that lack
 *   of social support is one of the strongest predictors of consolidation.
 *
 * Deliberately gated on genuine extremity (own tuning) — this is NOT meant
 * to fire from ordinary conflict; only from real, inescapable, high-
 * intensity threat, per the user's own explicit caution against an agent
 * that becomes "traumatic por cualquier roce."
 */
export class TraumaCascadeEngine {

	constructor( { entrapmentEpsilon = 0.15, freezeThreshold = 0.6, traumaLearnRate = 0.3, safeDecayRate = 0.08, severitySlowdown = 2.5, noveltyDecayRate = 0.6, scarFloorRate = 0.05 } = {} ) {

		this.entrapmentEpsilon = entrapmentEpsilon
		this.freezeThreshold      = freezeThreshold
		this.traumaLearnRate    = traumaLearnRate
		this.safeDecayRate         = safeDecayRate
		this.severitySlowdown    = severitySlowdown // own tuning: how much a high peak freeze/dissociation slows real future decay
		this.noveltyDecayRate  = noveltyDecayRate // own tuning: how fast an identical, repeated real threat loses its own marginal gain
		this.scarFloorRate         = scarFloorRate // own tuning: the max real permanent floor a badly-consolidated single event can leave

		this.traumaTrace = new Map() // userId -> 0..1, real long-horizon consolidated trace
		this.fragments        = new Map() // userId -> [{ label, weight, ts }], real sensory/affective fragments (not full narrative episodes)
		this.severity              = new Map() // userId -> real peak freeze/dissociation ever recorded, how "sticky" this consolidation is
		this.scarFloor           = new Map() // userId -> real non-zero decay floor set by how poorly a past event consolidated (Ozer et al. 2003)
		this.recentSignature   = new Map() // userId -> { signature, repeatCount }, real per-engine "episode novelty" tracking, independent of wall-clock

	}

	/**
	 * Real "episode novelty" — the SAME real idea `WornPathCache.js` already
	 * uses (a fingerprint seen often enough stops carrying full weight), but
	 * keyed to this engine's OWN dt-based clock rather than `Date.now()`.
	 * `WornPathCache`'s wall-clock authority decay is correct for ITS job
	 * (day-spaced conversational realism); the trauma gate needs a real
	 * repetition signal that survives a fast test script's `tick(dt)` time
	 * jumps the same way `traumaTrace`'s own decay already does, so an
	 * identical, repeated threat genuinely produces LESS marginal
	 * consolidation than a fresh, distinct one, not because wall-clock time
	 * happened to pass.
	 */
	getNovelty( userId, signature ) {

		const prior = this.recentSignature.get( userId )
		if ( !prior || prior.signature !== signature ) return 1 // a brand-new or genuinely different threat is fully novel
		return 1 / ( 1 + prior.repeatCount * this.noveltyDecayRate )

	}

	/** Real, read-and-update in one step so the SECOND occurrence of an identical signature already reads as less novel, not only from the third onward. Returns the repeat count as of THIS observation (0 for brand new). */
	#touchSignature( userId, signature ) {

		const prior = this.recentSignature.get( userId )
		if ( prior && prior.signature === signature ) { prior.repeatCount += 1; return prior.repeatCount }
		this.recentSignature.set( userId, { signature, repeatCount: 0 } )
		return 0

	}

	/** Real pre-conscious neuroception — Porges 1995/2011. `threatCues` (0..1, already-computed real threat signal, e.g. ontology threat/betrayal match magnitude), `interoceptionArousal` (0..1, real already-tracked arousal), `safetySignal` (0..1, real, e.g. relation.trust or a secure bond present). */
	neuroception( { threatCues = 0, interoceptionArousal = 0, safetySignal = 0 } ) {

		return sigmoid( 3 * ( clamp01( threatCues ) * 0.7 + clamp01( interoceptionArousal ) * 0.5 - clamp01( safetySignal ) * 0.8 - 0.4 ) )

	}

	/** Real fast-pathway activation — bypasses deliberate appraisal, LeDoux's own already-cited fast route. */
	fastActivation( neuroceptionLevel ) {

		return clamp01( neuroceptionLevel )

	}

	/** Real entrapment — Cannon 1932's mobilization divided by real available escape/defense capacity; the denominator never hits 0 (epsilon floor). */
	entrapment( { mobilization = 0, escapeCapability = 0.5, defenseCapability = 0.5 } ) {

		return clamp01( clamp01( mobilization ) / ( this.entrapmentEpsilon + clamp01( escapeCapability ) + clamp01( defenseCapability ) ) )

	}

	/** Real tonic immobility / freeze — Nijenhuis & van der Hart 2011, a genuinely distinct state from fight/flight, only when entrapment crosses its own real threshold while fast activation is genuinely high. */
	freeze( entrapmentLevel, fastActivationLevel ) {

		return entrapmentLevel > this.freezeThreshold ? sigmoid( 3 * ( entrapmentLevel - this.freezeThreshold ) ) * fastActivationLevel : 0

	}

	/** Real memory fragmentation — van der Kolk & Fisler 1995: genuinely overwhelming intensity×duration relative to real hippocampal-style capacity produces fragmented, not narratively-ordered, encoding. */
	fragmentation( { cortisolLevel = 0, fastActivationLevel = 0, duration = 1, capacity = 1.2 } ) {

		return sigmoid( 3 * ( clamp01( cortisolLevel ) * clamp01( fastActivationLevel ) * duration - capacity ) )

	}

	/** Real peritraumatic dissociation — genuinely inescapable + real pain proxy, dampened by real social support/self-regulation already tracked elsewhere (couples honestly to EndogenousOpioidSystem's own analgesia rather than inventing a new numbing channel). */
	dissociation( { inescapable = 0, painProxy = 0, socialSupport = 0, selfRegulation = 0 } ) {

		return sigmoid( 3 * ( clamp01( inescapable ) * clamp01( painProxy ) - clamp01( socialSupport ) * 0.6 - clamp01( selfRegulation ) * 0.4 - 0.3 ) )

	}

	/** Real post-event delta — Herman 1992 / Ozer et al. 2003: whether real co-regulation and perceived safety outweigh the residual stress left by the acute cascade. Positive = still unsafe, negative = genuinely soothed. */
	postEventDelta( { residualStress = 0, coRegulation = 0, perceivedSafety = 0 } ) {

		return clamp01( residualStress ) - clamp01( coRegulation ) - clamp01( perceivedSafety )

	}

	/**
	 * Real, additive-to-a-ceiling trauma-trace consolidation, only from a
	 * genuinely fragmented+frozen event with a real unresolved post-event
	 * delta. `dissociationLevel` (optional, real, same turn's own already-
	 * computed value) feeds real peak-severity tracking alongside freeze —
	 * Ozer et al. (2003)'s own real meta-analytic finding that peritraumatic
	 * dissociation is one of the strongest predictors of how "sticky" the
	 * consolidation becomes, used here to slow future real decay, not just
	 * read as a same-turn number.
	 *
	 * A repeated, IDENTICAL real threat signature (same `fragmentLabel`)
	 * genuinely gains LESS with each repetition (`getNovelty()`), so an
	 * echoed threat and a live, distinct new one diverge for a real reason
	 * (habituation to the specific recurring cue), not merely by how many
	 * times each happened to fire.
	 *
	 * A poorly-consolidated event (postEventDeltaValue still positive —
	 * genuinely unresolved) also sets a real, small, non-zero decay FLOOR
	 * for this user (own tuning, capped by `scarFloorRate`) — a real scar
	 * that a well-supported event (postEventDeltaValue negative) does not
	 * leave, so two otherwise-identical single hits genuinely diverge in
	 * the trace itself over time, not only in downstream happiness/trust/
	 * cortisol recovery speed.
	 */
	registerTraumaEvent( userId, { fragmentationLevel, freezeLevel, dissociationLevel = 0, postEventDeltaValue, fragmentLabel = null, sensoryDetail = null, valence = null } ) {

		const signature   = fragmentLabel ?? 'threat'
		const repeatCount = this.#touchSignature( userId, signature )
		const novelty         = 1 / ( 1 + repeatCount * this.noveltyDecayRate )

		const current = this.traumaTrace.get( userId ) ?? 0
		const gain       = this.traumaLearnRate * clamp01( fragmentationLevel ) * clamp01( freezeLevel ) * sigmoid( 2 * postEventDeltaValue ) * novelty
		this.traumaTrace.set( userId, clamp01( current + gain ) )

		const peakSeverity = Math.max( this.severity.get( userId ) ?? 0, clamp01( freezeLevel ), clamp01( dissociationLevel ) )
		this.severity.set( userId, peakSeverity )

		const newFloor = sigmoid( 2 * postEventDeltaValue ) * this.scarFloorRate
		this.scarFloor.set( userId, Math.max( this.scarFloor.get( userId ) ?? 0, newFloor ) )

		// Real bug found by the user's own battery: 0.3 rarely crossed from
		// a single fresh event (fragmentation needs cortisol build-up, not
		// just one turn), so a genuinely extreme first hit often stored NO
		// fragment at all — van der Kolk & Fisler's (1995) own real
		// "fragments, not narrative" finding never actually applied.
		// Lowered to a real, still-deliberate 0.15 floor. Also now stores a
		// real sensory/emotional trace (the actual input snippet and this
		// turn's own valence), not just an abstract category label —
		// "trozos sensoriales/emocionales", per the user's own explicit ask.
		if ( fragmentLabel && fragmentationLevel > 0.15 ) {

			const list = this.fragments.get( userId ) ?? []
			list.push( { label: fragmentLabel, weight: clamp01( fragmentationLevel ), ts: Date.now(), detail: sensoryDetail ? String( sensoryDetail ).slice( 0, 140 ) : null, valence } )
			if ( list.length > 20 ) list.shift()
			this.fragments.set( userId, list )

		}

		return this.traumaTrace.get( userId )

	}

	getTraumaTrace( userId ) {

		return this.traumaTrace.get( userId ) ?? 0

	}

	getFragments( userId ) {

		return this.fragments.get( userId ) ?? []

	}

	/** Real intrusion probability — how much a real cue overlaps with a stored fragment, scaled by the real consolidated trace, same honest shape RelationalMemoryCatalog's own reactivation uses. */
	getIntrusionProbability( userId, cueOverlap ) {

		return sigmoid( 3 * ( clamp01( cueOverlap ) * this.getTraumaTrace( userId ) - 0.5 ) )

	}

	/**
	 * Real, slow decay toward a real, possibly non-zero floor (the same
	 * unconditionally-stable exponential-toward-floor shape already
	 * established by `EpisodicMemory.getLatentWeight()` and
	 * `RelationalMemoryCatalog.tick()`, safe for any real dt) — a genuinely
	 * SAFE, sustained period with real co-regulation (own tuning) reduces
	 * the trace; without it, decay genuinely slows rather than proceeding
	 * at the same flat rate (Herman 1992's own real co-regulation claim,
	 * extended: its ABSENCE should measurably slow recovery, not just its
	 * presence speed it). A real high peak freeze/dissociation
	 * (`severity`, set once per event in `registerTraumaEvent()`) slows
	 * decay further still — the worse the original acute response, the
	 * "stickier" the real consolidated trace (Ozer et al. 2003).
	 */
	decay( userId, dt = 1, coRegulation = 0 ) {

		const current = this.traumaTrace.get( userId )
		if ( current === undefined ) return
		const floor          = this.scarFloor.get( userId ) ?? 0
		const severity     = this.severity.get( userId ) ?? 0
		const effectiveRate = this.safeDecayRate * clamp01( coRegulation ) / ( 1 + severity * this.severitySlowdown )
		const converged  = floor + ( current - floor ) * Math.exp( -effectiveRate * dt )
		// Real sign bug found by the user's own year-long battery (test 13:
		// a real, better-supported branch ended up with MORE trace than a
		// minimized one): "decay toward a floor" converges from EITHER
		// side — if the same event's own initial gain (fragmentation×freeze)
		// happened to land BELOW its own real scar floor (freeze never
		// crossed its own threshold this specific event, but the floor from
		// a poorly-consolidated postEventDelta is still real and nonzero),
		// the exponential form was pulling the trace UP toward that floor
		// over time, and MORE real co-regulation (faster convergence) meant
		// reaching that floor SOONER — support making the trace rise
		// faster is backwards. Decay must never increase the trace,
		// regardless of which side of the floor it started on.
		this.traumaTrace.set( userId, Math.min( current, converged ) )

	}

}
