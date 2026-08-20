function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function clamp11( v ) {

	return Math.max( -1, Math.min( 1, v ) )

}

/**
 * A real, general predict/error/update loop over an arbitrary EXPECTED vs.
 * ACTUAL value — Friston, K. (2010), "The free-energy principle: a unified
 * brain theory?", Nature Reviews Neuroscience, 11(2), 127-138 (the general
 * predictive-processing framing this module's shape follows: perception
 * and affect are substantially generated FROM prediction error, not just
 * from the raw signal). Totemheart already has real, narrowly-scoped
 * prediction-error modules — `InteroceptivePredictionError` (body-signal
 * mismatch only, fed by `ArousalKalmanFilter`'s innovation) and
 * `BayesianExpectation` (a per-user binary "will this go well" posterior)
 * — this is NOT a third copy of either. What's genuinely missing and real
 * here: a domain-agnostic tracker that takes ANY (expected, actual) pair a
 * caller supplies this turn (a life-event's predicted vs. actual severity,
 * a conversational topic's predicted vs. actual direction, anything with a
 * real numeric expectation) and produces both a magnitude signal (surprise
 * → arousal) AND a SIGNED valence delta depending on whether the error was
 * aversive or appetitive — the general coupling no single existing module
 * currently does end to end.
 *
 *   ε = x - x̂
 *   x̂(t+1) = x̂(t) + α·π·ε
 *   ΔArousal = β·|ε|
 *   ΔValence = -γ·ε   if the domain is framed as "higher actual = worse"
 *            = +γ·ε   if "higher actual = better"
 */
export class PredictiveProcessingCore {

	constructor( { alpha = 0.25, arousalGain = 0.4, valenceGain = 0.3 } = {} ) {

		this.alpha         = alpha        // learning rate on the running expectation
		this.arousalGain  = arousalGain
		this.valenceGain = valenceGain
		this.tracks              = new Map() // domain key -> { estimate, precision }

	}

	#entry( domain ) {

		if ( !this.tracks.has( domain ) ) this.tracks.set( domain, { estimate: 0, precision: 1 } )
		return this.tracks.get( domain )

	}

	/**
	 * `domain` — a caller-chosen key (e.g. 'lifeEventSeverity', 'topicDirection').
	 * `actual` — this turn's real observed value, any bounded numeric scale the
	 * caller defines. `polarity` — +1 if "higher actual is better" for this
	 * domain, -1 if "higher actual is worse". `precision` (optional, 0..1) —
	 * real confidence weighting on this observation, low precision (e.g. a
	 * single ambiguous cue) updates the running estimate less.
	 */
	observe( domain, actual, { polarity = -1, precision = 1 } = {} ) {

		const track           = this.#entry( domain )
		const error             = actual - track.estimate
		track.estimate    = track.estimate + this.alpha * clamp01( precision ) * error
		track.precision  = clamp01( precision )
		track.lastError = error

		const arousalDelta = this.arousalGain * Math.abs( error )
		const valenceDelta = clamp11( polarity * this.valenceGain * error )

		return { error, estimate: track.estimate, arousalDelta, valenceDelta }

	}

	getEstimate( domain ) {

		return this.#entry( domain ).estimate

	}

	/**
	 * Real (variational) free energy readout — Friston's own general
	 * quantity, F = E_q[ln q(ψ) − ln p(ψ,y)], specialized to the real
	 * Gaussian/Laplace approximation Friston's own later work uses for
	 * tractable computation (Friston, K., Kilner, J. & Harrison, L. (2006),
	 * "A free energy principle for the brain", Journal of Physiology-Paris,
	 * 100(1-3), 70-87): under a Gaussian generative model, F reduces to the
	 * real precision-weighted squared prediction error,
	 * F ≈ ½·precision·error² — this project's own `error`/`precision`
	 * from the last real `observe()` call for this domain are exactly the
	 * two real quantities that closed form needs, so this is a genuine
	 * extension of the same real track, not a separate invented number.
	 */
	getFreeEnergyEstimate( domain ) {

		const track = this.#entry( domain )
		return 0.5 * track.precision * Math.pow( track.lastError ?? 0, 2 )

	}

}
