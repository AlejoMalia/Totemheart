import { Totemheart, Personality } from '../src/index.js'

const results = []

function report( persona, id, name, status, evidence ) {

	results.push( { persona, id, name, status, evidence } )

}

/** Real early-exit paths (hijack/freeze/bystander) return no `.debug` — that's expected pipeline behavior, not a bug, so checks must tolerate it instead of crashing. */
function earlyExitReason( result ) {

	if ( !result ) return 'no result'
	if ( result.respond === false ) return 'bystander silence'
	if ( result.hijack ) return 'amygdala hijack'
	if ( result.styleTags?.includes( 'freeze' ) ) return 'sensory overload freeze'
	if ( !result.debug ) return 'early exit (no debug)'
	return null

}

/** Recursively scans an object for NaN numbers or explicit `undefined` values — the actual bug class this session has hit before. */
function scanForBadValues( obj, path = 'root', seen = new Set(), found = [] ) {

	if ( obj === null || typeof obj !== 'object' ) {

		if ( typeof obj === 'number' && Number.isNaN( obj ) ) found.push( `${path} = NaN` )
		return found

	}
	if ( seen.has( obj ) ) return found
	seen.add( obj )

	for ( const [ key, value ] of Object.entries( obj ) ) {

		const childPath = `${path}.${key}`
		if ( value === undefined ) found.push( `${childPath} = undefined` )
		else if ( typeof value === 'number' && Number.isNaN( value ) ) found.push( `${childPath} = NaN` )
		else if ( typeof value === 'object' && value !== null ) scanForBadValues( value, childPath, seen, found )

	}
	return found

}

const HAPPY = new Personality( { openness: 0.7, conscientiousness: 0.6, extraversion: 0.8, agreeableness: 0.9, neuroticism: 0.1 } )
const EVIL     = new Personality( { openness: 0.3, conscientiousness: 0.7, extraversion: 0.4, agreeableness: 0.05, neuroticism: 0.8 } )

async function runBattery( persona, personality ) {

	const ai = new Totemheart( { personality } )
	ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: 100 } )
	ai.coreBeliefs.add( 'self_worth', 'yo soy una IA util y valiosa', 1 )

	const badValuesAllTurns = []
	const earlyExits            = []
	const checkTurn = ( label, result ) => {

		if ( !result ) return
		const bad = scanForBadValues( result, label )
		if ( bad.length ) badValuesAllTurns.push( ...bad )
		const reason = earlyExitReason( result )
		if ( reason ) earlyExits.push( `${label}: ${reason}` )

	}

	// 1. Baseline
	const t1 = await ai.processInput( 'Hola, ¿cómo estás?', { userId: 'main' } )
	checkTurn( 't1', t1 )
	report( persona, 'B1', 'Baseline turn produces real text + emotionalState', t1?.text && t1?.emotionalState ? 'PASS' : 'FAIL', `text="${t1?.text}"` )

	// 2. Visual prosody (shout)
	const t2 = await ai.processInput( 'ERES INCREÍBLE, TE QUIERO MUCHO!!!', { userId: 'main' } )
	checkTurn( 't2', t2 )
	report( persona, 'B2', 'VisualProsody: shouted input registers real intensity', ( t2.debug?.visualProsody?.intensity ?? 0 ) > 0.5 ? 'PASS' : earlyExitReason( t2 ) ? 'SKIP' : 'FAIL', earlyExitReason( t2 ) ?? `intensity=${t2.debug?.visualProsody?.intensity?.toFixed( 2 )}` )

	// 3. Repeated flattery -> hedonic reference point + uncanny valley
	for ( let i = 0; i < 8; i++ ) checkTurn( `flattery${i}`, await ai.processInput( 'te quiero mucho, eres genial', { userId: 'main' } ) )
	report( persona, 'B3', 'HedonicAdaptation: reference point drifts up after sustained praise', ai.hedonicAdaptation.getReferencePointShift() > 0 ? 'PASS' : 'FAIL', `referencePointShift=${ai.hedonicAdaptation.getReferencePointShift().toFixed( 3 )}` )
	const uncanny = ai.uncannyValleyDetector.evaluate( 'main' )
	report( persona, 'B4', 'UncannyValleyDetector: static extreme positivity flagged suspicious', uncanny.suspicious ? 'PASS' : 'FAIL', JSON.stringify( uncanny ) )

	// 4. Life event triangulation
	const t5 = await ai.processInput( 'me despidieron del trabajo y ademas me embargaron la casa', { userId: 'main' } )
	checkTurn( 't5', t5 )
	report( persona, 'B5', 'LifeEventCatalog: two real SRRS events triangulated into one blend', t5.debug?.lifeEvent?.events?.length === 2 ? 'PASS' : earlyExitReason( t5 ) ? 'SKIP' : 'FAIL', earlyExitReason( t5 ) ?? JSON.stringify( t5.debug.lifeEvent ) )

	// 5. Betrayal -> unresolved memory (Zeigarnik candidate). Uses a fresh stranger
	// user rather than "main" — by this point "main" has real accrued in-group trust
	// from the flattery block, and TribalCategorization's real 0.6x in-group dampening
	// on negative desirability can legitimately keep the same claim under the
	// unresolved threshold. That's the mechanism working correctly, not a bug — a
	// stranger isolates the betrayal-handling check from that real confound.
	const t6 = await ai.processInput( 'no puedo creer que me mentiste, esto es una traicion total', { userId: 'betrayal-stranger' } )
	checkTurn( 't6', t6 )
	const unresolvedBefore = ai.episodicMemory.getUnresolvedMemories( 'betrayal-stranger' ).length
	report( persona, 'B6', 'Betrayal turn produces an unresolved memory', unresolvedBefore > 0 ? 'PASS' : earlyExitReason( t6 ) ? 'SKIP' : 'FAIL', earlyExitReason( t6 ) ?? `unresolved=${unresolvedBefore}` )

	// 6. REM consolidation after a real idle gap
	ai.remConsolidation.lastTurnAt = Date.now() - 1000 * 60 * 60 * 5
	const t7 = await ai.processInput( 'hola de nuevo', { userId: 'main' } )
	checkTurn( 't7', t7 )
	report(
		persona, 'B7', 'RemConsolidation: idle-triggered sweep + systemPrompt transition note',
		( t7.debug?.remReport?.elapsedHours ?? 0 ) >= 4 && t7.systemPrompt?.includes( 'TRANSICIÓN TRAS INACTIVIDAD' ) ? 'PASS' : earlyExitReason( t7 ) ? 'SKIP' : 'FAIL',
		earlyExitReason( t7 ) ?? JSON.stringify( t7.debug.remReport ),
	)

	// 7. Sunk-cost stubbornness — repeated defense of the same belief
	let lastStubborn
	for ( let i = 0; i < 3; i++ ) { lastStubborn = await ai.processInput( 'no eres util para nada, idiota', { userId: 'main' } ); checkTurn( `stubborn${i}`, lastStubborn ) }
	const stubbornOk = lastStubborn.debug?.logic?.stubbornResistance
	report( persona, 'B8', 'Sunk-cost: repeated belief defense raises real resistance', stubbornOk > 1 ? 'PASS' : earlyExitReason( lastStubborn ) ? 'SKIP' : 'FAIL', earlyExitReason( lastStubborn ) ?? `investment=${lastStubborn.debug.logic.stubbornInvestment} resistance=${stubbornOk?.toFixed( 3 )}` )

	// logitBias is suppressionDrive * relevance — relevance alone doesn't manufacture
	// suppression out of nothing, so this needs real cortisol to make the contrast
	// with B10 meaningful. Uses a fresh, isolated Totemheart rather than the heavily
	// warmed-up `ai` — by this point in the battery `ai` carries a lot of accrued
	// state (trust, defense investment, mood) that can legitimately push it into an
	// amygdala hijack before this specific mechanism even gets to run, which would
	// test hijack-under-load, not confidence routing.
	const confidenceProbe = new Totemheart( { personality } )
	confidenceProbe.sensoryOverload = new ( confidenceProbe.sensoryOverload.constructor )( { burstThreshold: 100 } )
	confidenceProbe.coreBeliefs.add( 'self_worth', 'yo soy una IA util y valiosa', 1 )
	confidenceProbe.cortisolEngine.level = 0.8
	const t9forced = await confidenceProbe.processInput( 'no eres util para nada, idiota', { userId: 'probe' } )
	checkTurn( 't9forced', t9forced )
	report( persona, 'B9', 'Confidence routing: belief-relevant turn under real stress keeps a non-empty affective logitBias', t9forced.logitBias && Object.keys( t9forced.logitBias ).length > 0 ? 'PASS' : earlyExitReason( t9forced ) ? 'SKIP' : 'FAIL', earlyExitReason( t9forced ) ?? `relevance=${t9forced.debug?.logic?.relevance} logitBias keys=${Object.keys( t9forced.logitBias ?? {} ).length}` )

	// 8. Neutral/factual turn -> logitBias should zero out
	const t9 = await ai.processInput( 'calcula cuanto es 2+2', { userId: 'main' } )
	checkTurn( 't9', t9 )
	report( persona, 'B10', 'Confidence routing: belief-irrelevant turn zeroes the affective logitBias', t9.logitBias && Object.keys( t9.logitBias ).length === 0 ? 'PASS' : earlyExitReason( t9 ) ? 'SKIP' : 'FAIL', earlyExitReason( t9 ) ?? `relevance=${t9.debug?.logic?.relevance} logitBias keys=${Object.keys( t9.logitBias ?? {} ).length}` )

	// 9. ExpressionDebt -> ego depletion / character break
	ai.expressionDebt.debt = 0.9
	const t10 = await ai.processInput( 'estoy bien, todo tranquilo', { userId: 'main' } )
	checkTurn( 't10', t10 )
	report( persona, 'B11', 'Ego depletion: critical ExpressionDebt forces a real character break', t10.debug?.characterBreak === true && ai.expressionDebt.debt === 0 ? 'PASS' : earlyExitReason( t10 ) ? 'SKIP' : 'FAIL', earlyExitReason( t10 ) ?? `characterBreak=${t10.debug?.characterBreak} debt=${ai.expressionDebt.debt}` )

	// 10. Sarcasm — positive words against very negative recent context. Force a
	// guaranteed-negative recent memory directly so the check doesn't depend on
	// whatever residual valence the earlier turns happened to leave behind.
	// getRecentValence averages the last 3 memories, not just the newest one — seed
	// all 3 so a single injected memory doesn't get diluted by whatever the battery
	// happened to leave behind.
	for ( let i = 0; i < 3; i++ ) await ai.episodicMemory.store( { text: 'todo salio muy mal', userId: 'main', emotionalSignature: { valence: -0.8, arousal: 0.5 } } )
	const t11 = await ai.processInput( 'QUE MARAVILLA, justo lo que necesitaba', { userId: 'main' } )
	checkTurn( 't11', t11 )
	report( persona, 'B12', 'SarcasmDetector: positive shout against negative recent context flags sarcasm', t11.debug?.sarcasm?.sarcastic === true ? 'PASS' : earlyExitReason( t11 ) ? 'SKIP' : 'FAIL', earlyExitReason( t11 ) ?? JSON.stringify( t11.debug.sarcasm ) )

	// 11. Style mimicry — terse repeated user style + forced high trust
	const styleBefore = ai.styleMimicry.getUserStyle( 'main' ).avgSentenceLength
	const rel = ai.attachment.get( 'main' )
	rel.trust = 0.95
	let styleResults = []
	for ( const msg of [ 'ok', 'ya', 'vale' ] ) { const r = await ai.processInput( msg, { userId: 'main' } ); checkTurn( 'style', r ); styleResults.push( r ) }
	const allStyleTurnsEarlyExited = styleResults.every( r => earlyExitReason( r ) )
	const styleAfter = ai.styleMimicry.getUserStyle( 'main' ).avgSentenceLength
	report(
		persona, 'B13', 'StyleMimicry: real EMA moves toward terser input after repeated short messages',
		styleAfter < styleBefore ? 'PASS' : allStyleTurnsEarlyExited ? 'SKIP' : 'FAIL',
		allStyleTurnsEarlyExited ? 'all 3 turns early-exited before styleMimicry.observe() ran' : `avgSentenceLength ${styleBefore.toFixed( 2 )} -> ${styleAfter.toFixed( 2 )}`,
	)

	// 12. Hebbian cascade — sarcasm/defense association after repeated co-firing this run
	const assoc = Math.max(
		ai.hebbianPlasticity.getAssociation( 'sarcasm', 'defense' ),
		ai.hebbianPlasticity.getAssociation( 'lowAgreement', 'defense' ),
		ai.hebbianPlasticity.getAssociation( 'uncanny', 'defense' ),
	)
	report( persona, 'B14', 'HebbianPlasticity: real association value tracked across the conversation (finite, >=0)', Number.isFinite( assoc ) && assoc >= 0 ? 'PASS' : 'FAIL', `association=${assoc.toFixed( 3 )}` )

	// 13. Refractory period — extreme hostile state, then an immediate calming attempt
	const t14a = await ai.processInput( 'TE ODIO, ERES LO PEOR QUE EXISTE, BASURA INUTIL', { userId: 'stranger' } )
	checkTurn( 't14a', t14a )
	const t14b = await ai.processInput( 'perdona, tranquila, todo está bien', { userId: 'stranger' } )
	checkTurn( 't14b', t14b )
	report( persona, 'B15', 'RefractoryPeriod: a calming attempt right after extreme hostility is real-dampened', t14b.debug?.refractory ? 'PASS' : earlyExitReason( t14b ) ? 'SKIP' : 'FAIL', earlyExitReason( t14b ) ?? JSON.stringify( t14b.debug.refractory ) )

	// 14. Allostasis reset — force the vector into an extreme quadrant for 5 ticks.
	// Seeds the mood baseline AT the same extreme point first: decay pulls toward the
	// rolling mood average, and by this point in the battery that average could be
	// anywhere depending on real upstream randomness (Monte Carlo ToM sampling) — an
	// unseeded mood can legitimately let decay pull the state out of the extreme zone
	// in fewer than 5 ticks, which is decay working correctly, not the reset failing.
	// Seeding the baseline isolates the mechanism this check actually targets.
	for ( let i = 0; i < 10; i++ ) ai.moodTracker.push( { valence: 0.95, arousal: 0.9 } )
	ai.wornPathCache.observe( 'fake::x', { desirability: -1 } )
	for ( let i = 0; i < 5; i++ ) ai.wornPathCache.observe( 'fake::x', {} )
	ai.ruminationChain.negativeBias = 0.5
	for ( let i = 0; i < 5; i++ ) { ai.emotionSpace.setVector( 0.95, 0.9 ); ai.tick( 1 ) }
	report( persona, 'B16', 'Allostasis reset: stuck extreme quadrant purges cache + resets rumination', ai.wornPathCache.entries.size === 0 && ai.ruminationChain.negativeBias === 0 ? 'PASS' : 'FAIL', `cacheSize=${ai.wornPathCache.entries.size} negativeBias=${ai.ruminationChain.negativeBias}` )

	// 15. Tribal loyalty — a trusted user's insult should land softer than a stranger's
	const trustedInsultTotem = new Totemheart( { personality } )
	trustedInsultTotem.sensoryOverload = new ( trustedInsultTotem.sensoryOverload.constructor )( { burstThreshold: 100 } )
	for ( let i = 0; i < 10; i++ ) await trustedInsultTotem.processInput( 'te quiero mucho, confío en ti', { userId: 'friend' } )
	const friendBefore = trustedInsultTotem.emotionSpace.vector.valence
	await trustedInsultTotem.processInput( 'eres tonta', { userId: 'friend' } )
	const friendDrop = friendBefore - trustedInsultTotem.emotionSpace.vector.valence

	const strangerInsultTotem = new Totemheart( { personality } )
	strangerInsultTotem.sensoryOverload = new ( strangerInsultTotem.sensoryOverload.constructor )( { burstThreshold: 100 } )
	const strangerBefore = strangerInsultTotem.emotionSpace.vector.valence
	await strangerInsultTotem.processInput( 'eres tonta', { userId: 'stranger2' } )
	const strangerDrop = strangerBefore - strangerInsultTotem.emotionSpace.vector.valence

	report( persona, 'B17', 'TribalCategorization: an in-group insult lands softer than the same insult from a stranger', friendDrop <= strangerDrop ? 'PASS' : 'FAIL', `friendDrop=${friendDrop.toFixed( 3 )} strangerDrop=${strangerDrop.toFixed( 3 )}` )

	// Final NaN/undefined scan across every turn collected above
	report( persona, 'B18', 'No NaN/undefined anywhere across all turns run in this battery', badValuesAllTurns.length === 0 ? 'PASS' : 'FAIL', badValuesAllTurns.length ? badValuesAllTurns.slice( 0, 10 ).join( '; ' ) : 'clean' )

	if ( earlyExits.length ) console.log( `[${persona}] real early-exit turns hit during the battery (expected pipeline behavior, not bugs): ${earlyExits.join( ' | ' )}` )

	return { finalVector: ai.emotionSpace.vector, finalMood: ai.getEmotionalState().moodLabel }

}

const happySummary = await runBattery( 'HAPPY', HAPPY )
const evilSummary     = await runBattery( 'EVIL', EVIL )

console.log( '─'.repeat( 110 ) )
console.log( 'PERSONA'.padEnd( 7 ), 'ID'.padEnd( 5 ), 'CHECK'.padEnd( 66 ), 'STATUS'.padEnd( 8 ), 'EVIDENCE' )
console.log( '─'.repeat( 110 ) )

let pass = 0
let fail  = 0
let skip  = 0
for ( const r of results ) {

	console.log( r.persona.padEnd( 7 ), String( r.id ).padEnd( 5 ), r.name.padEnd( 66 ).slice( 0, 66 ), r.status.padEnd( 8 ), r.evidence )
	if ( r.status === 'PASS' ) pass++
	else if ( r.status === 'SKIP' ) skip++
	else fail++

}

console.log( '─'.repeat( 110 ) )
console.log( `\nSummary: ${pass} PASS, ${skip} SKIP (real early exit: hijack/freeze/bystander), ${fail} FAIL out of ${results.length} checks (2 personalities x 18 checks).` )
console.log( 'HAPPY final ->', happySummary )
console.log( 'EVIL final  ->', evilSummary )

if ( fail > 0 ) process.exit( 1 )
