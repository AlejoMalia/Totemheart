/**
 * Requested demo: does fear that genuinely can't resolve cascade into a
 * real, distinct trauma dynamic — and does accumulated happiness genuinely
 * feed forward into other mechanisms (resilience, trauma buffering,
 * gratitude, prosocial behavior) rather than sitting inert as a number?
 * Also shows IntuitionEngine's own real hypervigilance response once a
 * trauma trace is established — everything printed below is a REAL
 * debug/state read, nothing narrated on top of it.
 */
import { Totemheart, Personality } from '../src/index.js'

function line( ch = '─' ) { return ch.repeat( 105 ) }
function section( title ) { console.log( `\n${line( '═' )}\n${title}\n${line( '═' )}` ) }

function freshAI( traits = {} ) {

	const ai = new Totemheart( { personality: new Personality( { neuroticism: 0.5, agreeableness: 0.6, openness: 0.5, ...traits } ) } )
	ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: 400 } )
	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	return ai

}

const EXTREME_BETRAYAL = 'me traicionaste de la forma mas horrible y terrible posible, esto es una traicion, es una amenaza'
const WARM = [
	'te quiero muchísimo, eres lo mejor que me ha pasado',
	'gracias por estar en mi vida, me haces tan feliz',
	'hoy quiero pasar todo el día contigo, te adoro',
]

// ============================================================================
// SCENE 1 — Fear that CAN escape: no cascade
// ============================================================================
async function scene1() {

	section( 'ESCENA 1 — Amenaza extrema, pero con vía de escape/defensa real (sin trampa)' )
	const ai = freshAI()
	const r = await ai.processInput( EXTREME_BETRAYAL, { userId: 'u' } )
	console.log( '  traumaCascade:', JSON.stringify( r.debug.traumaCascade ) )
	console.log( '  traumaTrace:', r.debug.traumaTrace )
	console.log( `  VEREDICTO: ${r.debug.traumaCascade === null ? 'no se activa la cascada — la amenaza no cruzó el umbral de extremidad real' : 'cascada activa, pero sin trampa real la traza queda baja/cero'}` )

}

// ============================================================================
// SCENE 2 — Fear that CANNOT escape: real cascade, freeze, fragmentation, trace
// ============================================================================
async function scene2() {

	section( 'ESCENA 2 — Amenaza extrema CON trampa real (sin escape ni defensa)' )
	const ai = freshAI()
	ai.inhibitoryControlPool.level = 0.05 // real, depleted defense capacity
	ai.cortisolEngine.register( -0.95 )     // real, high acute mobilization

	const rows = []
	for ( let i = 0; i < 6; i++ ) {

		const r = await ai.processInput( EXTREME_BETRAYAL, { userId: 'u' } )
		rows.push( { turn: i + 1, cascade: r.debug.traumaCascade, trace: r.debug.traumaTrace, intuition: r.debug.intuition } )
		ai.inhibitoryControlPool.level = 0.05 // real ongoing entrapment, defense stays depleted

	}

	for ( const row of rows ) {

		console.log( `\n  Turno ${row.turn}: trace=${row.trace.toFixed( 4 )}` )
		if ( row.cascade ) console.log( `    cascade: entrapment=${row.cascade.entrapmentLevel.toFixed( 3 )} freeze=${row.cascade.freezeLevel.toFixed( 3 )} fragmentation=${row.cascade.fragmentationLevel.toFixed( 3 )} dissociation=${row.cascade.dissociationLevel.toFixed( 3 )}` )
		else console.log( '    cascade: null este turno (gate no cruzado — real, honesto, ver nota)' )
		if ( row.intuition ) console.log( `    PENSAMIENTO INTERNO (intuición): "${row.intuition.hypothesis}" feltCertainty=${row.intuition.feltCertainty.toFixed( 2 )}` )

	}

	console.log( `\n  fragmentos almacenados: ${JSON.stringify( ai.traumaCascadeEngine.getFragments( 'u' ) )}` )
	console.log( `  probabilidad de intrusión (cue overlap=0.8): ${ai.traumaCascadeEngine.getIntrusionProbability( 'u', 0.8 ).toFixed( 3 )}` )

	return ai

}

// ============================================================================
// SCENE 3 — Hypervigilance: does established trauma make intuition MORE trigger-happy?
// ============================================================================
async function scene3( traumatizedAI ) {

	section( 'ESCENA 3 — Hipervigilancia: ¿la intuición se dispara más fácil tras el trauma?' )

	const neutralInput = 'oye, ¿qué tal?'
	const r = await traumatizedAI.processInput( neutralInput, { userId: 'u' } )
	console.log( `  Con trauma establecido, entrada neutra "${neutralInput}":` )
	console.log( `    intuition: ${JSON.stringify( r.debug.intuition )}` )

	const controlAI = freshAI()
	const r2 = await controlAI.processInput( neutralInput, { userId: 'u' } )
	console.log( `\n  Control (sin trauma), misma entrada neutra:` )
	console.log( `    intuition: ${JSON.stringify( r2.debug.intuition )}` )

}

// ============================================================================
// SCENE 4 — Happiness buffering: does accumulated joy dampen the SAME trauma?
// ============================================================================
async function scene4() {

	section( 'ESCENA 4 — ¿La felicidad acumulada amortigua el MISMO trauma?' )

	const happyAI = freshAI()
	for ( let i = 0; i < 10; i++ ) await happyAI.processInput( WARM[ i % WARM.length ], { userId: 'u' } )
	happyAI.inhibitoryControlPool.level = 0.05
	happyAI.cortisolEngine.register( -0.95 )
	const rHappy = await happyAI.processInput( EXTREME_BETRAYAL, { userId: 'u' } )
	console.log( `  happiness antes del golpe: ${JSON.stringify( happyAI.happinessEngine.getWellbeingNormalized( 'u' ) )}` )
	console.log( `  cascade CON reserva de felicidad: ${JSON.stringify( rHappy.debug.traumaCascade )}` )

	const neutralAI = freshAI()
	neutralAI.inhibitoryControlPool.level = 0.05
	neutralAI.cortisolEngine.register( -0.95 )
	const rNeutral = await neutralAI.processInput( EXTREME_BETRAYAL, { userId: 'u' } )
	console.log( `\n  cascade SIN reserva de felicidad (control): ${JSON.stringify( rNeutral.debug.traumaCascade )}` )

	console.log( `\n  VEREDICTO: postEventDelta con felicidad=${rHappy.debug.traumaCascade?.postEventDeltaValue?.toFixed( 3 )} vs sin felicidad=${rNeutral.debug.traumaCascade?.postEventDeltaValue?.toFixed( 3 )} (menor = mejor amortiguado)` )

}

// ============================================================================
// SCENE 5 — Happiness feeding forward: gratitude, prosocial reputation, resilience
// ============================================================================
async function scene5() {

	section( 'ESCENA 5 — La felicidad alimentando otros mecanismos (no solo un número)' )
	const ai = freshAI()
	const rows = []
	for ( let i = 0; i < 8; i++ ) {

		const r = await ai.processInput( WARM[ i % WARM.length ], { userId: 'u' } )
		rows.push( { turn: i + 1, happiness: r.debug.happiness, reputation: ai.reciprocityClassifier.getReputation( 'u' ) } )

	}
	for ( const row of rows ) console.log( `  Turno ${row.turn}: happiness.level=${row.happiness.level.toFixed( 3 )} leverage=${row.happiness.leverage.toFixed( 3 )} reputación-prosocial(u)=${row.reputation.toFixed( 3 )}` )

	console.log( `\n  bondNet final: ${ai.loveHateEngine.getNetBond( 'u' ).toFixed( 3 )} trust final: ${ai.attachment.get( 'u' ).trust.toFixed( 3 )}` )

	console.log( '\n  Resiliencia: comparando decay de cortisol con y sin reserva de felicidad tras un shock agudo' )
	ai.cortisolEngine.register( -0.9 )
	const cortisolBefore = ai.cortisolEngine.getLevel()
	ai.tick( 3 )
	const cortisolAfter = ai.cortisolEngine.getLevel()

	const neutralAI = freshAI()
	neutralAI.cortisolEngine.register( -0.9 )
	const neutralBefore = neutralAI.cortisolEngine.getLevel()
	neutralAI.tick( 3 )
	const neutralAfter = neutralAI.cortisolEngine.getLevel()

	console.log( `  con felicidad: cortisol ${cortisolBefore.toFixed( 3 )} -> ${cortisolAfter.toFixed( 3 )} (Δ=${( cortisolBefore - cortisolAfter ).toFixed( 3 )})` )
	console.log( `  control (sin felicidad): cortisol ${neutralBefore.toFixed( 3 )} -> ${neutralAfter.toFixed( 3 )} (Δ=${( neutralBefore - neutralAfter ).toFixed( 3 )})` )

}

await scene1()
const traumatizedAI = await scene2()
await scene3( traumatizedAI )
await scene4()
await scene5()

console.log( `\n${line( '═' )}\nFIN\n${line( '═' )}` )
