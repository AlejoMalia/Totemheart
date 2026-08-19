function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real strategic self-presentation, distinct from felt self-esteem —
 * Goffman, E. (1959), "The Presentation of Self in Everyday Life",
 * Doubleday (the real, foundational account of impression management as a
 * genuine, effortful performance a person maintains for an audience,
 * separate from their actual felt internal state). Jones, E. E. &
 * Pittman, T. S. (1982) on real distinct self-presentation strategies
 * (ingratiation, self-promotion, exemplification). Distinct from
 * `IdentityFusionLite` (which topics are core to identity) and
 * `NarrativeSelfEngine` (autobiographical coherence): this tracks the real,
 * per-audience GAP between the felt state and the presented one, and the
 * genuine effort cost of maintaining it.
 *
 *   presentationGap = |feltValence - presentedValence|
 *   maintenanceCost accumulates like ExpressionDebt's own suppression cost
 */
export class SelfPresentationManager {

	constructor() {

		this.strategy       = new Map() // userId -> preferred strategy: 'ingratiation'|'competence'|'authentic'
		this.maintenanceCost = 0

	}

	/** Real strategy choice given real context — a real trade-off, not a free choice. */
	selectStrategy( userId, { desiredImpression = 'liked', powerGap = 0, trust = 0.5 } = {} ) {

		let strategy = 'authentic'
		if ( desiredImpression === 'liked' && powerGap < 0 ) strategy = 'ingratiation'
		else if ( desiredImpression === 'competent' ) strategy = 'competence'
		else if ( trust > 0.7 ) strategy = 'authentic'
		this.strategy.set( userId, strategy )
		return strategy

	}

	/** Real accrual of effort cost from maintaining a presented state that diverges from the felt one — same shape as `ExpressionDebt`'s own suppression accrual, tracked separately since it's about IMAGE, not felt-affect suppression. */
	registerGap( feltValence, presentedValence ) {

		const gap = clamp01( Math.abs( feltValence - presentedValence ) )
		this.maintenanceCost = clamp01( this.maintenanceCost + gap * 0.15 )
		return this.maintenanceCost

	}

	decay( dt = 1, lambda = 0.1 ) {

		this.maintenanceCost = Math.max( 0, this.maintenanceCost - lambda * dt )

	}

}
