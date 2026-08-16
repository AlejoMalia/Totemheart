import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { OpenAIProvider } from '../src/OpenAIProvider.js'
import { Totemheart, Personality } from '../../../src/index.js'

test( 'OpenAIProvider: throws without a configured API key — real, honest failure, not a silent no-op', async () => {

	const provider = new OpenAIProvider( { apiKey: null } )
	await assert.rejects( () => provider.analyze( 'sentiment', { text: 'hola' } ) )

} )

test( 'OpenAIProvider: throws on an unreachable baseURL — same real network-failure contract as OllamaProvider', async () => {

	const provider = new OpenAIProvider( { apiKey: 'sk-fake', baseURL: 'http://127.0.0.1:1', timeoutMs: 500 } )
	await assert.rejects( () => provider.analyze( 'sentiment', { text: 'hola' } ) )

} )

test( 'OpenAIProvider: throws on an unsupported task rather than silently returning a default', async () => {

	const provider = new OpenAIProvider( { apiKey: 'sk-fake' } )
	await assert.rejects( () => provider.analyze( 'notATask', {} ) )

} )

test( 'cross: Totemheart falls back to HeuristicProvider transparently when OpenAIProvider has no key configured', async () => {

	const provider = new OpenAIProvider( { apiKey: null } )
	const ai          = new Totemheart( { personality: new Personality(), provider } )

	const result = await ai.processInput( 'me encanta esto, gracias', { userId: 'u' } )

	assert.equal( typeof result.text, 'string' )
	assert.ok( result.text.length > 0 )
	assert.ok( ai.emotionSpace.vector.valence > 0, 'the fallback heuristic must have actually run for a positive-sentiment input' )

} )

test( 'cross: Totemheart falls back to HeuristicProvider transparently when OpenAIProvider\'s endpoint is unreachable', async () => {

	const provider = new OpenAIProvider( { apiKey: 'sk-fake', baseURL: 'http://127.0.0.1:1', timeoutMs: 500 } )
	const ai          = new Totemheart( { personality: new Personality(), provider } )

	const result = await ai.processInput( 'esto es terrible y me hace sentir mal', { userId: 'u' } )

	assert.equal( typeof result.text, 'string' )
	assert.ok( ai.emotionSpace.vector.valence < 0, 'the fallback heuristic must have actually run for a negative-sentiment input' )

} )
