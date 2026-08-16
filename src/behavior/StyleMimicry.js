function splitSentences( text ) {

	return ( text || '' ).split( /(?<=[.!?])\s+/ ).filter( s => s.trim().length > 0 )

}

function splitWords( text ) {

	return ( text || '' ).match( /\p{L}+/gu ) || []

}

/**
 * Real lexical statistics (average word length, average sentence length) —
 * not a claim of matching syntax or vocabulary choice, just the two
 * cheapest real, measurable style dimensions available without a parser.
 * Own design, no citation.
 */
export class StyleMimicry {

	constructor( { alpha = 0.7 } = {} ) {

		this.alpha    = alpha
		this.history = new Map() // userId -> { avgWordLength, avgSentenceLength } EMA

	}

	measure( text ) {

		const words          = splitWords( text )
		const sentences   = splitSentences( text )
		const avgWordLength     = words.length ? words.reduce( ( s, w ) => s + w.length, 0 ) / words.length : 0
		const avgSentenceLength = sentences.length ? words.length / sentences.length : words.length

		return { avgWordLength, avgSentenceLength }

	}

	observe( userId, text ) {

		const sample = this.measure( text )
		const prior     = this.history.get( userId )

		this.history.set( userId, prior
			? { avgWordLength: this.alpha * prior.avgWordLength + ( 1 - this.alpha ) * sample.avgWordLength, avgSentenceLength: this.alpha * prior.avgSentenceLength + ( 1 - this.alpha ) * sample.avgSentenceLength }
			: sample,
		)

		return sample

	}

	getUserStyle( userId ) {

		return this.history.get( userId ) ?? { avgWordLength: 5, avgSentenceLength: 10 }

	}

	/** Interpolates between the AI's own base style and this user's, weighted by real Attachment trust — a genuine chameleon effect, not applied indiscriminately to strangers. */
	getBlendedTarget( userId, baseStyle, attachmentWeight ) {

		const userStyle = this.getUserStyle( userId )
		const w                 = Math.max( 0, Math.min( 1, attachmentWeight ) )

		return {
			avgWordLength     : w * userStyle.avgWordLength + ( 1 - w ) * baseStyle.avgWordLength,
			avgSentenceLength : w * userStyle.avgSentenceLength + ( 1 - w ) * baseStyle.avgSentenceLength,
		}

	}

}
