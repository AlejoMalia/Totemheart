import { cosineSimilarity } from './SemanticSimilarity.js'

/**
 * Boredom from talking about the same thing without new information — a
 * real rolling-window cosine-similarity decay, own design (no citation).
 * Needs a real embedding backend (same optional one SemanticSimilarity
 * uses); without one this gracefully returns 0 fatigue every turn, same
 * fallback pattern as SemanticSimilarity itself — EmotionalOntology's
 * keyword path is what's actually driving novelty in that case, via
 * NoveltyDetector's KL divergence instead.
 */
export class TopicSatiation {

	constructor( embedProvider = null, { windowSize = 5, threshold = 0.85 } = {} ) {

		this.embedProvider = embedProvider
		this.windowSize       = windowSize
		this.threshold          = threshold
		this.history               = [] // recent turn embeddings, most recent last

	}

	get available() {

		return this.embedProvider !== null

	}

	/** Returns { fatigue, meanSimilarity } for this turn against its own recent window, then records it. */
	async observe( text ) {

		if ( !this.available ) return { fatigue: 0, meanSimilarity: 0 }

		const vector = await this.embedProvider.embed( text )

		if ( this.history.length === 0 ) {

			this.history.push( vector )
			return { fatigue: 0, meanSimilarity: 0 }

		}

		const similarities = this.history.map( past => cosineSimilarity( vector, past ) )
		const meanSimilarity = similarities.reduce( ( a, b ) => a + b, 0 ) / similarities.length
		const fatigue               = similarities.reduce( ( sum, s ) => sum + Math.max( 0, s - this.threshold ), 0 )

		this.history.push( vector )
		if ( this.history.length > this.windowSize ) this.history.shift()

		return { fatigue, meanSimilarity }

	}

}
