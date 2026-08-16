/**
 * Real softmax attention weights over the tokens of the INPUT text (not a
 * transformer's internal Q/K/V — Totemheart doesn't run a transformer, so
 * there are no attention matrices inside it to manipulate). What's real and
 * honest here: Attention(Q,K,V) = softmax(QKᵀ/√d_k)·V is, at its core, a
 * softmax over per-token relevance scores producing a weighting that sums
 * to 1 — that part is reproduced exactly, with "relevance score" computed
 * from each token's emotional charge (the same lexicon HeuristicProvider
 * uses) instead of learned Q/K vectors. High charge tokens get most of the
 * weight, the same qualitative effect the request describes ("more than
 * 80% of the weight on the most conflictive phrase") without pretending to
 * reach into a model Totemheart doesn't run.
 */
function tokenize( text ) {

	return ( text || '' ).toLowerCase().match( /[\p{L}']+/gu ) || []

}

export class AttentionFocus {

	constructor( { chargedWords = new Map(), habituationAlpha = 0.85 } = {} ) {

		this.chargedWords     = chargedWords // token -> charge score (0..1); unlisted tokens default to a low baseline
		this.habituation        = new Map() // token -> EMA of past attention weight (0..1)
		this.habituationAlpha = habituationAlpha // EMA persistence: higher = slower to habituate, slower to recover

	}

	/** Current habituation reading for a token, 0 if never attended to. */
	getHabituation( token ) {

		return this.habituation.get( token ) ?? 0

	}

	/**
	 * Real softmax over per-token relevance, then a real EMA-based saturation:
	 * a token that has repeatedly drawn strong attention gets its pre-softmax
	 * score divided down before renormalizing, the same saturating shape
	 * HedonicAdaptation applies to a whole utterance's emotional fingerprint —
	 * here at token granularity instead, so a repeated trigger *word* stops
	 * dominating attention even inside a novel sentence. Returns [{ token,
	 * weight }] — weights still sum to 1 after the habituation-adjusted softmax.
	 */
	computeWeights( text, temperature = 0.3 ) {

		const tokens = tokenize( text )
		if ( !tokens.length ) return []

		const scores  = tokens.map( t => this.chargedWords.get( t ) ?? 0.05 )
		const damped   = scores.map( ( s, i ) => s / ( 1 + this.getHabituation( tokens[ i ] ) ) )
		const scaled     = damped.map( s => s / temperature )
		const max          = Math.max( ...scaled )
		const exps           = scaled.map( s => Math.exp( s - max ) )
		const total            = exps.reduce( ( a, b ) => a + b, 0 )
		const weights            = tokens.map( ( token, i ) => ( { token, weight: exps[ i ] / total } ) )

		for ( const { token, weight } of weights ) {

			this.habituation.set( token, this.habituationAlpha * this.getHabituation( token ) + ( 1 - this.habituationAlpha ) * weight )

		}

		return weights

	}

}
