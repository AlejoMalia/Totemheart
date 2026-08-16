/**
 * Ties energy to a real clock. Peaks at 15:00, troughs at 03:00 — a cosine
 * wave 12h out of phase from the peak, so "3am" genuinely produces the
 * lowest energy reading without any special-casing.
 */
export class CircadianRhythm {

	getEnergyLevel( now = new Date() ) {

		const hour     = now.getHours() + now.getMinutes() / 60
		const radians  = ( ( hour - 15 ) / 24 ) * 2 * Math.PI
		return 0.5 + 0.5 * Math.cos( radians )

	}

	getState( now = new Date() ) {

		const energy = this.getEnergyLevel( now )
		return {
			energy,
			hour               : now.getHours(),
			lowEnergyWindow    : energy < 0.3,
			responseLengthMult : 0.4 + 0.6 * energy,
			erraticChance      : ( 1 - energy ) * 0.3,
		}

	}

}
