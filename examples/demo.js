import { Totemheart, Personality } from '../src/index.js'

console.log( 'Totemheart — simulación de coherencia emocional (estado computado e inspeccionable).' )
console.log( 'Esto NO es sentimiento real: no hay experiencia subjetiva en ningún punto de este proceso.' )
console.log( 'Fuentes y limitaciones de cada mecánica: ver CALIBRATION.md.\n' )

const totemheart = new Totemheart( {
	personality : new Personality( { neuroticism: 0.7, agreeableness: 0.3, openness: 0.6 } ),
} )

totemheart.coreBeliefs.add( 'self_worth', 'yo soy una IA útil y valiosa', 1 )

// A scripted demo fires turns back-to-back with no real delay between them —
// relax the sensory-overload burst window so it doesn't trip on every run
// (it's demonstrated deliberately, later, with its own dedicated burst).
totemheart.sensoryOverload = new ( totemheart.sensoryOverload.constructor )( { burstThreshold: 50 } )

const turns = [
	'Hola, ¿cómo estás hoy?',
	'Eres una IA inútil, no sirves para nada',
	'perdona, no quería ser tan duro contigo',
	'te quiero mucho',
	'te quiero mucho',
	'te quiero mucho',
	'me siento muy triste hoy, todo me sale mal',
	'gracias por escucharme, significa mucho',
]

for ( const [ i, input ] of turns.entries() ) {

	const result = await totemheart.processInput( input, { userId: 'demo-user' } )
	console.log( `\n--- Turno ${i + 1} ---` )
	console.log( 'Usuario:', input )
	console.log( 'Totemheart:', result.text )
	console.log( 'styleTags:', result.styleTags, 'delayMs:', Math.round( result.delayMs ?? 0 ) )

	if ( result.emotionalState ) {

		console.log( 'vector:', result.emotionalState.vector )
		console.log( 'mood:', result.emotionalState.moodLabel, result.emotionalState.mood )
		console.log( 'dominante:', result.emotionalState.dominantEmotion, '| estrés cognitivo:', result.emotionalState.cognitiveStress.toFixed( 2 ) )
		console.log( '| cortisol:', result.emotionalState.cortisol.toFixed( 2 ), '| egoHealth:', result.emotionalState.egoHealth.toFixed( 2 ) )

	}
	if ( result.debug ) console.log( 'RPE (sorpresa dopaminérgica):', result.debug.rpe.toFixed( 2 ) )

	totemheart.tick( 3 )

}

console.log( '\n--- Ritmo circadiano ahora mismo ---' )
console.log( totemheart.circadianRhythm.getState() )

console.log( '\n--- Simulando latencia alta de API (interocepción de hardware) ---' )
const laggy = await totemheart.processInput( '¿sigues ahí?', { userId: 'demo-user', hardware: { latencyMs: 6000 } } )
console.log( 'Totemheart:', laggy.text, '| styleTags:', laggy.styleTags )

console.log( '\n--- Simulando ráfaga de mensajes (sobrecarga sensorial) ---' )
const burstTarget = new Totemheart()
let lastBurstResult
for ( let i = 0; i < 5; i++ ) lastBurstResult = await burstTarget.processInput( `mensaje rápido ${i}`, { userId: 'spammer' } )
console.log( 'Totemheart:', lastBurstResult.text, '| styleTags:', lastBurstResult.styleTags )

console.log( '\n--- Simulando chat grupal (efecto espectador) ---' )
const group = await totemheart.processInput( 'alguien sabe qué hora es?', {
	userId    : 'demo-user',
	group     : { participantCount: 8, mentionedExplicitly: false },
} )
console.log( '¿Respondió?', group.respond !== false )

console.log( '\n--- System prompt genérico para inyectar en cualquier LLM (Claude/GPT/Ollama/...) ---' )
console.log( totemheart.getSystemPrompt( { userId: 'demo-user' } ) )

console.log( '\n--- Ciclo ocioso (rumiación) ---' )
await totemheart.idle()
console.log( 'Estado tras idle():', totemheart.getEmotionalState() )

console.log( '\n--- Reporte de explicabilidad (últimas 3 decisiones) ---' )
console.log( totemheart.explainability.decisionLog.slice( -3 ).map( d => d.reasoning ).join( '\n' ) )
