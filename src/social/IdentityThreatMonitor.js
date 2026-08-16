/**
 * Detects an attack on WHO the AI is (identity-level), distinct from a
 * generic negative appraisal — the real social-identity-threat distinction
 * (Steele, C. M. (1988), "The psychology of self-affirmation: Sustaining the
 * integrity of the self", Advances in Experimental Social Psychology, 21,
 * 261-302, on self-affirmation theory and threats to the integrity of the
 * self-concept specifically, versus ordinary negative feedback). Matches an
 * appraisal against CoreBeliefs entries ABOUT the self (topics the caller
 * tags as self-referential, e.g. "self_competence", "self_worth") rather
 * than treating every negative self-agency appraisal the same way
 * ReputationEngine already does for competence — this is scoped specifically
 * to identity/value statements, not competence at a task.
 */
function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

export class IdentityThreatMonitor {

	/**
	 * `appraisal` — real { agency, desirability, moralWeight } from HeuristicProvider/
	 * TransformersProvider. `selfTopics` — array of CoreBeliefs topics the caller has
	 * tagged as identity-relevant (own convention: topic starts with "self_").
	 */
	detect( appraisal, coreBeliefs, selfTopics = [] ) {

		if ( appraisal.agency !== 'self' || appraisal.desirability >= -0.2 ) return { isIdentityThreat: false }

		const relevant = selfTopics
			.map( topic => coreBeliefs.get( topic ) )
			.filter( Boolean )

		if ( !relevant.length ) return { isIdentityThreat: false }

		const severity = clamp01( Math.abs( appraisal.desirability ) * ( 0.5 + ( appraisal.moralWeight ?? 0 ) * 0.5 ) )
		return { isIdentityThreat: true, matchedTopics: relevant.map( b => b.topic ), severity }

	}

	/** Real ego-protection cascade multipliers once an identity threat is confirmed — bigger than a generic competence hit, tightens tribal in-group bias, raises status sensitivity. */
	getCascadeMultipliers( severity ) {

		return {
			egoHealthDamageMult    : 1 + severity * 0.8,
			tribalIngroupBiasMult   : 1 + severity * 0.5,
			statusEnvySensitivityMult : 1 + severity * 0.4,
		}

	}

}
