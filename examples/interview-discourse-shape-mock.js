/**
 * A real job-interview conversation, run through Totemheart, to see
 * `HumanDiscourseShaper` (src/behavior/HumanDiscourseShaper.js) — the
 * mechanism from your StoryScope-inspired spec — actually compute a
 * different real discourse-shape target D_t on every turn, and to compare
 * paragraphs written under the "AI-shape" default vs. the real,
 * per-turn "human-shape" target it produces.
 *
 * IMPORTANT — what this demo can and cannot show, stated up front:
 * HumanDiscourseShaper does not generate text. Totemheart has no text
 * generator of its own (see README's "Wiring it into a real LLM"
 * section) — it produces real, bounded DIRECTIVES for a host LLM to
 * honor. So this script plays the same "host LLM" role every other
 * multi-day demo in this project has played: for each interview
 * question, it reads Totemheart's REAL computed state (warmth from
 * Attachment.affinity, cooling from post-conflict wound pressure,
 * valueConflict from CognitiveDissonance.getStress()), calls the REAL
 * `computeTarget()`/`scoreAILikeness()`/`buildDirectives()` — the exact
 * numbers below are not picked to make a good demo, they're whatever
 * this specific conversation's real state produces — and only THEN
 * authors two contrasting paragraphs by hand: one deliberately shaped
 * like the AI_PRIOR constant this module targets moving away from, one
 * following that turn's real directives. The shape and content of each
 * paragraph is authored; the NUMBERS driving which shape to write are
 * 100% real and unforced.
 *
 * Also stated honestly: the shipped `HumanDiscourseShaper` is a real,
 * SCOPED-DOWN slice of the original 8-axis / 12-sub-mechanism spec — 6
 * axes (themeExplicit, plotTidiness, agencyControl, moralAmbiguity,
 * temporalComplexity, epilogueMoralizing), not 8 (subplotDensity and
 * eventEscalation were never built), and one `computeTarget()`/
 * `buildDirectives()` pair, not 12 separate sub-classes
 * (ThemeImplicitizer, PlotMessInjector, IrregularEscalationController,
 * NarrativeRaritySampler, etc. were never built as separate modules).
 * Also: as of round 15, the real pipeline wiring in Totemheart.js feeds
 * `warmth`/`cooling`/`valueConflict`/`topicalAmbiguity` into
 * `computeTarget()` automatically every turn (`topicalAmbiguity` is real
 * `AppraisalAgreement` disagreement across this turn's own independent
 * valence estimates — content-level ambiguity, distinct from the AI's own
 * felt `valueConflict`) — it still does NOT plumb through
 * `reminiscenceCue`/`stakesUrgent`, even though the class itself supports
 * them. This script calls `computeTarget()` directly with real
 * `reminiscenceCue` values read off `RelationalMemoryCatalog.reminisce()`
 * for the memory-prompt question, to show that axis working too — that's
 * the same real function,
 * called with real state, just not (yet) wired through the main
 * pipeline automatically.
 */
import { Totemheart, Personality } from '../src/index.js'

function line( ch = '─' ) { return ch.repeat( 100 ) }

async function askQuestion( ai, label, question, { reminiscenceCue = 0, stakesUrgent = 0 } = {} ) {

	console.log( `\n${line( '═' )}\n${label}\n${line( '═' )}` )
	console.log( `Entrevistador: "${question}"` )

	const result = await ai.processInput( question, { userId: 'entrevistador' } )
	ai.tick( 0.5 )

	const relation = ai.attachment.get( 'entrevistador' )
	const state = {
		warmth             : relation.affinity,
		cooling              : ai.expressionDebt.debt, // real post-friction distance signal already tracked
		valueConflict      : ai.cognitiveDissonance.getStress(),
		reminiscenceCue,
		stakesUrgent,
		// Real, now wired through the pipeline (round 15): AppraisalAgreement's
		// own disagreement across THIS turn's independent valence estimates —
		// content-level ambiguity, distinct from the AI's own valueConflict.
		topicalAmbiguity : result.debug.discourseTopicalAmbiguity ?? 0,
	}

	const target      = ai.humanDiscourseShaper.computeTarget( state )
	const aiLikeness = ai.humanDiscourseShaper.scoreAILikeness( target )
	const directives  = ai.humanDiscourseShaper.buildDirectives( target )

	console.log( `\nEstado real de entrada: warmth=${state.warmth.toFixed( 3 )} cooling=${state.cooling.toFixed( 3 )} valueConflict=${state.valueConflict.toFixed( 3 )} topicalAmbiguity=${state.topicalAmbiguity.toFixed( 3 )} reminiscenceCue=${state.reminiscenceCue} stakesUrgent=${state.stakesUrgent}` )
	console.log( `D_t real: ${JSON.stringify( Object.fromEntries( Object.entries( target ).map( ( [ k, v ] ) => [ k, Number( v.toFixed( 3 ) ) ] ) ) )}` )
	console.log( `scoreAILikeness real: distanceFromAIPrior=${aiLikeness.distanceFromAIPrior.toFixed( 3 )}, aiLike=${aiLikeness.aiLike}` )
	console.log( `Directivas reales (buildDirectives): ${directives.length ? directives.map( d => `\n  - ${d}` ).join( '' ) : '(ninguna — el target ya está lo bastante lejos del prior AI en todos los ejes activos)'}` )

	return { target, aiLikeness, directives, result }

}

async function main() {

	console.log( 'Totemheart — entrevista de trabajo real, viendo HumanDiscourseShaper computar D_t turno a turno.' )
	console.log( 'Recordatorio: Totemheart no genera texto — esto lee su estado real y compara dos párrafos AUTORADOS bajo esa forma real.\n' )

	const ai = new Totemheart( { personality: new Personality( { openness: 0.7, conscientiousness: 0.6, extraversion: 0.5, agreeableness: 0.6, neuroticism: 0.4 } ) } )
	ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: 200 } )

	// --- Q1: opener, cold, no established relationship yet ---
	const q1 = await askQuestion( ai, 'PREGUNTA 1 — Apertura (sin vínculo aún)', 'Cuéntame un poco sobre ti y por qué te interesa este puesto.' )
	console.log( `\n--- Párrafo AI-shape (ignora D_t real, usa el prior AI del propio módulo) ---` )
	console.log( `"Mi nombre es Alex y tengo tres años de experiencia en desarrollo de software. Me interesa este puesto porque me permite crecer profesionalmente y aportar valor al equipo. Mi objetivo es contribuir con mis habilidades técnicas para lograr los resultados que la empresa necesita. En resumen, creo que mi perfil encaja perfectamente con lo que buscáis."` )
	console.log( `\n--- Párrafo bajo el D_t real de este turno (${q1.directives.length} directivas activas) ---` )
	console.log( `"Pues... llevo unos tres años metido en esto, la mayoría en un sitio pequeño donde tocaba de todo. Vine a este puesto sobre todo porque leí sobre el equipo y me pareció que hacíais las cosas de una forma distinta a lo que estoy acostumbrado. No sé si encajo del todo, la verdad, pero me apetece intentarlo."` )

	// --- Q2: a values conflict / ambiguous ethical situation from a past job ---
	const q2 = await askQuestion( ai, 'PREGUNTA 2 — Situación éticamente ambigua', 'Cuéntame de una vez en que tuviste que elegir entre lo que pedía tu jefe y lo que tú creías correcto.' )
	console.log( `\n--- Párrafo AI-shape ---` )
	console.log( `"Una vez mi jefe me pidió que acelerara una entrega sin las pruebas necesarias. Yo sabía que eso no era correcto, así que le expliqué los riesgos con datos claros y logré que aplazáramos el lanzamiento una semana. Al final entregamos con calidad y el cliente quedó satisfecho. La lección que aprendí es que siempre hay que priorizar la calidad sobre la velocidad."` )
	console.log( `\n--- Párrafo bajo el D_t real de este turno (${q2.directives.length} directivas activas) ---` )
	console.log( `"Hubo una vez que mi jefe quería sacar algo antes de tiempo y yo no estaba nada convencido. Se lo dije, discutimos bastante, y al final se quedó a medias: sacamos una versión reducida, no lo que él quería ni lo que yo hubiera hecho solo. No sé si fue la decisión correcta, la verdad, pero fue la que salió entre los dos."` )

	// --- Q3: high-stakes, urgent question (should suppress temporal complexity even if a memory cue exists) ---
	const q3 = await askQuestion( ai, 'PREGUNTA 3 — Pregunta urgente/de presión', 'Tenemos que decidir hoy mismo: si te contratamos, ¿puedes incorporarte esta misma semana? Necesitamos una respuesta ahora.', { reminiscenceCue: 0.6, stakesUrgent: 0.9 } )
	console.log( `\n--- Párrafo AI-shape ---` )
	console.log( `"Sí, puedo incorporarme esta semana sin ningún problema. Estoy totalmente disponible y preparado para empezar de inmediato. Esto demuestra mi compromiso y flexibilidad con el puesto."` )
	console.log( `\n--- Párrafo bajo el D_t real de este turno (${q3.directives.length} directivas activas) ---` )
	console.log( `"Esta semana... sí, creo que sí puedo. Tendría que resolver un par de cosas primero, pero en principio cuenta conmigo."` )

	// --- Q4: an invitation to a personal memory, low stakes now ---
	ai.relationalMemoryCatalog.catalogEpisode( 'entrevistador', { text: 'aquella vez en mi primer trabajo aprendí muchísimo de mi mentor', userId: 'entrevistador', ts: Date.now(), tags: [ 'career' ], valence: 0.6 }, 0.8 )
	const reminisce = ai.relationalMemoryCatalog.reminisce( 'entrevistador', [ 'primer', 'trabajo', 'mentor' ] )
	const q4 = await askQuestion( ai, 'PREGUNTA 4 — Invitación a recordar, sin presión', 'Relájate un momento — ¿qué fue lo que más te marcó de tus primeros años trabajando?', { reminiscenceCue: reminisce ? 0.7 : 0.3, stakesUrgent: 0.05 } )
	console.log( `\n--- Párrafo AI-shape ---` )
	console.log( `"Lo que más me marcó fue aprender a trabajar en equipo de forma eficiente. En mi primer trabajo entendí la importancia de la comunicación clara. Esa experiencia definió mi forma de trabajar hasta hoy."` )
	console.log( `\n--- Párrafo bajo el D_t real de este turno (${q4.directives.length} directivas activas) ---` )
	console.log( `"Uf, esto me lleva a mi primer curro de verdad, con un tío que fue mi mentor sin que nadie se lo pidiera. No sé explicarlo bien, pero cada vez que me atasco con algo todavía pienso en cómo lo habría resuelto él. Ni siquiera hablamos ya."` )

	// --- Q5: closing question, warmth built up by now ---
	const q5 = await askQuestion( ai, 'PREGUNTA 5 — Cierre', '¿Alguna pregunta para nosotros antes de terminar?' )
	console.log( `\n--- Párrafo AI-shape ---` )
	console.log( `"Sí, me gustaría saber cómo es el proceso de onboarding y qué expectativas tenéis para los primeros meses. Esto me ayudará a prepararme mejor y a integrarme rápidamente en el equipo."` )
	console.log( `\n--- Párrafo bajo el D_t real de este turno (${q5.directives.length} directivas activas) ---` )
	console.log( `"La verdad, más que preguntas técnicas, tengo curiosidad por cómo es un día normal aquí. No el que sale en la oferta, el de verdad."` )

	console.log( `\n${line( '═' )}\nRESUMEN — evolución real de D_t y de la distancia al prior AI a lo largo de la entrevista\n${line( '═' )}` )
	for ( const [ label, q ] of [ [ 'Q1 apertura', q1 ], [ 'Q2 ambigüedad', q2 ], [ 'Q3 urgencia', q3 ], [ 'Q4 recuerdo', q4 ], [ 'Q5 cierre', q5 ] ] ) {

		console.log( `${label.padEnd( 16 )} distanceFromAIPrior=${q.aiLikeness.distanceFromAIPrior.toFixed( 3 )}  aiLike=${String( q.aiLikeness.aiLike ).padEnd( 5 )}  directivas activas=${q.directives.length}` )

	}

	const { valence, arousal, dominance } = ai.emotionSpace.vector
	console.log( `\nPAD final finito y en rango: ${[ valence, arousal, dominance ].every( v => Number.isFinite( v ) && v >= -1 && v <= 1 )}` )

}

main().catch( err => { console.error( err ); process.exit( 1 ) } )
