/**
 * "Self-healing" reframed honestly for a single-process library: Totemheart
 * has no distributed workers to lose and reconstruct topologically — that
 * framing doesn't apply here. What DOES apply, and is real: any one optional
 * pipeline stage (a custom LanguageProvider throwing, a malformed input
 * tripping a module) should never take down the whole turn. Each risky stage
 * is wrapped so a failure degrades to a safe fallback and gets logged,
 * instead of propagating and losing the turn's state entirely.
 */
export async function safeStep( explainability, stepName, fn, fallbackValue ) {

	try {

		return await fn()

	}
	catch ( error ) {

		explainability?.logDecision( 'degraded_step', `${stepName} failed and fell back to a safe default: ${error?.message ?? error}` )
		return fallbackValue

	}

}
