function clamp( v, min, max ) {

	return Math.max( min, Math.min( max, v ) )

}

/**
 * Attachment style bucket from personality, on the two real dimensions the
 * adult-attachment literature converges on — anxiety (fear of abandonment,
 * hypervigilance to small negatives) and avoidance (discomfort with
 * closeness, dampened reactivity in general) — see Bartholomew, K., &
 * Horowitz, L. M. (1991), "Attachment styles among young adults: a test of a
 * four-category model", Journal of Personality and Social Psychology, 61(2),
 * 226-244. Mapping OCEAN traits onto those two dimensions (neuroticism as a
 * proxy for anxiety, low agreeableness/extraversion as a proxy for avoidance)
 * is our own engineering choice, not a validated psychometric equivalence —
 * see CALIBRATION.md.
 */
function classifyStyle( personality ) {

	const anxiety      = personality.get( 'neuroticism' )
	const avoidance = 1 - ( personality.get( 'agreeableness' ) * 0.6 + personality.get( 'extraversion' ) * 0.4 )

	if ( anxiety < 0.5 && avoidance < 0.5 ) return 'secure'
	if ( anxiety >= 0.5 && avoidance < 0.5 ) return 'anxious'
	if ( anxiety < 0.5 && avoidance >= 0.5 ) return 'avoidant'
	return 'fearful'

}

// Per-style multipliers on the base warming/cooling rate and on rupture
// sensitivity — direction taken from the attachment-style literature (secure
// = balanced and resilient; anxious = reacts fast and hard to both directions,
// slow to fully trust again; avoidant = damped reactivity in both directions;
// fearful = anxious's hypervigilance without avoidant's dampening, the
// "wants closeness, fears it too" combination), the specific magnitudes are
// our own tuning, not coefficients from any study.
// ruptureThreshold is on the raw valenceDelta of the TRIGGERING turn (not the
// resulting affinity movement — the affinity RATE constants above already
// vary 3x across styles, so gating on the post-rate-multiplier drop would
// make the same nominal threshold mean wildly different things per style;
// gating directly on how bad the triggering turn itself was is both simpler
// and closer to the real "some interactions are just severe enough to
// rupture a relationship" framing).
const STYLE_PROFILE = {
	secure   : { warmingMult: 1.0, coolingMult: 1.0, ruptureThreshold: -0.7 },
	anxious  : { warmingMult: 1.3, coolingMult: 1.6, ruptureThreshold: -0.45 },
	avoidant : { warmingMult: 0.6, coolingMult: 0.7, ruptureThreshold: -0.85 },
	fearful  : { warmingMult: 1.1, coolingMult: 1.7, ruptureThreshold: -0.4 },
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
			this.relations.set( userId, {
				trust: 0.5, trustAlpha: 1, trustBeta: 1, affinity: 0.5, powerDynamic: 0,
				ruptured: false, ruptureAt: null, repairsCount: 0,
			} )

		}
		return this.relations.get( userId )

	}

	update( userId, { valenceDelta = 0, guiltTriggered = false, dissonanceTriggered = false, betrayalDetected = false }, personality ) {

		const rel           = this.#entry( userId )
		const style           = classifyStyle( personality )
		const profile           = STYLE_PROFILE[ style ]
		const agreeableness  = personality.get( 'agreeableness' )
		const baseRate        = 0.05 * ( 1 + personality.get( 'neuroticism' ) * 0.5 )

		// Asymmetric forgiveness: more agreeable minds warm back up faster and
		// cool off slower (forgiving); less agreeable minds do the opposite
		// (grudge-holding) — same valenceDelta, different affinity response.
		// The *direction* of this effect (agreeableness correlating with
		// forgiveness) has reasonable support in Big Five personality
		// research; the specific rate constants below are our own tuning,
		// not coefficients from any study. See CALIBRATION.md. The attachment
		// style multiplier layers on top: an anxious/fearful style swings
		// harder in both directions, avoidant swings less in either.
		const warmingRate = baseRate * ( 0.6 + agreeableness * 0.8 ) * profile.warmingMult
		const coolingRate = baseRate * ( 1.6 - agreeableness * 0.8 ) * profile.coolingMult
		const affinityRate = valenceDelta >= 0 ? warmingRate : coolingRate

		rel.affinity = clamp( rel.affinity + valenceDelta * affinityRate, 0, 1 )

		// Rupture detection: THIS turn's own severity crossing this style's real
		// sensitivity threshold — an anxious/fearful style flags a rupture from a
		// much milder bad turn than a secure or avoidant one does (Gottman, J. M.,
		// & Levenson, R. W. (1992) and the broader rupture-and-repair literature
		// in attachment/relational research motivate the concept; the specific
		// threshold values are our own engineering, not measured from that
		// literature). Repair: the FIRST clearly-positive turn after a rupture
		// heals it and counts toward this relationship's repair history —
		// real evidence a relationship survived a rupture, not just time passing.
		if ( !rel.ruptured && valenceDelta <= profile.ruptureThreshold ) {

			rel.ruptured  = true
			rel.ruptureAt = Date.now()

		}
		else if ( rel.ruptured && valenceDelta > 0.3 ) {

			rel.ruptured      = false
			rel.repairsCount += 1

		}

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
		else if ( valenceDelta > 0.2 ) rel.trustAlpha += rel.ruptured ? 0.5 : 1 // trust rebuilds slower than affinity while a rupture is still open
		rel.trust = rel.trustAlpha / ( rel.trustAlpha + rel.trustBeta )

		rel.powerDynamic = clamp( rel.powerDynamic + ( guiltTriggered ? -baseRate : 0 ), -1, 1 )
		rel.style           = style

		return rel

	}

	/** The attachment style this user's relationship would be classified as, given the AI's own personality — a stable trait, not per-user state. */
	getStyle( personality ) {

		return classifyStyle( personality )

	}

	get( userId ) {

		return this.#entry( userId )

	}

}
