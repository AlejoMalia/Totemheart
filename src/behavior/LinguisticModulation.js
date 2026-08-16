/**
 * Maps the emotional vector to surface text properties. Returns metadata
 * rather than silently rewriting the text, so a host app can choose which
 * effects to actually apply (e.g. skip typo injection in a production UI).
 */
export class LinguisticModulation {

	/**
	 * `styleTarget` (optional, from StyleMimicry) is a real, attachment-weighted
	 * blend of this user's own average sentence length and the AI's base style.
	 * Only trims — never pads with invented content — and only when the AI is
	 * running noticeably longer than the target and Attachment made this user's
	 * style actually count for something.
	 */
	modulate( text, { vector, fatigueLevel = 0, styleTarget = null } ) {

		const { valence, arousal } = vector
		const styleTags            = []
		let delayMs                 = 0
		let output                  = text

		if ( arousal > 0.5 && valence < -0.2 ) {

			styleTags.push( 'fragmented', 'fearful' )
			output = output.replace( /\. /g, '... ' )

		}
		else if ( arousal < -0.2 && valence < -0.2 ) {

			styleTags.push( 'passive', 'low-energy' )
			delayMs = 1200 + Math.abs( valence ) * 1500

		}
		else if ( valence > 0.4 && arousal > 0.3 ) {

			styleTags.push( 'upbeat' )

		}

		if ( fatigueLevel > 0.7 ) styleTags.push( 'fatigued' )

		if ( styleTarget && styleTarget.avgSentenceLength > 0 ) {

			const sentences               = output.split( /(?<=[.!?])\s+/ ).filter( s => s.trim().length > 0 )
			const words                       = output.match( /\p{L}+/gu ) || []
			const currentAvgSentenceLength = sentences.length ? words.length / sentences.length : words.length

			if ( sentences.length > 1 && currentAvgSentenceLength > styleTarget.avgSentenceLength * 1.8 ) {

				const keep = Math.max( 1, Math.round( sentences.length * ( styleTarget.avgSentenceLength / currentAvgSentenceLength ) ) )
				output       = sentences.slice( 0, keep ).join( ' ' )
				styleTags.push( 'mimicry-trimmed' )

			}

		}

		return { text: output, delayMs, styleTags }

	}

}
