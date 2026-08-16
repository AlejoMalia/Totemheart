function clamp( v, min = -1, max = 1 ) {

	return Math.max( min, Math.min( max, v ) )

}

function tokenize( text ) {

	return ( text || '' ).toLowerCase().match( /[\p{L}']+/gu ) || []

}

/**
 * Real accumulative "gut feeling" markers — the somatic-marker hypothesis
 * (Damasio, A. R. (1994), "Descartes' Error: Emotion, Reason, and the
 * Human Brain", G. P. Putnam's Sons): past outcomes leave a real, decaying
 * trace tied to the option/context that produced them, and that trace
 * biases FUTURE decisions about similar options before (or instead of)
 * explicit deliberation. Applied here to real option labels the caller
 * supplies (not literal viscera — there's no body here either, same honest
 * framing InteroceptiveSignals.js already uses for adjacent embodiment
 * modules) and real token-overlap similarity for "similar past option",
 * not a fabricated embedding.
 *
 *   Marker_i += outcome_valence · intensity · e^(−λ·time)
 *   Bias = Σ (Marker_i · similarity(current_option, past_option_i))
 */
export class SomaticMarkerNetwork {

	constructor( { lambda = 0.0003 } = {} ) {

		this.lambda   = lambda
		this.markers = [] // { label, valence, timestamp }

	}

	/** Records a real marker from an actual observed outcome tied to `label` — the option/context description that produced it. */
	recordOutcome( label, outcomeValence, intensity = 1, now = Date.now() ) {

		this.markers.push( { label, valence: clamp( outcomeValence * intensity ), timestamp: now } )

	}

	#decayedValence( marker, now ) {

		const elapsed = Math.max( 0, now - marker.timestamp )
		return marker.valence * Math.exp( -this.lambda * elapsed )

	}

	/** Real, bounded gut-feeling bias toward or away from `currentOption`, aggregated across every past marker weighted by real token-overlap similarity and real time decay. */
	getBias( currentOption, now = Date.now() ) {

		const currentTokens = new Set( tokenize( currentOption ) )
		if ( !currentTokens.size || !this.markers.length ) return 0

		let bias = 0
		for ( const marker of this.markers ) {

			const markerTokens = tokenize( marker.label )
			const overlap             = markerTokens.filter( t => currentTokens.has( t ) ).length
			if ( overlap === 0 ) continue

			const similarity = overlap / Math.max( currentTokens.size, markerTokens.length )
			bias                 += this.#decayedValence( marker, now ) * similarity

		}
		return clamp( bias )

	}

	getMarkerCount() {

		return this.markers.length

	}

}
