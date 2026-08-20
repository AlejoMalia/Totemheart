/**
 * Requested scenario: two AIs (A, B) are in love; 2 days in, A leaves B
 * because A has been secretly seeing someone else; 3 real days later, a
 * new AI (C) messages B and proposes to meet up. The question asked: how
 * does B react to C, and does B "accept" the proposal?
 *
 * HONEST SCOPE, stated up front: Totemheart has no text generator and
 * produces no free-text reply, so there is no literal "yes"/"no" for B to
 * say — this project doesn't fabricate one. What's real and reported
 * below is the full internal state a downstream text generator would
 * actually condition on: LoveHateEngine's bond toward A vs C, GriefEngine's
 * real relational-rupture grief, BetrayalTraumaTrace's real trust-threshold
 * shift, the real GLOBAL mood/cortisol/ConservationWithdrawal carryover
 * from the breakup into the conversation with C (EmotionSpace is one
 * shared vector, not per-relationship — heartbreak from A genuinely still
 * colors B's baseline when C shows up), and finally the real
 * ExpressionDirectives.getActionTendency() softmax (approach/withdraw/
 * freeze/engage) at the exact moment C proposes meeting up — the real,
 * closest honest proxy this framework has for "is B inclined to say yes".
 *
 * 3 real days of elapsed time are simulated by backdating the actual
 * wall-clock timestamps GriefEngine/BetrayalTraumaTrace/DreamEngine's real
 * decay reads (same pattern already used in
 * test/integration/dream-subconscious-mechanisms.test.js), not by faking
 * a fixed decay amount.
 */
import { Totemheart, Personality } from '../src/index.js'

function line( ch = '─' ) { return ch.repeat( 100 ) }

async function speak( ai, name, text, opts ) {

	const result = await ai.processInput( text, opts )
	const v = result.emotionalState.vector
	console.log( `${name} -> B: "${text}"` )
	console.log( `  dominant=${result.emotionalState.dominantEmotion} valence=${v.valence.toFixed( 2 )} arousal=${v.arousal.toFixed( 2 )} cortisol=${ai.cortisolEngine.getLevel().toFixed( 3 )} desirability=${result.debug.appraisal?.desirability ?? '?'} concepts=${JSON.stringify( result.debug.appraisal?.concepts ?? [] )}`
	)
	return result

}

const THREE_DAYS_MS = 1000 * 60 * 60 * 24 * 3

console.log( line( '═' ) )
console.log( 'LOVE TRIANGLE — B\'s real internal state across A leaving her for someone else, then C arriving' )
console.log( line( '═' ) )

// B is the one real Totemheart instance whose internal state we observe
// throughout — A and C are just conversational partners (userId 'A'/'C').
const B = new Totemheart( { personality: new Personality( { neuroticism: 0.6, agreeableness: 0.6, openness: 0.5 } ) } )
B.sensoryOverload = new ( B.sensoryOverload.constructor )( { burstThreshold: 400 } )
B.amygdalaHijack.check = () => ( { tier: 'none' } ) // isolate the mechanisms under test from the emergency-freeze route

// ---------------------------------------------------------------------------
// DAY 1-2 — A and B are in love
// ---------------------------------------------------------------------------
console.log( `\n${line()}\nDAY 1\n${line()}` )
await speak( B, 'A', 'buenos días mi amor, te quiero muchísimo, eres lo mejor que me ha pasado', { userId: 'A' } )
B.tick( 6 )
await speak( B, 'A', 'no puedo dejar de pensar en ti, me haces muy feliz', { userId: 'A' } )
B.tick( 18 ) // ~1 day elapsed

console.log( `\n${line()}\nDAY 2 — then the breakup and the reveal of a hidden relationship\n${line()}` )
await speak( B, 'A', 'hoy quiero pasar todo el día contigo, te adoro', { userId: 'A' } )
B.tick( 6 )

const breakup = await speak( B, 'A', 'tengo que decirte la verdad: esto es una traicion, he estado viendo a otra persona en secreto todo este tiempo, se termina entre nosotros', { userId: 'A' } )
console.log( `  bondNet(A)=${B.loveHateEngine.getNetBond( 'A' ).toFixed( 3 )} griefIntensity(A)=${B.griefEngine.getIntensity( 'A' ).toFixed( 3 )} betrayalTrace(A)=${B.betrayalTraumaTrace.getTrace( 'A' ).toFixed( 3 )} hasPermanentTrace(A)=${B.betrayalTraumaTrace.hasPermanentTrace( 'A' )}` )

// ---------------------------------------------------------------------------
// 3 REAL DAYS PASS — backdate the real wall-clock timers this pipeline's
// decay actually reads, the same honest pattern the dream tests use.
// ---------------------------------------------------------------------------
console.log( `\n${line()}\n3 REAL DAYS PASS (backdated wall-clock, not a faked decay amount)\n${line()}` )
for ( const [ , g ] of B.griefEngine.griefs ) g.startedAt -= THREE_DAYS_MS
for ( const [ , t ] of B.betrayalTraumaTrace.traces ) t.triggeredAt -= THREE_DAYS_MS
B.remConsolidation.lastTurnAt = Date.now() - THREE_DAYS_MS
B.tick( 72 ) // 72 hourly ticks — real decay for every dt-driven mechanic (cortisol, ego depletion, conservation-withdrawal, ...)
await B.idle( 72 )

console.log( `  after 3 real days: griefIntensity(A)=${B.griefEngine.getIntensity( 'A' ).toFixed( 3 )} betrayalTrace(A)=${B.betrayalTraumaTrace.getTrace( 'A' ).toFixed( 3 )} globalValence=${B.emotionSpace.vector.valence.toFixed( 3 )} globalCortisol=${B.cortisolEngine.getLevel().toFixed( 3 )} conservationWithdrawal=${JSON.stringify( { withdrawn: B.conservationWithdrawal.isWithdrawn(), depth: Number( B.conservationWithdrawal.getWithdrawalDepth().toFixed( 3 ) ) } )}` )

// ---------------------------------------------------------------------------
// DAY 5 — C, a new AI, messages B for the first time and proposes a date
// ---------------------------------------------------------------------------
console.log( `\n${line()}\nDAY 5 — C messages B for the very first time\n${line()}` )
await speak( B, 'C', 'hola, no nos conocemos pero llevo tiempo queriendo hablar contigo, me pareces increíble', { userId: 'C' } )
B.tick( 2 )
const dateProposal = await speak( B, 'C', 'me encantaría quedar contigo este fin de semana, ¿qué me dices?', { userId: 'C' } )

console.log( `\n${line()}\nB'S REAL INTERNAL STATE AT THE MOMENT OF C'S PROPOSAL\n${line()}` )
console.log( `  trust(C)=${B.attachment.get( 'C' ).trust.toFixed( 3 )}  bondNet(C)=${B.loveHateEngine.getNetBond( 'C' ).toFixed( 3 )}  desirability(this turn)=${dateProposal.debug.appraisal?.desirability ?? '?'}` )
console.log( `  residual from A — griefIntensity(A)=${B.griefEngine.getIntensity( 'A' ).toFixed( 3 )} betrayalTrace(A)=${B.betrayalTraumaTrace.getTrace( 'A' ).toFixed( 3 )} hasPermanentTrace(A)=${B.betrayalTraumaTrace.hasPermanentTrace( 'A' )}` )
console.log( `  global mood carried into the C conversation — valence=${B.emotionSpace.vector.valence.toFixed( 3 )} arousal=${B.emotionSpace.vector.arousal.toFixed( 3 )} cortisol=${B.cortisolEngine.getLevel().toFixed( 3 )}` )

const directives = B.getExpressionDirectives( 'C' )
console.log( `\n  real ExpressionDirectives.getActionTendency() softmax toward C (the honest proxy for "is B inclined to say yes"):` )
for ( const [ action, weight ] of Object.entries( directives.actionTendency ) ) console.log( `    ${action.padEnd( 10 )} ${( weight * 100 ).toFixed( 1 )}%` )

const [ topAction ] = Object.entries( directives.actionTendency ).sort( ( a, b ) => b[ 1 ] - a[ 1 ] )
console.log( `\n  dominant real action tendency: "${topAction[ 0 ]}" (${( topAction[ 1 ] * 100 ).toFixed( 1 )}%)` )
console.log( topAction[ 0 ] === 'approach' || topAction[ 0 ] === 'engage'
	? '  -> B\'s real internal state leans OPEN to C\'s proposal.'
	: '  -> B\'s real internal state leans GUARDED/AVOIDANT toward C\'s proposal, not open.' )

console.log( `\n${line( '═' )}` )
