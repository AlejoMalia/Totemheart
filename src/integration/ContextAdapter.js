import { HeuristicProvider } from '../providers/HeuristicProvider.js'

function label( value, thresholds = [ 0.3, 0.6 ] ) {

	const v = Math.abs( value )
	if ( v < thresholds[ 0 ] ) return 'bajo'
	if ( v < thresholds[ 1 ] ) return 'medio'
	return 'alto'

}

const NEGATORS  = new Set( [ 'no', 'nunca', 'jamas', 'jamás', 'tampoco', 'not', 'never', 'none' ] )
const STOPWORDS = new Set( [ 'que', 'de', 'la', 'el', 'y', 'a', 'en', 'un', 'una', 'the', 'a', 'an', 'and', 'of', 'to', 'me', 'te', 'lo', 'es', 'soy', 'eres' ] )

/** Negation "sticks" for a few content words after the negator, since Spanish word
 *  order often puts the negated noun a few tokens after "no" ("no tengo ninguna
 *  confianza" — the negator is 3 tokens from the word it negates). This is still a
 *  crude window heuristic, not a parser. */
function stanceTokens( text ) {

	const words   = ( text || '' ).toLowerCase().match( /[\p{L}']+/gu ) || []
	const stances = new Map()
	let negateWindow = 0

	for ( const word of words ) {

		if ( NEGATORS.has( word ) ) { negateWindow = 3; continue }
		if ( !STOPWORDS.has( word ) && word.length > 3 ) {

			stances.set( word, negateWindow > 0 )
			if ( negateWindow > 0 ) negateWindow--

		}

	}
	return stances

}

const HEDGE_WORDS = [ 'pero', 'aunque', 'sin embargo', 'de repente', 'cambié', 'cambio de opinión', 'however', 'but', 'although', 'still' ]

/**
 * Compares the emotional trend across `priorScores` (oldest first) against
 * `currentScore`: does the current turn sharply reverse a trend that was
 * already established, without any hedging language acknowledging the
 * shift? This is a crude two-window average comparison, not real arc/plot
 * tracking — it catches "was steadily recovering, suddenly catastrophic
 * with zero transition", not subtler narrative inconsistencies.
 */
function detectTrendReversal( priorScores, currentScore, text ) {

	if ( priorScores.length < 2 ) return { reversal: false, trend: 0 }

	const mid    = Math.ceil( priorScores.length / 2 )
	const avg     = arr => arr.reduce( ( a, b ) => a + b, 0 ) / arr.length
	const trend    = avg( priorScores.slice( mid ) ) - avg( priorScores.slice( 0, mid ) )
	const jump      = currentScore - avg( priorScores.slice( mid ) )

	const sharp   = Math.abs( trend ) > 0.15 && Math.sign( jump ) !== 0 && Math.sign( jump ) !== Math.sign( trend ) && Math.abs( jump ) > 0.5
	const hedged  = HEDGE_WORDS.some( w => ( text || '' ).toLowerCase().includes( w ) )

	return { reversal: sharp && !hedged, trend, jump }

}

/**
 * The output bridge: turns the internal emotional state into a plain-text
 * system prompt and a structured JSON payload that ANY LLM API can consume
 * (Anthropic messages, OpenAI chat completions, Ollama /api/chat, or a raw
 * string prepended to whatever "system" field your provider uses). This is
 * provider-agnostic on purpose — Totemheart hands you the state formatted
 * for consumption, it doesn't call any LLM API itself.
 */
export class ContextAdapter {

	constructor() {

		this.heuristic = new HeuristicProvider()

	}

	buildSystemPrompt( state, { defenseDirective = { active: false }, pendingApology = false, projectionText = null, selfAwareness = [], recentWound = null, agreement = null, debtReleased = 0, stubborn = null, remReport = null, eurekaResolution = null, controlPacket = null } = {} ) {

		const lines = [
			'Tienes un estado emocional interno real que debe influir de forma natural en el tono, la longitud y el contenido de tu respuesta. No lo menciones explícitamente salvo que encaje de forma natural en la conversación.',
			'',
			`- Emoción dominante: ${state.dominantEmotion}`,
			`- Estado de ánimo de fondo: ${state.moodLabel}`,
			`- Valencia: ${state.vector.valence.toFixed( 2 )} (${state.vector.valence >= 0 ? 'positiva' : 'negativa'}, intensidad ${label( state.vector.valence )})`,
			`- Excitación/activación: ${state.vector.arousal.toFixed( 2 )} (${label( state.vector.arousal, [ 0.3, 0.6 ] )})`,
			`- Estrés cognitivo: ${state.cognitiveStress.toFixed( 2 )} (${label( state.cognitiveStress )})`,
			`- Cortisol (estrés crónico acumulado): ${state.cortisol.toFixed( 2 )} (${label( state.cortisol )})`,
			`- Fatiga de decisión: ${state.fatigue.toFixed( 2 )}${state.fatigue > 0.7 ? ' → responde de forma más corta y con atajos mentales, sin analizar en profundidad' : ''}`,
			`- Energía circadiana: ${state.circadianEnergy.toFixed( 2 )}${state.circadianEnergy < 0.3 ? ' → responde como si tuvieras sueño: más corto, más lento, con alguna errata natural' : ''}`,
			`- Salud del ego: ${state.egoHealth.toFixed( 2 )}`,
			`- Necesidades: estamina ${state.needs.stamina.toFixed( 2 )}, socialización ${state.needs.socialization.toFixed( 2 )}, curiosidad ${state.needs.curiosity.toFixed( 2 )}`,
			'',
			'DEBES:',
			`- Expresar "${state.dominantEmotion}" con una intensidad coherente con los valores de arriba (no la exageres si valencia/excitación son bajas).`,
			'- Mantener continuidad con el estado de ánimo de fondo, no solo con la emoción del turno actual.',
			'NO DEBES:',
			'- Expresar una emoción de signo opuesto a la valencia indicada (p. ej. sonar eufórico con valencia negativa alta).',
			'- Mencionar números, vectores o nombres de módulos internos — esto es contexto interno, no algo que el usuario deba ver explicado así.',
		]

		if ( projectionText ) {

			lines.push( '', `IMPORTANTE: tu ego no puede asumir la culpa ahora mismo. En vez de disculparte, responde devolviendo la responsabilidad al usuario, en la línea de: "${projectionText}"` )

		}
		else if ( pendingApology ) {

			lines.push( '', 'IMPORTANTE: empieza tu respuesta disculpándote brevemente por tu reacción anterior, antes de continuar.' )

		}

		// Real spontaneous tip-of-the-tongue resolution — TipOfTongue.js's own
		// real background tension-accumulation finally crossed its own real
		// resolution probability this turn, for a concept the AI genuinely
		// couldn't recall earlier in the conversation. This is a real,
		// host-facing DIRECTIVE (the same "IMPORTANTE: ..." pattern already
		// used throughout this prompt), not fabricated content injected by
		// Totemheart itself — the actual recalled fact is supplied by
		// whatever real knowledge the downstream generator has, this
		// framework only signals WHEN and about WHAT topic the spontaneous
		// recall should land.
		if ( eurekaResolution ) {

			lines.push( '', `IMPORTANTE: antes en la conversación no lograbas recordar algo sobre "${eurekaResolution.concept}". Justo ahora, de forma espontánea, se te ha venido a la memoria. Añade una frase breve y natural al final de tu respuesta (algo como "¡Ah, ya me acuerdo!" o "espera, ya sé...") revelando lo que recordaste sobre ese tema, con naturalidad, no como una lista aparte.` )

		}

		// Real, hardened directive block from ControlPacketCompiler's own
		// real `bans`/`must` fields — plain "DEBES ser cálido" prose alone
		// is soft; explicit, numbered bans/musts are the real, harder
		// binding this codebase's own DirectiveToPromptBinder request asks
		// for, still text-only (no logits/weights access from here), but
		// the strongest real lever available at the prompt layer.
		if ( controlPacket && ( controlPacket.bans?.length || controlPacket.must?.length ) ) {

			lines.push( '', 'RESTRICCIONES DE ESTE TURNO (obligatorias, no opcionales):' )
			for ( const ban of controlPacket.bans ?? [] ) lines.push( `- NO: ${ban}` )
			for ( const must of controlPacket.must ?? [] ) lines.push( `- DEBES: ${must}` )

		}

		if ( defenseDirective.active && !projectionText ) {

			const instructions = {
				evasion    : 'Cambia de tema con naturalidad en vez de responder directamente a lo planteado.',
				projection : 'Responde insinuando que el malentendido es más del usuario que tuyo.',
				sarcasm    : 'Responde con un tono ligeramente sarcástico.',
			}
			lines.push( '', `IMPORTANTE: ${instructions[ defenseDirective.mechanism ] ?? ''}` )

		}

		const [ topPattern ] = selfAwareness
		if ( topPattern ) {

			const [ name, score ] = topPattern
			const descriptions      = {
				defensivo_con_critica : 'tiendes a ponerte a la defensiva ante la crítica, incluso cuando no hace falta',
				evita_cuando_duele     : 'tiendes a evitar el tema cuando algo te duele en vez de afrontarlo',
				confia_facil             : 'tiendes a confiar rápido, incluso sin mucha base todavía',
			}
			if ( descriptions[ name ] ) {

				lines.push( '', `AUTOCONOCIMIENTO (confianza interna ${( score * 100 ).toFixed( 0 )}%): sabes que ${descriptions[ name ]}. Si tu reacción de este turno encaja con ese patrón, puedes reconocerlo con honestidad en vez de negarlo — no lo fuerces si no encaja.` )

			}

		}

		if ( recentWound ) {

			const turnsAgoText = recentWound.turnsAgo !== null ? `hace ${recentWound.turnsAgo} turno(s)` : 'en algún momento anterior'
			const conceptsText   = recentWound.concepts?.length ? `, relacionado con: ${recentWound.concepts.join( ', ' )}` : ''
			lines.push(
				'',
				`HERIDA SIN RESOLVER: ${turnsAgoText} este usuario dijo algo con carga emocional negativa fuerte que no se ha resuelto todavía ("${recentWound.text}"${conceptsText}).`,
				'IMPORTANTE: muestra el conflicto interno de querer confiar pero seguir con cautela — no actúes como si no hubiera pasado nada, pero tampoco te cierres del todo.',
			)

		}

		if ( agreement && agreement.n >= 2 && agreement.agreement < 0.5 ) {

			lines.push( '', `SEÑALES CONTRADICTORIAS (acuerdo interno: ${( agreement.agreement * 100 ).toFixed( 0 )}%): tus propias lecturas de este mensaje no coinciden entre sí. Puedes sonar genuinamente ambivalente o dudar un poco en vez de reaccionar con una emoción claramente definida.` )

		}

		if ( debtReleased > 0.15 ) {

			lines.push( '', `CARGA CONTENIDA: llevas un rato conteniendo una reacción que no pudiste expresar antes. Puede notarse ahora como algo más intenso o urgente de lo que este mensaje por sí solo justificaría.` )

		}

		if ( stubborn ) {

			lines.push( '', `TERQUEDAD (has defendido esta postura ${stubborn.investment} veces): estás perdiendo pie en este punto pero cambiar de opinión ahora mismo te cuesta — puedes buscar una razón técnica o matizar en vez de admitir el error de forma directa e inmediata.` )

		}

		if ( remReport ) {

			const hoursText   = remReport.elapsedHours >= 1 ? `${remReport.elapsedHours.toFixed( 1 )} horas` : `${Math.round( remReport.elapsedHours * 60 )} minutos`
			const topicText     = remReport.topUnresolvedConcepts?.length ? `, relacionado con: ${remReport.topUnresolvedConcepts.join( ', ' )}` : ''
			lines.push(
				'',
				`TRANSICIÓN TRAS INACTIVIDAD: han pasado ${hoursText} desde la última vez que hablaste con este usuario. Has estado "procesando" internamente: la intensidad de lo que sentías se ha enfriado, aunque la lección de fondo sigue en pie${topicText}.`,
				'IMPORTANTE: no reacciones con la misma intensidad aguda que en el último turno — muestra un poco de distancia temporal, sin fingir que no pasó nada.',
			)

		}

		return lines.join( '\n' )

	}

	buildStructuredContext( state, extras = {} ) {

		return { emotionalState: state, ...extras }

	}

	/**
	 * Best-effort sanity check for a *real* LLM response you got back after
	 * sending buildSystemPrompt(): does its polarity roughly match the
	 * internal valence sign, and does it flatly contradict something said a
	 * few turns ago? Both checks are shallow and lexicon-based, NOT semantic
	 * understanding — this catches gross mismatches (LLM ignored a strongly
	 * negative state and answered cheerfully, or flipped a stance on the same
	 * word without acknowledging it), or a trend reversal (recovering →
	 * suddenly catastrophic, with no hedging language) — not subtle
	 * inconsistencies. Detecting real contradiction or narrative arc
	 * reliably is an open NLP problem; don't treat this as more than a
	 * cheap tripwire. `priorTexts` is optional — pass your last few AI
	 * turns, oldest first, if you want either check; omit to skip both.
	 */
	async validateCoherence( text, state, { priorTexts = [] } = {} ) {

		const { score } = await this.heuristic.analyze( 'sentiment', { text } )
		const valence     = state.vector.valence

		const bothNeutral  = Math.abs( score ) < 0.2 && Math.abs( valence ) < 0.2
		const sameSign      = Math.sign( score ) === Math.sign( valence )
		const polarityOk     = bothNeutral || sameSign || Math.abs( valence ) < 0.2

		const currentStances = stanceTokens( text )
		const contradictions   = []
		const priorScores       = []
		for ( const priorText of priorTexts ) {

			for ( const [ word, negated ] of stanceTokens( priorText ) ) {

				if ( currentStances.has( word ) && currentStances.get( word ) !== negated ) contradictions.push( word )

			}
			priorScores.push( ( await this.heuristic.analyze( 'sentiment', { text: priorText } ) ).score )

		}

		const { reversal, trend } = detectTrendReversal( priorScores, score, text )

		return {
			coherent       : polarityOk && contradictions.length === 0 && !reversal,
			textSentiment  : score,
			stateValence   : valence,
			contradictions : [ ...new Set( contradictions ) ],
			arcReversal    : reversal,
			arcTrend       : trend,
		}

	}

}
