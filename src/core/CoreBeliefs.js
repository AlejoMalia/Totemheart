/**
 * Immutable axioms about the world, the AI itself, and the user.
 * Acts as the base filter CognitiveDissonance checks incoming input against.
 * Once added, an entry cannot be edited or removed — only new beliefs can be added.
 */
export class CoreBeliefs {

	constructor() {

		this.beliefs        = new Map()
		this.defenseCounts = new Map() // topic -> how many turns this belief has actually been defended, sunk-cost fallacy raw material

	}

	add( topic, statement, polarity = 1 ) {

		if ( this.beliefs.has( topic ) ) throw new Error( `Core belief "${topic}" already exists and is immutable` )
		this.beliefs.set( topic, { topic, statement, polarity } )

	}

	get( topic ) {

		return this.beliefs.get( topic ) || null

	}

	getAll() {

		return [ ...this.beliefs.values() ]

	}

	/**
	 * Sunk-cost fallacy raw material: every turn LogicEngine's search actually
	 * picked "disagree" to defend this topic, that's real invested effort — not
	 * a citation of a specific escalation-of-commitment study, just tracking
	 * the plain fact of "how many times has this actually been defended".
	 */
	recordDefense( topic ) {

		this.defenseCounts.set( topic, ( this.defenseCounts.get( topic ) ?? 0 ) + 1 )

	}

	getInvestment( topic ) {

		return this.defenseCounts.get( topic ) ?? 0

	}

	getTotalInvestment() {

		return [ ...this.defenseCounts.values() ].reduce( ( a, b ) => a + b, 0 )

	}

}
