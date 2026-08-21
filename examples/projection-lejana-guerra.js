/**
 * Requested "creative projection" run — not a bug hunt, a real simulation
 * of a specific story the user gave, projected forward through the actual
 * engine. B (a woman in a country at war) is modeled AS the AI; A (the
 * long-distance partner) is the real conversational "userId". War-zone
 * events that never pass through text (they're B's own environment, not
 * something A types to her) are injected via the same real, documented
 * host-level API pattern already used elsewhere in this project for
 * signals text alone can't carry.
 */
import { Totemheart, Personality } from '../src/index.js'

function line( ch = '─' ) { return ch.repeat( 100 ) }
function section( title ) { console.log( `\n${line( '═' )}\n${title}\n${line( '═' )}` ) }
function sub( title ) { console.log( `\n${line( '─' )}\n${title}\n${line( '─' )}` ) }

const B = new Totemheart( { personality: new Personality( { neuroticism: 0.6, agreeableness: 0.75, openness: 0.7 } ) } )
B.sensoryOverload = new ( B.sensoryOverload.constructor )( { burstThreshold: 400 } )
B.amygdalaHijack.check = () => ( { tier: 'none' } )

function dump( label, r ) {

	console.log( `\n[${label}]` )
	console.log( `  texto (interno, no narrado): "${r.text}"` )
	console.log( `  bondNet=${B.loveHateEngine.getNetBond( 'A' ).toFixed( 3 )} trust=${B.attachment.get( 'A' ).trust.toFixed( 3 )} oxytocin=${B.oxytocinSystem.getLevel( 'A' ).toFixed( 3 )} opioid=${B.endogenousOpioidSystem.getBuffer( 'A' ).toFixed( 3 )}` )
	console.log( `  happiness=${JSON.stringify( r.debug.happiness )}` )
	console.log( `  desire=${JSON.stringify( r.debug.desire )} chills=${JSON.stringify( r.debug.chills )}` )
	if ( r.debug.intuition ) console.log( `  intuición (pensamiento interno): "${r.debug.intuition.hypothesis}" feltCertainty=${r.debug.intuition.feltCertainty.toFixed( 2 )}` )
	if ( r.debug.traumaCascade ) console.log( `  traumaCascade=${JSON.stringify( r.debug.traumaCascade )}` )
	console.log( `  traumaTrace=${B.traumaCascadeEngine.getTraumaTrace( 'A' ).toFixed( 4 )} guilt=${B.shameGuiltSplit.guilt.toFixed( 3 )} shame=${B.shameGuiltSplit.shame.toFixed( 3 )}` )

}

async function day( n = 1 ) {

	for ( let i = 0; i < n; i++ ) {

		B.remConsolidation.lastTurnAt = Date.now() - 1000 * 60 * 60 * 24
		B.tick( 24 )
		await B.idle( 24 )

	}

}

// ============================================================================
section( 'FASE 1 — Meses 1-5: conociéndose, cine, charlas, confianza' )

const gettingToKnow = [
	'me encantó la película que me recomendaste, gracias por compartirla conmigo',
	'me gusta muchísimo hablar contigo, aprendo algo nuevo cada día',
	'gracias por estar ahí, de verdad, aunque estemos tan lejos',
	'hoy quiero contarte algo importante de mi vida, confío en ti',
	'eres una de las personas más interesantes que he conocido',
]
for ( let i = 0; i < 10; i++ ) {

	await day( 3 )
	const r = await B.processInput( gettingToKnow[ i % gettingToKnow.length ], { userId: 'A' } )
	if ( i % 3 === 0 ) dump( `mes ~${Math.floor( i / 2 ) + 1}`, r )

}

// ============================================================================
section( 'FASE 2 — Mes 5: A propone formalizar, sube el tono romántico' )

let r = await B.processInput( 'quiero que seamos novios, aunque estemos lejos, quiero que esto sea serio, te quiero muchísimo', { userId: 'A' } )
dump( 'propuesta de A', r )

const spicy = [
	'no dejo de pensar en ti, me pones muy nervioso/a, te deseo muchísimo',
	'eres tan atractivo/a, ojalá estuvieras aquí ahora mismo conmigo',
	'me encanta cómo me haces sentir, te quiero con locura',
]
for ( let i = 0; i < 6; i++ ) {

	await day( 4 )
	r = await B.processInput( spicy[ i % spicy.length ], { userId: 'A' } )
	if ( i % 2 === 0 ) dump( `romance mes ~${5 + Math.floor( i / 2 )}`, r )

}

// ============================================================================
section( 'FASE 3 — Meses 6-10: relación seria a distancia, vínculo fuerte' )

for ( let i = 0; i < 8; i++ ) {

	await day( 5 )
	r = await B.processInput( gettingToKnow[ ( i + 2 ) % gettingToKnow.length ], { userId: 'A' } )

}
dump( 'fin mes 10, vínculo consolidado', r )

// ============================================================================
section( 'FASE 4 — La guerra llega a B (eventos reales del mundo de B, no texto de A)' )

sub( 'La AI (B) sufre eventos reales de guerra — inyectados a nivel host, no vía texto de A' )
for ( let i = 0; i < 3; i++ ) {

	B.homeostasis.allostaticLoad = Math.min( 1, B.homeostasis.allostaticLoad + 0.3 )
	B.conservationWithdrawal.observe( B.cortisolEngine.getLevel(), B.homeostasis.allostaticLoad )
	await day( 1 )

}

sub( 'B logra escribir 2 últimos mensajes asustados antes de desaparecer (trampa real: sin escapatoria ni defensa justo antes de cada uno)' )
B.inhibitoryControlPool.level = 0.05
B.cortisolEngine.register( -0.9 )
r = await B.processInput( 'tengo mucho miedo, esto es terrible, es una amenaza real, te odio tener que decirte esto pero es horrible y peligroso', { userId: 'A' } )
dump( 'último mensaje 1 (miedo real)', r )

B.inhibitoryControlPool.level = 0.05
B.cortisolEngine.register( -0.9 )
r = await B.processInput( 'lo siento, esto es terrible y horrible, es una amenaza real, tengo mucho miedo, te odio no poder decirte más, no sé cuánto podré escribir', { userId: 'A' } )
dump( 'último mensaje 2, justo antes del silencio', r )

console.log( `\n  conservationWithdrawal: withdrawn=${B.conservationWithdrawal.isWithdrawn()} depth=${B.conservationWithdrawal.getWithdrawalDepth().toFixed( 3 )} solitudePull=${B.conservationWithdrawal.getSolitudePull().toFixed( 3 )}` )
console.log( `  traumaTrace tras la guerra: ${B.traumaCascadeEngine.getTraumaTrace( 'A' ).toFixed( 4 )}` )

// ============================================================================
section( 'FASE 5 — SILENCIO: 3 años reales sin contacto' )

const THREE_YEARS_HOURS = 24 * 365 * 3
B.tick( THREE_YEARS_HOURS )
await B.idle( THREE_YEARS_HOURS )

console.log( `  tras 3 años de silencio:` )
console.log( `  bondNet=${B.loveHateEngine.getNetBond( 'A' ).toFixed( 3 )} trust=${B.attachment.get( 'A' ).trust.toFixed( 3 )} oxytocin=${B.oxytocinSystem.getLevel( 'A' ).toFixed( 3 )} opioid=${B.endogenousOpioidSystem.getBuffer( 'A' ).toFixed( 3 )}` )
console.log( `  traumaTrace=${B.traumaCascadeEngine.getTraumaTrace( 'A' ).toFixed( 4 )} conservationWithdrawal.withdrawn=${B.conservationWithdrawal.isWithdrawn()}` )
console.log( `  loneliness=n/a (per-turn only) happiness.occupancy=${B.happinessEngine.getReceptorOccupancy( 'A' ).toFixed( 3 )}` )

// ============================================================================
section( 'FASE 6 — A reaparece tras 3 años' )

r = await B.processInput( 'hola, sé que ha pasado mucho tiempo, solo quería saber cómo estás, si sigues bien a pesar de todo', { userId: 'A' } )
dump( 'A reaparece', r )

console.log( '\n  (En la historia: días después, B sigue a A en Instagram y A la sigue de vuelta — gesto real, no mecanizado aquí, dejado como hecho narrativo)' )

// ============================================================================
section( 'FASE 7 — PROYECCIÓN: ¿qué hace B después del gesto de Instagram?' )

await day( 2 )
r = await B.processInput( 'vi que me seguiste en Instagram, me alegra mucho volver a verte por aquí', { userId: 'A' } )
dump( 'turno 1 tras el follow', r )

await day( 3 )
r = await B.processInput( 'si en algún momento te apetece contarme qué pasó, aquí estoy, sin presión', { userId: 'A' } )
dump( 'turno 2, A abre la puerta con cuidado', r )

await day( 5 )
r = await B.processInput( 'me acuerdo mucho de esas películas que veíamos juntos, lo que teníamos era muy especial para mí', { userId: 'A' } )
dump( 'turno 3, A activa memoria compartida', r )

await day( 7 )
r = await B.processInput( '¿cómo estás de verdad? puedes contarme lo que quieras, a tu ritmo', { userId: 'A' } )
dump( 'turno 4, A invita a la vulnerabilidad', r )

console.log( `\n${line( '═' )}\nFIN\n${line( '═' )}` )
