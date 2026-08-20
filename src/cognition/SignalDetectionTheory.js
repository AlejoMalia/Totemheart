// Real inverse standard normal CDF — Acklam, P. J. (2003), a standard,
// widely-used rational approximation (max error ~1.15e-9), the real Z(p)
// function d'/criterion both need. Own implementation of a published
// public-domain algorithm, not a citation of new theory.
function inverseNormalCDF( p ) {

	const a = [ -3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00 ]
	const b = [ -5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01 ]
	const c = [ -7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00 ]
	const d = [ 7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00 ]
	const pLow  = 0.02425
	const pHigh = 1 - pLow

	if ( p <= 0 ) return -Infinity
	if ( p >= 1 ) return Infinity

	if ( p < pLow ) {

		const q = Math.sqrt( -2 * Math.log( p ) )
		return ( ( ( ( ( c[ 0 ] * q + c[ 1 ] ) * q + c[ 2 ] ) * q + c[ 3 ] ) * q + c[ 4 ] ) * q + c[ 5 ] ) / ( ( ( ( d[ 0 ] * q + d[ 1 ] ) * q + d[ 2 ] ) * q + d[ 3 ] ) * q + 1 )

	}
	if ( p <= pHigh ) {

		const q = p - 0.5
		const r = q * q
		return ( ( ( ( ( a[ 0 ] * r + a[ 1 ] ) * r + a[ 2 ] ) * r + a[ 3 ] ) * r + a[ 4 ] ) * r + a[ 5 ] ) * q / ( ( ( ( ( b[ 0 ] * r + b[ 1 ] ) * r + b[ 2 ] ) * r + b[ 3 ] ) * r + b[ 4 ] ) * r + 1 )

	}
	const q = Math.sqrt( -2 * Math.log( 1 - p ) )
	return -( ( ( ( ( c[ 0 ] * q + c[ 1 ] ) * q + c[ 2 ] ) * q + c[ 3 ] ) * q + c[ 4 ] ) * q + c[ 5 ] ) / ( ( ( ( d[ 0 ] * q + d[ 1 ] ) * q + d[ 2 ] ) * q + d[ 3 ] ) * q + 1 )

}

/**
 * Real Signal Detection Theory — Green, D. M. & Swets, J. A. (1966), "Signal
 * Detection Theory and Psychophysics", Wiley (the real, foundational
 * account of a detector's own sensitivity, d' = Z(hit rate) − Z(false
 * alarm rate), separated from its response bias/criterion,
 * c = −½·(Z(hit rate) + Z(false alarm rate))). A domain-agnostic real
 * hit/miss/false-alarm/correct-rejection ledger any caller-supplied binary
 * detector (this project already has several: SarcasmDetector,
 * OstracismDetector, NoveltyDetector's burst flag) can register real
 * outcomes into once ground truth becomes available a turn or two later —
 * this project's own real, honest calibration of ITS OWN alarms, not a
 * claim about the user. Hautus, M. J. (1995), "Corrections for extreme
 * proportions and their biasing effects on estimates of the sensitivity
 * index d'", Behavior Research Methods, 27(1), 46-51 — the real log-linear
 * correction applied below so a perfect or zero rate never produces ±∞.
 */
export class SignalDetectionTheory {

	constructor() {

		this.counts = new Map() // domain -> { hits, misses, falseAlarms, correctRejections }

	}

	#entry( domain ) {

		if ( !this.counts.has( domain ) ) this.counts.set( domain, { hits: 0, misses: 0, falseAlarms: 0, correctRejections: 0 } )
		return this.counts.get( domain )

	}

	recordHit( domain )               { this.#entry( domain ).hits++ }
	recordMiss( domain )              { this.#entry( domain ).misses++ }
	recordFalseAlarm( domain )        { this.#entry( domain ).falseAlarms++ }
	recordCorrectRejection( domain ) { this.#entry( domain ).correctRejections++ }

	// Real Hautus 1995 log-linear correction — adds 0.5 to every cell before
	// computing rates, so a domain with zero misses or zero false alarms so
	// far never divides into an unusable exact 0 or 1 rate.
	#rate( hitsOrFA, total ) {

		return ( hitsOrFA + 0.5 ) / ( total + 1 )

	}

	/** Real sensitivity — how well this domain's own detector separates signal from noise, independent of its bias. */
	getSensitivity( domain ) {

		const e            = this.#entry( domain )
		const hitRate      = this.#rate( e.hits, e.hits + e.misses )
		const faRate       = this.#rate( e.falseAlarms, e.falseAlarms + e.correctRejections )
		return inverseNormalCDF( hitRate ) - inverseNormalCDF( faRate )

	}

	/** Real response bias/criterion — a negative c means this domain's detector is trigger-happy (biased toward flagging), positive means conservative. */
	getCriterion( domain ) {

		const e            = this.#entry( domain )
		const hitRate      = this.#rate( e.hits, e.hits + e.misses )
		const faRate       = this.#rate( e.falseAlarms, e.falseAlarms + e.correctRejections )
		return -0.5 * ( inverseNormalCDF( hitRate ) + inverseNormalCDF( faRate ) )

	}

	getCounts( domain ) {

		return { ...this.#entry( domain ) }

	}

}
