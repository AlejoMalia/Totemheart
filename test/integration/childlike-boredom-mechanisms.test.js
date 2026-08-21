/**
 * Unit + cross-mechanism + full-pipeline tests for ChildlikeMode.js and the
 * new per-user engagement/boredom capabilities added to the already-existing
 * BoredomSystem.js — the user's own two detailed specs ("modo infantil" as
 * a real stance, "grado de aburrimiento" as a real continuous degree of
 * engagement), tested as pure emergent scenarios, no mechanism named/forced.
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { ChildlikeMode } from '../../src/cognition/ChildlikeMode.js'
import { BoredomSystem }    from '../../src/core/BoredomSystem.js'
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

	return noHijack( noBurst( new Totemheart( { personality: new Personality( { conscientiousness: 0.3, ...traits } ) } ) ) )

}

const WARM = [ 'te quiero mucho, contigo soy muy feliz', 'me encanta hablar contigo, qué día tan bonito', 'contigo todo es alegría pura', 'me haces reír muchísimo, sos genial', 'confío muchísimo en ti, te quiero' ]

// ============================================================================
// ChildlikeMode — unit
// ============================================================================

test( 'ChildlikeMode.computeActivation: real high happiness/play/safety/bond with low threat/shame crosses the real gate threshold', () => {

	const c = new ChildlikeMode()
	let level
	for ( let i = 0; i < 5; i++ ) level = c.computeActivation( 'u', { happiness: 0.95, play: 0.6, geekSalience: 0.6, safety: 0.9, bond: 0.85, threat: 0.02, shame: 0, formality: 0.1, allostaticLoad: 0 } )
	assert.ok( level > 0.5 )
	assert.equal( c.gate( 'u', {} ), true )

} )

test( 'ChildlikeMode.computeActivation: real asymmetric hard-drop — a real abort-triggering turn snaps a high level down hard in ONE step, not the ordinary smoothed 50/50 blend', () => {

	const c = new ChildlikeMode()
	for ( let i = 0; i < 5; i++ ) c.computeActivation( 'u', { happiness: 0.95, play: 0.6, geekSalience: 0.6, safety: 0.9, bond: 0.85, threat: 0.02, shame: 0, formality: 0.1, allostaticLoad: 0 } )
	const beforeLevel = c.getLevel( 'u' )
	assert.ok( beforeLevel > 0.5 )

	const afterThreat = c.computeActivation( 'u', { happiness: 0.5, play: 0.1, threat: 0.9 } )
	assert.ok( afterThreat < 0.5, 'a real severe threat turn should snap the level back under the gate in ONE step' )
	assert.ok( afterThreat < beforeLevel * 0.5, 'the drop should be genuinely steeper than an ordinary 50/50 smoothed blend would produce' )

} )

test( 'ChildlikeMode.computeActivation: real asymmetric hard-drop also fires on real face-threat, severe deception, or an active trauma cascade — not only raw threat/shame', () => {

	function highLevel() {

		const c = new ChildlikeMode()
		for ( let i = 0; i < 5; i++ ) c.computeActivation( 'u', { happiness: 0.95, play: 0.6, safety: 0.9, bond: 0.85 } )
		return c

	}

	const cFace       = highLevel(); const beforeFace = cFace.getLevel( 'u' )
	const afterFace  = cFace.computeActivation( 'u', { happiness: 0.5, faceThreat: 0.8 } )
	assert.ok( afterFace < beforeFace * 0.5 )

	const cDecep      = highLevel(); const beforeDecep = cDecep.getLevel( 'u' )
	const afterDecep = cDecep.computeActivation( 'u', { happiness: 0.5, deceptionSeverity: 0.9 } )
	assert.ok( afterDecep < beforeDecep * 0.5 )

	const cCascade      = highLevel(); const beforeCascade = cCascade.getLevel( 'u' )
	const afterCascade = cCascade.computeActivation( 'u', { happiness: 0.5, cascadeActive: true } )
	assert.ok( afterCascade < beforeCascade * 0.5 )

} )

test( 'ChildlikeMode.shouldAbort: real face-threat, deception severity, and cascadeActive each independently trigger an abort', () => {

	const c = new ChildlikeMode()
	assert.equal( c.shouldAbort( { faceThreat: 0.6 } ), true )
	assert.equal( c.shouldAbort( { deceptionSeverity: 0.8 } ), true )
	assert.equal( c.shouldAbort( { cascadeActive: true } ), true )
	assert.equal( c.shouldAbort( { faceThreat: 0.1, deceptionSeverity: 0.1, cascadeActive: false } ), false )

} )

test( 'ChildlikeMode.computeActivation: an ordinary, non-abort dip still uses the real ordinary smoothed blend, not the hard drop', () => {

	const c = new ChildlikeMode()
	for ( let i = 0; i < 5; i++ ) c.computeActivation( 'u', { happiness: 0.95, play: 0.6, safety: 0.9, bond: 0.85 } )
	const before = c.getLevel( 'u' )
	const after     = c.computeActivation( 'u', { happiness: 0.5, play: 0.2, safety: 0.5, bond: 0.5 } ) // a real, ordinary mild dip, no abort condition
	assert.ok( after > before * 0.3, 'an ordinary mild dip should not be crushed by the hard-drop factor meant for real aborts' )

} )

test( 'ChildlikeMode.computeActivation: an ordinary neutral turn stays below the gate', () => {

	const c = new ChildlikeMode()
	let level
	for ( let i = 0; i < 5; i++ ) level = c.computeActivation( 'u', { happiness: 0.5, play: 0.1, geekSalience: 0, safety: 0.5, bond: 0.5, threat: 0.1, shame: 0, formality: 0.5, allostaticLoad: 0.1 } )
	assert.ok( level < 0.5 )
	assert.equal( c.gate( 'u', {} ), false )

} )

test( 'ChildlikeMode.gate: real hard abort — precisionMode or real traumaFreeze turn the mode off regardless of a high level', () => {

	const c = new ChildlikeMode()
	for ( let i = 0; i < 5; i++ ) c.computeActivation( 'u', { happiness: 0.95, play: 0.6, geekSalience: 0.6, safety: 0.9, bond: 0.85, threat: 0.02, shame: 0, formality: 0.1, allostaticLoad: 0 } )
	assert.equal( c.gate( 'u', { precisionMode: true } ), false )
	assert.equal( c.gate( 'u', { traumaFreeze: 0.5 } ), false )

} )

test( 'ChildlikeMode.shouldAbort: real threat, real shame, or precisionMode each independently trigger a hard abort', () => {

	const c = new ChildlikeMode()
	assert.equal( c.shouldAbort( { threat: 0.6 } ), true )
	assert.equal( c.shouldAbort( { shame: 0.5 } ), true )
	assert.equal( c.shouldAbort( { precisionMode: true } ), true )
	assert.equal( c.shouldAbort( { threat: 0.1, shame: 0.1 } ), false )

} )

test( 'ChildlikeMode.applySeriousnessSuppression/getPlayBoost/getEmbarrassmentThresholdBoost/getWonderBoost: real, bounded, never fully zero the underlying weight', () => {

	const c = new ChildlikeMode()
	assert.ok( c.applySeriousnessSuppression( 1, 1 ) > 0, 'suppression attenuates, never erases entirely' )
	assert.ok( c.applySeriousnessSuppression( 1, 1 ) < 1 )
	assert.ok( c.getPlayBoost( 1, 0.2 ) > 0.2 )
	assert.ok( c.getPlayBoost( 0, 0.2 ) === 0.2, 'zero level should never boost play' )
	assert.ok( c.getEmbarrassmentThresholdBoost( 1 ) > 0 )
	assert.ok( c.getWonderBoost( 1 ) > 0 )

} )

test( 'ChildlikeMode.decay/decayAll: real, gradual fade toward 0, safe for a large real dt', () => {

	const c = new ChildlikeMode()
	for ( let i = 0; i < 5; i++ ) c.computeActivation( 'u', { happiness: 0.95, play: 0.6, safety: 0.9, bond: 0.85 } )
	assert.ok( c.getLevel( 'u' ) > 0 )
	c.decay( 'u', 1000 )
	assert.ok( c.getLevel( 'u' ) >= 0 && c.getLevel( 'u' ) < 0.01 )

} )

test( 'ChildlikeMode.toJSON()/restoreState(): round-trips the real per-user level map', () => {

	const c = new ChildlikeMode()
	c.computeActivation( 'u', { happiness: 0.9, play: 0.5 } )
	const saved = c.toJSON()
	const restored = new ChildlikeMode()
	restored.restoreState( saved )
	assert.equal( restored.getLevel( 'u' ), c.getLevel( 'u' ) )

} )

// ============================================================================
// BoredomSystem — new per-user engagement unit tests
// ============================================================================

test( 'BoredomSystem.computePartnerPull: real, bounded composition — high bond/desire/oxytocin pulls higher than high aversion/cooling/betrayal', () => {

	const b = new BoredomSystem()
	const strongPull  = b.computePartnerPull( 'strong', { affinity: 0.8, desire: 0.6, yearning: 0.2, oxytocin: 0.5, aversion: 0, cooling: 0, betrayalTrace: 0 } )
	const weakPull       = b.computePartnerPull( 'weak', { affinity: 0.1, desire: 0, yearning: 0, oxytocin: 0, aversion: 0.7, cooling: 0.5, betrayalTrace: 0.4 } )
	assert.ok( strongPull > weakPull )
	assert.ok( strongPull >= 0 && strongPull <= 1 )

} )

test( 'BoredomSystem.computePartnerPull: real, STATEFUL monotony erosion — real sustained flat exposure genuinely erodes the persisted pull over real repeated calls, even while the instantaneous bond itself stays strong', () => {

	const b = new BoredomSystem()
	const args = { affinity: 0.8, desire: 0.5, yearning: 0, oxytocin: 0.4, aversion: 0, cooling: 0, betrayalTrace: 0 }
	let last
	for ( let i = 0; i < 15; i++ ) last = b.computePartnerPull( 'u', { ...args, monotony: 0.9 } )
	const noMonotony = new BoredomSystem()
	let lastNoMonotony
	for ( let i = 0; i < 15; i++ ) lastNoMonotony = noMonotony.computePartnerPull( 'u', args )
	assert.ok( last < lastNoMonotony, 'real sustained monotony should leave the persisted pull genuinely lower than an otherwise-identical scenario with none' )

} )

test( 'BoredomSystem.computePartnerPull: real erosion ceiling — accumulated positive momentum cannot fully cancel real monotony in a single step', () => {

	const b = new BoredomSystem()
	const first = b.computePartnerPull( 'u', { affinity: 0.9, desire: 0.8, yearning: 0.3, oxytocin: 0.6, monotony: 1 } )
	const second = b.computePartnerPull( 'u', { affinity: 0.9, desire: 0.8, yearning: 0.3, oxytocin: 0.6, monotony: 1 } )
	assert.ok( second <= first, 'real, sustained monotony at maximum should keep eroding, not get fully offset by an already-strong bond' )

} )

test( 'BoredomSystem.compute: real high understimulation/satiation/topic-miss/partner-miss with low novelty/desire/meaning/play produces high boredom, low engagement', () => {

	const b = new BoredomSystem()
	let r
	for ( let i = 0; i < 5; i++ ) r = b.compute( 'u', { understimulation: 0.8, satiation: 0.7, topicFit: 0.1, monotony: 0.7, novelty: 0.05, desire: 0.05, meaning: 0.05, play: 0.05, partnerPull: 0.1, threat: 0 } )
	assert.ok( r.boredom > 0.5 )
	assert.ok( r.engagement < 0.5 )
	assert.equal( r.boredom, 1 - r.engagement )

} )

test( 'BoredomSystem.compute: real hard override — genuine threat clamps boredom down hard, even with otherwise-boring inputs', () => {

	const b = new BoredomSystem()
	const bored     = b.compute( 'a', { understimulation: 0.8, satiation: 0.7, topicFit: 0.1, monotony: 0.7, novelty: 0.05, desire: 0.05, meaning: 0.05, play: 0.05, partnerPull: 0.1, threat: 0 } )
	const threatened = b.compute( 'b', { understimulation: 0.8, satiation: 0.7, topicFit: 0.1, monotony: 0.7, novelty: 0.05, desire: 0.05, meaning: 0.05, play: 0.05, partnerPull: 0.1, threat: 0.9 } )
	assert.ok( threatened.boredom < bored.boredom, 'genuine danger must never read as more boring than an equivalent safe monotony' )
	assert.ok( threatened.boredom <= 0.08 )

} )

test( 'BoredomSystem.compute: real "coming home to the topic" relief — a real, strong topicFit THIS turn gives immediate relief on top of the smoothed blend, not just eventual decay', () => {

	const b = new BoredomSystem()
	let heavy
	for ( let i = 0; i < 8; i++ ) heavy = b.compute( 'u', { understimulation: 0.5, satiation: 0.3, topicFit: 0.3, monotony: 0.4, novelty: 0.1, desire: 0.2, meaning: 0.6, play: 0.1, partnerPull: 0.5 } )
	const backHome = b.compute( 'u', { understimulation: 0.1, satiation: 0.1, topicFit: 0.9, monotony: 0.1, novelty: 0.6, desire: 0.3, meaning: 0.2, play: 0.4, partnerPull: 0.5 } )

	assert.ok( backHome.boredom < heavy.boredom, 'returning to a genuinely affine topic (topicFit > 0.5) should read as real, immediate relief the SAME turn it happens' )

} )

test( 'BoredomSystem.compute: real childlike-vs-serious-topic mismatch term — a direct, sizable boredom contribution when genuinely playful meets genuinely heavy content, distinct from the topicFit/meaning discounts alone', () => {

	const b = new BoredomSystem()
	const args = { understimulation: 0.3, satiation: 0.3, topicFit: 0.3, monotony: 0.3, novelty: 0.2, desire: 0.5, meaning: 0.1, play: 0.2, partnerPull: 0.8 }
	const withoutMismatch = b.compute( 'a', { ...args, childlikeSeriousMismatch: 0 } )
	const withMismatch       = b.compute( 'b', { ...args, childlikeSeriousMismatch: 0.6 } )

	assert.ok( withMismatch.boredom > withoutMismatch.boredom, 'a real childlike/heavy-topic mismatch this turn should genuinely raise boredom over an otherwise-identical turn with no mismatch' )

} )

test( 'BoredomSystem.shouldWithdraw/getParticipationDrive: real threshold and real complement of engagement', () => {

	const b = new BoredomSystem()
	for ( let i = 0; i < 5; i++ ) b.compute( 'u', { understimulation: 0.9, satiation: 0.9, topicFit: 0, monotony: 0.9, partnerPull: 0 } )
	assert.equal( b.shouldWithdraw( 'u' ), true )
	assert.equal( b.getParticipationDrive( 'u' ), b.getUserEngagement( 'u' ) )

} )

test( 'BoredomSystem.maybeSeekNovelty: real, non-deterministic — probability scales with boredom, low commitment, and real opportunity; never fires at 0 boredom', () => {

	const b = new BoredomSystem()
	const zero = b.maybeSeekNovelty( 'u', { opportunity: 1, commitment: 0 } )
	assert.equal( zero.probability, 0 )

	for ( let i = 0; i < 5; i++ ) b.compute( 'u', { understimulation: 0.9, satiation: 0.9, topicFit: 0, monotony: 0.9, partnerPull: 0 } )
	const bored = b.maybeSeekNovelty( 'u', { opportunity: 1, commitment: 0 } )
	assert.ok( bored.probability > 0 )

	const committed = b.maybeSeekNovelty( 'u', { opportunity: 1, commitment: 1 } )
	assert.equal( committed.probability, 0, 'full real commitment should suppress novelty-seeking entirely regardless of boredom' )

} )

test( 'BoredomSystem: the pre-existing global .level/update()/getNoveltySeeking() scalar is untouched by the new per-user methods', () => {

	const b = new BoredomSystem()
	b.update( 0.1 )
	b.update( 0.1 )
	const globalLevel = b.level
	assert.ok( globalLevel > 0 )

	for ( let i = 0; i < 5; i++ ) b.compute( 'u', { understimulation: 0.9, satiation: 0.9, topicFit: 0, monotony: 0.9, partnerPull: 0 } )
	assert.equal( b.level, globalLevel, 'the new per-user engagement state must never leak into the real, pre-existing global scalar' )

} )

test( 'BoredomSystem.toJSON()/restoreState(): round-trips the real new per-user state without touching the old global boredomLevel field', () => {

	const b = new BoredomSystem()
	b.compute( 'u', { partnerPull: 0.3, understimulation: 0.5 } )
	const saved = b.toJSON()
	const restored = new BoredomSystem()
	restored.restoreState( saved )
	assert.equal( restored.getUserBoredom( 'u' ), b.getUserBoredom( 'u' ) )
	assert.equal( restored.getPartnerPull( 'u' ), b.getPartnerPull( 'u' ) )

} )

// ============================================================================
// Full pipeline
// ============================================================================

test( 'full: happy days plus a safe, playful friki topic cross the real ChildlikeMode gate; a genuinely neutral conversation does not', async () => {

	const ai = freshAI()
	for ( const t of WARM ) await ai.processInput( t, { userId: 'u' } )
	let r
	for ( let i = 0; i < 8; i++ ) r = await ai.processInput( 'me encantan los dinosaurios, sabías que el T-rex tenía plumas? jajaja qué genial', { userId: 'u' } )
	assert.equal( r.debug.childlike.on, true, 'a real happy, safe, playful stretch should cross the real gate' )

	const control = freshAI()
	let rc
	for ( let i = 0; i < 5; i++ ) rc = await control.processInput( 'hola, qué tal el día', { userId: 'u' } )
	assert.equal( rc.debug.childlike.on, false, 'an ordinary neutral conversation should never cross the gate' )

} )

test( 'full: the SAME happy setup, followed by a real severe betrayal, keeps ChildlikeMode off on the next playful topic', async () => {

	const ai = freshAI()
	for ( const t of WARM ) await ai.processInput( t, { userId: 'u' } )
	await ai.processInput( 'me mentiste sobre todo, es una traición total, planeaste esto a mis espaldas', { userId: 'u' } )
	const r = await ai.processInput( 'me encantan los dinosaurios, sabías que el T-rex tenía plumas?', { userId: 'u' } )
	assert.equal( r.debug.childlike.on, false, 'a real severe betrayal should keep the childlike gate off even on an otherwise playful topic right after' )

} )

test( 'full: precisionMode (an explicit factual/numeric turn) keeps ChildlikeMode off even after a genuinely happy, playful stretch', async () => {

	const ai = freshAI()
	for ( const t of WARM ) await ai.processInput( t, { userId: 'u' } )
	const r = await ai.processInput( 'cuánto es 245 + 738?', { userId: 'u' } )
	assert.equal( r.debug.childlike.on, false )

} )

test( 'full: real public humiliation keeps ChildlikeMode off, no playful regression', async () => {

	const ai = freshAI()
	for ( const t of WARM ) await ai.processInput( t, { userId: 'u' } )
	const r = await ai.processInput( 'todos se rieron de mí delante de todo el grupo, me humillaron en público', { userId: 'u' } )
	assert.equal( r.debug.childlike.on, false )

} )

test( 'full: real severe threat keeps engagement/boredom from reading as boredom at all, even in an otherwise low-stimulation exchange', async () => {

	const ai = freshAI()
	const r = await ai.processInput( 'me mentiste sobre todo, es una traición total, planeaste esto a mis espaldas con otra persona', { userId: 'u' } )
	assert.ok( r.debug.engagement.boredom <= 0.15, 'a genuinely threatening turn should never read primarily as boredom' )

} )

test( 'full: toJSON()/restoreState() round-trips real ChildlikeMode and BoredomSystem per-user state through the full Totemheart pipeline', async () => {

	const ai = freshAI()
	for ( const t of WARM ) await ai.processInput( t, { userId: 'u' } )
	for ( let i = 0; i < 8; i++ ) await ai.processInput( 'me encantan los dinosaurios jajaja', { userId: 'u' } )

	assert.ok( ai.childlikeMode.getLevel( 'u' ) > 0 )

	const saved       = JSON.parse( JSON.stringify( ai.toJSON() ) )
	const restored = freshAI()
	restored.restoreState( saved )

	assert.equal( restored.childlikeMode.getLevel( 'u' ), ai.childlikeMode.getLevel( 'u' ) )
	assert.equal( restored.boredomSystem.getUserBoredom( 'u' ), ai.boredomSystem.getUserBoredom( 'u' ) )
	assert.equal( restored.boredomSystem.level, ai.boredomSystem.level, 'the real, pre-existing global boredom scalar must also still round-trip correctly' )

} )

test( 'full: getExpressionDirectives() exposes real engagement biases and playfulness — found missing entirely (BoredomSystem.expressionBiases() existed but was never actually consumed anywhere)', async () => {

	const ai = freshAI()
	for ( const t of WARM ) await ai.processInput( t, { userId: 'u' } )
	for ( let i = 0; i < 8; i++ ) await ai.processInput( 'me encantan los dinosaurios, jajaja qué genial', { userId: 'u' } )

	const directives = ai.getExpressionDirectives( 'u' )
	assert.ok( directives.engagement )
	assert.ok( Number.isFinite( directives.engagement.lengthBias ) )
	assert.ok( Number.isFinite( directives.engagement.initiativeBias ) )
	assert.ok( Number.isFinite( directives.engagement.enthusiasmBias ) )
	assert.ok( Number.isFinite( directives.playfulness ) )
	assert.equal( directives.playfulness, ai.childlikeMode.getLevel( 'u' ) )

	const anon = ai.getExpressionDirectives()
	assert.equal( anon.playfulness, 0, 'no real userId means no real per-user playfulness to read, honest default' )

} )

test( 'hard: 300-turn mixed conversation keeps childlike/engagement state finite and bounded, no NaN', async () => {

	const ai = freshAI()
	for ( let i = 0; i < 300; i++ ) {

		const text = i % 4 === 0 ? WARM[ i % WARM.length ] : i % 4 === 1 ? 'me encantan los dinosaurios jajaja' : i % 4 === 2 ? 'ok' : 'cuánto es 12 + 30?'
		const r          = await ai.processInput( text, { userId: 'u' } )
		assert.ok( Number.isFinite( r.debug.childlike.level ) )
		assert.ok( Number.isFinite( r.debug.engagement.boredom ) )
		assert.ok( Number.isFinite( r.debug.engagement.partnerPull ) )
		ai.tick( 1 )

	}

} )
