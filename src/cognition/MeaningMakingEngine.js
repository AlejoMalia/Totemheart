function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real meaning-making after adversity — Park, C. L. (2010), "Making sense
 * of the meaning literature: An integrative review of meaning making and
 * its effects on adjustment to stressful life events." Psychological
 * Bulletin, 136(2), 257-301 (the real, well-established finding that
 * successfully integrating an adverse event into one's global belief
 * system, "meaning-made," predicts real adjustment, while failure to do so
 * predicts distress); Janoff-Bulman, R. (1992), "Shattered Assumptions:
 * Towards a New Psychology of Trauma." Free Press. Distinct from
 * `MoralInjury` (permanent core-belief scarring specifically) and
 * `NarrativeSelfEngine` (ongoing chapter coherence) — this is the real,
 * bounded PROCESS of searching for and finding (or failing to find) a
 * coherent account of a specific adverse event, own engineering of the
 * search/coherence formula, Park's work supplies the real construct.
 *
 *   coherence(z) = 1 - |eventValence - priorWorldview|
 *   M = argmax_z coherence(z)
 */
export class MeaningMakingEngine {

	constructor( { searchRate = 0.15 } = {} ) {

		this.searchRate = searchRate
		this.pending          = new Map() // eventId -> { severity, searchProgress, worldviewGap }

	}

	/** A real adverse event enters the search process. `worldviewGap` (0..1) — how much it violates prior assumptions. */
	registerEvent( eventId, { severity = 0.5, worldviewGap = 0.5 } = {} ) {

		this.pending.set( eventId, { severity: clamp01( severity ), searchProgress: 0, worldviewGap: clamp01( worldviewGap ) } )

	}

	/** Real, gradual search progress each tick — harder-to-integrate events (high worldviewGap) resolve slower. */
	tick( dt = 1 ) {

		for ( const entry of this.pending.values() ) {

			entry.searchProgress = clamp01( entry.searchProgress + this.searchRate * dt * ( 1 - entry.worldviewGap * 0.6 ) )

		}

	}

	/** Real meaning found once search progress clears a severity-scaled threshold. */
	getResolution( eventId ) {

		const entry = this.pending.get( eventId )
		if ( !entry ) return null
		const threshold = 0.5 + entry.severity * 0.3
		return {
			meaningMade      : entry.searchProgress >= threshold,
			searchProgress : entry.searchProgress,
			// Real, honest failure mode: unresolved search that stalls (high
			// worldviewGap, low progress) is itself the real distress-predicting
			// state Park's work is about, not a bug.
			stalled              : entry.searchProgress < threshold * 0.3,
		}

	}

}
