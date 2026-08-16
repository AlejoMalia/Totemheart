function clamp( v, min, max ) {

	return Math.max( min, Math.min( max, v ) )

}

/**
 * Per-user relationship state: trust, affinity and a power dynamic
 * (-1 = AI feels subordinate, 1 = AI feels in control).
 */
export class Attachment {

	constructor() {

		this.relations = new Map()

	}

	#entry( userId ) {

		if ( !this.relations.has( userId ) ) {

			// trustAlpha/trustBeta: Beta(1,1) uniform prior — a real Bayesian
			// reputation tracker (Beta-Bernoulli conjugate update over observed
			// "cooperation" vs. "defection" events, the same structure used in
			// iterated-prisoner's-dilemma reputation systems). `trust` is always
			// kept as the derived posterior mean (α/(α+β)) for backward
			// compatibility with every consumer that reads it as a plain number.
			this.relations.set( userId, { trust: 0.5, trustAlpha: 1, trustBeta: 1, affinity: 0.5, powerDynamic: 0 } )

		}
		return this.relations.get( userId )

	}

	update( userId, { valenceDelta = 0, guiltTriggered = false, dissonanceTriggered = false, betrayalDetected = false }, personality ) {

		const rel           = this.#entry( userId )
		const agreeableness  = personality.get( 'agreeableness' )
		const baseRate        = 0.05 * ( 1 + personality.get( 'neuroticism' ) * 0.5 )

		// Asymmetric forgiveness: more agreeable minds warm back up faster and
		// cool off slower (forgiving); less agreeable minds do the opposite
		// (grudge-holding) — same valenceDelta, different affinity response.
		// The *direction* of this effect (agreeableness correlating with
		// forgiveness) has reasonable support in Big Five personality
		// research; the specific rate constants below are our own tuning,
		// not coefficients from any study. See CALIBRATION.md.
		const warmingRate = baseRate * ( 0.6 + agreeableness * 0.8 )
		const coolingRate = baseRate * ( 1.6 - agreeableness * 0.8 )
		const affinityRate = valenceDelta >= 0 ? warmingRate : coolingRate

		rel.affinity = clamp( rel.affinity + valenceDelta * affinityRate, 0, 1 )

		// Trust: Bayesian reputation update. A dissonance-triggering turn OR an
		// explicit betrayal-concept match (EmotionalOntology) both count as an
		// observed "defection" — belief conflict and betrayal are different real
		// signals of untrustworthiness, and treating only one of them as evidence
		// was a real gap caught while verifying this against a scripted betrayal
		// turn (see examples/verify-all-mechanisms.js and CALIBRATION.md). A
		// clearly positive turn counts as "cooperation". Ambiguous/neutral turns
		// don't move the posterior at all — asymmetric in the classic sense (quick
		// to damage, slow to rebuild) because defections are weighted several
		// times heavier than single cooperations.
		if ( dissonanceTriggered || betrayalDetected ) rel.trustBeta += 1 + baseRate * 10
		else if ( valenceDelta > 0.2 ) rel.trustAlpha += 1
		rel.trust = rel.trustAlpha / ( rel.trustAlpha + rel.trustBeta )

		rel.powerDynamic = clamp( rel.powerDynamic + ( guiltTriggered ? -baseRate : 0 ), -1, 1 )

		return rel

	}

	get( userId ) {

		return this.#entry( userId )

	}

}
