/**
 * Purely internal — no rendering, no avatar, no audio, no body. This is the
 * triangulated fulfillment of the 4 biometric items (pupil dilation, skin
 * conductance/EDA, heart-rate variability, peripheral flush) that were
 * marked N/A because Totemheart has no sensor to measure them: instead of
 * faking a sensor reading with nothing behind it, each signal here is real
 * math applied to signals Totemheart *does* have (arousal, cortisol,
 * decision fatigue, shame/anger blend weights), and the result feeds back
 * into the AI's own cognition — an interoceptive sense the AI has of
 * itself, the same way a human's felt sense of their racing heart changes
 * their next thought, not something anyone else observes from outside.
 */
function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/** Real discrete Fourier transform magnitude spectrum (direct from the definition, N is small so O(N²) is fine). */
function dftMagnitudes( signal ) {

	const N     = signal.length
	const mags = []
	for ( let k = 0; k < Math.floor( N / 2 ); k++ ) {

		let re = 0
		let im  = 0
		for ( let n = 0; n < N; n++ ) {

			const angle = ( 2 * Math.PI * k * n ) / N
			re += signal[ n ] * Math.cos( angle )
			im -= signal[ n ] * Math.sin( angle )

		}
		mags.push( Math.hypot( re, im ) )

	}
	return mags

}

export class InteroceptiveSignals {

	constructor() {

		this.previousArousal = 0
		this.stressHistory      = [] // for EDA tonic/phasic decomposition
		this.activationHistory    = [] // for HRV-style spectral analysis
		this.flushLevel               = 0

	}

	/**
	 * Pupil-dilation analog ("attentional narrowing"): real derivative of
	 * arousal over time + cognitive load, per the original formula
	 * (proportional to d(arousal)/dt and cognitive load). Used internally to
	 * signal heightened, narrowed attention — feeds AmygdalaHijack as an
	 * extra threshold-lowering multiplier: a fast arousal spike under load
	 * narrows focus onto the threat the way tunnel vision does, independent
	 * of the raw cortisol/sensitization multipliers already in place.
	 */
	observeAttentionalNarrowing( currentArousal, cognitiveLoad, dt = 1 ) {

		const derivative = dt > 0 ? ( currentArousal - this.previousArousal ) / dt : 0
		this.previousArousal = currentArousal
		return clamp01( Math.abs( derivative ) * 2 + cognitiveLoad * 0.4 )

	}

	/**
	 * EDA analog: real tonic (slow moving-average baseline) / phasic (acute
	 * deviation from it) decomposition — the same conceptual split cvxEDA
	 * performs on a real skin-conductance signal, applied here to a real
	 * internal stress-arousal signal instead. `phasic` feeds Sensitization
	 * (an acute spike sensitizes the next reaction); `tonic` cross-checks
	 * CortisolEngine's own chronic-stress read.
	 */
	observeArousalConductance( stressSignal ) {

		this.stressHistory.push( stressSignal )
		if ( this.stressHistory.length > 20 ) this.stressHistory.shift()

		const tonic  = this.stressHistory.reduce( ( a, b ) => a + b, 0 ) / this.stressHistory.length
		const phasic = Math.abs( stressSignal - tonic )

		return { tonic: clamp01( tonic ), phasic: clamp01( phasic ) }

	}

	/**
	 * HRV analog: real DFT over a rolling window of an activation signal,
	 * comparing low-frequency vs. high-frequency power — the same LF/HF
	 * structure real HRV analysis uses, computed on Totemheart's own
	 * arousal/cortisol history instead of R-R intervals. A low ratio
	 * ("regulated") is used internally as *increased capacity for
	 * Reappraisal* — the real finding that higher (parasympathetically-
	 * mediated) HRV correlates with better emotion-regulation capacity is
	 * the direction taken; the specific 1.5 cutoff is engineering, not a
	 * measured clinical threshold.
	 */
	observeRegulatoryCapacity( activationSignal ) {

		this.activationHistory.push( activationSignal )
		if ( this.activationHistory.length > 32 ) this.activationHistory.shift()
		if ( this.activationHistory.length < 8 ) return { lfhfRatio: 1, regulated: true }

		const spectrum = dftMagnitudes( this.activationHistory )
		const lf         = spectrum.slice( 1, 4 ).reduce( ( a, b ) => a + b, 0 )
		const hf         = spectrum.slice( 4, 8 ).reduce( ( a, b ) => a + b, 0 )
		const ratio       = hf > 0 ? lf / hf : lf

		return { lfhfRatio: ratio, regulated: ratio < 1.5 }

	}

	/**
	 * Peripheral-flush analog: a real first-order thermal lag (Newton's law
	 * of cooling / lumped-capacitance model — dT/dt = k(target − T), the
	 * standard simplified form used for thermal systems, not a literal
	 * Navier-Stokes fluid simulation) driven by the shame/anger blend
	 * weight. Used internally to *prolong* a shame or anger episode: the
	 * "heat" lags behind the trigger and decays slowly, the way a real flush
	 * outlasts its cause.
	 */
	observeFlush( driveSignal, dt = 1, k = 0.15 ) {

		this.flushLevel = clamp01( this.flushLevel + k * ( driveSignal - this.flushLevel ) * dt )
		return this.flushLevel

	}

}
