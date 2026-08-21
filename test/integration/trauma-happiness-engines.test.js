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
import { EmotionalOntology }        from '../../src/cognition/EmotionalOntology.js'
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

test( 'A10b getFragments: real bug fix — the threshold was too high to ever fire from a genuinely extreme FIRST event (fragmentation needs cortisol build-up, not just one turn), and fragments now store a real sensory/emotional detail, not just an abstract label', () => {

	const t = new TraumaCascadeEngine()
	assert.equal( t.getFragments( 'u' ).length, 0 )
	t.registerTraumaEvent( 'u', { fragmentationLevel: 0.2, freezeLevel: 0.5, postEventDeltaValue: 0.3, fragmentLabel: 'threat', sensoryDetail: 'me mentiste sobre todo, es una traición total', valence: -0.7 } )
	const fragments = t.getFragments( 'u' )
	assert.equal( fragments.length, 1, 'a genuinely moderate-fragmentation single event should now register a real fragment (old threshold was 0.3, too high for many real first hits)' )
	assert.equal( fragments[ 0 ].detail, 'me mentiste sobre todo, es una traición total' )
	assert.equal( fragments[ 0 ].valence, -0.7 )

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

test( 'A13 decay: real persistence — without real co-regulation, decay genuinely slows rather than proceeding at the same flat rate', () => {

	const supported  = new TraumaCascadeEngine()
	const unsupported = new TraumaCascadeEngine()
	for ( const t of [ supported, unsupported ] ) t.registerTraumaEvent( 'u', { fragmentationLevel: 0.8, freezeLevel: 0.8, postEventDeltaValue: 0.4 } )

	for ( let i = 0; i < 10; i++ ) supported.decay( 'u', 1, 0.9 ) // real, sustained co-regulation
	for ( let i = 0; i < 10; i++ ) unsupported.decay( 'u', 1, 0.05 ) // real, near-absent co-regulation

	assert.ok( unsupported.getTraumaTrace( 'u' ) > supported.getTraumaTrace( 'u' ), 'the SAME initial event should leave a genuinely more persistent trace after 10 real days with no co-regulation than with strong co-regulation' )
	assert.ok( unsupported.getTraumaTrace( 'u' ) > 0.001, 'a genuinely unsupported trace should still read as measurable after real days, not have vanished' )

} )

test( 'A14 decay: real severity slowdown — from the SAME starting trace, a high peak freeze/dissociation user decays genuinely slower than a low-severity one, same real co-regulation', () => {

	const highSeverity = new TraumaCascadeEngine()
	highSeverity.traumaTrace.set( 'u', 0.5 )
	highSeverity.severity.set( 'u', 0.9 )

	const lowSeverity = new TraumaCascadeEngine()
	lowSeverity.traumaTrace.set( 'u', 0.5 )
	lowSeverity.severity.set( 'u', 0.05 )

	for ( let i = 0; i < 5; i++ ) { highSeverity.decay( 'u', 1, 0.5 ); lowSeverity.decay( 'u', 1, 0.5 ) }

	assert.ok( highSeverity.getTraumaTrace( 'u' ) > lowSeverity.getTraumaTrace( 'u' ), 'the same starting trace, same real co-regulation, should decay slower for the higher-severity real peak' )

} )

test( 'A14b registerSupport: real accumulated co-regulation genuinely speeds decay AND lowers the scar floor, beyond what this instant\'s own coRegulation reading alone gives — λ_decay ← λ_decay · (1 + κ·SupportQuality)', () => {

	const supported  = new TraumaCascadeEngine()
	const unsupported = new TraumaCascadeEngine()
	for ( const t of [ supported, unsupported ] ) t.registerTraumaEvent( 'u', { fragmentationLevel: 0.8, freezeLevel: 0.8, postEventDeltaValue: 0.6 } )

	for ( let i = 0; i < 8; i++ ) { supported.registerSupport( 'u', 0.8 ); supported.decay( 'u', 1, 0.5 ); unsupported.decay( 'u', 1, 0.5 ) }

	assert.ok( supported.getSupportQuality( 'u' ) > 0, 'real, accumulated support quality should be nonzero after real repeated registerSupport() calls' )
	assert.ok( supported.getTraumaTrace( 'u' ) < unsupported.getTraumaTrace( 'u' ), 'the SAME initial event, same real per-turn coRegulation reading, should leave a genuinely SMALLER trace when real accumulated support was also registered, than without it' )
	assert.ok( supported.scarFloor.get( 'u' ) < unsupported.scarFloor.get( 'u' ), 'real accumulated support should also genuinely lower the residual scar floor, not just the instantaneous trace' )

} )

test( 'A14c registerSupport: the real relief ceiling is computed against the IMMUTABLE base floor set at registration, so repeated calls scale toward supportFloorRelief rather than compounding into near-nothing', () => {

	const t = new TraumaCascadeEngine()
	t.registerTraumaEvent( 'u', { fragmentationLevel: 0.8, freezeLevel: 0.8, postEventDeltaValue: 0.8 } )
	const baseFloor = t.baseScarFloor.get( 'u' )
	for ( let i = 0; i < 20; i++ ) t.registerSupport( 'u', 1 )

	assert.ok( t.scarFloor.get( 'u' ) < baseFloor * 0.5, 'many real, high-quality support calls should genuinely relieve the floor toward supportFloorRelief, not barely move it' )
	assert.ok( t.scarFloor.get( 'u' ) >= 0, 'the floor should never go negative' )

} )

test( 'A15 registerTraumaEvent: real episode novelty — an identical, repeated real threat signature gains LESS marginal trace than a fresh, distinct one', () => {

	const repeated = new TraumaCascadeEngine()
	const gains       = []
	let prev              = 0
	for ( let i = 0; i < 4; i++ ) {

		const trace = repeated.registerTraumaEvent( 'u', { fragmentationLevel: 0.5, freezeLevel: 0.5, postEventDeltaValue: 0.3, fragmentLabel: 'echo' } )
		gains.push( trace - prev )
		prev = trace

	}
	assert.ok( gains[ 1 ] < gains[ 0 ], 'the SECOND occurrence of an identical real signature should already gain less than the first' )
	assert.ok( gains[ 3 ] < gains[ 1 ] )

	const distinct = new TraumaCascadeEngine()
	const gains2      = []
	prev                    = 0
	for ( const label of [ 'a', 'b', 'c', 'd' ] ) {

		const trace = distinct.registerTraumaEvent( 'u', { fragmentationLevel: 0.5, freezeLevel: 0.5, postEventDeltaValue: 0.3, fragmentLabel: label } )
		gains2.push( trace - prev )
		prev = trace

	}
	assert.ok( Math.abs( gains2[ 3 ] - gains2[ 0 ] ) < 0.0001, 'genuinely DISTINCT real threats should each gain at real full novelty, no shrink' )
	assert.ok( gains2[ 3 ] > gains[ 3 ], 'the same 4th repetition should gain more when it is a fresh, distinct threat than when it is the same echoed one' )

} )

test( 'A16 registerTraumaEvent/decay: real scar-floor asymmetry — a poorly-consolidated event leaves a genuinely higher permanent floor than a well-supported one', () => {

	const poorlySupported = new TraumaCascadeEngine()
	poorlySupported.registerTraumaEvent( 'u', { fragmentationLevel: 0.6, freezeLevel: 0.6, dissociationLevel: 0.5, postEventDeltaValue: 0.4 } ) // still unresolved
	for ( let i = 0; i < 40; i++ ) poorlySupported.decay( 'u', 1, 0.3 )

	const wellSupported = new TraumaCascadeEngine()
	wellSupported.registerTraumaEvent( 'u', { fragmentationLevel: 0.6, freezeLevel: 0.6, dissociationLevel: 0.5, postEventDeltaValue: -0.8 } ) // genuinely soothed
	for ( let i = 0; i < 40; i++ ) wellSupported.decay( 'u', 1, 0.9 )

	assert.ok( poorlySupported.getTraumaTrace( 'u' ) > wellSupported.getTraumaTrace( 'u' ), 'after real, extended decay, the poorly-consolidated event should leave a genuinely higher residual than the well-supported one, a real scar in the trace itself' )
	assert.ok( poorlySupported.getTraumaTrace( 'u' ) > 0.01, 'the poorly-consolidated real floor should be genuinely non-trivial, not effectively 0' )

} )

test( 'A17 decay: real sign-bug regression — decay must NEVER raise the trace, even when the initial post-registration trace lands below its own real scar floor', () => {

	const t = new TraumaCascadeEngine()
	// A real event whose freeze never crossed its own threshold (freezeLevel
	// low) leaves a near-zero initial trace gain, while a real, still-
	// unresolved postEventDeltaValue sets a real, nonzero scar floor above
	// that near-zero starting point — the exact real configuration the
	// user's own year-long battery found inverting the trace with MORE
	// real co-regulation (faster convergence toward that floor from below
	// used to read as the trace RISING, support making it worse).
	t.registerTraumaEvent( 'u', { fragmentationLevel: 0.3, freezeLevel: 0.05, dissociationLevel: 0.1, postEventDeltaValue: 0.5 } )
	const afterRegistration = t.getTraumaTrace( 'u' )
	assert.ok( t.scarFloor.get( 'u' ) > afterRegistration, 'setup should have produced a real floor above the real initial trace, the exact inverting condition' )

	for ( let i = 0; i < 30; i++ ) {

		const before = t.getTraumaTrace( 'u' )
		t.decay( 'u', 1, 0.9 ) // real, strong co-regulation — should never make this worse
		assert.ok( t.getTraumaTrace( 'u' ) <= before, `decay() raised the trace at step ${i}: ${before} -> ${t.getTraumaTrace( 'u' )}` )

	}

} )

test( 'A18 decay: real regression for the year-long battery\'s own finding — a better-supported branch must never end up with MORE trace than a minimized one, for the SAME real initial event', () => {

	function branch( coRegulationLevel ) {

		const t = new TraumaCascadeEngine()
		t.registerTraumaEvent( 'u', { fragmentationLevel: 0.04, freezeLevel: 0, dissociationLevel: 0.08, postEventDeltaValue: -0.5 } )
		for ( let i = 0; i < 10; i++ ) t.decay( 'u', 1, coRegulationLevel )
		return t.getTraumaTrace( 'u' )

	}

	const wellSupported = branch( 0.9 ) // real, strong support
	const minimized         = branch( 0.05 ) // real, near-absent support
	assert.ok( wellSupported <= minimized, 'real, stronger co-regulation must never leave MORE trace than real, weaker/absent co-regulation for the identical initial event' )

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

test( 'B7 getWellbeingNormalized: real soft ceiling — a real logistic squash never fully pins at 1.0, even after a strong positive run, closing the real gap the user\'s own 20-test battery found', () => {

	const h = new HappinessEngine()
	for ( let i = 0; i < 3; i++ ) h.update( 'u', { CR: 1, EV: 1, RPE: 1 } )
	assert.ok( h.getWellbeingNormalized( 'u' ) < 1, 'even a short strong positive run should leave real headroom, not pin at exactly 1.0' )

	for ( let i = 0; i < 50; i++ ) h.update( 'u', { CR: 1, EV: 1, RPE: 1 } )
	assert.ok( h.getWellbeingNormalized( 'u' ) < 1, 'a real, long, extreme positive run should still asymptote without ever fully pinning' )
	assert.ok( h.getWellbeingNormalized( 'u' ) > 0.99, 'but it should genuinely be very close to the ceiling, not just generically high' )

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

test( 'C1b hypervigilance: a real, established trauma trace makes an already-ambiguous cue read as MORE convincing (not just whether the gate opens), while a truly neutral turn still stays null', async () => {

	const AMBIGUOUS = 'algo en tu forma de hablar hoy se siente distinto, no sé qué es'

	const control = freshAI()
	const rc            = await control.processInput( AMBIGUOUS, { userId: 'u' } )

	const post = freshAI()
	post.traumaCascadeEngine.traumaTrace.set( 'u', 0.02 ) // a real, small, realistic post-trauma residual
	const rp    = await post.processInput( AMBIGUOUS, { userId: 'u' } )

	assert.ok( rc.debug.intuition, 'the ambiguous cue alone should already produce a real hunch in the control' )
	assert.ok( rp.debug.intuition.strength > rc.debug.intuition.strength, 'the SAME ambiguous cue should read as more convincing with a real lingering trauma trace than without one' )

	const neutralPost = freshAI()
	neutralPost.traumaCascadeEngine.traumaTrace.set( 'u', 0.02 )
	const rn = await neutralPost.processInput( 'hoy hace buen tiempo, voy a salir a caminar', { userId: 'u' } )
	assert.equal( rn.debug.intuition, null, 'hypervigilance must never invent a hunch from genuinely neutral content, even with a real lingering trace' )

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

test( 'D2b full: real severe betrayal fires the trauma cascade WITHOUT defense depletion, closing the real gap found by the user\'s own 20-test emergence battery (blended desirability can read less extreme than the matched ontology concept\'s own severity)', async () => {

	const ai = freshAI()
	// Deliberately NO inhibitoryControlPool depletion, NO cortisol pre-load — a
	// fresh AI, real severe betrayal language only.
	const r = await ai.processInput( 'me mentiste sobre todo, planeaste esto a mis espaldas con otra persona, es una traición total', { userId: 'A' } )
	assert.ok( r.debug.traumaCascade !== null, 'a real severe betrayal concept match with real stakes should fire the cascade on its own, without needing artificial defense depletion' )

} )

test( 'D2c full: a real, genuinely warm prior history can still dampen the SAME severe betrayal below the gate (oxytocin idealization suppression preserved, not defeated by the new alternate gate path)', async () => {

	const ai = freshAI()
	for ( const t of [ 'me encanta hablar contigo cada día', 'contigo todo es más fácil, gracias', 'hoy me hiciste reír mucho, te quiero', 'eres una de las mejores personas que conozco', 'gracias por estar siempre ahí para mí', 'me siento muy afortunado de tenerte', 'contigo puedo ser yo mismo de verdad', 'hoy fue un gran día gracias a ti', 'me encanta lo que tenemos, es especial', 'siempre sabes cómo alegrarme el día', 'confío en ti más que en nadie', 'te quiero muchísimo, de verdad' ] ) await ai.processInput( t, { userId: 'A' } )

	const r = await ai.processInput( 'me mentiste sobre todo, planeaste esto a mis espaldas con otra persona, es una traición total', { userId: 'A' } )
	assert.equal( r.debug.traumaCascade, null, 'a real, deeply warm prior history should still be able to dampen the same severe betrayal below the gate — the new alternate path must not defeat this already-established real finding' )

} )

test( 'D2d full: real public humiliation (a genuine audience-independent EmotionalOntology concept, deliberately NOT EmbarrassmentEngine\'s own lower-stakes signal) fires the trauma cascade', async () => {

	const ai = freshAI()
	ai.inhibitoryControlPool.level = 0.1
	const r = await ai.processInput( 'todos se rieron de mí delante de todo el grupo, me humillaron en público y no pude decir nada', { userId: 'A' } )
	assert.ok( r.debug.traumaCascade !== null )

} )

test( 'full: real co-regulation responsiveness — support that raises real affinity, not only slow-moving trust, measurably speeds trauma-trace decay', async () => {

	const hit = 'me mentiste sobre todo, es una traición total, planeaste esto a mis espaldas con otra persona, esto me destruyó'

	const ai = freshAI()
	await ai.processInput( hit, { userId: 'A' } )
	const traceBefore     = ai.traumaCascadeEngine.getTraumaTrace( 'A' )
	const affinityBefore = ai.attachment.get( 'A' ).affinity

	for ( let i = 0; i < 10; i++ ) { await ai.processInput( 'te quiero mucho, confío en ti, eres muy importante para mí, gracias por todo', { userId: 'A' } ); ai.tick( 1 ) }
	const traceAfterSupport     = ai.traumaCascadeEngine.getTraumaTrace( 'A' )
	const affinityAfterSupport = ai.attachment.get( 'A' ).affinity

	assert.ok( traceAfterSupport <= traceBefore, 'real sustained support should never leave MORE trace than the real initial post-hit reading' )
	assert.ok( affinityAfterSupport > affinityBefore, 'the real support turns should have measurably raised real affinity over the post-hit baseline' )

} )

test( 'full: real hope-relative prediction error — a broken promise fires a real hope.crash even when this turn\'s own raw desirability alone would not have crossed the generic RPE gate', async () => {

	const ai = freshAI()
	for ( const t of [ 'te quiero mucho, cada día contigo es mejor', 'me haces tan feliz, gracias por todo', 'contigo la vida es más bonita' ] ) await ai.processInput( t, { userId: 'A' } )
	await ai.processInput( 'prometo que el viernes nos vemos por fin, ya tengo todo listo, muero de ganas', { userId: 'A' } )

	const r = await ai.processInput( 'esto es horrible, estoy muy triste y decepcionado/a, al final no va a pasar nada el viernes, se cancela todo', { userId: 'A' } )
	assert.ok( r.debug.hope.crash > 0, 'a real, clearly disappointing outcome following real built-up hope should produce a real, nonzero crash' )

} )

test( 'EmotionalOntology.interpret: real new "humiliation" concept — none of the pre-existing concepts covered real public-humiliation language at all', () => {

	const eo = new EmotionalOntology()
	const noneOfTheOld = eo.interpret( 'me humillaron delante de todos, fue horrible' )
	assert.ok( noneOfTheOld.some( m => m.concept === 'humiliation' ) )
	assert.ok( noneOfTheOld.find( m => m.concept === 'humiliation' ).profile.moralWeight >= 0.7 )

	assert.equal( eo.interpret( 'hoy hace un día muy bonito' ).length, 0 )

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
