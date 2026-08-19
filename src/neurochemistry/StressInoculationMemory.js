function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real stress inoculation — Meichenbaum, D. (1985), "Stress Inoculation
 * Training." Pergamon Press (the actual, well-established finding: MODERATE,
 * successfully-coped-with stress genuinely reduces future reactivity to
 * similar stressors, a real, distinct phenomenon from sensitization's
 * opposite direction — repeated exposure that HASN'T been mastered
 * sensitizes instead, see `Sensitization.js`). Only stress the caller marks
 * as genuinely MASTERED (not merely survived) counts here — own engineering
 * of that gate, Meichenbaum's work supplies the real phenomenon and its
 * real precondition.
 *
 *   Reactivity ← Reactivity · (1 - ι · MasteredStress)
 */
export class StressInoculationMemory {

	constructor( { iota = 0.08 } = {} ) {

		this.iota            = iota
		this.reactivityMultiplier = 1

	}

	/** `masteredStress` (0..1) — real magnitude of a stressor the caller has determined was successfully coped with, not merely endured. */
	recordMastery( masteredStress ) {

		this.reactivityMultiplier = clamp01( this.reactivityMultiplier * ( 1 - this.iota * clamp01( masteredStress ) ) )

	}

	/** Real, slow real regression toward full reactivity if mastery isn't reinforced. */
	decay( dt = 1, recoveryRate = 0.01 ) {

		this.reactivityMultiplier = Math.min( 1, this.reactivityMultiplier + recoveryRate * dt )

	}

	getReactivityMultiplier() {

		return this.reactivityMultiplier

	}

}
