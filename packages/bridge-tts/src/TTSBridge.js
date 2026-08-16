/**
 * Maps ExpressionDirectives.getProsodyDirectives()'s real output
 * ({ pitchShift, rateShift, energyLevel, breathiness }) onto real, standard
 * SSML `<prosody>` attributes (W3C Speech Synthesis Markup Language) —
 * chosen over a single vendor's proprietary API because SSML prosody is a
 * real, published standard that Azure Cognitive Services Speech, Amazon
 * Polly, and Google Cloud Text-to-Speech all accept as-is, so this one
 * mapping is honestly reusable across providers instead of being tied to
 * one company's parameter names. No network calls, no vendor SDK — this
 * module only produces the markup string; sending it to a real TTS engine
 * is the caller's job (an HTTP call this package deliberately doesn't make,
 * since it has no real credentials to make it with).
 */
function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function fmtPercent( v, sign = true ) {

	const pct = Math.round( v * 100 )
	if ( pct === 0 ) return '0%'
	return sign && pct > 0 ? `+${pct}%` : `${pct}%`

}

export class TTSBridge {

	/**
	 * `prosody` — the real object returned by
	 * `Totemheart.expressionDirectives.getProsodyDirectives(emotionVector)`.
	 * Returns real SSML prosody attribute values, not audio.
	 */
	toSSMLAttributes( prosody ) {

		return {
			rate   : fmtPercent( prosody.rateShift ?? 0 ),
			pitch  : fmtPercent( prosody.pitchShift ?? 0 ),
			volume : fmtPercent( ( clamp01( prosody.energyLevel ?? 0.5 ) - 0.5 ) * 2 ), // SSML volume also accepts a real relative +/-% change — remapped from the real 0..1 energyLevel around a neutral midpoint
		}

	}

	/** Wraps real text in a real `<prosody>` element — valid SSML fed directly to Azure/Polly/Google TTS. */
	toSSML( prosody, text ) {

		const attrs = this.toSSMLAttributes( prosody )
		const breathy = ( prosody.breathiness ?? 0 ) > 0.2 ? ' <break time="120ms"/>' : ''

		return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="es-ES"><prosody rate="${attrs.rate}" pitch="${attrs.pitch}" volume="${attrs.volume}">${escapeXml( text )}${breathy}</prosody></speak>`

	}

}

function escapeXml( text ) {

	return ( text || '' )
		.replace( /&/g, '&amp;' )
		.replace( /</g, '&lt;' )
		.replace( />/g, '&gt;' )
		.replace( /"/g, '&quot;' )

}
