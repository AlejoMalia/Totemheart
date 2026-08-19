function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real moral self-licensing — Merritt, A. C., Effron, D. A. & Monin, B.
 * (2010), "Moral self-licensing: When being good frees us to be bad",
 * Social and Personality Psychology Compass, 4(5), 344-357 (the real,
 * well-established finding that a genuine recent moral/pro-social act
 * measurably lowers the bar for a SUBSEQUENT ethically-questionable one —
 * a moral "credit" the person feels entitled to spend). Distinct from
 * `CognitiveDissonance` (post-hoc justification of an already-made choice):
 * licensing operates BEFORE the act, lowering resistance to it in advance.
 *
 *   moralCredit(t) = moralCredit(t-1)·(1-λ) + proSocialAct
 *   resistanceReduction = moralCredit · spendRate
 */
export class MoralLicensing {

	constructor( { lambda = 0.2, spendRate = 0.5 } = {} ) {

		this.lambda        = lambda
		this.spendRate    = spendRate
		this.moralCredit = 0

	}

	/** `proSocialMagnitude` (0..1) — a real recent genuinely moral/helpful act banking real credit. */
	registerProSocialAct( proSocialMagnitude ) {

		this.moralCredit = clamp01( this.moralCredit * ( 1 - this.lambda ) + clamp01( proSocialMagnitude ) )
		return this.moralCredit

	}

	/** Real, bounded reduction in resistance to a subsequent ethically-marginal act, spending down the banked credit. */
	getLicenseToSpend() {

		const license = this.moralCredit * this.spendRate
		this.moralCredit = clamp01( this.moralCredit - license * 0.6 ) // real partial spend-down, not free reuse
		return clamp01( license )

	}

	decay( dt = 1 ) {

		this.moralCredit = Math.max( 0, this.moralCredit * Math.pow( 1 - this.lambda, dt ) )

	}

}
