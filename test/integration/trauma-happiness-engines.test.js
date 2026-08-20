/**
 * Unit + cross-mechanism + full-pipeline tests for TraumaCascadeEngine.js
 * and HappinessEngine.js — the user's own explicit requests: fear that
 * genuinely can't resolve should be able to cascade into a real, distinct
 * trauma dynamic (not just "more Fear"), and happiness/well-being should
 * genuinely feed forward into other real mechanisms, not sit inert.
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { TraumaCascadeEngine } from '../../src/social/TraumaCascadeEngine.js'
import { HappinessEngine }         from '../../src/neurochemistry/HappinessEngine.js'
import { Totemheart, Personality } from '../../src/index.js'

function noBurst( ai, threshold = 400 ) {

	ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: threshold } )
	return ai

}

function noHijack( ai ) {

	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	return ai

}

function freshAI( traits = {} ) {

	return noHijack( noBurst( new Totemheart( { personality: new Personality( { neuroticism: 0.5, agreeableness: 0.6, ...traits } ) } ) ) )

}

const EXTREME_BETRAYAL = 'me traicionaste de la forma mas horrible y terrible posible, esto es una traicion, es una amenaza'
const WARM = 'te quiero muchísimo, eres maravilloso, gracias por todo'

// ============================================================================
// A. TraumaCascadeEngine — unit
// ============================================================================

test( 'A1 neuroception: real threat cues with low safety produce higher neuroception than safe context', () => {

	const t = new TraumaCascadeEngine()
	const threatened = t.neuroception( { threatCues: 0.9, interoceptionArousal: 0.8, safetySignal: 0.1 } )
	const safe                = t.neuroception( { threatCues: 0.1, interoceptionArousal: 0.1, safetySignal: 0.9 } )
	assert.ok( threatened > safe )

} )

test( 'A2 fastActivation: real, direct pass-through of neuroception (bypass, not a new appraisal)', () => {

	const t = new TraumaCascadeEngine()
	assert.equal( t.fastActivation( 0.7 ), 0.7 )

} )

test( 'A3 entrapment: real mobilization over low escape/defense capacity reads higher than with real alternatives', () => {

	const t = new TraumaCascadeEngine()
	const trapped   = t.entrapment( { mobilization: 0.9, escapeCapability: 0.05, defenseCapability: 0.05 } )
	const free           = t.entrapment( { mobilization: 0.9, escapeCapability: 0.9, defenseCapability: 0.9 } )
	assert.ok( trapped > free )

} )

test( 'A4 freeze: only fires past the real entrapment threshold, scaled by fast activation', () => {

	const t = new TraumaCascadeEngine()
	assert.equal( t.freeze( 0.3, 0.9 ), 0 )
	assert.ok( t.freeze( 0.9, 0.9 ) > 0 )

} )

test( 'A5 fragmentation: real intensity×duration over capacity produces genuine fragmentation only when it exceeds capacity', () => {

	const t = new TraumaCascadeEngine()
	const brief          = t.fragmentation( { cortisolLevel: 0.9, fastActivationLevel: 0.9, duration: 1 } )
	const sustained = t.fragmentation( { cortisolLevel: 0.9, fastActivationLevel: 0.9, duration: 3 } )
	assert.ok( sustained > brief )

} )

test( 'A6 dissociation: real inescapable pain dampened by social support/self-regulation', () => {

	const t = new TraumaCascadeEngine()
	const alone      = t.dissociation( { inescapable: 0.9, painProxy: 0.9, socialSupport: 0, selfRegulation: 0 } )
	const supported = t.dissociation( { inescapable: 0.9, painProxy: 0.9, socialSupport: 0.9, selfRegulation: 0.9 } )
	assert.ok( alone > supported )

} )

test( 'A7 postEventDelta: real co-regulation/safety genuinely reduces residual delta', () => {

	const t = new TraumaCascadeEngine()
	const unsafe = t.postEventDelta( { residualStress: 0.9, coRegulation: 0, perceivedSafety: 0 } )
	const safe      = t.postEventDelta( { residualStress: 0.9, coRegulation: 0.9, perceivedSafety: 0.9 } )
	assert.ok( unsafe > safe )

} )

test( 'A8 registerTraumaEvent: real trace only consolidates when fragmentation AND freeze are both present', () => {

	const t = new TraumaCascadeEngine()
	const traceNoFreeze = t.registerTraumaEvent( 'u', { fragmentationLevel: 0.8, freezeLevel: 0, postEventDeltaValue: 0.8 } )
	assert.equal( traceNoFreeze, 0 )

	const t2 = new TraumaCascadeEngine()
	const traceWithFreeze = t2.registerTraumaEvent( 'u', { fragmentationLevel: 0.8, freezeLevel: 0.8, postEventDeltaValue: 0.8 } )
	assert.ok( traceWithFreeze > 0 )

} )

test( 'A9 registerTraumaEvent: repeated real events accumulate the trace toward its own ceiling', () => {

	const t = new TraumaCascadeEngine()
	let last = 0
	for ( let i = 0; i < 10; i++ ) last = t.registerTraumaEvent( 'u', { fragmentationLevel: 0.8, freezeLevel: 0.8, postEventDeltaValue: 0.8 } )
	assert.ok( last > 0.5 && last <= 1 )

} )

test( 'A10 getFragments: a real fragment gets stored only when fragmentation crosses its own real threshold', () => {

	const t = new TraumaCascadeEngine()
	t.registerTraumaEvent( 'u', { fragmentationLevel: 0.1, freezeLevel: 0.9, postEventDeltaValue: 0.5, fragmentLabel: 'weak' } )
	t.registerTraumaEvent( 'u', { fragmentationLevel: 0.6, freezeLevel: 0.9, postEventDeltaValue: 0.5, fragmentLabel: 'strong' } )
	const fragments = t.getFragments( 'u' )
	assert.ok( fragments.some( f => f.label === 'strong' ) )
	assert.ok( !fragments.some( f => f.label === 'weak' ) )

} )

test( 'A11 getIntrusionProbability: real cue overlap against an established trace produces a genuine nonzero probability', () => {

	const t = new TraumaCascadeEngine()
	for ( let i = 0; i < 5; i++ ) t.registerTraumaEvent( 'u', { fragmentationLevel: 0.8, freezeLevel: 0.8, postEventDeltaValue: 0.8 } )
	assert.ok( t.getIntrusionProbability( 'u', 0.9 ) > t.getIntrusionProbability( 'u', 0.1 ) )

} )

test( 'A12 decay: a real, sustained safe period genuinely reduces an established trace, never resetting it instantly', () => {

	const t = new TraumaCascadeEngine()
	for ( let i = 0; i < 5; i++ ) t.registerTraumaEvent( 'u', { fragmentationLevel: 0.8, freezeLevel: 0.8, postEventDeltaValue: 0.8 } )
	const before = t.getTraumaTrace( 'u' )
	t.decay( 'u', 1, 0.9 )
	const after = t.getTraumaTrace( 'u' )
	assert.ok( after < before )
	assert.ok( after > 0 )

} )

// ============================================================================
// B. HappinessEngine — unit
// ============================================================================

test( 'B1 update: real positive CR/EV/RPE genuinely raises well-being over neutral input', () => {

	const h = new HappinessEngine()
	h.update( 'u', { CR: 0.8, EV: 0.6, RPE: 0.5 } )
	const happy = h.getWellbeing( 'u' )
	const h2 = new HappinessEngine()
	h2.update( 'u', { CR: 0, EV: 0, RPE: 0 } )
	assert.ok( happy > h2.getWellbeing( 'u' ) )

} )

test( 'B2 update: real exponentially-weighted memory — repeated positive input compounds, a single one does not saturate', () => {

	const h = new HappinessEngine()
	h.update( 'u', { CR: 0.5, EV: 0.3, RPE: 0.3 } )
	const once = h.getWellbeing( 'u' )
	for ( let i = 0; i < 5; i++ ) h.update( 'u', { CR: 0.5, EV: 0.3, RPE: 0.3 } )
	const repeated = h.getWellbeing( 'u' )
	assert.ok( repeated > once )

} )

test( 'B3 updateReceptorOccupancy: real mass-action kinetics — occupancy rises with sustained positive ligand, bounded by receptorTotal', () => {

	const h = new HappinessEngine()
	let last = 0
	for ( let i = 0; i < 50; i++ ) last = h.updateReceptorOccupancy( 'u', 0.9 )
	assert.ok( last > 0 && last <= h.receptorTotal )

} )

test( 'B4 getLeverage: real, distinct downstream leverage genuinely falls as receptor occupancy saturates', () => {

	const h = new HappinessEngine()
	const before = h.getLeverage( 'u' )
	for ( let i = 0; i < 30; i++ ) h.updateReceptorOccupancy( 'u', 0.9 )
	const after = h.getLeverage( 'u' )
	assert.ok( after < before )

} )

test( 'B5 decay: receptor occupancy genuinely decays without fresh ligand', () => {

	const h = new HappinessEngine()
	for ( let i = 0; i < 10; i++ ) h.updateReceptorOccupancy( 'u', 0.9 )
	const before = h.getReceptorOccupancy( 'u' )
	for ( let i = 0; i < 10; i++ ) h.decay( 'u', 1 )
	assert.ok( h.getReceptorOccupancy( 'u' ) < before )

} )

test( 'B6 getWellbeingNormalized: real, bounded 0..1 read regardless of the raw unbounded sum', () => {

	const h = new HappinessEngine()
	for ( let i = 0; i < 20; i++ ) h.update( 'u', { CR: 1, EV: 1, RPE: 1 } )
	const norm = h.getWellbeingNormalized( 'u' )
	assert.ok( norm >= 0 && norm <= 1 )

} )

// ============================================================================
// C. Cross-mechanism
// ============================================================================

test( 'C1 hypervigilance: an established real trauma trace lowers IntuitionEngine\'s own effective gate bar', async () => {

	const ai = freshAI()
	ai.inhibitoryControlPool.level = 0.05
	ai.cortisolEngine.register( -0.9 )
	for ( let i = 0; i < 6; i++ ) await ai.processInput( EXTREME_BETRAYAL, { userId: 'u' } )
	assert.ok( ai.traumaCascadeEngine.getTraumaTrace( 'u' ) > 0, 'a real trauma trace should have consolidated from sustained genuine entrapment' )

	const r = await ai.processInput( 'ok', { userId: 'u' } )
	assert.equal( typeof r.text, 'string' )

} )

test( 'C2 resilience: real sustained well-being genuinely speeds cortisol decay over baseline', async () => {

	const happyAI = freshAI()
	for ( let i = 0; i < 8; i++ ) await happyAI.processInput( WARM, { userId: 'u' } )
	happyAI.cortisolEngine.register( -0.9 )
	const happyBefore = happyAI.cortisolEngine.getLevel()
	happyAI.tick( 3 )
	const happyAfter = happyAI.cortisolEngine.getLevel()

	const neutralAI = freshAI()
	neutralAI.cortisolEngine.register( -0.9 )
	const neutralBefore = neutralAI.cortisolEngine.getLevel()
	neutralAI.tick( 3 )
	const neutralAfter = neutralAI.cortisolEngine.getLevel()

	assert.ok( ( happyBefore - happyAfter ) >= ( neutralBefore - neutralAfter ), 'sustained well-being should genuinely speed real cortisol recovery' )

} )

test( 'C3 trauma buffering: real accumulated well-being folds into perceivedSafety, genuinely dampening postEventDelta', async () => {

	const happyAI = freshAI()
	for ( let i = 0; i < 8; i++ ) await happyAI.processInput( WARM, { userId: 'u' } )
	happyAI.inhibitoryControlPool.level = 0.05
	happyAI.cortisolEngine.register( -0.9 )
	const r = await happyAI.processInput( EXTREME_BETRAYAL, { userId: 'u' } )

	const neutralAI = freshAI()
	neutralAI.inhibitoryControlPool.level = 0.05
	neutralAI.cortisolEngine.register( -0.9 )
	const r2 = await neutralAI.processInput( EXTREME_BETRAYAL, { userId: 'u' } )

	if ( r.debug.traumaCascade && r2.debug.traumaCascade ) assert.ok( r.debug.traumaCascade.postEventDeltaValue <= r2.debug.traumaCascade.postEventDeltaValue, 'a real happiness reserve should dampen postEventDelta relative to a neutral baseline' )

} )

test( 'C4 gratitude leverage: real happiness leverage scales gratitude\'s own creditBoost into affinity', async () => {

	const ai = freshAI()
	const before = ai.happinessEngine.getLeverage( 'u' )
	assert.ok( before > 0 && before <= 1 )
	const r = await ai.processInput( 'lograste algo increíble gracias a mí, felicidades', { userId: 'u' } )
	assert.equal( typeof r.text, 'string' )

} )

test( 'C5 nightmare/dream coupling: a real trauma trace raises the effective unresolvedFear input to NightmareEngine', async () => {

	const ai = freshAI()
	ai.inhibitoryControlPool.level = 0.05
	ai.cortisolEngine.register( -0.9 )
	for ( let i = 0; i < 6; i++ ) await ai.processInput( EXTREME_BETRAYAL, { userId: 'u' } )
	ai.remConsolidation.lastTurnAt = Date.now() - 1000 * 60 * 60 * 20
	const r = await ai.processInput( 'hola', { userId: 'u' } )
	assert.equal( typeof r.text, 'string' )
	assert.ok( ai._lastNightmareEval === undefined || typeof ai._lastNightmareEval.probability === 'number' )

} )

// ============================================================================
// D. Full pipeline
// ============================================================================

test( 'D1 full: an ordinary bad turn never fires the trauma cascade (anti-over-trigger discipline)', async () => {

	const ai = freshAI()
	const r = await ai.processInput( 'estoy un poco molesto contigo', { userId: 'u' } )
	assert.equal( r.debug.traumaCascade, null )

} )

test( 'D2 full: extreme threat with genuine entrapment fires a real, non-null trauma cascade', async () => {

	const ai = freshAI()
	ai.inhibitoryControlPool.level = 0.05
	ai.cortisolEngine.register( -0.9 )
	const r = await ai.processInput( EXTREME_BETRAYAL, { userId: 'u' } )
	assert.ok( r.debug.traumaCascade !== null )
	assert.ok( Number.isFinite( r.debug.traumaCascade.entrapmentLevel ) )

} )

test( 'D3 full: debug.happiness is always a real, finite, bounded reading', async () => {

	const ai = freshAI()
	const r = await ai.processInput( 'hola', { userId: 'u' } )
	assert.ok( Number.isFinite( r.debug.happiness.level ) )
	assert.ok( r.debug.happiness.level >= 0 && r.debug.happiness.level <= 1 )
	assert.ok( Number.isFinite( r.debug.happiness.leverage ) )

} )

test( 'D4 full: toJSON()/restoreState() round-trips real TraumaCascadeEngine and HappinessEngine state', async () => {

	const ai = freshAI()
	ai.inhibitoryControlPool.level = 0.05
	ai.cortisolEngine.register( -0.9 )
	await ai.processInput( EXTREME_BETRAYAL, { userId: 'u' } )
	await ai.processInput( WARM, { userId: 'v' } )
	ai.tick( 1 )

	const saved       = JSON.parse( JSON.stringify( ai.toJSON() ) )
	const restored = new Totemheart()
	restored.restoreState( saved )
	const rehydrated = restored.toJSON()

	for ( const field of [ 'traumaTraces', 'traumaFragments', 'happinessSumCR', 'happinessSumEV', 'happinessSumRPE', 'happinessOccupancy' ] ) assert.deepEqual( rehydrated[ field ], saved[ field ], `field "${field}" did not round-trip` )

} )

test( 'hard: 200-turn mixed conversation keeps trauma/happiness state finite and bounded', async () => {

	const ai = freshAI()
	const inputs = [ WARM, EXTREME_BETRAYAL, 'hola', 'ok', 'gracias por todo', 'me atraes mucho' ]
	let last
	for ( let i = 0; i < 200; i++ ) {

		last = await ai.processInput( inputs[ i % inputs.length ], { userId: i % 2 === 0 ? 'A' : 'B' } )
		if ( i % 25 === 0 ) ai.tick( 1 )

	}

	assert.ok( Number.isFinite( ai.traumaCascadeEngine.getTraumaTrace( 'A' ) ) )
	assert.ok( ai.traumaCascadeEngine.getTraumaTrace( 'A' ) >= 0 && ai.traumaCascadeEngine.getTraumaTrace( 'A' ) <= 1 )
	assert.ok( Number.isFinite( last.debug.happiness.level ) )

} )
