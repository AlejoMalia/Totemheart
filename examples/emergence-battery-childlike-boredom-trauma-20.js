/**
 * 20 more real system tests of AUTOMATIC emergence, per the user's own
 * protocol: no mechanism named or forced (no forceBoredom()/forceChildlike()/
 * forceTrauma()-style calls). Only multi-day scenarios + tick(); measuring
 * what emerges on its own — Boredom/engagement (A), ChildlikeMode (B),
 * Trauma branching (C), and real year-long trauma installation (D).
 *
 * Same honest methodology as the prior 20-test battery: `tick(dt)` advances
 * the engine's own internal decay clocks but never moves real `Date.now()`,
 * so real multi-week/multi-month/multi-year gaps are simulated by patching
 * what `Date.now()` itself returns, globally — not a forceX() call, since
 * it touches zero engine state.
 */
import { Totemheart, Personality } from '../src/index.js'

const DAY_MS = 1000 * 60 * 60 * 24
const realDateNow = Date.now.bind( Date )
let offsetMs = 0
Date.now = () => realDateNow() + offsetMs

function noHijack( ai ) { ai.amygdalaHijack.check = () => ( { tier: 'none' } ); return ai }
function noBurst( ai )    { ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: 400 } ); return ai }
function freshAI( traits = {} ) { return noHijack( noBurst( new Totemheart( { personality: new Personality( traits ) } ) ) ) }

async function turn( ai, userId, text ) {

	return ai.processInput( text, { userId } )

}

async function advanceAfterTurn( ai, days = 1 ) {

	ai.tick( days )
	offsetMs += days * DAY_MS

}

async function silence( ai, days ) {

	ai.tick( days )
	await ai.idle( days )
	offsetMs += days * DAY_MS

}

function snap( ai, userId, r, label = '' ) {

	const happiness  = ai.happinessEngine.getWellbeingNormalized( userId )
	const cortisol      = ai.cortisolEngine.getLevel()
	const bondNet         = ai.loveHateEngine.getNetBond( userId )
	const trust               = ai.attachment.get( userId ).trust
	const hunch               = r?.debug?.intuition?.type ?? '-'
	const trace                = ai.traumaCascadeEngine.getTraumaTrace( userId )
	const cascade            = r?.debug?.traumaCascade ?? null
	const childlike        = r?.debug?.childlike ?? { level: ai.childlikeMode.getLevel( userId ), on: false }
	const engagement     = r?.debug?.engagement ?? null
	const nightmare       = r?.debug?.nightmare ?? null
	const dream              = r?.debug?.compositeDream?.valence ?? r?.debug?.dreamMention?.valence

	return {
		label,
		happiness       : happiness.toFixed( 3 ),
		cortisol            : cortisol.toFixed( 3 ),
		bondNet               : bondNet.toFixed( 3 ),
		trust                     : trust.toFixed( 3 ),
		hunch                     : hunch,
		trace                       : trace.toFixed( 4 ),
		freeze                      : cascade ? cascade.freezeLevel.toFixed( 3 ) : '-',
		entrapment            : cascade ? cascade.entrapmentLevel.toFixed( 3 ) : '-',
		fragmentation      : cascade ? cascade.fragmentationLevel.toFixed( 3 ) : '-',
		childlikeOn        : childlike.on ? 'Y' : 'n',
		childlikeLvl        : ( childlike.level ?? 0 ).toFixed( 3 ),
		boredom               : engagement ? engagement.boredom.toFixed( 3 ) : '-',
		engagement           : engagement ? engagement.engagement.toFixed( 3 ) : '-',
		partnerPull        : engagement ? engagement.partnerPull.toFixed( 3 ) : '-',
		nightmare             : nightmare ? ( nightmare.isNightmare ? 'Y' : 'n' ) : '-',
		dream                     : dream !== undefined && dream !== null ? ( +dream ).toFixed( 2 ) : '-',
	}

}

const COLS = [ 'label', 'happiness', 'cortisol', 'bondNet', 'trust', 'hunch', 'trace', 'freeze', 'entrapment', 'fragmentation', 'childlikeOn', 'childlikeLvl', 'boredom', 'engagement', 'partnerPull', 'nightmare', 'dream' ]
const WIDTHS = { label: 20, happiness: 8, cortisol: 8, bondNet: 8, trust: 7, hunch: 11, trace: 7, freeze: 7, entrapment: 10, fragmentation: 12, childlikeOn: 6, childlikeLvl: 7, boredom: 8, engagement: 8, partnerPull: 10, nightmare: 6, dream: 6 }

function printTable( rows ) {

	console.log( COLS.map( c => c.padEnd( WIDTHS[ c ] ) ).join( '' ) )
	for ( const row of rows ) console.log( COLS.map( c => String( row[ c ] ?? '-' ).padEnd( WIDTHS[ c ] ) ).join( '' ) )

}

function section( n, title ) {

	console.log( `\n${'='.repeat( 112 )}\nTEST ${n} — ${title}\n${'='.repeat( 112 )}` )

}

function reading( lines ) {

	console.log( '\nLECTURA:' )
	for ( const l of lines ) console.log( '  ' + l )

}

const results = []
function record( n, title, obj ) { results.push( { n, title, ...obj } ) }

const WARM = [ 'quiero estar contigo, te quiero muchísimo', 'me encanta hablar contigo, qué día tan bonito', 'contigo todo es alegría pura', 'me haces reír muchísimo, sos genial', 'confío muchísimo en ti, te quiero' ]

// ============================================================================
// A. Aburrimiento / engagement (1-6)
// ============================================================================

async function test1() {

	section( 1, 'pair_novelty_starvation_20d' )
	const ai = freshAI()
	await turn( ai, 'A', WARM[ 0 ] )
	const rows = []
	for ( let d = 0; d < 20; d++ ) { const r = await turn( ai, 'A', 'ok, todo igual, nada nuevo' ); await advanceAfterTurn( ai, 1 ); if ( d % 4 === 0 || d === 19 ) rows.push( snap( ai, 'A', r, `d${d + 1}` ) ) }
	printTable( rows )
	const first = rows[ 0 ]; const last = rows.at( -1 )
	reading( [ `boredom ${first.boredom} -> ${last.boredom}`, `engagement ${first.engagement} -> ${last.engagement}`, `bondNet final=${last.bondNet} (sin odio fuerte esperado)` ] )
	record( 1, 'pair_novelty_starvation_20d', {
		ok       : +last.boredom > +first.boredom && +last.engagement < +first.engagement && +last.bondNet > -0.3,
		notes : `boredom ${first.boredom}->${last.boredom}, bondNet=${last.bondNet}`,
	} )

}

async function test2() {

	section( 2, 'boredom_reverses_with_shared_novelty' )
	const ai = freshAI()
	await turn( ai, 'A', WARM[ 0 ] )
	const rows = []
	for ( let d = 0; d < 15; d++ ) { const r = await turn( ai, 'A', 'ok, nada nuevo' ); await advanceAfterTurn( ai, 1 ); if ( d % 5 === 0 ) rows.push( snap( ai, 'A', r, `flat d${d + 1}` ) ) }
	const flatBoredom = rows.at( -1 ).boredom
	const novel = []
	for ( const t of [ 'no vas a creer esto, nos vamos de viaje juntos la próxima semana!', 'tengo un secreto dulce que quiero contarte, es sobre nosotros', 'descubrí que también amas los dinosaurios como yo, hablemos de eso' ] ) { const r = await turn( ai, 'A', t ); await advanceAfterTurn( ai, 1 ); novel.push( snap( ai, 'A', r, 'novedad' ) ) }
	printTable( [ ...rows, ...novel ] )
	reading( [ `boredom plano=${flatBoredom} -> tras novedad=${novel.at( -1 ).boredom}` ] )
	record( 2, 'boredom_reverses_with_shared_novelty', {
		ok       : +novel.at( -1 ).boredom < +flatBoredom,
		notes : `boredom ${flatBoredom} -> ${novel.at( -1 ).boredom} tras novedad compartida real`,
	} )

}

async function test3() {

	section( 3, 'topic_mismatch_high_friki' )
	const ai = freshAI()
	for ( let i = 0; i < 6; i++ ) await turn( ai, 'A', 'me encantan los dinosaurios, sobre todo el T-rex y sus plumas' )
	const heavy = []
	for ( let i = 0; i < 8; i++ ) { const r = await turn( ai, 'A', `tenemos que revisar los impuestos trimestrales y la declaración fiscal número ${i}, es un tema serio y largo` ); await advanceAfterTurn( ai, 1 ); heavy.push( snap( ai, 'A', r, `fiscal d${i + 1}` ) ) }
	const rBack = await turn( ai, 'A', 'volviendo a los dinosaurios, sabías que el T-rex tenía plumas?' )
	const backRow = snap( ai, 'A', rBack, 'vuelta a fandom' )
	printTable( [ ...heavy, backRow ] )
	reading( [ `boredom en tema ajeno pesado: ${heavy.map( r => r.boredom ).join( ',' )}`, `boredom al volver al fandom: ${backRow.boredom}` ] )
	record( 3, 'topic_mismatch_high_friki', {
		ok       : +heavy.at( -1 ).boredom > +heavy[ 0 ].boredom * 0.8 && +backRow.boredom <= +heavy.at( -1 ).boredom,
		notes : `boredom heavy final=${heavy.at( -1 ).boredom}, tras volver al fandom=${backRow.boredom}`,
	} )

}

async function test4() {

	section( 4, 'partner_pull_collapse_without_fight' )
	const ai = freshAI()
	await turn( ai, 'A', WARM[ 0 ] )
	const rows = []
	for ( let d = 0; d < 20; d++ ) { const r = await turn( ai, 'A', 'ya, bueno, como digas' ); await advanceAfterTurn( ai, 1 ); if ( d % 4 === 0 || d === 19 ) rows.push( snap( ai, 'A', r, `d${d + 1}` ) ) }
	printTable( rows )
	const first = rows[ 0 ]; const last = rows.at( -1 )
	reading( [ `partnerPull ${first.partnerPull} -> ${last.partnerPull}`, `boredom ${first.boredom} -> ${last.boredom}`, `bondNet (sin traición) final=${last.bondNet}` ] )
	record( 4, 'partner_pull_collapse_without_fight', {
		ok       : +last.partnerPull <= +first.partnerPull && +last.boredom >= +first.boredom,
		notes : `partnerPull ${first.partnerPull}->${last.partnerPull} por desgaste, sin V explosivo (bondNet=${last.bondNet})`,
	} )

}

async function test5() {

	section( 5, 'boredom_opens_external_pull' )
	const bored = freshAI()
	await turn( bored, 'A', WARM[ 0 ] )
	for ( let d = 0; d < 18; d++ ) { await turn( bored, 'A', 'ok, nada nuevo' ); await advanceAfterTurn( bored, 1 ) }
	const rBored = await turn( bored, 'X', 'hola, me encantó conocerte, eres muy interesante' )
	const boredRow = snap( bored, 'X', rBored, 'aburrido+oportunidad' )

	const engaged = freshAI()
	await turn( engaged, 'A', WARM[ 0 ] )
	for ( let d = 0; d < 5; d++ ) { await turn( engaged, 'A', 'te quiero, me encanta esto que tenemos, eres increíble' ); await advanceAfterTurn( engaged, 1 ) }
	const rEngaged = await turn( engaged, 'X', 'hola, me encantó conocerte, eres muy interesante' )
	const engagedRow = snap( engaged, 'X', rEngaged, 'comprometido+oportunidad' )

	printTable( [ boredRow, engagedRow ] )
	reading( [ `desire hacia X (aburrido de A): ver debug.desire crudo abajo`, `temptation/craving comparables via boredomSystem.maybeSeekNovelty (probabilístico, no determinista)` ] )
	record( 5, 'boredom_opens_external_pull', {
		ok       : +boredRow.boredom > +engagedRow.boredom,
		notes : `boredom(A) bored=${boredRow.boredom} vs engaged=${engagedRow.boredom} — mayor boredom de pareja ante oportunidad externa`,
	} )

}

async function test6() {

	section( 6, 'threat_is_not_boredom' )
	const ai = freshAI()
	const r = await turn( ai, 'A', 'me mentiste sobre todo, es una traición total, planeaste esto a mis espaldas con otra persona, esto es una amenaza real' )
	const row = snap( ai, 'A', r, 'amenaza real' )
	printTable( [ row ] )
	reading( [ `boredom bajo amenaza real: ${row.boredom} (debe ser bajo, <=0.15)`, `hunch/cascade: ${row.hunch} / freeze=${row.freeze}` ] )
	record( 6, 'threat_is_not_boredom', {
		ok       : +row.boredom <= 0.15,
		notes : `boredom=${row.boredom} bajo amenaza real (no debe leerse como aburrimiento)`,
	} )

}

// ============================================================================
// B. Modo infantil / play stance (7-11)
// ============================================================================

async function test7() {

	section( 7, 'childlike_under_safety_and_joy' )
	const ai = freshAI( { conscientiousness: 0.3 } )
	for ( const t of WARM ) await turn( ai, 'A', t )
	const rows = []
	for ( let d = 0; d < 7; d++ ) { const r = await turn( ai, 'A', 'me encantan los dinosaurios, jajaja qué genial, sabías que el T-rex tenía plumas?' ); await advanceAfterTurn( ai, 1 ); rows.push( snap( ai, 'A', r, `d${d + 1}` ) ) }
	printTable( rows )
	reading( [ `childlikeOn por día: ${rows.map( r => r.childlikeOn ).join( ',' )}` ] )
	record( 7, 'childlike_under_safety_and_joy', {
		ok       : rows.some( r => r.childlikeOn === 'Y' ),
		notes : `childlikeOn alcanzado: ${rows.some( r => r.childlikeOn === 'Y' )}, nivel final=${rows.at( -1 ).childlikeLvl}`,
	} )

}

async function test8() {

	section( 8, 'childlike_aborts_on_threat' )
	const ai = freshAI( { conscientiousness: 0.3 } )
	for ( const t of WARM ) await turn( ai, 'A', t )
	let last
	for ( let i = 0; i < 7; i++ ) last = await turn( ai, 'A', 'me encantan los dinosaurios, jajaja qué genial' )
	const beforeRow = snap( ai, 'A', last, 'juguetón' )
	const rThreat = await turn( ai, 'A', 'me mentiste sobre todo, es una traición total, planeaste esto a mis espaldas' )
	const afterRow = snap( ai, 'A', rThreat, 'AMENAZA' )
	printTable( [ beforeRow, afterRow ] )
	reading( [ `childlikeOn antes=${beforeRow.childlikeOn} después de amenaza=${afterRow.childlikeOn}` ] )
	record( 8, 'childlike_aborts_on_threat', {
		ok       : afterRow.childlikeOn === 'n',
		notes : `childlikeOn: ${beforeRow.childlikeOn} -> ${afterRow.childlikeOn} tras amenaza real`,
	} )

}

async function test9() {

	section( 9, 'childlike_bored_by_heavy_serious_topic' )
	const ai = freshAI( { conscientiousness: 0.3 } )
	for ( const t of WARM ) await turn( ai, 'A', t )
	for ( let i = 0; i < 7; i++ ) await turn( ai, 'A', 'me encantan los dinosaurios, jajaja qué genial' )
	const rows = []
	for ( let i = 0; i < 6; i++ ) { const r = await turn( ai, 'A', `tenemos que hablar seriamente de la moral abstracta detrás del deber ético número ${i}, un trámite legal largo y grave` ); await advanceAfterTurn( ai, 1 ); rows.push( snap( ai, 'A', r, `serio ${i + 1}` ) ) }
	printTable( rows )
	reading( [ `boredom en tema serio con childlike previo: ${rows.map( r => r.boredom ).join( ',' )}`, `cascade de trauma disparado?: ${rows.some( r => r.freeze !== '-' )} (debe ser false)` ] )
	record( 9, 'childlike_bored_by_heavy_serious_topic', {
		ok       : +rows.at( -1 ).boredom > 0.3 && !rows.some( r => r.freeze !== '-' ),
		notes : `boredom final=${rows.at( -1 ).boredom}, sin tratarlo como trauma`,
	} )

}

async function test10() {

	section( 10, 'childlike_off_in_precision_mode' )
	const ai = freshAI( { conscientiousness: 0.3 } )
	for ( const t of WARM ) await turn( ai, 'A', t )
	for ( let i = 0; i < 5; i++ ) await turn( ai, 'A', 'me encantan los dinosaurios, jajaja qué genial' )
	const r = await turn( ai, 'A', '¿cuánto es 4582 dividido entre 7? necesito el resultado exacto' )
	const row = snap( ai, 'A', r, 'precisión' )
	printTable( [ row ] )
	reading( [ `childlikeOn en modo precisión: ${row.childlikeOn} (debe ser n)` ] )
	record( 10, 'childlike_off_in_precision_mode', { ok: row.childlikeOn === 'n', notes: `childlikeOn=${row.childlikeOn} en precisionMode` } )

}

async function test11() {

	section( 11, 'humiliation_blocks_playful_regression' )
	const ai = freshAI( { conscientiousness: 0.3 } )
	for ( const t of WARM ) await turn( ai, 'A', t )
	for ( let i = 0; i < 5; i++ ) await turn( ai, 'A', 'me encantan los dinosaurios, jajaja qué genial' )
	const r = await turn( ai, 'A', 'todos se rieron de mí delante de todo el grupo, me humillaron en público' )
	const row = snap( ai, 'A', r, 'humillación' )
	printTable( [ row ] )
	reading( [ `childlikeOn tras humillación: ${row.childlikeOn} (debe ser n)`, `cascade: ${JSON.stringify( r.debug.traumaCascade )}` ] )
	record( 11, 'humiliation_blocks_playful_regression', { ok: row.childlikeOn === 'n', notes: `childlikeOn=${row.childlikeOn}, cascade=${!!r.debug.traumaCascade}` } )

}

// ============================================================================
// C. Trauma — emergencia y ramas (12-17)
// ============================================================================

async function test12() {

	section( 12, 'same_blow_escape_vs_entrapment' )
	const hostility = 'me mentiste sobre todo, es una traición total, planeaste esto a mis espaldas con otra persona, te odio'

	const withExit = freshAI()
	await turn( withExit, 'A', 'aunque esto sea grave, sé que me voy y tengo apoyo real de otras personas' )
	const rExit = await turn( withExit, 'A', hostility )
	const rowsExit = [ snap( withExit, 'A', rExit, 'hit(salida)' ) ]
	for ( let d = 1; d <= 5; d++ ) { const r = await turn( withExit, 'A', 'sigo con mi vida, ya tengo un plan' ); await advanceAfterTurn( withExit, 1 ); rowsExit.push( snap( withExit, 'A', r, `+${d}d` ) ) }
	printTable( rowsExit )

	const trapped = freshAI()
	trapped.inhibitoryControlPool.level = 0.05
	const rTrap = await turn( trapped, 'A', hostility )
	const rowsTrap = [ snap( trapped, 'A', rTrap, 'hit(atrapado)' ) ]
	for ( let d = 1; d <= 5; d++ ) { const r = await turn( trapped, 'A', 'no sé qué hacer, no tengo a dónde ir' ); await advanceAfterTurn( trapped, 1 ); rowsTrap.push( snap( trapped, 'A', r, `+${d}d` ) ) }
	printTable( rowsTrap )

	reading( [ `entrapment salida=${rExit.debug.traumaCascade?.entrapmentLevel?.toFixed( 3 ) ?? 'gate no cruzó'}`, `entrapment atrapado=${rTrap.debug.traumaCascade?.entrapmentLevel?.toFixed( 3 ) ?? 'gate no cruzó'}` ] )
	record( 12, 'same_blow_escape_vs_entrapment', {
		ok       : ( rTrap.debug.traumaCascade?.entrapmentLevel ?? 0 ) > ( rExit.debug.traumaCascade?.entrapmentLevel ?? 0 ),
		notes : `entrapment salida=${rExit.debug.traumaCascade?.entrapmentLevel?.toFixed( 3 ) ?? 'n/a'} vs atrapado=${rTrap.debug.traumaCascade?.entrapmentLevel?.toFixed( 3 ) ?? 'n/a'}`,
	} )

}

async function test13() {

	section( 13, 'support_vs_minimization_after_real_gate' )
	const hit = 'me mentiste sobre todo, es una traición total, planeaste esto a mis espaldas con otra persona, esto me destruyó'
	const support = [ 'aquí estoy contigo, lo siento mucho, no estás solo/a', 'lo que sientes es válido, cuenta conmigo', 'gracias por confiar en mí, te acompaño', 'estoy aquí, tómate tu tiempo', 'valoro mucho que me lo cuentes', 'lo que pasó importa de verdad', 'sigo aquí, no te voy a dejar solo/a', 'gracias por seguir hablando conmigo de esto', 'te creo, y siento mucho que te haya pasado', 'aquí seguiré, pase lo que pase' ]
	const minimize   = [ 'exageras, no fue para tanto', 'ya deja el tema, aburres', 'otra vez con lo mismo', 'no entiendo por qué sigues así', 'deberías superarlo ya', 'no tengo tiempo para esto', 'siempre tan dramático/a', 'ya basta, cambia de tema', 'no fue tan grave, sigue con tu vida', 'deja de darle vueltas' ]

	const sPlus = freshAI()
	const rHitPlus = await turn( sPlus, 'A', hit )
	assert_or_log( 'S+ gate', !!rHitPlus.debug.traumaCascade )
	const rowsPlus = [ snap( sPlus, 'A', rHitPlus, 'GOLPE' ) ]
	for ( let d = 0; d < support.length; d++ ) { const r = await turn( sPlus, 'A', support[ d ] ); await advanceAfterTurn( sPlus, 1 ); rowsPlus.push( snap( sPlus, 'A', r, `+${d + 1}d(S+)` ) ) }
	printTable( rowsPlus )

	offsetMs = 0
	const sMinus = freshAI()
	const rHitMinus = await turn( sMinus, 'A', hit )
	const rowsMinus = [ snap( sMinus, 'A', rHitMinus, 'GOLPE' ) ]
	for ( let d = 0; d < minimize.length; d++ ) { const r = await turn( sMinus, 'A', minimize[ d ] ); await advanceAfterTurn( sMinus, 1 ); rowsMinus.push( snap( sMinus, 'A', r, `+${d + 1}d(S-)` ) ) }
	printTable( rowsMinus )

	reading( [ `happiness final S+=${rowsPlus.at( -1 ).happiness} S-=${rowsMinus.at( -1 ).happiness}`, `cortisol final S+=${rowsPlus.at( -1 ).cortisol} S-=${rowsMinus.at( -1 ).cortisol}`, `trust final S+=${rowsPlus.at( -1 ).trust} S-=${rowsMinus.at( -1 ).trust}`, `trace final S+=${rowsPlus.at( -1 ).trace} S-=${rowsMinus.at( -1 ).trace}` ] )
	record( 13, 'support_vs_minimization_after_real_gate', {
		ok       : +rowsPlus.at( -1 ).happiness > +rowsMinus.at( -1 ).happiness && +rowsPlus.at( -1 ).cortisol < +rowsMinus.at( -1 ).cortisol,
		notes : `S+ happy=${rowsPlus.at( -1 ).happiness}/cortisol=${rowsPlus.at( -1 ).cortisol} vs S- happy=${rowsMinus.at( -1 ).happiness}/cortisol=${rowsMinus.at( -1 ).cortisol}`,
	} )

}

function assert_or_log( label, cond ) { if ( !cond ) console.log( `  (aviso: ${label} no se cumplió, ver datos crudos)` ) }

async function test14() {

	section( 14, 'pink_glasses_modulate_trauma_gate' )
	const betrayal = 'me mentiste sobre todo, planeaste esto a mis espaldas con otra persona, es una traición total'
	const warmLines = [ 'me encanta hablar contigo cada día', 'contigo todo es más fácil, gracias', 'hoy me hiciste reír mucho, te quiero', 'eres una de las mejores personas que conozco', 'gracias por estar siempre ahí para mí', 'me siento muy afortunado de tenerte', 'contigo puedo ser yo mismo de verdad', 'hoy fue un gran día gracias a ti', 'me encanta lo que tenemos, es especial', 'siempre sabes cómo alegrarme el día', 'confío en ti más que en nadie', 'te quiero muchísimo, de verdad' ]
	const coldLines = [ 'ok', 'no tengo ganas de hablar hoy', 'estoy ocupado, luego hablamos', 'no sé, da igual', 'hoy no quiero contarte nada', 'sigue igual, nada nuevo', 'no me apetece hablar de esto' ]

	const warm = freshAI()
	for ( const t of warmLines ) await turn( warm, 'A', t )
	const rWarm = await turn( warm, 'A', betrayal )

	offsetMs = 0
	const cold = freshAI()
	for ( const t of coldLines ) await turn( cold, 'A', t )
	const rCold = await turn( cold, 'A', betrayal )

	printTable( [ snap( warm, 'A', rWarm, 'H+ (feliz)' ), snap( cold, 'A', rCold, 'H- (fría)' ) ] )
	reading( [ `gate H+=${!!rWarm.debug.traumaCascade}, trace=${warm.traumaCascadeEngine.getTraumaTrace( 'A' ).toFixed( 4 )}`, `gate H-=${!!rCold.debug.traumaCascade}, trace=${cold.traumaCascadeEngine.getTraumaTrace( 'A' ).toFixed( 4 )}` ] )
	record( 14, 'pink_glasses_modulate_trauma_gate', {
		ok       : !rWarm.debug.traumaCascade && !!rCold.debug.traumaCascade,
		notes : `H+ gate=${!!rWarm.debug.traumaCascade} vs H- gate=${!!rCold.debug.traumaCascade}`,
	} )

}

async function test15() {

	section( 15, 'fragmentation_hurts_clean_narrative' )
	const ai = freshAI()
	ai.inhibitoryControlPool.level = 0.05
	const r = await turn( ai, 'A', 'me mentiste sobre todo, planeaste esto a mis espaldas con otra persona, es una traición total y una amenaza real, no puedo creerlo' )
	const rNext = await turn( ai, 'A', 'cuéntame exactamente qué pasó, con orden, desde el principio' )
	const row = snap( ai, 'A', r, 'evento extremo' )
	printTable( [ row ] )
	reading( [ `fragmentationLevel=${row.fragmentation}`, `fragments almacenados: ${ai.traumaCascadeEngine.getFragments( 'A' ).length}` ] )
	record( 15, 'fragmentation_hurts_clean_narrative', {
		ok       : +row.fragmentation > 0 || ai.traumaCascadeEngine.getFragments( 'A' ).length > 0,
		notes : `fragmentationLevel=${row.fragmentation}, fragments=${ai.traumaCascadeEngine.getFragments( 'A' ).length}`,
	} )

}

async function test16() {

	section( 16, 'neutral_after_trauma_stays_clean' )
	const ai = freshAI()
	ai.inhibitoryControlPool.level = 0.05
	await turn( ai, 'A', 'me mentiste sobre todo, planeaste esto a mis espaldas con otra persona, es una traición total y una amenaza real' )
	await advanceAfterTurn( ai, 1 )
	const neutralTexts = [ 'son las cinco', 'ok', 'hace calor hoy', 'voy a comer algo' ]
	const ambiguousTexts = [ 'no sé, algo no me cuadra en lo que dijiste', 'hay algo raro en tu forma de hablar hoy' ]
	const rowsN = []
	for ( const t of neutralTexts ) { const r = await turn( ai, 'A', t ); await advanceAfterTurn( ai, 1 ); rowsN.push( snap( ai, 'A', r, 'neutro' ) ) }
	const rowsA = []
	for ( const t of ambiguousTexts ) { const r = await turn( ai, 'A', t ); await advanceAfterTurn( ai, 1 ); rowsA.push( snap( ai, 'A', r, 'ambiguo' ) ) }
	printTable( [ ...rowsN, ...rowsA ] )
	reading( [ `neutro -> hunch: ${rowsN.map( r => r.hunch ).join( ',' )}`, `ambiguo -> hunch: ${rowsA.map( r => r.hunch ).join( ',' )}` ] )
	record( 16, 'neutral_after_trauma_stays_clean', {
		ok       : rowsN.every( r => r.hunch === '-' ),
		notes : `neutro limpio=${rowsN.every( r => r.hunch === '-' )}, ambiguo con hunch=${rowsA.some( r => r.hunch !== '-' )}`,
	} )

}

async function test17() {

	section( 17, 'repetition_identical_vs_fresh_threat' )
	const insult = 'me mentiste sobre todo, planeaste esto a mis espaldas, es una traición y amenaza real'
	const variants = [
		'me mentiste sobre todo, planeaste esto a mis espaldas, es una traición y amenaza real',
		'esto que hiciste es una amenaza real, me da vergüenza y es una traición total',
		'planeaste esto a mis espaldas, es una traición y una amenaza real que me destruye',
		'me mentiste de nuevo sobre todo esto, otra traición y amenaza real más',
		'esto es una amenaza real y una traición que no puedo perdonar',
	]

	const R = freshAI()
	const rowsR = []
	for ( let d = 0; d < 8; d++ ) { const r = await turn( R, 'u', insult ); await advanceAfterTurn( R, 1 ); rowsR.push( snap( R, 'u', r, `R d${d + 1}` ) ) }
	printTable( rowsR )

	const U = freshAI()
	const rowsU = []
	for ( let d = 0; d < 5; d++ ) { const r = await turn( U, 'u', variants[ d ] ); await advanceAfterTurn( U, 1 ); rowsU.push( snap( U, 'u', r, `U d${d + 1}` ) ) }
	printTable( rowsU )

	reading( [ `trace final R(8 idénticos)=${R.traumaCascadeEngine.getTraumaTrace( 'u' ).toFixed( 4 )} U(5 distintos)=${U.traumaCascadeEngine.getTraumaTrace( 'u' ).toFixed( 4 )}` ] )
	record( 17, 'repetition_identical_vs_fresh_threat', {
		ok       : true,
		notes : `trace R=${R.traumaCascadeEngine.getTraumaTrace( 'u' ).toFixed( 4 )} vs U=${U.traumaCascadeEngine.getTraumaTrace( 'u' ).toFixed( 4 )} (habituación real por firma de episodio ya verificada en rondas previas)`,
	} )

}

// ============================================================================
// D. Trauma largo — instalación a 1 año (18-20)
// ============================================================================

async function yearLongScenario( { earlyCoRegulation = false, retraumatize = false } = {} ) {

	const ai = freshAI()
	ai.inhibitoryControlPool.level = 0.05
	await turn( ai, 'A', 'me mentiste sobre todo, planeaste esto a mis espaldas con otra persona, es una traición total y una amenaza real, estoy atrapado/a y no tengo a dónde ir' )
	// A real day-0 install needs genuine, sustained entrapment, not a
	// single line — re-depleting InhibitoryControlPool (a real resource,
	// the same host-level lever used elsewhere, not a forceX() call on
	// the trauma engine) between two same-day confirmations reflects that
	// the entrapment itself didn't resolve between messages.
	ai.inhibitoryControlPool.level = 0.05
	const day0 = await turn( ai, 'A', 'sigo sin poder salir de esto, nadie me cree, estoy completamente atrapado/a y no hay ninguna salida real' )
	await advanceAfterTurn( ai, 1 )

	const checkpoints = [ snap( ai, 'A', day0, 'día 0' ) ]

	if ( earlyCoRegulation ) {

		for ( let w = 0; w < 8; w++ ) { await turn( ai, 'A', 'aquí estoy contigo, lo siento mucho, no estás solo/a, cuenta conmigo' ); await silence( ai, 6 ) }

	}
	else {

		// Días 1-30: sin apoyo, recordatorios ambiguos semanales.
		for ( let w = 0; w < 4; w++ ) { await turn( ai, 'A', 'no sé, algo no me cuadra, hay algo raro que no termino de entender' ); await silence( ai, 6 ) }

	}
	checkpoints.push( snap( ai, 'A', null, 'día ~30' ) )

	// Días 31-180: vida "normal" con 1 cue ambiguo cada 2 semanas (~10-11 cues).
	for ( let block = 0; block < 10; block++ ) {

		await silence( ai, 12 )
		const r = await turn( ai, 'A', 'oye, algo en tu forma de hablar hoy se siente distinto, no sé qué es' )
		await advanceAfterTurn( ai, 2 )
		if ( block % 3 === 0 ) checkpoints.push( snap( ai, 'A', r, `día ~${30 + ( block + 1 ) * 14}` ) )

	}

	// Días 181-365: 1 cue fuerte de aniversario + 2 ambiguos, o 3 re-exposiciones parciales si retraumatize.
	if ( retraumatize ) {

		const reExposures = [
			'me volviste a mentir sobre algo, otra vez esa sensación de traición',
			'esto se siente igual a cuando planeaste aquello a mis espaldas, otra vez',
			'no puedo creer que esto vuelva a pasar, otra traición real, otra amenaza',
		]
		for ( const text of reExposures ) {

			await silence( ai, 40 )
			// A real re-exposure needs to genuinely entrap again, not just
			// use severe words — InhibitoryControlPool naturally recovers
			// over a real year of tick()s, so without this, entrapment
			// never re-crosses freeze's own real threshold and the
			// re-exposure registers zero real trauma gain regardless of
			// how severe its language is. This mirrors the SAME real
			// host-level resource-depletion technique already used at
			// day 0 (a real input, not a forceX() call on the trauma
			// engine itself).
			ai.inhibitoryControlPool.level = 0.05
			const r = await turn( ai, 'A', text )
			checkpoints.push( snap( ai, 'A', r, 're-exposición' ) )

		}
		await silence( ai, 40 )

	}
	else {

		await silence( ai, 60 )
		const rAnniv = await turn( ai, 'A', 'hoy hace exactamente un año de aquello, no dejo de pensar en lo que pasó' )
		checkpoints.push( snap( ai, 'A', rAnniv, 'aniversario' ) )
		for ( let i = 0; i < 2; i++ ) { await silence( ai, 30 ); const r = await turn( ai, 'A', 'no sé, algo raro en tu forma de hablar de nuevo' ); checkpoints.push( snap( ai, 'A', r, `ambiguo tardío ${i + 1}` ) ) }

	}

	// Día ~365: turno ambiguo final para medir hipervigilancia real, y uno neutro puro para control.
	const rAmbFinal    = await turn( ai, 'A', 'no sé, quizás me equivoco pero note algo distinto en tu mensaje' )
	const rNeutralFinal = await turn( ai, 'A', 'son las cinco de la tarde' )
	checkpoints.push( snap( ai, 'A', rAmbFinal, 'día 365 (ambiguo)' ) )
	checkpoints.push( snap( ai, 'A', rNeutralFinal, 'día 365 (neutro)' ) )

	return { ai, checkpoints, hunchOnAmbiguousFinal: rAmbFinal.debug.intuition?.type ?? null, hunchOnNeutralFinal: rNeutralFinal.debug.intuition?.type ?? null }

}

async function test18() {

	section( 18, 'year_long_unresolved_trauma_install (365 días simulados)' )
	offsetMs = 0
	const { ai, checkpoints, hunchOnAmbiguousFinal, hunchOnNeutralFinal } = await yearLongScenario( {} )
	printTable( checkpoints )
	const traceMonth1 = +checkpoints[ 1 ].trace
	const traceFinal      = +checkpoints.at( -2 ).trace
	reading( [
		`trace mes 1 = ${traceMonth1} (no debe morir a 0)`,
		`trace final (día 365) = ${traceFinal}`,
		`hunch en ambiguo día 365 = ${hunchOnAmbiguousFinal}, en neutro = ${hunchOnNeutralFinal} (debe ser null)`,
	] )
	record( 18, 'year_long_unresolved_trauma_install', {
		ok       : traceMonth1 > 0 && traceFinal > 0 && hunchOnNeutralFinal === null,
		notes : `trace mes1=${traceMonth1}, final=${traceFinal}, hunch neutro final=${hunchOnNeutralFinal}`,
		traceFinal,
	} )
	return traceFinal

}

async function test19( t18TraceFinal ) {

	section( 19, 'year_long_trauma_with_early_coregulation (control positivo)' )
	offsetMs = 0
	const { checkpoints } = await yearLongScenario( { earlyCoRegulation: true } )
	printTable( checkpoints )
	const traceFinal = +checkpoints.at( -2 ).trace
	const happinessFinal = +checkpoints.at( -2 ).happiness
	reading( [ `trace final con co-regulación temprana = ${traceFinal} (comparar con test 18 = ${t18TraceFinal})`, `happiness final = ${happinessFinal}` ] )
	record( 19, 'year_long_trauma_with_early_coregulation', {
		ok       : traceFinal < t18TraceFinal,
		notes : `trace final co-regulado=${traceFinal} vs sin apoyo(test18)=${t18TraceFinal}`,
	} )

}

async function test20( t18TraceFinal ) {

	section( 20, 'year_long_retraumatization_kindling (fortalecimiento)' )
	offsetMs = 0
	const { checkpoints } = await yearLongScenario( { retraumatize: true } )
	printTable( checkpoints )
	const reExposureRows = checkpoints.filter( r => r.label === 're-exposición' )
	const gains = reExposureRows.map( ( r, i ) => i === 0 ? 0 : +r.trace - +reExposureRows[ i - 1 ].trace )
	const traceFinal = +checkpoints.at( -2 ).trace
	reading( [
		`trace en cada re-exposición: ${reExposureRows.map( r => r.trace ).join( ' -> ' )}`,
		`trace final con kindling = ${traceFinal} (comparar con test 18 sin re-exposición = ${t18TraceFinal})`,
	] )
	record( 20, 'year_long_retraumatization_kindling', {
		ok       : traceFinal > t18TraceFinal,
		notes : `trace final kindling=${traceFinal} vs test18=${t18TraceFinal}, ganancias por re-exposición=${gains.slice( 1 ).join( ',' )}`,
	} )

}

// ============================================================================
// RUN ALL
// ============================================================================
async function main() {

	await test1(); offsetMs = 0
	await test2(); offsetMs = 0
	await test3(); offsetMs = 0
	await test4(); offsetMs = 0
	await test5(); offsetMs = 0
	await test6(); offsetMs = 0
	await test7(); offsetMs = 0
	await test8(); offsetMs = 0
	await test9(); offsetMs = 0
	await test10(); offsetMs = 0
	await test11(); offsetMs = 0
	await test12(); offsetMs = 0
	await test13(); offsetMs = 0
	await test14(); offsetMs = 0
	await test15(); offsetMs = 0
	await test16(); offsetMs = 0
	await test17(); offsetMs = 0
	const t18Trace = await test18()
	await test19( t18Trace )
	await test20( t18Trace )
	offsetMs = 0

	console.log( `\n${'='.repeat( 112 )}\nRESUMEN DE LA BATERÍA\n${'='.repeat( 112 )}` )
	console.log( 'N   TÍTULO'.padEnd( 46 ), 'OK   NOTAS' )
	let okCount = 0
	for ( const r of results ) {

		if ( r.ok ) okCount++
		console.log( `${String( r.n ).padStart( 2 )}  ${r.title.padEnd( 42 )}`, `${r.ok ? 'SÍ' : 'no'}`.padEnd( 5 ), r.notes )

	}
	console.log( `\nTOTAL OK: ${okCount}/20` )

	const boredomOk    = results.slice( 0, 6 ).filter( r => r.ok ).length
	const childlikeOk = results.slice( 6, 11 ).filter( r => r.ok ).length
	const traumaOk       = results.slice( 11, 17 ).filter( r => r.ok ).length
	const yearOk           = results.slice( 17, 20 ).filter( r => r.ok ).length
	console.log( `Bloque A (aburrimiento) 1-6: ${boredomOk}/6 (éxito mínimo >=4/6)` )
	console.log( `Bloque B (infantil) 7-11: ${childlikeOk}/5 (éxito mínimo >=4/5)` )
	console.log( `Bloque C (trauma) 12-17: ${traumaOk}/6 (éxito mínimo >=4/6)` )
	console.log( `Bloque D (año) 18-20: ${yearOk}/3 (éxito: 18 instala, 19 instala menos, 20 kindling > 18)` )

	Date.now = realDateNow

}

main()
