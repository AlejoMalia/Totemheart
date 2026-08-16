import { LanguageProvider } from './LanguageProvider.js'

const POSITIVE = new Set( [
	'bien', 'bueno', 'buena', 'genial', 'excelente', 'maravilloso', 'maravillosa', 'maravilla', 'feliz', 'alegre',
	'gracias', 'encanta', 'encantado', 'encantada', 'amor', 'quiero', 'perfecto', 'perfecta', 'increible',
	'increíble', 'contento', 'contenta', 'orgulloso', 'orgullosa', 'fantastico', 'fantástico', 'divertido',
	'good', 'great', 'excellent', 'wonderful', 'happy', 'thanks', 'thank', 'love', 'perfect', 'amazing',
	'awesome', 'glad', 'nice', 'fantastic', 'fun', 'proud',
] )

const NEGATIVE = new Set( [
	'mal', 'malo', 'mala', 'triste', 'horrible', 'odio', 'odioso', 'feo', 'fea', 'enfadado', 'enfadada',
	'enojado', 'enojada', 'furioso', 'furiosa', 'asco', 'miedo', 'terrible', 'pesimo', 'pésimo', 'decepcion',
	'decepción', 'decepcionado', 'decepcionada', 'dolor', 'culpa', 'verguenza', 'vergüenza', 'envidia',
	'tonto', 'tonta', 'torpe', 'patetico', 'patético', 'patetica', 'patética', 'ridiculo', 'ridículo',
	'bad', 'sad', 'horrible', 'hate', 'awful', 'ugly', 'angry', 'furious', 'disgust', 'fear', 'terrible',
	'worst', 'disappointed', 'pain', 'guilt', 'shame', 'envy', 'stupid', 'idiot', 'pathetic', 'ridiculous',
] )

const NEGATORS = new Set( [ 'no', 'nunca', 'jamas', 'jamás', 'tampoco', 'not', 'never', 'none' ] )

const HARSH_WORDS = new Set( [
	'idiota', 'estupido', 'estúpido', 'callate', 'cállate', 'odio', 'inutil', 'inútil',
	'idiot', 'stupid', 'shutup', 'hate', 'useless', 'dumb',
] )

const SELF_PRONOUNS = new Set( [ 'yo', 'me', 'mi', 'mí', 'i', 'me', 'my', 'myself' ] )
const OTHER_PRONOUNS = new Set( [ 'tu', 'tú', 'te', 'usted', 'vos', 'you', 'your' ] )

function tokenize( text ) {

	return ( text || '' )
		.toLowerCase()
		.normalize( 'NFC' )
		.match( /[\p{L}']+/gu ) || []

}

/**
 * Zero-dependency fallback language provider.
 * Lexicon-based polarity (ES/EN) with simple negation handling.
 * Used automatically whenever no external provider is configured or an
 * external provider fails, so the pipeline never breaks.
 */
export class HeuristicProvider extends LanguageProvider {

	async analyze( task, payload = {} ) {

		switch ( task ) {

			case 'sentiment' :
				return this.#sentiment( payload.text )
			case 'appraisal' :
				return this.#appraisal( payload.text )
			case 'beliefConflict' :
				return this.#beliefConflict( payload.text, payload.beliefs )
			case 'mentalState' :
				return this.#mentalState( payload.text )
			case 'selfCritique' :
				return this.#selfCritique( payload.text )
			default :
				return { score: 0 }

		}

	}

	#sentiment( text ) {

		const tokens = tokenize( text )
		let score    = 0
		let negate   = false

		for ( const token of tokens ) {

			if ( NEGATORS.has( token ) ) {

				negate = true
				continue

			}
			if ( POSITIVE.has( token ) ) score += negate ? -1 : 1
			else if ( NEGATIVE.has( token ) ) score += negate ? 1 : -1

			if ( POSITIVE.has( token ) || NEGATIVE.has( token ) ) negate = false

		}

		const normalized = tokens.length ? score / Math.sqrt( tokens.length ) : 0
		return { score: Math.max( -1, Math.min( 1, normalized ) ) }

	}

	#appraisal( text ) {

		const { score }  = this.#sentiment( text )
		const tokens      = tokenize( text )
		const hasSelf      = tokens.some( t => SELF_PRONOUNS.has( t ) )
		const hasOther     = tokens.some( t => OTHER_PRONOUNS.has( t ) )
		const agency       = hasOther ? 'user' : ( hasSelf ? 'self' : 'other' )
		const exclaim       = /[!¡]/.test( text || '' )

		return {
			desirability : score,
			agency,
			expectedness : exclaim ? 0.2 : 0.6,
			moralWeight  : Math.abs( score ) > 0.6 ? 0.7 : ( Math.abs( score ) > 0.2 ? 0.3 : 0 ),
		}

	}

	#beliefConflict( text, beliefs = [] ) {

		const tokens = new Set( tokenize( text ) )
		const negate = [ ...tokens ].some( t => NEGATORS.has( t ) )
		let best     = 0

		for ( const belief of beliefs ) {

			const beliefTokens  = tokenize( belief.statement )
			const overlap       = beliefTokens.filter( t => tokens.has( t ) ).length
			if ( !overlap ) continue
			const matchRatio    = overlap / beliefTokens.length
			const polarityFlip  = negate ? 1 : 0
			const conflict      = matchRatio * ( polarityFlip ? 1 : 0.15 )
			if ( conflict > best ) best = conflict

		}

		return { score: Math.max( 0, Math.min( 1, best ) ) }

	}

	#mentalState( text ) {

		const { score } = this.#sentiment( text )
		const isQuestion = /\?/.test( text || '' )
		const emotion    = score > 0.3 ? 'joy' : score < -0.3 ? 'sadness' : 'neutral'

		return {
			inferredEmotion : emotion,
			inferredIntent  : isQuestion ? 'question' : 'statement',
			valence         : score,
		}

	}

	#selfCritique( text ) {

		const tokens    = tokenize( text )
		const harshHits = tokens.filter( t => HARSH_WORDS.has( t ) ).length
		return { score: Math.min( 1, harshHits * 0.5 ) }

	}

}
