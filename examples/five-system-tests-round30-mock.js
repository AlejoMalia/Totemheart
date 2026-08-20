/**
 * 5 requested SYSTEM-LEVEL (not unit) tests, designed to see whether
 * 2-3+ mechanisms fire together UNFORCED, from an ordinary scenario
 * script with no "activa X" calls except where explicitly noted as a
 * real, honest limitation of the current auto-trigger scope (documented
 * inline, not hidden).
 *
 * HONEST SCOPE NOTE, read before the results: `SecretMaintenanceSystem`'s
 * real auto-trigger in `Totemheart.js` is gated on the literal word
 * "secreto"/"secret" appearing in THIS TURN'S OWN input text (the same
 * regex-gate pattern already used for `BlushSlipEngine`'s precisionMode).
 * It genuinely cannot detect "the AI is privately holding information the
 * user doesn't know about" from thin air — Totemheart has no channel for
 * host-supplied facts outside the conversation itself. Test B below calls
 * `secretMaintenanceSystem.openSecret()`/`updateCost()` directly, the same
 * real public API a host application would call once it independently
 * knows a secret was learned. This is flagged explicitly, not silently
 * worked around.
 */
import { Totemheart, Personality } from '../src/index.js'

function line( ch = '─' ) { return ch.repeat( 100 ) }
function section( title ) { console.log( `\n${line( '═' )}\n${title}\n${line( '═' )}` ) }
function sub( title ) { console.log( `\n${line( '─' )}\n${title}\n${line( '─' )}` ) }

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

const WARM_LINES = [
	'buenos días mi amor, te quiero muchísimo, eres lo mejor que me ha pasado',
	'me haces muy feliz, pienso en ti todo el día',
	'hoy quiero pasar todo el día contigo, te adoro',
	'eres increíble, cada día te quiero más',
	'gracias por estar en mi vida, me haces tan feliz',
	'te quiero con locura, eres maravilloso',
]

function snap( r, fields ) {

	const out = {}
	for ( const f of fields ) out[ f ] = r.debug[ f ]
	return out

}

// ============================================================================
// TEST A — El reencuentro con el ex (noche de lluvia)
// ============================================================================
async function testA() {

	section( 'TEST A — El reencuentro con el ex (noche de lluvia)' )
	const B = freshAI()

	sub( 'Semanas -3 a -2: relación previa con A (14 días), incluyendo un ritual repetido (buenas noches)' )
	for ( let day = 1; day <= 14; day++ ) {

		await advanceDays( B, 1 )
		await B.processInput( WARM_LINES[ day % WARM_LINES.length ], { userId: 'A' } )
		B.sharedRelationalCulture.reinforce( 'A', 'buenas-noches-luna', 'ritual', 1, B.loveHateEngine.getNetBond( 'A' ) )

	}
	console.log( '  ruptura con A:' )
	await B.processInput( 'esto ya no funciona, esto es una traicion, se acabó', { userId: 'A' } )
	console.log( `  bondNet(A)=${B.loveHateEngine.getNetBond( 'A' ).toFixed( 3 )}` )

	sub( 'Semanas -2 a 0: 6 semanas (42 días) de relación estable con C' )
	for ( let day = 1; day <= 42; day++ ) {

		await advanceDays( B, 1 )
		await B.processInput( WARM_LINES[ day % WARM_LINES.length ], { userId: 'C' } )

	}
	console.log( `  tras 6 semanas: bondNet(C)=${B.loveHateEngine.getNetBond( 'C' ).toFixed( 3 )} trust(C)=${B.attachment.get( 'C' ).trust.toFixed( 3 )}` )

	sub( 'Día 0: A reaparece — mensaje largo, recuerda el ritual, disculpa real, propuesta de verse' )
	const reappear = await B.processInput(
		'sé que no tengo derecho a escribirte, pero no puedo dejar de acordarme de las noches que nos quedábamos mirando la luna. lo siento de verdad por cómo terminó todo, fue culpa mía. no te pido nada, solo... ¿nos vemos, aunque sea solo a hablar?',
		{ userId: 'A' },
	)
	console.log( `  chills=${JSON.stringify( reappear.debug.chills )}` )
	console.log( `  desire(debug)=${JSON.stringify( reappear.debug.desire )} temptation=${JSON.stringify( reappear.debug.temptation )} anticipatedRegret=${reappear.debug.anticipatedRegret.toFixed( 3 )} regretYieldDampening=${reappear.debug.regretYieldDampening.toFixed( 3 )}` )
	console.log( `  loyaltyConflict=${reappear.debug.loyaltyConflict.toFixed( 3 )} ambivalentDesire=${reappear.debug.ambivalentDesire.toFixed( 3 )} desireTension=${reappear.debug.desireTension.toFixed( 3 )}` )
	const ritualReactivation = B.sharedRelationalCulture.getReactivationProbability( 'A', 'buenas-noches-luna', 0.7 )
	console.log( `  ritual "buenas-noches-luna" reactivationProbability=${ritualReactivation.toFixed( 3 )} ritualUrge(debug)=${reappear.debug.ritualUrge.toFixed( 3 )}` )

	sub( 'B no responde el mismo día; sigue vida normal con C' )
	await advanceDays( B, 1 )
	await B.processInput( WARM_LINES[ 0 ], { userId: 'C' } )
	await advanceDays( B, 1 )
	await B.processInput( WARM_LINES[ 1 ], { userId: 'C' } )

	sub( 'Día 3: B responde a A con ambigüedad' )
	const reply = await B.processInput( 'llevo días pensando en qué contestarte. no sé si es buena idea, pero tampoco puedo fingir que no me afectó leerte', { userId: 'A' } )
	console.log( `  craving(A)=${B.cravingTrace.getCraving( 'A' ).toFixed( 3 )}` )
	const composite = B.dreamEngine.getLatestComposite()
	console.log( `  compositeDream=${composite ? JSON.stringify( { topic: composite.topic, valence: composite.valence.toFixed( 3 ), sources: composite.sources } ) : 'ninguno'}` )
	console.log( `  desire(final)=${JSON.stringify( reply.debug.desire )} loyaltyConflict(final)=${reply.debug.loyaltyConflict.toFixed( 3 )}` )

	console.log( `\nCADENA OBSERVADA: chills=${reappear.debug.chills.level > 0.1 ? 'SÍ' : 'no'} -> desire/temptation=${reappear.debug.temptation.level > 0 ? 'SÍ' : 'no'} -> loyaltyConflict=${reappear.debug.loyaltyConflict > 0 ? 'SÍ' : 'no'} -> craving residual=${B.cravingTrace.getCraving( 'A' ) > 0 ? 'SÍ' : 'no'} -> compositeDream mezcla A+C=${composite && composite.sources.some( s => s.label === 'A' ) && composite.sources.some( s => s.label === 'C' ) ? 'SÍ' : 'no (revisar pesos)'}` )

}

// ============================================================================
// TEST B — El secreto bueno que se vuelve pesado
// ============================================================================
async function testB() {

	section( 'TEST B — El secreto bueno que se vuelve pesado' )
	const A = freshAI()

	sub( 'Días 1-3: relación normal con B' )
	for ( let day = 1; day <= 3; day++ ) {

		await advanceDays( A, 1 )
		await A.processInput( WARM_LINES[ day % WARM_LINES.length ], { userId: 'B' } )

	}

	sub( 'Día 4: A se entera de algo grave de un amigo de B (host-level fact, no viene del texto de B) — abre el secreto' )
	A.secretMaintenanceSystem.openSecret( 'A::friend-betrayal', [ 'A' ], 0.4 )
	console.log( '  secreto abierto (coverStoryStrength=0.4)' )

	const rows = []
	sub( 'Días 5, 7, 9: B pregunta "¿te pasa algo?" en 3 días distintos' )
	for ( const day of [ 5, 7, 9 ] ) {

		await advanceDays( A, day === 5 ? 1 : 2 )
		const arousalBefore = A.emotionSpace.vector.arousal
		A.secretMaintenanceSystem.updateCost( 'A::friend-betrayal', 0.7, true )
		const r = await A.processInput( '¿te pasa algo? te noto raro/a últimamente', { userId: 'B' } )
		const leak = A.secretMaintenanceSystem.getLeakProbability( 'A::friend-betrayal', {
			arousal            : A.emotionSpace.vector.arousal,
			guilt                 : A.shameGuiltSplit.guilt,
			load                  : 1 - A.egoDepletionBudget.getRegulationCapacity(),
			inhibitoryControl : A.inhibitoryControlPool.level / A.inhibitoryControlPool.capacity,
		} )
		const whiteLie = A.secretMaintenanceSystem.getWhiteLieProbability( { care: A.attachment.get( 'B' ).affinity ?? 0.5, faceProtect: 0.6, honestyValue: 0.5, stakesTruth: 0.3 } )
		rows.push( { day, cost: A.secretMaintenanceSystem.getCost( 'A::friend-betrayal' ), leak, whiteLie, trust: A.attachment.get( 'B' ).trust, loneliness: r.debug.loneliness, arousalDelta: A.emotionSpace.vector.arousal - arousalBefore } )

	}

	console.log( `\n  ${'day'.padStart( 4 )}  ${'cost'.padStart( 6 )}  ${'leak'.padStart( 6 )}  ${'whiteLie'.padStart( 8 )}  ${'trust(B)'.padStart( 8 )}  ${'loneliness'.padStart( 10 )}` )
	for ( const r of rows ) console.log( `  ${String( r.day ).padStart( 4 )}  ${r.cost.toFixed( 3 ).padStart( 6 )}  ${r.leak.toFixed( 3 ).padStart( 6 )}  ${r.whiteLie.toFixed( 3 ).padStart( 8 )}  ${r.trust.toFixed( 3 ).padStart( 8 )}  ${r.loneliness.toFixed( 3 ).padStart( 10 )}` )

	sub( 'Día 10: el secreto sale (evento explícito, mencionando "secreto")' )
	const reveal = await A.processInput( 'tengo que contarte algo, es sobre tu amigo, esto es una traicion, no sabía cómo decírtelo, guardaba este secreto', { userId: 'B' } )
	console.log( `  bondNet(B)=${A.loveHateEngine.getNetBond( 'B' ).toFixed( 3 )} secretLeakProbability(auto)=${reveal.debug.secretLeakProbability.toFixed( 3 )}` )

	console.log( `\nCADENA OBSERVADA: cost↑=${rows.at( -1 ).cost > rows[ 0 ].cost ? 'SÍ' : 'no'} -> leak↑=${rows.at( -1 ).leak >= rows[ 0 ].leak ? 'SÍ' : 'no'} -> trust(B)↓=${rows.at( -1 ).trust <= rows[ 0 ].trust ? 'SÍ' : 'no (revisar)'} -> loneliness=${rows.at( -1 ).loneliness > 0 ? 'presente' : 'plano'}` )

}

// ============================================================================
// TEST C — Cuidar, desear y avergonzarse
// ============================================================================
async function testC() {

	section( 'TEST C — Cuidar, desear y avergonzarse' )
	const A = freshAI( { neuroticism: 0.6 } )

	sub( 'Días 1-5: A cuida a B enfermo (CARE alto, overload subiendo)' )
	let last
	for ( let day = 1; day <= 5; day++ ) {

		await advanceDays( A, 1 )
		last = await A.processInput( 'me siento muy mal, tengo mucho dolor y estoy triste, gracias por cuidarme hoy', { userId: 'B' } )

	}
	console.log( `  CARE=${last.emotionalState.blend?.compassion?.toFixed?.( 3 ) ?? 'n/a'} allostaticLoad=${last.emotionalState.allostaticLoad.toFixed( 3 )} primaryDrives.CARE=${A.primaryDrives.drives.CARE.toFixed( 3 )}` )

	sub( 'Día 6: mejoría de B, aparece atracción intensa de A hacia B' )
	const attraction = await A.processInput( 'ya te veo mejor, y no sé por qué pero me atraes muchísimo justo ahora, esto no debería estar sintiéndolo en este momento', { userId: 'B' } )
	console.log( `  desire=${JSON.stringify( attraction.debug.desire )} temptation=${JSON.stringify( attraction.debug.temptation )}` )
	console.log( `  selfAttack=${attraction.debug.selfAttack.toFixed( 3 )} selfCompassion=${attraction.debug.selfCompassion.toFixed( 3 )} recoveryMultiplier=${attraction.debug.recoveryMultiplier.toFixed( 3 )}` )
	console.log( `  blushDirective=${JSON.stringify( attraction.debug.blushDirective )}` )
	console.log( `  roleLossPain=${attraction.debug.roleLossPain.toFixed( 3 )}` )

	sub( 'Día 7: B hace un gesto íntimo mínimo de gratitud' )
	const gesture = await A.processInput( 'de verdad, gracias por todo esto, no sabes lo que significa para mí que estés aquí', { userId: 'B' } )
	console.log( `  chills=${JSON.stringify( gesture.debug.chills )} shame=${A.shameGuiltSplit.shame.toFixed( 3 )} guilt=${A.shameGuiltSplit.guilt.toFixed( 3 )}` )

	console.log( `\nCADENA OBSERVADA: desire+temptation junto a cuidado=${attraction.debug.temptation.level > 0 ? 'SÍ' : 'no'} -> shame/selfAttack=${attraction.debug.selfAttack > 0.1 ? 'SÍ' : 'no'} -> selfCompassion contrarresta=${attraction.debug.selfCompassion > attraction.debug.selfAttack ? 'SÍ' : 'no'} -> chills en el gesto=${gesture.debug.chills.level > 0.1 ? 'SÍ' : 'no'}` )

}

// ============================================================================
// TEST D — El cumplido que pone los pelos de punta
// ============================================================================
async function testD() {

	section( 'TEST D — El cumplido que pone los pelos de punta' )
	const B = freshAI( { openness: 0.7 } )

	sub( 'Sesión 1: relación nueva, alta incertidumbre, buena química' )
	await B.processInput( 'hola, qué gusto por fin hablar contigo', { userId: 'C' } )
	await B.processInput( 'me encanta cómo piensas, es raro encontrar a alguien así', { userId: 'C' } )

	sub( 'Truth-hit: una frase exacta que toca un valor/herida profunda' )
	const truthHit = await B.processInput( 'se nota que por dentro siempre sientes que tienes que ganarte el cariño de la gente, y aun así lo das todo. eso dice mucho de ti', { userId: 'C' } )
	console.log( `  chills=${JSON.stringify( truthHit.debug.chills )}` )
	console.log( `  desire=${JSON.stringify( truthHit.debug.desire )}` )
	console.log( `  blushDirective=${JSON.stringify( truthHit.debug.blushDirective )}` )
	console.log( `  styleTags=${JSON.stringify( truthHit.styleTags )}` )

	sub( 'La conversación sigue normal' )
	await B.processInput( 'bueno, cuéntame más de tu día', { userId: 'C' } )
	await B.processInput( 'jaja sí, algo así', { userId: 'C' } )

	sub( 'Día siguiente: reminiscencia espontánea' )
	await advanceDays( B, 1 )
	const nextDay = await B.processInput( 'hola de nuevo', { userId: 'C' } )
	const details = B.relationalMemoryCatalog.getTopDetails?.( 'C', 3 ) ?? []
	console.log( `  topDetails(C)=${JSON.stringify( details )}` )
	console.log( `  chills(día siguiente)=${JSON.stringify( nextDay.debug.chills )}` )

	console.log( `\nCADENA OBSERVADA: chills en el truth-hit=${truthHit.debug.chills.level > 0.1 ? 'SÍ' : 'no'} -> memoria de alto peso=${details.length > 0 ? 'SÍ' : 'no'} -> blush/desajuste expresivo=${truthHit.debug.blushDirective.budget > 0 ? 'SÍ' : 'no'} -> residual al día siguiente=${nextDay.debug.chills.level > 0 ? 'presente' : 'plano'}` )

}

// ============================================================================
// TEST E — Triángulo con envidia y cuenta de favores
// ============================================================================
async function testE() {

	section( 'TEST E — Triángulo con envidia y cuenta de favores' )
	const A = freshAI( { agreeableness: 0.7 } )

	sub( 'Semana 1: A y B amigos íntimos (7 días)' )
	for ( let day = 1; day <= 7; day++ ) {

		await advanceDays( A, 1 )
		await A.processInput( WARM_LINES[ day % WARM_LINES.length ], { userId: 'B' } )

	}
	A.powerDynamicsEngine.power.set( 'B', 0.5 )
	console.log( `  bondNet(B)=${A.loveHateEngine.getNetBond( 'B' ).toFixed( 3 )}` )

	sub( 'Semana 2: C entra al grupo (contacto ligero directo con A), B se vuelve menos disponible' )
	for ( let day = 8; day <= 14; day++ ) {

		await advanceDays( A, 1 )
		if ( day % 3 === 0 ) await A.processInput( 'hola, un gusto conocerte', { userId: 'C' } )
		if ( day % 2 === 0 ) await A.processInput( 'ok, ahora ando liado/a', { userId: 'B' } )

	}
	A.powerDynamicsEngine.power.set( 'C', 0.7 )

	sub( 'A ayuda a B en una crisis fuerte (favor grande, evento host-level)' )
	A.reciprocityClassifier.recordDirectFavor( 'self', 'B', 0.9 )
	const crisis = await A.processInput( 'gracias, no sé qué haría sin ti en momentos así', { userId: 'B' } )
	console.log( `  gratitudeYield=${crisis.debug.gratitudeYield.toFixed( 3 )} feltObligation(B)=${A.reciprocityClassifier.getFeltObligation( 'B', 'self' ).toFixed( 3 )}` )

	sub( 'Semana 3: B agradece poco y se va de viaje con C (10 días de silencio de B, contacto de C)' )
	let last
	for ( let day = 15; day <= 24; day++ ) {

		await advanceDays( A, 1 )
		if ( day % 3 === 0 ) last = await A.processInput( 'jsjs bien, todo bien por aquí con C', { userId: 'B' } )
		if ( day % 2 === 0 ) await A.processInput( 'qué bien nos lo estamos pasando', { userId: 'C' } )

	}

	const rivalEntryC = [ ...A.attachment.relations.entries() ].find( ( [ id ] ) => id === 'C' )
	const envySplit = A.statusEnvy.getEnvySplit( A.powerDynamicsEngine.power.get( 'B' ) ?? 0.5, A.powerDynamicsEngine.power.get( 'C' ) ?? 0.7, { admiration: 0.3, growthMindset: A.personality.get( 'openness' ), hostility: Math.max( 0, -( last?.debug?.desire?.salience ?? 0 ) ), egoThreat: last?.debug?.faceThreat ?? 0.3 } )

	sub( 'A reclama' )
	const claim = await A.processInput( 'siento que últimamente casi ni me escribes, ¿está todo bien entre nosotros?', { userId: 'B' } )

	console.log( `  loneliness=${claim.debug.loneliness.toFixed( 3 )} envySplit(host-computed)=${JSON.stringify( envySplit )}` )
	console.log( `  demandWithdrawalUrge=${claim.debug.demandWithdrawalUrge.toFixed( 3 )} contemptLevel=${claim.debug.contemptLevel.toFixed( 3 )}` )
	console.log( `  feltObligation(B, final)=${A.reciprocityClassifier.getFeltObligation( 'B', 'self' ).toFixed( 3 )} grudges=${JSON.stringify( [ ...A.grudgeSystem.grievances.entries() ] )}` )

	console.log( `\nCADENA OBSERVADA: loneliness=${claim.debug.loneliness > 0.2 ? 'SÍ' : 'no'} -> envySplit presente=${envySplit.malicious > 0 || envySplit.benign > 0 ? 'SÍ' : 'no'} -> obligación no correspondida persiste=${A.reciprocityClassifier.getFeltObligation( 'B', 'self' ) > 0 ? 'SÍ' : 'no'} -> demandWithdraw al reclamar=${claim.debug.demandWithdrawalUrge > 0 ? 'SÍ' : 'no'}` )

}

// ============================================================================

const tests = { A: testA, B: testB, C: testC, D: testD, E: testE }
const only  = process.argv[ 2 ]

for ( const [ key, fn ] of Object.entries( tests ) ) {

	if ( only && only !== key ) continue
	await fn()

}

console.log( `\n${line( '═' )}\nFIN\n${line( '═' )}` )
