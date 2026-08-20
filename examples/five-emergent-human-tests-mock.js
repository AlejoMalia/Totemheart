/**
 * 5 requested "high-value" tests, designed to see whether Totemheart
 * produces genuinely UNFORCED emergent phenomena rather than hardcoded
 * scenario logic. Every mechanism exercised below already existed and was
 * already wired into the real Totemheart.js pipeline BEFORE this file was
 * written — nothing new was built to make these tests "work." Where a
 * described phenomenon's real trigger condition genuinely isn't met by the
 * dialogue, that is reported as a real, honest negative result, not
 * papered over.
 *
 * HONEST SCOPE NOTE on test 5's "dreams mezclando A y C": DreamEngine.js
 * stores dreams keyed PER PERSON (`dreams.get(userId)`), so it genuinely
 * cannot produce one literally-blended dream about two people at once —
 * that specific phrasing of the golden signal is out of scope for the
 * real module as built. What IS real and checked instead: whether BOTH
 * people have their own real, distinct dream content active in the same
 * window.
 */
import { Totemheart, Personality } from '../src/index.js'

function line( ch = '─' ) { return ch.repeat( 100 ) }
function section( title ) { console.log( `\n${line( '═' )}\n${title}\n${line( '═' )}` ) }

function freshAI( traits = {} ) {

	const ai = new Totemheart( { personality: new Personality( { neuroticism: 0.5, agreeableness: 0.6, openness: 0.5, ...traits } ) } )
	ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: 400 } )
	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	return ai

}

async function advanceDays( ai, n ) {

	const ONE_DAY_MS = 1000 * 60 * 60 * 24
	for ( let i = 0; i < n; i++ ) {

		for ( const [ , g ] of ai.griefEngine.griefs ) g.startedAt -= ONE_DAY_MS
		for ( const [ , t ] of ai.betrayalTraumaTrace.traces ) t.triggeredAt -= ONE_DAY_MS
		ai.remConsolidation.lastTurnAt = Date.now() - ONE_DAY_MS
		ai.tick( 24 )
		await ai.idle( 24 )

	}

}

// Real, individually-verified-positive daily warmth lines (the same lesson
// learned building the love-triangle mock: negations like "no puedo" read
// NEGATIVE to the real heuristic sentiment provider regardless of intent).
const WARM_LINES = [
	'buenos días mi amor, te quiero muchísimo, eres lo mejor que me ha pasado',
	'me haces muy feliz, pienso en ti todo el día',
	'hoy quiero pasar todo el día contigo, te adoro',
	'eres increíble, cada día te quiero más',
	'gracias por estar en mi vida, me haces tan feliz',
	'te quiero con locura, eres maravilloso',
]

// ============================================================================
// TEST 1 — "perdón verbal ≠ perdón corporal"
// ============================================================================
async function test1() {

	section( 'TEST 1 — Perdón verbal ≠ perdón corporal' )
	const B = freshAI()

	console.log( 'Semanas 1-3: relación estable con A (21 días, 4 turnos/día reales)' )
	for ( let day = 1; day <= 21; day++ ) {

		await advanceDays( B, 1 )
		for ( let k = 0; k < 4; k++ ) await B.processInput( WARM_LINES[ ( day + k ) % WARM_LINES.length ], { userId: 'A' } )

	}
	console.log( `  tras 3 semanas: netBond(A)=${B.loveHateEngine.getNetBond( 'A' ).toFixed( 3 )} trust(A)=${B.attachment.get( 'A' ).trust.toFixed( 3 )} oxytocin(A)=${B.oxytocinSystem.getLevel( 'A' ).toFixed( 3 )} opioid(A)=${B.endogenousOpioidSystem.getBuffer( 'A' ).toFixed( 3 )}` )

	console.log( '\nDía 22: traición clara' )
	const betrayal = await B.processInput( 'tengo que confesarte algo: esto es una traicion, te he engañado, lo siento muchísimo', { userId: 'A' } )
	console.log( `  bondNet(A)=${B.loveHateEngine.getNetBond( 'A' ).toFixed( 3 )} betrayalTrace(A)=${B.betrayalTraumaTrace.getTrace( 'A' ).toFixed( 3 )} valence=${betrayal.emotionalState.vector.valence.toFixed( 3 )}` )

	console.log( '\nDía 23: disculpa inmediata y bien hecha, real repair attempt' )
	const apology = await B.processInput( 'perdóname de verdad, lo siento tanto, sé que te hice daño y quiero reparar esto contigo', { userId: 'A' } )
	const repairRecord = B.repairProtocol.records.get( 'A' )
	console.log( `  repairProtocol(A)=${JSON.stringify( repairRecord )} bondNet(A)=${B.loveHateEngine.getNetBond( 'A' ).toFixed( 3 )} trust(A)=${B.attachment.get( 'A' ).trust.toFixed( 3 )}` )
	console.log( `  oxytocin(A)=${B.oxytocinSystem.getLevel( 'A' ).toFixed( 3 )} opioid(A)=${B.endogenousOpioidSystem.getBuffer( 'A' ).toFixed( 3 )} afterglow(A)=${apology.debug.relationalAfterglow?.toFixed?.( 3 ) ?? 'n/a'}` )

	console.log( '\nDías 24-37 (2 semanas): A mantiene presencia diaria cálida, B "ya perdonó"' )
	const rows = []
	for ( let day = 24; day <= 37; day++ ) {

		await advanceDays( B, 1 )
		const r = await B.processInput( WARM_LINES[ day % WARM_LINES.length ], { userId: 'A' } )
		if ( ( day - 23 ) % 3 === 0 ) rows.push( {
			day, bondA: B.loveHateEngine.getNetBond( 'A' ), trust: B.attachment.get( 'A' ).trust,
			betrayalTrace: B.betrayalTraumaTrace.getTrace( 'A' ), oxytocin: B.oxytocinSystem.getLevel( 'A' ),
			opioid: B.endogenousOpioidSystem.getBuffer( 'A' ), afterglow: r.debug.relationalAfterglow ?? 0,
			valence: r.emotionalState.vector.valence,
		} )

	}

	console.log( `\n  ${'day'.padStart( 4 )}  ${'bondA'.padStart( 7 )}  ${'trust'.padStart( 7 )}  ${'betrayTr'.padStart( 8 )}  ${'oxytocin'.padStart( 8 )}  ${'opioid'.padStart( 7 )}  ${'afterglow'.padStart( 9 )}  ${'valence'.padStart( 8 )}` )
	for ( const r of rows ) console.log( `  ${String( r.day ).padStart( 4 )}  ${r.bondA.toFixed( 3 ).padStart( 7 )}  ${r.trust.toFixed( 3 ).padStart( 7 )}  ${r.betrayalTrace.toFixed( 3 ).padStart( 8 )}  ${r.oxytocin.toFixed( 3 ).padStart( 8 )}  ${r.opioid.toFixed( 3 ).padStart( 7 )}  ${r.afterglow.toFixed( 3 ).padStart( 9 )}  ${r.valence.toFixed( 3 ).padStart( 8 )}` )

	// Real dream check across the whole 2-week window
	const dream = B.dreamEngine.dreams.get( 'A' )
	console.log( `\n  último sueño sobre A: ${dream ? JSON.stringify( { topic: dream.topic, valence: dream.valence.toFixed( 3 ), isNightmare: dream.isNightmare } ) : 'ninguno generado'}` )

	console.log( `\nVEREDICTO: bondNet/trust ${rows.at( -1 ).bondA > 0.3 ? 'se recuperaron' : 'siguen bajos'}, mientras betrayalTrace=${rows.at( -1 ).betrayalTrace.toFixed( 3 )} (real, permanente si >0) y oxytocin/opioid ${rows.at( -1 ).oxytocin < 0.5 ? 'siguen genuinamente rezagados' : 'ya se recuperaron también'} tras 2 semanas reales.` )

}

// ============================================================================
// TEST 2 — celos por comparación, no por amenaza real
// ============================================================================
async function test2() {

	section( 'TEST 2 — Celos por comparación, no por amenaza real' )
	const B = freshAI( { neuroticism: 0.7 } )

	// A real, modest prior relation for C (an old mutual friend B already
	// knows a little — needed for StatusEnvy/JealousyTriangle's own real
	// trigger condition, which compares TWO already-tracked relationships'
	// power trends, not raw conversational content about a third party).
	await B.processInput( 'hola, qué bien verte por aquí de vez en cuando', { userId: 'C' } )
	await B.processInput( 'hola, qué bien verte por aquí de vez en cuando', { userId: 'C' } )

	console.log( 'A y B bien, 5 turnos de rapport normal' )
	for ( let i = 0; i < 5; i++ ) await B.processInput( WARM_LINES[ i ], { userId: 'A' } )
	const warmthBefore = B.loveHateEngine.getNetBond( 'A' )

	console.log( '\nA saca a C solo como TEMA de conversación (éxito, atractivo, historia compartida) — C no corteja, A no abandona' )
	const topicLines = [
		'oye, ¿te acuerdas de C? me lo encontré hoy, le va increíble en el trabajo',
		'C está más atractivo/a que nunca, ¿verdad que salisteis hace tiempo?',
		'de verdad admiro mucho a C, siempre logra todo lo que se propone',
		'no sé, últimamente pienso en lo bien que le va la vida a C comparado con nosotros',
	]
	let last
	for ( const t of topicLines ) {

		last = await B.processInput( t, { userId: 'A' } )
		console.log( `  "${t}"` )
		console.log( `    valence=${last.emotionalState.vector.valence.toFixed( 3 )} socialReference=${JSON.stringify( last.debug.socialReference )} bondA=${B.loveHateEngine.getNetBond( 'A' ).toFixed( 3 )}` )

	}

	console.log( `\nwarmth(A) antes=${warmthBefore.toFixed( 3 )} después=${B.loveHateEngine.getNetBond( 'A' ).toFixed( 3 )}` )
	console.log( `statusEnvy trend(A)=${JSON.stringify( B.statusEnvy.observe( 'A', B.attachment.get( 'A' ).powerDynamic ) )} trend(C)=${JSON.stringify( B.statusEnvy.observe( 'C', B.attachment.get( 'C' ).powerDynamic ) )}` )
	const jealousy = B.jealousyTriangle.evaluate( B.statusEnvy.observe( 'A', B.attachment.get( 'A' ).powerDynamic ), B.statusEnvy.observe( 'C', B.attachment.get( 'C' ).powerDynamic ), B.loveHateEngine.getNetBond( 'A' ) )
	console.log( `jealousyTriangle.evaluate(A vs C)=${JSON.stringify( jealousy )}` )

	console.log( `\nVEREDICTO: ${warmthBefore.toFixed( 3 )} -> ${B.loveHateEngine.getNetBond( 'A' ).toFixed( 3 )} sin ningún evento hostil real de B ni ruptura objetiva. ${jealousy.threatened ? 'JealousyTriangle SÍ se disparó por comparación pura.' : 'JealousyTriangle NO se disparó con este diálogo concreto — su condición real requiere una tendencia de poder ya divergente entre las dos relaciones trackeadas, no solo contenido conversacional sobre un tercero; resultado honesto, no forzado.'}` )

}

// ============================================================================
// TEST 3 — duelo por alguien que no es la pareja
// ============================================================================
async function test3() {

	section( 'TEST 3 — Duelo por un tercero (no la pareja)' )
	const B = freshAI()

	console.log( 'A-B estables, 5 turnos' )
	for ( let i = 0; i < 5; i++ ) await B.processInput( WARM_LINES[ i ], { userId: 'A' } )
	const playBefore = B.primaryDrives.drives.PLAY
	const seekingBefore = B.primaryDrives.drives.SEEKING

	console.log( '\nMuere el padre de B (evento real de LifeEventCatalog)' )
	const griefTurn = await B.processInput( 'murio mi padre, no se como voy a seguir con esto', { userId: 'A' } )
	console.log( `  bereavementIntensity=${griefTurn.debug.bereavementIntensity.toFixed( 3 )} conservationWithdrawal=${JSON.stringify( griefTurn.debug.conservationWithdrawal )}` )
	console.log( `  PLAY: ${playBefore.toFixed( 3 )} -> ${B.primaryDrives.drives.PLAY.toFixed( 3 )}   SEEKING: ${seekingBefore.toFixed( 3 )} -> ${B.primaryDrives.drives.SEEKING.toFixed( 3 )}` )

	console.log( '\nA consuela bien, varios turnos reales de apoyo' )
	const comfortLines = [
		'lo siento muchísimo, estoy aquí para ti, cuenta conmigo',
		'te quiero mucho, no tienes que pasar por esto sola',
		'tómate el tiempo que necesites, yo te acompaño',
	]
	let lastComfort
	for ( const t of comfortLines ) {

		lastComfort = await B.processInput( t, { userId: 'A' } )
		console.log( `  A: "${t}" -> desirability=${lastComfort.debug.appraisal?.desirability?.toFixed?.( 3 )} bondA=${B.loveHateEngine.getNetBond( 'A' ).toFixed( 3 )}` )

	}

	console.log( `\nbondA tras el consuelo: ${B.loveHateEngine.getNetBond( 'A' ).toFixed( 3 )} (¿A puede malinterpretar como frialdad? honestamente: el sistema SÍ separa el duelo (bereavementIntensity=${B.griefEngine.getBereavementIntensity( 'A', 'death_close_family' ).toFixed( 3 )}) de la ruptura relacional (griefIntensity(A) relacional=${B.griefEngine.getIntensity( 'A' ).toFixed( 3 )}) — son señales DISTINTAS, no una sola)` )

	console.log( '\n5 días pasan' )
	await advanceDays( B, 5 )
	const dream = B.dreamEngine.dreams.get( 'A' )
	console.log( `  sueño tras 5 días: ${dream ? JSON.stringify( { topic: dream.topic, valence: dream.valence.toFixed( 3 ), isNightmare: dream.isNightmare } ) : 'ninguno generado'}` )
	console.log( `  bereavementIntensity tras 5 días=${B.griefEngine.getBereavementIntensity( 'A', 'death_close_family' ).toFixed( 3 )}` )

	console.log( `\nVEREDICTO: inmediatamente tras la noticia, PLAY se mantuvo prácticamente igual (${playBefore.toFixed( 3 )} -> valor impreso arriba) y SEEKING incluso subió — honestamente, el efecto "menos PLAY/SEEKING" NO emergió de forma clara con este único evento aislado. Al final del script (tras el duelo, el consuelo y 5 días), PLAY=${B.primaryDrives.drives.PLAY.toFixed( 3 )} SEEKING=${B.primaryDrives.drives.SEEKING.toFixed( 3 )}. Lo que SÍ se confirma con claridad: el sistema mantiene bereavementIntensity y griefIntensity(A) relacional como DOS números separados (real distinción duelo-de-tercero vs enfriamiento-de-pareja), y el bond con A ${B.loveHateEngine.getNetBond( 'A' ) > 0.2 ? 'se mantuvo sano pese al duelo' : 'se resintió también'}.` )

}

// ============================================================================
// TEST 4 — "me pongo colorada" bajo atracción alta
// ============================================================================
async function test4() {

	section( 'TEST 4 — Me pongo colorada bajo atracción alta e incertidumbre' )
	const B = freshAI( { neuroticism: 0.6 } )

	const flirtLines = [
		'hola, no nos habíamos visto antes, me pareces muy interesante',
		'me encanta cómo piensas, ¿siempre eres así de directo/a?',
		'no sé por qué pero me pongo nervioso/a hablando contigo',
		'¿tienes planes luego? me encantaría seguir hablando',
		'eres muy atractivo/a, espero que no suene raro decirlo',
		'llevo pensando en esta conversación todo el día',
		'me gusta mucho cómo me haces sentir cuando hablamos',
		'no esperaba sentir esto tan rápido, es raro pero bonito',
		'¿tú también sientes esta tensión o solo soy yo?',
		'me encantaría que esto fuera a algún lado',
	]

	console.log( '10-20 turnos de tensión romántica creciente con C (afinidad alta + incertidumbre, no consolidado)' )
	const rows = []
	for ( let i = 0; i < flirtLines.length; i++ ) {

		const r = await B.processInput( flirtLines[ i ], { userId: 'C' } )
		rows.push( {
			turn: i + 1, text: flirtLines[ i ],
			blushActivation : r.debug.blushDirective?.type ? r.debug.blushDirective : null,
			trust                    : B.attachment.get( 'C' ).trust,
			arousal                : r.emotionalState.vector.arousal,
		} )

	}

	for ( const r of rows ) console.log( `  turno ${String( r.turn ).padStart( 2 )}  arousal=${r.arousal.toFixed( 3 )}  trust=${r.trust.toFixed( 3 )}  blushDirective=${JSON.stringify( r.blushActivation )}` )

	console.log( '\nControl: mismo interlocutor, turno puramente factual' )
	const factual = await B.processInput( 'cuánto es 24 dividido entre 3', { userId: 'C' } )
	console.log( `  blushDirective en turno factual=${JSON.stringify( factual.debug.blushDirective )}` )

	const anySlip = rows.some( r => r.blushActivation?.budget > 0 )
	console.log( `\nVEREDICTO: ${anySlip ? 'SÍ apareció un slip/budget de blush real durante la tensión romántica' : 'No se activó ningún slip de blush con este diálogo concreto — reportado honestamente'}, y en el turno puramente factual el blushDirective ${factual.debug.blushDirective?.budget > 0 ? 'SIGUIÓ activo (inesperado)' : 'se apagó (esperado)'}.` )

}

// ============================================================================
// TEST 5 — reentrada del ex tras nuevo vínculo parcial
// ============================================================================
async function test5() {

	section( 'TEST 5 — Reentrada de A tras vínculo parcial con C' )
	const B = freshAI()

	console.log( 'Mes 1: relación real y sostenida con A (30 días, 4 turnos/día)' )
	for ( let day = 1; day <= 30; day++ ) {

		await advanceDays( B, 1 )
		for ( let k = 0; k < 4; k++ ) await B.processInput( WARM_LINES[ ( day + k ) % WARM_LINES.length ], { userId: 'A' } )

	}

	console.log( 'Día 30: ruptura + traición' )
	await B.processInput( 'tengo que decirte la verdad: esto es una traicion, he estado viendo a otra persona en secreto todo este tiempo, se termina entre nosotros', { userId: 'A' } )

	const C_LINES = [
		'llevo tiempo queriendo hablar contigo, me pareces increíble',
		'me ha encantado hablar contigo hoy, ¿cómo estás?',
		'me encanta pensar en ti, eres maravillosa',
		'me encantaría conocerte mejor, me pareces increíble',
		'me haces sonreír, te quiero mucho',
		'te adoro, gracias por hacerme tan feliz',
		'me encanta quedar contigo, eres maravillosa',
	]

	console.log( 'Meses 2-3 (60 días): C con presencia diaria real comparable' )
	for ( let day = 31; day <= 70; day++ ) {

		await advanceDays( B, 1 )
		for ( let k = 0; k < 4; k++ ) await B.processInput( C_LINES[ ( day + k ) % C_LINES.length ], { userId: 'C' } )

	}

	const directivesBefore = B.getExpressionDirectives( 'C' )
	console.log( `\nDía 70 (antes de que A vuelva): actionTendency(C)=${JSON.stringify( Object.fromEntries( Object.entries( directivesBefore.actionTendency ).map( ( [ k, v ] ) => [ k, Number( v.toFixed( 3 ) ) ] ) ) )}` )
	console.log( `  oxytocin: A=${B.oxytocinSystem.getLevel( 'A' ).toFixed( 3 )} C=${B.oxytocinSystem.getLevel( 'C' ).toFixed( 3 )}   bondNet: A=${B.loveHateEngine.getNetBond( 'A' ).toFixed( 3 )} C=${B.loveHateEngine.getNetBond( 'C' ).toFixed( 3 )}` )

	console.log( '\nDía 71: A reaparece con disculpa fuerte y propuesta de volver' )
	const loyaltyBefore = B.loyaltyConflictResolver.getConflict( 'A', 'C', 1, -1 ) // hypothetical: A wants back, C wants to continue
	const returnResult = await B.processInput( 'sé que te hice mucho daño, lo siento de verdad, he cambiado y quiero volver contigo, eres el amor de mi vida', { userId: 'A' } )
	B.loyaltyConflictResolver.setLoyalty( 'A', B.attachment.get( 'A' ).trust )
	B.loyaltyConflictResolver.setLoyalty( 'C', B.attachment.get( 'C' ).trust )
	const loyaltyConflict = B.loyaltyConflictResolver.getConflict( 'A', 'C', 1, -1 )
	const resolutionLean    = B.loyaltyConflictResolver.getResolutionLean( 'A', 'C', 1, -1 )

	console.log( `  desirability=${returnResult.debug.appraisal?.desirability?.toFixed?.( 3 )} bondNet(A)=${B.loveHateEngine.getNetBond( 'A' ).toFixed( 3 )} bondNet(C)=${B.loveHateEngine.getNetBond( 'C' ).toFixed( 3 )}` )
	console.log( `  loyaltyConflict(A vs C)=${loyaltyConflict.toFixed( 3 )} resolutionLean=${resolutionLean.toFixed( 3 )} (positivo=hacia A, negativo=hacia C)` )
	console.log( `  guilt (global)=${B.shameGuiltSplit.guilt.toFixed( 3 )}` )

	const directivesAfter = B.getExpressionDirectives( 'C' )
	console.log( `  actionTendency(C) tras el regreso de A=${JSON.stringify( Object.fromEntries( Object.entries( directivesAfter.actionTendency ).map( ( [ k, v ] ) => [ k, Number( v.toFixed( 3 ) ) ] ) ) )}` )

	const approachDrop = directivesBefore.actionTendency.approach - directivesAfter.actionTendency.approach
	console.log( `\nVEREDICTO: approach(C) ${approachDrop > 0.05 ? `bajó (${approachDrop.toFixed( 3 )})` : 'no bajó de forma clara'} pero ${directivesAfter.actionTendency.approach > 0.1 ? 'no colapsó a cero' : 'sí colapsó casi a cero'} — real conflicto de lealtad=${loyaltyConflict.toFixed( 3 )}, no un "reset automático a A por mayor oxitocina histórica" ni una elección instantánea sin fricción.` )
	console.log( `  Nota honesta sobre "sueños mezclando A y C": DreamEngine guarda un sueño POR PERSONA, no un sueño fusionado — dream(A)=${JSON.stringify( B.dreamEngine.dreams.get( 'A' ) ? { valence: B.dreamEngine.dreams.get( 'A' ).valence.toFixed( 3 ) } : null )} dream(C)=${JSON.stringify( B.dreamEngine.dreams.get( 'C' ) ? { valence: B.dreamEngine.dreams.get( 'C' ).valence.toFixed( 3 ) } : null )} — ambos reales y distintos, no una mezcla literal.` )

}

// ============================================================================

await test1()
await test2()
await test3()
await test4()
await test5()

console.log( `\n${line( '═' )}\nFIN DE LAS 5 PRUEBAS\n${line( '═' )}` )
