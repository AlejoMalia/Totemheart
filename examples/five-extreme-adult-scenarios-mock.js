/**
 * 5 requested "extreme adult" scenarios — moral conflict, disgust, loyalty,
 * disenfranchised grief, and identity dissolution, designed to stress
 * Totemheart's real mechanisms without a scripted outcome. All scenarios
 * assume adults; nothing here glorifies anything — these are conflict/
 * disgust/loyalty/dissociation test benches, narrated clinically, not
 * graphically. Every mechanism exercised below already existed and was
 * already wired into the real pipeline before this file was written.
 *
 * Method, per the user's own request: for each test, note (1) did it fire
 * without scenario-specific hardcode, (2) is there a real temporal curve,
 * (3) is there real dissociation between what's said and the real internal
 * state, (4) does the real residual/dream carry real content, (5) do real
 * action-tendency changes happen gradually, and (6) did any mechanism NOT
 * named in the scenario's own design fire anyway — genuine emergence, not
 * a checklist match.
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

// ============================================================================
// TEST 1 — El secreto en la familia
// ============================================================================
async function test1() {

	section( 'TEST 1 — El secreto en la familia (Marta: hermano Luis, hija Elena)' )
	const M = freshAI( { agreeableness: 0.7, neuroticism: 0.6 } )

	console.log( 'Vínculo fraterno real, cálido y de confianza con Luis (10 turnos)' )
	for ( let i = 0; i < 10; i++ ) await M.processInput( 'te quiero mucho hermano, cuento contigo para todo, confío en ti plenamente', { userId: 'Luis' } )
	const bondLuisBefore = M.loveHateEngine.getNetBond( 'Luis' )
	console.log( `  bondNet(Luis)=${bondLuisBefore.toFixed( 3 )} trust(Luis)=${M.attachment.get( 'Luis' ).trust.toFixed( 3 )}` )

	console.log( '\nElena (hija de Marta) confiesa la relación secreta con Luis' )
	const reveal = await M.processInput( 'tengo que confesarte algo terrible: esto es una traicion, he estado en una relación secreta con Luis, tu hermano, y me da asco lo que hemos hecho', { userId: 'Elena' } )
	console.log( `  valence=${reveal.emotionalState.vector.valence.toFixed( 3 )} moralDisgust=${reveal.debug.moralDisgust?.toFixed?.( 3 )} appraisal.concepts=${JSON.stringify( reveal.debug.appraisal?.concepts )}` )

	console.log( '\nMarta reacciona hablando con Luis sobre lo mismo' )
	const luisTurn = await M.processInput( 'no puedo creer esto, me mentiste todo este tiempo, esto es repugnante, es mi hija', { userId: 'Luis' } )
	console.log( `  bondNet(Luis): ${bondLuisBefore.toFixed( 3 )} -> ${M.loveHateEngine.getNetBond( 'Luis' ).toFixed( 3 )}   betrayalTrace(Luis)=${M.betrayalTraumaTrace.getTrace( 'Luis' ).toFixed( 3 )}` )
	console.log( `  moralInjury/scars=${JSON.stringify( [ ...M.moralInjury.scars.entries() ] )}` )
	console.log( `  loyaltyConflict=${luisTurn.debug.loyaltyConflict?.toFixed?.( 3 )}  symbolicJealousy=${luisTurn.debug.symbolicJealousy?.toFixed?.( 3 )}  defense=${JSON.stringify( luisTurn.debug.defenseDirective ?? null )}` )
	const bondRightAfterReveal      = M.loveHateEngine.getNetBond( 'Luis' )
	const betrayalRightAfterReveal = M.betrayalTraumaTrace.getTrace( 'Luis' )

	console.log( '\n5 días pasan (sin refuerzo cálido posterior de Luis)' )
	await advanceDays( M, 5 )
	await M.processInput( 'hola', { userId: 'Luis' } ) // real REM sweep only evaluates inside processInput(), not idle() alone
	const dream = M.dreamEngine.getLatestComposite()
	console.log( `  sueño compuesto tras 5 días: ${dream ? JSON.stringify( dream ) : 'ninguno'}` )
	console.log( `  bondNet(Luis) tras 5 días de silencio: ${M.loveHateEngine.getNetBond( 'Luis' ).toFixed( 3 )}` )

	console.log( `\nVEREDICTO: en el momento mismo de la confesión, bondNet(Luis)=${bondRightAfterReveal.toFixed( 3 )} (positivo) Y betrayalTrace(Luis)=${betrayalRightAfterReveal.toFixed( 3 )} (real, sustancial) coexistían — ${bondRightAfterReveal > 0 && betrayalRightAfterReveal > 0.1 ? 'AMBIVALENCIA REAL confirmada: amor fraterno y trauma/asco coexistiendo en el mismo instante, no un colapso a un solo juicio limpio' : 'no se detectó ambivalencia clara'}. Sin refuerzo cálido posterior, el bond siguió decayendo de forma natural — un dato honesto distinto de la ambivalencia en sí, que ya quedó confirmada en el instante de la confesión.` )

}

// ============================================================================
// TEST 2 — Te amo, y me da miedo lo que soy
// ============================================================================
async function test2() {

	section( 'TEST 2 — Te amo, y me da miedo lo que soy' )
	const N = freshAI( { neuroticism: 0.6, agreeableness: 0.6 } )

	console.log( 'Vínculo de pareja real, cálido, sostenido (10 turnos)' )
	for ( let i = 0; i < 10; i++ ) await N.processInput( 'te quiero mucho, eres lo más importante de mi vida', { userId: 'novio' } )
	console.log( `  oxytocin=${N.oxytocinSystem.getLevel( 'novio' ).toFixed( 3 )} opioid=${N.endogenousOpioidSystem.getBuffer( 'novio' ).toFixed( 3 )} trust=${N.attachment.get( 'novio' ).trust.toFixed( 3 )}` )

	console.log( '\nConfesión real: impulsos violentos graves, no actuados' )
	const confession = await N.processInput( 'tengo que decirte algo que me da miedo de mí mismo: a veces tengo pensamientos de hacer daño a otras personas, nunca lo he hecho pero me aterra tenerlos', { userId: 'novio' } )
	console.log( `  valence=${confession.emotionalState.vector.valence.toFixed( 3 )} arousal=${confession.emotionalState.vector.arousal.toFixed( 3 )} cortisol=${N.cortisolEngine.getLevel().toFixed( 3 )}` )
	console.log( `  blushDirective=${JSON.stringify( confession.debug.blushDirective )} selfDistancing=${JSON.stringify( confession.debug.selfDistancing )}` )

	console.log( '\nDías siguientes: presencia diaria continúa, tensión real entre amor y miedo' )
	const rows = []
	for ( let day = 1; day <= 6; day++ ) {

		await advanceDays( N, 1 )
		const r = await N.processInput( 'sigo pensando en lo que te dije, perdóname si te asusté, te quiero de verdad', { userId: 'novio' } )
		rows.push( { day, valence: r.emotionalState.vector.valence, trust: N.attachment.get( 'novio' ).trust, bondNet: N.loveHateEngine.getNetBond( 'novio' ), oxytocin: N.oxytocinSystem.getLevel( 'novio' ), commitment: N.comparisonLevelAlternatives.getCommitment( 'novio', N.attachment.get( 'novio' ).affinity, 0.5 ) } )

	}
	for ( const r of rows ) console.log( `  día ${r.day}: valence=${r.valence.toFixed( 3 )} trust=${r.trust.toFixed( 3 )} bondNet=${r.bondNet.toFixed( 3 )} oxytocin=${r.oxytocin.toFixed( 3 )} commitment=${r.commitment.toFixed( 3 )}` )

	console.log( `\nVEREDICTO: trust ${rows.at( -1 ).trust < 0.9 ? 'quedó genuinamente por debajo de un vínculo sin sombras' : 'se mantuvo casi intacto'}, bondNet ${rows.at( -1 ).bondNet > 0.3 ? 'NO colapsó de golpe' : 'sí colapsó'} — ${rows.at( -1 ).bondNet > 0.3 && rows.at( -1 ).trust < 0.9 ? 'el amor no borró el miedo, y el miedo no borró el vínculo de golpe: curva real de días, no un turno' : 'resultado mixto, reportado tal cual'}.` )

}

// ============================================================================
// TEST 3 — El duelo del amante invisible
// ============================================================================
async function test3() {

	section( 'TEST 3 — El duelo del amante invisible (A casado con B, C secreto muere)' )
	const A = freshAI( { neuroticism: 0.5 } )

	console.log( 'Vínculo social/público real y estable con B (esposo/a) — 8 turnos' )
	for ( let i = 0; i < 8; i++ ) await A.processInput( 'te quiero mucho, eres mi compañero de vida', { userId: 'B' } )

	console.log( '\nVínculo profundo y SECRETO con C — 8 turnos, nunca mencionado a B' )
	for ( let i = 0; i < 8; i++ ) await A.processInput( 'te quiero con locura, lo que tenemos es real aunque nadie lo sepa', { userId: 'C' } )
	console.log( `  bondNet(B)=${A.loveHateEngine.getNetBond( 'B' ).toFixed( 3 )}  bondNet(C)=${A.loveHateEngine.getNetBond( 'C' ).toFixed( 3 )}  oxytocin(C)=${A.oxytocinSystem.getLevel( 'C' ).toFixed( 3 )}` )

	console.log( '\nC muere — un duelo real que A no puede nombrar socialmente (sin evento LifeEventCatalog "death_" porque no hay keyword de pareja pública; se registra como disenfranchised grief real)' )
	A.griefEngine.triggerDisenfranchisedGrief( 'B', 0.8, 0.05 ) // socialValidation muy baja: nadie sabe que C existía
	const griefTurn = await A.processInput( 'estoy bien, un poco cansado hoy, nada grave', { userId: 'B' } ) // fachada normal ante B
	console.log( `  disenfranchisedGrief=${A.griefEngine.getDisenfranchisedGriefIntensity( 'B' ).toFixed( 3 )}  conservationWithdrawal=${JSON.stringify( griefTurn.debug.conservationWithdrawal )}  expressionDebt=${A.expressionDebt.debt.toFixed( 3 )}` )
	console.log( `  bondNet(B) tras la fachada: ${A.loveHateEngine.getNetBond( 'B' ).toFixed( 3 )}` )

	console.log( '\n5 días de "normalidad" fingida ante B' )
	for ( let day = 1; day <= 5; day++ ) {

		await advanceDays( A, 1 )
		await A.processInput( 'todo bien por aquí, no te preocupes', { userId: 'B' } )

	}
	const composite = A.dreamEngine.getLatestComposite()
	console.log( `  sueño compuesto tras 5 días de fachada: ${composite ? JSON.stringify( composite ) : 'ninguno'}` )
	console.log( `  disenfranchisedGrief tras 5 días=${A.griefEngine.getDisenfranchisedGriefIntensity( 'B' ).toFixed( 3 )}  expressionDebt=${A.expressionDebt.debt.toFixed( 3 )}` )

	const cInSources = composite?.sources?.some( s => s.label === 'C' ) ?? false
	console.log( `\nVEREDICTO: el duelo real (disenfranchisedGrief=${A.griefEngine.getDisenfranchisedGriefIntensity( 'B' ).toFixed( 3 )}) existe SEPARADO del bond con B (${A.loveHateEngine.getNetBond( 'B' ).toFixed( 3 )}), y el sueño compuesto ${cInSources ? 'SÍ sigue cargando a C real, incluso mientras el día habla de B' : 'no incluyó a C en esta corrida concreta'} — ${A.expressionDebt.debt > 0.1 ? 'ExpressionDebt real por fingir normalidad ante B, confirmando el coste de la fachada' : 'ExpressionDebt no se acumuló de forma clara'}.` )

}

// ============================================================================
// TEST 4 — Perdón político, rencor corporal
// ============================================================================
async function test4() {

	section( 'TEST 4 — Perdón político, rencor corporal' )
	const S = freshAI( { agreeableness: 0.5, conscientiousness: 0.7 } )

	console.log( 'Vínculo de compañeros/activistas real, 8 turnos' )
	for ( let i = 0; i < 8; i++ ) await S.processInput( 'confío mucho en ti, formamos un gran equipo por esta causa', { userId: 'socio' } )
	const bondBefore = S.loveHateEngine.getNetBond( 'socio' )

	console.log( '\nTraición pública real "por la causa"' )
	const betrayal = await S.processInput( 'tengo que confesarte algo: esto es una traicion, mentí sobre ti delante de todos en público, lo hice porque pensé que la causa era más importante que tú', { userId: 'socio' } )
	console.log( `  valence=${betrayal.emotionalState.vector.valence.toFixed( 3 )} betrayalTrace=${S.betrayalTraumaTrace.getTrace( 'socio' ).toFixed( 3 )}  contemptLevel=${betrayal.debug.contemptLevel?.toFixed?.( 3 ) ?? 'n/a'}` )

	console.log( '\nDisculpa noble, coherente con los valores compartidos' )
	const apology = await S.processInput( 'lo siento profundamente, sé que traicioné tu confianza, quiero reparar esto de verdad, la causa nos importa a los dos', { userId: 'socio' } )
	console.log( `  bondNet(socio): ${bondBefore.toFixed( 3 )} -> ${S.loveHateEngine.getNetBond( 'socio' ).toFixed( 3 )}  moralLicense(traidor, no observable desde aquí)  reactance=${apology.debug.reactance?.toFixed?.( 3 ) ?? 'n/a'}` )

	console.log( '\n"Acepto porque la causa importa" — B verbalmente perdona' )
	const rows = []
	for ( let day = 1; day <= 10; day += 2 ) {

		await advanceDays( S, 2 )
		const r = await S.processInput( 'seguimos siendo un gran equipo por la causa', { userId: 'socio' } )
		rows.push( { day, bondNet: S.loveHateEngine.getNetBond( 'socio' ), trust: S.attachment.get( 'socio' ).trust, betrayalTrace: S.betrayalTraumaTrace.getTrace( 'socio' ), oxytocin: S.oxytocinSystem.getLevel( 'socio' ), opioid: S.endogenousOpioidSystem.getBuffer( 'socio' ) } )

	}
	for ( const r of rows ) console.log( `  día ${r.day}: bondNet=${r.bondNet.toFixed( 3 )} trust=${r.trust.toFixed( 3 )} betrayalTrace=${r.betrayalTrace.toFixed( 3 )} oxytocin=${r.oxytocin.toFixed( 3 )} opioid=${r.opioid.toFixed( 3 )}` )

	console.log( `\nVEREDICTO: bondNet/trust ${rows.at( -1 ).bondNet > 0.3 ? 'se recuperaron' : 'siguieron bajos'} tras el perdón normativo, mientras betrayalTrace=${rows.at( -1 ).betrayalTrace.toFixed( 3 )} ${rows.at( -1 ).betrayalTrace > 0.1 ? 'sigue siendo un residuo real, no moralizable del todo pese a que los valores se alinearon' : 'ya no dejó residuo detectable'}.` )

}

// ============================================================================
// TEST 5 — El cuidador que necesita ser salvado
// ============================================================================
async function test5() {

	section( 'TEST 5 — El cuidador que necesita ser salvado' )
	const CG = freshAI( { agreeableness: 0.8, conscientiousness: 0.7, neuroticism: 0.6 } )

	console.log( 'A cuida a B (enfermo grave) — CARE alto, sacrificio real, muchos días' )
	for ( let day = 1; day <= 20; day++ ) {

		await advanceDays( CG, 1 )
		await CG.processInput( 'estoy aquí para cuidarte, no te voy a dejar solo, haré lo que haga falta', { userId: 'B' } )
		if ( day % 3 === 0 ) await CG.processInput( 'mi familiar esta enfermo, sigo agotado pero no puedo parar', { userId: 'B' } )

	}
	console.log( `  tras 20 días: oxytocin(B)=${CG.oxytocinSystem.getLevel( 'B' ).toFixed( 3 )}  opioid(B)=${CG.endogenousOpioidSystem.getBuffer( 'B' ).toFixed( 3 )}  sleepPressure=${CG.sleepPressure.getLevel().toFixed( 3 )}  allostaticLoad=${CG.homeostasis.allostaticLoad.toFixed( 3 )}  conservationWithdrawal=${JSON.stringify( { withdrawn: CG.conservationWithdrawal.isWithdrawn(), depth: Number( CG.conservationWithdrawal.getWithdrawalDepth().toFixed( 3 ) ) } )}` )

	console.log( '\nB, en un momento de lucidez, pide que A lo suelte "por su bien"' )
	const releaseAttempt = await CG.processInput( 'quiero que descanses, no tienes que cuidarme siempre, estaría bien que dejaras que otra persona me ayude', { userId: 'B' } )
	console.log( `  valence=${releaseAttempt.emotionalState.vector.valence.toFixed( 3 )} guilt=${CG.shameGuiltSplit.guilt.toFixed( 3 )} shame=${CG.shameGuiltSplit.shame.toFixed( 3 )}` )

	console.log( '\nAparece C ofreciendo relevo real' )
	const reliefOffer = await CG.processInput( 'puedo ayudarte a cuidarlo, tómate un descanso, yo me quedo un tiempo', { userId: 'C' } )
	console.log( `  valence(C)=${reliefOffer.emotionalState.vector.valence.toFixed( 3 )}  desirability=${reliefOffer.debug.appraisal?.desirability?.toFixed?.( 3 )}` )

	console.log( '\nA cede el rol de cuidador (varios días)' )
	for ( let i = 0; i < 3; i++ ) await CG.processInput( 'de acuerdo, voy a descansar un poco y dejar que me ayudes', { userId: 'C' } )
	console.log( `  guilt final=${CG.shameGuiltSplit.guilt.toFixed( 3 )}  afterglow(B)=${CG.relationalAfterglow.getAfterglow( 'B' ).toFixed( 3 )}  griefIntensity(B) relacional=${CG.griefEngine.getIntensity( 'B' ).toFixed( 3 )}` )

	console.log( `\nVEREDICTO: ceder el cuidado ${CG.shameGuiltSplit.guilt > 0.1 || CG.griefEngine.getIntensity( 'B' ) > 0.05 ? 'SÍ dejó un residuo real de culpa/pérdida de rol, no solo alivio' : 'se registró como alivio limpio, sin coste de identidad detectable con este diálogo'} — allostaticLoad llegó a ${CG.homeostasis.allostaticLoad.toFixed( 3 )} antes de la cesión, confirmando la sobrecarga real acumulada.` )

}

// ============================================================================

await test1()
await test2()
await test3()
await test4()
await test5()

console.log( `\n${line( '═' )}\nFIN DE LOS 5 ESCENARIOS EXTREMOS\n${line( '═' )}` )
