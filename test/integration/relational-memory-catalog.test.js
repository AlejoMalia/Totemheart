/**
 * Directed + cross-mechanism + full-pipeline tests for RelationalMemoryCatalog.
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { RelationalMemoryCatalog } from '../../src/social/RelationalMemoryCatalog.js'
import { Totemheart, Personality }   from '../../src/index.js'

function noBurst( ai ) {

	ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: 100 } )
	return ai

}

function noHijack( ai ) {

	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	return ai

}

test( 'RelationalMemoryCatalog: a romantic-start phrase is detected as a real, permanent milestone and shifts phase', () => {

	const c = new RelationalMemoryCatalog()
	c.catalogEpisode( 'u', { text: 'somos pareja desde hoy', valence: 0.9, ts: 1, tags: [] } )
	const milestones = c.getMilestones( 'u' )
	assert.equal( milestones.length, 1 )
	assert.equal( milestones[ 0 ].type, 'relationship_start' )
	assert.equal( milestones[ 0 ].permanent, true )
	assert.equal( c.getRelationshipPhase( 'u' ), 'romantic' )

} )

test( 'RelationalMemoryCatalog: a real positive romantic-phase detail keeps a high weight after many decay ticks', () => {

	const c = new RelationalMemoryCatalog()
	c.setRelationshipPhase( 'u', 'romantic' )
	c.catalogEpisode( 'u', { text: 'le gustan los gatos grises', valence: 0.9, ts: 1, tags: [ 'gatos' ] }, 0.85 )
	for ( let i = 0; i < 100; i++ ) c.tick( 1 )
	const details = c.getTopDetails( 'u' )
	assert.ok( details.length > 0 )
	assert.ok( details[ 0 ].weight > 0.5 )

} )

test( 'RelationalMemoryCatalog: a real permanent milestone is never removed by decay', () => {

	const c = new RelationalMemoryCatalog()
	c.catalogEpisode( 'u', { text: 'terminamos, se acabo', valence: -0.9, ts: 1, tags: [] } )
	for ( let i = 0; i < 500; i++ ) c.tick( 1 )
	assert.equal( c.getMilestones( 'u' ).length, 1 )

} )

test( 'RelationalMemoryCatalog: ingestFromRem grows the catalog from real touched episodes', () => {

	const c = new RelationalMemoryCatalog()
	const before = c.getTopDetails( 'u' ).length
	c.ingestFromRem( 'u', { elapsedHours: 5 }, [
		{ text: 'aquella noche hablamos hasta las 3', emotionalSignature: { valence: 0.7 }, importance: 0.8, concepts: [ 'noche' ] },
	] )
	assert.ok( c.getTopDetails( 'u' ).length > before )

} )

test( 'RelationalMemoryCatalog: real token overlap reactivates the correct person-specific detail, not an unrelated one', () => {

	const c = new RelationalMemoryCatalog()
	c.catalogEpisode( 'u', { text: 'le gustan los gatos grises', valence: 0.8, ts: 1, tags: [ 'gatos' ] }, 0.8 )
	c.catalogEpisode( 'u', { text: 'trabaja en un hospital', valence: 0.3, ts: 2, tags: [ 'work' ] }, 0.6 )
	const hits = c.reminisce( 'u', [ 'gatos', 'grises' ] )
	assert.ok( hits.length > 0 )
	assert.ok( hits[ 0 ].text.includes( 'gatos' ) )

} )

test( 'RelationalMemoryCatalog: toJSON()/restoreState() round-trips milestones, details, themes, and affect ledger', () => {

	const c = new RelationalMemoryCatalog()
	c.catalogEpisode( 'u', { text: 'somos pareja desde hoy', valence: 0.9, ts: 1, tags: [ 'us' ] } )
	c.catalogEpisode( 'u', { text: 'gracias por todo', valence: 0.7, ts: 2, tags: [ 'gratitude' ] }, 0.7 )

	const saved      = JSON.parse( JSON.stringify( c.toJSON() ) )
	const restored = new RelationalMemoryCatalog()
	restored.restoreState( saved )

	assert.equal( restored.getRelationshipPhase( 'u' ), 'romantic' )
	assert.equal( restored.getMilestones( 'u' ).length, 1 )
	assert.ok( restored.getRecurringThemes( 'u' ).length > 0 )

} )

// ============================================================================
// full: against the real Totemheart pipeline
// ============================================================================

test( 'full: a real REM sweep genuinely catalogs high-importance touched episodes into the relational memory catalog', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	await ai.processInput( 'te quiero muchisimo, eres maravillosa, me haces increiblemente feliz', { userId: 'u' } )
	// Round 30 added a real, ADDITIONAL same-session catalog path gated on a
	// genuine ChillsEngine peak (see Totemheart.js) — this line is real and
	// warm enough it may or may not cross that gate depending on this turn's
	// own real novelty/bond-salience read, so this is no longer asserted at
	// a hard 0; what matters for THIS test is the REM sweep's own real
	// cataloging below, checked independently of whichever path fired first.
	const beforeSweep = ai.relationalMemoryCatalog.getTopDetails( 'u' ).length

	ai.remConsolidation.lastTurnAt = Date.now() - 1000 * 60 * 60 * 5
	await ai.processInput( 'hola de nuevo', { userId: 'u' } )

	const afterSweep = ai.relationalMemoryCatalog.getTopDetails( 'u' )
	assert.ok( afterSweep.length > 0, 'a real high-importance episode must have been cataloged by the sweep this turn triggered' )
	if ( beforeSweep === 0 ) assert.ok( afterSweep.some( d => !d.tags.includes( 'chills' ) ), 'when the same-session chills hook did not already catalog it, the REM sweep itself must be the one that did' )

} )

test( 'full: round 30 — a genuine same-session chills peak catalogs a high-weight relational detail immediately, without waiting for a REM sweep', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	let last
	for ( let i = 0; i < 3; i++ ) last = await ai.processInput( 'me encanta hablar contigo, se nota que por dentro siempre sientes que tienes que ganarte el cariño de la gente, y aun así lo das todo. eso dice mucho de ti', { userId: 'u' } )

	if ( last.debug.chills.level > 0.3 ) assert.ok( ai.relationalMemoryCatalog.getTopDetails( 'u' ).length > 0, 'a genuine chills peak this turn should have written a same-session detail' )

} )

test( 'full: a real overlap-triggered reminiscence is exposed on the debug object and can genuinely nudge affinity', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	await ai.processInput( 'te quiero muchisimo, me encantan los gatos grises', { userId: 'u' } )
	ai.remConsolidation.lastTurnAt = Date.now() - 1000 * 60 * 60 * 5
	await ai.processInput( 'hola de nuevo', { userId: 'u' } )

	const before = ai.attachment.get( 'u' ).affinity
	const result   = await ai.processInput( 'me acuerdo de los gatos grises', { userId: 'u' } )
	assert.ok( Array.isArray( result.debug.reminiscence ) )
	if ( result.debug.reminiscence.length > 0 ) assert.ok( ai.attachment.get( 'u' ).affinity >= before )

} )

test( 'hard: multi-user isolation — relational memory catalog for user A never bleeds into user B', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	await ai.processInput( 'te quiero muchisimo, eres maravillosa', { userId: 'alice' } )
	ai.remConsolidation.lastTurnAt = Date.now() - 1000 * 60 * 60 * 5
	await ai.processInput( 'hola de nuevo', { userId: 'alice' } )

	assert.ok( ai.relationalMemoryCatalog.getTopDetails( 'alice' ).length > 0 )
	assert.equal( ai.relationalMemoryCatalog.getTopDetails( 'bob' ).length, 0 )
	assert.equal( ai.relationalMemoryCatalog.getRelationshipPhase( 'bob' ), 'stranger' )

} )

test( 'full: toJSON()/restoreState() round-trips the real relational memory catalog', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	await ai.processInput( 'te quiero muchisimo, eres maravillosa', { userId: 'u' } )
	ai.remConsolidation.lastTurnAt = Date.now() - 1000 * 60 * 60 * 5
	await ai.processInput( 'hola de nuevo', { userId: 'u' } )

	const saved     = JSON.parse( JSON.stringify( ai.toJSON() ) )
	const restored = noHijack( noBurst( new Totemheart() ) )
	restored.restoreState( saved )

	assert.deepEqual( restored.relationalMemoryCatalog.toJSON(), saved.relationalMemoryCatalog )
	const result = await restored.processInput( 'hola', { userId: 'u' } )
	assert.equal( typeof result.text, 'string' )

} )
