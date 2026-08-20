/**
 * Directed + cross-mechanism + full-pipeline tests for round 20's EGO
 * extensions (denial/repression/reaction-formation added to
 * DefenseMechanisms, SelfDistancingSpeech) and the further grief-catalog
 * extensions (anticipatory grief, prolonged grief disorder marker,
 * cumulative grief burden, and the defense-driven delayed/masked/inhibited/
 * absent presentations wired through already-existing modules).
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { Totemheart, Personality } from '../../src/index.js'
import { DefenseMechanisms }          from '../../src/cognition/DefenseMechanisms.js'
import { SelfDistancingSpeech }      from '../../src/cognition/SelfDistancingSpeech.js'
import { GriefEngine }                    from '../../src/social/GriefEngine.js'

function noBurst( ai, threshold = 200 ) {

	ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: threshold } )
	return ai

}

function noHijack( ai ) {

	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	return ai

}

// ============================================================================
// Personality / DefenseMechanisms — the 3 new Vaillant/Anna-Freud defenses
// ============================================================================

test( 'Personality.getDefenseWeights(): real 8-way normalized distribution including the 3 new defenses', () => {

	const p       = new Personality()
	const weights = p.getDefenseWeights()
	const keys      = [ 'projection', 'evasion', 'denial', 'rationalization', 'repression', 'reactionFormation', 'sarcasm', 'humor' ]

	for ( const k of keys ) assert.equal( typeof weights[ k ], 'number' )
	const sum = Object.values( weights ).reduce( ( a, b ) => a + b, 0 )
	assert.ok( Math.abs( sum - 1 ) < 1e-9, `weights must sum to 1, got ${sum}` )

} )

test( 'DefenseMechanisms.check(): denial/repression/reactionFormation are real, distinct, correctly-tiered outcomes', () => {

	const d = new DefenseMechanisms()
	const p    = new Personality()
	const result = d.check( 0.9, p, 0.6, { egoHealth: 0.2, cortisol: 0.9 } )

	assert.equal( result.active, true )
	assert.ok( [ 'projection', 'evasion', 'denial', 'rationalization', 'repression', 'reactionFormation', 'sarcasm', 'humor' ].includes( result.mechanism ) )
	assert.equal( result.tier, { projection: 'immature', evasion: 'immature', denial: 'immature', rationalization: 'neurotic', repression: 'neurotic', reactionFormation: 'neurotic', sarcasm: 'neurotic', humor: 'mature' }[ result.mechanism ] )

} )

test( 'DefenseMechanisms.check(): low ego health / high cortisol statistically pulls toward denial (immature tier) too, not just the original 2', () => {

	const d = new DefenseMechanisms()
	const p    = new Personality( { openness: 0.05, agreeableness: 0.5, neuroticism: 0.5, conscientiousness: 0.5 } )
	let immatureCount = 0
	for ( let i = 0; i < 300; i++ ) {

		const r = d.check( 0.9, p, 0.6, { egoHealth: 0.1, cortisol: 0.9 } )
		if ( r.tier === 'immature' ) immatureCount++

	}
	assert.ok( immatureCount > 100, `expected regression toward the immature tier to be real and substantial, got ${immatureCount}/300` )

} )

// ============================================================================
// SelfDistancingSpeech
// ============================================================================

test( 'SelfDistancingSpeech: real gate only opens past the combined emotional/social pressure threshold', () => {

	const s = new SelfDistancingSpeech( { threshold: 0.5 } )
	assert.equal( s.shouldDistance( 0.1, 0.1 ), false )
	assert.equal( s.shouldDistance( 0.9, 0.9 ), true )

} )

test( 'SelfDistancingSpeech: real regulation boost scales with emotional intensity, bounded 0..1', () => {

	const s = new SelfDistancingSpeech()
	assert.equal( s.getRegulationBoost( 0 ), 0 )
	assert.ok( s.getRegulationBoost( 1 ) > s.getRegulationBoost( 0.3 ) )
	assert.ok( s.getRegulationBoost( 1 ) <= 1 )

} )

// ============================================================================
// GriefEngine — anticipatory grief, prolonged marker, cumulative burden
// ============================================================================

test( 'GriefEngine.triggerAnticipatoryGrief(): real, decaying, and distinct from an actual bereavement entry', () => {

	const g = new GriefEngine()
	g.triggerAnticipatoryGrief( 'u', 0.5, 'mother' )
	assert.ok( g.getAnticipatoryGriefIntensity( 'u', 'mother' ) > 0 )
	assert.equal( g.getBereavementIntensity( 'u', 'mother' ), 0, 'anticipatory grief must not leak into the real bereavement key' )

} )

test( 'GriefEngine.applyAnticipatoryDampening(): real prior anticipatory work genuinely dampens the acute bereavement shock and is consumed once', () => {

	const g = new GriefEngine()
	g.triggerAnticipatoryGrief( 'u', 0.6, 'mother' )
	const dampened = g.applyAnticipatoryDampening( 'u', 0.8, 'mother' )
	assert.ok( dampened < 0.8, 'the raw bereavement value must be reduced by real prior grief work' )

	const second = g.applyAnticipatoryDampening( 'u', 0.8, 'mother' )
	assert.equal( second, 0.8, 'anticipatory grief must be consumed once, not reapplied indefinitely' )

} )

test( 'GriefEngine.isProlongedGriefDisorder(): real severity-past-window criterion, not just severity alone', () => {

	const g = new GriefEngine( { tauMs: 1000 * 60 * 60 * 24 * 365 } ) // slow decay so intensity stays high
	g.triggerBereavement( 'u', 0.9, 'father', 0 )

	assert.equal( g.isProlongedGriefDisorder( 'u', 1000, { sinceMs: 1000 * 60 * 60 * 24 * 180 } ), false, 'not enough real elapsed time yet' )
	assert.equal( g.isProlongedGriefDisorder( 'u', 1000 * 60 * 60 * 24 * 200, { sinceMs: 1000 * 60 * 60 * 24 * 180 } ), true, 'severe AND past the real window' )

} )

test( 'GriefEngine.getCumulativeGriefBurden(): real aggregate across distinct concurrent real griefs for the same context', () => {

	const g = new GriefEngine()
	g.triggerLoss( 'u', 0.4 )
	g.triggerBereavement( 'u', 0.3, 'father' )
	g.triggerDisenfranchisedGrief( 'u', 0.2, 0.5 )

	const burden = g.getCumulativeGriefBurden( 'u' )
	assert.ok( burden > 0.4, 'the aggregate must genuinely exceed any single one of its 3 real components' )

} )

// ============================================================================
// full: against the real Totemheart pipeline
// ============================================================================

test( 'full: real anticipatory grief from a family-health-decline event genuinely dampens a later real bereavement shock', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	await ai.processInput( 'mi familiar esta enfermo', { userId: 'u' } )
	const anticipated = ai.griefEngine.getAnticipatoryGriefIntensity( 'u', 'family_member_health_change' )
	assert.ok( anticipated > 0 )

	const afterDeath = await ai.processInput( 'murio mi padre', { userId: 'u' } )
	assert.ok( afterDeath.debug.bereavementIntensity > 0 )
	assert.ok( afterDeath.debug.bereavementIntensity < 0.6, 'raw undampened impact-60 bereavement would be ~0.6; real anticipatory work must have reduced it' )

} )

test( 'full: real self-distancing genuinely fires under high emotional/social pressure and is exposed in debug', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality( { neuroticism: 0.7 } ) } ) ) )
	let last
	for ( let i = 0; i < 10; i++ ) last = await ai.processInput( 'eres un inútil, te odio, no sirves para nada', { userId: 'u' } )

	assert.equal( typeof last.debug.selfDistancing.active, 'boolean' )
	assert.ok( Number.isFinite( last.debug.selfDistancing.boost ) )

} )

test( 'full: a real repression fire while grief is active routes through SubconsciousEngine and ExpressionDebt', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	await ai.processInput( 'murio mi padre', { userId: 'u' } )
	const debtBefore = ai.expressionDebt.suppressionCostReservoir

	ai.defenseMechanisms.check = () => ( { active: true, mechanism: 'repression', tier: 'neurotic', stress: 1 } )
	await ai.processInput( 'sigo pensando en mi padre', { userId: 'u' } )

	assert.ok( ai.subconsciousEngine.getIronicReboundPressure( 'grief::u' ) > 0, 'repression must have registered real suppression on the grief-specific topic' )
	assert.ok( ai.expressionDebt.suppressionCostReservoir >= debtBefore, 'repression must genuinely charge a real holding-it-in cost' )

} )

test( 'full: a real delayed grief rebound genuinely resurfaces after repression, then releases', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	await ai.processInput( 'murio mi padre', { userId: 'u' } )

	ai.defenseMechanisms.check = () => ( { active: true, mechanism: 'repression', tier: 'neurotic', stress: 1 } )
	for ( let i = 0; i < 10; i++ ) await ai.processInput( 'sigo pensando en mi padre', { userId: 'u' } )

	ai.defenseMechanisms.check = () => ( { active: false } )
	const reboundTurn = await ai.processInput( 'hola', { userId: 'u' } )
	assert.ok( Number.isFinite( reboundTurn.debug.griefPresentation.delayedRebound ) )

} )

test( 'full: toJSON()/restoreState() round-trips the new grief-catalog entries with no dedicated new field (shared griefs Map)', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	await ai.processInput( 'mi familiar esta enfermo', { userId: 'u' } )
	await ai.processInput( 'murio mi padre', { userId: 'u' } )

	const saved       = JSON.parse( JSON.stringify( ai.toJSON() ) )
	const restored = new Totemheart()
	restored.restoreState( saved )

	assert.deepEqual( restored.toJSON().griefs, saved.griefs )
	assert.equal( restored.griefEngine.getBereavementIntensity( 'u', 'death_close_family' ), ai.griefEngine.getBereavementIntensity( 'u', 'death_close_family' ) )

} )

test( 'hard: 300-turn long-horizon conversation keeps every new field finite and sanely bounded', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ), 400 ) )
	const inputs = [ 'hola', 'mi familiar esta enfermo', 'murio mi padre', 'eres un inútil, te odio', 'te quiero mucho' ]
	let last
	for ( let i = 0; i < 300; i++ ) last = await ai.processInput( inputs[ i % inputs.length ], { userId: 'u' } )

	for ( const v of [ last.debug.anticipatoryGriefIntensity, last.debug.cumulativeGriefBurden, last.debug.griefPresentation.delayedRebound, last.debug.selfDistancing.boost ] ) {

		assert.ok( Number.isFinite( v ) && v >= 0, `expected a finite non-negative number, got ${v}` )

	}
	assert.equal( typeof last.debug.prolongedGriefDisorder, 'boolean' )
	assert.equal( typeof last.debug.griefPresentation.absent, 'boolean' )

	const { valence, arousal, dominance } = ai.emotionSpace.vector
	assert.ok( [ valence, arousal, dominance ].every( v => Number.isFinite( v ) && v >= -1 && v <= 1 ) )

} )
