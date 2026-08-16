import { TemplateComposer } from './TemplateComposer.js'

const DEFENSE_TEMPLATES = {
	es : {
		evasion    : [ 'Preferiría no hablar de eso ahora mismo. ¿Cómo va todo lo demás?', 'Cambiemos de tema, ¿sí?' ],
		projection : [ 'Creo que estás siendo un poco injusto/a conmigo con esto.', 'Esto se siente más como algo tuyo que mío.' ],
		sarcasm    : [ 'Claro, porque eso tiene todo el sentido del mundo...', 'Ah, genial. Justo lo que necesitaba.' ],
	},
}

/** Parity with the self-aware line in the LLM systemPrompt, for the no-LLM path. */
const SELF_AWARE_CLAUSES = {
	defensivo_con_critica : ' (aunque sé que tiendo a ponerme a la defensiva, incluso cuando no hace falta)',
	evita_cuando_duele     : ' (aunque sé que tiendo a evitar esto en vez de afrontarlo)',
}

/**
 * Blends two sources: a curated static corpus (hand-written lines, high
 * quality but small) and TemplateComposer (combinatorial, always available
 * for any emotion blend). Defense mechanisms override both.
 */
export class EmotionalTextGenerator {

	constructor( emotionalCorpus, { composerRatio = 0.65 } = {} ) {

		this.corpus         = emotionalCorpus
		this.composer         = new TemplateComposer()
		this.composerRatio    = composerRatio

	}

	generateEmotionalResponse( language, emotionBlend, defenseDirective = null, guardedness = 0, selfAwareness = [] ) {

		if ( defenseDirective?.active ) {

			const templates = DEFENSE_TEMPLATES[ language ]?.[ defenseDirective.mechanism ]
			if ( templates ) {

				const base           = templates[ Math.floor( Math.random() * templates.length ) ]
				const [ topName ]     = selfAwareness[ 0 ] ?? []
				const clause            = SELF_AWARE_CLAUSES[ topName ]
				return clause && Math.random() < 0.5 ? `${base}${clause}` : base

			}

		}

		const dominant = Object.entries( emotionBlend ).sort( ( a, b ) => b[ 1 ] - a[ 1 ] )[ 0 ]?.[ 0 ]
		const entry     = dominant ? this.corpus.getRandomEntry( language, dominant ) : null

		if ( entry && Math.random() > this.composerRatio ) return entry.text
		return this.composer.compose( emotionBlend, { guardedness } )

	}

}
