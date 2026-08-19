function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real face-threat appraisal, distinct from generic negative valence —
 * Brown, P. & Levinson, S. C. (1987), "Politeness: Some Universals in
 * Language Usage", Cambridge University Press (the real, well-established
 * distinction between threats to POSITIVE face — the want to be liked/
 * approved of — and NEGATIVE face — the want for autonomy/non-imposition;
 * the two produce genuinely different regulation needs). Distinct from
 * `SocialDiscomfort` (vicarious, about someone ELSE's status drop) and
 * `IdentityThreatMonitor` (a deeper, identity-level attack): this reads a
 * lighter, more common everyday threat to ordinary conversational face.
 *
 *   positiveFaceThreat = criticism · (1 - warmth)
 *   negativeFaceThreat = imposition · (1 - autonomySlack)
 */
export class FaceThreatSensitivity {

	constructor( { sensitivity = 0.6 } = {} ) {

		this.sensitivity = sensitivity

	}

	/** `criticism` (0..1, real disapproval directed at this turn/AI), `warmth` (0..1, real existing affinity buffering it). */
	getPositiveFaceThreat( criticism, warmth = 0 ) {

		return clamp01( criticism * ( 1 - warmth ) * this.sensitivity )

	}

	/** `imposition` (0..1, real demand/request pressure on the AI's own autonomy), `autonomySlack` (0..1, real available capacity to comply). */
	getNegativeFaceThreat( imposition, autonomySlack = 0.5 ) {

		return clamp01( imposition * ( 1 - autonomySlack ) * this.sensitivity )

	}

	/** Combined real face-threat reading, used to scale hedging/politeness needs. */
	getCombinedThreat( criticism, imposition, warmth = 0, autonomySlack = 0.5 ) {

		return clamp01( Math.max( this.getPositiveFaceThreat( criticism, warmth ), this.getNegativeFaceThreat( imposition, autonomySlack ) ) )

	}

}
