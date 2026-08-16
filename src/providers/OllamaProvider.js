import { LanguageProvider } from './LanguageProvider.js'

const PROMPTS = {
	sentiment      : payload => `Analyze the sentiment of this text and respond ONLY with JSON {"score": number between -1 and 1}.\nText: "${payload.text}"`,
	appraisal      : payload => `Appraise this text like a psychologist evaluating an event. Respond ONLY with JSON {"desirability": -1..1, "agency": "self"|"user"|"other", "expectedness": 0..1, "moralWeight": 0..1}.\nText: "${payload.text}"`,
	beliefConflict : payload => `Does this text conflict with any of these beliefs: ${JSON.stringify( ( payload.beliefs || [] ).map( b => b.statement ) )}? Respond ONLY with JSON {"score": 0..1}.\nText: "${payload.text}"`,
	mentalState    : payload => `Infer the speaker's emotional state and intent. Respond ONLY with JSON {"inferredEmotion": string, "inferredIntent": string, "valence": -1..1}.\nText: "${payload.text}"`,
	selfCritique   : payload => `Rate how much this response violates a kindness/politeness norm. Respond ONLY with JSON {"score": 0..1}.\nText: "${payload.text}"`,
}

/**
 * Adapter for a local Ollama instance. Uses native fetch (Node >=18), no npm dependency.
 * Falls back to throwing on failure — the orchestrator is responsible for catching and
 * falling back to HeuristicProvider, so a missing/unreachable Ollama never breaks the pipeline.
 */
export class OllamaProvider extends LanguageProvider {

	constructor( { host = 'http://localhost:11434', model = 'llama3', timeoutMs = 4000 } = {} ) {

		super()
		this.host      = host
		this.model     = model
		this.timeoutMs = timeoutMs

	}

	async analyze( task, payload = {} ) {

		const buildPrompt = PROMPTS[ task ]
		if ( !buildPrompt ) throw new Error( `OllamaProvider: unsupported task "${task}"` )

		const controller = new AbortController()
		const timer       = setTimeout( () => controller.abort(), this.timeoutMs )

		try {

			const res = await fetch( `${this.host}/api/generate`, {
				method  : 'POST',
				headers : { 'Content-Type': 'application/json' },
				body    : JSON.stringify( {
					model  : this.model,
					prompt : buildPrompt( payload ),
					stream : false,
					format : 'json',
				} ),
				signal : controller.signal,
			} )

			if ( !res.ok ) throw new Error( `Ollama request failed with status ${res.status}` )

			const data = await res.json()
			return JSON.parse( data.response )

		}
		finally {

			clearTimeout( timer )

		}

	}

}
