import { LanguageProvider } from './LanguageProvider.js'

/**
 * Real ML integration — genuinely trained on GoEmotions (Demszky et al.,
 * 2020, "GoEmotions: A Dataset of Fine-Grained Emotions", 28 labels from
 * Reddit comments), not a hand-written lexicon.
 *
 * Default model: kamaludeen/multilingual_go_emotions-ONNX (bert-base-
 * multilingual-cased fine-tuned on GoEmotions; Arabic/English/French/
 * Spanish/Dutch/Turkish). Chosen — and actually run, not just read about —
 * because Totemheart defaults to Spanish and the plain English GoEmotions
 * checkpoint (MicahB/roberta-base-go_emotions) was tested against Spanish
 * input during development and returned near-garbage ("te quiero muchísimo,
 * esto es maravilloso" → neutral, 24% confidence) versus a clean read on the
 * equivalent English sentence (→ love, 93%). The multilingual checkpoint was
 * tested the same way and returned sensible labels on Spanish input
 * ("te quiero muchísimo..." → admiration, 80%). If your deployment is
 * English-only, MicahB/roberta-base-go_emotions is the better-known
 * alternative — pass `{ model: 'MicahB/roberta-base-go_emotions' }`.
 *
 * `@xenova/transformers` (or its successor `@huggingface/transformers`) is
 * an OPTIONAL peer dependency — Totemheart's default install stays at zero
 * dependencies. Install it yourself to use this provider:
 *   npm install @xenova/transformers
 *
 * Both model IDs above were confirmed as "Transformers.js"-tagged on the HF
 * hub (the tag HF applies automatically when a repo ships the onnx/ layout
 * the library expects) and were actually loaded and run against test input
 * during development, not just read about. If you swap `model` for anything
 * else, verify that tag on its own hub page first — most GoEmotions
 * checkpoints on the hub do NOT carry it. See CALIBRATION.md.
 */
export class TransformersProvider extends LanguageProvider {

	constructor( { model = 'kamaludeen/multilingual_go_emotions-ONNX', embeddingModel = 'Xenova/all-MiniLM-L6-v2' } = {} ) {

		super()
		this.model             = model
		this.embeddingModel      = embeddingModel
		this._pipeline          = null
		this._embedPipeline       = null

	}

	async #getPipeline() {

		if ( this._pipeline ) return this._pipeline

		// Dynamic import: if the optional dependency isn't installed, this throws,
		// the caller (Totemheart's #analyze) catches it and falls back to
		// HeuristicProvider — same resilience pattern as every other provider here.
		const { pipeline } = await import( '@xenova/transformers' )
		this._pipeline       = await pipeline( 'text-classification', this.model )
		return this._pipeline

	}

	async analyze( task, payload = {} ) {

		if ( ![ 'sentiment', 'appraisal', 'mentalState' ].includes( task ) ) {

			// beliefConflict/selfCritique aren't things a single-label emotion
			// classifier can answer — throw so the resilient fallback takes over.
			throw new Error( `TransformersProvider does not support task "${task}"` )

		}

		const pipe            = await this.#getPipeline()
		const [ result ]        = await pipe( payload.text ?? '' )
		const { valence, arousal } = GOEMOTIONS_VALENCE[ result.label ] ?? { valence: 0, arousal: 0 }
		const score              = valence * result.score

		if ( task === 'sentiment' ) return { score }

		if ( task === 'mentalState' ) {

			return {
				inferredEmotion : result.label,
				inferredIntent  : /\?/.test( payload.text ?? '' ) ? 'question' : 'statement',
				valence         : score,
			}

		}

		// appraisal
		return {
			desirability : score,
			agency        : /\b(tú|tu|you)\b/i.test( payload.text ?? '' ) ? 'user' : 'other',
			expectedness  : 0.5, // the classifier gives no expectation signal — neutral default
			moralWeight   : result.score > 0.6 ? 0.6 : 0.3,
		}

	}

	/**
	 * Real sentence embeddings (a mean-pooled, normalized vector), for
	 * SemanticSimilarity's cosine-similarity concept-cluster matching —
	 * `Xenova/all-MiniLM-L6-v2` is the standard transformers.js
	 * feature-extraction example model (small, fast, widely used). This is
	 * a genuinely different pipeline task from `analyze()`'s text
	 * classification — same optional dependency, lazily loaded the same way.
	 */
	async embed( text ) {

		if ( !this._embedPipeline ) {

			const { pipeline } = await import( '@xenova/transformers' )
			this._embedPipeline  = await pipeline( 'feature-extraction', this.embeddingModel )

		}
		const output = await this._embedPipeline( text ?? '', { pooling: 'mean', normalize: true } )
		return Array.from( output.data )

	}

}

/**
 * Approximate valence/arousal per GoEmotions label (0..1 * sign). This
 * mapping is our own — GoEmotions ships discrete labels, not a circumplex
 * placement, so translating "pride" -> (valence 0.7, arousal 0.4) is an
 * engineering judgment call, same category as EmotionSpace's own
 * EMOTION_COORDS. See CALIBRATION.md.
 */
const GOEMOTIONS_VALENCE = {
	admiration      : { valence: 0.7, arousal: 0.3 },
	amusement       : { valence: 0.7, arousal: 0.5 },
	anger           : { valence: -0.8, arousal: 0.8 },
	annoyance       : { valence: -0.5, arousal: 0.5 },
	approval        : { valence: 0.5, arousal: 0.2 },
	caring          : { valence: 0.6, arousal: 0.2 },
	confusion       : { valence: -0.1, arousal: 0.4 },
	curiosity       : { valence: 0.3, arousal: 0.5 },
	desire          : { valence: 0.5, arousal: 0.5 },
	disappointment  : { valence: -0.6, arousal: 0.2 },
	disapproval     : { valence: -0.5, arousal: 0.3 },
	disgust         : { valence: -0.7, arousal: 0.4 },
	embarrassment   : { valence: -0.5, arousal: 0.4 },
	excitement      : { valence: 0.7, arousal: 0.8 },
	fear            : { valence: -0.7, arousal: 0.7 },
	gratitude       : { valence: 0.8, arousal: 0.3 },
	grief           : { valence: -0.9, arousal: 0.3 },
	joy             : { valence: 0.8, arousal: 0.6 },
	love            : { valence: 0.9, arousal: 0.4 },
	nervousness     : { valence: -0.4, arousal: 0.6 },
	optimism        : { valence: 0.6, arousal: 0.4 },
	pride           : { valence: 0.7, arousal: 0.4 },
	realization     : { valence: 0.1, arousal: 0.3 },
	relief          : { valence: 0.6, arousal: 0.2 },
	remorse         : { valence: -0.6, arousal: 0.3 },
	sadness         : { valence: -0.7, arousal: 0.2 },
	surprise        : { valence: 0.1, arousal: 0.7 },
	neutral         : { valence: 0, arousal: 0 },
}
