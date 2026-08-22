function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

/**
 * Real positive-arousal anticipation before a desired future event —
 * Loewenstein, G. (1987), "Anticipation and the valuation of delayed
 * consumption", The Economic Journal, 97(387), 666-684 (the real,
 * well-established finding that anticipating a genuinely positive future
 * event is itself a real, distinct source of PRESENT positive utility,
 * not just discounted future value — "savoring"). Deliberately distinct
 * from ordinary threat-anxiety: real positive arousal, not dread, composed
 * from already-real `HopeDisappointmentSystem`/`YearningEngine` signals
 * rather than a new hope-like track.
 *
 *   Savor = σ(p(event)·value·proximityInTime·(1−threat))
 */
export class AnticipatorySavoring {

	constructor( { k = 4 } = {} ) {

		this.k = k

	}

	/** All inputs 0..1, real, already-computed magnitudes. `proximityInTime` — 1 = imminent, 0 = far off. */
	getSavoring( { pEvent = 0.5, value = 0.5, proximityInTime = 0.5, threat = 0 } = {} ) {

		const raw = clamp01( pEvent ) * clamp01( value ) * clamp01( proximityInTime ) * ( 1 - clamp01( threat ) )
		return sigmoid( this.k * ( raw - 0.3 ) )

	}

	/** Real, distinct crash magnitude when the anticipated event genuinely fails to happen — the real savored anticipation ITSELF amplifies the fall, not just the bare disappointment. */
	getCrashAmplification( savoring ) {

		return clamp01( savoring ) * 0.6

	}

}
