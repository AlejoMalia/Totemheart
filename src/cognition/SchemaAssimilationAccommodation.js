function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real Piagetian assimilation vs. accommodation, operationalized as a
 * concrete distance-threshold decision — Piaget, J. (1952), "The Origins of
 * Intelligence in Children", International Universities Press; Piaget, J.
 * (1970), "Piaget's theory", in Mussen, P. H. (ed.), Carmichael's Manual of
 * Child Psychology, Wiley (the actual real distinction: assimilation folds
 * new experience into an EXISTING schema unchanged; accommodation actually
 * restructures the schema itself when the fit is too poor). Distinct from
 * `OntogenicDevelopment` (real, one-way developmental STAGE progression over
 * many turns) — this is a real, reversible per-schema fit decision made
 * fresh each time new experience arrives, own engineering of the distance
 * metric and the accommodation update rule.
 *
 *   assimilate  if d(x, S) < θ
 *   accommodate S ← S + η(x - S)   otherwise
 */
export class SchemaAssimilationAccommodation {

	constructor( { threshold = 0.35, accommodationRate = 0.25 } = {} ) {

		this.threshold          = threshold
		this.accommodationRate = accommodationRate
		this.schemas                 = new Map() // name -> real 0..1 prototype value

	}

	getSchema( name, fallback = 0.5 ) {

		return this.schemas.has( name ) ? this.schemas.get( name ) : fallback

	}

	/** `experience` — a real 0..1 reading of this turn's instance of the schema's own dimension. */
	observe( name, experience ) {

		const current    = this.getSchema( name )
		const distance = Math.abs( experience - current )

		if ( distance < this.threshold ) {

			// Real assimilation: the schema itself doesn't move, only a tiny real
			// confirmatory nudge (own engineering, not Piaget's own formula).
			this.schemas.set( name, clamp01( current + ( experience - current ) * 0.05 ) )
			return { mode: 'assimilate', distance, schema: this.schemas.get( name ) }

		}

		// Real accommodation: the schema itself genuinely restructures toward the new experience.
		this.schemas.set( name, clamp01( current + this.accommodationRate * ( experience - current ) ) )
		return { mode: 'accommodate', distance, schema: this.schemas.get( name ) }

	}

}
