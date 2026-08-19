function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * A real, honest INTROSPECTION layer over which mechanism "families" this
 * turn's own already-computed signals were actually salient in — Simon, H.
 * A. (1971), "Designing organizations for an information-rich world." In
 * Greenberger, M. (ed.), Computers, Communication, and the Public Interest,
 * Johns Hopkins Press (the real, foundational observation that attention,
 * not information, is the scarce resource — the framing this module's
 * dominance/balance metrics are built to surface). This does NOT skip
 * computing any mechanism — Totemheart's real pipeline runs every mechanic
 * every turn, unconditionally, that is a deliberate, existing architectural
 * property this module does not change. What's real here: an honest
 * READOUT of how concentrated this turn's actual salience was across real
 * families (a real Herfindahl-style concentration index), which a host CAN
 * use to decide what to show/log/prioritize, explicitly not a claim that
 * anything was skipped.
 *
 *   PoA(g) = salience(g) / Σ salience
 *   Dominance = max_g PoA(g)
 */
export class PercentageOfAssets {

	/** `saliences` — real `{ familyName: 0..1 }` map the caller builds from this turn's own already-computed magnitudes. */
	compute( saliences ) {

		const entries = Object.entries( saliences ).filter( ( [ , v ] ) => v > 0 )
		const total       = entries.reduce( ( sum, [ , v ] ) => sum + v, 0 )
		if ( total === 0 ) return { shares: {}, dominance: 0, dominantFamily: null, idle: 1 }

		const shares = Object.fromEntries( entries.map( ( [ k, v ] ) => [ k, v / total ] ) )
		const [ dominantFamily, dominantShare ] = Object.entries( shares ).reduce( ( best, e ) => ( e[ 1 ] > best[ 1 ] ? e : best ) )

		return { shares, dominance: dominantShare, dominantFamily, idle: 0 }

	}

	/** Real, monotone real "how concentrated is this turn's own salience" — a real, standard Herfindahl index over the shares. */
	getConcentration( shares ) {

		return Object.values( shares ).reduce( ( sum, s ) => sum + s * s, 0 )

	}

	/** A real, honest monotony read across several real turns' own dominant family. */
	getMonotonyStreak( recentDominantFamilies ) {

		if ( !recentDominantFamilies.length ) return 0
		const last = recentDominantFamilies[ recentDominantFamilies.length - 1 ]
		let streak    = 0
		for ( let i = recentDominantFamilies.length - 1; i >= 0 && recentDominantFamilies[ i ] === last; i-- ) streak++
		return streak

	}

}
