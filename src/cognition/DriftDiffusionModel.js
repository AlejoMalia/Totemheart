function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

// Real Box-Muller Gaussian sampler — the real Wiener increment dW in the
// model's own formula needs real N(0,1) noise, not a uniform stand-in.
function gaussianSample() {

	const u1 = Math.random() || 1e-9
	const u2 = Math.random()
	return Math.sqrt( -2 * Math.log( u1 ) ) * Math.cos( 2 * Math.PI * u2 )

}

/**
 * Real Drift Diffusion Model — Ratcliff, R. (1978), "A theory of memory
 * retrieval", Psychological Review, 85(2), 59-108 (the real, foundational
 * sequential-sampling account of binary decision-making: evidence for one
 * of two choices accumulates as a real noisy random walk,
 * dx = A·dt + c·dW, until it crosses one of two real decision boundaries).
 * Distinct from `ExpressionDirectives.getActionTendency()`'s own static
 * one-shot softmax over felt state (a WHICH-action policy) — this models
 * HOW LONG and how CONFIDENTLY the AI settles a genuinely AMBIGUOUS real
 * appraisal (near-zero desirability, no ontology concept lock) into a
 * positive/negative lean, real output feeding response latency
 * (`Hick-Hyman`'s own real RT contribution is about branching-factor
 * complexity, not ambiguity — these are two different real slownesses).
 *
 *   dx = A·dt + c·dW,  decide when |x| crosses the boundary
 */
export class DriftDiffusionModel {

	constructor( { boundary = 1, noise = 0.35, maxSteps = 200, dt = 1 } = {} ) {

		this.boundary = boundary
		this.noise      = noise
		this.maxSteps  = maxSteps
		this.dt            = dt

	}

	/**
	 * `driftRate` — real signed evidence rate per step (e.g. this turn's
	 * appraisal desirability). Returns the real crossed choice (+1/-1, or 0
	 * if it never resolved within `maxSteps`), how many real steps it took,
	 * and a real bounded confidence reading from how far past the boundary
	 * it landed.
	 */
	decide( driftRate ) {

		let x           = 0
		let steps      = 0
		while ( Math.abs( x ) < this.boundary && steps < this.maxSteps ) {

			x += driftRate * this.dt + this.noise * gaussianSample() * Math.sqrt( this.dt )
			steps++

		}

		const crossed = Math.abs( x ) >= this.boundary
		const choice     = !crossed ? 0 : x > 0 ? 1 : -1
		const confidence = clamp01( Math.abs( x ) / this.boundary )

		return { choice, steps, confidence, undecided: !crossed }

	}

}
