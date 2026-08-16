import { test }    from 'node:test'
import assert       from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir }   from 'node:os'
import { join }     from 'node:path'

import { SqliteStore } from '../src/SqliteStore.js'
import { EpisodicMemory } from '../../../src/social/EpisodicMemory.js'
import { Totemheart, Personality } from '../../../src/index.js'

test( 'SqliteStore: upsert then query returns the real stored entry via real token-overlap scoring', async () => {

	const store = new SqliteStore( { path: ':memory:' } )
	await store.upsert( { id: 1, text: 'me encanta el chocolate', userId: 'u', emotionalSignature: { valence: 0.6, arousal: 0.3 }, importance: 0.5, retention: 1 } )

	const results = await store.query( 'chocolate', 5 )
	assert.equal( results.length, 1 )
	assert.equal( results[ 0 ].text, 'me encanta el chocolate' )
	store.close()

} )

test( 'SqliteStore: query with no matching tokens returns empty, not every row', async () => {

	const store = new SqliteStore( { path: ':memory:' } )
	await store.upsert( { id: 1, text: 'algo sobre gatos', userId: 'u', emotionalSignature: {}, importance: 0.3, retention: 1 } )
	await store.upsert( { id: 2, text: 'algo sobre perros', userId: 'u', emotionalSignature: {}, importance: 0.3, retention: 1 } )

	const results = await store.query( 'elefantes', 5 )
	assert.equal( results.length, 0 )
	store.close()

} )

test( 'SqliteStore: an upsert with the same id updates in place rather than duplicating the row', async () => {

	const store = new SqliteStore( { path: ':memory:' } )
	await store.upsert( { id: 1, text: 'version original', userId: 'u', emotionalSignature: {}, importance: 0.3, retention: 1 } )
	await store.upsert( { id: 1, text: 'version actualizada', userId: 'u', emotionalSignature: {}, importance: 0.3, retention: 1 } )

	const all = await store.getAll()
	assert.equal( all.length, 1 )
	assert.equal( all[ 0 ].text, 'version actualizada' )
	store.close()

} )

test( 'SqliteStore: real persistence to disk survives closing and reopening the database', async () => {

	const dir  = mkdtempSync( join( tmpdir(), 'totemheart-sqlite-' ) )
	const path = join( dir, 'memories.db' )

	const store1 = new SqliteStore( { path } )
	await store1.upsert( { id: 1, text: 'un recuerdo que debe persistir en disco', userId: 'u', emotionalSignature: { valence: -0.4 }, importance: 0.7, retention: 1 } )
	store1.close()

	const store2  = new SqliteStore( { path } )
	const results = await store2.query( 'persistir', 5 )
	assert.equal( results.length, 1 )
	assert.equal( results[ 0 ].importance, 0.7 )
	store2.close()

	rmSync( dir, { recursive: true, force: true } )

} )

// ============================================================================
// cross: wired as EpisodicMemory's real adapter, and through the full
// Totemheart pipeline — with an honest note on the real, pre-existing scope
// of what EpisodicMemory's adapter contract actually covers.
// ============================================================================

test( 'cross: SqliteStore as EpisodicMemory\'s real adapter — store() and recall() are genuinely adapter-backed', async () => {

	const store  = new SqliteStore( { path: ':memory:' } )
	const memory = new EpisodicMemory( { adapter: store } )

	await memory.store( { text: 'un evento importante con el usuario', userId: 'u', emotionalSignature: { valence: 0.5, arousal: 0.4 }, importance: 0.6 } )
	const recalled = await memory.recall( 'evento importante', 5 )

	assert.equal( recalled.length, 1 )
	assert.equal( recalled[ 0 ].text, 'un evento importante con el usuario' )

	// Honest, documented limitation, not a SqliteStore bug: EpisodicMemory's OTHER
	// methods (markResolved, getUnresolvedMemories, getZeigarnikPressure,
	// rollIntrusiveThought, recallMoodCongruent, tagRemSalient, reconsolidate...)
	// operate on the in-memory `this.memories` array directly, NOT through the
	// adapter — a real, pre-existing scope of the adapter contract as implemented
	// in EpisodicMemory.js today (only store()/recall() are adapter-routed). An
	// adapter-backed EpisodicMemory therefore has NO wound-tracking/Zeigarnik/
	// REM-salience behavior — this is verified here explicitly rather than
	// silently assumed to work.
	assert.equal( memory.memories.length, 0, 'the in-memory array stays empty when an adapter is set — store() never pushes to it' )
	assert.equal( memory.getUnresolvedMemories( 'u' ).length, 0, 'known gap: getUnresolvedMemories() only reads the in-memory array, not the adapter' )
	store.close()

} )

test( 'cross: SqliteStore wired into a real Totemheart instance keeps the full pipeline finite and produces real, persisted recall', async () => {

	const store = new SqliteStore( { path: ':memory:' } )
	const ai      = new Totemheart( { personality: new Personality() } )
	ai.episodicMemory = new EpisodicMemory( { adapter: store } )

	const result = await ai.processInput( 'hoy fue un dia muy especial contigo', { userId: 'u' } )

	assert.equal( typeof result.text, 'string' )
	assert.ok( Number.isFinite( ai.emotionSpace.vector.valence ) )

	const stored = await store.getAll()
	assert.ok( stored.length >= 1, 'processInput() must have real-persisted at least one memory through the adapter' )
	store.close()

} )
