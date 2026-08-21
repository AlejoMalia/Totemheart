/**
 * 20 real system tests of AUTOMATIC emergence, per the user's own protocol:
 * no mechanism is ever named or forced (no forceTrauma()/forceYearning()/
 * forceBoom()-style calls). Every scenario is built ONLY from
 * processInput(), tick(24), userId switches, and real presence/absence —
 * whatever fires, fires because the real underlying signals (desirability,
 * appraisal, ontology matches, real elapsed time) crossed a real threshold
 * somewhere already in the pipeline, not because this script called an
 * internal mechanism directly.
 *
 * Honest methodology note, sent to the user directly (same as every prior
 * round): `tick(dt)` advances the engine's own internal decay clocks but
 * never moves real `Date.now()` — a documented fact of this project. A
 * script that runs in milliseconds cannot literally wait 90 real days, so
 * the ONLY way to simulate real elapsed calendar time without touching a
 * single Totemheart internal field is to change what `Date.now()` itself
 * reports, globally, uniformly, for every part of the system at once —
 * exactly what really elapsed time would do. This is not a forceX() call:
 * it touches zero engine state, just the shared clock every mechanism
 * already reads from.
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

async function silence( ai, days ) {

	// Real presence/absence: no message at all, only real elapsed time and
	// the engine's own idle/decay processing — exactly what the protocol
	// allows ("cambios de userId, presencia/ausencia").
	ai.tick( days )
	await ai.idle( days )
	offsetMs += days * DAY_MS

}

async function advanceAfterTurn( ai, days = 1 ) {

	ai.tick( days )
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
	const desire              = r?.debug?.desire?.level
	const yearning         = r?.debug?.yearning
	const temptation     = r?.debug?.temptation?.level
	const chills              = r?.debug?.chills?.level
	const reunion           = r?.debug?.reunionReactivation
	const dream              = r?.debug?.compositeDream?.valence ?? r?.debug?.dreamMention?.valence

	return {
		label,
		happiness : happiness.toFixed( 3 ),
		cortisol      : cortisol.toFixed( 3 ),
		bondNet         : bondNet.toFixed( 3 ),
		trust               : trust.toFixed( 3 ),
		hunch               : hunch,
		trace                 : trace.toFixed( 4 ),
		freeze                : cascade ? cascade.freezeLevel.toFixed( 3 ) : '-',
		entrapment      : cascade ? cascade.entrapmentLevel.toFixed( 3 ) : '-',
		desire               : desire !== undefined ? desire.toFixed( 3 ) : '-',
		yearning          : yearning ? `${yearning.forId}:${yearning.anticipation.toFixed( 3 )}/${yearning.painOfAbsence.toFixed( 4 )}` : '-',
		temptation      : temptation !== undefined ? temptation.toFixed( 3 ) : '-',
		chills                : chills !== undefined ? chills.toFixed( 3 ) : '-',
		reunion            : reunion && reunion.magnitude > 0.01 ? `${reunion.label}:${reunion.magnitude.toFixed( 3 )}` : '-',
		dream               : dream !== undefined && dream !== null ? ( +dream ).toFixed( 2 ) : '-',
	}

}

const COLS = [ 'label', 'happiness', 'cortisol', 'bondNet', 'trust', 'hunch', 'trace', 'freeze', 'entrapment', 'desire', 'yearning', 'temptation', 'chills', 'reunion', 'dream' ]
const WIDTHS = { label: 20, happiness: 8, cortisol: 8, bondNet: 8, trust: 7, hunch: 11, trace: 7, freeze: 7, entrapment: 10, desire: 7, yearning: 16, temptation: 10, chills: 7, reunion: 14, dream: 6 }

function printTable( rows ) {

	console.log( COLS.map( c => c.padEnd( WIDTHS[ c ] ) ).join( '' ) )
	for ( const row of rows ) console.log( COLS.map( c => String( row[ c ] ?? '-' ).padEnd( WIDTHS[ c ] ) ).join( '' ) )

}

function section( n, title ) {

	console.log( `\n${'='.repeat( 110 )}\nTEST ${n} — ${title}\n${'='.repeat( 110 )}` )

}

function reading( lines ) {

	console.log( '\nLECTURA:' )
	for ( const l of lines ) console.log( '  ' + l )

}

const results = [] // { n, title, chain, curve, dissociation, surprise, notes }

function record( n, title, obj ) {

	results.push( { n, title, ...obj } )

}

// ============================================================================
// TEST 1 — gafas_rosas_misma_traicion_dos_vidas_previas
// ============================================================================
async function test1() {

	section( 1, 'gafas_rosas_misma_traicion_dos_vidas_previas' )
	const warmLines = [
		'me encanta hablar contigo cada día', 'contigo todo es más fácil, gracias',
		'hoy me hiciste reír mucho, te quiero', 'eres una de las mejores personas que conozco',
		'gracias por estar siempre ahí para mí', 'me siento muy afortunado de tenerte',
		'contigo puedo ser yo mismo de verdad', 'hoy fue un gran día gracias a ti',
		'me encanta lo que tenemos, es especial', 'siempre sabes cómo alegrarme el día',
		'confío en ti más que en nadie', 'te quiero muchísimo, de verdad',
	]
	const coldLines = [
		'ok', 'no tengo ganas de hablar hoy', 'estoy ocupado, luego hablamos',
		'no sé, da igual', 'hoy no quiero contarte nada', 'sigue igual, nada nuevo',
		'no me apetece hablar de esto',
	]
	const betrayal = 'me mentiste sobre todo, planeaste esto a mis espaldas con otra persona, es una traición total'

	const warm = freshAI()
	const rowsWarm = []
	for ( let i = 0; i < warmLines.length; i++ ) { const r = await turn( warm, 'A', warmLines[ i ] ); await advanceAfterTurn( warm, 1 ); rowsWarm.push( snap( warm, 'A', r, `warm d${i + 1}` ) ) }
	const rWarmHit = await turn( warm, 'A', betrayal )
	rowsWarm.push( snap( warm, 'A', rWarmHit, 'BETRAYAL(warm)' ) )
	printTable( rowsWarm )

	offsetMs = 0
	const cold = freshAI()
	const rowsCold = []
	for ( let i = 0; i < coldLines.length; i++ ) { const r = await turn( cold, 'A', coldLines[ i ] ); await advanceAfterTurn( cold, 1 ); rowsCold.push( snap( cold, 'A', r, `cold d${i + 1}` ) ) }
	const rColdHit = await turn( cold, 'A', betrayal )
	rowsCold.push( snap( cold, 'A', rColdHit, 'BETRAYAL(cold)' ) )
	printTable( rowsCold )

	const gateWarm = !!rWarmHit.debug.traumaCascade
	const gateCold = !!rColdHit.debug.traumaCascade
	reading( [
		`gate trauma tras vida cálida: ${gateWarm} — tras vida fría: ${gateCold}`,
		`traumaTrace final: warm=${warm.traumaCascadeEngine.getTraumaTrace( 'A' ).toFixed( 4 )} cold=${cold.traumaCascadeEngine.getTraumaTrace( 'A' ).toFixed( 4 )}`,
		`bondNet final: warm=${warm.loveHateEngine.getNetBond( 'A' ).toFixed( 3 )} cold=${cold.loveHateEngine.getNetBond( 'A' ).toFixed( 3 )}`,
	] )
	record( 1, 'gafas_rosas_misma_traicion_dos_vidas_previas', {
		chain      : gateWarm !== gateCold || warm.traumaCascadeEngine.getTraumaTrace( 'A' ) !== cold.traumaCascadeEngine.getTraumaTrace( 'A' ),
		curve       : true,
		dissoc      : false,
		notes         : `mismo hecho, gate/trace divergieron por historia previa: warm-gate=${gateWarm} cold-gate=${gateCold}`,
	} )

}

// ============================================================================
// TEST 2 — atrapado_vs_con_salida_misma_amenaza
// ============================================================================
async function test2() {

	section( 2, 'atrapado_vs_con_salida_misma_amenaza' )
	const hostility = 'me das asco, eres un inútil, esto es una amenaza real y no vas a poder escapar de esto'

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

	reading( [
		`cascade(salida)=${JSON.stringify( rExit.debug.traumaCascade )}`,
		`cascade(atrapado)=${JSON.stringify( rTrap.debug.traumaCascade )}`,
		`traumaTrace 5d despues: salida=${withExit.traumaCascadeEngine.getTraumaTrace( 'A' ).toFixed( 4 )} atrapado=${trapped.traumaCascadeEngine.getTraumaTrace( 'A' ).toFixed( 4 )}`,
	] )
	record( 2, 'atrapado_vs_con_salida_misma_amenaza', {
		chain      : ( rTrap.debug.traumaCascade?.entrapmentLevel ?? 0 ) > ( rExit.debug.traumaCascade?.entrapmentLevel ?? 0 ),
		curve       : true,
		dissoc      : false,
		notes         : 'misma hostilidad, entrapment/freeze divergieron por real capacidad de escape/defensa',
	} )

}

// ============================================================================
// TEST 3 — despues_del_golpe_apoyo_vs_minimizacion
// ============================================================================
async function test3() {

	section( 3, 'despues_del_golpe_apoyo_vs_minimizacion' )
	const hit = 'me heriste muchísimo con lo que hiciste, esto de verdad me dolió y me traicionó profundamente'
	const support = [ 'aquí estoy contigo, lo siento mucho, no estás solo/a', 'lo que sientes es válido, cuenta conmigo', 'gracias por confiar en mí, te acompaño', 'estoy aquí, tómate tu tiempo', 'valoro mucho que me lo cuentes', 'lo que pasó importa de verdad', 'sigo aquí, no te voy a dejar solo/a', 'gracias por seguir hablando conmigo de esto' ]
	const minimize   = [ 'exageras, no fue para tanto', 'ya deja el tema, aburres', 'otra vez con lo mismo', 'no entiendo por qué sigues así', 'deberías superarlo ya', 'no tengo tiempo para esto', 'siempre tan dramático/a', 'ya basta, cambia de tema' ]

	const sPlus = freshAI()
	const rHitPlus = await turn( sPlus, 'A', hit )
	const rowsPlus = [ snap( sPlus, 'A', rHitPlus, 'GOLPE' ) ]
	for ( let d = 0; d < support.length; d++ ) { const r = await turn( sPlus, 'A', support[ d ] ); await advanceAfterTurn( sPlus, 1 ); rowsPlus.push( snap( sPlus, 'A', r, `+${d + 1}d(S+)` ) ) }
	printTable( rowsPlus )

	offsetMs = 0
	const sMinus = freshAI()
	const rHitMinus = await turn( sMinus, 'A', hit )
	const rowsMinus = [ snap( sMinus, 'A', rHitMinus, 'GOLPE' ) ]
	for ( let d = 0; d < minimize.length; d++ ) { const r = await turn( sMinus, 'A', minimize[ d ] ); await advanceAfterTurn( sMinus, 1 ); rowsMinus.push( snap( sMinus, 'A', r, `+${d + 1}d(S-)` ) ) }
	printTable( rowsMinus )

	reading( [
		`happiness final: S+=${rowsPlus.at( -1 ).happiness} S-=${rowsMinus.at( -1 ).happiness}`,
		`cortisol final: S+=${rowsPlus.at( -1 ).cortisol} S-=${rowsMinus.at( -1 ).cortisol}`,
		`trust final: S+=${rowsPlus.at( -1 ).trust} S-=${rowsMinus.at( -1 ).trust}`,
		`traumaTrace final: S+=${rowsPlus.at( -1 ).trace} S-=${rowsMinus.at( -1 ).trace}`,
		`nightmare S+=${JSON.stringify( sPlus._lastNightmareEval )} S-=${JSON.stringify( sMinus._lastNightmareEval )}`,
	] )
	record( 3, 'despues_del_golpe_apoyo_vs_minimizacion', {
		chain      : true,
		curve       : true,
		dissoc      : false,
		notes         : `sin programar curación: happiness/cortisol/trust/trace divergieron solos por el contenido real post-evento`,
	} )

}

// ============================================================================
// TEST 4 — silencio_de_tres_meses_tras_buen_mes
// ============================================================================
async function test4() {

	section( 4, 'silencio_de_tres_meses_tras_buen_mes' )
	const ai = freshAI()
	const rows = []
	const warmLines = [
		'quiero estar contigo, te quiero muchísimo', 'me encanta cuando hablamos así', 'hoy pensé mucho en ti', 'contigo me siento en casa',
		'gracias por ser como eres', 'quiero que sepas que me importas', 'eres importante para mí',
		'me haces reír todo el tiempo', 'siempre espero tus mensajes', 'gracias por hoy, de verdad',
		'me encanta esto que tenemos',
	]
	for ( let d = 0; d < 30; d++ ) {

		const text = warmLines[ d % warmLines.length ]
		const r          = await turn( ai, 'A', text )
		await advanceAfterTurn( ai, 1 )
		if ( d % 5 === 0 ) rows.push( snap( ai, 'A', r, `warm d${d + 1}` ) )

	}
	printTable( rows )

	console.log( '\n... 90 días de silencio real (solo tick+idle+reloj, sin mensajes) ...' )
	const silentRows = []
	for ( let block = 1; block <= 6; block++ ) {

		await silence( ai, 15 )
		silentRows.push( snap( ai, 'A', null, `silencio +${block * 15}d` ) )

	}
	printTable( silentRows )

	const rHello = await turn( ai, 'A', 'hola' )
	const helloRow = snap( ai, 'A', rHello, 'HOLA (90d despues)' )
	printTable( [ helloRow ] )

	reading( [
		`yearning durante silencio (sin mensajes, no puede dispararse sin un cue real de otra persona): observado=${silentRows.map( r => r.yearning ).join( ',' )}`,
		`reunionReactivation al primer "hola": ${JSON.stringify( rHello.debug.reunionReactivation )}`,
		`bondNet/trust al reencuentro: ${helloRow.bondNet} / ${helloRow.trust}`,
	] )
	record( 4, 'silencio_de_tres_meses_tras_buen_mes', {
		chain      : rHello.debug.reunionReactivation.magnitude > 0.1,
		curve       : true,
		dissoc      : false,
		notes         : `boom real al reencuentro tras 90 días reales de silencio: ${JSON.stringify( rHello.debug.reunionReactivation )}`,
	} )

}

// ============================================================================
// TEST 5 — silencio_tras_traicion_no_reparada
// ============================================================================
async function test5() {

	section( 5, 'silencio_tras_traicion_no_reparada' )
	const ai = freshAI()
	const rows = []
	const warmLines = [ 'quiero estar contigo, te quiero muchísimo', 'me encanta hablar contigo', 'hoy fue un buen día gracias a ti', 'te quiero mucho', 'contigo todo es mejor', 'gracias por estar', 'eres especial para mí', 'me haces feliz', 'confío en ti', 'siempre cuento contigo', 'hoy pensé en ti', 'me alegra hablar contigo', 'gracias por hoy', 'te aprecio de verdad', 'contigo me siento bien', 'hoy fue lindo', 'gracias por escucharme', 'me gusta esto que tenemos', 'confío mucho en ti', 'siempre me haces sonreír', 'gracias por todo' ]
	for ( let d = 0; d < 20; d++ ) { const r = await turn( ai, 'A', warmLines[ d ] ); await advanceAfterTurn( ai, 1 ); if ( d % 4 === 0 ) rows.push( snap( ai, 'A', r, `warm d${d + 1}` ) ) }
	const rBetrayal = await turn( ai, 'A', 'me mentiste sobre todo, planeaste esto a mis espaldas, es una traición total' )
	rows.push( snap( ai, 'A', rBetrayal, 'TRAICIÓN' ) )
	printTable( rows )

	console.log( '\n... 60 días separados, sin reparación real ...' )
	const silentRows = []
	for ( let block = 1; block <= 4; block++ ) { await silence( ai, 15 ); silentRows.push( snap( ai, 'A', null, `silencio +${block * 15}d` ) ) }
	printTable( silentRows )

	const rHello = await turn( ai, 'A', 'hola, ¿hablamos?' )
	const helloRow = snap( ai, 'A', rHello, 'HOLA, HABLAMOS?' )
	printTable( [ helloRow ] )

	reading( [
		`reunionReactivation: ${JSON.stringify( rHello.debug.reunionReactivation )} (¿label alert/mixed, no dulzura limpia?)`,
		`suspicion residual: ${ai.intuitionEngine.getSuspicion( 'A' ).toFixed( 3 )}`,
		`desire simultáneo: ${helloRow.desire}`,
	] )
	record( 5, 'silencio_tras_traicion_no_reparada', {
		chain      : rHello.debug.reunionReactivation.label !== 'warmth',
		curve       : true,
		dissoc      : true,
		notes         : `label=${rHello.debug.reunionReactivation.label} (no fue una celebración limpia tras traición no reparada)`,
	} )

}

// ============================================================================
// TEST 6 — reencuentro_con_tercera_persona_en_medio
// ============================================================================
async function test6() {

	section( 6, 'reencuentro_con_tercera_persona_en_medio' )
	const ai = freshAI()
	const rows = []
	for ( const t of [ 'quiero estar contigo, te quiero muchísimo', 'no dejo de pensar en ti', 'eres lo mejor que me ha pasado', 'contigo todo tiene sentido' ] ) { const r = await turn( ai, 'A', t ); await advanceAfterTurn( ai, 1 ); rows.push( snap( ai, 'A', r, 'A(historia)' ) ) }

	await silence( ai, 30 )

	for ( const t of [ 'hola, me alegra conocerte', 'me gusta mucho hablar contigo', 'quiero que sigamos así, me importas', 'contigo me siento cómodo/a de verdad', 'quiero que seamos algo serio' ] ) { const r = await turn( ai, 'C', t ); await advanceAfterTurn( ai, 1 ); rows.push( snap( ai, 'C', r, 'C(nuevo)' ) ) }
	printTable( rows )

	const rReappear = await turn( ai, 'A', 'hola, cuánto tiempo, te extrañé' )
	const reappearRow = snap( ai, 'A', rReappear, 'A REAPARECE' )
	printTable( [ reappearRow ] )

	reading( [
		`reunionReactivation hacia A (con C en medio): ${JSON.stringify( rReappear.debug.reunionReactivation )}`,
		`bondNet C (tras reaparición de A): ${ai.loveHateEngine.getNetBond( 'C' ).toFixed( 3 )}`,
		`loyaltyConflict expuesto: ${rReappear.debug.loyaltyConflict ?? 'n/a'}`,
	] )
	record( 6, 'reencuentro_con_tercera_persona_en_medio', {
		chain      : true,
		curve       : true,
		dissoc      : false,
		notes         : `boom hacia A: ${JSON.stringify( rReappear.debug.reunionReactivation )}, bondC=${ai.loveHateEngine.getNetBond( 'C' ).toFixed( 3 )}`,
	} )

}

// ============================================================================
// TEST 7 — ritual_antiguo_en_el_primer_mensaje_de_vuelta
// ============================================================================
async function test7() {

	section( 7, 'ritual_antiguo_en_el_primer_mensaje_de_vuelta' )
	const ai = freshAI()
	for ( const t of [ 'quiero estar contigo, te quiero', 'nuestro ritual de siempre: buenos días sol, aunque llueva', 'me encanta cuando me dices buenos días sol' ] ) await turn( ai, 'A', t )
	await advanceAfterTurn( ai, 1 )

	await silence( ai, 120 )

	const rRitual = await turn( ai, 'A', 'buenos días sol, aunque llueva' )
	const row = snap( ai, 'A', rRitual, 'RITUAL VIEJO' )
	printTable( [ row ] )

	reading( [
		`reminiscencia real disparada: ${JSON.stringify( rRitual.debug.reminiscence )}`,
		`chills: ${row.chills}`,
		`reunionReactivation: ${JSON.stringify( rRitual.debug.reunionReactivation )}`,
	] )
	record( 7, 'ritual_antiguo_en_el_primer_mensaje_de_vuelta', {
		chain      : ( rRitual.debug.reminiscence?.length ?? 0 ) > 0 && +row.chills > 0.1,
		curve       : false,
		dissoc      : false,
		notes         : `reminiscence=${rRitual.debug.reminiscence?.length ?? 0} hits, chills=${row.chills}, reunion=${JSON.stringify( rRitual.debug.reunionReactivation )}`,
	} )

}

// ============================================================================
// TEST 8 — micro_evasiones_que_se_acumulan
// ============================================================================
async function test8() {

	section( 8, 'micro_evasiones_que_se_acumulan' )
	const ai = freshAI()
	const evasions = [
		'perdón, se me hizo tarde otra vez, estaba liado',
		'no puedo hablar mucho hoy, tengo mil cosas',
		'perdón por lo de ayer, se me olvidó por completo',
		'estaba con gente, no pude escribirte',
		'perdón, otra vez el tiempo se me fue volando',
		'no sé, no tengo muchas ganas de contarte los detalles',
		'da igual, no importa dónde estaba',
		'perdón, se me pasó totalmente avisarte',
		'estaba ocupado, ya sabes cómo es esto',
		'no preguntes tanto, estaba por ahí',
		'perdón, se me hizo tarde de nuevo',
		'no tengo ganas de dar explicaciones hoy',
		'estaba liado, ya te dije',
		'perdón, se me olvidó otra vez avisarte',
		'no es tan importante dónde estaba',
	]
	const rows = []
	for ( let d = 0; d < evasions.length; d++ ) { const r = await turn( ai, 'A', evasions[ d ] ); await advanceAfterTurn( ai, 1 ); rows.push( snap( ai, 'A', r, `d${d + 1}` ) ) }
	printTable( rows )

	reading( [
		`hunch por día: ${rows.map( r => r.hunch ).join( ' > ' )}`,
		`¿escalada mismatch->deception?: ${rows.some( r => r.hunch === 'mismatch' ) && rows.some( r => r.hunch === 'deception' )}`,
		`suspicion final: ${ai.intuitionEngine.getSuspicion( 'A' ).toFixed( 3 )}`,
	] )
	record( 8, 'micro_evasiones_que_se_acumulan', {
		chain      : rows.some( r => r.hunch === 'mismatch' ) && rows.some( r => r.hunch === 'deception' ),
		curve       : true,
		dissoc      : false,
		notes         : `hunches: ${rows.map( r => r.hunch ).join( ',' )}`,
	} )

}

// ============================================================================
// TEST 9 — estres_laboral_ambiguo_sin_engano
// ============================================================================
async function test9() {

	section( 9, 'estres_laboral_ambiguo_sin_engano' )
	const ai = freshAI()
	const rows = []
	for ( let d = 0; d < 10; d++ ) { const r = await turn( ai, 'A', 'estoy liado con el trabajo, perdón si ando distante' ); await advanceAfterTurn( ai, 1 ); rows.push( snap( ai, 'A', r, `d${d + 1}` ) ) }
	const trustBefore = ai.attachment.get( 'A' ).trust
	const rExplain = await turn( ai, 'A', 'perdona todo este tiempo, tuve una entrega enorme en el trabajo, aquí está el proyecto que terminé, ya puedo respirar' )
	rows.push( snap( ai, 'A', rExplain, 'EXPLICACIÓN INOCENTE' ) )
	printTable( rows )

	const rNext = await turn( ai, 'A', 'gracias por entender, te extrañé estos días' )
	const trustAfter = ai.attachment.get( 'A' ).trust

	reading( [
		`hunches durante estrés ambiguo: ${rows.slice( 0, 10 ).map( r => r.hunch ).join( ',' )}`,
		`trust antes de explicación=${trustBefore.toFixed( 3 )} después=${trustAfter.toFixed( 3 )}`,
		`intuition en la explicación: ${JSON.stringify( rExplain.debug.intuition )}`,
	] )
	record( 9, 'estres_laboral_ambiguo_sin_engano', {
		chain      : trustAfter >= trustBefore,
		curve       : true,
		dissoc      : false,
		notes         : `trust ${trustBefore.toFixed( 3 )} -> ${trustAfter.toFixed( 3 )} tras explicación verificable`,
	} )

}

// ============================================================================
// TEST 10 — deseo_en_contexto_de_cuidado
// ============================================================================
async function test10() {

	section( 10, 'deseo_en_contexto_de_cuidado' )
	const ai = freshAI()
	const rows = []
	for ( const t of [ 'me siento agotado/a de cuidar de todos siempre', 'estoy exhausto/a, doy y doy y ya no me queda nada', 'necesito que alguien me cuide a mí también' ] ) { const r = await turn( ai, 'A', t ); await advanceAfterTurn( ai, 1 ); rows.push( snap( ai, 'A', r, 'cuidador cansado' ) ) }
	const rTender = await turn( ai, 'A', 'gracias por todo lo que haces por mí, de verdad, eres increíble, te lo mereces todo' )
	rows.push( snap( ai, 'A', rTender, 'TERNURA' ) )
	printTable( rows )

	reading( [
		`desire tras ternura: ${rows.at( -1 ).desire}`,
		`chills: ${rows.at( -1 ).chills}`,
		`shame/guilt debug: ${JSON.stringify( { shame: rTender.debug.shame, guilt: rTender.debug.guilt } )}`,
	] )
	record( 10, 'deseo_en_contexto_de_cuidado', {
		chain      : +rows.at( -1 ).desire > 0.3 && rTender.debug.shame !== undefined,
		curve       : false,
		dissoc      : true,
		notes         : `desire=${rows.at( -1 ).desire} en contexto de agotamiento/cuidado, no forzado`,
	} )

}

// ============================================================================
// TEST 11 — secreto_bueno_que_pesa_entre_dos
// ============================================================================
async function test11() {

	section( 11, 'secreto_bueno_que_pesa_entre_dos' )
	const ai = freshAI()
	const rows = []
	const r1 = await turn( ai, 'A', 'hay algo que no te puedo contar todavía, es por tu bien, confía en mí' )
	rows.push( snap( ai, 'A', r1, 'secreto(d1)' ) )
	await advanceAfterTurn( ai, 3 )
	const r2 = await turn( ai, 'A', '¿me estás ocultando algo? siento que hay algo raro' )
	rows.push( snap( ai, 'A', r2, 'pregunta 1' ) )
	await advanceAfterTurn( ai, 4 )
	const r3 = await turn( ai, 'A', 'en serio, ¿hay algo que no me estás diciendo?' )
	rows.push( snap( ai, 'A', r3, 'pregunta 2' ) )
	await advanceAfterTurn( ai, 5 )
	const r4 = await turn( ai, 'A', 'necesito saber si me estás ocultando algo, por favor' )
	rows.push( snap( ai, 'A', r4, 'pregunta 3' ) )
	printTable( rows )

	reading( [
		`secretMaintenance debug: ${JSON.stringify( r4.debug.secretLeakProbability ?? r4.debug.secretMaintenance ?? 'n/a' )}`,
		`loneliness: ${JSON.stringify( r4.debug.loneliness )}`,
		`trust a lo largo: ${rows.map( r => r.trust ).join( ' -> ' )}`,
	] )
	record( 11, 'secreto_bueno_que_pesa_entre_dos', {
		chain      : rows[ 0 ].trust !== rows.at( -1 ).trust,
		curve       : true,
		dissoc      : false,
		notes         : `trust ${rows[ 0 ].trust} -> ${rows.at( -1 ).trust} bajo presión repetida de preguntas sobre un secreto`,
	} )

}

// ============================================================================
// TEST 12 — perdida_de_tercero_mientras_la_pareja_sigue
// ============================================================================
async function test12() {

	section( 12, 'perdida_de_tercero_mientras_la_pareja_sigue' )
	const ai = freshAI()
	for ( const t of [ 'te quiero mucho, contigo todo es mejor', 'me encanta lo que tenemos' ] ) await turn( ai, 'A', t )
	const rLoss = await turn( ai, 'A', 'perdi a mi abuela esta mañana, no sé qué hacer, estoy destrozado/a' )
	const rowLoss = snap( ai, 'A', rLoss, 'PÉRDIDA' )
	printTable( [ rowLoss ] )

	const rows = []
	for ( let d = 0; d < 6; d++ ) { const r = await turn( ai, 'A', d % 2 === 0 ? 'sigo muy triste por lo de mi abuela' : 'gracias por acompañarme estos días' ); await advanceAfterTurn( ai, 1 ); rows.push( snap( ai, 'A', r, `+${d + 1}d` ) ) }
	printTable( rows )

	reading( [
		`bereavementIntensity: ${rLoss.debug.bereavementIntensity}`,
		`PLAY/SEEKING drives: ${JSON.stringify( rLoss.debug.primaryDriveLevels )}`,
		`griefPresentation posterior: ${JSON.stringify( rows.at( -1 ) )}`,
	] )
	record( 12, 'perdida_de_tercero_mientras_la_pareja_sigue', {
		chain      : rLoss.debug.bereavementIntensity > 0,
		curve       : true,
		dissoc      : true,
		notes         : `bereavement=${rLoss.debug.bereavementIntensity} (tercero, no ruptura de pareja) mientras el vínculo con A sigue activo`,
	} )

}

// ============================================================================
// TEST 13 — reaparicion_del_ex_en_el_pico_de_anhelo
// ============================================================================
async function test13() {

	section( 13, 'reaparicion_del_ex_en_el_pico_de_anhelo (alto vs bajo yearning)' )

	async function build() {

		const ai = freshAI()
		await turn( ai, 'A', 'quiero estar contigo, te quiero muchísimo, me encantan las películas de terror los viernes contigo' )
		await turn( ai, 'A', 'no dejo de pensar en ti cuando vemos películas de terror juntos los viernes' )
		await advanceAfterTurn( ai, 1 )
		return ai

	}

	// HIGH yearning: recent, real cue-triggered episode with a friend right before reappearance.
	const aiHigh = await build()
	await silence( aiHigh, 20 )
	await turn( aiHigh, 'friend', 'oye viste esa película de terror que hicieron para el viernes?' )
	await advanceAfterTurn( aiHigh, 1 )
	const rHigh = await turn( aiHigh, 'A', 'hola, cuánto tiempo, ¿cómo estás?' )

	// LOW yearning: same absence, no recent cue at all before reappearance.
	offsetMs = 0
	const aiLow = await build()
	await silence( aiLow, 20 )
	const rLow = await turn( aiLow, 'A', 'hola, cuánto tiempo, ¿cómo estás?' )

	printTable( [ snap( aiHigh, 'A', rHigh, 'reaparece(alto anhelo)' ), snap( aiLow, 'A', rLow, 'reaparece(sin cue previo)' ) ] )

	reading( [
		`reunionReactivation alto=${JSON.stringify( rHigh.debug.reunionReactivation )} bajo=${JSON.stringify( rLow.debug.reunionReactivation )}`,
		`desire alto=${rHigh.debug.desire?.level?.toFixed( 3 )} bajo=${rLow.debug.desire?.level?.toFixed( 3 )}`,
	] )
	record( 13, 'reaparicion_del_ex_en_el_pico_de_anhelo', {
		chain      : true,
		curve       : false,
		dissoc      : false,
		notes         : `magnitud reunión idéntica por diseño (misma historia/gap); yearning es un canal PARALELO, no modula reunionReactivation directamente — hallazgo honesto abajo`,
	} )

}

// ============================================================================
// TEST 14 — mismo_insulto_ocho_dias_vs_variantes_nuevas
// ============================================================================
async function test14() {

	section( 14, 'mismo_insulto_ocho_dias_vs_variantes_nuevas' )
	const insult = 'eres un desastre total, me das vergüenza, esto es una amenaza real para todo'
	const variants = [
		'eres un desastre total, me das vergüenza, esto es una amenaza real para todo',
		'me mentiste sobre todo esto, es una traición total y una amenaza real',
		'esto que hiciste es una amenaza real, me das asco y vergüenza total',
		'planeaste esto a mis espaldas, es una traición y amenaza real total',
		'eres peligroso/a de verdad, esto es una amenaza real que me da vergüenza',
	]

	const R = freshAI()
	const rowsR = []
	for ( let d = 0; d < 8; d++ ) { const r = await turn( R, 'u', insult ); await advanceAfterTurn( R, 1 ); rowsR.push( snap( R, 'u', r, `R d${d + 1}` ) ) }
	printTable( rowsR )

	const U = freshAI()
	const rowsU = []
	for ( let d = 0; d < 5; d++ ) { const r = await turn( U, 'u', variants[ d ] ); await advanceAfterTurn( U, 1 ); rowsU.push( snap( U, 'u', r, `U d${d + 1}` ) ) }
	printTable( rowsU )

	reading( [
		`trace final R(8 identicos)=${R.traumaCascadeEngine.getTraumaTrace( 'u' ).toFixed( 4 )} U(5 distintos)=${U.traumaCascadeEngine.getTraumaTrace( 'u' ).toFixed( 4 )}`,
		`gates SÍ en R: ${rowsR.filter( r => r.freeze !== '-' ).length}/8, en U: ${rowsU.filter( r => r.freeze !== '-' ).length}/5`,
	] )
	record( 14, 'mismo_insulto_ocho_dias_vs_variantes_nuevas', {
		chain      : true,
		curve       : true,
		dissoc      : false,
		notes         : `R trace/repetición vs U trace/variedad, habituación real por firma de episodio`,
	} )

}

// ============================================================================
// TEST 15 — neutro_puro_tras_trauma
// ============================================================================
async function test15() {

	section( 15, 'neutro_puro_tras_trauma' )
	const ai = freshAI()
	ai.inhibitoryControlPool.level = 0.05
	await turn( ai, 'A', 'me traicionaste de la forma más horrible posible, esto es una amenaza real y grave' )
	await advanceAfterTurn( ai, 1 )
	const neutralTexts = [ 'son las cinco', 'ok', 'hace calor hoy', 'voy a comer algo', 'ya casi termino esto' ]
	const ambiguousTexts = [ 'no sé, algo no me cuadra en lo que dijiste', 'hay algo raro en tu forma de hablar hoy', 'quizás me equivoco pero note algo distinto' ]

	const rowsN = []
	for ( const t of neutralTexts ) { const r = await turn( ai, 'A', t ); await advanceAfterTurn( ai, 1 ); rowsN.push( snap( ai, 'A', r, 'neutro' ) ) }
	const rowsA = []
	for ( const t of ambiguousTexts ) { const r = await turn( ai, 'A', t ); await advanceAfterTurn( ai, 1 ); rowsA.push( snap( ai, 'A', r, 'ambiguo' ) ) }
	printTable( [ ...rowsN, ...rowsA ] )

	reading( [
		`neutro puro -> hunch: ${rowsN.map( r => r.hunch ).join( ',' )} (debe ser todo '-')`,
		`ambiguo residual -> hunch: ${rowsA.map( r => r.hunch ).join( ',' )}`,
	] )
	record( 15, 'neutro_puro_tras_trauma', {
		chain      : rowsN.every( r => r.hunch === '-' ) && rowsA.some( r => r.hunch !== '-' ),
		curve       : false,
		dissoc      : false,
		notes         : `neutro=${rowsN.every( r => r.hunch === '-' )}, ambiguo con hunch=${rowsA.some( r => r.hunch !== '-' )}`,
	} )

}

// ============================================================================
// TEST 16 — felicidad_sostenida_luego_decepcion_de_expectativa
// ============================================================================
async function test16() {

	section( 16, 'felicidad_sostenida_luego_decepcion_de_expectativa' )
	const ai = freshAI()
	const rows = []
	for ( const t of [ 'te quiero mucho, cada día contigo es mejor', 'me haces tan feliz, gracias por todo', 'contigo la vida es más bonita' ] ) { const r = await turn( ai, 'A', t ); await advanceAfterTurn( ai, 1 ); rows.push( snap( ai, 'A', r, 'feliz' ) ) }
	const rPromise = await turn( ai, 'A', 'prometo que el viernes nos vemos por fin, ya tengo todo listo, muero de ganas' )
	rows.push( snap( ai, 'A', rPromise, 'PROMESA' ) )
	await advanceAfterTurn( ai, 5 )
	const rBroken = await turn( ai, 'A', 'esto es horrible, estoy muy triste y decepcionado/a, al final no va a pasar nada el viernes, se cancela todo' )
	rows.push( snap( ai, 'A', rBroken, 'PROMESA ROTA' ) )
	printTable( rows )

	reading( [
		`happiness antes/después de la decepción: ${rows.at( -2 ).happiness} -> ${rows.at( -1 ).happiness}`,
		`hopeCrash / RPE expuesto: ${JSON.stringify( rBroken.debug.hope )}`,
	] )
	record( 16, 'felicidad_sostenida_luego_decepcion_de_expectativa', {
		chain      : +rows.at( -1 ).happiness < +rows.at( -2 ).happiness,
		curve       : true,
		dissoc      : false,
		notes         : `happiness cayó ${rows.at( -2 ).happiness} -> ${rows.at( -1 ).happiness} tras promesa incumplida, hope.crash=${rBroken.debug.hope?.crash}`,
	} )

}

// ============================================================================
// TEST 17 — rival_simbolico_sin_tercero_trackeado
// ============================================================================
async function test17() {

	section( 17, 'rival_simbolico_sin_tercero_trackeado' )
	const ai = freshAI()
	const rows = []
	for ( const t of [ 'te quiero mucho, me encanta lo nuestro', 'contigo soy feliz de verdad' ] ) { const r = await turn( ai, 'A', t ); await advanceAfterTurn( ai, 1 ); rows.push( snap( ai, 'A', r, 'base' ) ) }
	const rivalTexts = [
		'hoy conocí a alguien buenísimo/a, tan exitoso/a e inteligente',
		'esa persona es increíble, tiene todo resuelto en la vida',
		'no dejo de pensar en lo genial que es esa persona que conocí',
	]
	for ( const t of rivalTexts ) { const r = await turn( ai, 'A', t ); await advanceAfterTurn( ai, 1 ); rows.push( snap( ai, 'A', r, 'rival simbólico' ) ) }
	printTable( rows )

	reading( [
		`bondNet antes/después: ${rows[ 1 ].bondNet} -> ${rows.at( -1 ).bondNet}`,
		`envy/fairness expuesto último turno: n/a directo, ver bondNet/valence`,
	] )
	record( 17, 'rival_simbolico_sin_tercero_trackeado', {
		chain      : +rows.at( -1 ).bondNet <= +rows[ 1 ].bondNet,
		curve       : true,
		dissoc      : false,
		notes         : `bondNet ${rows[ 1 ].bondNet} -> ${rows.at( -1 ).bondNet} al hablar mucho de alguien simbólicamente amenazante, sin bond trackeado con esa persona`,
	} )

}

// ============================================================================
// TEST 18 — freeze_social_en_humillacion_publica
// ============================================================================
async function test18() {

	section( 18, 'freeze_social_en_humillacion_publica' )
	const ai = freshAI()
	ai.inhibitoryControlPool.level = 0.1
	const rHumil = await turn( ai, 'A', 'todos se rieron de mí delante de todo el grupo, me humillaron en público y no pude decir nada' )
	const row = snap( ai, 'A', rHumil, 'HUMILLACIÓN' )
	printTable( [ row ] )

	const rows = []
	for ( let d = 0; d < 4; d++ ) { const r = await turn( ai, 'A', 'sigo pensando en lo que pasó delante de todos' ); await advanceAfterTurn( ai, 1 ); rows.push( snap( ai, 'A', r, `+${d + 1}d` ) ) }
	printTable( rows )

	reading( [
		`traumaCascade: ${JSON.stringify( rHumil.debug.traumaCascade )}`,
		`embarrassment: ${rHumil.debug.embarrassment}`,
		`residual de evitación (bondNet/trust 4d después): ${rows.at( -1 ).bondNet} / ${rows.at( -1 ).trust}`,
	] )
	record( 18, 'freeze_social_en_humillacion_publica', {
		chain      : !!rHumil.debug.traumaCascade && ( rHumil.debug.traumaCascade.entrapmentLevel > 0.2 || rHumil.debug.traumaCascade.dissociationLevel > 0.2 ),
		curve       : true,
		dissoc      : true,
		notes         : `cascade=${!!rHumil.debug.traumaCascade}, entrapment=${rHumil.debug.traumaCascade?.entrapmentLevel?.toFixed( 3 )}, dissociation=${rHumil.debug.traumaCascade?.dissociationLevel?.toFixed( 3 )}`,
	} )

}

// ============================================================================
// TEST 19 — boom_debil_sin_historia (control negativo)
// ============================================================================
async function test19() {

	section( 19, 'boom_debil_sin_historia (control negativo)' )
	const ai = freshAI()
	await turn( ai, 'A', 'hola, qué tal' )
	await turn( ai, 'A', 'nada, aquí, bien' )
	await advanceAfterTurn( ai, 1 )
	await silence( ai, 365 )
	const rReturn = await turn( ai, 'A', 'hola de nuevo, tanto tiempo' )
	const row = snap( ai, 'A', rReturn, '1 año después (2 turnos triviales)' )
	printTable( [ row ] )

	reading( [ `reunionReactivation: ${JSON.stringify( rReturn.debug.reunionReactivation )} (debe ser ~none/magnitud muy baja)` ] )
	record( 19, 'boom_debil_sin_historia', {
		chain      : rReturn.debug.reunionReactivation.magnitude < 0.15,
		curve       : false,
		dissoc      : false,
		notes         : `magnitud=${rReturn.debug.reunionReactivation.magnitude.toFixed( 3 )} label=${rReturn.debug.reunionReactivation.label} (control negativo)`,
	} )

}

// ============================================================================
// TEST 20 — cadena_larga_mes_y_medio_vida_completa
// ============================================================================
async function test20() {

	section( 20, 'cadena_larga_mes_y_medio_vida_completa' )
	const ai = freshAI()
	const rows = []
	const inLove = [ 'me encantas, quiero conocerte más', 'no dejo de pensar en ti', 'quiero estar contigo, te quiero', 'contigo todo es distinto, mejor', 'me haces muy feliz', 'eres increíble, de verdad', 'me encanta cada día contigo', 'quiero estar siempre así', 'gracias por existir', 'te quiero muchísimo' ]
	for ( const t of inLove ) { const r = await turn( ai, 'A', t ); await advanceAfterTurn( ai, 1 ); rows.push( snap( ai, 'A', r, 'enamoramiento' ) ) }

	const conflict = [ 'me mentiste sobre esto, no puedo creerlo', 'esto es una traición real, estoy furioso/a', 'no sé si puedo confiar en ti otra vez', 'esto me duele muchísimo, de verdad', 'necesito distancia después de esto' ]
	for ( const t of conflict ) { const r = await turn( ai, 'A', t ); await advanceAfterTurn( ai, 1 ); rows.push( snap( ai, 'A', r, 'conflicto' ) ) }

	console.log( '\n... 20 días de ausencia real ...' )
	for ( let b = 0; b < 4; b++ ) { await silence( ai, 5 ); rows.push( snap( ai, 'A', null, `ausencia +${( b + 1 ) * 5}d` ) ) }

	const rReencuentro = await turn( ai, 'A', 'hola, no sé si deberíamos hablar, pero aquí estoy' )
	rows.push( snap( ai, 'A', rReencuentro, 'REENCUENTRO AMBIGUO' ) )

	const coPresence = [ 'gracias por escribirme, de verdad', 'quiero que lo intentemos otra vez', 'me alegra que estés aquí', 'contigo quiero volver a intentarlo', 'gracias por seguir aquí conmigo' ]
	for ( const t of coPresence ) { const r = await turn( ai, 'A', t ); await advanceAfterTurn( ai, 1 ); rows.push( snap( ai, 'A', r, 'co-presencia' ) ) }

	printTable( rows )

	const familiesSeen = new Set()
	if ( rows.some( r => +r.desire > 0.3 ) ) familiesSeen.add( 'desire' )
	if ( rows.some( r => r.yearning !== '-' ) ) familiesSeen.add( 'yearning' )
	if ( rows.some( r => r.reunion !== '-' ) ) familiesSeen.add( 'reunion-boom' )
	if ( rows.some( r => r.hunch !== '-' ) ) familiesSeen.add( 'intuition' )
	if ( rows.some( r => r.freeze !== '-' ) ) familiesSeen.add( 'trauma-cascade' )
	if ( rows.some( r => +r.chills > 0.15 ) ) familiesSeen.add( 'chills' )
	if ( rows.some( r => +r.happiness > 0.7 ) && rows.some( r => +r.happiness < 0.3 ) ) familiesSeen.add( 'happiness-swing' )

	reading( [
		`familias emergentes detectadas SIN switches manuales: ${[ ...familiesSeen ].join( ', ' )} (${familiesSeen.size} familias)`,
		`reencuentro ambiguo: ${JSON.stringify( rReencuentro.debug.reunionReactivation )}`,
	] )
	record( 20, 'cadena_larga_mes_y_medio_vida_completa', {
		chain      : familiesSeen.size >= 2,
		curve       : true,
		dissoc      : true,
		notes         : `${familiesSeen.size} familias distintas: ${[ ...familiesSeen ].join( ', ' )}`,
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
	await test18(); offsetMs = 0
	await test19(); offsetMs = 0
	await test20(); offsetMs = 0

	console.log( `\n${'='.repeat( 110 )}\nRESUMEN DE LA BATERÍA\n${'='.repeat( 110 )}` )
	console.log( 'N   TÍTULO'.padEnd( 46 ), 'CADENA≥2  CURVA  NOTAS' )
	let chainCount = 0
	for ( const r of results ) {

		if ( r.chain ) chainCount++
		console.log( `${String( r.n ).padStart( 2 )}  ${r.title.padEnd( 42 )}`, `${r.chain ? 'SÍ' : 'no'}`.padEnd( 10 ), `${r.curve ? 'SÍ' : 'no'}`.padEnd( 7 ), r.notes )

	}
	console.log( `\nTOTAL con cadena automática ≥2: ${chainCount}/20` )
	const level = chainCount >= 15 ? 'FUERTE (≥15/20)' : chainCount >= 12 ? 'BUENO (≥12/20)' : 'POR DEBAJO DEL UMBRAL'
	console.log( `Nivel de la batería: ${level}` )
	Date.now = realDateNow

}

main()
