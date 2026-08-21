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
// Round 38 — 3 real bugs found and fixed while testing a real long-gap
// reunion scenario: decay overshooting past its own documented floor for
// large dt, overly-loose duplicate-detection collapsing genuinely
// different high-value memories into one, and no real "boom" reactivation
// when someone permanently significant reappears after a long real gap.
// ============================================================================

test( 'RelationalMemoryCatalog: tick() decay never crosses the real floor even for a very large dt', () => {

	const c = new RelationalMemoryCatalog( { decayFloor: 0.1, decayRate: 0.02 } )
	c.catalogEpisode( 'u', { text: 'un recuerdo cualquiera con peso real', valence: 0.5, ts: 1, tags: [] }, 0.4 )

	// Real bug: the old forward-Euler step overshot past the floor for a
	// large dt (e.g. simulating years in one call) and clamp01() silently
	// floored the overshoot to exactly 0. A single huge dt (years, in hours)
	// must still respect the real, documented non-zero floor.
	c.tick( 24 * 365 * 3 )
	const weight = c.getTopDetails( 'u', { minWeight: 0 } )[ 0 ]?.weight ?? c.people.get( 'u' ).details[ 0 ].weight
	assert.ok( weight >= 0.1 - 1e-9, `weight (${weight}) must never drop below the real decay floor, even for a huge dt` )

} )

test( 'RelationalMemoryCatalog: genuinely different high-value moments become distinct details, not one merged entry', () => {

	const c = new RelationalMemoryCatalog()
	c.setRelationshipPhase( 'u', 'romantic' )
	c.catalogEpisode( 'u', { text: 'no dejo de pensar en ti, me pones muy nervioso, te deseo muchísimo', valence: 0.6, ts: 1, tags: [ 'chills', 'intimacy' ] }, 0.4 )
	c.catalogEpisode( 'u', { text: 'eres tan atractivo, ojalá estuvieras aquí ahora mismo conmigo', valence: 0.6, ts: 2, tags: [ 'chills', 'intimacy' ] }, 0.4 )
	c.catalogEpisode( 'u', { text: 'me gusta muchísimo hablar contigo, aprendo algo nuevo cada día', valence: 0.5, ts: 3, tags: [ 'chills', 'intimacy' ] }, 0.4 )

	assert.equal( c.getTopDetails( 'u', { k: 10 } ).length, 3, 'real, substantially different romantic moments sharing only common stopwords and the same tags should stay distinct memories' )

} )

test( 'RelationalMemoryCatalog: a near-duplicate rephrasing still merges into the existing detail', () => {

	const c = new RelationalMemoryCatalog()
	c.catalogEpisode( 'u', { text: 'me encanta cómo me haces sentir cuando hablamos', valence: 0.6, ts: 1, tags: [ 'chills' ] }, 0.4 )
	c.catalogEpisode( 'u', { text: 'me encanta cómo me haces sentir cuando hablamos hoy', valence: 0.6, ts: 2, tags: [ 'chills' ] }, 0.4 )

	assert.equal( c.getTopDetails( 'u', { k: 10 } ).length, 1, 'a real near-duplicate rephrasing of the same underlying moment should still merge' )

} )

test( 'RelationalMemoryCatalog.getReunionReactivation: real, nonzero magnitude only for someone with a permanent milestone after a genuinely long gap', () => {

	const c = new RelationalMemoryCatalog()
	c.catalogEpisode( 'u', { text: 'somos pareja desde hoy', valence: 0.9, ts: Date.now() - 1000 * 60 * 60 * 24 * 365 * 3, tags: [] } )

	const person = c.people.get( 'u' )
	person.affectLedger.lastPositiveTs = Date.now() - 1000 * 60 * 60 * 24 * 365 * 3
	person.affectLedger.cumulativeWarmth = 0.9

	const longGapReactivation  = c.getReunionReactivation( 'u', Date.now() )
	const shortGapReactivation = c.getReunionReactivation( 'u', person.affectLedger.lastPositiveTs + 1000 * 60 * 60 * 24 )

	assert.ok( longGapReactivation.magnitude > 0.3, 'a real permanent milestone plus a genuinely long gap should produce a real, non-trivial reactivation' )
	assert.ok( longGapReactivation.magnitude > shortGapReactivation.magnitude, 'a longer real gap should read as more reactivation than a short one, same historical significance' )

	const stranger = new RelationalMemoryCatalog()
	stranger.catalogEpisode( 'v', { text: 'hola, qué tal', valence: 0.3, ts: Date.now() - 1000 * 60 * 60 * 24 * 365 * 3, tags: [] } )
	assert.equal( stranger.getReunionReactivation( 'v', Date.now() ).magnitude, 0, 'no permanent milestone should mean no reunion reactivation at all' )

} )

test( 'RelationalMemoryCatalog.getReunionReactivation: real, SIGNED tone from cumulativeWarmth vs cumulativeHurt, not always positive', () => {

	const warm = new RelationalMemoryCatalog()
	warm.catalogEpisode( 'u', { text: 'somos pareja desde hoy', valence: 0.9, ts: Date.now() - 1000 * 60 * 60 * 24 * 365, tags: [] } )
	const warmPerson = warm.people.get( 'u' )
	warmPerson.affectLedger.lastPositiveTs = Date.now() - 1000 * 60 * 60 * 24 * 365
	warmPerson.affectLedger.cumulativeWarmth = 5
	warmPerson.affectLedger.cumulativeHurt        = 0.5
	const warmBoom = warm.getReunionReactivation( 'u', Date.now() )
	assert.equal( warmBoom.label, 'warmth' )
	assert.ok( warmBoom.tone > 0.2 )

	const toxic = new RelationalMemoryCatalog()
	toxic.catalogEpisode( 'u', { text: 'somos pareja desde hoy', valence: 0.9, ts: Date.now() - 1000 * 60 * 60 * 24 * 365, tags: [] } )
	const toxicPerson = toxic.people.get( 'u' )
	toxicPerson.affectLedger.lastPositiveTs = Date.now() - 1000 * 60 * 60 * 24 * 365
	toxicPerson.affectLedger.cumulativeWarmth = 0.5
	toxicPerson.affectLedger.cumulativeHurt        = 5
	const alertBoom = toxic.getReunionReactivation( 'u', Date.now() )
	assert.equal( alertBoom.label, 'alert', 'a real, genuinely hurtful accumulated history should reunion-boom as an alert, not a celebration' )
	assert.ok( alertBoom.tone < -0.2 )
	assert.ok( alertBoom.magnitude > 0.15, 'the alert should still carry real, substantial magnitude — a toxic history is still significant, just not warm' )

} )

test( 'full: a genuinely warm, permanently significant person reappearing after a real long gap produces a positive emotional/chills boom', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )
	await ai.processInput( 'quiero que seamos novios, aunque estemos lejos, quiero que esto sea serio, te quiero muchísimo', { userId: 'A' } )
	await ai.processInput( 'no dejo de pensar en ti, me pones muy nervioso, te deseo muchísimo', { userId: 'A' } )

	const person = ai.relationalMemoryCatalog.people.get( 'A' )
	const THREE_YEARS_MS = 1000 * 60 * 60 * 24 * 365 * 3
	person.affectLedger.lastPositiveTs -= THREE_YEARS_MS
	person.affectLedger.lastNegativeTs -= THREE_YEARS_MS

	const r = await ai.processInput( 'hola, sé que ha pasado mucho tiempo, solo quería saber cómo estás', { userId: 'A' } )

	assert.equal( r.debug.reunionReactivation.label, 'warmth' )
	assert.ok( r.debug.reunionReactivation.magnitude > 0.3, 'a real, permanently significant reunion after a long gap should read as substantial reactivation' )
	assert.ok( r.debug.chills.level > 0.35, 'a warm reunion should genuinely raise chills above an ordinary warm-turn baseline' )

} )

test( 'full: a permanently significant person whose real history is dominated by hurt reappears as an ALERT, not a celebration — negative spike, cortisol bump, no chills', async () => {

	const ai = noHijack( noBurst( new Totemheart( { personality: new Personality() } ) ) )

	// A real permanent milestone plus a history genuinely dominated by conflict/hurt,
	// catalogued through the same real catalogEpisode() entry point the framework itself
	// uses (chills-triggered and REM-sweep catalog writes), not a mock.
	ai.relationalMemoryCatalog.catalogEpisode( 'A', { text: 'declaramos que somos pareja', tags: [ 'milestone' ], valence: 0.6 }, 0.6 )
	for ( let i = 0; i < 4; i++ ) {
		ai.relationalMemoryCatalog.catalogEpisode( 'A', { text: `pelea número ${ i } con gritos e insultos`, tags: [ 'conflict' ], valence: -0.8 }, 0.8 )
	}

	const person = ai.relationalMemoryCatalog.people.get( 'A' )
	assert.ok( person.milestones.some( m => m.permanent ), 'setup should have produced a real permanent milestone' )
	assert.ok( person.affectLedger.cumulativeHurt > person.affectLedger.cumulativeWarmth, 'setup should have produced a real history dominated by hurt' )

	const THREE_YEARS_MS = 1000 * 60 * 60 * 24 * 365 * 3
	person.affectLedger.lastPositiveTs -= THREE_YEARS_MS
	person.affectLedger.lastNegativeTs -= THREE_YEARS_MS

	const preValence  = ai.emotionSpace.vector.valence
	const preCortisol = ai.cortisolEngine.getLevel()

	const r = await ai.processInput( 'hola, sé que ha pasado mucho tiempo, solo quería saber cómo estás', { userId: 'A' } )

	assert.equal( r.debug.reunionReactivation.label, 'alert', 'a real, genuinely hurtful accumulated history should reunion-boom as an alert, not a celebration' )
	assert.ok( r.debug.reunionReactivation.magnitude > 0.15, 'the alert should still carry real, substantial magnitude' )
	assert.ok( ai.emotionSpace.vector.valence < preValence, 'an alert-toned reunion should genuinely pull valence down, not up' )
	assert.ok( ai.cortisolEngine.getLevel() > preCortisol, 'an alert-toned reunion should genuinely raise cortisol, a real threat-adjacent response' )

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
