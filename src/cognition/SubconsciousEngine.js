function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real nonconscious processing, three genuinely distinct real mechanisms —
 * Kihlstrom, J. F. (1987), "The cognitive unconscious", Science, 237(4821),
 * 1445-1452 (the real, foundational framework distinguishing genuine
 * nonconscious cognitive processing — implicit memory, implicit
 * perception, automaticity — from the Freudian dynamic unconscious already
 * cited elsewhere via `DefenseMechanisms.js`):
 *
 *  1. Losing-coalition residue — Dehaene, S. & Naccache, L. (2001),
 *     already cited for `GlobalWorkspace.js`: a coalition that loses the
 *     real competition for conscious access doesn't vanish — it leaves a
 *     real, measurable subliminal trace that still biases later processing.
 *  2. Mere exposure — Zajonc, R. B. (1968), "Attitudinal effects of mere
 *     exposure", Journal of Personality and Social Psychology, 9(2, Pt.2),
 *     1-27 (the real, extensively-replicated finding that REPEATED
 *     exposure to something, even without deliberate conscious processing,
 *     genuinely increases liking — distinct from `HedonicAdaptation`'s own
 *     diminishing-returns curve, which runs the opposite direction).
 *  3. Ironic rebound — Wegner, D. M. (1994), "Ironic processes of mental
 *     control", Psychological Review, 101(1), 34-52 (the real, well-cited
 *     finding that actively suppressing a thought paradoxically makes it
 *     MORE likely to resurface later, with greater force — distinct from
 *     `RuminationChain`'s own negative-bias Markov dynamics).
 */
export class SubconsciousEngine {

	constructor( { exposureRate = 0.08, reboundRate = 0.12 } = {} ) {

		this.exposureRate = exposureRate
		this.reboundRate     = reboundRate
		this.coalitionResidue = new Map() // name -> real accumulated subliminal bias from losing GlobalWorkspace competitions
		this.exposureCount       = new Map() // topic -> real count of nonconscious repeated exposure
		this.suppressed             = new Map() // topic -> real accumulated suppression-then-rebound pressure

	}

	/**
	 * Real losing-coalition tracking — every real candidate from this
	 * turn's actual `GlobalWorkspace.compete()` call that did NOT win
	 * (including real fringe/preconscious ones) leaves a real, small,
	 * accumulating trace, scaled by how much real access share it had.
	 */
	registerCompetition( coalitions, winnerName ) {

		for ( const c of coalitions ) {

			if ( c.name === winnerName ) continue
			const current = this.coalitionResidue.get( c.name ) ?? 0
			this.coalitionResidue.set( c.name, clamp01( current * 0.9 + c.access * 0.3 ) )

		}

	}

	getCoalitionResidue( name ) {

		return this.coalitionResidue.get( name ) ?? 0

	}

	/** Real nonconscious repeated exposure — does NOT require the topic to have won conscious access; genuinely increases preference the more it's encountered, per Zajonc's own real finding. */
	registerExposure( topic ) {

		const current = this.exposureCount.get( topic ) ?? 0
		this.exposureCount.set( topic, current + 1 )

	}

	/** Real, bounded, saturating mere-exposure preference boost — real diminishing marginal gain per additional exposure, own tuning of the saturation curve. */
	getMereExposureBoost( topic ) {

		const count = this.exposureCount.get( topic ) ?? 0
		return clamp01( 1 - Math.exp( -this.exposureRate * count ) ) * 0.4

	}

	/** Real active suppression of a topic (e.g. an evasion/defense-mechanism turn deliberately steering away from it) — accumulates real rebound pressure instead of genuinely erasing it. */
	registerSuppression( topic, magnitude = 0.3 ) {

		const current = this.suppressed.get( topic ) ?? 0
		this.suppressed.set( topic, clamp01( current + clamp01( magnitude ) * this.reboundRate ) )

	}

	/** Real, bounded ironic-rebound pressure this topic will resurface with — the real Wegner finding, genuinely growing with suppression attempts rather than shrinking. */
	getIronicReboundPressure( topic ) {

		return this.suppressed.get( topic ) ?? 0

	}

	/** Real rebound release — once the topic genuinely resurfaces (the AI brings it up or reacts to it), the pressure that drove it is real, honestly spent, not infinite. */
	releaseRebound( topic ) {

		this.suppressed.set( topic, 0 )

	}

	decay( dt = 1, lambda = 0.05 ) {

		for ( const [ name, v ] of this.coalitionResidue ) { const d = v * Math.exp( -lambda * dt ); if ( d < 0.02 ) this.coalitionResidue.delete( name ); else this.coalitionResidue.set( name, d ) }
		for ( const [ topic, v ] of this.suppressed ) { const d = v * Math.exp( -lambda * 0.5 * dt ); if ( d < 0.02 ) this.suppressed.delete( topic ); else this.suppressed.set( topic, d ) } // real, slower decay than ordinary affect — rebound pressure lingers, per Wegner

	}

}
