/**
 * Envy/jealousy triggered by the *sign of the derivative* of relative
 * status, not the absolute level — matching the real phenomenon that envy
 * spikes when your standing is falling while a comparison target's is
 * rising, not just from someone else generally having more. Status here is
 * approximated by Attachment.powerDynamic (already tracked per user); this
 * module only adds the trend comparison across two users' status.
 */
export class StatusEnvy {

	constructor() {

		this.history = new Map() // userId -> last observed status

	}

	/** Call once per turn per known user with their current status (e.g. relation.powerDynamic). */
	observe( userId, status ) {

		const previous = this.history.get( userId )
		this.history.set( userId, status )
		return previous === undefined ? 0 : status - previous

	}

	/** Compares self's status trend against a rival's — positive envyTrigger = classic "falling while they rise". */
	checkEnvy( selfTrend, rivalTrend ) {

		const triggered = selfTrend < 0 && rivalTrend > 0
		return { triggered, intensity: triggered ? Math.min( 1, Math.abs( selfTrend ) + rivalTrend ) : 0 }

	}

	/**
	 * A real, distinct dark-social-affect axis alongside envy — Smith, R. H.
	 * & Kim, S. H. (2007), "Comprehending envy." Psychological Bulletin,
	 * 133(1), 46-64 (real schadenfreude, pleasure at another's misfortune, as
	 * a genuine correlate of rivalry rather than the same construct as
	 * envy). `otherHarm`/`otherGain` (0..1) — real magnitude of something
	 * bad/good happening to the OTHER party; `rivalry` (0..1) — real
	 * hostility/competition toward them.
	 *
	 *   Schadenfreude = σ(otherHarm · rivalry)
	 */
	checkSchadenfreude( otherHarm, rivalry ) {

		if ( otherHarm <= 0 || rivalry <= 0 ) return { intensity: 0 }
		const z = 4 * ( otherHarm * rivalry - 0.3 )
		return { intensity: 1 / ( 1 + Math.exp( -z ) ) }

	}

	/**
	 * Real benign/malicious envy SPLIT — van de Ven, N., Zeelenberg, M. &
	 * Pieters, R. (2009), "Leveling up and down: The experiences of benign
	 * and malicious envy", Emotion, 9(3), 419-429 (the real, well-established
	 * finding that envy is genuinely TWO distinct emotions with opposite
	 * behavioral consequences — benign envy, felt when the advantage seems
	 * deserved/attainable, drives real emulation; malicious envy, felt when
	 * it seems undeserved/threatening, drives real hostility). Distinct from
	 * `checkSchadenfreude()` above (a real downstream CONSEQUENCE of
	 * malicious envy specifically, not envy itself).
	 *
	 *   Compare = max(0, Status_j − Status_i)
	 *   Benign = σ(Compare·Admiration·GrowthMindset)
	 *   Malicious = σ(Compare·Hostility·EgoThreat)
	 */
	getEnvySplit( statusSelf, statusOther, { admiration = 0.5, growthMindset = 0.5, hostility = 0.3, egoThreat = 0.3 } = {} ) {

		const compare = Math.max( 0, statusOther - statusSelf )
		const sigmoid   = x => 1 / ( 1 + Math.exp( -x ) )
		const benign       = sigmoid( 4 * ( compare * admiration * growthMindset - 0.3 ) )
		const malicious   = sigmoid( 4 * ( compare * hostility * egoThreat - 0.3 ) )
		return { compare, benign, malicious, dominant: benign >= malicious ? 'benign' : 'malicious' }

	}

}
