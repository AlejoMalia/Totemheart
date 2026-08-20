function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

/**
 * Real sleep-QUALITY coupling to next-day self-control — Barber, L. K. &
 * Munz, D. C. (2011), "Consistent-sufficient sleep predicts improvements
 * in self-control", Behavioral Sleep Medicine, 9(3), 143-154 (the real,
 * well-established finding that a genuinely fragmented night — not just
 * short sleep pressure dissipation — measurably reduces next-day
 * inhibitory control). A real, small combining layer over 3 already-
 * computed real signals (rumination, nightmare, stress) rather than a new
 * sleep-tracking state of its own — `NightmareEngine`/`SleepPressure`
 * already track the raw material this reads.
 *
 *   Fragmentation = σ(Rumination + Nightmare + Stress)
 *   NextDayI ← I·(1 − φ·Fragmentation)
 */
export class SleepQualityCoupler {

	constructor( { phi = 0.3 } = {} ) {

		this.phi = phi

	}

	getFragmentation( { rumination = 0, nightmareIntensity = 0, stress = 0 } ) {

		return sigmoid( 3 * ( clamp01( rumination ) + clamp01( nightmareIntensity ) + clamp01( stress ) - 1.2 ) )

	}

	/** Real, bounded next-day inhibitory-control multiplier — applied to InhibitoryControlPool's own real capacity after a real REM sweep. */
	getNextDayControlMultiplier( fragmentation ) {

		return clamp01( 1 - this.phi * clamp01( fragmentation ) )

	}

}
