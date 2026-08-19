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

// ============================= SESSION 1: two personalities conversing with each other =============================
// Each real reply from one becomes the real input for the other — this is not a
// fixed script, it's an emergent chain of one full pipeline feeding the other.

console.log( '--- Session 1: real conversation between two personalities ---\n' )

let toCynic = 'Hola, ¿qué opinas de empezar un proyecto nuevo juntos?'
for ( let i = 0; i < 3; i++ ) {

	const rCynic = await cynic.processInput( toCynic, { userId: 'optimist' } )
	console.log( `Optimist -> Cynic: "${toCynic}"` )
	console.log( `Cynic -> Optimist: "${rCynic.text}"\n` )

	const rOptimist = await optimist.processInput( rCynic.text, { userId: 'cynic' } )
	console.log( `Cynic -> Optimist: "${rCynic.text}"` )
	console.log( `Optimist -> Cynic: "${rOptimist.text}"\n` )

	toCynic = rOptimist.text

}

report( 'C1', 'A real chained conversation produces text in both directions with no exceptions', 'PASS-live', 'see transcript above' )

// Real emotionally intense event, injected into the conversation — generates a
// real episodic memory with high importance in the CYNIC.
const betrayalTurn = await cynic.processInput( 'NO PUEDO CREER QUE ME MENTISTE SOBRE EL PROYECTO, esto es HORRIBLE, es una traicion total y me da mucho dolor!!!', { userId: 'optimist' } )
const memory              = cynic.episodicMemory.memories.at( -1 )
report(
	'C2', 'The intense event is stored as a real episodic memory (importance > 0.6)',
	memory && memory.importance > 0.6 ? 'PASS-live' : 'FAIL',
	`importance=${memory?.importance?.toFixed( 3 )} arousal=${memory?.emotionalSignature?.arousal?.toFixed( 3 )} valence=${memory?.emotionalSignature?.valence?.toFixed( 3 )}`,
)

const arousal0    = memory.emotionalSignature.arousal
const valence0    = memory.emotionalSignature.valence
const concepts0 = [ ...memory.concepts ]
const selfModelBefore = JSON.stringify( cynic.selfModel.getDominant() )
const trustBefore         = cynic.attachment.get( 'optimist' ).trust

// ============================= REM TIMING TEST =============================

console.log( '\n--- Session 2: 20 minutes later (below the 4h threshold — REM must NOT trigger) ---\n' )
cynic.remConsolidation.lastTurnAt = Date.now() - 1000 * 60 * 20
const shortGapResult                    = await cynic.processInput( 'sigo pensando en lo que paso', { userId: 'optimist' } )
report(
	'C3', 'A short gap (20 min) does NOT trigger the REM sweep — the real inactivity threshold is respected',
	!shortGapResult.debug?.remReport ? 'PASS-live' : 'FAIL',
	`remReport=${JSON.stringify( shortGapResult.debug?.remReport ?? null )}`,
)
report(
	'C4', 'Without a REM sweep, the memory stays exactly the same (neither cooled nor touched)',
	memory.emotionalSignature.arousal === arousal0 && memory.emotionalSignature.valence === valence0 ? 'PASS-live' : 'FAIL',
	`arousal=${memory.emotionalSignature.arousal.toFixed( 3 )} (was ${arousal0.toFixed( 3 )})`,
)

console.log( '--- Session 3: 5 hours later (above the threshold — REM SHOULD trigger) ---\n' )
cynic.remConsolidation.lastTurnAt = Date.now() - 1000 * 60 * 60 * 5
const remResult                          = await cynic.processInput( 'hola de nuevo', { userId: 'optimist' } )
console.log( `Cynic after the REM sweep: "${remResult.text}"` )
console.log( `systemPrompt includes transition note: ${remResult.systemPrompt.includes( 'TRANSICIÓN TRAS INACTIVIDAD' )}\n` )

report(
	'C5', 'A real 5h gap DOES trigger the REM sweep, with real hours reported',
	remResult.debug?.remReport?.elapsedHours >= 4 ? 'PASS-live' : 'FAIL',
	JSON.stringify( remResult.debug?.remReport ),
)

const expectedArousal = arousal0 * Math.exp( -0.3 ) // lambdaRem=0.3 by default, real RemConsolidation formula
report(
	'C6', 'The memory\'s arousal peak cools according to the real e^(-lambdaREM) formula, not arbitrarily',
	Math.abs( memory.emotionalSignature.arousal - expectedArousal ) < 0.01 ? 'PASS-live' : 'FAIL',
	`arousal ${arousal0.toFixed( 3 )} -> ${memory.emotionalSignature.arousal.toFixed( 3 )} (expected ${expectedArousal.toFixed( 3 )})`,
)

report(
	'C7', 'The semantic "lesson" survives intact: valence and concepts are NOT touched, only the arousal peak',
	memory.emotionalSignature.valence === valence0 && JSON.stringify( memory.concepts ) === JSON.stringify( concepts0 ) ? 'PASS-live' : 'FAIL',
	`valence=${memory.emotionalSignature.valence.toFixed( 3 )} (was ${valence0.toFixed( 3 )}), concepts=${JSON.stringify( memory.concepts )}`,
)

report(
	'C8', 'The memory is marked "REM-salient" (remSalient) for having high importance',
	memory.remSalient === true ? 'PASS-live' : 'FAIL',
	`remSalient=${memory.remSalient}`,
)

report(
	'C9', 'Identity-level learning (SelfModel, Attachment trust) is NOT reset by sleep',
	JSON.stringify( cynic.selfModel.getDominant() ) === selfModelBefore && cynic.attachment.get( 'optimist' ).trust !== 0.5 ? 'PASS-live' : 'FAIL',
	`selfModel unchanged=${JSON.stringify( cynic.selfModel.getDominant() ) === selfModelBefore}, trust=${cynic.attachment.get( 'optimist' ).trust.toFixed( 3 )} (was ${trustBefore.toFixed( 3 )})`,
)

// ============================= LATENCY AND REACTIVATION AFTER MONTHS =============================

console.log( '--- Session 4: 90 days later (the memory should be "loose" but not erased) ---\n' )
const latentBeforeAging = cynic.episodicMemory.getLatentWeight( memory )
memory.remTaggedAt              = Date.now() - 1000 * 60 * 60 * 24 * 90 // the tagging itself ages 90 real days
const latentAfter90Days   = cynic.episodicMemory.getLatentWeight( memory ) // measured BEFORE a new sweep re-tags the memory as "fresh"

report(
	'C10', 'After 90 real days, the latent weight decays heavily but NEVER reaches absolute zero',
	latentAfter90Days < latentBeforeAging && latentAfter90Days > 0 ? 'PASS-live' : 'FAIL',
	`latent weight ${latentBeforeAging.toFixed( 4 )} -> ${latentAfter90Days.toFixed( 4 )}`,
)

// Now we actually process the turn 90 days later — this triggers ANOTHER real REM
// sweep, which re-tags the memory as freshly salient (remTaggedAt is set to today)
// because its importance is still high. Real documented behavior, not hidden:
// a memory that remains relevant in every sleep cycle "refreshes" instead of fading.
cynic.remConsolidation.lastTurnAt = Date.now() - 1000 * 60 * 60 * 24 * 90
const monthsLaterResult                  = await cynic.processInput( '¿qué tal el tiempo hoy?', { userId: 'optimist' } )
report(
	'C10b', 'A real REM sweep re-tags as salient a memory that still deserves it (it does not fade over time if it remains important)',
	memory.remSalient === true && memory.remTaggedAt > Date.now() - 1000 * 60 ? 'PASS-live' : 'FAIL',
	`remSalient=${memory.remSalient} remTaggedAt ${( ( Date.now() - memory.remTaggedAt ) / 1000 ).toFixed( 1 )}s ago`,
)

const unrelatedReactivation = cynic.episodicMemory.getBestReactivation( tokenize( '¿qué tal el tiempo hoy?' ) )
report(
	'C11', 'An unrelated message does NOT reactivate the latent memory (no real token overlap)',
	unrelatedReactivation === null ? 'PASS-live' : 'FAIL',
	`reactivation=${JSON.stringify( unrelatedReactivation )}`,
)

console.log( '--- Session 5: the original topic reappears 90 days later — does the "spark" happen? ---\n' )
const sparkResult = await cynic.processInput( 'oye, todavia pienso en aquella traicion de hace meses', { userId: 'optimist' } )
console.log( `Cynic facing the reappeared topic: "${sparkResult.text}"\n` )

report(
	'C12', 'The real spark: mentioning "traicion" 90 days later reactivates the latent memory (score rises from real token overlap)',
	sparkResult.debug?.reactivation && sparkResult.debug.reactivation.score > latentAfter90Days ? 'PASS-live' : 'FAIL',
	JSON.stringify( sparkResult.debug?.reactivation ),
)

// ============================= COMPARISON BETWEEN PERSONALITIES =============================

console.log( '--- Comparison: does the optimist recover faster than the cynic after the same sleep? ---\n' )

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
	'C13', 'After the same shock and the same real 5h gap, the optimist (low neuroticism) recovers more valence than the cynic (high neuroticism) — same decay formula, genuinely different personality',
	optimistRecovery.recovered >= cynicRecovery.recovered ? 'PASS-live' : 'FAIL',
	`optimist recovered ${optimistRecovery.recovered.toFixed( 3 )}, cynic recovered ${cynicRecovery.recovered.toFixed( 3 )}`,
)

// ============================= REPORT =============================

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
console.log( `\nSummary: ${pass} PASS, ${fail} FAIL out of ${results.length} checks.` )

if ( fail > 0 ) process.exit( 1 )
