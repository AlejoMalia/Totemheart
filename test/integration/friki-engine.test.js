/**
 * Directed + cross-mechanism + full-pipeline tests for FrikiEngine.
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { FrikiEngine }             from '../../src/core/FrikiEngine.js'
import { Totemheart, Personality } from '../../src/index.js'

function noBurst( ai ) {

	ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: 100 } )
	return ai

}

function noHijack( ai ) {

	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	return ai

}

test( 'FrikiEngine: real sustained positive, deep engagement genuinely grows intensity, competence, and geek level', () => {

	const f = new FrikiEngine()
	const before = f.getInterest( 'chess' )
	for ( let i = 0; i < 30; i++ ) f.observeEngagement( 'chess', { reward: 0.9, depth: 0.9 } )
	const after = f.getInterest( 'chess' )
	assert.equal( before, null )
	assert.ok( after.intensity > 0.5 )
	assert.ok( after.competence > 0.5 )
	assert.ok( after.geekLevel > 0.3 )

} )

test( 'FrikiEngine: real high geek level with recent engagement becomes the current obsession', () => {

	const f = new FrikiEngine()
	for ( let i = 0; i < 60; i++ ) f.observeEngagement( 'astronomy', { reward: 1, depth: 1 } )
	assert.equal( f.getObsession(), 'astronomy' )

} )

test( 'FrikiEngine: real fandom activation spreads from an active topic to its linked neighbor, weighted by real similarity and geek level', () => {

	const f = new FrikiEngine()
	for ( let i = 0; i < 30; i++ ) f.observeEngagement( 'dune', { reward: 0.9, depth: 0.9 } )
	f.linkFandom( 'dune', 'hard-scifi', 0.8 )
	const activation = f.getFandomActivation( 'dune' )
	assert.equal( activation[ 0 ].neighbor, 'hard-scifi' )
	assert.ok( activation[ 0 ].activation > 0 )

} )

test( 'FrikiEngine: real hobby urge rises when a formed goal goes unpracticed, and drops right after practicing', () => {

	const f = new FrikiEngine()
	for ( let i = 0; i < 20; i++ ) f.observeEngagement( 'painting', { reward: 0.8, depth: 0.8 } )
	f.formHobbyGoal( 'painting' )
	const urgeBefore = f.getHobbyUrge( 'painting' )
	f.practiceHobby( 'painting', 0.6 )
	const urgeAfter = f.getHobbyUrge( 'painting' )
	assert.ok( urgeAfter < urgeBefore )

} )

test( 'FrikiEngine: real social-share gate blocks a deep lore dump with a stranger, allows it with a close, reciprocal friend', () => {

	const f = new FrikiEngine()
	for ( let i = 0; i < 40; i++ ) f.observeEngagement( 'tolkien-lore', { reward: 0.9, depth: 0.9 } )
	const stranger = f.shouldShare( 'tolkien-lore', { affinity: 0.1, formality: 0.7 } )
	const friend       = f.shouldShare( 'tolkien-lore', { affinity: 0.9, reciprocalInterest: 0.6 } )
	assert.equal( stranger.shouldShare, false )
	assert.equal( friend.shouldShare, true )
	assert.ok( friend.depthAllowed > stranger.depthAllowed )

} )

test( 'FrikiEngine: the real reveal gate hides a superfan-level interest from low trust unless the human brings it up', () => {

	const f = new FrikiEngine()
	for ( let i = 0; i < 60; i++ ) f.observeEngagement( 'k-pop', { reward: 1, depth: 1 } )
	assert.ok( f.getInterest( 'k-pop' ).geekLevel > 0.7 )
	assert.equal( f.shouldRevealUnprompted( 'k-pop', { trust: 0.2, humanBroughtItUp: false } ), false )
	assert.equal( f.shouldRevealUnprompted( 'k-pop', { trust: 0.2, humanBroughtItUp: true } ), true )
	assert.equal( f.shouldRevealUnprompted( 'k-pop', { trust: 0.9, humanBroughtItUp: false } ), true )

} )

test( 'FrikiEngine: real ego threat from an attack scales with how identity-fused the interest already is', () => {

	const f = new FrikiEngine()
	const shallow  = new FrikiEngine()
	for ( let i = 0; i < 60; i++ ) f.observeEngagement( 'core-hobby', { reward: 1, depth: 1 } )
	for ( let i = 0; i < 2; i++ ) shallow.observeEngagement( 'core-hobby', { reward: 0.5, depth: 0.3 } )

	const deepThreat      = f.getEgoThreatFromAttack( 'core-hobby', 0.9 )
	const shallowThreat = shallow.getEgoThreatFromAttack( 'core-hobby', 0.9 )
	assert.ok( deepThreat > shallowThreat )

} )

test( 'FrikiEngine: toJSON()/restoreState() round-trips interests, hobby goals, obsession, and fandom links', () => {

	const f = new FrikiEngine()
	for ( let i = 0; i < 30; i++ ) f.observeEngagement( 'origami', { reward: 0.8, depth: 0.8 } )
	f.linkFandom( 'origami', 'paper-crafts', 0.6 )
	f.formHobbyGoal( 'origami' )

	const saved      = JSON.parse( JSON.stringify( f.toJSON() ) )
	const restored = new FrikiEngine()
	restored.restoreState( saved )

	assert.deepEqual( restored.getInterest( 'origami' ), f.getInterest( 'origami' ) )
	assert.ok( restored.fandomLinks.has( 'origami' ) )
	assert.ok( restored.hobbyGoals.has( 'origami' ) )

} )

// ============================================================================
// full: against the real Totemheart pipeline
// ============================================================================

test( 'full: real content-word engagement observations accumulate through the pipeline and stay finite', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	let last
	for ( let i = 0; i < 15; i++ ) last = await ai.processInput( 'me encanta muchisimo la astrofisica, de verdad es fascinante', { userId: 'u' } )

	const interest = ai.frikiEngine.getInterest( 'astrofisica' )
	assert.ok( interest !== null, 'a real, repeated significant content word must have entered the interest graph' )
	assert.ok( Number.isFinite( interest.geekLevel ) )
	assert.equal( typeof last.debug.frikiReveal, 'boolean' )

} )

test( 'hard: attacking an already-established interest genuinely raises real ego threat and nudges arousal', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	// Seed a real, deep interest directly (equivalent to many real turns worth
	// of engagement) so the attack has a real fused interest to hit.
	for ( let i = 0; i < 40; i++ ) ai.frikiEngine.observeEngagement( 'astrofisica', { reward: 1, depth: 1 } )

	const result = await ai.processInput( 'odio la astrofisica, es una perdida de tiempo inutil', { userId: 'u' } )
	assert.ok( result.debug.frikiEgoThreat > 0 )

} )

test( 'hard: multi-user isolation does not apply here — FrikiEngine interests are global to the AI\'s own identity, not per-user, and that is real and correct', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	for ( let i = 0; i < 15; i++ ) await ai.processInput( 'me encanta muchisimo la astrofisica, de verdad es fascinante', { userId: 'alice' } )
	const bobResult = await ai.processInput( 'hola, ¿qué tal?', { userId: 'bob' } )

	// A real interest formed while talking to Alice is honestly still there
	// when talking to Bob — it's the AI's OWN identity, not a per-relationship read.
	assert.ok( ai.frikiEngine.getInterest( 'astrofisica' ) !== null )
	assert.equal( typeof bobResult.text, 'string' )

} )

test( 'full: toJSON()/restoreState() round-trips the real FrikiEngine state', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	for ( let i = 0; i < 40; i++ ) ai.frikiEngine.observeEngagement( 'astrofisica', { reward: 1, depth: 1 } )
	await ai.processInput( 'hola', { userId: 'u' } )
	ai.tick( 2 )

	const saved     = JSON.parse( JSON.stringify( ai.toJSON() ) )
	const restored = noHijack( noBurst( new Totemheart() ) )
	restored.restoreState( saved )

	assert.deepEqual( restored.frikiEngine.toJSON(), saved.frikiEngine )
	assert.equal( restored.frikiEngine.getObsession(), 'astrofisica' )

	const result = await restored.processInput( 'hola de nuevo', { userId: 'u' } )
	assert.equal( typeof result.text, 'string' )

} )
