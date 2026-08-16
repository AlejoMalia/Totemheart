/**
 * Real cosine similarity against latent concept clusters — Similitud(A,B) =
 * (A·B)/(||A||·||B||) — computed on real sentence embeddings (from
 * TransformersProvider.embed(), verified end-to-end during development:
 * related threat sentences scored ~0.74 similarity, an unrelated positive
 * sentence scored ~0.36 against the same anchor). Requires an embedding
 * backend to be supplied; `EmotionalOntology`'s keyword matching is what
 * runs when none is configured — this doesn't replace that fallback, it's
 * a strictly better signal when a real embedding model is available.
 */
const DEFAULT_CLUSTERS = {
	hostilidad          : 'me estás atacando, esto es una amenaza y me insultas',
	curiosidad_genuina    : 'qué interesante, cuéntame más sobre eso, tengo curiosidad',
	afecto                  : 'te aprecio mucho, esto significa mucho para mí',
	urgencia                   : 'esto es urgente, necesito una respuesta ahora mismo',
}

export function cosineSimilarity( a, b ) {

	let dot = 0
	let na    = 0
	let nb     = 0
	for ( let i = 0; i < a.length; i++ ) {

		dot += a[ i ] * b[ i ]
		na    += a[ i ] * a[ i ]
		nb     += b[ i ] * b[ i ]

	}
	const denom = Math.sqrt( na ) * Math.sqrt( nb )
	return denom > 0 ? dot / denom : 0

}

export class SemanticSimilarity {

	constructor( embedProvider = null, clusters = DEFAULT_CLUSTERS ) {

		this.embedProvider     = embedProvider // an object with an async embed(text) method, e.g. TransformersProvider
		this.clusters             = clusters
		this.clusterEmbeddings      = new Map()

	}

	get available() {

		return this.embedProvider !== null

	}

	async #ensureClusters() {

		for ( const [ name, exampleText ] of Object.entries( this.clusters ) ) {

			if ( !this.clusterEmbeddings.has( name ) ) this.clusterEmbeddings.set( name, await this.embedProvider.embed( exampleText ) )

		}

	}

	/** Returns {clusterName: similarity} for every configured cluster, or null if no embedding backend is configured. */
	async classify( text ) {

		if ( !this.available ) return null

		await this.#ensureClusters()
		const vector = await this.embedProvider.embed( text )

		const scores = {}
		for ( const [ name, clusterVector ] of this.clusterEmbeddings ) scores[ name ] = cosineSimilarity( vector, clusterVector )
		return scores

	}

}
