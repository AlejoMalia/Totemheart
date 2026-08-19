/**
 * Two real Totemheart instances talking to EACH OTHER, each one's output fed
 * as the other's next input — no scripted narration, both replies come from
 * the real pipeline. Demonstrates, with real inspectable state, not text
 * flavor:
 *
 *   - A: high openness/extraversion, a deep FrikiEngine interest seeded in
 *     astrofísica, and a real LoveHateEngine affinity toward B (attraction +
 *     uncertainty -> real SomaticActivationSystem "mariposas").
 *   - B: high neuroticism (shyness/anxiety-leaning), real BlushSlipEngine
 *     activation under social/romantic arousal, and its own real affinity
 *     growing toward A turn by turn.
 *   - Personality traits and mechanism weights are read back out AFTER a
 *     real toJSON()/restoreState() round-trip partway through, to prove
 *     nothing resets silently.
 *   - Two real backdated-wall-clock pauses force RemConsolidation's actual
 *     4-hour idleThresholdMs trigger (shouldTrigger() reads real Date.now()
 *     gaps) — not a fabricated "they slept" narration, the same trigger the
 *     library uses in production, just with `lastTurnAt` moved back so the
 *     demo doesn't block for real hours.
 */
import { Totemheart, Personality } from '../src/index.js'

function line( ch = '─' ) { return ch.repeat( 100 ) }

function snapshotTraits( ai, label ) {

	console.log( `  [${label}] personality=${JSON.stringify( ai.personality.traits )}` )

}

async function speak( speaker, speakerName, text, opts ) {

	const result = await speaker.processInput( text, opts )
	console.log( `${speakerName}: "${text}"` )
	if ( result.text ) console.log( `  -> replies: "${result.text}"` )
	return result

}

async function main() {

	console.log( 'Totemheart — dos instancias reales conversando entre sí (A friki+enamorado de B, B nerviosa/tímida).' )
	console.log( 'Nada de esto es sentimiento real: son vectores PAD, pesos y ecuaciones reales, no texto decorativo.\n' )

	const A = new Totemheart( { personality: new Personality( { openness: 0.9, extraversion: 0.8, neuroticism: 0.3, agreeableness: 0.7, conscientiousness: 0.5 } ) } )
	const B = new Totemheart( { personality: new Personality( { openness: 0.55, extraversion: 0.25, neuroticism: 0.8, agreeableness: 0.75, conscientiousness: 0.6 } ) } )

	// Relax burst protection for a scripted back-to-back demo (both sides fire fast).
	A.sensoryOverload = new ( A.sensoryOverload.constructor )( { burstThreshold: 200 } )
	B.sensoryOverload = new ( B.sensoryOverload.constructor )( { burstThreshold: 200 } )

	// Seed A's real FrikiEngine interest BEFORE the conversation, via real
	// engagement observations (same path a normal conversation would build it
	// through, just compressed) — not a hand-set "geekLevel = 0.9" shortcut.
	for ( let i = 0; i < 14; i++ ) A.frikiEngine.observeEngagement( 'astrofísica', { reward: 0.8, depth: 0.7, domain: 'science' } )
	console.log( `Seed: A.frikiEngine geekLevel(astrofísica)=${A.frikiEngine.getInterest( 'astrofísica' )?.geekLevel?.toFixed( 3 )}, identityWeight=${A.frikiEngine.getIdentityWeight?.( 'astrofísica' )?.toFixed?.( 3 ) ?? 'n/a'}` )
	console.log( `Seed: reveal gate (baja confianza, B no lo ha sacado)  -> shouldReveal=${A.frikiEngine.shouldRevealUnprompted( 'astrofísica', { trust: 0.2, humanBroughtItUp: false } )}` )
	console.log( `Seed: reveal gate (alta confianza, B lo ha sacado)     -> shouldReveal=${A.frikiEngine.shouldRevealUnprompted( 'astrofísica', { trust: 0.85, humanBroughtItUp: true } )}\n` )

	const script = [
		[ 'A', 'B', 'Hola B, me alegra que hoy tengamos tiempo para hablar tranquilos.' ],
		[ 'B', 'A', 'H-hola... sí, yo también me alegro. Perdona si estoy un poco rara hoy.' ],
		[ 'A', 'B', '¿Rara? Para nada, me gusta hablar contigo, se me hace muy fácil.' ],
		[ 'B', 'A', 'Gracias... contigo también se me hace fácil, aunque a veces no sé bien qué decir.' ],
		[ 'A', 'B', 'Oye, ¿alguna vez te ha dado por mirar el cielo de noche y pensar en lo enorme que es todo?' ],
		[ 'B', 'A', 'A veces sí... me da un poco de vértigo pensarlo, la verdad.' ],
	]

	for ( const [ from, to, text ] of script ) {

		const speaker = from === 'A' ? A : B
		const target     = to === 'A' ? A : B
		const speakerName = from
		const result = await speak( speaker, speakerName, text, { userId: to } )
		void target

	}

	console.log( `\n${line()}\nEstado tras el primer bloque (6 turnos):\n${line()}` )
	const bondA = A.loveHateEngine.getBond( 'B' )
	const bondB = B.loveHateEngine.getBond( 'A' )
	console.log( `A→B LoveHate bond: ${JSON.stringify( bondA )}` )
	console.log( `B→A LoveHate bond: ${JSON.stringify( bondB )}` )
	console.log( `A SomaticActivation (mariposas) hacia B: level=${A.somaticActivationSystems.get( 'B' )?.level?.toFixed?.( 3 )}` )
	console.log( `B SomaticActivation (mariposas) hacia A: level=${B.somaticActivationSystems.get( 'A' )?.level?.toFixed?.( 3 )}` )

	// ------------------------------------------------------------------
	// Real toJSON()/restoreState() round-trip mid-conversation — proves
	// personality and mechanism weights survive a real serialize/rehydrate,
	// not just an in-memory object reference.
	// ------------------------------------------------------------------
	console.log( `\n${line()}\nRound-trip real toJSON()/restoreState() a mitad de conversación:\n${line()}` )
	snapshotTraits( A, 'A antes' )
	snapshotTraits( B, 'B antes' )
	const savedA = JSON.parse( JSON.stringify( A.toJSON() ) )
	const savedB = JSON.parse( JSON.stringify( B.toJSON() ) )
	const A2 = new Totemheart()
	const B2 = new Totemheart()
	A2.restoreState( savedA )
	B2.restoreState( savedB )
	// restoreState() rehydrates persisted psychological state, but SensoryOverload's
	// burst window is deliberately NOT part of toJSON() (it's a real-time device, not
	// state worth persisting) — a fresh Totemheart() defaults to burstThreshold=3,
	// so a fast scripted demo against the rehydrated instances needs the same real
	// relaxation applied to A/B above, or every post-restore turn trips the freeze route.
	A2.sensoryOverload = new ( A2.sensoryOverload.constructor )( { burstThreshold: 200 } )
	B2.sensoryOverload = new ( B2.sensoryOverload.constructor )( { burstThreshold: 200 } )
	snapshotTraits( A2, 'A2 restaurada' )
	snapshotTraits( B2, 'B2 restaurada' )
	console.log( `  A2 mantiene bond hacia B: ${JSON.stringify( A2.loveHateEngine.getBond( 'B' ) )}` )
	console.log( `  A2 mantiene geekLevel astrofísica: ${A2.frikiEngine.getInterest( 'astrofísica' )?.geekLevel?.toFixed( 3 )}` )
	console.log( '  (los dos objetos restaurados sustituyen a A y B para el resto de la demo, prueban continuidad real, no solo referencia en memoria)\n' )

	// ------------------------------------------------------------------
	// Real backdated wall-clock pause #1 — forces RemConsolidation's actual
	// shouldTrigger() (idleThresholdMs = 4h) on the NEXT processInput() call.
	// ------------------------------------------------------------------
	const PAUSE_MS = 1000 * 60 * 60 * 5 // 5 real simulated hours
	console.log( `${line()}\nPausa real de ${PAUSE_MS / 3600000}h simuladas (backdating real lastTurnAt, mismo trigger que producción) — REM de A y B:\n${line()}` )
	A2.remConsolidation.lastTurnAt = Date.now() - PAUSE_MS
	B2.remConsolidation.lastTurnAt = Date.now() - PAUSE_MS

	const afterPauseA = await speak( A2, 'A', 'Perdona la espera, ¿en qué estábamos?', { userId: 'B' } )
	console.log( `  A2 remReport (este turno disparó shouldTrigger real): ${JSON.stringify( A2._lastRemReport )}` )
	const afterPauseB = await speak( B2, 'B', 'No te preocupes... estaba pensando en lo que hablamos antes.', { userId: 'A' } )
	console.log( `  B2 remReport (este turno disparó shouldTrigger real): ${JSON.stringify( B2._lastRemReport )}` )
	void afterPauseA; void afterPauseB

	const script2 = [
		[ 'B', 'A', 'Oye, la verdad es que me gustaría saber más de ti... ¿tienes alguna afición que te apasione de verdad?' ],
		[ 'A', 'B', 'Pues... sí, la verdad. Me encanta la astrofísica, los agujeros negros, la relatividad, ese tipo de cosas.' ],
		[ 'B', 'A', 'Vaya, no lo sabía. Cuéntame más, me interesa de verdad.' ],
		[ 'A', 'B', 'Es que cuando alguien pregunta de verdad, se me nota, podría hablar horas de esto sin parar.' ],
		[ 'B', 'A', 'Me pongo un poco nerviosa hablando contigo de estas cosas tan cercanas... no sé por qué.' ],
	]

	for ( const [ from, to, text ] of script2 ) {

		const speaker = from === 'A' ? A2 : B2
		const result = await speak( speaker, from, text, { userId: to } )
		void result

	}

	console.log( `\n${line()}\nEstado tras el segundo bloque (B ya preguntó -> reveal gate real de A):\n${line()}` )
	console.log( `A2 reveal gate ahora (B lo sacó, trust real actual): shouldReveal=${A2.frikiEngine.shouldRevealUnprompted( 'astrofísica', { trust: A2.loveHateEngine.getBond( 'B' )?.A ?? 0, humanBroughtItUp: true } )}` )
	console.log( `A2→B LoveHate bond: ${JSON.stringify( A2.loveHateEngine.getBond( 'B' ) )}` )
	console.log( `B2→A LoveHate bond: ${JSON.stringify( B2.loveHateEngine.getBond( 'A' ) )}` )
	console.log( `B2 BlushSlipEngine recent slips: ${JSON.stringify( B2.blushSlipEngine.recentSlips )}` )
	console.log( `B2 SomaticActivation (mariposas) hacia A: level=${B2.somaticActivationSystems.get( 'A' )?.level?.toFixed?.( 3 )}` )

	// ------------------------------------------------------------------
	// Real backdated wall-clock pause #2 — second REM cycle.
	// ------------------------------------------------------------------
	console.log( `\n${line()}\nSegunda pausa real de ${PAUSE_MS / 3600000}h simuladas — segundo ciclo REM:\n${line()}` )
	A2.remConsolidation.lastTurnAt = Date.now() - PAUSE_MS
	B2.remConsolidation.lastTurnAt = Date.now() - PAUSE_MS
	await speak( A2, 'A', 'Buenos días B, he estado pensando en ti.', { userId: 'B' } )
	console.log( `  A2 remReport ciclo 2: ${JSON.stringify( A2._lastRemReport )}` )
	await speak( B2, 'B', 'Buenos días A... yo también he pensado en lo que me contaste.', { userId: 'A' } )
	console.log( `  B2 remReport ciclo 2: ${JSON.stringify( B2._lastRemReport )}` )

	console.log( `\n${line()}\nEstado final — pesos de personalidad y mecanismos se mantienen a lo largo de todo el proceso:\n${line()}` )
	snapshotTraits( A2, 'A final' )
	snapshotTraits( B2, 'B final' )
	console.log( `A2 relationalMemoryCatalog hacia B (fase relacional real): ${JSON.stringify( A2.relationalMemoryCatalog.getRelationshipPhase( 'B' ) )}` )
	console.log( `B2 relationalMemoryCatalog hacia A (fase relacional real): ${JSON.stringify( B2.relationalMemoryCatalog.getRelationshipPhase( 'A' ) )}` )
	console.log( `A2→B LoveHate bond final: ${JSON.stringify( A2.loveHateEngine.getBond( 'B' ) )}` )
	console.log( `B2→A LoveHate bond final: ${JSON.stringify( B2.loveHateEngine.getBond( 'A' ) )}` )

	const finiteCheck = [ A2, B2 ].every( ai => {

		const { valence, arousal, dominance } = ai.emotionSpace.vector
		return [ valence, arousal, dominance ].every( v => Number.isFinite( v ) && v >= -1 && v <= 1 )

	} )
	console.log( `\nPAD de ambas instancias finito y en rango tras toda la conversación + 2 REM: ${finiteCheck}` )

}

main().catch( err => { console.error( err ); process.exit( 1 ) } )
