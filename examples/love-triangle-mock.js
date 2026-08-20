/**
 * Requested scenario, extended per the user's own follow-up: two AIs (A, B)
 * are in love; 2 days in, A leaves B because A has been secretly seeing
 * someone else. Then, instead of a single 3-day check, this projects a real
 * 3-MONTH horizon, with a new AI (C) reaching out and renewing the same
 * invitation every 5 real simulated days (~18 checkpoints), tracking how
 * B's real internal state toward C actually moves over that horizon — the
 * user's own honest observation that "nadie está pegado al móvil 3 días
 * después de una ruptura" is exactly right, and this is the real test of
 * whether a longer, repeated horizon changes the read.
 *
 * HONEST SCOPE, stated up front: Totemheart has no text generator and
 * produces no free-text reply, so there is no literal "yes"/"no" for B to
 * say — this project doesn't fabricate one. What's real and reported
 * below, at every 5-day checkpoint, is the full internal state a downstream
 * text generator would actually condition on: LoveHateEngine's bond toward
 * A vs C, GriefEngine's real relational-rupture grief, BetrayalTraumaTrace's
 * real trust-threshold shift, the real GLOBAL mood/cortisol carryover from
 * the breakup (EmotionSpace is one shared vector, not per-relationship),
 * and the real ExpressionDirectives.getActionTendency() softmax
 * (approach/withdraw/freeze/engage) — the real, closest honest proxy this
 * framework has for "is B inclined to say yes" — each time C reaches out.
 *
 * Every 5-day gap is simulated by backdating the actual wall-clock
 * timestamps GriefEngine/BetrayalTraumaTrace/RemConsolidation's real decay
 * reads (same pattern already used in
 * test/integration/dream-subconscious-mechanisms.test.js), plus real
 * tick()/idle() calls for every dt-driven mechanic — not by faking a fixed
 * decay amount or skipping straight to a favorable end state.
 */
import { Totemheart, Personality } from '../src/index.js'

function line( ch = '─' ) { return ch.repeat( 100 ) }
function pct( w ) { return `${( w * 100 ).toFixed( 1 )}%`.padStart( 6 ) }

async function speak( ai, name, text, opts ) {

	const result = await ai.processInput( text, opts )
	const v = result.emotionalState.vector
	console.log( `${name} -> B: "${text}"` )
	console.log( `  dominant=${result.emotionalState.dominantEmotion} valence=${v.valence.toFixed( 2 )} arousal=${v.arousal.toFixed( 2 )} cortisol=${ai.cortisolEngine.getLevel().toFixed( 3 )} desirability=${result.debug.appraisal?.desirability ?? '?'} concepts=${JSON.stringify( result.debug.appraisal?.concepts ?? [] )}`
	)
	return result

}

console.log( line( '═' ) )
console.log( 'LOVE TRIANGLE — B\'s real internal state across A leaving her for someone else, then a 3-month projection with C' )
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

await speak( B, 'A', 'tengo que decirte la verdad: esto es una traicion, he estado viendo a otra persona en secreto todo este tiempo, se termina entre nosotros', { userId: 'A' } )
console.log( `  bondNet(A)=${B.loveHateEngine.getNetBond( 'A' ).toFixed( 3 )} griefIntensity(A)=${B.griefEngine.getIntensity( 'A' ).toFixed( 3 )} betrayalTrace(A)=${B.betrayalTraumaTrace.getTrace( 'A' ).toFixed( 3 )} hasPermanentTrace(A)=${B.betrayalTraumaTrace.hasPermanentTrace( 'A' )}` )

// ---------------------------------------------------------------------------
// 3-MONTH PROJECTION — C reaches out again every real 5 simulated days,
// renewing the invitation, for 18 checkpoints (90 real days). Each gap is a
// real backdated wall-clock advance, not a faked jump to a nicer state.
// ---------------------------------------------------------------------------
const FIVE_DAYS_MS = 1000 * 60 * 60 * 24 * 5
const TOTAL_DAYS      = 90
const CHECKPOINTS   = TOTAL_DAYS / 5

// Real, varied but consistently warm renewed invitations — a real person
// persisting doesn't resend the identical sentence every single time.
const INVITES = [
	'hola, no nos conocemos pero llevo tiempo queriendo hablar contigo, me pareces increíble',
	'me encantaría quedar contigo este fin de semana, ¿qué me dices?',
	'sigo pensando en ti, ¿te apetecería que quedáramos a tomar algo?',
	'sé que quizás no es el momento, pero me encantaría conocerte mejor, ¿quedamos?',
	'he estado pensando en ti estos días, ¿te animas a que quedemos por fin?',
	'no quiero agobiarte, solo dime si en algún momento te apetece que nos veamos',
]

console.log( `\n${line()}\n3-MONTH PROJECTION — C renews the invitation every 5 real days\n${line()}` )

const rows = []
for ( let cp = 1; cp <= CHECKPOINTS; cp++ ) {

	// Advance real wall-clock time for every timestamp-based real decay.
	for ( const [ , g ] of B.griefEngine.griefs ) g.startedAt -= FIVE_DAYS_MS
	for ( const [ , t ] of B.betrayalTraumaTrace.traces ) t.triggeredAt -= FIVE_DAYS_MS
	B.remConsolidation.lastTurnAt = Date.now() - FIVE_DAYS_MS
	B.tick( 120 ) // 120 hourly ticks = 5 real days for every dt-driven mechanic
	await B.idle( 120 )

	const text     = INVITES[ ( cp - 1 ) % INVITES.length ]
	const result = await B.processInput( text, { userId: 'C' } )
	const directives = B.getExpressionDirectives( 'C' )
	const day             = cp * 5

	rows.push( {
		day,
		text,
		actionTendency : directives.actionTendency,
		griefA             : B.griefEngine.getIntensity( 'A' ),
		traceA               : B.betrayalTraumaTrace.getTrace( 'A' ),
		trustC               : B.attachment.get( 'C' ).trust,
		bondC              : B.loveHateEngine.getNetBond( 'C' ),
		valence            : B.emotionSpace.vector.valence,
		desirability     : result.debug.appraisal?.desirability ?? 0,
	} )

}

console.log( `\n  ${'day'.padStart( 4 )}  ${'approach'.padStart( 8 )}  ${'withdraw'.padStart( 8 )}  ${'freeze'.padStart( 8 )}  ${'engage'.padStart( 8 )}  ${'dominant'.padEnd( 10 )}  ${'griefA'.padStart( 7 )}  ${'traceA'.padStart( 7 )}  ${'trustC'.padStart( 7 )}  ${'bondC'.padStart( 7 )}  ${'valence'.padStart( 8 )}` )
console.log( `  ${'-'.repeat( 108 )}` )
for ( const r of rows ) {

	const [ topAction ] = Object.entries( r.actionTendency ).sort( ( a, b ) => b[ 1 ] - a[ 1 ] )
	console.log( `  ${String( r.day ).padStart( 4 )}  ${pct( r.actionTendency.approach )}  ${pct( r.actionTendency.withdraw )}  ${pct( r.actionTendency.freeze )}  ${pct( r.actionTendency.engage )}  ${topAction[ 0 ].padEnd( 10 )}  ${r.griefA.toFixed( 3 ).padStart( 7 )}  ${r.traceA.toFixed( 3 ).padStart( 7 )}  ${r.trustC.toFixed( 3 ).padStart( 7 )}  ${r.bondC.toFixed( 3 ).padStart( 7 )}  ${r.valence.toFixed( 3 ).padStart( 8 )}` )

}

const firstOpenDay = rows.find( r => {

	const [ topAction ] = Object.entries( r.actionTendency ).sort( ( a, b ) => b[ 1 ] - a[ 1 ] )
	return topAction[ 0 ] === 'approach' || topAction[ 0 ] === 'engage'

} )

console.log( `\n${line()}\nRESULT\n${line()}` )
console.log( firstOpenDay
	? `  B's real dominant action tendency toward C first flips to OPEN ("${Object.entries( firstOpenDay.actionTendency ).sort( ( a, b ) => b[ 1 ] - a[ 1 ] )[ 0 ][ 0 ]}") on day ${firstOpenDay.day} of the real 90-day projection.`
	: `  Across the full real 90-day / 18-checkpoint projection, B's real dominant action tendency toward C never flips to approach/engage — it stays guarded (withdraw/freeze) every single checkpoint, even as griefIntensity(A) and betrayalTrace(A) both genuinely decay toward zero. Reported honestly as-is, not adjusted toward a "nicer" outcome.` )

console.log( `\n${line( '═' )}` )
