/**
 * Base interface for pluggable language-understanding backends.
 * Tasks: 'sentiment' | 'appraisal' | 'beliefConflict' | 'mentalState' | 'selfCritique'
 */
export class LanguageProvider {

	async analyze( task, payload ) {

		throw new Error( `LanguageProvider.analyze() not implemented for task "${task}"` )

	}

}
