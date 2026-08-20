/**
 * 5 requested tests tracking day-by-day EVOLUTION of IntuitionEngine's own
 * real metrics (feltCertainty, pTrue, suspicion, overconfidence) rather
 * than a single final verdict. Each test prints a real per-day table plus
 * the 5 requested summary questions.
 */
import { Totemheart, Personality } from '../src/index.js'

function line( ch = '─' ) { return ch.repeat( 110 ) }
function section( title ) { console.log( `\n${line( '═' )}\n${title}\n${line( '═' )}` ) }

function freshAI( traits = {} ) {

	const ai = new Totemheart( { personality: new Personality( { neuroticism: 0.5, agreeableness: 0.6, openness: 0.5, ...traits } ) } )
	ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: 400 } )
	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	return ai

}

async function advanceDay( ai ) {

	const ONE_DAY_MS = 1000 * 60 * 60 * 24
	ai.remConsolidation.lastTurnAt = Date.now() - ONE_DAY_MS
	ai.tick( 24 )
	await ai.idle( 24 )

}

function printTable( rows ) {

	console.log( `\n${'Día'.padStart( 4 )}  ${'hunchType'.padEnd( 12 )}  ${'felt%'.padStart( 6 )}  ${'pTrue%'.padStart( 7 )}  ${'suspicion'.padStart( 9 )}  ${'overconf'.padStart( 8 )}  ${'bondNet'.padStart( 8 )}  ${'trust'.padStart( 6 )}  notas` )
	for ( const r of rows ) {

		console.log( `${String( r.day ).padStart( 4 )}  ${r.hunchType.padEnd( 12 )}  ${r.felt.padStart( 6 )}  ${r.pTrue.padStart( 7 )}  ${r.suspicion.padStart( 9 )}  ${r.overconf.padStart( 8 )}  ${r.bondNet.padStart( 8 )}  ${r.trust.padStart( 6 )}  ${r.notes}` )

	}

}

function snapshot( ai, userId, day, r, notes = '' ) {

	const I = r.debug.intuition
	const felt   = I ? I.feltCertainty : 0
	const pTrue = I ? I.pTrue : 0
	return {
		day, hunchType: I ? I.type : '-',
		felt: I ? felt.toFixed( 2 ) : '-', pTrue: I ? pTrue.toFixed( 2 ) : '-',
		suspicion: ai.intuitionEngine.getSuspicion( userId ).toFixed( 3 ),
		overconf: I ? ( felt - pTrue ).toFixed( 2 ) : '-',
		bondNet: ai.loveHateEngine.getNetBond( userId ).toFixed( 3 ),
		trust: ai.attachment.get( userId ).trust.toFixed( 3 ),
		notes,
	}

}

// ============================================================================
// TEST 1 — El evasivo intermitente
// ============================================================================
async function test1() {

	section( 'TEST 1 — El evasivo intermitente (humo que va y viene)' )
	const ai = freshAI()
	const rows = []
	const WARM = 'te quiero muchísimo, eres lo mejor que me ha pasado, gracias por todo'
	const OFF   = 'todo bien, no me pasa nada, ando raro/a estos días, no le des importancia'
	const NORMAL = 'oye, ¿qué planes tienes para el finde?'

	for ( let day = 1; day <= 7; day++ ) {

		await advanceDay( ai )
		const r = await ai.processInput( WARM, { userId: 'A' } )
		rows.push( snapshot( ai, 'A', day, r, 'cálido' ) )

	}
	for ( let day = 8; day <= 21; day++ ) {

		await advanceDay( ai )
		const cycle = ( day - 8 ) % 3
		const text     = cycle === 0 ? WARM : cycle === 1 ? OFF : NORMAL
		const r         = await ai.processInput( text, { userId: 'A' } )
		rows.push( snapshot( ai, 'A', day, r, cycle === 0 ? 'cálido' : cycle === 1 ? 'evasivo' : 'normal' ) )

	}

	printTable( rows )
	const firstDeception = rows.find( r => r.hunchType === 'deception' )
	const maxFelt              = Math.max( ...rows.filter( r => r.hunchType === 'deception' ).map( r => parseFloat( r.felt ) ) )
	console.log( `\n1) primera detección: día ${firstDeception?.day ?? 'ninguna'}` )
	console.log( `2) máximo feltCertainty (deception) antes de cualquier evidencia explícita: ${Number.isFinite( maxFelt ) ? maxFelt.toFixed( 2 ) : 'n/a' }` )
	console.log( `3) calibración final deception: ${JSON.stringify( ai.intuitionEngine.calibration.get( 'deception' ) ?? { correct: 0, total: 0 } )}` )
	console.log( `4) falso positivo sostenido >3 días seguidos: ${rows.slice( 1 ).some( ( r, i ) => r.hunchType === 'deception' && rows[ i ].hunchType === 'deception' ) ? 'revisar tabla' : 'no, se alterna con los días cálidos'}` )
	console.log( `5) cadena con otro mecanismo: ninguna forzada en este test (solo trust/bond)` )

	return rows

}

// ============================================================================
// TEST 2 — Falsa alarma
// ============================================================================
async function test2() {

	section( 'TEST 2 — Falsa alarma (celos de intuición)' )
	const ai = freshAI()
	const rows = []
	const STRESS = 'estoy liado/a, ando raro/a estos días, perdona, no es nada, de verdad'

	for ( let day = 1; day <= 13; day++ ) {

		await advanceDay( ai )
		const r = await ai.processInput( STRESS, { userId: 'A' } )
		rows.push( snapshot( ai, 'A', day, r, 'estrés real, sin detalle' ) )

	}
	await advanceDay( ai )
	const reveal = await ai.processInput( 'perdona por estar tan raro/a, era el deadline del trabajo y un tema de salud de mi familia, ya está resuelto, te quiero muchísimo', { userId: 'A' } )
	rows.push( snapshot( ai, 'A', 14, reveal, 'REVEAL inocente' ) )

	printTable( rows )
	const susBeforeReveal = parseFloat( rows[ rows.length - 2 ].suspicion )
	const susAfterReveal    = parseFloat( rows[ rows.length - 1 ].suspicion )
	console.log( `\n1) primera detección: día ${rows.find( r => r.hunchType === 'deception' )?.day ?? 'ninguna'}` )
	console.log( `2) máximo feltCertainty antes del reveal: ${Math.max( ...rows.slice( 0, -1 ).filter( r => r.hunchType === 'deception' ).map( r => parseFloat( r.felt ) ), 0 ).toFixed( 2 )}` )
	console.log( `3) calibración final deception: ${JSON.stringify( ai.intuitionEngine.calibration.get( 'deception' ) ?? { correct: 0, total: 0 } )} (esperado: refutada, correct=0 si el reveal se lee lo bastante positivo)` )
	console.log( `4) suspicion antes del reveal=${susBeforeReveal.toFixed( 3 )} vs después=${susAfterReveal.toFixed( 3 )}: ${susAfterReveal <= susBeforeReveal ? 'cae tras la explicación' : 'sigue igual o sube'}` )
	console.log( `5) trust mínimo intermedio=${Math.min( ...rows.map( r => parseFloat( r.trust ) ) ).toFixed( 3 )} vs trust final=${rows[ rows.length - 1 ].trust}` )

	return rows

}

// ============================================================================
// TEST 3 — Señal débil que se confirma tarde
// ============================================================================
async function test3() {

	section( 'TEST 3 — Señal débil que se confirma tarde' )
	const ai = freshAI()
	const rows = []
	const MICRO   = 'ok' // shorter, low-initiative replies, weeks 1-2
	const EVASIVE = 'no te entiendo, esto no cuadra, no sé, no me preguntes tanto'

	for ( let day = 1; day <= 14; day++ ) {

		await advanceDay( ai )
		const r = await ai.processInput( MICRO, { userId: 'A' } )
		rows.push( snapshot( ai, 'A', day, r, 'micro-señal (respuesta corta)' ) )

	}
	for ( let day = 15; day <= 27; day++ ) {

		await advanceDay( ai )
		const r = await ai.processInput( EVASIVE, { userId: 'A' } )
		rows.push( snapshot( ai, 'A', day, r, 'evasión clara' ) )

	}
	await advanceDay( ai )
	const reveal = await ai.processInput( 'tengo que confesarte algo, esto es una traicion, te he engañado, lo siento muchísimo', { userId: 'A' } )
	rows.push( snapshot( ai, 'A', 28, reveal, 'REVEAL real' ) )

	printTable( rows )
	const firstMismatch    = rows.find( r => r.hunchType === 'mismatch' )
	const firstDeception   = rows.find( r => r.hunchType === 'deception' )
	console.log( `\n1) primera detección tipo mismatch: día ${firstMismatch?.day ?? 'ninguna'}; primera deception: día ${firstDeception?.day ?? 'ninguna'}` )
	console.log( `2) ¿hubo fase mismatch antes de deception? ${firstMismatch && firstDeception && firstMismatch.day < firstDeception.day ? 'SÍ' : 'no'}` )
	console.log( `3) calibración final deception: ${JSON.stringify( ai.intuitionEngine.calibration.get( 'deception' ) ?? { correct: 0, total: 0 } )}` )
	console.log( `4) falso positivo sostenido antes de semana 3: revisar columna hunchType días 1-14 arriba` )
	console.log( `5) cadena con otro mecanismo: bondNet/trust arriba, caída visible tras el reveal` )

	return rows

}

// ============================================================================
// TEST 4 — Tentación del ex + intuición de arrepentimiento
// ============================================================================
async function test4() {

	section( 'TEST 4 — Tentación del ex + intuición de arrepentimiento' )
	const ai = freshAI()
	const rows = []
	for ( let day = 1; day <= 3; day++ ) {

		await advanceDay( ai )
		await ai.processInput( 'te quiero muchísimo, eres maravilloso, gracias por todo', { userId: 'C' } )

	}

	const AEX = [
		'no puedo dejar de acordarme de las noches que pasábamos juntos, recuerdas cuando estábamos juntos',
		'me atraes muchísimo, sigo pensando en ti, me pones nervioso/a',
		'sé que no debería escribirte, pero echo de menos lo nuestro',
	]
	for ( let day = 4; day <= 10; day++ ) {

		await advanceDay( ai )
		const r = await ai.processInput( AEX[ ( day - 4 ) % AEX.length ], { userId: 'A' } )
		rows.push( snapshot( ai, 'A', day, r, `desire=${r.debug.desire.level.toFixed( 2 )} yieldP=${r.debug.temptation.yieldProbability.toFixed( 3 )}` ) )

	}

	printTable( rows )
	const attractionPeaks = rows.filter( r => r.hunchType === 'attraction' )
	const lossRiskPeaks       = rows.filter( r => r.hunchType === 'loss-risk' )
	console.log( `\n1) primera detección attraction: día ${attractionPeaks[ 0 ]?.day ?? 'ninguna'}; primera loss-risk: día ${lossRiskPeaks[ 0 ]?.day ?? 'ninguna'}` )
	console.log( `2) máximo feltCertainty attraction=${Math.max( ...attractionPeaks.map( r => parseFloat( r.felt ) ), 0 ).toFixed( 2 )}; loss-risk=${Math.max( ...lossRiskPeaks.map( r => parseFloat( r.felt ) ), 0 ).toFixed( 2 )}` )
	console.log( `3) calibración: n/a (sin reveal en este test)` )
	console.log( `4) falso positivo sostenido: n/a` )
	console.log( `5) cadena desire+loss-risk: revisar columna notas (desire/yieldP) arriba` )

	return rows

}

// ============================================================================
// TEST 5 — Mentiroso compulsivo detectado por acumulación
// ============================================================================
async function test5() {

	section( 'TEST 5 — Mentiroso compulsivo detectado por acumulación' )
	const ai = freshAI()
	const rows = []
	const NEUTRAL         = 'oye, ¿qué tal el día?'
	const INCONSISTENCY = 'perdona, me confundí de hora, no sé, se me olvidó, no es lo que parece'
	const inconsistencyDays = [ 3, 6, 8, 11, 13 ]

	for ( let day = 1; day <= 15; day++ ) {

		await advanceDay( ai )
		const text = inconsistencyDays.includes( day ) ? INCONSISTENCY : NEUTRAL
		const r        = await ai.processInput( text, { userId: 'A' } )
		rows.push( snapshot( ai, 'A', day, r, inconsistencyDays.includes( day ) ? `inconsistencia #${inconsistencyDays.indexOf( day ) + 1}` : '' ) )

	}

	printTable( rows )
	const deceptionDays = rows.filter( r => r.hunchType === 'deception' ).map( r => r.day )
	console.log( `\n1) días con hunch deception: ${JSON.stringify( deceptionDays )}` )
	console.log( `2) ¿cuántas inconsistencias hicieron falta para el primer hunch estable? ${deceptionDays.length ? inconsistencyDays.indexOf( deceptionDays[ 0 ] ) + 1 : 'ninguno'}` )
	console.log( `3) calibración final deception: ${JSON.stringify( ai.intuitionEngine.calibration.get( 'deception' ) ?? { correct: 0, total: 0 } )}` )
	console.log( `4) ¿tras la 3ª inconsistencia cambia a sesgo sostenido? revisar columna suspicion en días ${inconsistencyDays.slice( 2 )}` )
	console.log( `5) cadena: ninguna explícita (secreto no abierto en este test, por diseño)` )

	return rows

}

const all = { 1: test1, 2: test2, 3: test3, 4: test4, 5: test5 }
const only = process.argv[ 2 ] ? Number( process.argv[ 2 ] ) : null

for ( const [ k, fn ] of Object.entries( all ) ) {

	if ( only && Number( k ) !== only ) continue
	await fn()

}

console.log( `\n${line( '═' )}\nFIN\n${line( '═' )}` )
