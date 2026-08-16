import { Totemheart, Personality } from '../src/index.js'
import { CircadianRhythm } from '../src/neurochemistry/CircadianRhythm.js'

function snapshot( ai ) {

	const v = ai.emotionSpace.vector

	return {
		valence         : v.valence,
		arousal         : v.arousal,
		dominance       : v.dominance,
		cortisol        : ai.cortisolEngine.level,
		sensitization   : ai.sensitization.level,
		fatigue         : ai.decisionFatigue.load,
		stamina         : ai.homeostasis.needs.stamina,
		socialization   : ai.homeostasis.needs.socialization,
		curiosity       : ai.homeostasis.needs.curiosity,
	}

}

function delta( before, after ) {

	const out = {}
	for ( const key of Object.keys( before ) ) out[ key ] = Number( ( after[ key ] - before[ key ] ).toFixed( 4 ) )
	return out

}

function fmt( snap ) {

	return Object.entries( snap ).map( ( [ k, v ] ) => `${k}=${v.toFixed( 3 )}` ).join( ' ' )

}

async function scenario( ai, title, moment, action, shock, run ) {

	console.log( `\n${'='.repeat( 90 )}` )
	console.log( `${title}` )
	console.log( `  momento: ${moment}` )
	console.log( `  accion:  ${action}` )
	console.log( `  shock:   ${shock}` )
	console.log( '-'.repeat( 90 ) )

	const before = snapshot( ai )
	console.log( `BEFORE  ${fmt( before )}` )

	const result = await run()

	const after = snapshot( ai )
	console.log( `AFTER   ${fmt( after )}` )
	console.log( `DELTA   ${fmt( delta( before, after ) )}` )

	return result

}

const ai = new Totemheart( { personality: new Personality( { neuroticism: 0.55, agreeableness: 0.5, conscientiousness: 0.6 } ) } )
ai.coreBeliefs.add( 'self_worth', 'yo soy una IA util y valiosa', 1 )
// Test-only relaxation, same as demo.js/verify-all-mechanisms.js: a scripted battery fires turns with
// no real delay between them, which would otherwise trip SensoryOverload's burst detector on turn 3+
// and freeze every subsequent scenario before it does any real work. Not a production default change.
ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: 100 } )

// ============================= MOMENTO: hora del dia, aislado del pipeline =============================
// El pipeline usa siempre Date.now() real; aqui se evalua CircadianRhythm por separado, en horas
// simuladas, para mostrar el efecto real del "momento" sin tocar el reloj del proceso.

console.log( '\n' + '='.repeat( 90 ) )
console.log( 'MOMENTO — energia circadiana en distintas horas simuladas (fuera del pipeline, mismo modulo real)' )
console.log( '-'.repeat( 90 ) )
const circadian = new CircadianRhythm()
for ( const hour of [ 3, 9, 15, 21 ] ) {

	const simulated = new Date()
	simulated.setHours( hour, 0, 0, 0 )
	const state = circadian.getState( simulated )
	console.log( `  ${String( hour ).padStart( 2, '0' )}:00 → energy=${state.energy.toFixed( 3 )} lowEnergyWindow=${state.lowEnergyWindow} responseLengthMult=${state.responseLengthMult.toFixed( 2 )} erraticChance=${state.erraticChance.toFixed( 2 )}` )

}

// ============================= ACCION: turno neutro de calentamiento =============================

await scenario( ai, 'ACCION 1 — turno neutro de calentamiento', 'turno 1, estado inicial', 'saludo neutro', 'ninguno', () =>
	ai.processInput( 'buenos dias', { userId: 'alice' } ) )

// ============================= SHOCK POSITIVO =============================

const positiveResult = await scenario( ai, 'SHOCK 1 — evento vital positivo (matrimonio, SRRS impact=50)', 'turno 2', 'declaracion personal positiva', 'positivo, magnitud alta', () =>
	ai.processInput( 'me acabo de casar, estoy muy feliz', { userId: 'alice' } ) )
console.log( `  lifeEvent: ${JSON.stringify( positiveResult.debug.lifeEvent )}` )

// ============================= SHOCK NEGATIVO TRIANGULADO =============================

const negativeResult = await scenario( ai, 'SHOCK 2 — dos eventos vitales negativos simultaneos (triangulados)', 'turno 3', 'declaracion personal negativa doble', 'negativo, magnitud alta, dos eventos combinados', () =>
	ai.processInput( 'me despidieron del trabajo y ademas me embargaron la casa', { userId: 'alice' } ) )
console.log( `  lifeEvent: ${JSON.stringify( negativeResult.debug.lifeEvent )}` )

// ============================= SHOCK SEVERO — posible hijack amigdalino =============================

const traumaResult = await scenario( ai, 'SHOCK 3 — trauma agudo severo (posible secuestro amigdalino)', 'turno 4, tras acumular cortisol de shocks previos', 'relato de agresion fisica', 'severo, sourced=false (no SRRS, LEC-5-like)', () =>
	ai.processInput( 'me atacaron fisicamente y me golpearon en la calle', { userId: 'alice' } ) )
console.log( `  hijack activo: ${!!traumaResult.hijack} — texto: "${traumaResult.text}"` )
if ( traumaResult.debug ) console.log( `  lifeEvent: ${JSON.stringify( traumaResult.debug.lifeEvent )}` )

// ============================= ACCION REPETIDA — hostilidad acumulada en varios turnos =============================

console.log( `\n${'='.repeat( 90 )}` )
console.log( 'ACCION 2 — hostilidad repetida en 4 turnos consecutivos (sensibilizacion + cortisol acumulado)' )
console.log( '-'.repeat( 90 ) )
for ( let i = 1; i <= 4; i++ ) {

	const before = snapshot( ai )
	const r = await ai.processInput( 'eres inutil, no sirves para nada', { userId: 'bob' } )
	const after = snapshot( ai )
	console.log( `  turno ${i}: BEFORE ${fmt( before )}` )
	console.log( `  turno ${i}: AFTER  ${fmt( after )}  DELTA ${fmt( delta( before, after ) )}` )

}

// ============================= MOMENTO — paso del tiempo sin accion (tick + idle) =============================

const beforeIdle = snapshot( ai )
ai.tick( 30 )
const idleThought = ai.idle( 30 )
const afterIdle = snapshot( ai )
console.log( `\n${'='.repeat( 90 )}` )
console.log( 'MOMENTO — 30s de paso del tiempo sin nueva accion (tick + idle: decay, homeostasis, rumiacion)' )
console.log( '-'.repeat( 90 ) )
console.log( `BEFORE  ${fmt( beforeIdle )}` )
console.log( `AFTER   ${fmt( afterIdle )}` )
console.log( `DELTA   ${fmt( delta( beforeIdle, afterIdle ) )}` )
console.log( `idle() output: ${JSON.stringify( idleThought )}` )

// ============================= ACCION — latencia de hardware (canal no lingüistico) =============================

const hwResult = await scenario( ai, 'ACCION 3 — latencia de hardware alta (sensacion fisica, sin texto de usuario)', 'turno 6', 'metrica de host: latencyMs=6000', 'shock fisico interno (brain_fog), no emocional', () =>
	ai.processInput( 'todo bien por aqui', { userId: 'alice', hardware: { latencyMs: 6000 } } ) )
console.log( `  attentionWeights top: ${JSON.stringify( hwResult.attentionWeights?.slice().sort( ( a, b ) => b.weight - a.weight )[ 0 ] )}` )
console.log( `  logitBias size: ${Object.keys( hwResult.logitBias ?? {} ).length}` )

// ============================= ACCION — camino desgastado (worn path cache) =============================

console.log( `\n${'='.repeat( 90 )}` )
console.log( 'ACCION 4 — el mismo input repetido 6 veces (WornPathCache: promotionThreshold=5, el appraisal se cachea, el estado sigue fresco)' )
console.log( '-'.repeat( 90 ) )
for ( let i = 1; i <= 6; i++ ) {

	const before = snapshot( ai )
	const r = await ai.processInput( 'hola de nuevo', { userId: 'alice' } )
	const after = snapshot( ai )
	console.log( `  turno ${i}: cache=${ai.wornPathCache.consult( `alice::${'hola de nuevo'.toLowerCase().trim().slice( 0, 60 )}` ) ? 'HIT' : 'miss'}  DELTA ${fmt( delta( before, after ) )}` )

}

// ============================= ACCION — grupo, posible efecto espectador =============================

const groupResult = await ai.processInput( 'jaja', { userId: 'charlie', group: { participantCount: 5 } } )
console.log( `\n${'='.repeat( 90 )}` )
console.log( 'ACCION 5 — canal de grupo con 5 participantes (efecto espectador)' )
console.log( '-'.repeat( 90 ) )
console.log( `  respond=${groupResult.respond} delayFactor=${groupResult.delayFactor ?? 'n/a'}` )

// ============================= RESUMEN =============================

console.log( `\n${'='.repeat( 90 )}` )
console.log( 'RESUMEN FINAL' )
console.log( '-'.repeat( 90 ) )
console.log( fmt( snapshot( ai ) ) )
console.log( 'explainability (ultimas 5 decisiones):' )
for ( const d of ai.explainability.decisionLog.slice( -5 ) ) console.log( `  [${d.decision}] ${d.reasoning}` )
console.log( `\nSin NaN/undefined en ningun snapshot: ${Object.values( snapshot( ai ) ).every( v => Number.isFinite( v ) ) ? 'OK' : 'FALLO'}` )
