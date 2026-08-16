/** Decision log so any consumer can inspect *why* the AI reacted a certain way. */
export class ExplainabilityEngine {

	constructor() {

		this.decisionLog = []

	}

	logDecision( decision, reasoning ) {

		this.decisionLog.push( { decision, reasoning, timestamp: Date.now() } )

	}

	getExplanation( decisionIndex ) {

		const decision = this.decisionLog[ decisionIndex ]
		if ( !decision ) return 'No explanation available for this decision.'
		return `Decision: ${decision.decision}\nReasoning: ${decision.reasoning}\nTime: ${new Date( decision.timestamp ).toLocaleString()}`

	}

	generateReport() {

		return this.decisionLog.map( ( d, i ) => `Decision ${i + 1}:\n${this.getExplanation( i )}` ).join( '\n\n' )

	}

}
