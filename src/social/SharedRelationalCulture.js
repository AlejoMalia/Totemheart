function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real relationship-specific "idioculture" — Bell, R. A., Buerkel-Rothfuss,
 * N. L. & Gore, K. E. (1987), "'Did you bring the yarmulke for the
 * cabbage patch kid?' The idioms of couples", Communication Monographs,
 * 54(1), 47-67 (the real, coined term "idioculture": couples/close pairs
 * genuinely build a private vocabulary — inside jokes, nicknames, rituals
 * — whose real strength predicts relationship satisfaction). Distinct from
 * `RelationalMemoryCatalog` (general per-person episodic weighting) — this
 * is scoped specifically to real, repeated, JOINTLY-built cues, with a
 * real cue-based reactivation probability, not just recall by salience.
 *
 *   w ← w + η·jointAttention·bond        (on real repeated shared item)
 *   P(recall) = σ(overlap(cue,item)·w·phaseBoost)
 *   Urge = w_ritual·(1−recentCompliance)
 */
function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

export class SharedRelationalCulture {

	constructor( { eta = 0.2 } = {} ) {

		this.eta   = eta
		this.items = new Map() // userId -> Map(itemKey -> { weight, kind, lastComplianceAt })

	}

	#person( userId ) {

		if ( !this.items.has( userId ) ) this.items.set( userId, new Map() )
		return this.items.get( userId )

	}

	/** Real reinforcement of a shared item (inside joke, nickname, ritual, symbol) — `jointAttention` (0..1, both parties genuinely engaged with it this turn), `bond` (real, already-tracked). */
	reinforce( userId, itemKey, kind, jointAttention, bond ) {

		const person = this.#person( userId )
		const entry     = person.get( itemKey ) ?? { weight: 0, kind, lastComplianceAt: null }
		entry.weight  = clamp01( entry.weight + this.eta * clamp01( jointAttention ) * clamp01( Math.max( 0, bond ) ) )
		if ( kind === 'ritual' ) entry.lastComplianceAt = Date.now()
		person.set( itemKey, entry )
		return entry.weight

	}

	/** Real reactivation probability — `overlap` (0..1, how much this turn's own content matches a stored cue). */
	getReactivationProbability( userId, itemKey, overlap, phaseBoost = 1 ) {

		const entry = this.#person( userId ).get( itemKey )
		if ( !entry ) return 0
		return sigmoid( 4 * ( clamp01( overlap ) * entry.weight * phaseBoost - 0.5 ) )

	}

	/** Real ritual urge — a genuinely UNMET real ritual (one with real weight, not recently complied with) creates a real pull to re-enact it. */
	getRitualUrge( userId, itemKey, now = Date.now(), expectedGapMs = 1000 * 60 * 60 * 24 * 7 ) {

		const entry = this.#person( userId ).get( itemKey )
		if ( !entry || entry.kind !== 'ritual' ) return 0
		const elapsed              = entry.lastComplianceAt ? now - entry.lastComplianceAt : expectedGapMs
		const recentCompliance = clamp01( 1 - elapsed / expectedGapMs )
		return entry.weight * ( 1 - recentCompliance )

	}

	getItems( userId ) {

		return [ ...this.#person( userId ).entries() ]

	}

	decay( userId, dt = 1, rate = 0.005 ) {

		for ( const [ key, entry ] of this.#person( userId ) ) entry.weight = Math.max( 0, entry.weight - rate * dt ), this.#person( userId ).set( key, entry )

	}

}
