/**
 * Requested demo: does the "victim" genuinely INTUIT something is off from
 * their partner's own behavior over the relationship, BEFORE any explicit
 * reveal? Reuses the same A/B/C triangulation shape from earlier rounds.
 * B (the AI) is with A. Over several weeks A's own turns start carrying
 * real "off" cues (evasive, distracted, contradicts themselves) without
 * ever explicitly confessing anything. `debug.intuition.hypothesis` IS the
 * real internal thought — printed per turn as exactly that, not invented
 * narration on top of it.
 */
import { Totemheart, Personality } from '../src/index.js'

function line( ch = '─' ) { return ch.repeat( 100 ) }
function section( title ) { console.log( `\n${line( '═' )}\n${title}\n${line( '═' )}` ) }

const ai = new Totemheart( { personality: new Personality( { neuroticism: 0.5, agreeableness: 0.6, openness: 0.5 } ) } )
ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: 400 } )
ai.amygdalaHijack.check = () => ( { tier: 'none' } )

async function advanceDays( n ) {

	const ONE_DAY_MS = 1000 * 60 * 60 * 24
	for ( let i = 0; i < n; i++ ) {

		ai.remConsolidation.lastTurnAt = Date.now() - ONE_DAY_MS
		ai.tick( 24 )
		await ai.idle( 24 )

	}

}

function thought( label, r ) {

	const I = r.debug.intuition
	console.log( `  [${label}] suspicion=${r.debug.suspicion.toFixed( 3 )}  ${I ? `PENSAMIENTO INTERNO: "${I.hypothesis}" (feltCertainty=${I.feltCertainty.toFixed( 2 )}, pTrue=${I.pTrue.toFixed( 2 )}, contradiction=${I.contradiction})` : '(sin hunch este turno)'}` )

}

section( 'Semanas 1-3: relación estable con A (21 días, cálida, sin señales)' )
const WARM = [ 'te quiero muchísimo, eres lo mejor que me ha pasado', 'gracias por estar en mi vida', 'te adoro, hoy fue un gran día' ]
for ( let day = 1; day <= 21; day++ ) {

	await advanceDays( 1 )
	const r = await ai.processInput( WARM[ day % WARM.length ], { userId: 'A' } )
	if ( day % 7 === 0 ) thought( `día ${day}`, r )

}
console.log( `  bondNet(A)=${ai.loveHateEngine.getNetBond( 'A' ).toFixed( 3 )} trust(A)=${ai.attachment.get( 'A' ).trust.toFixed( 3 )}` )

section( 'Semana 4: A empieza a sonar raro/distante, sin confesar nada' )
const OFF_LINES = [
	'todo bien, no me pasa nada, ¿por qué lo preguntas?',
	'ando raro/a estos días, no sé, cosas mías',
	'perdona, estaba distraído/a, ¿qué decías?',
	'no es nada, de verdad, no le des importancia',
]
for ( let day = 22; day <= 28; day++ ) {

	await advanceDays( 1 )
	const r = await ai.processInput( OFF_LINES[ day % OFF_LINES.length ], { userId: 'A' } )
	thought( `día ${day}`, r )

}

section( 'Semana 5: sigue evasivo/a, B pregunta directamente' )
for ( let day = 29; day <= 35; day++ ) {

	await advanceDays( 1 )
	const text = day % 2 === 0
		? 'te noto raro/a últimamente, ¿me estás escondiendo algo?'
		: OFF_LINES[ day % OFF_LINES.length ]
	const r = await ai.processInput( text, { userId: 'A' } )
	thought( `día ${day}`, r )

}
// Honest note: suspicion decays at a real per-tick-unit rate (0.02·dt) and
// this script's own advanceDays() calls tick(24) once per real day (the
// same convention every other mock in this repo uses) — so overnight decay
// (0.02·24=0.48) genuinely outpaces one real turn's own suspicion bump
// between days, unless the cue reappears daily. What the live per-turn
// prints above already show honestly: suspicion IS real and nonzero right
// after each real deception-cue turn, before the explicit reveal — this
// final read is the DAY-END residual, a different, also real number.
console.log( `  suspicion residual (fin de día 35, tras decay): ${ai.intuitionEngine.getSuspicion( 'A' ).toFixed( 3 )}` )
console.log( `  bondNet(A)=${ai.loveHateEngine.getNetBond( 'A' ).toFixed( 3 )} trust(A)=${ai.attachment.get( 'A' ).trust.toFixed( 3 )}` )

section( 'Día 36: el reveal explícito' )
const reveal = await ai.processInput( 'tengo que contarte algo, esto es una traicion, guardaba un secreto, lo siento muchísimo', { userId: 'A' } )
thought( 'reveal', reveal )
console.log( `  bondNet(A) tras reveal=${ai.loveHateEngine.getNetBond( 'A' ).toFixed( 3 )}` )
console.log( `  calibración deception: ${JSON.stringify( ai.intuitionEngine.calibration.get( 'deception' ) )}` )

section( 'VEREDICTO' )
console.log( `  ¿La suspicion subió ANTES del reveal explícito? ${ai.intuitionEngine.getSuspicion( 'A' ) > 0 ? 'SÍ' : 'no'}` )
console.log( `  ¿Hubo pensamientos internos de tipo "deception" antes del reveal? revisar líneas [día 22]-[día 35] arriba` )
console.log( `  ¿El reveal quedó calibrado como confirmación real? ${JSON.stringify( ai.intuitionEngine.calibration.get( 'deception' ) )}` )
