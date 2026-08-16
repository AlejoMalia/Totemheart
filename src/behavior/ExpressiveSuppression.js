function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

/**
 * Real LSTM-style gating (forget gate + output gate, both sigmoids) applied
 * ONCE to produce an *expressed* vector distinct from the *internal* one —
 * this is the actual psychological point of expressive suppression: the felt
 * state doesn't change, only what gets shown does. `Totemheart.emotionSpace`
 * is never touched by this; callers use the suppressed vector only for text
 * generation / linguistic modulation. `suppressionDrive` (0..1) is supplied
 * by the caller — this module has no opinion on when suppression should
 * kick in, only how to apply it once told to. Real gating math; the mapping
 * from "drive" to gate values is our own logistic curve, not a citation.
 */
export class ExpressiveSuppression {

	computeGates( suppressionDrive ) {

		const x = -4 * suppressionDrive + 2 // drive 0 -> gate≈0.88 (mostly open); drive 1 -> gate≈0.12 (mostly closed)
		return { forgetGate: sigmoid( x ), outputGate: sigmoid( x ) }

	}

	/** Returns the expressed (gated) vector — the internal vector passed in is read-only here. */
	suppress( vector, suppressionDrive ) {

		if ( suppressionDrive <= 0 ) return { ...vector }

		const { forgetGate, outputGate } = this.computeGates( suppressionDrive )
		const cellState = {
			valence : forgetGate * vector.valence,
			arousal : forgetGate * vector.arousal,
		}

		return {
			valence : outputGate * Math.tanh( cellState.valence ),
			arousal : outputGate * Math.tanh( cellState.arousal ),
		}

	}

}
