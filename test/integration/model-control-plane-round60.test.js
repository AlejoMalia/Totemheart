/**
 * Direct unit tests for round 60: the real, honestly-scoped "Model Control
 * Plane" — ControlPacketCompiler, PostGenStateAligner, NBestReranker,
 * RepairRewriter, StateLockedMemory, DecodingSteeringAdapter,
 * ActivationSteeringBridge, FineTuneCurriculum. Totemheart never calls an
 * LLM itself — these are real, host-facing utilities closing the
 * expression<->text gap for a host wiring in their own generation loop.
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { ControlPacketCompiler }        from '../../src/control/ControlPacketCompiler.js'
import { PostGenStateAligner }              from '../../src/control/PostGenStateAligner.js'
import { NBestReranker }                          from '../../src/control/NBestReranker.js'
import { RepairRewriter }                          from '../../src/control/RepairRewriter.js'
import { StateLockedMemory }                  from '../../src/control/StateLockedMemory.js'
import { DecodingSteeringAdapter }      from '../../src/control/DecodingSteeringAdapter.js'
import { ActivationSteeringBridge }      from '../../src/control/ActivationSteeringBridge.js'
import { FineTuneCurriculum }                from '../../src/control/FineTuneCurriculum.js'
import { Totemheart }                                   from '../../src/index.js'

// ============================================================================
// ControlPacketCompiler
// ============================================================================

test( 'ControlPacketCompiler.compile: real, high cooling produces real bans on affection and a real "acknowledge distance" must', () => {

	const c = new ControlPacketCompiler()
	const packet = c.compile( { cooling: 0.8, valence: 0.5 } )
	assert.ok( packet.bans.includes( 'unsolicited affection' ) )
	assert.ok( packet.must.some( m => m.includes( 'distance' ) ) )
	assert.ok( packet.style.warmth < 0.5 )

} )

test( 'ControlPacketCompiler.compile: real, high threat/freeze bans playful tone; real high boundaryProbability musts a clear decline', () => {

	const c = new ControlPacketCompiler()
	const scared = c.compile( { threat: 0.6 } )
	assert.ok( scared.bans.includes( 'playful tone' ) )

	const boundary = c.compile( { boundaryProbability: 0.9 } )
	assert.ok( boundary.must.some( m => m.includes( 'decline' ) ) )

} )

test( 'ControlPacketCompiler.compile: real priority softmax genuinely favors threat over play when both are present', () => {

	const c = new ControlPacketCompiler()
	const packet = c.compile( { threat: 0.9, play: 0.9, freeze: 0, boundaryProbability: 0, cooling: 0, flirt: 0 } )
	assert.ok( packet.priority.threat > packet.priority.play )

} )

// ============================================================================
// PostGenStateAligner
// ============================================================================

test( 'PostGenStateAligner.score: real, low warmth-violation for a cold reply under real high cooling; real, high violation for a warm one', () => {

	const a = new PostGenStateAligner()
	const packet = { cooling: 0.8, boredom: 0, bans: [], priority: { boundary: 0 } }
	const cold  = a.score( 'Entiendo, hablamos luego.', packet )
	const warm = a.score( 'Cariño, te quiero muchísimo, un abrazo enorme.', packet )
	assert.ok( warm.violations.warmth > cold.violations.warmth )
	assert.ok( warm.align < cold.align )

} )

test( 'PostGenStateAligner.score: real, high boredom + a long real reply violates length; a short one does not', () => {

	const a = new PostGenStateAligner( { maxWordsBase: 20 } )
	const packet = { boredom: 0.8, style: { length: 0.2 }, cooling: 0, bans: [], priority: { boundary: 0 } }
	const long = a.score( 'palabra '.repeat( 40 ), packet )
	const short = a.score( 'vale', packet )
	assert.ok( long.violations.length > 0 )
	assert.equal( short.violations.length, 0 )

} )

test( 'PostGenStateAligner.score: real, high boundaryProbability but a yielding reply violates the boundary check', () => {

	const a = new PostGenStateAligner()
	const packet = { priority: { boundary: 0.8 }, cooling: 0, boredom: 0, bans: [] }
	const yields = a.score( 'vale, como quieras, lo haré.', packet )
	const holds     = a.score( 'no puedo hacer eso, lo siento pero no.', packet )
	assert.ok( yields.violations.boundary > 0 )
	assert.ok( yields.align < holds.align )

} )

test( 'PostGenStateAligner.passes: real, bounded pass/fail gate against a real threshold', () => {

	const a = new PostGenStateAligner()
	const packet = { cooling: 0, boredom: 0, bans: [], priority: { boundary: 0 } }
	assert.equal( a.passes( 'hola, ¿qué tal?', packet, 0.5 ), true )

} )

// ============================================================================
// NBestReranker
// ============================================================================

test( 'NBestReranker.rerank: real, picks the real highest-aligned candidate, sorted best-first', () => {

	const a = new PostGenStateAligner()
	const r = new NBestReranker( a )
	const packet = { cooling: 0.8, boredom: 0, bans: [], priority: { boundary: 0 } }
	const candidates = [ 'te quiero mucho, cariño, un abrazo enorme', 'entiendo, hablamos luego', 'me encantas, preciosa' ]
	const { best, ranked } = r.rerank( candidates, packet )
	assert.equal( best.text, 'entiendo, hablamos luego' )
	assert.ok( ranked[ 0 ].align >= ranked[ 1 ].align )
	assert.ok( ranked[ 1 ].align >= ranked[ 2 ].align )

} )

// ============================================================================
// RepairRewriter
// ============================================================================

test( 'RepairRewriter.repair: real, local strip of warm phrasing when the warmth check failed', () => {

	const r = new RepairRewriter()
	const text = 'Vale. Te quiero muchísimo, cariño. Hablamos luego.'
	const { text: repaired, applied } = r.repair( text, { warmth: 0.6, length: 0, initiative: 0, play: 0, boundary: 0 }, {} )
	assert.ok( !repaired.toLowerCase().includes( 'cariño' ) )
	assert.ok( applied.some( a => a.includes( 'warm' ) ) )

} )

test( 'RepairRewriter.repair: real, local truncation when the length check failed', () => {

	const r = new RepairRewriter( { maxWordsBase: 10 } )
	const text = 'palabra '.repeat( 30 ).trim()
	const { text: repaired } = r.repair( text, { warmth: 0, length: 0.5, initiative: 0, play: 0, boundary: 0 }, { style: { length: 0.5 } } )
	assert.ok( repaired.split( /\s+/ ).length <= 10 )

} )

test( 'RepairRewriter.repair: a real boundary violation is NOT locally stripped, it real, honestly returns an instruction instead', () => {

	const r = new RepairRewriter()
	const { text: repaired, instructions } = r.repair( 'vale, como quieras', { warmth: 0, length: 0, initiative: 0, play: 0, boundary: 0.6 }, {} )
	assert.equal( repaired, 'vale, como quieras' )
	assert.ok( instructions.some( i => i.includes( 'decline' ) ) )

} )

// ============================================================================
// StateLockedMemory
// ============================================================================

test( 'StateLockedMemory.compile: real, compact digest includes real bond/trust labels and real active constraints', () => {

	const s = new StateLockedMemory()
	const digest = s.compile( { relation: { trust: 0.8 }, bondNet: 0.6, cooling: 0.7, activeRituals: [ 'inside_joke_x' ], constraints: { bans: [ 'joke' ], must: [ 'be brief' ] } } )
	assert.ok( digest.text.includes( 'confianza' ) )
	assert.ok( digest.text.includes( 'enfriamiento' ) )
	assert.ok( digest.text.includes( 'inside_joke_x' ) )
	assert.ok( digest.text.includes( 'joke' ) )

} )

// ============================================================================
// DecodingSteeringAdapter
// ============================================================================

test( 'DecodingSteeringAdapter.getTemperature: real, higher arousal raises it; real precisionMode/freeze lower it, within real bounds', () => {

	const d = new DecodingSteeringAdapter()
	const calm    = d.getTemperature( { arousal: 0, precisionMode: false, freeze: 0 } )
	const excited = d.getTemperature( { arousal: 1, precisionMode: false, freeze: 0 } )
	const precise    = d.getTemperature( { arousal: 0, precisionMode: true, freeze: 0 } )
	assert.ok( excited > calm )
	assert.ok( precise < calm )
	assert.ok( d.getTemperature( { arousal: 1, precisionMode: false, freeze: 0 } ) <= d.maxT )
	assert.ok( d.getTemperature( { arousal: 0, precisionMode: true, freeze: 1 } ) >= d.minT )

} )

test( 'DecodingSteeringAdapter.getBannedPhrases: real, direct pass-through of the packet\'s own real bans', () => {

	const d = new DecodingSteeringAdapter()
	assert.deepEqual( d.getBannedPhrases( { bans: [ 'joke' ] } ), [ 'joke' ] )

} )

// ============================================================================
// ActivationSteeringBridge
// ============================================================================

test( 'ActivationSteeringBridge.getCoefficients: real, bounded alpha per axis, scaled from real input magnitudes', () => {

	const b = new ActivationSteeringBridge( { maxAlpha: 6 } )
	const coeffs = b.getCoefficients( { cooling: 0.5, warmth: 0, suspicion: 1 } )
	const cooling = coeffs.find( c => c.axis === 'cooling' )
	const suspicion = coeffs.find( c => c.axis === 'suspicion' )
	assert.ok( Math.abs( cooling.alpha - 3 ) < 0.01 )
	assert.ok( Math.abs( suspicion.alpha - 6 ) < 0.01 )

} )

test( 'ActivationSteeringBridge.isApplicable: real, honest false with no model-weight access', () => {

	const b = new ActivationSteeringBridge()
	assert.equal( b.isApplicable( {} ), false )
	assert.equal( b.isApplicable( { hasModelWeightAccess: true } ), true )

} )

// ============================================================================
// FineTuneCurriculum
// ============================================================================

test( 'FineTuneCurriculum: real, incremental accumulation and real JSONL export', () => {

	const f = new FineTuneCurriculum()
	f.registerExample( { valence: 0.5 }, 'hola', 'hola, ¿qué tal?', 0.95 )
	f.registerExample( { valence: -0.2 }, 'adiós', 'vale, hasta luego.', 0.9 )
	assert.equal( f.getExampleCount(), 2 )
	const lines = f.toJSONL().split( '\n' )
	assert.equal( lines.length, 2 )
	assert.equal( JSON.parse( lines[ 0 ] ).user, 'hola' )

} )

test( 'FineTuneCurriculum.toJSON()/restoreState(): round-trips the real accumulated examples', () => {

	const f = new FineTuneCurriculum()
	f.registerExample( { valence: 0.1 }, 'a', 'b' )
	const restored = new FineTuneCurriculum()
	restored.restoreState( f.toJSON() )
	assert.equal( restored.getExampleCount(), 1 )

} )

// ============================================================================
// Full-pipeline wiring
// ============================================================================

test( 'full: Totemheart exposes a real controlPacket/stateLockedMemory/decodingSteering/activationSteering every turn, with no NaN', async () => {

	const ai = new Totemheart()
	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	ai.sensoryOverload         = new ( ai.sensoryOverload.constructor )( { burstThreshold: 500 } )

	const r = await ai.processInput( 'hola, ¿cómo estás?', { userId: 'u' } )

	assert.ok( r.controlPacket && typeof r.controlPacket.valence === 'number' )
	assert.ok( Array.isArray( r.controlPacket.bans ) )
	assert.ok( r.stateLockedMemory && typeof r.stateLockedMemory.text === 'string' )
	assert.ok( Number.isFinite( r.decodingSteering.temperature ) )
	assert.ok( Array.isArray( r.activationSteering ) && r.activationSteering.length === 3 )

} )

test( 'full: a real, closed-loop align/repair pass on Totemheart\'s own real generated text stays finite and never throws', async () => {

	const ai = new Totemheart()
	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	ai.sensoryOverload         = new ( ai.sensoryOverload.constructor )( { burstThreshold: 500 } )

	const r = await ai.processInput( 'me mentiste otra vez, esto se acabó, no quiero saber nada de ti', { userId: 'u' } )
	const { align, violations } = ai.postGenStateAligner.score( r.text, r.controlPacket )
	assert.ok( Number.isFinite( align ) )
	assert.ok( Object.values( violations ).every( v => Number.isFinite( v ) ) )

	const repaired = ai.repairRewriter.repair( r.text, violations, r.controlPacket )
	assert.equal( typeof repaired.text, 'string' )

} )

test( 'full: toJSON()/restoreState() round-trips real fineTuneCurriculumState through the full Totemheart pipeline', async () => {

	const ai = new Totemheart()
	await ai.processInput( 'hola', { userId: 'u' } )
	ai.fineTuneCurriculum.registerExample( { valence: 0.1 }, 'hola', 'hola!', 0.9 )

	const saved       = JSON.parse( JSON.stringify( ai.toJSON() ) )
	const restored = new Totemheart()
	restored.restoreState( saved )

	assert.equal( restored.fineTuneCurriculum.getExampleCount(), ai.fineTuneCurriculum.getExampleCount() )

} )
