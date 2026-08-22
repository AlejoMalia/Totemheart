/**
 * Direct unit tests for round-51: tier-2 items 9-14 (flirtation/humor wiring
 * checks, ProtectiveInstinctEngine, NostalgiaEngine's real compareToPast(),
 * ForgivenessProcess, ValidationSeekingEngine), plus the 2 new large
 * mechanisms: DeceptionDecisionEngine (Mentira/Verdad) and TrustRiskDecision
 * (the missing risk-decision layer on top of Attachment.trust +
 * IntuitionEngine.suspicion, which already implement the real asymmetric
 * dual-track Bayesian confianza/desconfianza mechanism).
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { NostalgiaEngine }                 from '../../src/social/NostalgiaEngine.js'
import { ProtectiveInstinctEngine } from '../../src/social/ProtectiveInstinctEngine.js'
import { ForgivenessProcess }             from '../../src/social/ForgivenessProcess.js'
import { ValidationSeekingEngine }   from '../../src/social/ValidationSeekingEngine.js'
import { DeceptionDecisionEngine }   from '../../src/cognition/DeceptionDecisionEngine.js'
import { TrustRiskDecision }               from '../../src/social/TrustRiskDecision.js'
import { Totemheart }                          from '../../src/index.js'

// ============================================================================
// NostalgiaEngine.compareToPast (item 12)
// ============================================================================

test( 'NostalgiaEngine.compareToPast: real decline signal only once current warmth sits clearly below a real tracked peak', () => {

	const n = new NostalgiaEngine()
	for ( let i = 0; i < 10; i++ ) n.registerWarmth( 'u', 0.9 )
	assert.equal( n.compareToPast( 'u', 0.85 ), 0, 'ordinary noise near the peak should not read as decline' )
	assert.ok( n.compareToPast( 'u', 0.3 ) > 0, 'a real, clear drop from the tracked peak should read as decline' )

} )

test( 'NostalgiaEngine: the real peak decays slowly but never resets from a single low reading', () => {

	const n = new NostalgiaEngine()
	for ( let i = 0; i < 5; i++ ) n.registerWarmth( 'u', 0.9 )
	n.registerWarmth( 'u', 0.1 )
	assert.ok( n.peakWarmth.get( 'u' ) > 0.5, 'a single low turn should not erase a real established peak' )

} )

// ============================================================================
// ProtectiveInstinctEngine (item 11)
// ============================================================================

test( 'ProtectiveInstinctEngine: real high bond + real high vulnerability crosses the protective threshold; either alone, low, does not', () => {

	const p = new ProtectiveInstinctEngine()
	assert.equal( p.evaluate( 0.9, 0.9 ).active, true )
	assert.equal( p.evaluate( 0.9, 0.1 ).active, false )
	assert.equal( p.evaluate( 0.1, 0.9 ).active, false )

} )

// ============================================================================
// ForgivenessProcess (item 13)
// ============================================================================

test( 'ForgivenessProcess: real phase sequence — unresolved while grievance is high, verbal once it drops but trust/oxytocin lag, reconciled once they catch up', () => {

	const f = new ForgivenessProcess()
	assert.equal( f.getPhase( 'u', 0.6, 0.3, 0.3 ).phase, 'unresolved' )
	assert.equal( f.getPhase( 'u', 0.05, 0.3, 0.3 ).phase, 'verbal', 'grievance resolved but trust/oxytocin still low should read verbal-only forgiveness' )
	assert.equal( f.getPhase( 'u', 0.05, 0.8, 0.8 ).phase, 'reconciled', 'grievance low AND trust/oxytocin caught up should read fully reconciled' )

} )

test( 'ForgivenessProcess: a real fresh grievance after verbal/reconciled forgiveness reads as reopened, not just unresolved again', () => {

	const f = new ForgivenessProcess()
	f.getPhase( 'u', 0.05, 0.8, 0.8 ) // reconciled
	const reopened = f.getPhase( 'u', 0.6, 0.8, 0.8 )
	assert.equal( reopened.phase, 'reopened' )

} )

// ============================================================================
// ValidationSeekingEngine (item 14)
// ============================================================================

test( 'ValidationSeekingEngine: real confirmed validation gives relief; a real minimized bid stings, and both clear the pending state', () => {

	const v = new ValidationSeekingEngine()
	v.evaluateBid( 'u', 0.9, 0.9 )
	assert.equal( v.hasPendingBid( 'u' ), true )
	const confirmed = v.resolveBid( 'u', true )
	assert.ok( confirmed.relief > 0 && confirmed.sting === 0 )
	assert.equal( v.hasPendingBid( 'u' ), false )

	v.evaluateBid( 'v', 0.9, 0.9 )
	const minimized = v.resolveBid( 'v', false )
	assert.ok( minimized.sting > 0 && minimized.relief === 0 )

} )

// ============================================================================
// DeceptionDecisionEngine (Mentira/Verdad)
// ============================================================================

test( 'DeceptionDecisionEngine.evaluate: real high benefit + real low detection risk + real low moral cost genuinely favors lying', () => {

	const d = new DeceptionDecisionEngine()
	const tempted = d.evaluate( { detectionProbability: 0.05, lieBenefit: 0.9, truthCost: 0.8, sanctionCost: 0.1, moralCost: 0.1, honestyReward: 0.05 } )
	assert.ok( tempted.probabilityOfLying > 0.5 )

} )

test( 'DeceptionDecisionEngine.evaluate: real high detection risk + real high moral cost + real low benefit genuinely favors truth', () => {

	const d = new DeceptionDecisionEngine()
	const honest = d.evaluate( { detectionProbability: 0.9, lieBenefit: 0.1, truthCost: 0, sanctionCost: 0.9, moralCost: 0.8, honestyReward: 0.5 } )
	assert.ok( honest.probabilityOfLying < 0.5 )

} )

test( 'DeceptionDecisionEngine.registerMaintenance: real, accumulating cognitive load for a SUSTAINED lie across repeated real turns, genuinely decaying once resolved', () => {

	const d = new DeceptionDecisionEngine()
	let last
	for ( let i = 0; i < 5; i++ ) last = d.registerMaintenance( 'u:topic', 0.5, 0.5, 0.5, 0.5 )
	assert.ok( last.load > 0 )
	assert.equal( last.streak, 5 )

	d.decayAll( 100 )
	assert.equal( d.getLoad( 'u:topic' ), 0, 'sustained real decay should genuinely bring the load back to 0' )

	d.registerMaintenance( 'v:topic', 0.5, 0.5, 0.5, 0.5 )
	d.resolve( 'v:topic' )
	assert.equal( d.getLoad( 'v:topic' ), 0 )

} )

// ============================================================================
// TrustRiskDecision (Confianza/Desconfianza risk layer)
// ============================================================================

test( 'TrustRiskDecision.evaluate: real high trust + real low suspicion favors risking; real low trust + real high suspicion does not', () => {

	const t = new TrustRiskDecision()
	assert.equal( t.evaluate( 0.9, 0.05, 0.1 ).wouldRisk, true )
	assert.equal( t.evaluate( 0.1, 0.9, 0.1 ).wouldRisk, false )

} )

test( 'TrustRiskDecision.evaluate: real, higher risk-aversion genuinely lowers the willingness to risk, holding trust/suspicion equal', () => {

	const t = new TrustRiskDecision()
	const cautious   = t.evaluate( 0.7, 0.2, 0.8 )
	const bold             = t.evaluate( 0.7, 0.2, 0.05 )
	assert.ok( bold.probabilityOfRisking > cautious.probabilityOfRisking )

} )

// ============================================================================
// Full-pipeline wiring
// ============================================================================

test( 'full: Totemheart exposes the new round-51 engines, real and usable, with no NaN across a real multi-turn conversation', async () => {

	const ai = new Totemheart()
	for ( let i = 0; i < 5; i++ ) await ai.processInput( 'te quiero mucho, me haces muy feliz', { userId: 'u' } )

	const relation = ai.attachment.get( 'u' )
	const forgiveness = ai.forgivenessProcess.getPhase( 'u', ai.grudgeSystem.getGrievance( 'self', 'u' ), relation.trust, ai.oxytocinSystem.getLevel( 'u' ) )
	assert.ok( [ 'unresolved', 'verbal', 'reopened', 'reconciled' ].includes( forgiveness.phase ) )

	const risk = ai.trustRiskDecision.evaluate( relation.trust, ai.intuitionEngine.getSuspicion( 'u' ) )
	assert.ok( Number.isFinite( risk.probabilityOfRisking ) )

	const lie = ai.deceptionDecisionEngine.evaluate( {} )
	assert.ok( Number.isFinite( lie.probabilityOfLying ) )

} )

test( 'full: toJSON()/restoreState() round-trips all new round-51 stateful fields through the full Totemheart pipeline', async () => {

	const ai = new Totemheart()
	await ai.processInput( 'te quiero, gracias por todo', { userId: 'u' } )
	ai.forgivenessProcess.getPhase( 'u', 0.6, 0.3, 0.3 )
	ai.validationSeekingEngine.evaluateBid( 'u', 0.9, 0.9 )
	ai.deceptionDecisionEngine.registerMaintenance( 'u:x', 0.5, 0.5, 0.5, 0.5 )

	const saved       = JSON.parse( JSON.stringify( ai.toJSON() ) )
	const restored = new Totemheart()
	restored.restoreState( saved )

	assert.deepEqual( [ ...restored.nostalgiaEngine.peakWarmth.entries() ], [ ...ai.nostalgiaEngine.peakWarmth.entries() ] )
	assert.equal( restored.forgivenessProcess.lastPhase.get( 'u' ), ai.forgivenessProcess.lastPhase.get( 'u' ) )
	assert.equal( restored.validationSeekingEngine.hasPendingBid( 'u' ), ai.validationSeekingEngine.hasPendingBid( 'u' ) )
	assert.equal( restored.deceptionDecisionEngine.getLoad( 'u:x' ), ai.deceptionDecisionEngine.getLoad( 'u:x' ) )

} )
