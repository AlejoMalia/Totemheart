function mean( xs ) {

	return xs.reduce( ( a, b ) => a + b, 0 ) / xs.length

}

function variance( xs, m ) {

	return xs.reduce( ( sum, x ) => sum + ( x - m ) ** 2, 0 ) / xs.length

}

/**
 * Real mean/variance anomaly detector: a rolling window of a user's inferred
 * valence that stays extremely high (μ > 0.85) with almost no variance
 * (σ² ≈ 0) — static, unshakeable positivity even through bad news — reads
 * as suspicious rather than genuine, mirroring the real social-psychology
 * observation that flat, unvarying positivity gets read as artificial. Own
 * design, no citation: this is a plain mean/(variance+ε) ratio, not a
 * reproduction of any named uncanny-valley model (that literature is about
 * visual appearance, not affect — this is inspired by the same *shape* of
 * effect, not a claim of continuity with it).
 */
export class UncannyValleyDetector {

	constructor( { windowSize = 6, meanThreshold = 0.85, epsilon = 0.02 } = {} ) {

		this.windowSize        = windowSize
		this.meanThreshold  = meanThreshold
		this.epsilon             = epsilon
		this.history                = new Map() // userId -> [valence,...]

	}

	observe( userId, valence ) {

		const window = this.history.get( userId ) ?? []
		window.push( valence )
		if ( window.length > this.windowSize ) window.shift()
		this.history.set( userId, window )

	}

	/** Returns { suspicious, distrustLevel, mean, variance } — only meaningful once the window has enough samples. */
	evaluate( userId ) {

		const window = this.history.get( userId ) ?? []
		if ( window.length < 3 ) return { suspicious: false, distrustLevel: 0, mean: 0, variance: 0, n: window.length }

		const m   = mean( window )
		const v      = variance( window, m )
		const distrustLevel = m / ( v + this.epsilon )
		const suspicious       = m > this.meanThreshold && v < 0.02

		return { suspicious, distrustLevel, mean: m, variance: v, n: window.length }

	}

}
