/**
 * Real Anthropic Messages API provider — same real throw-on-failure
 * resilience contract as `OllamaProvider`/`OpenAIProvider`: throws on ANY
 * failure (missing key, unreachable host, non-2xx status, malformed JSON),
 * and Totemheart's own `#analyze()` catches that and falls back to
 * `HeuristicProvider` transparently. Duck-types the real provider contract
 * directly (`async analyze(task, payload)`) — no import of/dependency on
 * core's `LanguageProvider` class needed, matching the same pattern
 * `OpenAIProvider` already uses.
 */
const PROMPTS = {
	sentiment      : payload => `Analyze the sentiment of this text and respond ONLY with JSON {"score": number between -1 and 1}.\nText: "${payload.text}"`,
	appraisal      : payload => `Appraise this text like a psychologist evaluating an event. Respond ONLY with JSON {"desirability": -1..1, "agency": "self"|"user"|"other", "expectedness": 0..1, "moralWeight": 0..1}.\nText: "${payload.text}"`,
	beliefConflict : payload => `Does this text conflict with any of these beliefs: ${JSON.stringify( ( payload.beliefs || [] ).map( b => b.statement ) )}? Respond ONLY with JSON {"score": 0..1}.\nText: "${payload.text}"`,
	mentalState    : payload => `Infer the speaker's emotional state and intent. Respond ONLY with JSON {"inferredEmotion": string, "inferredIntent": string, "valence": -1..1}.\nText: "${payload.text}"`,
	selfCritique   : payload => `Rate how much this response violates a kindness/politeness norm. Respond ONLY with JSON {"score": 0..1}.\nText: "${payload.text}"`,
}

export class AnthropicProvider {

	constructor( { apiKey = process.env.ANTHROPIC_API_KEY, baseURL = 'https://api.anthropic.com/v1', model = 'claude-sonnet-5', apiVersion = '2023-06-01', timeoutMs = 8000 } = {} ) {

		this.apiKey     = apiKey
		this.baseURL    = baseURL
		this.model      = model
		this.apiVersion = apiVersion
		this.timeoutMs  = timeoutMs

	}

	async analyze( task, payload = {} ) {

		const buildPrompt = PROMPTS[ task ]
		if ( !buildPrompt ) throw new Error( `AnthropicProvider: unsupported task "${task}"` )
		if ( !this.apiKey ) throw new Error( 'AnthropicProvider: no API key configured' )

		const controller = new AbortController()
		const timer         = setTimeout( () => controller.abort(), this.timeoutMs )

		try {

			const res = await fetch( `${this.baseURL}/messages`, {
				method  : 'POST',
				headers : {
					'Content-Type'      : 'application/json',
					'x-api-key'         : this.apiKey,
					'anthropic-version' : this.apiVersion,
				},
				body : JSON.stringify( {
					model      : this.model,
					max_tokens : 256,
					messages   : [ { role: 'user', content: `${buildPrompt( payload )}\nRespond with ONLY the raw JSON object, no prose, no markdown fences.` } ],
				} ),
				signal : controller.signal,
			} )

			if ( !res.ok ) throw new Error( `AnthropicProvider: request failed with status ${res.status}` )

			const data    = await res.json()
			const content = data?.content?.[ 0 ]?.text
			if ( !content ) throw new Error( 'AnthropicProvider: empty completion' )

			return JSON.parse( content )

		}
		finally {

			clearTimeout( timer )

		}

	}

}
