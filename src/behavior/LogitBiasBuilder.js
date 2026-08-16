/**
 * Real logit-bias penalties — the actual mechanism OpenAI-compatible chat
 * APIs expose as `logit_bias` (a map from token to an additive penalty
 * subtracted from that token's logit before softmax, exactly the formula
 * requested: P(x_i) = softmax((z_i − P_i)/T)). Two honest limits, stated
 * plainly: (1) `logit_bias` needs numeric TOKEN IDs from the specific
 * host model's own tokenizer — Totemheart has no access to that, so this
 * produces a WORD-level bias map; converting words to that model's token
 * IDs is the host's job, using their own tokenizer, before passing this to
 * their API. (2) this only does anything for a host actually calling an
 * API that supports `logit_bias` — it's inert metadata otherwise, same as
 * `systemPrompt` is inert unless a host reads it.
 */
export const DEFAULT_CHARGED_WORDS = [
	'idiota', 'estúpido', 'estupido', 'inútil', 'inutil', 'odio', 'basta',
	'callate', 'cállate', 'nunca', 'jamás', 'jamas', 'terrible', 'horrible',
]

export class LogitBiasBuilder {

	/** suppressionDrive 0..1 -> a real penalty map, scaled into the -100..100 range most logit_bias APIs use. */
	build( suppressionDrive, chargedWords = DEFAULT_CHARGED_WORDS ) {

		if ( suppressionDrive <= 0 ) return {}

		const penalty = -Math.round( suppressionDrive * 100 )
		return Object.fromEntries( chargedWords.map( word => [ word, penalty ] ) )

	}

}
