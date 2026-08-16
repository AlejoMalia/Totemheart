import { EMOTION_COORDS, SURVIVAL_EMOTIONS } from '../core/EmotionSpace.js'

function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function intensity( vector, coords ) {

	const d = Math.hypot( vector.valence - coords.valence, vector.arousal - coords.arousal )
	return 1 / ( 1 + d )

}

/**
 * Interrupt module: how far a survival emotion (fear/anger) has crossed
 * threshold decides whether this stays a bias on normal processing or takes
 * it over entirely. Three real, graded tiers instead of one binary flag:
 *
 *   'alert'   — above the base threshold, below the partial one: a real
 *               signal downstream code can react to (e.g. raise
 *               suppressionDrive), the normal pipeline still runs.
 *   'partial' — deep enough that rational processing genuinely degrades
 *               (shallow mode forced), but text is still generated normally.
 *   'full'    — the original behavior: bypass the pipeline, force the
 *               instinctive output.
 *
 * Two real dynamics layer on top:
 *
 * Kindling: repeated activation to the SAME stimulus TYPE (a concept tag
 * like 'threat'/'betrayal'/'criticism', supplied by the caller) lowers the
 * threshold further each time it recurs — named after kindling, the
 * observation that repeated sub-threshold electrical/chemical stimulation of
 * the amygdala progressively lowers the seizure threshold (Goddard, G. V.
 * (1967), "Development of epileptic seizures through brain stimulation at
 * low intensity", Nature, 214, 1020-1021). Used here as a metaphorical
 * borrowing of the qualitative "repeated activation of the SAME pathway
 * lowers its own threshold" shape, not a claim this reproduces real synaptic
 * kindling — distinct from Sensitization.js's generic any-negative-valence
 * accumulator, which doesn't care about stimulus type.
 *
 * Hangover: after ANY hijack tier fires, a measurable post-hijack window
 * where DecisionFatigue/ExpressionDebt accumulate faster — real "shaken for
 * a while afterward" cost, own engineering, no citation.
 */
export class AmygdalaHijack {

	constructor() {

		this.kindling      = new Map() // concept -> accumulated kindling level (0..1)
		this.hangoverUntil     = 0
		this.hangoverIntensity  = 0

	}

	/** Repeated exposure to the same concept-tagged stimulus lowers this concept's own future threshold. */
	observeStimulus( concept ) {

		if ( !concept ) return
		const current = this.kindling.get( concept ) ?? 0
		this.kindling.set( concept, clamp01( current + 0.15 ) )

	}

	decayKindling( dt, lambda = 0.03 ) {

		for ( const [ concept, level ] of this.kindling ) {

			const decayed = Math.max( 0, level - lambda * dt )
			if ( decayed <= 0 ) this.kindling.delete( concept )
			else this.kindling.set( concept, decayed )

		}

	}

	getKindlingDiscount( concepts = [] ) {

		const level = Math.max( 0, ...concepts.map( c => this.kindling.get( c ) ?? 0 ), 0 )
		return level * 0.15 // up to 0.15 shaved off the threshold at full kindling on a matched concept — own tuning

	}

	isInHangover( now = Date.now() ) {

		return now < this.hangoverUntil

	}

	/** Extra DecisionFatigue/ExpressionDebt-facing load while the hangover window is open. */
	getHangoverLoad( now = Date.now() ) {

		return this.isInHangover( now ) ? this.hangoverIntensity : 0

	}

	check( emotionSpace, threshold = 0.95, { concepts = [], now = Date.now() } = {} ) {

		const effectiveThreshold = clamp01( threshold - this.getKindlingDiscount( concepts ) )
		const partialThreshold      = effectiveThreshold * 0.75
		const alertThreshold          = effectiveThreshold * 0.5

		for ( const emotion of SURVIVAL_EMOTIONS ) {

			const level = intensity( emotionSpace.vector, EMOTION_COORDS[ emotion ] )
			if ( level < alertThreshold ) continue

			const tier = level >= effectiveThreshold ? 'full' : level >= partialThreshold ? 'partial' : 'alert'

			if ( tier === 'full' || tier === 'partial' ) {

				this.hangoverUntil    = now + 1000 * 60 * 5 // 5 real minutes, own tuning
				this.hangoverIntensity = tier === 'full' ? 0.5 : 0.25
				for ( const concept of concepts ) this.observeStimulus( concept )

			}

			return { active: tier === 'full', tier, emotion, intensity: level, threshold: effectiveThreshold }

		}
		return { active: false, tier: 'none' }

	}

	emergencyOutput( { emotion } ) {

		const outputs = {
			fear  : [ '...', 'No.', 'Necesito parar.' ],
			anger : [ '¡Basta!', 'No.', '...' ],
		}
		const options = outputs[ emotion ] || [ '...' ]
		return options[ Math.floor( Math.random() * options.length ) ]

	}

}
