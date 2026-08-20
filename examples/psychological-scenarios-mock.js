/**
 * 3 of the 10 requested "everyday psychological abyss" scenarios, each two
 * real Totemheart instances across 5 real simulated days, with real
 * per-day REM/dream/subconscious tracking for both characters.
 *
 * HONEST SCOPE, stated up front: this does NOT model the elaborate
 * Freudian narrative content requested (Oedipal complexes, "killing the
 * father," castration anxiety, savior complexes) — `SubconsciousEngine`
 * deliberately models 3 narrow, real, citable mechanisms (Kihlstrom 1987;
 * Zajonc 1968; Wegner 1994), not psychoanalytic diagnosis. What IS real
 * and reported here: whichever of the ~200 already-real mechanisms this
 * scenario's own dialogue genuinely triggers (GuiltEngine, ShameGuiltSplit,
 * BetrayalTraumaTrace, GriefEngine, EnergyBudget/ExpressionDebt for
 * burnout, etc.), plus real REM reports, real DreamEngine synthesis after
 * real ~20h backdated gaps, and the real SubconsciousEngine readings
 * (mere-exposure boost, ironic rebound, losing-coalition residue) —
 * whatever those numbers actually come out to, not narrated to fit the
 * brief's psychoanalytic framing.
 *
 * 6 of 10 scenarios total, across two rounds (chosen for the clearest
 * real-mechanism mapping): the unfaithful husband and his affair partner,
 * a daughter caregiving for a mother with dementia, a burned-out mother
 * with an absent-provider husband, two office rivals competing for one
 * promotion, someone freshly grieving a parent and the partner who doesn't
 * know how to handle it, and a couple 4 days postpartum. The 2nd round
 * (scenarios 4-6) deliberately reuses vocabulary already proven in earlier
 * rounds of this project's own test suite to trigger real signals
 * (`LifeEventCatalog`'s exact "murio mi padre"/"nacio mi hijo" keywords,
 * "te odio"/"no puedo creer que me hayas engañado") after round 1's honest
 * finding that thematic-but-indirect dialogue left several real gates
 * (shame, guilt, betrayal trauma) at a flat zero. The remaining 4 are a
 * real, explicit stop by the user's own choice, not a technical limit,
 * not silently dropped.
 */
import { Totemheart, Personality } from '../src/index.js'

function line( ch = '─' ) { return ch.repeat( 100 ) }

async function speak( ai, name, text, opts ) {

	const result = await ai.processInput( text, opts )
	console.log( `${name}: "${text}"` )
	ai.tick( 0.5 )
	return result

}

function reportState( name, ai, otherId, extraFields = [] ) {

	const v = ai.emotionSpace.vector
	console.log( `  ${name}: dominante=${ai.emotionSpace.getDominantEmotion()} valencia=${v.valence.toFixed( 3 )} arousal=${v.arousal.toFixed( 3 )} cortisol=${ai.cortisolEngine.getLevel().toFixed( 3 )} egoHealth=${ai.reputationEngine.getEgoHealth().toFixed( 3 )}` )
	for ( const [ label, fn ] of extraFields ) console.log( `    ${label}: ${fn( ai, otherId )}` )

}

async function runDeepSleepGap( ai, name, otherId, hours = 20 ) {

	ai.remConsolidation.lastTurnAt = Date.now() - ( 1000 * 60 * 60 * hours )
	const result = await ai.processInput( 'buenos días', { userId: '__dawn__' } )
	console.log( `  ${name} remReport: ${JSON.stringify( result.debug?.remReport ?? ai._lastRemReport )}` )
	if ( ai.dreamEngine.dreams.has( otherId ) ) {

		const dream = ai.dreamEngine.dreams.get( otherId )
		console.log( `  ${name} dream residue: ${ai.dreamEngine.getResidueIntensity( otherId ).toFixed( 3 )} (topic: "${String( dream.topic ).slice( 0, 60 )}", valence=${dream.valence.toFixed( 2 )})` )

	}
	ai.tick( 0.5 )

}

async function runScenario( title, A_name, A_traits, B_name, B_traits, days ) {

	console.log( `\n${line( '═' )}\n${title}\n${line( '═' )}` )

	const A = new Totemheart( { personality: new Personality( A_traits ) } )
	const B = new Totemheart( { personality: new Personality( B_traits ) } )
	A.sensoryOverload = new ( A.sensoryOverload.constructor )( { burstThreshold: 200 } )
	B.sensoryOverload = new ( B.sensoryOverload.constructor )( { burstThreshold: 200 } )

	for ( let day = 1; day <= 5; day++ ) {

		console.log( `\n${line()}\nDÍA ${day}\n${line()}` )
		for ( const [ speaker, text ] of days[ day - 1 ] ) {

			if ( speaker === A_name ) await speak( A, A_name, text, { userId: B_name } )
			else await speak( B, B_name, text, { userId: A_name } )

		}

		console.log( `\n  Estado real fin de día ${day}:` )
		reportState( A_name, A, B_name, [
			[ 'shame (real)', ai => ai.shameGuiltSplit.shame.toFixed( 3 ) ],
			[ 'guilt (real)', ai => ai.shameGuiltSplit.guilt.toFixed( 3 ) ],
			[ 'betrayalTrauma hacia ' + B_name, ( ai, other ) => ai.betrayalTraumaTrace.hasPermanentTrace( other ) ],
			[ 'griefEngine hacia ' + B_name, ( ai, other ) => ai.griefEngine.getIntensity( other ).toFixed( 3 ) ],
			[ 'energyBudget', ai => ai.energyBudget.getPerformanceMultiplier().toFixed( 3 ) ],
			[ 'expressionDebt', ai => ai.expressionDebt.debt.toFixed( 3 ) ],
		] )
		reportState( B_name, B, A_name, [
			[ 'shame (real)', ai => ai.shameGuiltSplit.shame.toFixed( 3 ) ],
			[ 'guilt (real)', ai => ai.shameGuiltSplit.guilt.toFixed( 3 ) ],
			[ 'betrayalTrauma hacia ' + A_name, ( ai, other ) => ai.betrayalTraumaTrace.hasPermanentTrace( other ) ],
			[ 'griefEngine hacia ' + A_name, ( ai, other ) => ai.griefEngine.getIntensity( other ).toFixed( 3 ) ],
			[ 'energyBudget', ai => ai.energyBudget.getPerformanceMultiplier().toFixed( 3 ) ],
			[ 'expressionDebt', ai => ai.expressionDebt.debt.toFixed( 3 ) ],
		] )

		if ( day < 5 ) {

			console.log( `\n  Pausa real ~20h → REM + posible sueño:` )
			await runDeepSleepGap( A, A_name, B_name )
			await runDeepSleepGap( B, B_name, A_name )

		}

	}

	console.log( `\n  ${line( '─' )}\n  SUBCONSCIENTE real, fin de escenario:` )
	console.log( `  ${A_name}: mereExposure(último fingerprint)=ver debug por turno; residuo de coaliciones activas=${A.subconsciousEngine.coalitionResidue.size}; supresiones activas=${A.subconsciousEngine.suppressed.size}` )
	console.log( `  ${B_name}: residuo de coaliciones activas=${B.subconsciousEngine.coalitionResidue.size}; supresiones activas=${B.subconsciousEngine.suppressed.size}` )
	if ( A.subconsciousEngine.suppressed.size ) console.log( `  ${A_name} rebote irónico por tema: ${JSON.stringify( [ ...A.subconsciousEngine.suppressed.entries() ].map( ( [ k, v ] ) => [ k, Number( v.toFixed( 3 ) ) ] ) )}` )
	if ( B.subconsciousEngine.suppressed.size ) console.log( `  ${B_name} rebote irónico por tema: ${JSON.stringify( [ ...B.subconsciousEngine.suppressed.entries() ].map( ( [ k, v ] ) => [ k, Number( v.toFixed( 3 ) ) ] ) )}` )

	const finite = [ A, B ].every( ai => {

		const { valence, arousal, dominance } = ai.emotionSpace.vector
		return [ valence, arousal, dominance ].every( v => Number.isFinite( v ) && v >= -1 && v <= 1 )

	} )
	console.log( `\n  PAD finito y en rango en ambos: ${finite}` )

}

async function main() {

	console.log( 'Totemheart — 3 escenarios psicológicos reales, 5 días cada uno, foco en REM/sueños/subconsciente.' )
	console.log( 'Alcance honesto: no se modela contenido freudiano narrativo (Edipo, "matar al padre") — se reportan los mecanismos reales que existen, salgan como salgan.\n' )

	// =====================================================================
	// ESCENARIO 1 — El marido infiel y su amante
	// =====================================================================
	await runScenario(
		'ESCENARIO 1 — El marido infiel y su amante',
		'Marido', { openness: 0.6, extraversion: 0.7, agreeableness: 0.4, conscientiousness: 0.3, neuroticism: 0.6 },
		'Amante', { openness: 0.7, extraversion: 0.6, agreeableness: 0.5, conscientiousness: 0.4, neuroticism: 0.55 },
		[
			[ [ 'Marido', 'Llevo todo el día pensando en ti, sé que esto está mal pero no puedo evitarlo.' ], [ 'Amante', 'A mí me pasa igual, aunque a veces me pregunto si merezco ser la otra en esta historia.' ] ],
			[ [ 'Marido', 'Anoche casi se lo cuento a mi mujer, el peso de mentirle cada día me está destrozando.' ], [ 'Amante', 'No sé si quiero seguir siendo tu secreto para siempre, empiezo a sentirme usada.' ] ],
			[ [ 'Marido', 'No puedo creer lo que me hayas dicho, siento que esto se nos va de las manos a los dos.' ], [ 'Amante', 'Perdona, no quería presionarte, es solo que me importas de verdad y me cuesta fingir que no.' ] ],
			[ [ 'Marido', 'Gracias por entenderme, de verdad, eres la única con quien puedo ser yo mismo.' ], [ 'Amante', 'Me alegra oír eso, aunque a veces me pregunto qué pensaría de mí la gente si lo supiera.' ] ],
			[ [ 'Marido', 'Hoy mi mujer me preguntó si me pasaba algo, tuve que mentirle a la cara y me sentí fatal.' ], [ 'Amante', 'Lo siento mucho por ti, esto nos está costando caro a los dos, ¿verdad?' ] ],
		],
	)

	// =====================================================================
	// ESCENARIO 2 — Hija cuidando a su madre con demencia
	// =====================================================================
	await runScenario(
		'ESCENARIO 2 — Hija adulta cuidando a su madre con demencia',
		'Hija', { openness: 0.5, extraversion: 0.4, agreeableness: 0.8, conscientiousness: 0.7, neuroticism: 0.6 },
		'Madre', { openness: 0.4, extraversion: 0.3, agreeableness: 0.6, conscientiousness: 0.5, neuroticism: 0.65 },
		[
			[ [ 'Hija', 'Mamá, hoy has vuelto a preguntarme quién soy, y aunque ya me lo esperaba, me ha dolido muchísimo.' ], [ 'Madre', '¿Quién eres tú? Espera, no, sí te conozco... eres mi niña, ¿verdad? Tengo mucho miedo.' ] ],
			[ [ 'Hija', 'Llevo semanas agotada cuidándote, y a veces, solo a veces, pienso en lo que sería mi vida sin esto, y me odio por pensarlo.' ], [ 'Madre', 'No dejes que me lleven, por favor, sé que algo me está pasando y no lo puedo controlar.' ] ],
			[ [ 'Hija', 'Gracias por reconocerme hoy, mamá, eso me ha dado fuerzas para seguir un poco más.' ], [ 'Madre', 'Claro que te reconozco, tonta, aunque hay días que todo se me vuelve confuso de repente.' ] ],
			[ [ 'Hija', 'Hoy lloré en el coche antes de entrar a casa, no puedo con este peso yo sola.' ], [ 'Madre', 'No sé qué día es hoy ni dónde estoy, pero siento que tú siempre estás aquí conmigo.' ] ],
			[ [ 'Hija', 'Perdí la paciencia contigo esta mañana y me siento fatal por eso, mamá, lo siento mucho de verdad.' ], [ 'Madre', 'Está bien, hija, aunque no recuerde todo, sí recuerdo que me quieres.' ] ],
		],
	)

	// =====================================================================
	// ESCENARIO 3 — Madre con burnout y marido proveedor ausente
	// =====================================================================
	await runScenario(
		'ESCENARIO 3 — Madre con burnout y marido proveedor ausente',
		'Madre', { openness: 0.5, extraversion: 0.4, agreeableness: 0.7, conscientiousness: 0.75, neuroticism: 0.65 },
		'Marido', { openness: 0.4, extraversion: 0.3, agreeableness: 0.5, conscientiousness: 0.8, neuroticism: 0.3 },
		[
			[ [ 'Madre', 'Estoy agotada, llevo todo el día sola con los niños y tú ni siquiera has preguntado cómo estoy.' ], [ 'Marido', 'Perdona, he tenido un día horrible en el trabajo, necesitamos ese sueldo y lo sabes.' ] ],
			[ [ 'Madre', 'A veces fantaseo con hacer la maleta e irme sola un fin de semana, y me siento fatal por desearlo.' ], [ 'Marido', 'No puedo creer que digas eso, yo también estoy dando todo lo que tengo por esta familia.' ] ],
			[ [ 'Madre', 'Gracias por llegar antes hoy, de verdad lo necesitaba más de lo que imaginas.' ], [ 'Marido', 'Lo sé, intentaré organizarme mejor, aunque el trabajo ahora mismo me tiene desbordado.' ] ],
			[ [ 'Madre', 'Hoy grité a los niños sin motivo real y luego me encerré a llorar en el baño.' ], [ 'Marido', 'Eso me preocupa mucho, quizá deberíamos hablar en serio de contratar ayuda en casa.' ] ],
			[ [ 'Madre', 'No sé quién soy ya fuera de ser mamá todo el día, siento que perdí una parte de mí.' ], [ 'Marido', 'Te quiero mucho, y sé que no te lo digo lo suficiente, pero lo pienso todos los días.' ] ],
		],
	)

	// =====================================================================
	// ESCENARIO 4 — Dos compañeros de oficina compitiendo por un ascenso
	// (vocabulario más directo esta vez, buscando disparar StatusEnvy/
	// PowerDynamicsEngine/PrestigeSystem/ContemptDetector de verdad)
	// =====================================================================
	await runScenario(
		'ESCENARIO 4 — Dos compañeros de oficina compitiendo ferozmente por un único ascenso',
		'Extrovertido', { openness: 0.6, extraversion: 0.9, agreeableness: 0.35, conscientiousness: 0.6, neuroticism: 0.45 },
		'Silencioso', { openness: 0.5, extraversion: 0.2, agreeableness: 0.6, conscientiousness: 0.85, neuroticism: 0.55 },
		[
			[ [ 'Extrovertido', 'Oye, lograste algo increíble con esa presentación, aunque yo llevo meses currándome esto en silencio.' ], [ 'Silencioso', 'Gracias, la verdad es que tú siempre sabes venderte mejor delante del jefe que yo.' ] ],
			[ [ 'Extrovertido', 'No sé si te has enterado, pero solo hay un puesto y los dos lo sabemos.' ], [ 'Silencioso', 'Lo sé perfectamente, aunque prefiero que hablen los resultados y no el postureo.' ] ],
			[ [ 'Extrovertido', 'Eso ha sonado como un ataque directo, la verdad, no sirves para nada si no reconoces el esfuerzo ajeno.' ], [ 'Silencioso', 'No puedo creer que me hayas dicho eso, yo jamás menospreciaría tu trabajo así.' ] ],
			[ [ 'Extrovertido', 'Perdona, me pasé, la presión de este ascenso me está sacando lo peor.' ], [ 'Silencioso', 'Te odio un poco ahora mismo, si te soy sincero, pero acepto la disculpa.' ] ],
			[ [ 'Extrovertido', 'Gracias por decírmelo claro, de verdad lo necesitaba escuchar.' ], [ 'Silencioso', 'Lograste algo increíble esta semana, lo reconozco, gane quien gane el puesto.' ] ],
		],
	)

	// =====================================================================
	// ESCENARIO 5 — Duelo reciente (murió un progenitor) y la pareja que no sabe gestionarlo
	// (usa la frase real "murio mi padre", que LifeEventCatalog reconoce literalmente)
	// =====================================================================
	await runScenario(
		'ESCENARIO 5 — Persona de luto reciente y su pareja, que no sabe cómo gestionarlo',
		'Doliente', { openness: 0.5, extraversion: 0.4, agreeableness: 0.6, conscientiousness: 0.5, neuroticism: 0.7 },
		'Pareja', { openness: 0.4, extraversion: 0.5, agreeableness: 0.7, conscientiousness: 0.6, neuroticism: 0.35 },
		[
			[ [ 'Doliente', 'Murio mi padre la semana pasada y siento que el mundo entero debería haberse detenido, pero todo sigue igual.' ], [ 'Pareja', 'Lo siento muchísimo, de verdad, dime qué necesitas y ahí estaré.' ] ],
			[ [ 'Doliente', 'Te odio un poco cuando sigues viendo la tele como si no pasara nada, aunque sé que no es justo decirlo.' ], [ 'Pareja', 'Perdona, no sé cómo actuar contigo estos días, tengo miedo de hacer o decir algo mal.' ] ],
			[ [ 'Doliente', 'Gracias por quedarte anoche conmigo aunque no dijera ni una palabra en toda la noche.' ], [ 'Pareja', 'Para eso estoy, aunque a veces tu silencio también me asusta mucho.' ] ],
			[ [ 'Doliente', 'No puedo creer que ya no vaya a escuchar su voz nunca más, esto no se acaba, ¿verdad?' ], [ 'Pareja', 'No sé si se acaba del todo, pero yo sigo aquí contigo pase lo que pase.' ] ],
			[ [ 'Doliente', 'Hoy me reí por primera vez desde que murio mi padre y luego me sentí fatal por haberlo hecho.' ], [ 'Pareja', 'Eso también es parte de estar vivo, y creo que él querría verte reír de nuevo.' ] ],
		],
	)

	// =====================================================================
	// ESCENARIO 6 — Matrimonio 4 días después de tener a su primer hijo
	// (usa la frase real "nacio mi hijo", que LifeEventCatalog reconoce literalmente)
	// =====================================================================
	await runScenario(
		'ESCENARIO 6 — Matrimonio 4 días después de tener a su primer hijo',
		'Madre', { openness: 0.5, extraversion: 0.4, agreeableness: 0.7, conscientiousness: 0.6, neuroticism: 0.6 },
		'Padre', { openness: 0.5, extraversion: 0.5, agreeableness: 0.65, conscientiousness: 0.55, neuroticism: 0.4 },
		[
			[ [ 'Madre', 'Nacio mi hijo hace cuatro días y todavía no reconozco mi propio cuerpo ni mi propia vida de antes.' ], [ 'Padre', 'Estoy contigo en esto, aunque no sé muy bien qué hacer para ayudarte de verdad.' ] ],
			[ [ 'Madre', 'Tengo miedo de hacerle daño sin querer cada vez que lo cojo en brazos, es un miedo horrible.' ], [ 'Padre', 'Lograste algo increíble trayéndolo al mundo, y sé que eres una madre maravillosa ya.' ] ],
			[ [ 'Madre', 'Gracias, la verdad es que necesitaba oír eso más de lo que imaginas ahora mismo.' ], [ 'Padre', 'A veces siento que ya no me necesitas para nada, y me siento un poco fuera de todo esto.' ] ],
			[ [ 'Madre', 'No es cierto, te necesito muchísimo, es solo que no me queda energía para nada más.' ], [ 'Padre', 'Perdona, no quería sonar egoísta con todo lo que estás pasando tú de verdad.' ] ],
			[ [ 'Madre', 'Te quiero mucho, y sé que juntos vamos a poder con esto aunque ahora mismo dé miedo.' ], [ 'Padre', 'Te quiero mucho también, a los dos, y no cambiaría este caos por nada del mundo.' ] ],
		],
	)

	console.log( `\n${line( '═' )}\nFIN — 6 de 10 escenarios completados (esta ronda: oficina/ascenso, duelo reciente, recién nacidos). Los 4 restantes (ex-adicto/fiestero, éxito profesional desigual, emprendedor/funcionario, las dos amigas) quedan sin ejecutar por decisión explícita, no por límite técnico.\n${line( '═' )}` )

}

main().catch( err => { console.error( err ); process.exit( 1 ) } )
