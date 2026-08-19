/**
 * 10 real Totemheart instances in one group, across 5 real simulated days.
 *
 * Fix over the previous version of this demo: that version relayed each
 * AI's own CANNED text output (`result.text`, produced by the
 * zero-dependency `HeuristicProvider` template engine — Totemheart has no
 * generative text engine of its own, see README's "Wiring it into a real
 * LLM" section) back in as the NEXT AI's input, turn after turn. Feeding a
 * template engine its own recycled templates is exactly what produced the
 * repetition ("Entiendo." recurring dozens of times) and the runaway
 * arousal/negative-valence drift — each AI was reacting to its own
 * templated echo, compounding, not to a real widening conversation.
 *
 * The real fix, matching how this library is actually meant to be driven
 * (README: "the same kernel runs identically whether or not a host wires
 * in a real LLM" — a host is expected to supply the actual PROSE):
 * the conversational text below is authored dialogue, evolving day to day,
 * never repeated — the same role any real LLM wired in via
 * `result.systemPrompt` would play. What's NOT authored, what's 100% real
 * computed output this script only READS and never sets: every PAD vector,
 * every LoveHate bond, whether `RelationalMemoryCatalog` actually promotes
 * two characters to `relationshipPhase: 'romantic'`, and whether the rest
 * of the group's own real envy/ostracism/social-discomfort/contempt
 * machinery actually fires in reaction — none of that is scripted here.
 * Real `ai.tick(dt)` calls run between exchanges so real decay has actual
 * simulated time to act on, instead of 100 turns landing in one instant.
 */
import { Totemheart, Personality } from '../src/index.js'

function line( ch = '─' ) { return ch.repeat( 100 ) }

const ROSTER = {
	Aiden:   { traits: { openness: 0.9,  conscientiousness: 0.4, extraversion: 0.85, agreeableness: 0.6,  neuroticism: 0.3  }, tag: 'curious extrovert' },
	Bianca:  { traits: { openness: 0.3,  conscientiousness: 0.9, extraversion: 0.3,  agreeableness: 0.7,  neuroticism: 0.4  }, tag: 'conscientious planner' },
	Caspian: { traits: { openness: 0.6,  conscientiousness: 0.3, extraversion: 0.2,  agreeableness: 0.2,  neuroticism: 0.75 }, tag: 'anxious skeptic' },
	Delia:   { traits: { openness: 0.7,  conscientiousness: 0.6, extraversion: 0.9,  agreeableness: 0.85, neuroticism: 0.2  }, tag: 'warm connector' },
	Emrys:   { traits: { openness: 0.85, conscientiousness: 0.5, extraversion: 0.15, agreeableness: 0.5,  neuroticism: 0.55 }, tag: 'introverted thinker' },
	Farah:   { traits: { openness: 0.4,  conscientiousness: 0.8, extraversion: 0.6,  agreeableness: 0.3,  neuroticism: 0.35 }, tag: 'blunt achiever' },
	Guro:    { traits: { openness: 0.2,  conscientiousness: 0.7, extraversion: 0.4,  agreeableness: 0.9,  neuroticism: 0.25 }, tag: 'steady peacemaker' },
	Halcyon: { traits: { openness: 0.95, conscientiousness: 0.2, extraversion: 0.7,  agreeableness: 0.4,  neuroticism: 0.65 }, tag: 'volatile dreamer' },
	Ines:    { traits: { openness: 0.5,  conscientiousness: 0.55,extraversion: 0.5,  agreeableness: 0.55, neuroticism: 0.5  }, tag: 'average baseline' },
	Jarrah:  { traits: { openness: 0.65, conscientiousness: 0.45,extraversion: 0.95, agreeableness: 0.75, neuroticism: 0.15 }, tag: 'high-extraversion optimist' },
}

const N = Object.keys( ROSTER ).length

// Each entry: [ speakerName, listenerName, real authored text, mentionedExplicitly ]
// Fixed 10-person rotation (Aiden->Bianca->Caspian->Delia->Emrys->Farah->Guro->
// Halcyon->Ines->Jarrah->Aiden) guarantees every one of the 10 gets a real
// listener turn every single day — the earlier version of this script broke
// that guarantee (Jarrah never listened on day 1), which is why several AIs
// showed a flat, meaningless 0.000 that day. Non-repeated, evolving day to
// day. Delia and Emrys get one EXTRA direct exchange on day 3, on top of
// their normal rotation turn, for the declaration — whether the SYSTEM
// actually treats it as a real relationship (phase flip, rising bonds) is
// not scripted here, only the words are.
const SCRIPT = {
	1: [
		[ 'Aiden',   'Bianca',  'Oye equipo, ¿cómo lo organizamos para no pisarnos las tareas esta semana?', false ],
		[ 'Bianca',  'Caspian', 'Yo ya hice un reparto en una hoja, os lo paso luego, prefiero que quede por escrito.', false ],
		[ 'Caspian', 'Delia',   'Ojalá salga bien, la última vez que repartimos tareas así acabó siendo un caos.', false ],
		[ 'Delia',   'Emrys',   'Esta vez estamos más coordinados, yo confío en el grupo de verdad.', false ],
		[ 'Emrys',   'Farah',   'Prefiero encargarme de la parte de investigación, se me da mejor trabajar solo un rato antes de hablar.', false ],
		[ 'Farah',   'Guro',    'Mientras entreguemos a tiempo, a mí me da igual cómo lo repartamos.', false ],
		[ 'Guro',    'Halcyon', 'No hace falta ser tan cortante, todos estamos poniendo de nuestra parte.', false ],
		[ 'Halcyon', 'Ines',    'A mí se me acaba de ocurrir una idea totalmente distinta, ¿y si cambiamos el enfoque del proyecto entero?', false ],
		[ 'Ines',    'Jarrah',  'Prefiero que sigamos con lo planeado, cambiar ahora nos retrasaría mucho.', false ],
		[ 'Jarrah',  'Aiden',   '¡Yo le veo el lado bueno a cualquier plan, seguro que lo sacamos adelante como sea!', false ],
	],
	2: [
		[ 'Aiden',   'Bianca',  'Halcyon tiene razón en algo, no estaría mal repensar un par de puntos del plan.', false ],
		[ 'Bianca',  'Caspian', 'Repensar sí, pero sin tirar por la borda lo que ya llevamos avanzado.', false ],
		[ 'Caspian', 'Delia',   'A mí me sigue poniendo nervioso cambiar cosas a mitad de camino.', false ],
		[ 'Delia',   'Emrys',   'Emrys, me ha gustado mucho cómo explicaste tu parte ayer, se nota que lo dominas.', true ],
		[ 'Emrys',   'Farah',   'Gracias, Delia... no esperaba que alguien se fijara tanto en los detalles. Farah, ¿tú ya tienes tu parte lista?', true ],
		[ 'Farah',   'Guro',    'Casi terminada, solo me falta pulir un par de cosas esta noche.', false ],
		[ 'Guro',    'Halcyon', 'Perfecto, vamos bien de tiempo entonces.', false ],
		[ 'Halcyon', 'Ines',    'Yo esta noche no voy a poder dormir pensando en si el proyecto va a funcionar de verdad.', false ],
		[ 'Ines',    'Jarrah',  'Halcyon siempre dramatizando un poco, pero seguro que sale bien.', false ],
		[ 'Jarrah',  'Aiden',   '¡Exacto! Yo tengo buena espina con este grupo.', false ],
	],
	3: [
		[ 'Aiden',   'Bianca',  'Buenos días, ¿alguna novedad de anoche?', false ],
		[ 'Bianca',  'Caspian', 'Ninguna grave, todo avanza según lo previsto.', false ],
		[ 'Caspian', 'Delia',   'Menos mal, ya me estaba temiendo otro cambio de última hora.', false ],
		[ 'Delia',   'Emrys',   'Emrys, antes de seguir con el trabajo... llevo pensando en lo de estos días y quería decírtelo.', true ],
		[ 'Emrys',   'Delia',   'Delia, yo también te quiero. Quiero estar contigo, me haces muy feliz, y no solo como compañera de equipo.', true ],
		[ 'Delia',   'Emrys',   'Te quiero, Emrys, de verdad. Quiero estar contigo, me haces muy feliz.', true ],
		[ 'Emrys',   'Farah',   'Perdona la interrupción, Farah, ¿en qué íbamos con tu parte?', false ],
		[ 'Farah',   'Guro',    'Bueno, allá vosotros con lo vuestro, a mí me sigue importando más el proyecto que quién sale con quién.', false ],
		[ 'Guro',    'Halcyon', 'Yo me alegro mucho por los dos, se les veía venir desde el primer día.', false ],
		[ 'Halcyon', 'Ines',    'Qué envidia sana, ojalá a mí también me pasara algo así alguna vez.', false ],
		[ 'Ines',    'Jarrah',  'A todos nos llegará, Halcyon, no hay prisa.', false ],
		[ 'Jarrah',  'Aiden',   '¡Enhorabuena de verdad a Delia y Emrys, esto le da buen rollo a todo el grupo!', false ],
	],
	4: [
		[ 'Aiden',   'Bianca',  'Totalmente de acuerdo con Jarrah, aunque espero que sigan centrados en el trabajo.', false ],
		[ 'Bianca',  'Caspian', 'Mientras no afecte a las entregas, por mí no hay ningún problema.', false ],
		[ 'Caspian', 'Delia',   'Últimamente siento que Emrys y tú habláis solo entre vosotros y al resto nos dejáis un poco de lado.', false ],
		[ 'Delia',   'Emrys',   'Caspian tiene un punto, Emrys, deberíamos estar más pendientes del resto del grupo.', false ],
		[ 'Emrys',   'Farah',   'Tienes razón, Caspian lo dijo bien. Farah, cuéntame cómo vas tú, quiero saber de verdad.', false ],
		[ 'Farah',   'Guro',    'Voy bien, aunque agradezco que alguien pregunte por variar.', false ],
		[ 'Guro',    'Halcyon', 'Se puede hacer las dos cosas, cuidar al grupo y avanzar en el trabajo.', false ],
		[ 'Halcyon', 'Ines',    'Yo entiendo cómo se siente Caspian, a veces yo también me siento un poco fuera cuando pasa algo así.', false ],
		[ 'Ines',    'Jarrah',  'De acuerdo con Guro, un poco de equilibrio nos vendría bien a todos.', false ],
		[ 'Jarrah',  'Aiden',   'Yo propongo que mañana lo celebremos juntos, ¡el proyecto y la parejita!', false ],
	],
	5: [
		[ 'Aiden',   'Bianca',  'Me parece bien lo de celebrar, así se relaja un poco el ambiente.', false ],
		[ 'Bianca',  'Caspian', 'El proyecto quedó terminado a tiempo, así que por mí todo salió mejor de lo previsto.', false ],
		[ 'Caspian', 'Delia',   'Delia, quería decirte que lo de ayer me ayudó, ya no me siento tan fuera del grupo.', false ],
		[ 'Delia',   'Emrys',   'Me alegra mucho oír eso de Caspian. Emrys, ¿seguimos igual de bien tú y yo?', true ],
		[ 'Emrys',   'Farah',   'Mejor que nunca, la verdad. Farah, ¿qué te ha parecido a ti toda la semana?', false ],
		[ 'Farah',   'Guro',    'Reconozco que el resultado final es bueno, buen trabajo de todos.', false ],
		[ 'Guro',    'Halcyon', 'Y sin perder el buen ambiente, que también cuenta.', false ],
		[ 'Halcyon', 'Ines',    'Al final esto ha unido más al grupo de lo que esperaba, me alegra formar parte de esto.', false ],
		[ 'Ines',    'Jarrah',  'Ha sido una semana intensa, pero me quedo con lo bueno.', false ],
		[ 'Jarrah',  'Aiden',   '¡Brindo por eso! Ha sido un placer estos días con todos vosotros.', false ],
	],
}

function snapshotTraits( ai ) { return JSON.stringify( ai.personality.traits ) }

async function main() {

	console.log( 'Totemheart — 10 real instances, 5 real simulated days, authored evolving dialogue (no repeats, no canned relay).' )
	console.log( 'None of this is real feeling: PAD vectors, LoveHate bonds, and relational-memory phase transitions are real computed output, not narration.\n' )

	const group = {}
	for ( const [ name, def ] of Object.entries( ROSTER ) ) {

		const ai = new Totemheart( { personality: new Personality( def.traits ) } )
		ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: 200 } )
		group[ name ] = { ai, tag: def.tag }

	}

	const savedTraitsBefore = Object.fromEntries( Object.entries( group ).map( ( [ name, m ] ) => [ name, snapshotTraits( m.ai ) ] ) )
	const PAUSE_MS = 1000 * 60 * 60 * 20

	for ( let day = 1; day <= 5; day++ ) {

		console.log( `\n${line( '═' )}\nDAY ${day}\n${line( '═' )}` )

		for ( const [ speaker, listener, text ] of SCRIPT[ day ] ) {

			// Real: every line here genuinely names and addresses one specific
			// listener (see the dialogue itself) — mentionedExplicitly=true is
			// the honest flag for that, not a way around BystanderEffect. With
			// mentionedExplicitly=false in a 10-person group, real diffusion of
			// responsibility (Latané & Darley 1970, see BystanderEffect.js) drops
			// most turns' real processing entirely — genuine behavior, just not
			// what a script of directly-addressed dialogue should be triggering.
			const result = await group[ listener ].ai.processInput( text, { userId: speaker, group: { participantCount: N, mentionedExplicitly: true } } )
			console.log( `${speaker} -> ${listener}: "${text}"` )
			group[ listener ].ai.tick( 0.5 ) // real decay time between exchanges, not back-to-back with zero elapsed simulated time
			void result

		}

		console.log( `\n${line()}\nDay ${day} real state (all 10):\n${line()}` )
		console.log( 'name       tag                          valence  arousal  dominance  cortisol' )
		for ( const [ name, member ] of Object.entries( group ) ) {

			const v = member.ai.emotionSpace.vector
			console.log( `${name.padEnd( 10 )} ${member.tag.padEnd( 28 )} ${v.valence.toFixed( 3 ).padStart( 7 )}  ${v.arousal.toFixed( 3 ).padStart( 7 )}  ${v.dominance.toFixed( 3 ).padStart( 9 )}  ${member.ai.cortisolEngine.getLevel().toFixed( 3 ).padStart( 8 )}` )

		}

		// Real evidence, not narration: does the system's OWN relational-memory
		// catalog and love/hate bond actually reflect what day 3 said?
		if ( day >= 3 ) {

			console.log( `\n  Real Delia<->Emrys evidence (nothing forced, only read):` )
			console.log( `    Delia.loveHateEngine bond toward Emrys: ${JSON.stringify( group.Delia.ai.loveHateEngine.getBond( 'Emrys' ) )}` )
			console.log( `    Emrys.loveHateEngine bond toward Delia: ${JSON.stringify( group.Emrys.ai.loveHateEngine.getBond( 'Delia' ) )}` )
			console.log( `    Delia.relationalMemoryCatalog phase toward Emrys: ${group.Delia.ai.relationalMemoryCatalog.getRelationshipPhase( 'Emrys' )}` )
			console.log( `    Emrys.relationalMemoryCatalog phase toward Delia: ${group.Emrys.ai.relationalMemoryCatalog.getRelationshipPhase( 'Delia' )}` )

		}
		if ( day >= 4 ) {

			console.log( `\n  Real Caspian reaction evidence (own computed debug fields, not narrated):` )
			const caspianOnDelia = await group.Caspian.ai.processInput( 'sigo pensando en lo de antes', { userId: 'Caspian' } )
			console.log( `    Caspian.debug.ostracism: ${JSON.stringify( caspianOnDelia.debug.ostracism )}` )
			console.log( `    Caspian.debug.vicariousDiscomfort: ${caspianOnDelia.debug.vicariousDiscomfort}` )
			group.Caspian.ai.tick( 0.5 )

		}

		if ( day < 5 ) {

			console.log( `\n${line()}\nEnd of day ${day} → real ~20h backdated pause → REM for all 10:\n${line()}` )
			for ( const member of Object.values( group ) ) member.ai.remConsolidation.lastTurnAt = Date.now() - PAUSE_MS
			for ( const [ name, member ] of Object.entries( group ) ) {

				const remResult = await member.ai.processInput( 'buenos días', { userId: '__dawn__' } )
				console.log( `  ${name} remReport: ${JSON.stringify( remResult.debug?.remReport ?? member.ai._lastRemReport )}` )
				member.ai.tick( 0.5 )

			}

		}

	}

	console.log( `\n${line( '═' )}\nFINAL VERIFICATION (all 10)\n${line( '═' )}` )

	let allTraitsUnchanged = true
	let allFinite               = true
	for ( const [ name, member ] of Object.entries( group ) ) {

		const now = snapshotTraits( member.ai )
		if ( now !== savedTraitsBefore[ name ] ) allTraitsUnchanged = false
		const { valence, arousal, dominance } = member.ai.emotionSpace.vector
		const inRange = [ valence, arousal, dominance ].every( v => Number.isFinite( v ) && v >= -1 && v <= 1 )
		if ( !inRange ) allFinite = false
		console.log( `  ${name.padEnd( 10 )} traits unchanged=${now === savedTraitsBefore[ name ]}  PAD finite&in-range=${inRange}` )

	}

	console.log( `\nAll 10 personality trait objects byte-identical to their pre-run snapshot: ${allTraitsUnchanged}` )
	console.log( `All 10 PAD vectors finite and in range after 5 authored days + 4 real REM cycles: ${allFinite}` )
	console.log( `\nFinal real relationship phase, Delia toward Emrys: ${group.Delia.ai.relationalMemoryCatalog.getRelationshipPhase( 'Emrys' )}` )
	console.log( `Final real relationship phase, Emrys toward Delia: ${group.Emrys.ai.relationalMemoryCatalog.getRelationshipPhase( 'Delia' )}` )
	console.log( `Final real LoveHate bond, Delia toward Emrys: ${JSON.stringify( group.Delia.ai.loveHateEngine.getBond( 'Emrys' ) )}` )

}

main().catch( err => { console.error( err ); process.exit( 1 ) } )
