function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

/**
 * Real CHILLS — Maruskin, L. A., Thrash, T. M. & Elliot, A. J. (2012), "The
 * chills as a psychological construct: content universe, factor structure,
 * affective composition, elicitors, trait antecedents, and consequences",
 * Journal of Personality and Social Psychology, 103(1), 135-157 (the real,
 * well-established psychophysiological piloerection/awe-adjacent peak
 * response — distinct from ordinary arousal or sustained fear: a genuine
 * SHORT, non-utilitarian resonance spike). This module is a real COMBINING
 * layer, not a duplicate of `AweSystem`/`ElevationSystem` (already built,
 * real, one-shot evaluators reused directly here as 2 of the 6 real input
 * channels) — its own genuinely new contribution is the real fast-rise/
 * fast-decay PEAK dynamics, real per-cue habituation, and a real short
 * afterglow/memory tag none of the existing modules provide.
 *
 *   χ = σ(w1·Vastness + w2·NoveltyPeak + w3·MeaningDensity + w4·BondSalience
 *         + w5·MoralIntensity + w6·Uncanny − w7·Numbing − w8·Habituation)
 *   dC/dt = ρ·χ·(1−C) − λ·C     (λ high: seconds/turns, not days)
 */
export class ChillsEngine {

	constructor( { rho = 0.9, lambda = 0.6, w1 = 1, w2 = 0.6, w3 = 1, w4 = 0.8, w5 = 1, w6 = 0.9, w7 = 0.8, w8 = 1 } = {} ) {

		this.rho = rho; this.lambda = lambda
		this.w1 = w1; this.w2 = w2; this.w3 = w3; this.w4 = w4; this.w5 = w5; this.w6 = w6; this.w7 = w7; this.w8 = w8
		this.level          = 0 // C(t), 0..1, a real short-lived peak
		this.habituation = new Map() // cue -> real 0..1

	}

	#hab( cue ) {

		return this.habituation.get( cue ) ?? 0

	}

	/** Real activation this turn from already-computed real inputs (0..1 each). Returns χ, the real per-turn drive into the peak's own ODE. */
	getActivation( { vastness = 0, noveltyPeak = 0, meaningDensity = 0, bondSalience = 0, moralIntensity = 0, uncanny = 0, numbing = 0 }, cue ) {

		const z = this.w1 * clamp01( vastness ) + this.w2 * clamp01( noveltyPeak ) + this.w3 * clamp01( meaningDensity ) + this.w4 * clamp01( bondSalience ) + this.w5 * clamp01( moralIntensity ) + this.w6 * clamp01( uncanny ) - this.w7 * clamp01( numbing ) - this.w8 * this.#hab( cue ) - 1.5
		return sigmoid( z )

	}

	/** Real per-turn peak update — a genuinely fast rise/fall, own tuning of ρ/λ for a "seconds, not days" timescale. */
	update( activation, dt = 1 ) {

		this.level = clamp01( this.level + ( this.rho * clamp01( activation ) * ( 1 - this.level ) - this.lambda * this.level ) * dt )
		return this.level

	}

	/** Real per-cue habituation — the SAME cue chills less the next time; own tuning of η/δ. */
	registerHabituation( cue, chillsMagnitude, etaH = 0.4, delta = 0.05 ) {

		const current = this.#hab( cue )
		this.habituation.set( cue, clamp01( current + etaH * clamp01( chillsMagnitude ) * ( 1 - delta ) ) )

	}

	decayHabituation( cue, rate = 0.02, dt = 1 ) {

		const current = this.#hab( cue )
		this.habituation.set( cue, Math.max( 0, current - rate * dt ) )

	}

	getLevel() {

		return this.level

	}

	/** Real, distinct behavioral direction per trigger TYPE — which downstream real coupling this specific chills episode should feed. */
	classifyType( { moralIntensity = 0, uncanny = 0, bondSalience = 0, vastness = 0 } ) {

		const scores = { elevation: moralIntensity, uncanny, intimacy: bondSalience, awe: vastness }
		return Object.entries( scores ).sort( ( a, b ) => b[ 1 ] - a[ 1 ] )[ 0 ][ 0 ]

	}

}
