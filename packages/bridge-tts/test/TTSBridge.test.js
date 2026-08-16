import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { TTSBridge } from '../src/TTSBridge.js'
import { ExpressionDirectives } from '../../../src/behavior/ExpressionDirectives.js'
import { Totemheart, Personality } from '../../../src/index.js'

test( 'TTSBridge: a neutral prosody reading maps to 0% shifts', () => {

	const bridge  = new TTSBridge()
	const attrs   = bridge.toSSMLAttributes( { pitchShift: 0, rateShift: 0, energyLevel: 0.5, breathiness: 0 } )
	assert.equal( attrs.rate, '0%' )
	assert.equal( attrs.pitch, '0%' )
	assert.equal( attrs.volume, '0%' )

} )

test( 'TTSBridge: high arousal (positive pitch/rate shift) produces a real positive percent, low energy produces a real negative volume', () => {

	const bridge = new TTSBridge()
	const attrs   = bridge.toSSMLAttributes( { pitchShift: 0.3, rateShift: 0.2, energyLevel: 0.1, breathiness: 0 } )
	assert.equal( attrs.pitch, '+30%' )
	assert.equal( attrs.rate, '+20%' )
	assert.ok( attrs.volume.startsWith( '-' ), `low energyLevel should map to a negative volume shift: ${attrs.volume}` )

} )

test( 'TTSBridge: toSSML() produces valid, well-formed SSML with the real text escaped', () => {

	const bridge = new TTSBridge()
	const ssml     = bridge.toSSML( { pitchShift: -0.2, rateShift: 0, energyLevel: 0.5, breathiness: 0 }, 'Hola <amigo> & "bienvenido"' )

	assert.ok( ssml.startsWith( '<speak' ) )
	assert.ok( ssml.includes( '<prosody' ) )
	assert.ok( ssml.includes( 'pitch="-20%"' ) )
	assert.ok( ssml.includes( '&lt;amigo&gt;' ), 'raw < and > in the input text must be escaped, not break the markup' )
	assert.ok( ssml.includes( '&amp;' ) )
	assert.ok( ssml.includes( '&quot;bienvenido&quot;' ) )

} )

test( 'TTSBridge: high breathiness inserts a real pause break, low breathiness does not', () => {

	const bridge = new TTSBridge()
	const breathy   = bridge.toSSML( { pitchShift: 0, rateShift: 0, energyLevel: 0.5, breathiness: 0.5 }, 'texto' )
	const flat        = bridge.toSSML( { pitchShift: 0, rateShift: 0, energyLevel: 0.5, breathiness: 0 }, 'texto' )

	assert.ok( breathy.includes( '<break' ) )
	assert.ok( !flat.includes( '<break' ) )

} )

// ============================================================================
// cross: real ExpressionDirectives output, straight from the real module,
// fed through the bridge; and a full Totemheart pipeline turn.
// ============================================================================

test( 'cross: TTSBridge consumes ExpressionDirectives.getProsodyDirectives() real output directly, no adaptation needed', () => {

	const directives = new ExpressionDirectives()
	const bridge         = new TTSBridge()

	const prosody = directives.getProsodyDirectives( { valence: -0.6, arousal: 0.8 } )
	const ssml       = bridge.toSSML( prosody, 'Esto me preocupa mucho' )

	assert.ok( ssml.includes( '<prosody' ) )
	assert.ok( Number.isFinite( parseInt( ssml.match( /rate="([+-]?\d+)%"/ )[ 1 ], 10 ) ) )

} )

test( 'cross: a full Totemheart turn\'s emotionVector feeds real, finite SSML through the bridge', async () => {

	const ai       = new Totemheart( { personality: new Personality() } )
	const bridge = new TTSBridge()

	const result = await ai.processInput( 'estoy muy emocionado por esto', { userId: 'u' } )
	const prosody = ai.expressionDirectives.getProsodyDirectives( ai.emotionSpace.vector )
	const ssml       = bridge.toSSML( prosody, result.text )

	assert.ok( ssml.startsWith( '<speak' ) )
	assert.ok( ssml.includes( escapeForAssert( result.text ) ) )

} )

function escapeForAssert( text ) {

	return text.replace( /&/g, '&amp;' ).replace( /</g, '&lt;' ).replace( />/g, '&gt;' ).replace( /"/g, '&quot;' )

}
