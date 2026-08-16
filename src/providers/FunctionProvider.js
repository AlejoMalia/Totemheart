import { LanguageProvider } from './LanguageProvider.js'

/**
 * Generic adapter that lets any host (Claude Code, another agent, a custom LLM
 * client) plug in its own inference call without Totemheart needing to know about it.
 *
 * Example:
 *   new FunctionProvider(async (task, payload) => hostAgent.infer(task, payload))
 */
export class FunctionProvider extends LanguageProvider {

	constructor( fn ) {

		super()
		if ( typeof fn !== 'function' ) throw new Error( 'FunctionProvider requires an async function (task, payload) => result' )
		this.fn = fn

	}

	async analyze( task, payload = {} ) {

		return await this.fn( task, payload )

	}

}
