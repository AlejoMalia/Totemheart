/**
 * Direct unit tests for the 3 new pieces added per the user's own explicit
 * request: SocialGraphClassifier (per-person honest summary of already-real
 * signals), InfatuationEngine (a real, distinct "grado de enamoramiento"),
 * and JealousyTriangle's new hate/envy accumulation layer.
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { SocialGraphClassifier } from '../../src/social/SocialGraphClassifier.js'
import { InfatuationEngine }     from '../../src/social/InfatuationEngine.js'
import { JealousyTriangle }      from '../../src/social/JealousyTriangle.js'
import { Totemheart }            from '../../src/index.js'

// ============================================================================
// SocialGraphClassifier
// ============================================================================

test( 'SocialGraphClassifier.compute: high reciprocity/initiation/loyalty with no ghosting reads as genuine', () => {

	const c = new SocialGraphClassifier()
	const r = c.compute( 'friend', { reciprocity: 0.9, initiationShare: 0.8, warmthTrend: 0.5, ghosting: 0, loyalty: 0.8 } )
	assert.equal( r.classification, 'genuino' )
	assert.ok( r.genuineBond > 0.6 )

} )

test( 'SocialGraphClassifier.compute: low initiation/reciprocity (never reaches out, takes more than gives) reads as opportunista', () => {

	const c = new SocialGraphClassifier()
	const r = c.compute( 'user', { reciprocity: 0.1, initiationShare: 0.1, warmthTrend: 0, ghosting: 0.2, loyalty: 0.1 } )
	assert.equal( r.classification, 'oportunista' )
	assert.ok( r.opportunism > 0.6 )

} )

test( 'SocialGraphClassifier.rank: real, honest ordering by genuineBond across multiple tracked people', () => {

	const c = new SocialGraphClassifier()
	c.compute( 'a', { reciprocity: 0.9, initiationShare: 0.9, loyalty: 0.9 } )
	c.compute( 'b', { reciprocity: 0.2, initiationShare: 0.1, loyalty: 0.1 } )
	const ranked = c.rank()
	assert.equal( ranked[ 0 ].userId, 'a' )
	assert.equal( ranked.at( -1 ).userId, 'b' )

} )

test( 'SocialGraphClassifier.toJSON()/restoreState(): round-trips real per-person reads', () => {

	const c = new SocialGraphClassifier()
	c.compute( 'u', { reciprocity: 0.7, initiationShare: 0.6 } )
	const restored = new SocialGraphClassifier()
	restored.restoreState( c.toJSON() )
	assert.deepEqual( restored.get( 'u' ), c.get( 'u' ) )

} )

// ============================================================================
// InfatuationEngine
// ============================================================================

test( 'InfatuationEngine.computeSpark: a real, strong stimulus crosses the threshold and fires once; a weak one never does', () => {

	const e = new InfatuationEngine()
	const strong = e.computeSpark( 'strong', 0.9 )
	assert.equal( strong.fired, true )
	assert.equal( e.isSparked( 'strong' ), true )

	const weak = e.computeSpark( 'weak', 0.1 )
	assert.equal( weak.fired, false )
	assert.equal( e.isSparked( 'weak' ), false )

} )

test( 'InfatuationEngine.computeSpark: real one-shot gate — calling again after firing never re-fires or resets state', () => {

	const e = new InfatuationEngine()
	e.computeSpark( 'u', 0.9 )
	const d0 = e.getDopamine( 'u' )
	const second = e.computeSpark( 'u', 0.9 )
	assert.equal( second.fired, false )
	assert.equal( e.getDopamine( 'u' ), d0 )

} )

test( 'InfatuationEngine.updateChemistry: real dopamine build from sustained exposure, and real serotonin dip while dopamine is high (the real obsessive-thinking signature)', () => {

	const e = new InfatuationEngine()
	e.computeSpark( 'u', 0.9 )
	let last
	for ( let i = 0; i < 10; i++ ) last = e.updateChemistry( 'u', 0.8 )
	assert.ok( last.dopamine > 0.3, 'sustained real exposure should genuinely build dopamine' )
	assert.ok( last.serotonin < 1, 'sustained high dopamine should genuinely suppress serotonin below its own basal level' )

} )

test( 'InfatuationEngine.updateChemistry: without sustained exposure, dopamine decays back down', () => {

	const e = new InfatuationEngine()
	e.computeSpark( 'u', 0.9 )
	for ( let i = 0; i < 5; i++ ) e.updateChemistry( 'u', 0.9 )
	const peak = e.getDopamine( 'u' )
	for ( let i = 0; i < 20; i++ ) e.updateChemistry( 'u', 0 )
	assert.ok( e.getDopamine( 'u' ) < peak, 'real dopamine should genuinely decay once real exposure stops' )

} )

test( 'InfatuationEngine.updateReciprocalDynamics: real Strogatz-style reciprocal amplification — a consistently high reported otherInfatuation raises the self reading over repeated real calls', () => {

	const reciprocated  = new InfatuationEngine()
	const unrequited        = new InfatuationEngine()
	for ( const e of [ reciprocated, unrequited ] ) e.computeSpark( 'u', 0.9 )

	let rLast, uLast
	for ( let i = 0; i < 10; i++ ) { rLast = reciprocated.updateReciprocalDynamics( 'u', 0.9 ); uLast = unrequited.updateReciprocalDynamics( 'u', 0 ) }

	assert.ok( rLast > uLast, 'being genuinely reciprocated should read a real, higher reciprocal amplification than being met with nothing' )

} )

test( 'InfatuationEngine.getInfatuationLevel: 0 for anyone never sparked, real nonzero composite once sparked and chemistry/reciprocity have built up', () => {

	const e = new InfatuationEngine()
	assert.equal( e.getInfatuationLevel( 'never' ), 0 )

	e.computeSpark( 'u', 0.9 )
	for ( let i = 0; i < 10; i++ ) { e.updateChemistry( 'u', 0.8 ); e.updateReciprocalDynamics( 'u', 0.7 ) }
	const level = e.getInfatuationLevel( 'u', { attachmentLevel: 0.2 } )
	assert.ok( level > 0 )
	assert.ok( level <= 1 )

} )

test( 'InfatuationEngine.getInfatuationLevel: real time-based blend — a real, long attachment history contributes measurably more than an equally-brief one, holding chemistry equal', () => {

	const early = new InfatuationEngine()
	early.computeSpark( 'u', 0.9 )
	early.updateChemistry( 'u', 0.3 )
	early.updateReciprocalDynamics( 'u', 0.2 )

	const earlyLevelLowAttachment  = early.getInfatuationLevel( 'u', { attachmentLevel: 0.1, now: early.firstContactAt.get( 'u' ) + 1000 } )
	const earlyLevelHighAttachment = early.getInfatuationLevel( 'u', { attachmentLevel: 0.9, now: early.firstContactAt.get( 'u' ) + 1000 } )
	// Early on (attachWeight ~ 0), a high vs low attachmentLevel input shouldn't move the read much.
	assert.ok( Math.abs( earlyLevelHighAttachment - earlyLevelLowAttachment ) < 0.15 )

	const laterLevelHighAttachment = early.getInfatuationLevel( 'u', { attachmentLevel: 0.9, now: early.firstContactAt.get( 'u' ) + 1000 * 60 * 60 * 24 * 30 * 12 } )
	// A year later (attachWeight ~ 1), the same high attachmentLevel input should dominate.
	assert.ok( laterLevelHighAttachment > earlyLevelHighAttachment )

} )

test( 'InfatuationEngine.getObsessiveThinking: real, nonzero only once dopamine is active AND serotonin has genuinely dipped', () => {

	const e = new InfatuationEngine()
	assert.equal( e.getObsessiveThinking( 'never' ), 0 )
	e.computeSpark( 'u', 0.9 )
	for ( let i = 0; i < 10; i++ ) e.updateChemistry( 'u', 0.8 )
	assert.ok( e.getObsessiveThinking( 'u' ) > 0 )

} )

test( 'InfatuationEngine.toJSON()/restoreState(): round-trips real sparked/dopamine/serotonin/reciprocal/firstContactAt state', () => {

	const e = new InfatuationEngine()
	e.computeSpark( 'u', 0.9 )
	e.updateChemistry( 'u', 0.7 )
	e.updateReciprocalDynamics( 'u', 0.6 )
	const restored = new InfatuationEngine()
	restored.restoreState( e.toJSON() )
	assert.equal( restored.getDopamine( 'u' ), e.getDopamine( 'u' ) )
	assert.equal( restored.getSerotonin( 'u' ), e.getSerotonin( 'u' ) )
	assert.equal( restored.getReciprocal( 'u' ), e.getReciprocal( 'u' ) )
	assert.equal( restored.isSparked( 'u' ), true )

} )

// ============================================================================
// JealousyTriangle's new hate/envy layer
// ============================================================================

test( 'JealousyTriangle.registerAcaparation: real hate accumulates from repeated real agravio, and genuinely outpaces a rival who never takes attention', () => {

	const t = new JealousyTriangle()
	let hated, calm
	for ( let i = 0; i < 8; i++ ) { hated = t.registerAcaparation( 'B', 'F', 0.8 ); calm = t.registerAcaparation( 'B', 'nobody', 0 ) }
	assert.ok( hated > calm, 'a rival who genuinely keeps taking attention should read a real, higher hate than one who never does' )
	assert.ok( hated > 0 && hated <= 1 )

} )

test( 'JealousyTriangle.registerAcaparation: real self-reinforcing rumination — hate can keep climbing for a few real turns even after the acaparation stops, before natural dissipation wins', () => {

	const t = new JealousyTriangle()
	for ( let i = 0; i < 5; i++ ) t.registerAcaparation( 'B', 'F', 0.9 )
	const afterAgravio = t.getHate( 'B', 'F' )
	const nextStep         = t.registerAcaparation( 'B', 'F', 0 ) // no new agravio this turn
	assert.ok( nextStep >= afterAgravio * 0.9, 'real rumination should keep the very next reading close to or above the pre-existing level, not collapse instantly once the trigger stops' )

} )

test( 'JealousyTriangle.decayHate: real, gradual natural dissipation over many real ticks with no further agravio', () => {

	const t = new JealousyTriangle()
	for ( let i = 0; i < 5; i++ ) t.registerAcaparation( 'B', 'F', 0.9 )
	const peak = t.getHate( 'B', 'F' )
	for ( let i = 0; i < 100; i++ ) t.decayHate( 1 )
	assert.ok( t.getHate( 'B', 'F' ) < peak, 'real hate should genuinely dissipate over many real ticks with no further agravio' )

} )

test( 'JealousyTriangle.toJSON()/restoreState(): round-trips both real kindling and hate maps', () => {

	const t = new JealousyTriangle()
	t.computeKindling( 'rival', 0.5 )
	t.registerAcaparation( 'B', 'F', 0.7 )
	const restored = new JealousyTriangle()
	restored.restoreState( t.toJSON() )
	assert.equal( restored.getKindling( 'rival' ), t.getKindling( 'rival' ) )
	assert.equal( restored.getHate( 'B', 'F' ), t.getHate( 'B', 'F' ) )

} )

// ============================================================================
// Full-pipeline wiring
// ============================================================================

test( 'full: Totemheart exposes real socialGraphClassifier/infatuationEngine/jealousyTriangle instances, usable directly, with no NaN', async () => {

	const ai = new Totemheart()
	await ai.processInput( 'hola, me caes muy bien', { userId: 'B' } )

	ai.socialGraphClassifier.compute( 'B', { reciprocity: 0.7, initiationShare: 0.6 } )
	ai.infatuationEngine.computeSpark( 'B', 0.9 )
	ai.infatuationEngine.updateChemistry( 'B', 0.6 )
	const level = ai.infatuationEngine.getInfatuationLevel( 'B', { attachmentLevel: ai.oxytocinSystem.getLevel( 'B' ) } )
	ai.jealousyTriangle.registerAcaparation( 'B', 'F', 0.5 )

	assert.ok( Number.isFinite( level ) )
	assert.ok( Number.isFinite( ai.jealousyTriangle.getHate( 'B', 'F' ) ) )

} )

test( 'full: toJSON()/restoreState() round-trips real socialGraph/infatuationState/jealousyTriangleState through the full Totemheart pipeline', async () => {

	const ai = new Totemheart()
	await ai.processInput( 'hola', { userId: 'B' } )
	ai.socialGraphClassifier.compute( 'B', { reciprocity: 0.6 } )
	ai.infatuationEngine.computeSpark( 'B', 0.9 )
	ai.infatuationEngine.updateChemistry( 'B', 0.5 )
	ai.jealousyTriangle.registerAcaparation( 'B', 'F', 0.6 )

	const saved       = JSON.parse( JSON.stringify( ai.toJSON() ) )
	const restored = new Totemheart()
	restored.restoreState( saved )

	assert.deepEqual( restored.socialGraphClassifier.get( 'B' ), ai.socialGraphClassifier.get( 'B' ) )
	assert.equal( restored.infatuationEngine.getDopamine( 'B' ), ai.infatuationEngine.getDopamine( 'B' ) )
	assert.equal( restored.jealousyTriangle.getHate( 'B', 'F' ), ai.jealousyTriangle.getHate( 'B', 'F' ) )

} )
