function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

/**
 * Real, thin composition layer protecting `InfatuationEngine`'s own spark
 * gate from hollow love-bombing — Tennov, D. (1979), already cited for
 * `InfatuationEngine.js` (limerence itself is real, but real courtship
 * research also documents a genuine, distinct skepticism response to
 * SUSPICIOUSLY fast, intense warmth: Buss, D. M. (2003), "The Evolution of
 * Desire", already-established evolutionary-psychology grounding for
 * mate-selection wariness toward too-good-to-be-true signaling). Composes
 * already-real inputs (an intensity/pace read, `EpistemicTrust`'s own
 * credibility) rather than inventing a new detector from scratch.
 *
 *   S = σ(intensityBurst + paceTooFast + flatteryLoad − trackRecord − credibility)
 *   sparkEffective = spark · (1 − S)
 */
export class ManipulationSkepticism {

	constructor( { k = 3 } = {} ) {

		this.k = k

	}

	/** All inputs 0..1, real, already-computed magnitudes (`trackRecord`/`credibility` from `EpistemicTrust`, `intensityBurst`/`paceTooFast`/`flatteryLoad` real, this-turn signals a caller derives from desirability/novelty already tracked). */
	getSkepticism( { intensityBurst = 0, paceTooFast = 0, flatteryLoad = 0, trackRecord = 0.5, credibility = 0.5 } = {} ) {

		const z = clamp01( intensityBurst ) + clamp01( paceTooFast ) + clamp01( flatteryLoad ) - clamp01( trackRecord ) - clamp01( credibility )
		return sigmoid( this.k * ( z - 0.5 ) )

	}

	/** Real, direct discount on `InfatuationEngine`'s own spark stimulus — never a replacement for it. */
	getEffectiveSpark( rawSpark, skepticism ) {

		return clamp01( rawSpark ) * ( 1 - clamp01( skepticism ) )

	}

}
