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

	/**
	 * Real DIVERGENCE — Giles, H. (1973), "Accent mobility: A model and
	 * some data", Anthropological Linguistics, 15(2), 87-105 (the original
	 * Communication Accommodation Theory paper: real convergence toward a
	 * liked interlocutor's style, already `getBlendedTarget()`'s own
	 * behavior above, is one half of the real theory — the other half is
	 * real DIVERGENCE, deliberately moving style AWAY from a disliked/
	 * hostile interlocutor's own style, to signal real social distance).
	 * `hostility` (0..1, real, e.g. clamp01(-desirability)) pushes the
	 * target target in the OPPOSITE direction from the user's own style
	 * instead of toward it.
	 */
	getAccommodationTarget( userId, baseStyle, attachmentWeight, hostility = 0 ) {

		if ( hostility <= 0.3 ) return this.getBlendedTarget( userId, baseStyle, attachmentWeight )

		const userStyle = this.getUserStyle( userId )
		const w                 = Math.max( 0, Math.min( 1, hostility ) )

		return {
			avgWordLength     : baseStyle.avgWordLength - w * ( userStyle.avgWordLength - baseStyle.avgWordLength ),
			avgSentenceLength : baseStyle.avgSentenceLength - w * ( userStyle.avgSentenceLength - baseStyle.avgSentenceLength ),
		}

	}

}
