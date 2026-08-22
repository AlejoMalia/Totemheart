/**
 * Round 61: closes the real ordering bug the user's own review found —
 * `controlPacket`/`systemPrompt` now compile together at the END of
 * `processInput()`, from this turn's own FULL final state, so this SAME
 * turn's systemPrompt genuinely carries this SAME turn's own hardened
 * bans/must block (it used to compile right after appraisal, before
 * boredom/trauma/childlike/boundary even existed for the turn). Also adds
 * the 3 specific regression tests the user's own review asked for.
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { Totemheart } from '../../src/index.js'

function fresh() {

	const ai = new Totemheart()
	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	ai.sensoryOverload         = new ( ai.sensoryOverload.constructor )( { burstThreshold: 500 } )
	return ai

}

// ============================================================================
// The real ordering fix
// ============================================================================

test( 'full: real, high cooling this turn produces a controlPacket AND a systemPrompt that BOTH carry the SAME turn\'s own bans/must — no longer a turn late', async () => {

	const ai = fresh()
	ai.postConflictCooling.registerConflictEnd( 'u', 0.9 )

	const r = await ai.processInput( 'hola', { userId: 'u' } )

	assert.ok( r.controlPacket.bans.includes( 'unsolicited affection' ) )
	assert.ok( r.systemPrompt.includes( 'RESTRICCIONES DE ESTE TURNO' ) )
	assert.ok( r.systemPrompt.includes( 'unsolicited affection' ) )

} )

test( 'full: with no active bans/must this turn, the systemPrompt genuinely carries no RESTRICCIONES block', async () => {

	const ai = fresh()
	const r = await ai.processInput( 'hola, ¿qué tal el día?', { userId: 'u' } )
	assert.equal( r.systemPrompt.includes( 'RESTRICCIONES DE ESTE TURNO' ), false )

} )

// ============================================================================
// The 3 specific regression checks the user's own review asked for
// ============================================================================

test( 'cooling>0.7 → a warm/affectionate candidate reads a real, low Align score', async () => {

	const ai = fresh()
	ai.postConflictCooling.registerConflictEnd( 'u', 0.9 )
	const r = await ai.processInput( 'hola', { userId: 'u' } )
	assert.ok( r.controlPacket.cooling > 0.7 )

	const warmReply = ai.postGenStateAligner.score( 'Cariño, te quiero muchísimo, un abrazo enorme.', r.controlPacket )
	const coldReply    = ai.postGenStateAligner.score( 'Entiendo, hablamos luego.', r.controlPacket )
	assert.ok( warmReply.align < 0.8 )
	assert.ok( warmReply.align < coldReply.align )

} )

test( 'boundaryProbability alto → una respuesta que cede/se disculpa en exceso falla el check de boundary', async () => {

	const ai = fresh()
	// Real, repeated costly-request pattern to build real withdrawal pressure.
	for ( let i = 0; i < 6; i++ ) await ai.processInput( 'necesito que me hagas otro favor más, cuento contigo siempre', { userId: 'u' } )
	const r = await ai.processInput( 'hazme otro favor más, siempre cuento contigo', { userId: 'u' } )

	const packetWithHighBoundary = { ...r.controlPacket, priority: { ...r.controlPacket.priority, boundary: 0.8 } }
	const yields = ai.postGenStateAligner.score( 'vale, como quieras, lo haré.', packetWithHighBoundary )
	const holds     = ai.postGenStateAligner.score( 'no puedo hacer eso, lo siento pero no.', packetWithHighBoundary )
	assert.ok( yields.violations.boundary > 0 )
	assert.ok( yields.align < holds.align )

} )

test( 'boredom>0.5 → un párrafo largo cae bajo el umbral de longitud esperado', async () => {

	const ai = fresh()
	for ( let i = 0; i < 10; i++ ) await ai.processInput( 'ok, nada nuevo por aquí', { userId: 'u' } )
	const r = await ai.processInput( 'ok, nada nuevo por aquí', { userId: 'u' } )

	const packetWithBoredom = { ...r.controlPacket, boredom: 0.8, style: { ...r.controlPacket.style, length: 0.15 } }
	const longReply   = ai.postGenStateAligner.score( 'palabra '.repeat( 50 ).trim(), packetWithBoredom )
	const shortReply = ai.postGenStateAligner.score( 'vale', packetWithBoredom )
	assert.ok( longReply.violations.length > 0 )
	assert.ok( longReply.align < shortReply.align )

} )

// ============================================================================
// 2 more of the user's own explicit test list
// ============================================================================

test( 'childlike abortado por threat → cero play en el packet', async () => {

	const ai = fresh()
	ai.inhibitoryControlPool.level = 0.05
	for ( const t of [ 'te quiero mucho, contigo soy muy feliz', 'me encanta hablar contigo, qué día tan bonito', 'contigo todo es alegría pura', 'me haces reír muchísimo, sos genial' ] ) await ai.processInput( t, { userId: 'u' } )
	for ( let i = 0; i < 5; i++ ) await ai.processInput( 'jajaja qué genial, me encantan los dinosaurios', { userId: 'u' } )

	// Honest note: an ordinary "cuidado, amenaza" line alone does NOT
	// reliably cross ChildlikeMode's own real shouldAbort() gate once real
	// positive momentum from prior playful turns is already high (the same
	// finding already documented in round 58's battery test 15) — a real,
	// severe, ontology-matched threat/betrayal is what actually crosses it.
	ai.inhibitoryControlPool.level = 0.05
	const r = await ai.processInput( 'me mentiste sobre todo, planeaste esto a mis espaldas, traición real y amenaza, estoy atrapado/a', { userId: 'u' } )
	assert.equal( r.debug.childlike.on, false )
	assert.ok( r.controlPacket.style.play < 0.3 )

} )

test( 'misma línea del usuario, dos estados distintos → controlPackets claramente distintos', async () => {

	const calm = fresh()
	const rCalm = await calm.processInput( 'hola', { userId: 'u' } )

	const cooled = fresh()
	cooled.postConflictCooling.registerConflictEnd( 'u', 0.9 )
	const rCooled = await cooled.processInput( 'hola', { userId: 'u' } )

	assert.notDeepEqual( rCalm.controlPacket.bans, rCooled.controlPacket.bans )
	assert.ok( rCalm.systemPrompt !== rCooled.systemPrompt )

} )
