function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real Construal Level Theory — Trope, Y. & Liberman, N. (2010),
 * "Construal-level theory of psychological distance", Psychological
 * Review, 117(2), 440-463 (the real, well-established, extensively-tested
 * finding that psychological distance — temporal, spatial, social, or
 * hypothetical — systematically shifts construal from concrete/detailed
 * ("low-level") to abstract/gist ("high-level"), across all four distance
 * dimensions on one shared underlying scale). Distinct from
 * `SocialReferenceFrame` (relative-utility comparison within a group):
 * this scales how ABSTRACT vs. CONCRETE this AI's own reasoning/expression
 * about something should genuinely be, given real distance along any axis.
 *
 *   distance = w_t·temporal + w_s·spatial + w_so·social + w_h·hypothetical
 *   construalLevel = sigmoid(k·distance)  (0=concrete, 1=abstract)
 */
function sigmoid( x ) { return 1 / ( 1 + Math.exp( -x ) ) }

export class PsychologicalDistanceScaler {

	constructor( { k = 2.5 } = {} ) {

		this.k = k

	}

	/** Each dimension 0..1 (real normalized distance along that axis). Returns a real combined distance and construal level. */
	getConstrual( { temporal = 0, spatial = 0, social = 0, hypothetical = 0 } = {} ) {

		const distance = clamp01( ( temporal + spatial + social + hypothetical ) / 4 )
		const construalLevel = sigmoid( this.k * ( distance - 0.5 ) )
		return { distance, construalLevel, mode: construalLevel > 0.5 ? 'abstract' : 'concrete' }

	}

}
