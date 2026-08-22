function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

/**
 * Real trust in CONTENT (do I believe what was said), deliberately
 * distinct from `Attachment.trust` (interpersonal, "will they care for
 * me") — Hovland, C. I. & Weiss, W. (1951), "The influence of source
 * credibility on communication effectiveness", Public Opinion Quarterly,
 * 15(4), 635-650 (the real, foundational source-credibility finding:
 * believing a CLAIM is a function of the source's real track record and
 * expertise cues, genuinely separate from how warm the relationship
 * feels — "te aprecio, pero eso no me lo creo" is a real, coherent state
 * this codebase's own single `Attachment.trust` scalar cannot represent).
 *
 *   E_j = σ(w1·track + w2·coherence + w3·expertise − w4·manipulation − w5·overclaim − w6·priorError)
 *   P(accept) = σ(argumentStrength + E_j − motivatedBias)
 */
export class EpistemicTrust {

	constructor( { w1 = 1.2, w2 = 0.8, w3 = 0.6, w4 = 1.5, w5 = 1.0, w6 = 1.3 } = {} ) {

		Object.assign( this, { w1, w2, w3, w4, w5, w6 } )
		this.track      = new Map() // userId -> real EMA of past-claim accuracy, 0.5 prior
		this.priorError = new Map() // userId -> real, decaying record of past false/misleading claims

	}

	/** Real track-record update — call once a real claim's outcome is known. `accurate` (bool). */
	registerOutcome( userId, accurate, weight = 0.2 ) {

		const current = this.track.get( userId ) ?? 0.5
		this.track.set( userId, clamp01( current + weight * ( ( accurate ? 1 : 0 ) - current ) ) )
		if ( !accurate ) this.priorError.set( userId, clamp01( ( this.priorError.get( userId ) ?? 0 ) + 0.3 ) )

	}

	decayPriorError( userId, dt = 1, rate = 0.02 ) {

		const current = this.priorError.get( userId )
		if ( current !== undefined ) this.priorError.set( userId, Math.max( 0, current - rate * dt ) )

	}

	/** `coherence`/`expertiseCue`/`manipulationCue`/`overclaim` all 0..1, real this-turn reads. */
	getCredibility( userId, { coherence = 0.5, expertiseCue = 0, manipulationCue = 0, overclaim = 0 } = {} ) {

		const track       = this.track.get( userId ) ?? 0.5
		const priorError = this.priorError.get( userId ) ?? 0
		const z = this.w1 * track + this.w2 * clamp01( coherence ) + this.w3 * clamp01( expertiseCue ) - this.w4 * clamp01( manipulationCue ) - this.w5 * clamp01( overclaim ) - this.w6 * priorError
		return sigmoid( z - 1 )

	}

	/** `argumentStrength` (0..1), `motivatedBias` (0..1, real pull to believe/disbelieve for non-epistemic reasons, e.g. wanting it to be true). */
	getAcceptProbability( credibility, argumentStrength, motivatedBias = 0 ) {

		return sigmoid( 3 * ( clamp01( argumentStrength ) + clamp01( credibility ) - clamp01( motivatedBias ) - 0.5 ) )

	}

	toJSON() {

		return { track: [ ...this.track.entries() ], priorError: [ ...this.priorError.entries() ] }

	}

	restoreState( data ) {

		if ( !data ) return
		if ( data.track )      this.track      = new Map( data.track )
		if ( data.priorError ) this.priorError = new Map( data.priorError )

	}

}
