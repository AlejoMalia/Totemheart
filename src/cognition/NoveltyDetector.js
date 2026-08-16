/**
 * Novelty via Kullback-Leibler divergence: D_KL(P||Q) = Σ P(x) log(P(x)/Q(x)).
 * Real formula, applied at the scale this library actually has data for: P is
 * the running historical distribution over dominant-emotion outcomes for
 * this kind of interaction; Q is what that distribution would look like if
 * "this turn's outcome is the norm" (a Laplace-smoothed one-hot on the
 * current label). High divergence = this turn breaks the historical pattern,
 * independent of whether the break is pleasant or unpleasant (that
 * distinction is DopaminergicEngine's job, not this module's).
 */
function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

export class NoveltyDetector {

	constructor( { smoothing = 0.1 } = {} ) {

		this.histogram = new Map() // emotion label -> count
		this.smoothing  = smoothing

	}

	/** Returns a 0..1 novelty score, then records this observation into the history. */
	observe( emotionLabel ) {

		const total = [ ...this.histogram.values() ].reduce( ( a, b ) => a + b, 0 )
		let divergence = 0

		if ( total > 0 ) {

			const labels = new Set( [ ...this.histogram.keys(), emotionLabel ] )
			const k        = labels.size
			for ( const label of labels ) {

				const p = ( this.histogram.get( label ) ?? 0 ) / total
				if ( p === 0 ) continue // 0 * log(anything) = 0, skip to avoid NaN

				// Q: Laplace-smoothed one-hot on the observed label — "this turn is normal".
				const q = label === emotionLabel
					? ( 1 - this.smoothing ) + this.smoothing / k
					: this.smoothing / k

				divergence += p * Math.log( p / q )

			}

		}

		this.histogram.set( emotionLabel, ( this.histogram.get( emotionLabel ) ?? 0 ) + 1 )

		// KL divergence is unbounded above; squash to 0..1 for use as a spike multiplier.
		return clamp01( divergence / ( divergence + 1.5 ) )

	}

}
