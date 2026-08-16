function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Ties energy to a real clock. Peaks at 15:00, troughs at 03:00 — a cosine
 * wave 12h out of phase from the peak, so "3am" genuinely produces the
 * lowest energy reading without any special-casing.
 *
 * Two real couplings on top of the plain diurnal wave:
 *
 * Cortisol flattening the amplitude: sustained high cortisol is associated
 * with a FLATTER diurnal cortisol slope in the chronic-stress literature
 * (Miller, G. E., Chen, E., & Zhou, E. S. (2007), "If it goes up, must it
 * come down? Chronic stress and the hypothalamic-pituitary-adrenal axis in
 * humans", Psychological Bulletin, 133(1), 25-45) — the healthy sharp
 * peak/trough contrast erodes under chronic load. Applied here to the
 * energy wave's amplitude (not cortisol's own level, which CortisolEngine
 * already tracks) as the qualitative direction that literature supports;
 * the specific flattening coefficient is own tuning, not measured from it.
 *
 * Sleep debt: real accumulator, distinct from cortisol — rises only while
 * the system is being actively used (a turn processed) during a
 * low-energy window (the conversational analog of staying up when the
 * circadian signal says rest), and only clears when RemConsolidation
 * actually sweeps (the "sleep" analog) — own engineering, no citation for
 * the specific accumulation shape.
 */
export class CircadianRhythm {

	constructor() {

		this.sleepDebt = 0

	}

	getEnergyLevel( now = new Date(), cortisolLevel = 0 ) {

		const hour     = now.getHours() + now.getMinutes() / 60
		const radians  = ( ( hour - 15 ) / 24 ) * 2 * Math.PI
		const amplitude = 0.5 * ( 1 - clamp01( cortisolLevel ) * 0.5 ) // chronic cortisol flattens the wave, own tuning
		return clamp01( 0.5 - this.sleepDebt * 0.2 + amplitude * Math.cos( radians ) )

	}

	/** Call once per processed turn — accumulates real sleep debt when the system is being used during its own low-energy window. */
	observeActivity( now = new Date(), cortisolLevel = 0 ) {

		const energy = this.getEnergyLevel( now, cortisolLevel )
		if ( energy < 0.3 ) this.sleepDebt = clamp01( this.sleepDebt + 0.03 )

	}

	/** Only a real "sleep" event (a RemConsolidation sweep) pays sleep debt down — a plain tick() does not. */
	payDownSleepDebt( amount = 0.3 ) {

		this.sleepDebt = Math.max( 0, this.sleepDebt - amount )

	}

	getState( now = new Date(), cortisolLevel = 0 ) {

		const energy = this.getEnergyLevel( now, cortisolLevel )
		return {
			energy,
			hour               : now.getHours(),
			lowEnergyWindow    : energy < 0.3,
			responseLengthMult : 0.4 + 0.6 * energy,
			erraticChance      : ( 1 - energy ) * 0.3,
			sleepDebt          : this.sleepDebt,
		}

	}

}
