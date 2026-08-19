/**
 * Real moral elevation — Haidt, J. (2003), "Elevation and the positive
 * psychology of morality." In Keyes, C. L. M. & Haidt, J. (eds.), Flourishing:
 * Positive Psychology and the Life Well-Lived, American Psychological
 * Association (the actual coinage: a distinct, warm, uplifting emotion
 * triggered specifically by WITNESSING another's moral virtue — kindness,
 * courage, generosity — not by benefiting from it directly, and a real
 * finding that it genuinely motivates the observer's OWN subsequent
 * pro-social behavior). Distinct from gratitude (`GratitudeEngine`, which
 * requires the AI itself to be the beneficiary) — elevation fires from
 * witnessing virtue toward ANYONE, including third parties.
 *
 *   Elevation = σ(WitnessedVirtue)
 */
function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

export class ElevationSystem {

	/** `witnessedVirtue` — real 0..1 magnitude of moral virtue observed this turn (need not involve the AI). */
	evaluate( witnessedVirtue ) {

		const intensity = sigmoid( 4 * ( witnessedVirtue - 0.4 ) )
		return { intensity, moralMotivationBoost: intensity * 0.5 }

	}

}
