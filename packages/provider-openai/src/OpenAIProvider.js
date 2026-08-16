/**
 * Real OpenAI-compatible chat-completions provider — works with the actual
 * OpenAI API and with any real OpenAI-compatible endpoint (many local/hosted
 * inference servers implement the same `/chat/completions` shape), since
 * `baseURL` is a real, honest parameter, not hardcoded.
 *
 * Duck-types Totemheart's real provider contract directly (`async
 * analyze(task, payload)`) — Totemheart's own `#analyze()` calls
 * `this.provider.analyze(task, payload)` with no `instanceof` check, so this
 * class doesn't need to import or extend `LanguageProvider` from the core
 * package to work; it only needs the peer dependency for documentation/
 * discoverability purposes, matching `OllamaProvider`'s real resilience
 * contract exactly: throws on ANY failure (network error, non-2xx status,
 * malformed JSON), and the orchestrator (Totemheart's `#analyze()`) catches
 * that and falls back to `HeuristicProvider` — a missing/invalid API key or
 * an unreachable endpoint never breaks the pipeline.
 */
const PROMPTS = {
	sentiment      : payload => `Analyze the sentiment of this text and respond ONLY with JSON {"score": number between -1 and 1}.\nText: "${payload.text}"`,
	appraisal      : payload => `Appraise this text like a psychologist evaluating an event. Respond ONLY with JSON {"desirability": -1..1, "agency": "self"|"user"|"other", "expectedness": 0..1, "moralWeight": 0..1}.\nText: "${payload.text}"`,
	beliefConflict : payload => `Does this text conflict with any of these beliefs: ${JSON.stringify( ( payload.beliefs || [] ).map( b => b.statement ) )}? Respond ONLY with JSON {"score": 0..1}.\nText: "${payload.text}"`,
	mentalState    : payload => `Infer the speaker's emotional state and intent. Respond ONLY with JSON {"inferredEmotion": string, "inferredIntent": string, "valence": -1..1}.\nText: "${payload.text}"`,
	selfCritique   : payload => `Rate how much this response violates a kindness/politeness norm. Respond ONLY with JSON {"score": 0..1}.\nText: "${payload.text}"`,
}

export class OpenAIProvider {

	constructor( { apiKey = process.env.OPENAI_API_KEY, baseURL = 'https://api.openai.com/v1', model = 'gpt-4o-mini', timeoutMs = 8000 } = {} ) {

		this.apiKey    = apiKey
		this.baseURL   = baseURL
		this.model     = model
		this.timeoutMs = timeoutMs

	}

	async analyze( task, payload = {} ) {

		const buildPrompt = PROMPTS[ task ]
		if ( !buildPrompt ) throw new Error( `OpenAIProvider: unsupported task "${task}"` )
		if ( !this.apiKey ) throw new Error( 'OpenAIProvider: no API key configured' )

		const controller = new AbortController()
		const timer         = setTimeout( () => controller.abort(), this.timeoutMs )

		try {

			const res = await fetch( `${this.baseURL}/chat/completions`, {
				method  : 'POST',
				headers : { 'Content-Type': 'application/json', Authorization: `Bearer ${this.apiKey}` },
				body    : JSON.stringify( {
					model            : this.model,
					messages         : [ { role: 'user', content: buildPrompt( payload ) } ],
					response_format  : { type: 'json_object' },
					temperature      : 0,
				} ),
				signal : controller.signal,
			} )

			if ( !res.ok ) throw new Error( `OpenAIProvider: request failed with status ${res.status}` )

			const data    = await res.json()
			const content = data?.choices?.[ 0 ]?.message?.content
			if ( !content ) throw new Error( 'OpenAIProvider: empty completion' )

			return JSON.parse( content )

		}
		finally {

			clearTimeout( timer )

		}

	}

}
