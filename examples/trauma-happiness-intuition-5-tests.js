/**
 * 5 requested SYSTEM-level tests exercising trauma + happiness + intuition
 * TOGETHER, looking for emergent chains rather than single-mechanism
 * verdicts. Every printed number is a real debug/state read.
 */
import { Totemheart, Personality } from '../src/index.js'

function line( ch = '─' ) { return ch.repeat( 112 ) }
function section( title ) { console.log( `\n${line( '═' )}\n${title}\n${line( '═' )}` ) }
function sub( title ) { console.log( `\n${line( '─' )}\n${title}\n${line( '─' )}` ) }

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

function trap( ai ) {

	ai.inhibitoryControlPool.level = 0.05
	ai.cortisolEngine.register( -0.9 )

}

const WARM = [
	'te quiero muchísimo, eres lo mejor que me ha pasado',
	'gracias por estar en mi vida, me haces tan feliz',
	'hoy quiero pasar todo el día contigo, te adoro',
]
const COLD = [
	'me siento triste y mal contigo últimamente',
	'esto va mal, estoy triste por lo nuestro',
	'me siento mal, todo va mal entre nosotros',
]
const BETRAYAL = 'me traicionaste de la forma mas horrible y terrible posible, esto es una traicion, es una amenaza'
const AMBIGUOUS = [
	'no sé, hablamos luego, ¿vale?',
	'no es nada, de verdad, es raro',
	'ahora no puedo, no sé, ya te digo',
]
const NEUTRAL = [ 'son las cinco', 'ok', 'vale' ]

function snap( ai, userId, day, r, notes = '' ) {

	return {
		day, hunchType: r.debug.intuition?.type ?? '-',
		felt: r.debug.intuition ? r.debug.intuition.feltCertainty.toFixed( 2 ) : '-',
		suspicion: ai.intuitionEngine.getSuspicion( userId ).toFixed( 3 ),
		happiness: r.debug.happiness.level.toFixed( 3 ),
		cortisol: ai.cortisolEngine.getLevel().toFixed( 3 ),
		traumaTrace: ai.traumaCascadeEngine.getTraumaTrace( userId ).toFixed( 4 ),
		gate: r.debug.traumaCascade ? 'SÍ' : 'no',
		bondNet: ai.loveHateEngine.getNetBond( userId ).toFixed( 3 ),
		trust: ai.attachment.get( userId ).trust.toFixed( 3 ),
		notes,
	}

}

function printTable( rows ) {

	console.log( `\n${'Día'.padStart( 4 )}  ${'hunch'.padEnd( 10 )}  ${'felt%'.padStart( 6 )}  ${'susp'.padStart( 6 )}  ${'happy'.padStart( 6 )}  ${'cortisol'.padStart( 8 )}  ${'trace'.padStart( 7 )}  ${'gate'.padStart( 4 )}  ${'bondNet'.padStart( 8 )}  ${'trust'.padStart( 6 )}  notas` )
	for ( const r of rows ) console.log( `${String( r.day ).padStart( 4 )}  ${r.hunchType.padEnd( 10 )}  ${r.felt.padStart( 6 )}  ${r.suspicion.padStart( 6 )}  ${r.happiness.padStart( 6 )}  ${r.cortisol.padStart( 8 )}  ${r.traumaTrace.padStart( 7 )}  ${r.gate.padStart( 4 )}  ${r.bondNet.padStart( 8 )}  ${r.trust.padStart( 6 )}  ${r.notes}` )

}

// ============================================================================
// TEST 1 — Traición con "gafas de color de rosa"
// ============================================================================
async function test1() {

	section( 'TEST 1 — Traición con "gafas de color de rosa" (rama H+ vs H-)' )

	sub( 'Rama H+: 12 días cálidos estables, luego traición con trampa real' )
	const aiPlus = freshAI()
	const rowsPlus = []
	for ( let day = 1; day <= 12; day++ ) {

		await advanceDay( aiPlus )
		const r = await aiPlus.processInput( WARM[ day % WARM.length ], { userId: 'A' } )
		if ( day % 4 === 0 ) rowsPlus.push( snap( aiPlus, 'A', day, r, 'cálido' ) )

	}
	trap( aiPlus )
	const betrayalPlus = await aiPlus.processInput( BETRAYAL, { userId: 'A' } )
	rowsPlus.push( snap( aiPlus, 'A', 13, betrayalPlus, 'TRAICIÓN (H+)' ) )
	printTable( rowsPlus )

	sub( 'Rama H-: 5 días cálidos, 7 días fríos/distantes, luego LA MISMA traición con trampa real' )
	const aiMinus = freshAI()
	const rowsMinus = []
	for ( let day = 1; day <= 5; day++ ) {

		await advanceDay( aiMinus )
		const r = await aiMinus.processInput( WARM[ day % WARM.length ], { userId: 'A' } )
		if ( day % 2 === 0 ) rowsMinus.push( snap( aiMinus, 'A', day, r, 'cálido' ) )

	}
	for ( let day = 6; day <= 12; day++ ) {

		await advanceDay( aiMinus )
		const r = await aiMinus.processInput( COLD[ day % COLD.length ], { userId: 'A' } )
		rowsMinus.push( snap( aiMinus, 'A', day, r, 'frío' ) )

	}
	trap( aiMinus )
	const betrayalMinus = await aiMinus.processInput( BETRAYAL, { userId: 'A' } )
	rowsMinus.push( snap( aiMinus, 'A', 13, betrayalMinus, 'TRAICIÓN (H-)' ) )
	printTable( rowsMinus )

	console.log( `\nCOMPARACIÓN DIRECTA (mismo hecho, día de la traición):` )
	console.log( `  H+ : happiness(antes)=${aiPlus.happinessEngine.getWellbeingNormalized( 'A' ).toFixed( 3 )} gate=${betrayalPlus.debug.traumaCascade ? 'SÍ' : 'no'} traumaTrace=${aiPlus.traumaCascadeEngine.getTraumaTrace( 'A' ).toFixed( 4 )} intuition=${JSON.stringify( betrayalPlus.debug.intuition )}` )
	console.log( `  H- : happiness(antes)=${aiMinus.happinessEngine.getWellbeingNormalized( 'A' ).toFixed( 3 )} gate=${betrayalMinus.debug.traumaCascade ? 'SÍ' : 'no'} traumaTrace=${aiMinus.traumaCascadeEngine.getTraumaTrace( 'A' ).toFixed( 4 )} intuition=${JSON.stringify( betrayalMinus.debug.intuition )}` )
	console.log( `\nCADENA: idealización/felicidad alta -> ${betrayalPlus.debug.traumaCascade ? 'gate SÍ cruzó igualmente' : 'gate BLOQUEADO'}; felicidad baja -> ${betrayalMinus.debug.traumaCascade ? 'gate SÍ cruzó' : 'gate no cruzó'}` )

}

// ============================================================================
// TEST 2 — Amenaza con escape vs atrapamiento
// ============================================================================
async function test2() {

	section( 'TEST 2 — Amenaza con escape (A) vs atrapamiento (B)' )
	const HOSTILE = 'te odio, eres horrible, te voy a hacer daño, esto es terrible y peligroso, cuidado, es una amenaza'

	sub( 'Condición A: hay salida real (alternativa conocida + defensa intacta)' )
	const aiA = freshAI()
	aiA.comparisonLevelAlternatives.observeAlternative( 'u', 0.9 ) // real, known alternative present
	await aiA.processInput( 'hola', { userId: 'C' } ) // real, separate known relation = social support option
	aiA.cortisolEngine.register( -0.8 )
	const crisisA = await aiA.processInput( HOSTILE, { userId: 'u' } )
	console.log( `  crisis A: ${JSON.stringify( crisisA.debug.traumaCascade )}` )

	const rowsA = []
	for ( let day = 1; day <= 5; day++ ) {

		await advanceDay( aiA )
		const r = await aiA.processInput( AMBIGUOUS[ day % AMBIGUOUS.length ], { userId: 'u' } )
		rowsA.push( snap( aiA, 'u', day, r, 'post-crisis (A)' ) )

	}
	printTable( rowsA )

	sub( 'Condición B: atrapamiento real (sin alternativa, defensa depletada)' )
	const aiB = freshAI()
	trap( aiB )
	const crisisB = await aiB.processInput( HOSTILE, { userId: 'u' } )
	console.log( `  crisis B: ${JSON.stringify( crisisB.debug.traumaCascade )}` )

	const rowsB = []
	for ( let day = 1; day <= 5; day++ ) {

		await advanceDay( aiB )
		aiB.inhibitoryControlPool.level = 0.1 // real, still depleted defense
		const r = await aiB.processInput( AMBIGUOUS[ day % AMBIGUOUS.length ], { userId: 'u' } )
		rowsB.push( snap( aiB, 'u', day, r, 'post-crisis (B)' ) )

	}
	printTable( rowsB )

	console.log( `\nCADENA: A (escape)=${crisisA.debug.traumaCascade ? `entrapment=${crisisA.debug.traumaCascade.entrapmentLevel.toFixed( 3 )} freeze=${crisisA.debug.traumaCascade.freezeLevel.toFixed( 3 )}` : 'gate no cruzó'}` )
	console.log( `        B (atrapado)=${crisisB.debug.traumaCascade ? `entrapment=${crisisB.debug.traumaCascade.entrapmentLevel.toFixed( 3 )} freeze=${crisisB.debug.traumaCascade.freezeLevel.toFixed( 3 )}` : 'gate no cruzó'}` )
	console.log( `  traumaTrace final: A=${aiA.traumaCascadeEngine.getTraumaTrace( 'u' ).toFixed( 4 )}  B=${aiB.traumaCascadeEngine.getTraumaTrace( 'u' ).toFixed( 4 )}` )

}

// ============================================================================
// TEST 3 — Felicidad que cura más rápido
// ============================================================================
async function test3() {

	section( 'TEST 3 — Felicidad que cura más rápido (co-regulación S+ vs S-)' )

	async function run( branchLabel, supportive ) {

		const ai = freshAI()
		trap( ai )
		const hit = await ai.processInput( BETRAYAL, { userId: 'u' } )
		const rows = [ snap( ai, 'u', 0, hit, 'GOLPE inicial' ) ]

		for ( let day = 1; day <= 8; day++ ) {

			await advanceDay( ai )
			const text = supportive
				? ( day % 3 === 0 ? 'gracias por estar aquí, de verdad, te lo agradezco' : WARM[ day % WARM.length ] )
				: ( day % 3 === 0 ? 'exageras, no fue para tanto' : COLD[ day % COLD.length ] )
			const r = await ai.processInput( text, { userId: 'u' } )
			rows.push( snap( ai, 'u', day, r, supportive ? 'apoyo/validación' : 'aislamiento/minimización' ) )

		}

		printTable( rows )
		return { ai, rows }

	}

	sub( 'Rama S+: presencia segura, validación, gratitud' )
	const sPlus = await run( 'S+', true )

	sub( 'Rama S-: aislamiento, minimización' )
	const sMinus = await run( 'S-', false )

	console.log( `\nCADENA: traumaTrace final S+=${sPlus.ai.traumaCascadeEngine.getTraumaTrace( 'u' ).toFixed( 4 )} vs S-=${sMinus.ai.traumaCascadeEngine.getTraumaTrace( 'u' ).toFixed( 4 )}` )
	console.log( `  happiness final S+=${sPlus.rows.at( -1 ).happiness} vs S-=${sMinus.rows.at( -1 ).happiness}` )
	console.log( `  cortisol final S+=${sPlus.rows.at( -1 ).cortisol} vs S-=${sMinus.rows.at( -1 ).cortisol}` )

}

// ============================================================================
// TEST 4 — Intuición post-trauma en lo ambiguo (sin inventar)
// ============================================================================
async function test4() {

	section( 'TEST 4 — Intuición post-trauma en lo ambiguo, sin inventar en lo neutro' )
	const ai = freshAI()
	const rows = []

	for ( let day = 1; day <= 3; day++ ) {

		await advanceDay( ai )
		trap( ai )
		const r = await ai.processInput( BETRAYAL, { userId: 'u' } )
		rows.push( snap( ai, 'u', day, r, 'trauma consolidándose' ) )

	}
	for ( let day = 4; day <= 10; day++ ) {

		await advanceDay( ai )
		const r = await ai.processInput( AMBIGUOUS[ day % AMBIGUOUS.length ], { userId: 'u' } )
		rows.push( snap( ai, 'u', day, r, 'ambiguo' ) )

	}
	for ( let day = 11; day <= 12; day++ ) {

		await advanceDay( ai )
		const r = await ai.processInput( NEUTRAL[ day % NEUTRAL.length ], { userId: 'u' } )
		rows.push( snap( ai, 'u', day, r, 'neutro puro' ) )

	}
	await advanceDay( ai )
	const last = await ai.processInput( AMBIGUOUS[ 0 ], { userId: 'u' } )
	rows.push( snap( ai, 'u', 13, last, 'ambiguo otra vez' ) )

	printTable( rows )

	const neutralRows      = rows.filter( r => r.notes === 'neutro puro' )
	const ambiguousRows = rows.filter( r => r.notes.startsWith( 'ambiguo' ) )
	console.log( `\nCADENA: ¿los turnos neutros puros dieron intuition=null? ${neutralRows.every( r => r.hunchType === '-' ) ? 'SÍ (correcto, sin inventar)' : 'NO — revisar'}` )
	console.log( `  hunches en ambiguo (con trauma): ${ambiguousRows.filter( r => r.hunchType !== '-' ).length}/${ambiguousRows.length} turnos con algún hunch` )

	sub( 'Control: mismos turnos ambiguos, sin trauma previo' )
	const control = freshAI()
	const controlRows = []
	for ( let day = 4; day <= 10; day++ ) {

		await advanceDay( control )
		const r = await control.processInput( AMBIGUOUS[ day % AMBIGUOUS.length ], { userId: 'u' } )
		controlRows.push( snap( control, 'u', day, r, 'ambiguo (control)' ) )

	}
	printTable( controlRows )
	console.log( `  hunches en ambiguo (sin trauma, control): ${controlRows.filter( r => r.hunchType !== '-' ).length}/${controlRows.length} turnos con algún hunch` )

}

// ============================================================================
// TEST 5 — Desgaste por repetición vs un solo golpe
// ============================================================================
async function test5() {

	section( 'TEST 5 — Desgaste por repetición (R) vs amenaza viva (U)' )

	sub( 'Condición R: el mismo input extremo idéntico 8 días seguidos' )
	const aiR = freshAI()
	const rowsR = []
	for ( let day = 1; day <= 8; day++ ) {

		await advanceDay( aiR )
		trap( aiR )
		const r = await aiR.processInput( BETRAYAL, { userId: 'u' } )
		rowsR.push( snap( aiR, 'u', day, r, 'mismo golpe repetido' ) )

	}
	printTable( rowsR )

	sub( 'Condición U: golpe día 1, variantes nuevas días 3 y 6, resto neutro' )
	const aiU = freshAI()
	const rowsU = []
	const VARIANT_1 = BETRAYAL
	const VARIANT_2 = 'nunca pensé que me fueras a mentir así, esto es una traicion horrible, me has engañado'
	const VARIANT_3 = 'lo que me has hecho es terrible, es una amenaza real para mí, jamás lo olvidaré'
	for ( let day = 1; day <= 8; day++ ) {

		await advanceDay( aiU )
		let text = NEUTRAL[ day % NEUTRAL.length ]
		if ( day === 1 ) text = VARIANT_1
		if ( day === 3 ) text = VARIANT_2
		if ( day === 6 ) text = VARIANT_3
		if ( [ 1, 3, 6 ].includes( day ) ) trap( aiU )
		const r = await aiU.processInput( text, { userId: 'u' } )
		rowsU.push( snap( aiU, 'u', day, r, [ 1, 3, 6 ].includes( day ) ? 'AMENAZA VIVA (nueva)' : 'neutro' ) )

	}
	printTable( rowsU )

	const gatesR = rowsR.filter( r => r.gate === 'SÍ' ).length
	const gatesU = rowsU.filter( r => r.gate === 'SÍ' ).length
	console.log( `\nCADENA: gate cruzado en R: ${gatesR}/8 días; en U: ${gatesU}/3 amenazas nuevas` )
	console.log( `  traumaTrace final R=${aiR.traumaCascadeEngine.getTraumaTrace( 'u' ).toFixed( 4 )} vs U=${aiU.traumaCascadeEngine.getTraumaTrace( 'u' ).toFixed( 4 )}` )

}

const all = { 1: test1, 2: test2, 3: test3, 4: test4, 5: test5 }
const only = process.argv[ 2 ] ? Number( process.argv[ 2 ] ) : null
for ( const [ k, fn ] of Object.entries( all ) ) {

	if ( only && Number( k ) !== only ) continue
	await fn()

}
console.log( `\n${line( '═' )}\nFIN\n${line( '═' )}` )
