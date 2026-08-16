/**
 * Per-user model of what the AI believes the user knows, feels and intends.
 * Fed by LanguageProvider's 'mentalState' task (or the heuristic fallback),
 * so the AI can react to inferred intent rather than just literal text.
 */
export class TheoryOfMind {

	constructor() {

		this.models = new Map()

	}

	#entry( userId ) {

		if ( !this.models.has( userId ) ) {

			this.models.set( userId, { beliefs: new Map(), inferredEmotion: 'neutral', inferredIntent: null, valence: 0 } )

		}
		return this.models.get( userId )

	}

	update( userId, mentalState ) {

		const entry           = this.#entry( userId )
		entry.inferredEmotion = mentalState.inferredEmotion ?? entry.inferredEmotion
		entry.inferredIntent  = mentalState.inferredIntent ?? entry.inferredIntent
		entry.valence         = mentalState.valence ?? entry.valence
		return entry

	}

	updateBelief( userId, topic, belief ) {

		this.#entry( userId ).beliefs.set( topic, belief )

	}

	getBeliefAbout( userId, topic ) {

		return this.#entry( userId ).beliefs.get( topic ) ?? 'No information'

	}

	getModel( userId ) {

		return this.#entry( userId )

	}

}
