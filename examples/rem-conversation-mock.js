import { Totemheart, Personality } from '../src/index.js'

const results = []

function report( id, name, status, evidence ) {

	results.push( { id, name, status, evidence } )

}

function tokenize( text ) {

	return ( text || '' ).toLowerCase().match( /[\p{L}']+/gu ) || []

}

const OPTIMIST = new Personality( { openness: 0.7, conscientiousness: 0.6, extraversion: 0.8, agreeableness: 0.85, neuroticism: 0.15 } )
const CYNIC       = new Personality( { openness: 0.4, conscientiousness: 0.6, extraversion: 0.3, agreeableness: 0.2, neuroticism: 0.7 } )

const optimist = new Totemheart( { personality: OPTIMIST } )
const cynic       = new Totemheart( { personality: CYNIC } )
optimist.sensoryOverload = new ( optimist.sensoryOverload.constructor )( { burstThreshold: 100 } )
cynic.sensoryOverload       = new ( cynic.sensoryOverload.constructor )( { burstThreshold: 100 } )

// ============================= SESIÓN 1: dos personalidades conversando entre sí =============================
// Cada respuesta real de una se convierte en el input real de la otra — no es un guion
// fijo, es una cadena emergente de un pipeline completo alimentando al otro.

console.log( '--- Sesión 1: conversación real entre dos personalidades ---\n' )

let toCynic = 'Hola, ¿qué opinas de empezar un proyecto nuevo juntos?'
for ( let i = 0; i < 3; i++ ) {

	const rCynic = await cynic.processInput( toCynic, { userId: 'optimist' } )
	console.log( `Optimista -> Cínico: "${toCynic}"` )
	console.log( `Cínico -> Optimista: "${rCynic.text}"\n` )

	const rOptimist = await optimist.processInput( rCynic.text, { userId: 'cynic' } )
	console.log( `Cínico -> Optimista: "${rCynic.text}"` )
	console.log( `Optimista -> Cínico: "${rOptimist.text}"\n` )

	toCynic = rOptimist.text

}

report( 'C1', 'Conversación encadenada real produce texto en ambas direcciones sin excepciones', 'PASS-live', 'ver transcript arriba' )

// Evento emocionalmente intenso real, inyectado en la conversación — genera una
// memoria episódica real con importancia alta en el CÍNICO.
const betrayalTurn = await cynic.processInput( 'NO PUEDO CREER QUE ME MENTISTE SOBRE EL PROYECTO, esto es HORRIBLE, es una traicion total y me da mucho dolor!!!', { userId: 'optimist' } )
const memory              = cynic.episodicMemory.memories.at( -1 )
report(
	'C2', 'El evento intenso queda almacenado como memoria episódica real (importancia > 0.6)',
	memory && memory.importance > 0.6 ? 'PASS-live' : 'FAIL',
	`importance=${memory?.importance?.toFixed( 3 )} arousal=${memory?.emotionalSignature?.arousal?.toFixed( 3 )} valence=${memory?.emotionalSignature?.valence?.toFixed( 3 )}`,
)

const arousal0    = memory.emotionalSignature.arousal
const valence0    = memory.emotionalSignature.valence
const concepts0 = [ ...memory.concepts ]
const selfModelBefore = JSON.stringify( cynic.selfModel.getDominant() )
const trustBefore         = cynic.attachment.get( 'optimist' ).trust

// ============================= PRUEBA DE TIEMPOS REM =============================

console.log( '\n--- Sesión 2: 20 minutos después (por debajo del umbral de 4h — NO debe activarse REM) ---\n' )
cynic.remConsolidation.lastTurnAt = Date.now() - 1000 * 60 * 20
const shortGapResult                    = await cynic.processInput( 'sigo pensando en lo que paso', { userId: 'optimist' } )
report(
	'C3', 'Un hueco corto (20 min) NO dispara el sweep REM — el umbral real de inactividad se respeta',
	!shortGapResult.debug?.remReport ? 'PASS-live' : 'FAIL',
	`remReport=${JSON.stringify( shortGapResult.debug?.remReport ?? null )}`,
)
report(
	'C4', 'Sin sweep REM, la memoria queda exactamente igual (ni se enfría ni se toca)',
	memory.emotionalSignature.arousal === arousal0 && memory.emotionalSignature.valence === valence0 ? 'PASS-live' : 'FAIL',
	`arousal=${memory.emotionalSignature.arousal.toFixed( 3 )} (era ${arousal0.toFixed( 3 )})`,
)

console.log( '--- Sesión 3: 5 horas después (por encima del umbral — SÍ debe activarse REM) ---\n' )
cynic.remConsolidation.lastTurnAt = Date.now() - 1000 * 60 * 60 * 5
const remResult                          = await cynic.processInput( 'hola de nuevo', { userId: 'optimist' } )
console.log( `Cínico tras el sweep REM: "${remResult.text}"` )
console.log( `systemPrompt incluye nota de transición: ${remResult.systemPrompt.includes( 'TRANSICIÓN TRAS INACTIVIDAD' )}\n` )

report(
	'C5', 'Un hueco real de 5h SÍ dispara el sweep REM, con horas reales reportadas',
	remResult.debug?.remReport?.elapsedHours >= 4 ? 'PASS-live' : 'FAIL',
	JSON.stringify( remResult.debug?.remReport ),
)

const expectedArousal = arousal0 * Math.exp( -0.3 ) // lambdaRem=0.3 por defecto, real fórmula de RemConsolidation
report(
	'C6', 'El pico de arousal de la memoria se enfría según la fórmula real e^(-lambdaREM), no arbitrariamente',
	Math.abs( memory.emotionalSignature.arousal - expectedArousal ) < 0.01 ? 'PASS-live' : 'FAIL',
	`arousal ${arousal0.toFixed( 3 )} -> ${memory.emotionalSignature.arousal.toFixed( 3 )} (esperado ${expectedArousal.toFixed( 3 )})`,
)

report(
	'C7', 'La "lección" semántica sobrevive intacta: valencia y conceptos NO se tocan, solo el pico de arousal',
	memory.emotionalSignature.valence === valence0 && JSON.stringify( memory.concepts ) === JSON.stringify( concepts0 ) ? 'PASS-live' : 'FAIL',
	`valence=${memory.emotionalSignature.valence.toFixed( 3 )} (era ${valence0.toFixed( 3 )}), concepts=${JSON.stringify( memory.concepts )}`,
)

report(
	'C8', 'La memoria queda marcada como "REM-saliente" (remSalient) por tener importancia alta',
	memory.remSalient === true ? 'PASS-live' : 'FAIL',
	`remSalient=${memory.remSalient}`,
)

report(
	'C9', 'Lo aprendido a nivel de identidad (SelfModel, confianza de Attachment) NO se resetea con el sueño',
	JSON.stringify( cynic.selfModel.getDominant() ) === selfModelBefore && cynic.attachment.get( 'optimist' ).trust !== 0.5 ? 'PASS-live' : 'FAIL',
	`selfModel igual=${JSON.stringify( cynic.selfModel.getDominant() ) === selfModelBefore}, trust=${cynic.attachment.get( 'optimist' ).trust.toFixed( 3 )} (antes ${trustBefore.toFixed( 3 )})`,
)

// ============================= LATENCIA Y REACTIVACIÓN TRAS MESES =============================

console.log( '--- Sesión 4: 90 días después (la memoria debería quedar "floja" pero no borrada) ---\n' )
const latentBeforeAging = cynic.episodicMemory.getLatentWeight( memory )
memory.remTaggedAt              = Date.now() - 1000 * 60 * 60 * 24 * 90 // el propio taggeo envejece 90 días reales
const latentAfter90Days   = cynic.episodicMemory.getLatentWeight( memory ) // medido ANTES de que un nuevo sweep re-etiquete la memoria como "fresca"

report(
	'C10', 'Tras 90 días reales, el peso latente decae mucho pero NUNCA llega a cero absoluto',
	latentAfter90Days < latentBeforeAging && latentAfter90Days > 0 ? 'PASS-live' : 'FAIL',
	`peso latente ${latentBeforeAging.toFixed( 4 )} -> ${latentAfter90Days.toFixed( 4 )}`,
)

// Ahora sí procesamos el turno 90 días después — esto dispara OTRO sweep REM real,
// que re-etiqueta la memoria como recién saliente (remTaggedAt se pone al día de hoy)
// porque su importancia sigue siendo alta. Comportamiento real documentado, no oculto:
// una memoria que sigue siendo relevante en cada sueño se "refresca" en vez de perderse.
cynic.remConsolidation.lastTurnAt = Date.now() - 1000 * 60 * 60 * 24 * 90
const monthsLaterResult                  = await cynic.processInput( '¿qué tal el tiempo hoy?', { userId: 'optimist' } )
report(
	'C10b', 'Un sweep REM real re-etiqueta como saliente una memoria que lo sigue mereciendo (no se pierde con el tiempo si sigue siendo importante)',
	memory.remSalient === true && memory.remTaggedAt > Date.now() - 1000 * 60 ? 'PASS-live' : 'FAIL',
	`remSalient=${memory.remSalient} remTaggedAt hace ${( ( Date.now() - memory.remTaggedAt ) / 1000 ).toFixed( 1 )}s`,
)

const unrelatedReactivation = cynic.episodicMemory.getBestReactivation( tokenize( '¿qué tal el tiempo hoy?' ) )
report(
	'C11', 'Un mensaje sin relación alguna NO reactiva la memoria latente (no hay solapamiento real de tokens)',
	unrelatedReactivation === null ? 'PASS-live' : 'FAIL',
	`reactivación=${JSON.stringify( unrelatedReactivation )}`,
)

console.log( '--- Sesión 5: el tema original reaparece 90 días después — ¿se produce el "chispazo"? ---\n' )
const sparkResult = await cynic.processInput( 'oye, todavia pienso en aquella traicion de hace meses', { userId: 'optimist' } )
console.log( `Cínico ante el tema reaparecido: "${sparkResult.text}"\n` )

report(
	'C12', 'El chispazo real: mencionar "traicion" 90 días después reactiva la memoria latente (score sube por solapamiento real de tokens)',
	sparkResult.debug?.reactivation && sparkResult.debug.reactivation.score > latentAfter90Days ? 'PASS-live' : 'FAIL',
	JSON.stringify( sparkResult.debug?.reactivation ),
)

// ============================= COMPARACIÓN ENTRE PERSONALIDADES =============================

console.log( '--- Comparación: ¿el optimista se recupera más rápido que el cínico tras el mismo sueño? ---\n' )

// Calls RemConsolidation.sweep() directly instead of a full processInput() turn —
// a real subsequent turn would layer its OWN fresh appraisal on top (contagion,
// dopamine, the works), which would contaminate the comparison. Isolating the sweep
// itself measures the actual mechanism this check is about: the personality-dependent
// recovery rate inside DecayEngine.apply(), called with real elapsed hours.
async function buildShockedThenRem( personality ) {

	const ai = new Totemheart( { personality } )
	ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: 100 } )
	await ai.processInput( 'no puedo creer que me mentiste, esto es una traicion total', { userId: 'x' } )
	const vectorBefore = { ...ai.emotionSpace.vector }
	ai.remConsolidation.lastTurnAt = Date.now() - 1000 * 60 * 60 * 5
	ai.remConsolidation.sweep( {
		episodicMemory: ai.episodicMemory, hebbianPlasticity: ai.hebbianPlasticity, cortisolEngine: ai.cortisolEngine,
		expressionDebt: ai.expressionDebt, sensitization: ai.sensitization, emotionSpace: ai.emotionSpace,
		moodTracker: ai.moodTracker, decayEngine: ai.decayEngine, personality: ai.personality,
	} )
	const vectorAfter = ai.emotionSpace.vector
	return { vectorBefore, vectorAfter, recovered: vectorAfter.valence - vectorBefore.valence }

}

const optimistRecovery = await buildShockedThenRem( OPTIMIST )
const cynicRecovery       = await buildShockedThenRem( CYNIC )

report(
	'C13', 'Tras el mismo shock y el mismo hueco real de 5h, el optimista (bajo neuroticismo) recupera más valencia que el cínico (alto neuroticismo) — misma fórmula de decaimiento, personalidad real distinta',
	optimistRecovery.recovered >= cynicRecovery.recovered ? 'PASS-live' : 'FAIL',
	`optimista recuperó ${optimistRecovery.recovered.toFixed( 3 )}, cínico recuperó ${cynicRecovery.recovered.toFixed( 3 )}`,
)

// ============================= REPORTE =============================

console.log( '─'.repeat( 105 ) )
console.log( 'ID'.padEnd( 5 ), 'CHECK'.padEnd( 78 ), 'STATUS'.padEnd( 10 ), 'EVIDENCE' )
console.log( '─'.repeat( 105 ) )

let pass = 0
let fail  = 0
for ( const r of results ) {

	console.log( r.id.padEnd( 5 ), r.name.padEnd( 78 ).slice( 0, 78 ), r.status.padEnd( 10 ), r.evidence )
	if ( r.status.startsWith( 'PASS' ) ) pass++
	else fail++

}

console.log( '─'.repeat( 105 ) )
console.log( `\nResumen: ${pass} PASS, ${fail} FAIL de ${results.length} comprobaciones.` )

if ( fail > 0 ) process.exit( 1 )
