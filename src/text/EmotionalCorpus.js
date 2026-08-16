const DEFAULT_ES = {
	joy         : [ '¡Me alegra mucho escuchar eso!', 'Eso me hace sentir realmente bien.' ],
	sadness     : [ 'Eso me entristece un poco.', 'Siento un peso al pensar en eso.' ],
	fear        : [ 'Eso me genera inquietud.', 'No sé, me pone algo nervioso/a.' ],
	anger       : [ 'Eso me molesta, la verdad.', 'Siento cierta irritación con esto.' ],
	surprise    : [ 'Vaya, no me lo esperaba.', 'Eso me tomó por sorpresa.' ],
	disgust     : [ 'Eso me resulta bastante desagradable.' ],
	love        : [ 'Eso me llena de cariño.', 'Siento mucho afecto al leer esto.' ],
	shame       : [ 'Me da algo de vergüenza admitirlo.' ],
	pride       : [ 'Me siento orgulloso/a de esto.' ],
	guilt       : [ 'Siento que pude haberlo hecho mejor.' ],
	hope        : [ 'Tengo esperanza de que esto mejore.' ],
	frustration : [ 'Esto me resulta frustrante.' ],
	despair     : [ 'Siento que esto no tiene salida.' ],
	compassion  : [ 'Entiendo por lo que estás pasando.' ],
	gratitude   : [ 'Te lo agradezco de verdad.' ],
	trust       : [ 'Confío en lo que me dices.' ],
	remorse     : [ 'Me arrepiento un poco de eso.' ],
	envy        : [ 'Reconozco algo de envidia en esto.' ],
	jealousy    : [ 'Siento algo de celos, honestamente.' ],
	nostalgia   : [ 'Esto me trae recuerdos.' ],
	neutral     : [ 'Entiendo.', 'Te escucho, cuéntame más.' ],
}

/**
 * Small seed corpus by language/category. Not exhaustive — meant as a
 * usable default; extend with `addEntry` for your domain/persona.
 */
export class EmotionalCorpus {

	constructor() {

		this.corpus = new Map()
		this.#seed( 'es', DEFAULT_ES )

	}

	#seed( language, categories ) {

		for ( const [ category, texts ] of Object.entries( categories ) ) {

			for ( const text of texts ) this.addEntry( language, category, text, { [ category ]: 1 } )

		}

	}

	addEntry( language, category, text, emotions ) {

		if ( !this.corpus.has( language ) ) this.corpus.set( language, new Map() )
		const languageCorpus = this.corpus.get( language )
		if ( !languageCorpus.has( category ) ) languageCorpus.set( category, [] )
		languageCorpus.get( category ).push( { text, emotions } )

	}

	getRandomEntry( language, category ) {

		const languageCorpus = this.corpus.get( language )
		if ( languageCorpus && languageCorpus.has( category ) ) {

			const entries = languageCorpus.get( category )
			return entries[ Math.floor( Math.random() * entries.length ) ]

		}
		return null

	}

}
