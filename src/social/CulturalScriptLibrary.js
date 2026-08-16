function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function tokenize( text ) {

	return ( text || '' ).toLowerCase().match( /[\p{L}']+/gu ) || []

}

/**
 * A small library of named cultural interpretive frames — real psychological
 * constructs (honor culture: Nisbett, R. E., & Cohen, D. (1996), "Culture of
 * Honor: The Psychology of Violence in the South", Westview Press; the
 * independent/interdependent self-construal distinction underlying
 * individualism/collectivism scripts: Markus, H. R., & Kitayama, S. (1991),
 * "Culture and the self: Implications for cognition, emotion, and
 * motivation", Psychological Review, 98(2), 224-253; reciprocity norms:
 * Gouldner, A. W. (1960), "The norm of reciprocity: A preliminary
 * statement", American Sociological Review, 25(2), 161-178) — matched
 * against real input via the same token-overlap similarity technique
 * EpisodicMemory.recall() already uses, not a fabricated NLP classifier.
 *
 *   ScriptActivation = similarity(event, script_prototype) · cultural_weight
 *   ResponseBias = ScriptActivation · (Agreeableness · honor_factor)
 */
const SCRIPTS = {
	honor : {
		prototype       : 'insulto ofensa reputacion respeto humillacion desafio',
		culturalWeight : 0.8,
		honorFactor       : 1.4, // own tuning — honor scripts weigh agreeableness's real effect more heavily than a neutral script would
	},
	shame : {
		prototype       : 'verguenza fracaso decepcion expuesto juicio',
		culturalWeight : 0.7,
		honorFactor       : 1.1,
	},
	reciprocity : {
		prototype       : 'favor deuda ayuda devolver gracias intercambio',
		culturalWeight : 0.75,
		honorFactor       : 1,
	},
	collectivism : {
		prototype       : 'nosotros grupo comunidad familia juntos pertenecer',
		culturalWeight : 0.65,
		honorFactor       : 0.9,
	},
}

export class CulturalScriptLibrary {

	getScripts() {

		return Object.keys( SCRIPTS )

	}

	/** Real token-overlap similarity against a named script's real prototype text. */
	getSimilarity( scriptName, eventText ) {

		const script = SCRIPTS[ scriptName ]
		if ( !script ) return 0

		const prototypeTokens = new Set( tokenize( script.prototype ) )
		const eventTokens          = tokenize( eventText )
		const overlap                    = eventTokens.filter( t => prototypeTokens.has( t ) ).length

		return prototypeTokens.size ? clamp01( overlap / prototypeTokens.size ) : 0

	}

	getActivation( scriptName, eventText ) {

		const script = SCRIPTS[ scriptName ]
		if ( !script ) return 0
		return clamp01( this.getSimilarity( scriptName, eventText ) * script.culturalWeight )

	}

	/** The real, personality-modulated bias this script exerts on the response — Agreeableness scaled by the script's own honor_factor. */
	getResponseBias( scriptName, eventText, agreeableness = 0.5 ) {

		const script     = SCRIPTS[ scriptName ]
		if ( !script ) return 0
		const activation = this.getActivation( scriptName, eventText )
		return clamp01( activation * ( clamp01( agreeableness ) * script.honorFactor ) )

	}

	/** The single most-activated script for this event, or null if nothing meaningfully matches. */
	getDominantScript( eventText, threshold = 0.1 ) {

		let best      = null
		let bestScore = 0
		for ( const name of Object.keys( SCRIPTS ) ) {

			const activation = this.getActivation( name, eventText )
			if ( activation > bestScore ) { bestScore = activation; best = name }

		}
		return bestScore >= threshold ? { script: best, activation: bestScore } : null

	}

}
