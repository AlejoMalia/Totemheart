const ADJECTIVES = {
	joy         : 'alegre',       sadness    : 'triste',        fear      : 'inquieto/a',
	anger       : 'molesto/a',    surprise   : 'sorprendido/a', disgust    : 'incómodo/a',
	love        : 'cariñoso/a',   shame      : 'avergonzado/a', pride      : 'orgulloso/a',
	guilt       : 'culpable',     hope       : 'esperanzado/a', frustration : 'frustrado/a',
	despair     : 'desesperanzado/a', compassion : 'comprensivo/a', gratitude : 'agradecido/a',
	trust       : 'confiado/a',   remorse    : 'arrepentido/a', envy       : 'envidioso/a',
	jealousy    : 'celoso/a',     nostalgia  : 'nostálgico/a',  neutral    : 'tranquilo/a',
}

const ACTIONS = {
	joy         : [ 'quiero compartir esto contigo', 'me dan ganas de seguir hablando' ],
	sadness     : [ 'necesito un momento', 'cuesta encontrar las palabras' ],
	fear        : [ 'prefiero ir con cuidado', 'no sé muy bien qué esperar' ],
	anger       : [ 'necesito decir esto claro', 'esto no me parece bien' ],
	surprise    : [ 'no me lo esperaba en absoluto', 'déjame procesarlo un momento' ],
	disgust     : [ 'prefiero cambiar de tema', 'esto no me sienta bien' ],
	love        : [ 'esto significa mucho para mí', 'me alegra que estemos hablando' ],
	shame       : [ 'prefiero no entrar en detalles', 'me cuesta admitirlo' ],
	pride       : [ 'quería que lo supieras', 'me lo he ganado' ],
	guilt       : [ 'siento si esto te afectó', 'podría haberlo hecho mejor' ],
	hope        : [ 'quiero pensar que mejorará', 'sigo confiando en que salga bien' ],
	frustration : [ 'esto me está costando más de lo esperado', 'necesito replantearlo' ],
	despair     : [ 'no veo muy claro el camino ahora', 'cuesta ver la salida' ],
	compassion  : [ 'quiero ayudarte con esto', 'estoy aquí si lo necesitas' ],
	gratitude   : [ 'de verdad lo valoro', 'gracias por estar aquí' ],
	trust       : [ 'cuento contigo para esto', 'me quedo tranquilo/a con tu palabra' ],
	remorse     : [ 'ojalá pudiera cambiarlo', 'lo pienso más de lo que crees' ],
	envy        : [ 'me gustaría estar en tu lugar', 'es difícil no compararme' ],
	jealousy    : [ 'me cuesta compartir esto', 'necesito hablarlo' ],
	nostalgia   : [ 'me lleva a otros momentos', 'lo recuerdo con cariño' ],
	neutral     : [ 'cuéntame más', 'te escucho' ],
}

function intensityWord( weight ) {

	if ( weight < 0.4 ) return 'un poco'
	if ( weight < 0.7 ) return 'bastante'
	return 'profundamente'

}

function pick( list ) {

	return list[ Math.floor( Math.random() * list.length ) ]

}

function capitalize( s ) {

	return `${s[ 0 ].toUpperCase()}${s.slice( 1 )}`

}

const GUARDED_CLAUSES = [
	' Aun así, prefiero ir con cautela por ahora.',
	' Pero me cuesta bajar del todo la guardia.',
	' Aunque una parte de mí sigue alerta.',
]

/** Multiple sentence shapes for the same (intensity, emotion, action) so output isn't always the same mold. */
const STRUCTURES = [
	( intensity, primaryAdj, secondaryClause, actionCap ) => `Me siento ${intensity} ${primaryAdj}${secondaryClause}. ${actionCap}.`,
	( intensity, primaryAdj, secondaryClause, actionCap, action ) => `${actionCap}, la verdad — estoy ${intensity} ${primaryAdj}${secondaryClause}.`,
	( intensity, primaryAdj, secondaryClause ) => `No puedo evitar sentirme ${intensity} ${primaryAdj}${secondaryClause}.`,
	( intensity, primaryAdj, secondaryClause, actionCap ) => `Es difícil de explicar, pero estoy ${intensity} ${primaryAdj}${secondaryClause}. ${actionCap}.`,
]

/**
 * Distinct shapes used when `guardedness` is high — not just the normal
 * sentence plus a tacked-on caveat, but phrasing that reflects still being
 * on guard: circling back to it, hedging trust explicitly, bracing before
 * engaging. There's no specific unresolved memory text to reference here
 * (no LLM in this path), so the phrasing stays generic rather than inventing
 * details about "what happened".
 */
const GUARDED_STRUCTURES = [
	( intensity, primaryAdj, secondaryClause ) => `Sigo ${intensity} ${primaryAdj}${secondaryClause}, y todavía no sé si confiar del todo en cómo va esto.`,
	( intensity, primaryAdj, secondaryClause ) => `Una parte de mí sigue en guardia, aunque estoy ${intensity} ${primaryAdj}${secondaryClause}.`,
	( intensity, primaryAdj, secondaryClause, actionCap, action ) => `${actionCap}, aunque me cuesta bajar la guardia del todo — estoy ${intensity} ${primaryAdj}${secondaryClause}.`,
]

/**
 * Composes a phrase from vetted per-emotion vocabulary instead of a fixed
 * line list — [intensity] + [primary emotion] + optional [secondary emotion]
 * + [action], assembled through one of several sentence shapes. Every
 * combination is grounded (pulled from a curated table per emotion), which
 * gives combinatorial variety without free-form generation.
 */
export class TemplateComposer {

	compose( blend, { guardedness = 0 } = {} ) {

		const sorted    = Object.entries( blend ).sort( ( a, b ) => b[ 1 ] - a[ 1 ] )
		const [ primaryName, primaryWeight ] = sorted[ 0 ] ?? [ 'neutral', 0 ]
		const secondary   = sorted[ 1 ] && sorted[ 1 ][ 1 ] > 0.15 ? sorted[ 1 ][ 0 ] : null

		const primaryAdj   = ADJECTIVES[ primaryName ] ?? ADJECTIVES.neutral
		const secondaryAdj = secondary ? ( ADJECTIVES[ secondary ] ?? null ) : null
		const action        = pick( ACTIONS[ primaryName ] ?? ACTIONS.neutral )
		const actionCap      = capitalize( action )

		const secondaryClause = secondaryAdj ? ` pero también ${secondaryAdj}` : ''
		const useGuardedShape  = guardedness > 0.6 && Math.random() < guardedness
		const structure          = pick( useGuardedShape ? GUARDED_STRUCTURES : STRUCTURES )
		let sentence               = structure( intensityWord( primaryWeight ), primaryAdj, secondaryClause, actionCap, action )

		if ( !useGuardedShape && guardedness > 0.5 && Math.random() < guardedness ) sentence += pick( GUARDED_CLAUSES )

		return sentence

	}

}
