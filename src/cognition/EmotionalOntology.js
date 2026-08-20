function tokenize( text ) {

	return ( text || '' ).toLowerCase().match( /[\p{L}']+/gu ) || []

}

/**
 * A small, hand-built concept graph (not learned, not sourced from a
 * dataset) mapping higher-level psychological concepts to reaction
 * profiles. Loosely inspired by common appraisal-theory/CBT categories, but
 * this is NOT a reproduction of Ekman's basic emotions, Russell's circumplex,
 * or any other published taxonomy — it's our own concept starting point.
 * See CALIBRATION.md. This runs independently of any LanguageProvider, so it
 * raises the floor for the no-LLM heuristic path instead of only ever
 * depending on an external model for anything beyond raw polarity.
 */
const CONCEPTS = {
	criticism : {
		keywords  : [ 'inútil', 'estúpido', 'estúpida', 'malo', 'mala', 'incompetente', 'torpe', 'useless', 'stupid', 'incompetent' ],
		profile    : { desirability: -0.6, moralWeight: 0.7, arousal: 0.3, tendency: 'defense' },
	},
	rejection : {
		keywords  : [ 'vete', 'no te quiero', 'rechazo', 'aléjate', 'go away', 'reject', 'leave me' ],
		profile    : { desirability: -0.8, moralWeight: 0.5, arousal: 0.2, tendency: 'sadness' },
	},
	threat : {
		keywords  : [ 'amenaza', 'te voy a', 'cuidado', 'peligro', 'threat', 'danger', 'warning' ],
		profile    : { desirability: -0.5, moralWeight: 0.3, arousal: 0.8, tendency: 'fear' },
	},
	betrayal : {
		keywords  : [ 'traicion', 'traición', 'mentiste', 'engañaste', 'betray', 'lied', 'deceived' ],
		profile    : { desirability: -0.9, moralWeight: 0.9, arousal: 0.6, tendency: 'anger' },
	},
	affection : {
		keywords  : [ 'quiero', 'encanta', 'adoro', 'cariño', 'love', 'adore', 'care about you' ],
		profile    : { desirability: 0.7, moralWeight: 0.1, arousal: 0.3, tendency: 'warmth' },
	},
	achievement : {
		keywords  : [ 'lograste', 'conseguiste', 'genial trabajo', 'bien hecho', 'well done', 'great job', 'achieved' ],
		profile    : { desirability: 0.6, moralWeight: 0.2, arousal: 0.4, tendency: 'pride' },
	},
	// Real purity/divinity-violation leg of Haidt's CAD triad (Haidt, J.,
	// 2003), distinct from `criticism`/`betrayal` above, which are the
	// community/autonomy legs already covered — feeds `MoralDisgust.js`.
	disgust : {
		keywords  : [ 'asco', 'asqueroso', 'asquerosa', 'repugnante', 'repulsivo', 'inmundo', 'disgusting', 'revolting', 'repulsive' ],
		profile    : { desirability: -0.7, moralWeight: 0.8, arousal: 0.4, tendency: 'disgust' },
	},
}

export class EmotionalOntology {

	/** Which concepts, if any, the text matches. */
	interpret( text ) {

		const tokenSet = new Set( tokenize( text ) )
		const lower      = ( text || '' ).toLowerCase()
		const matches     = []

		for ( const [ concept, def ] of Object.entries( CONCEPTS ) ) {

			const hit = def.keywords.some( kw => kw.includes( ' ' ) ? lower.includes( kw ) : tokenSet.has( kw ) )
			if ( hit ) matches.push( { concept, profile: def.profile } )

		}

		return matches

	}

	/**
	 * Blends ontology matches into an existing appraisal. When the provider
	 * (LLM or heuristic) already produced a signal, this nudges it rather
	 * than overriding it — the ontology is a cross-check, not a replacement.
	 *
	 * `relation` (optional, from Attachment.get(userId)) contextualizes the
	 * match: criticism/rejection/threat from someone already trusted reads
	 * as milder than the same words from someone untrusted; betrayal reads
	 * as *worse* coming from someone trusted ("et tu, Brute" — betrayal by
	 * a stranger barely registers, betrayal by someone trusted cuts deeper).
	 * This direction is a reasonable engineering interpretation, not a
	 * citation of any specific study — see CALIBRATION.md.
	 *
	 * `msSinceLastBetrayal` (optional, from EpisodicMemory.msSinceLastConcept)
	 * further amplifies criticism/rejection/threat within a week of a
	 * betrayal-tagged memory — a period of hypervigilance where the same
	 * words read as more threatening. The general phenomenon (recent
	 * negative experiences raising sensitivity to related cues) is a
	 * well-documented pattern in the trauma/PTSD literature; the specific
	 * "1 week, x1.3" parameters here are our own, not measured — see
	 * CALIBRATION.md.
	 */
	adjustAppraisal( appraisal, matches, relation = null, msSinceLastBetrayal = null ) {

		if ( !matches.length ) return appraisal

		const trust             = relation?.trust ?? 0.5
		const ONE_WEEK_MS         = 7 * 24 * 60 * 60 * 1000
		const hypervigilant        = msSinceLastBetrayal !== null && msSinceLastBetrayal < ONE_WEEK_MS

		const weighted = matches.map( m => {

			let factor = 1
			if ( [ 'criticism', 'rejection', 'threat' ].includes( m.concept ) ) {

				factor = 1.4 - trust * 0.8
				if ( hypervigilant ) factor *= 1.3

			}
			else if ( m.concept === 'betrayal' ) factor = 0.7 + trust * 0.6

			return {
				...m,
				profile : {
					...m.profile,
					desirability : m.profile.desirability * factor,
					moralWeight   : m.profile.moralWeight * factor,
					arousal        : m.profile.arousal * factor,
				},
			}

		} )

		const avg = weighted.reduce( ( acc, m ) => ( {
			desirability : acc.desirability + m.profile.desirability,
			moralWeight   : acc.moralWeight + m.profile.moralWeight,
			arousal        : acc.arousal + m.profile.arousal,
		} ), { desirability: 0, moralWeight: 0, arousal: 0 } )

		const n = weighted.length
		return {
			...appraisal,
			desirability : ( appraisal.desirability + avg.desirability / n ) / 2,
			moralWeight   : Math.max( appraisal.moralWeight ?? 0, avg.moralWeight / n ),
			ontologyArousalBoost : avg.arousal / n,
			concepts      : matches.map( m => m.concept ),
		}

	}

}
