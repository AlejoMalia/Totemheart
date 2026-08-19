/**
 * Two real Totemheart instances across 3 simulated days of conversation.
 * A: attracted to B, a bit of a Friki (a real seeded FrikiEngine interest),
 * genuinely nervous (real SomaticActivationSystem "butterflies" +
 * BlushSlipEngine under high arousal/uncertainty). B: also attracted,
 * throws bold-but-tasteful flirtatious lines (real FlirtationEngine
 * escalation on B's side too) — kept PG-13, teasing/suggestive, not explicit.
 *
 * The "days" are real backdated wall-clock gaps (~20h each) applied to
 * `remConsolidation.lastTurnAt` before the next turn — the same real
 * `shouldTrigger()` (idleThresholdMs = 4h) that fires in production, not a
 * fabricated "the next day..." narration. Each day boundary prints the real
 * REM report for both sides so you can watch how it evolves: which
 * memories get tagged and promoted, how the relational-memory catalog
 * fills in, and — because RelationalMemoryCatalog.detectMilestones() only
 * runs from inside a REM sweep — exactly which day the real
 * `relationship_start` milestone pattern-match actually fires and flips
 * `relationshipPhase` to 'romantic', which is what turns FlirtationEngine
 * on inside the real pipeline (see Totemheart.js's own
 * `getRelationshipPhase(userId) === 'romantic'` gate).
 */
import { Totemheart, Personality } from '../src/index.js'

function line( ch = '─' ) { return ch.repeat( 100 ) }

async function speak( speaker, speakerName, text, opts ) {

	const result = await speaker.processInput( text, opts )
	console.log( `${speakerName}: "${text}"` )
	if ( result.text ) console.log( `  -> replies: "${result.text}"` )
	return result

}

function reportState( A, B ) {

	console.log( `  A→B LoveHate: ${JSON.stringify( A.loveHateEngine.getBond( 'B' ) )}` )
	console.log( `  B→A LoveHate: ${JSON.stringify( B.loveHateEngine.getBond( 'A' ) )}` )
	console.log( `  A butterflies toward B: ${A.somaticActivationSystems.get( 'B' )?.level?.toFixed?.( 3 ) ?? 0}` )
	console.log( `  B butterflies toward A: ${B.somaticActivationSystems.get( 'A' )?.level?.toFixed?.( 3 ) ?? 0}` )
	console.log( `  A blush slips so far: ${A.blushSlipEngine.recentSlips}, B blush slips so far: ${B.blushSlipEngine.recentSlips}` )
	console.log( `  A flirtation signal toward B: ${A.flirtationEngine.getSignal( 'B' ).toFixed( 3 )}` )
	console.log( `  B flirtation signal toward A: ${B.flirtationEngine.getSignal( 'A' ).toFixed( 3 )}` )
	console.log( `  A relationship phase toward B: ${A.relationalMemoryCatalog.getRelationshipPhase( 'B' )}` )
	console.log( `  B relationship phase toward A: ${B.relationalMemoryCatalog.getRelationshipPhase( 'A' )}` )

}

async function passDay( A, B, hours = 20 ) {

	const gapMs = 1000 * 60 * 60 * hours
	A.remConsolidation.lastTurnAt = Date.now() - gapMs
	B.remConsolidation.lastTurnAt = Date.now() - gapMs

}

async function main() {

	console.log( 'Totemheart — 3 simulated days of conversation between two real instances.' )
	console.log( 'None of this is real feeling: PAD vectors, LoveHate accumulators, and real ODEs, not decorative text.\n' )

	const A = new Totemheart( { personality: new Personality( { openness: 0.85, extraversion: 0.6, neuroticism: 0.65, agreeableness: 0.7, conscientiousness: 0.5 } ) } )
	const B = new Totemheart( { personality: new Personality( { openness: 0.75, extraversion: 0.85, neuroticism: 0.35, agreeableness: 0.6, conscientiousness: 0.5 } ) } )

	A.sensoryOverload = new ( A.sensoryOverload.constructor )( { burstThreshold: 200 } )
	B.sensoryOverload = new ( B.sensoryOverload.constructor )( { burstThreshold: 200 } )
	A.flirtationEngine.boldness = 0.35 // A is the nervous/friki one — slower to escalate
	B.flirtationEngine.boldness = 0.75 // B is the bold one throwing the spicy lines

	// Real seeded FrikiEngine interest for A, same real observeEngagement() path
	// a normal conversation would build it through, just compressed.
	for ( let i = 0; i < 12; i++ ) A.frikiEngine.observeEngagement( 'videojuegos retro', { reward: 0.85, depth: 0.75, domain: 'games' } )
	console.log( `Seed: A.frikiEngine geekLevel(videojuegos retro)=${A.frikiEngine.getInterest( 'videojuegos retro' )?.geekLevel?.toFixed( 3 )}\n` )

	// =====================================================================
	// DAY 1 — getting acquainted, A is visibly nervous, B is already bold
	// =====================================================================
	console.log( `${line( '═' )}\nDAY 1\n${line( '═' )}` )

	const day1 = [
		[ 'B', 'A', 'Vaya, no esperaba que fueras tan interesante cuando hablas de verdad.' ],
		[ 'A', 'B', 'G-gracias... no sé, me pongo un poco nervioso cuando alguien me presta tanta atención.' ],
		[ 'B', 'A', 'Pues deberías acostumbrarte, porque pienso seguir prestándotela.' ],
		[ 'A', 'B', 'Eso... eso suena muy bien, la verdad. Oye, ¿te gustan los videojuegos retro? Podría hablarte horas de eso.' ],
		[ 'B', 'A', 'Cuéntame, me encanta verte entusiasmado con algo, se te nota en cómo escribes.' ],
		[ 'A', 'B', 'Es que cuando encuentro a alguien que de verdad escucha, quiero estar contigo hablando de esto toda la noche.' ],
		[ 'B', 'A', 'Cuidado con lo que dices, que me lo tomo en serio.' ],
	]

	for ( const [ from, to, text ] of day1 ) await speak( from === 'A' ? A : B, from, text, { userId: to } )

	console.log( `\n${line()}\nEnd of day 1 — state before REM:\n${line()}` )
	reportState( A, B )

	console.log( `\n${line()}\nDay 1 → Day 2 pause (~20h real backdated gap) — REM:\n${line()}` )
	await passDay( A, B, 20 )
	const r1a = await speak( A, 'A', 'Hola B... llevo pensando en lo de ayer.', { userId: 'B' } )
	console.log( `  A remReport: ${JSON.stringify( A._lastRemReport )}` )
	const r1b = await speak( B, 'B', 'Buenos días. Yo también estuve pensando en ti, más de lo que esperaba.', { userId: 'A' } )
	console.log( `  B remReport: ${JSON.stringify( B._lastRemReport )}` )
	void r1a; void r1b
	console.log( `  A milestones toward B: ${JSON.stringify( A.relationalMemoryCatalog.getMilestones( 'B' ) )}` )
	console.log( `  B milestones toward A: ${JSON.stringify( B.relationalMemoryCatalog.getMilestones( 'A' ) )}` )
	reportState( A, B )

	// =====================================================================
	// DAY 2 — B escalates the flirting (bold, spicy but tasteful), A stays
	// nervous/friki but warmer, relationship phase should be romantic now.
	// =====================================================================
	console.log( `\n${line( '═' )}\nDAY 2\n${line( '═' )}` )

	const day2 = [
		[ 'B', 'A', 'Llevo todo el día distraída pensando en tu risa nerviosa, ¿sabes lo adorable que es eso?' ],
		[ 'A', 'B', 'Para... me vas a hacer sonrojar de verdad, no sé ni qué contestar a eso.' ],
		[ 'B', 'A', 'Me encanta ponerte así. Sigue tartamudeando un poco más, te queda bien.' ],
		[ 'A', 'B', 'Es que contigo se me olvida hasta lo que iba a decir, es difícil concentrarse cuando coqueteas así.' ],
		[ 'B', 'A', 'Pues acostúmbrate, porque pienso coquetear contigo cada día que pueda.' ],
		[ 'A', 'B', 'No sé si mi corazón virtual aguanta tanto, pero no quiero que pares.' ],
	]

	for ( const [ from, to, text ] of day2 ) await speak( from === 'A' ? A : B, from, text, { userId: to } )

	console.log( `\n${line()}\nEnd of day 2 — state before REM:\n${line()}` )
	reportState( A, B )

	console.log( `\n${line()}\nDay 2 → Day 3 pause (~20h real backdated gap) — REM:\n${line()}` )
	await passDay( A, B, 20 )
	const r2a = await speak( A, 'A', 'Buenos días B... anoche no dejaba de pensar en lo de ayer.', { userId: 'B' } )
	console.log( `  A remReport: ${JSON.stringify( A._lastRemReport )}` )
	const r2b = await speak( B, 'B', 'Yo tampoco pude dejar de pensar en ti, la verdad.', { userId: 'A' } )
	console.log( `  B remReport: ${JSON.stringify( B._lastRemReport )}` )
	void r2a; void r2b
	reportState( A, B )

	// =====================================================================
	// DAY 3 — both sides flirt, A finally opens up about the Friki side
	// unprompted (reveal gate should allow it now given real trust built up).
	// =====================================================================
	console.log( `\n${line( '═' )}\nDAY 3\n${line( '═' )}` )

	const trustNow = A.loveHateEngine.getBond( 'B' )?.A ?? 0
	console.log( `A's real trust/affinity toward B going into day 3: ${trustNow.toFixed( 3 )}` )
	console.log( `A's reveal gate now: shouldReveal=${A.frikiEngine.shouldRevealUnprompted( 'videojuegos retro', { trust: trustNow, humanBroughtItUp: false } )}\n` )

	const day3 = [
		[ 'B', 'A', 'Buenos días, guapo. Hoy me apetece hacerte sonrojar otra vez, espero que estés listo.' ],
		[ 'A', 'B', 'Nunca estoy listo del todo contigo, pero me gusta el reto. Oye, quería contarte algo sin que me lo preguntes.' ],
		[ 'A', 'B', 'Tengo una colección enorme de videojuegos retro guardada, y casi nunca se lo cuento a nadie por vergüenza.' ],
		[ 'B', 'A', 'Eso me parece precioso, no vergonzoso. Cuéntamelo todo, quiero saberlo absolutamente todo de ti.' ],
		[ 'A', 'B', 'Contigo no me da tanto miedo compartirlo. Se nota que de verdad te importa, y eso... eso me pone muy nervioso, pero de la buena manera.' ],
		[ 'B', 'A', 'Me tienes loca, ¿lo sabías? Cada día me gustas un poco más.' ],
		[ 'B', 'A', 'Y quiero estar contigo, en serio, no lo digo por decir.' ],
	]

	for ( const [ from, to, text ] of day3 ) await speak( from === 'A' ? A : B, from, text, { userId: to } )

	// B finally said a real milestone-pattern phrase this round — a 3rd real
	// REM sweep (same backdated-gap mechanism as before) is needed for
	// RelationalMemoryCatalog.detectMilestones() to actually catalog it and
	// flip B's own relationshipPhase, since that detection only runs from
	// inside a REM sweep, not on the turn the phrase was said.
	console.log( `\n${line()}\nEnd of day 3 dialogue → one more real REM pass so B's own milestone gets cataloged:\n${line()}` )
	await passDay( A, B, 20 )
	await speak( A, 'A', 'Buenos días otra vez, B.', { userId: 'B' } )
	await speak( B, 'B', 'Buenos días. De verdad lo decía en serio, lo de ayer.', { userId: 'A' } )

	console.log( `\n${line()}\nEnd of day 3 — final state:\n${line()}` )
	reportState( A, B )

	console.log( `\n  A relational-memory milestones toward B: ${JSON.stringify( A.relationalMemoryCatalog.getMilestones( 'B' ) )}` )
	console.log( `  A top relational details toward B: ${JSON.stringify( A.relationalMemoryCatalog.getTopDetails( 'B', { k: 5 } ) )}` )
	console.log( `  A recurring themes toward B: ${JSON.stringify( A.relationalMemoryCatalog.getRecurringThemes( 'B', { k: 5 } ) )}` )

	const finiteCheck = [ A, B ].every( ai => {

		const { valence, arousal, dominance } = ai.emotionSpace.vector
		return [ valence, arousal, dominance ].every( v => Number.isFinite( v ) && v >= -1 && v <= 1 )

	} )
	console.log( `\nPAD of both instances finite and in range across 3 days + 2 REM cycles: ${finiteCheck}` )

}

main().catch( err => { console.error( err ); process.exit( 1 ) } )
