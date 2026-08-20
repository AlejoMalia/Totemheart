function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

/**
 * A real, stable interest identity: likes/dislikes, real intensity growth
 * from experience, a real "how deep does this go" geek-intensity field, a
 * real practice-based hobby urge, a real social-share gate that only lets
 * deep engagement out under real trust/context, and a real identity-fusion
 * layer that makes attacking a core interest genuinely threatening — Silvia,
 * P. J. (2006), "Exploring the Psychology of Interest", Oxford University
 * Press (interest as a real, distinct positive emotion with its own
 * novelty/complexity appraisal, not just "high valence"); Renninger, K. A.
 * & Hidi, S. (2011), "Revisiting the conceptualization, measurement, and
 * generation of interest", Educational Psychologist, 46(3), 168-184 (real,
 * well-established phase model of interest development: triggered ->
 * maintained -> emerging individual -> well-developed individual interest,
 * the real shape the geek-intensity levels below borrow); Petty, R. E. &
 * Cacioppo, J. T. (1986), the elaboration likelihood model (real depth of
 * engagement as a function of real motivation/ability); Aron, A., Aron, E.
 * N. & Smollan, D. (1992), "Inclusion of Other in the Self Scale",
 * Journal of Personality and Social Psychology (the general real
 * self-expansion/identity-fusion pattern IdentityFusionLite borrows the
 * shape of, applied to an interest instead of a relationship). Own
 * engineering of the specific multiplicative formulas throughout.
 *
 *   preference(t) = v(t)·i(t)
 *   g(t) = σ(w·[i,c,x,f])
 *   P(share) = σ(g + A - threat - formal + reciprocal)
 *   U(t) = i(t)·(1 - recentPractice(t))
 */
export class FrikiEngine {

	constructor( { opennessToNew = 0.5 } = {} ) {

		this.opennessToNew = opennessToNew
		this.interests           = new Map() // topic -> InterestNode
		this.hobbyGoals              = new Map() // topic -> { progress, satisfaction }
		this.currentObsession   = null
		this.fandomLinks               = new Map() // topic -> Map(neighborTopic -> similarity)

	}

	#node( topic, domain = 'general' ) {

		if ( !this.interests.has( topic ) ) this.interests.set( topic, {
			topic, domain, valence: 0, intensity: 0, geekLevel: 0, competence: 0, exposure: 0, lastEngagedAt: null,
		} )
		return this.interests.get( topic )

	}

	getInterest( topic ) {

		return this.interests.get( topic ) ?? null

	}

	/**
	 * Real TasteProfile update from an actual engagement this turn. `reward`
	 * (-1..1) — real affective payoff of this exchange about `topic`.
	 * `depth` (0..1) — how substantively it was engaged with.
	 */
	observeEngagement( topic, { reward = 0, depth = 0.3, domain = 'general', now = Date.now() } = {} ) {

		const node = this.#node( topic, domain )
		node.valence     = clamp01( ( node.valence + 1 ) / 2 + 0.15 * reward * ( 1 - Math.abs( node.valence ) ) ) * 2 - 1
		node.intensity  = clamp01( node.intensity + 0.1 * Math.abs( reward ) * depth )
		node.competence = clamp01( node.competence + 0.05 * depth )
		node.exposure       += 1
		node.lastEngagedAt = now

		// Real geek-intensity field — a real logistic blend of intensity,
		// competence, exposure, and fandom density (own-tuned weights).
		const fandomDensity = ( this.fandomLinks.get( topic )?.size ?? 0 ) / 10
		node.geekLevel = sigmoid( 3 * ( node.intensity * 0.4 + node.competence * 0.3 + clamp01( node.exposure / 20 ) * 0.2 + clamp01( fandomDensity ) * 0.1 - 0.5 ) )

		this.#updateObsession( now )
		return node

	}

	/**
	 * Real PREFERENCE REWRITE through a bond — De Houwer, J., Thomas, S. &
	 * Baeyens, F. (2001), "Associative learning of likes and dislikes: A
	 * review of 25 years of research on human evaluative conditioning",
	 * Psychological Bulletin, 127(6), 853-869 (the real, well-established
	 * evaluative-conditioning finding: liking genuinely transfers from an
	 * already-liked person/thing onto whatever gets repeatedly paired with
	 * them, distinct from ordinary reward-driven interest growth above —
	 * "I didn't like this before, but I do now, because of you"). Real,
	 * bounded amplification of `observeEngagement()`'s own reward by the
	 * real bond strength this specific engagement was shared under.
	 */
	observeJointEngagement( topic, bond, baseReward, opts = {} ) {

		const amplified = baseReward + clamp01( Math.max( 0, bond ) ) * 0.4 * ( baseReward >= 0 ? 1 : -1 )
		return this.observeEngagement( topic, { ...opts, reward: Math.max( -1, Math.min( 1, amplified ) ) } )

	}

	rankInterests( { k = 5, minIntensity = 0 } = {} ) {

		return [ ...this.interests.values() ]
			.filter( n => n.intensity >= minIntensity )
			.sort( ( a, b ) => b.valence * b.intensity - a.valence * a.intensity )
			.slice( 0, k )

	}

	/** Real fandom-neighbor link, weighted by real similarity — activates the neighbor when the source is active. */
	linkFandom( topic, neighborTopic, similarity ) {

		if ( !this.fandomLinks.has( topic ) ) this.fandomLinks.set( topic, new Map() )
		this.fandomLinks.get( topic ).set( neighborTopic, clamp01( similarity ) )

	}

	/** Real spreading activation one hop out from `topic`, weighted by the source's own geek level. */
	getFandomActivation( topic ) {

		const source = this.getInterest( topic )
		if ( !source ) return []
		const neighbors = this.fandomLinks.get( topic ) ?? new Map()
		return [ ...neighbors.entries() ].map( ( [ neighbor, sim ] ) => ( { neighbor, activation: sim * source.geekLevel } ) ).sort( ( a, b ) => b.activation - a.activation )

	}

	/** Real hobby-practice ODE — a goal formed once, decaying without renewal, producing a real urge when neglected. */
	formHobbyGoal( topic, { ritual = 'opportunistic' } = {} ) {

		this.hobbyGoals.set( topic, { topic, ritual, progress: 0, satisfaction: 0, lastPracticedAt: null } )

	}

	practiceHobby( topic, amount = 0.3, now = Date.now() ) {

		const goal = this.hobbyGoals.get( topic )
		if ( !goal ) return null
		goal.progress          = clamp01( goal.progress + amount )
		goal.lastPracticedAt = now
		const node                  = this.getInterest( topic )
		goal.satisfaction    = sigmoid( 3 * ( goal.progress + ( node?.competence ?? 0 ) - 0.6 ) )
		return goal

	}

	decayHobbies( dt = 1, lambda = 0.05 ) {

		for ( const goal of this.hobbyGoals.values() ) goal.progress = Math.max( 0, goal.progress - lambda * dt )

	}

	/** Real urge to return to a neglected hobby — high intensity, low recent practice. */
	getHobbyUrge( topic, now = Date.now() ) {

		const goal = this.hobbyGoals.get( topic )
		const node = this.getInterest( topic )
		if ( !goal || !node ) return 0
		const recentPractice = goal.lastPracticedAt ? clamp01( 1 - ( now - goal.lastPracticedAt ) / ( 1000 * 60 * 60 * 24 * 7 ) ) : 0
		return clamp01( node.intensity * ( 1 - recentPractice ) )

	}

	#updateObsession( now ) {

		let best        = null
		let bestScore = 0
		for ( const node of this.interests.values() ) {

			const recentRewardProxy = node.lastEngagedAt && now - node.lastEngagedAt < 1000 * 60 * 60 * 24 ? 1 : 0.3
			const score                        = node.geekLevel * recentRewardProxy
			if ( score > bestScore ) { bestScore = score; best = node.topic }

		}
		this.currentObsession = bestScore > 0.6 ? best : null

	}

	getObsession() {

		return this.currentObsession

	}

	/**
	 * Real social-share gate — how much of this interest's real depth is
	 * appropriate to let out THIS context, distinct from how deep the
	 * interest itself runs.
	 */
	shouldShare( topic, { affinity = 0.5, faceThreat = 0, formality = 0, reciprocalInterest = 0 } = {} ) {

		const node = this.getInterest( topic )
		if ( !node ) return { shouldShare: false, depthAllowed: 0 }

		const z             = 3 * ( node.geekLevel + affinity - faceThreat - formality + reciprocalInterest - 0.6 )
		const pShare   = sigmoid( z )
		const depthAllowed = node.geekLevel * pShare

		return { shouldShare: pShare > 0.5, pShare, depthAllowed }

	}

	/**
	 * The real reveal gate requested explicitly: a superfan-level interest
	 * (geekLevel above `hiddenThreshold`) stays UNREVEALED — not brought up
	 * proactively — until either the real trust/affinity bar clears, or the
	 * human themselves brings the topic up (a real, caller-supplied cue).
	 */
	shouldRevealUnprompted( topic, { trust = 0.5, humanBroughtItUp = false }, hiddenThreshold = 0.7, trustThreshold = 0.75 ) {

		const node = this.getInterest( topic )
		if ( !node ) return true // nothing to hide
		if ( node.geekLevel < hiddenThreshold ) return true // not deep enough to warrant hiding
		return humanBroughtItUp || trust >= trustThreshold

	}

	/**
	 * Real identity fusion — how much a topic has become part of "who I
	 * am," a real function of intensity, geek level, and consistency over
	 * time (own-tuned; real exposure count stands in for consistency).
	 */
	getIdentityWeight( topic ) {

		const node = this.getInterest( topic )
		if ( !node ) return 0
		return clamp01( node.intensity * node.geekLevel * clamp01( node.exposure / 20 ) )

	}

	/** Real ego-threat contribution when a fused interest is attacked — proportional to how fused it is. */
	getEgoThreatFromAttack( topic, attackMagnitude ) {

		return clamp01( this.getIdentityWeight( topic ) * clamp01( attackMagnitude ) )

	}

	/** Real attention/memory bias toward the AI's own top interest — a real multiplier, not a hardcoded topic list. */
	getAttentionBoost( topic ) {

		const node = this.getInterest( topic )
		if ( !node ) return 1
		return 1 + 0.6 * Math.max( 0, node.valence ) * node.intensity

	}

	toJSON() {

		return {
			interests           : [ ...this.interests.entries() ],
			hobbyGoals             : [ ...this.hobbyGoals.entries() ],
			currentObsession : this.currentObsession,
			fandomLinks             : [ ...this.fandomLinks.entries() ].map( ( [ topic, m ] ) => [ topic, [ ...m.entries() ] ] ),
		}

	}

	restoreState( data = {} ) {

		if ( data.interests ) this.interests = new Map( data.interests )
		if ( data.hobbyGoals ) this.hobbyGoals = new Map( data.hobbyGoals )
		if ( 'currentObsession' in data ) this.currentObsession = data.currentObsession
		if ( data.fandomLinks ) this.fandomLinks = new Map( data.fandomLinks.map( ( [ topic, entries ] ) => [ topic, new Map( entries ) ] ) )

	}

}
