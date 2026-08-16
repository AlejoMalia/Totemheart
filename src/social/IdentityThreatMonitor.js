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

	/**
	 * Repair layer: a threat isn't just detected, it costs something real to
	 * address, and that cost is personality-modulated. `egoHealth` dampens the
	 * effective threat (a healthy ego shrugs off more before it registers as a
	 * real threat needing repair) — own design, the general "buffered self"
	 * idea is consistent with self-affirmation theory's own claims (Steele
	 * 1988, already cited above), the specific β coefficient is own tuning.
	 */
	computeThreat( threatSignal, egoHealth, beta = 0.5 ) {

		return Math.max( 0, threatSignal - egoHealth * beta )

	}

	/** Conscientiousness lowers real repair cost — a disciplined mind spends less on damage control per unit of threat. Own tuning of the 1.2 base. */
	computeRepairCost( threat, conscientiousness = 0.5 ) {

		return threat * ( 1.2 - clamp01( conscientiousness ) )

	}

	/** Applies a real repair cycle to egoHealth — a net debit (repair cost) offset by whatever real recovery (e.g. ReputationEngine.regenerate's own rate) the caller supplies this tick. */
	applyRepair( egoHealth, repairCost, recovery = 0 ) {

		return clamp01( egoHealth - repairCost + recovery )

	}

}
