import { shannonEntropy } from '../cognition/Intuition.js'

/**
 * Totemheart doesn't generate text token-by-token (no logits, no next-token
 * softmax to inspect) — so literal perplexity/softmax-flatness, as
 * requested, isn't something that exists here to measure. What genuinely
 * carries over is the math underneath it: perplexity IS, by definition,
 * 2^H where H is the Shannon entropy of a probability distribution
 * (`Intuition.shannonEntropy`). `EmotionSpace.getBlend()` already produces
 * a real probability distribution (weights summing to 1) over named
 * emotions — a FLAT blend (many emotions weighted similarly, high entropy)
 * is a real, meaningful analog of a flat next-token distribution: the
 * system doesn't have a clear read on its own emotional state, the
 * affective equivalent of a confused model. A PEAKED blend (one emotion
 * dominant, low entropy) is a confident read. This is the perplexity
 * relation applied to a distribution Totemheart actually has, not a faked
 * token-level signal.
 */
export class EgoConfidence {

	/** `blend` — the object from EmotionSpace.getBlend(), weights summing to ~1. */
	evaluate( blend ) {

		const weights     = Object.values( blend )
		const entropy       = shannonEntropy( weights )
		const perplexity      = Math.pow( 2, entropy )
		const maxPerplexity     = weights.length // perplexity of a fully flat distribution over this many outcomes

		const confidence = maxPerplexity > 1 ? 1 - ( perplexity - 1 ) / ( maxPerplexity - 1 ) : 1
		return { entropy, perplexity, confidence: Math.max( 0, Math.min( 1, confidence ) ) }

	}

}
