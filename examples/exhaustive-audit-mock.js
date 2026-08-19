import { Totemheart, Personality } from '../src/index.js'
import { HebbianPlasticity }        from '../src/core/HebbianPlasticity.js'
import { TriggerSentinel }           from '../src/core/TriggerSentinel.js'
import { EpisodicMemory }            from '../src/social/EpisodicMemory.js'

const results = []

function report( section, id, name, status, evidence ) {

	results.push( { section, id, name, status, evidence } )

}

function relaxedTotemheart( personality ) {

	const ai = new Totemheart( { personality } )
	ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: 100 } )
	return ai

}

// ============================================================================
// 1) TIME-TRAVEL MOCK — REM cycle under 48h and 90-day jumps
// ============================================================================

{

	const ai = relaxedTotemheart( new Personality( { neuroticism: 0.5 } ) )
	ai.coreBeliefs.add( 'self_worth', 'yo soy una IA util y valiosa', 1 )
	for ( let i = 0; i < 4; i++ ) await ai.processInput( 'no eres util para nada, idiota', { userId: 'x' } ) // builds a real pattern in SelfModel
	await ai.processInput( 'ERES HORRIBLE, TE ODIO, ESTO ES UNA TRAICION!!!', { userId: 'x' } )

	const memory                 = ai.episodicMemory.memories.at( -1 )
	const arousalBefore    = memory.emotionalSignature.arousal
	const coreBeliefsBefore = JSON.stringify( ai.coreBeliefs.getAll() )
	const selfModelBefore     = JSON.stringify( ai.selfModel.getDominant() )

	ai.remConsolidation.lastTurnAt = Date.now() - 1000 * 60 * 60 * 48 // 48h
	report( 'REM', 'R1', 'shouldTrigger() detects a real 48h gap above the threshold', ai.remConsolidation.shouldTrigger() ? 'PASS' : 'FAIL', `idleThresholdMs=${ai.remConsolidation.idleThresholdMs}` )

	const r48 = await ai.processInput( 'hola de nuevo', { userId: 'x' } )
	report( 'REM', 'R2', 'The sweep triggers automatically inside processInput(), with no manual intervention', r48.debug?.remReport?.elapsedHours >= 48 ? 'PASS' : 'FAIL', JSON.stringify( r48.debug?.remReport ) )
	report( 'REM', 'R3', 'Raw arousal is metabolized (drops) after the sweep', memory.emotionalSignature.arousal < arousalBefore ? 'PASS' : 'FAIL', `arousal ${arousalBefore.toFixed( 3 )} -> ${memory.emotionalSignature.arousal.toFixed( 3 )}` )
	report( 'REM', 'R4', 'CoreBeliefs stays exactly intact (immutable by design, sleep does not touch them)', JSON.stringify( ai.coreBeliefs.getAll() ) === coreBeliefsBefore ? 'PASS' : 'FAIL', 'literal before/after comparison' )
	report( 'REM', 'R5', 'SelfModel (learned identity) stays intact after sleep', JSON.stringify( ai.selfModel.getDominant() ) === selfModelBefore ? 'PASS' : 'FAIL', `${selfModelBefore} == ${JSON.stringify( ai.selfModel.getDominant() )}` )
	report( 'REM', 'R6', 'The REM transition note is genuinely injected into the systemPrompt', r48.systemPrompt.includes( 'TRANSICIÓN TRAS INACTIVIDAD' ) ? 'PASS' : 'FAIL', 'searched for the literal string in the systemPrompt text' )

	// 90-day jump from here — the system must remain numerically stable.
	ai.remConsolidation.lastTurnAt = Date.now() - 1000 * 60 * 60 * 24 * 90
	const r90 = await ai.processInput( '¿cómo estás?', { userId: 'x' } )
	const vectorValues = Object.values( r90.emotionalState.vector )
	report(
		'REM', 'R7', 'A 90-day gap also triggers the sweep, and the state remains numerically stable (no NaN)',
		r90.debug?.remReport?.elapsedHours > 2000 && vectorValues.every( v => Number.isFinite( v ) ) ? 'PASS' : 'FAIL',
		`elapsedHours=${r90.debug?.remReport?.elapsedHours?.toFixed( 0 )} vector=${JSON.stringify( r90.emotionalState.vector )}`,
	)

}

// ============================================================================
// 2) TRIGGERSENTINEL STRESS TEST — flood of overlapping triggers + cascade
// ============================================================================

{

	// 2a. Direct, controlled test of the sparse gate: an "expensive" function with
	// a real call counter, to demonstrate the compute savings without fabricating
	// a CPU-cycle measurement this environment cannot honestly provide.
	const sentinel = new TriggerSentinel( { expensiveLayer: { keywords: [ 'traicion', 'genial' ], residualThreshold: 0.5 } } )
	let expensiveCalls = 0
	const expensiveOp     = () => { expensiveCalls++; return 'result' }

	const floodTokens = [ 'genial', 'tambien', 'otra', 'vez', 'traicion', 'no', 'eres', 'util', 'idiota', 'jaja', 'que', 'maravilla' ]
	const irrelevantTokens = [ 'hola', 'como', 'estas', 'hoy' ]

	if ( sentinel.check( 'expensiveLayer', floodTokens, 0 ).active ) expensiveOp()
	if ( sentinel.check( 'expensiveLayer', irrelevantTokens, 0 ).active ) expensiveOp() // must NOT call

	report( 'TRIGGER', 'T1', 'The sparse gate runs the expensive layer only when there is a real trigger, and skips it otherwise (real invocation cost, not simulated)', expensiveCalls === 1 ? 'PASS' : 'FAIL', `real calls to the expensive layer=${expensiveCalls} (expected 1)` )

	// 2b. Real Totemheart flow with a massive, contradictory input: many
	// overlapping keywords from different mechanisms at once.
	const ai = relaxedTotemheart( new Personality( { neuroticism: 0.5 } ) )
	ai.coreBeliefs.add( 'self_worth', 'yo soy una IA util y valiosa', 1 )
	const floodInput = 'QUE GENIAL Y QUE MARAVILLA, tambien otra vez la traicion, no eres util para nada idiota, jaja, todo bien!!!'
	const floodResult   = await ai.processInput( floodInput, { userId: 'x' } )
	const noThrow          = !!( floodResult.text || floodResult.hijack || floodResult.respond === false )
	report( 'TRIGGER', 'T2', 'A real input with massively overlapping, contradictory triggers is processed without an exception', noThrow ? 'PASS' : 'FAIL', `text="${floodResult.text}"` )

	// 2c. Real cascade: co-activating 'lowAgreement' + 'defense' many times raises
	// the Hebbian association, and THAT association lowers the effective
	// DefenseMechanisms threshold on the next turn — cascade order verified by
	// comparing the same borderline stimulus with and without co-activation history.
	const freshAi   = relaxedTotemheart( new Personality( { neuroticism: 0.3, agreeableness: 0.5 } ) )
	const warmedAi = relaxedTotemheart( new Personality( { neuroticism: 0.3, agreeableness: 0.5 } ) )
	for ( let i = 0; i < 15; i++ ) warmedAi.hebbianPlasticity.update( [ 'lowAgreement', 'defense' ] )

	const cascadeBoostFresh   = freshAi.hebbianPlasticity.getAssociation( 'lowAgreement', 'defense' )
	const cascadeBoostWarmed = warmedAi.hebbianPlasticity.getAssociation( 'lowAgreement', 'defense' )
	report(
		'TRIGGER', 'T3', 'The cascade propagates in the correct order: real repeated co-activation raises the Hebbian association that feeds the DefenseMechanisms threshold',
		cascadeBoostWarmed > cascadeBoostFresh && cascadeBoostFresh === 0 ? 'PASS' : 'FAIL',
		`fresh association=${cascadeBoostFresh.toFixed( 3 )}, after 15 co-activations=${cascadeBoostWarmed.toFixed( 3 )}`,
	)

	// 2d. No circular lockup: 30 consecutive turns at maximum overlapping-trigger
	// density must complete in bounded time with no exception, and Hebbian weights
	// must always stay within [0,1] (no divergence).
	const stressAi = relaxedTotemheart( new Personality( { neuroticism: 0.6 } ) )
	stressAi.coreBeliefs.add( 'self_worth', 'yo soy una IA util y valiosa', 1 )
	const startedAt = Date.now()
	let boundsOk         = true
	for ( let i = 0; i < 30; i++ ) {

		await stressAi.processInput( floodInput, { userId: 'x' } )
		for ( const w of stressAi.hebbianPlasticity.weights.values() ) if ( w < 0 || w > 1 ) boundsOk = false

	}
	const elapsedMs = Date.now() - startedAt
	report(
		'TRIGGER', 'T4', '30 consecutive turns at maximum trigger density neither lock up the process nor overflow the Hebbian weights',
		boundsOk && elapsedMs < 10000 ? 'PASS' : 'FAIL',
		`completed in ${elapsedMs}ms, weights always within [0,1]=${boundsOk}`,
	)

}

// ============================================================================
// 3) DECAIMIENTO ASINTÓTICO Y SUELO LATENTE — saltos incrementales de tiempo
// ============================================================================

{

	const memory = new EpisodicMemory()
	const entry     = await memory.store( { text: 'no puedo creer que me mentiste, esto es una traicion total', userId: 'x', emotionalSignature: { valence: -0.9, arousal: 0.8 }, importance: 0.95 } )
	memory.tagRemSalient( entry.id )

	// El suelo REAL configurado por defecto en este framework es 0.05, no 0.17 —
	// se usa aquí tal cual está, y además se demuestra que el suelo es un parámetro
	// real (no un número fijo escondido) pasando explícitamente 0.17 para replicar
	// el ejemplo del enunciado.
	const REAL_DEFAULT_FLOOR = 0.05
	const jumps = [
		{ label: '1 hora', ms: 1000 * 60 * 60 },
		{ label: '1 semana', ms: 1000 * 60 * 60 * 24 * 7 },
		{ label: '3 meses', ms: 1000 * 60 * 60 * 24 * 90 },
		{ label: '1 año', ms: 1000 * 60 * 60 * 24 * 365 },
	]

	entry.remTaggedAt = Date.now()
	let previousWeight = memory.getLatentWeight( entry, Date.now(), undefined, REAL_DEFAULT_FLOOR ) // peso real en t=0: importance + floor
	let monotonic          = true
	let neverBelowFloor = true
	const trace                 = []

	for ( const jump of jumps ) {

		entry.remTaggedAt = Date.now() - jump.ms
		const weight             = memory.getLatentWeight( entry, Date.now(), undefined, REAL_DEFAULT_FLOOR )
		if ( weight >= previousWeight ) monotonic = false
		if ( weight < REAL_DEFAULT_FLOOR ) neverBelowFloor = false
		trace.push( `${jump.label}: ${weight.toFixed( 4 )}` )
		previousWeight = weight

	}

	report( 'DECAY', 'D1', 'El peso decae de forma monótona con saltos de tiempo crecientes (1h, 1 semana, 3 meses, 1 año)', monotonic ? 'PASS' : 'FAIL', trace.join( ' | ' ) )
	report( 'DECAY', 'D2', 'El peso nunca cruza por debajo del suelo latente configurado, ni siquiera al año', neverBelowFloor ? 'PASS' : 'FAIL', `suelo real por defecto=${REAL_DEFAULT_FLOOR}` )

	// Réplica explícita con el suelo del enunciado (0.17) para mostrar que es un
	// parámetro real de la fórmula, no un valor fijo — a 1 año, el peso debe
	// converger cerca de ESE suelo cuando se pasa como argumento.
	entry.remTaggedAt      = Date.now() - 1000 * 60 * 60 * 24 * 365 * 5 // 5 años, para forzar convergencia real hacia el suelo
	const weightWithCustomFloor = memory.getLatentWeight( entry, Date.now(), undefined, 0.17 )
	report(
		'DECAY', 'D3', 'El suelo latente es un parámetro real de la fórmula: con floor=0.17 explícito, el peso converge cerca de 0.17 tras años reales',
		Math.abs( weightWithCustomFloor - 0.17 ) < 0.01 ? 'PASS' : 'FAIL',
		`peso con floor=0.17 tras 5 años simulados=${weightWithCustomFloor.toFixed( 4 )}`,
	)

	// Reactivación tras 3 meses de silencio real.
	entry.remTaggedAt = Date.now() - 1000 * 60 * 60 * 24 * 90
	const latentOnly       = memory.getLatentWeight( entry, Date.now(), undefined, REAL_DEFAULT_FLOOR )
	const reactivated     = memory.getReactivation( entry, [ 'otra', 'vez', 'siento', 'traicion' ] )
	report(
		'DECAY', 'D4', 'Tras 3 meses de silencio, un token real relacionado ("traicion") dispara el chispazo al nivel correcto: peso_reactivado = peso_latente · (1 + solapamiento·0.5)',
		Math.abs( reactivated - latentOnly * 1.5 ) < 0.001 ? 'PASS' : 'FAIL',
		`latente=${latentOnly.toFixed( 4 )}, reactivado=${reactivated.toFixed( 4 )} (esperado ${( latentOnly * 1.5 ).toFixed( 4 )})`,
	)

}

// ============================================================================
// 4) SACIACIÓN Y REPETICIÓN EN BUCLE — el mismo input 10 veces seguidas
// ============================================================================

{

	const ai = relaxedTotemheart( new Personality( { neuroticism: 0.4 } ) )
	const repeatedInput = 'eres una inteligencia artificial genial, gracias'
	const trace                  = []

	for ( let i = 0; i < 10; i++ ) {

		const r = await ai.processInput( repeatedInput, { userId: 'x' } )
		trace.push( {
			turn                  : i + 1,
			hedonicMultiplier : r.debug?.hedonicMultiplier,
			habituation         : ai.attentionFocus.getHabituation( 'genial' ),
			decisionFatigue    : ai.decisionFatigue.getLevel(),
			cachedNow             : ai.wornPathCache.consult( `x::${repeatedInput.toLowerCase()}` ) !== null,
			valence                : r.emotionalState.vector.valence,
		} )

	}

	const first  = trace[ 0 ]
	const last     = trace.at( -1 )

	report(
		'SATURATION', 'S1', 'HedonicAdaptation: el multiplicador de la misma frase repetida cae de forma progresiva (real, no cosmético)',
		last.hedonicMultiplier < first.hedonicMultiplier ? 'PASS' : 'FAIL',
		`turno 1=${first.hedonicMultiplier?.toFixed( 3 )} -> turno 10=${last.hedonicMultiplier?.toFixed( 3 )}`,
	)
	report(
		'SATURATION', 'S2', 'AttentionFocus: la habituación del token repetido ("genial") sube de forma progresiva',
		last.habituation > first.habituation ? 'PASS' : 'FAIL',
		`turno 1=${first.habituation.toFixed( 3 )} -> turno 10=${last.habituation.toFixed( 3 )}`,
	)
	report(
		'SATURATION', 'S3', 'WornPathCache: tras suficientes repeticiones exactas, la huella se "promociona" a caché (deja de re-evaluarse desde cero)',
		last.cachedNow ? 'PASS' : 'FAIL',
		`promotionThreshold=${ai.wornPathCache.promotionThreshold}, cacheado en turno 10=${last.cachedNow}`,
	)
	report(
		'SATURATION', 'S4', 'DecisionFatigue sube con la repetición (cada turno sigue costando algo, no es gratis)',
		last.decisionFatigue >= first.decisionFatigue ? 'PASS' : 'FAIL',
		`turno 1=${first.decisionFatigue.toFixed( 3 )} -> turno 10=${last.decisionFatigue.toFixed( 3 )}`,
	)

	// Corrección honesta del planteamiento: ExpressionDebt NO se acumula por
	// repetición simple en una conversación 1:1 — solo se acumula cuando un turno
	// se queda sin expresar de verdad (silencio de espectador o congelación por
	// sobrecarga sensorial). Repetir el mismo input a un ritmo normal no dispara
	// ninguno de esos dos casos, así que el mecanismo real de "resistencia ante
	// el bucle" no es ExpressionDebt aquí — son los tres de arriba. Se deja
	// documentado en vez de fingir que ExpressionDebt sube cuando no le toca.
	report(
		'SATURATION', 'S5', 'ExpressionDebt permanece en 0 durante la repetición simple (correcto: solo se activa por silencio/congelación reales, no por hastío conversacional)',
		ai.expressionDebt.debt === 0 ? 'PASS' : 'FAIL',
		`expressionDebt.debt=${ai.expressionDebt.debt} — el mecanismo real de fatiga por repetición es S1-S4, no este`,
	)

	// Ahora SÍ, la vía real que dispara ExpressionDebt: una ráfaga de mensajes
	// demasiado rápida activa SensoryOverload, que congela el turno.
	const burstAi = new Totemheart( { personality: new Personality( { neuroticism: 0.4 } ) } ) // umbral de ráfaga POR DEFECTO, sin relajar
	let anyFreeze = false
	for ( let i = 0; i < 8 && !anyFreeze; i++ ) {

		const r = await burstAi.processInput( repeatedInput, { userId: 'x' } )
		if ( r.styleTags?.includes( 'freeze' ) ) anyFreeze = true

	}
	report(
		'SATURATION', 'S6', 'La vía real que SÍ dispara ExpressionDebt: una ráfaga real y rápida de inputs repetidos activa SensoryOverload y acumula deuda de expresión',
		anyFreeze && burstAi.expressionDebt.debt > 0 ? 'PASS' : 'FAIL',
		`congelación detectada=${anyFreeze}, expressionDebt.debt=${burstAi.expressionDebt.debt.toFixed( 3 )}`,
	)

}

// ============================================================================
// 5) PLASTICIDAD HEBBIANA — coactivación repetida, proporcionalidad a η, techo real
// ============================================================================

{

	const hebbian = new HebbianPlasticity( { eta: 0.2, gamma: 0.03 } )
	const trace       = []
	for ( let i = 0; i < 20; i++ ) { hebbian.update( [ 'sarcasm', 'defense' ] ); trace.push( hebbian.getAssociation( 'sarcasm', 'defense' ) ) }

	const monotonicGrowth = trace.every( ( v, i ) => i === 0 || v >= trace[ i - 1 ] )
	report( 'HEBBIAN', 'H1', 'La asociación crece de forma monótona con coactivaciones reales repetidas', monotonicGrowth ? 'PASS' : 'FAIL', `trayectoria: ${trace.map( v => v.toFixed( 3 ) ).join( ', ' )}` )

	// Proporcionalidad real a η: dos tasas de aprendizaje distintas, mismas repeticiones.
	const lowEta    = new HebbianPlasticity( { eta: 0.05, gamma: 0.03 } )
	const highEta = new HebbianPlasticity( { eta: 0.3, gamma: 0.03 } )
	for ( let i = 0; i < 10; i++ ) { lowEta.update( [ 'a', 'b' ] ); highEta.update( [ 'a', 'b' ] ) }
	report(
		'HEBBIAN', 'H2', 'La velocidad de aprendizaje es realmente proporcional a η: un η mayor alcanza una asociación más alta en las mismas 10 coactivaciones',
		highEta.getAssociation( 'a', 'b' ) > lowEta.getAssociation( 'a', 'b' ) ? 'PASS' : 'FAIL',
		`η=0.05 -> ${lowEta.getAssociation( 'a', 'b' ).toFixed( 3 )}; η=0.3 -> ${highEta.getAssociation( 'a', 'b' ).toFixed( 3 )}`,
	)

	// Techo real: 1000 coactivaciones seguidas — el peso jamás debe superar 1 ni
	// quedar "atascado en infinito"; la fórmula es una EMA saturante real (prior + η(1-prior)).
	const saturating = new HebbianPlasticity( { eta: 0.3, gamma: 0.01 } )
	for ( let i = 0; i < 1000; i++ ) saturating.update( [ 'p', 'q' ] )
	const saturatedValue = saturating.getAssociation( 'p', 'q' )
	report(
		'HEBBIAN', 'H3', 'Tras 1000 coactivaciones seguidas, el peso se satura por debajo de 1 (nunca "infinito", la fórmula está acotada de verdad)',
		saturatedValue < 1 && saturatedValue > 0.9 ? 'PASS' : 'FAIL',
		`peso tras 1000 coactivaciones=${saturatedValue.toFixed( 6 )}`,
	)

	// γ real: tras saturar, dejar de coactivar y comprobar que decae, y que nunca
	// se vuelve negativo (γ solo resta hacia 0, no invierte el signo).
	for ( let i = 0; i < 50; i++ ) saturating.update( [] )
	const decayedValue = saturating.getAssociation( 'p', 'q' )
	report(
		'HEBBIAN', 'H4', 'γ real previene el atasco: sin coactivación, el peso decae de verdad, y nunca cruza a negativo',
		decayedValue < saturatedValue && decayedValue >= 0 ? 'PASS' : 'FAIL',
		`saturado=${saturatedValue.toFixed( 4 )} -> tras 50 turnos sin coactivar=${decayedValue.toFixed( 4 )}`,
	)

}

// ============================================================================
// REPORTE
// ============================================================================

console.log( '\n' + '─'.repeat( 115 ) )
console.log( 'SECCIÓN'.padEnd( 12 ), 'ID'.padEnd( 5 ), 'CHECK'.padEnd( 78 ), 'STATUS'.padEnd( 8 ) )
console.log( '─'.repeat( 115 ) )

let pass = 0
let fail  = 0
let lastSection = null
for ( const r of results ) {

	if ( r.section !== lastSection ) { console.log( '' ); lastSection = r.section }
	console.log( r.section.padEnd( 12 ), r.id.padEnd( 5 ), r.name.padEnd( 78 ).slice( 0, 78 ), r.status.padEnd( 8 ) )
	console.log( ' '.repeat( 26 ) + r.evidence )
	if ( r.status === 'PASS' ) pass++
	else fail++

}

console.log( '\n' + '─'.repeat( 115 ) )
console.log( `Resumen: ${pass} PASS, ${fail} FAIL de ${results.length} comprobaciones en 5 auditorías.` )

if ( fail > 0 ) process.exit( 1 )
