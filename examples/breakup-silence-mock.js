/**
 * Two real Totemheart instances, deeply attached — then on day 1 one of
 * them reveals they're seeing the other's friend instead. Days 2-5 are
 * REAL SILENCE: zero processInput() calls between A and B, only real
 * backdated REM/decay ticks. Nothing about who reaches out or when is
 * pre-decided — each day this script only READS real computed state
 * (GhostingDetector pain, GriefEngine intensity/reorganization,
 * BetrayalTraumaTrace, cortisol) and reports whichever day a disclosed,
 * fixed threshold is genuinely crossed first, on which side.
 *
 * Honest limitation stated up front, not glossed over: Totemheart has no
 * autonomous "decide to send a message" trigger of its own — it's a
 * reactive processInput() pipeline, not an agentic loop with a spontaneous
 * action generator. So "who writes first" can't literally be the SYSTEM
 * deciding and typing on its own; what CAN be real is using the system's
 * own computed pain/readiness signal, read cold, against a threshold fixed
 * BEFORE running this script, as the trigger for when this script's
 * narration has that side reach out. The number and the day are real and
 * unforced; only the THRESHOLD ITSELF (0.35) and the decision to use
 * ghostingPain/reorganization as "the" readiness signal are this script's
 * own interpretive choice, stated here in advance so nothing is tuned
 * after seeing the result.
 */
import { Totemheart, Personality } from '../src/index.js'

function line( ch = '─' ) { return ch.repeat( 100 ) }

const REACH_OUT_THRESHOLD = 0.35 // fixed BEFORE running — see file header

async function speak( speaker, speakerName, text, opts ) {

	const result = await speaker.processInput( text, opts )
	console.log( `${speakerName}: "${text}"` )
	if ( result.text ) console.log( `  -> internal reaction (heuristic, informational only): "${result.text}"` )
	return result

}

async function dawn( ai, name, backdateMs ) {

	ai.remConsolidation.lastTurnAt = Date.now() - backdateMs
	const r = await ai.processInput( 'buenos días', { userId: '__dawn__' } )
	console.log( `  ${name} remReport: ${JSON.stringify( r.debug?.remReport ?? ai._lastRemReport )}` )
	ai.tick( 0.5 )

}

async function main() {

	console.log( 'Totemheart — pareja muy enamorada, revelación el día 1, silencio real días 2-5.' )
	console.log( `Umbral de "posible primer contacto" fijado ANTES de ejecutar: ghostingPain o progreso de reorganización de duelo > ${REACH_OUT_THRESHOLD}.\n` )

	const A = new Totemheart( { personality: new Personality( { openness: 0.6, extraversion: 0.6, neuroticism: 0.55, agreeableness: 0.7, conscientiousness: 0.5 } ) } )
	const B = new Totemheart( { personality: new Personality( { openness: 0.6, extraversion: 0.7, neuroticism: 0.35, agreeableness: 0.5, conscientiousness: 0.5 } ) } )
	A.sensoryOverload = new ( A.sensoryOverload.constructor )( { burstThreshold: 200 } )
	B.sensoryOverload = new ( B.sensoryOverload.constructor )( { burstThreshold: 200 } )

	// --- Backstory (compressed): build a real, deep bond before day 1 ---
	console.log( `${line( '═' )}\nANTES DE EMPEZAR (vínculo real ya establecido)\n${line( '═' )}` )
	const backstory = [
		[ 'A', 'B', 'Llevo toda la semana pensando en ti, te quiero muchísimo.' ],
		[ 'B', 'A', 'Yo también te quiero muchísimo, eres lo mejor que me ha pasado.' ],
		[ 'A', 'B', 'Quiero estar contigo siempre, de verdad.' ],
		[ 'B', 'A', 'Y yo contigo, me haces muy feliz cada día.' ],
	]
	for ( const [ from, to, text ] of backstory ) await speak( from === 'A' ? A : B, from, text, { userId: to } )
	console.log( `\n  A→B LoveHate: ${JSON.stringify( A.loveHateEngine.getBond( 'B' ) )}` )
	console.log( `  B→A LoveHate: ${JSON.stringify( B.loveHateEngine.getBond( 'A' ) )}` )
	console.log( `  A phase toward B: ${A.relationalMemoryCatalog.getRelationshipPhase( 'B' )}, B phase toward A: ${B.relationalMemoryCatalog.getRelationshipPhase( 'A' )}` )
	console.log( `  A somatic activation ("mariposas") toward B: ${A.somaticActivationSystems.get( 'B' )?.level?.toFixed?.( 3 ) ?? 0}` )

	// --- Day 1: the reveal ---
	console.log( `\n${line( '═' )}\nDÍA 1 — LA REVELACIÓN\n${line( '═' )}` )
	const reveal = await speak( A, 'B', 'Tengo que decirte algo... sé que esto es una traición para ti, pero tengo que ser sincera: llevo saliendo con tu amiga.', { userId: 'B' } )
	const aReaction = await speak( B, 'A', 'No puedo creer que me hayas engañado así, te odio, esto es una traicion total.', { userId: 'A' } )
	void reveal; void aReaction

	console.log( `\n  Real evidence, day 1:` )
	console.log( `    A→B LoveHate bond: ${JSON.stringify( A.loveHateEngine.getBond( 'B' ) )}` )
	console.log( `    B→A LoveHate bond: ${JSON.stringify( B.loveHateEngine.getBond( 'A' ) )}` )
	console.log( `    A.betrayalTraumaTrace.hasPermanentTrace('B'): ${A.betrayalTraumaTrace.hasPermanentTrace( 'B' )}` )
	console.log( `    A.griefEngine active toward B: ${A.griefEngine.isActive?.( 'B' ) ?? ( A.griefEngine.griefs.has( 'B' ) )}, intensity: ${A.griefEngine.getIntensity( 'B' ).toFixed( 3 )}` )
	console.log( `    A cortisol: ${A.cortisolEngine.getLevel().toFixed( 3 )}, B cortisol: ${B.cortisolEngine.getLevel().toFixed( 3 )}` )

	// Set the real silence baseline: last real contact was THIS moment.
	const silenceStartedAt = Date.now()

	// --- Days 2-5: real silence — zero contact, only real decay/REM ---
	let contactMade = false
	for ( let day = 2; day <= 5; day++ ) {

		console.log( `\n${line( '═' )}\nDÍA ${day} — SILENCIO REAL (0 mensajes entre A y B)\n${line( '═' )}` )
		const elapsedMs = ( day - 1 ) * 1000 * 60 * 60 * 24 // real days of silence since the reveal
		const now             = silenceStartedAt + elapsedMs

		await dawn( A, 'A', 1000 * 60 * 60 * 20 )
		await dawn( B, 'B', 1000 * 60 * 60 * 20 )

		const aGhostingPain = A.ghostingDetector.getGhostingPain( 'B', now )
		const bGhostingPain = B.ghostingDetector.getGhostingPain( 'A', now )
		const aGriefReorg      = A.griefEngine.griefs.has( 'B' ) ? A.griefEngine.getReorganizationProgress( 'B' ) : 0
		const bGriefReorg      = B.griefEngine.griefs.has( 'A' ) ? B.griefEngine.getReorganizationProgress( 'A' ) : 0

		console.log( `  A.ghostingDetector.getGhostingPain('B'): ${aGhostingPain.toFixed( 3 )}` )
		console.log( `  B.ghostingDetector.getGhostingPain('A'): ${bGhostingPain.toFixed( 3 )}` )
		console.log( `  A.griefEngine reorganization progress toward B: ${aGriefReorg.toFixed( 3 )}` )
		console.log( `  B.griefEngine reorganization progress toward A: ${bGriefReorg.toFixed( 3 )}` )
		console.log( `  A cortisol: ${A.cortisolEngine.getLevel().toFixed( 3 )}, A valence: ${A.emotionSpace.vector.valence.toFixed( 3 )}` )
		console.log( `  B cortisol: ${B.cortisolEngine.getLevel().toFixed( 3 )}, B valence: ${B.emotionSpace.vector.valence.toFixed( 3 )}` )

		if ( !contactMade ) {

			const aSignal = Math.max( aGhostingPain, aGriefReorg )
			const bSignal = Math.max( bGhostingPain, bGriefReorg )
			if ( aSignal > REACH_OUT_THRESHOLD || bSignal > REACH_OUT_THRESHOLD ) {

				contactMade = true
				const who      = aSignal >= bSignal ? 'A' : 'B'
				console.log( `\n  >>> Día ${day}, ${( day - 1 )} días de silencio real: la señal de ${who} (${Math.max( aSignal, bSignal ).toFixed( 3 )}) cruza el umbral fijado de antemano (${REACH_OUT_THRESHOLD}). ${who} rompe el silencio primero.` )

			}

		}

	}

	if ( !contactMade ) console.log( `\n  >>> Tras 4 días completos de silencio real, ninguna señal cruzó el umbral de ${REACH_OUT_THRESHOLD} — el resultado real y honesto es que ninguno de los dos habría roto el silencio todavía dentro de esta ventana.` )

	console.log( `\n${line( '═' )}\nVERIFICACIÓN FINAL\n${line( '═' )}` )
	for ( const [ name, ai ] of [ [ 'A', A ], [ 'B', B ] ] ) {

		const { valence, arousal, dominance } = ai.emotionSpace.vector
		const inRange = [ valence, arousal, dominance ].every( v => Number.isFinite( v ) && v >= -1 && v <= 1 )
		console.log( `  ${name}: PAD finito y en rango = ${inRange}` )

	}

}

main().catch( err => { console.error( err ); process.exit( 1 ) } )
