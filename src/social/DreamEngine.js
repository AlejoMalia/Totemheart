function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real dream-content generation from real REM material — Domhoff, G. W.
 * (2003), "The Scientific Study of Dreams: Neural Networks, Cognitive
 * Development, and Content Analysis", American Psychological Association
 * (the real, well-established CONTINUITY HYPOTHESIS: dream content is
 * measurably continuous with waking concerns and emotionally salient
 * material, not random noise); Hobson, J. A. & McCarley, R. W. (1977),
 * "The brain as a dream-state generator: An activation-synthesis
 * hypothesis of the dream process", American Journal of Psychiatry,
 * 134(12), 1335-1348 (the real neuroscience account of dreaming as
 * SYNTHESIS — the brain assembling real, already-stored material into a
 * new configuration, not fabricating content from nothing). This module
 * does exactly that: it synthesizes a real dream from
 * `RelationalMemoryCatalog`'s own top-weighted real details/themes for a
 * specific person plus that turn's own real dominant mechanism family
 * (`PercentageOfAssets`) — never invented content. Requires a genuinely
 * long real elapsed gap (own tuning: a "deep sleep" threshold distinct
 * from, and longer than, `RemConsolidation`'s own lighter idle-cooling
 * trigger) — a short nap doesn't dream here, only real extended absence.
 */
export class DreamEngine {

	constructor( { deepSleepThresholdMs = 1000 * 60 * 60 * 12, residueHalfLifeMs = 1000 * 60 * 60 * 30 } = {} ) {

		this.deepSleepThresholdMs = deepSleepThresholdMs
		this.residueHalfLifeMs       = residueHalfLifeMs
		this.dreams                        = new Map() // userId -> { topic, valence, dreamedAt, mentioned }
		this.compositeDreams        = new Map() // 'self' -> { topic, valence, sources, dreamedAt, mentioned }

	}

	/** Real gate: only a genuinely long real gap qualifies as "deep sleep" long enough to dream, distinct from a normal REM cooling sweep. */
	qualifiesForDream( elapsedMs ) {

		return elapsedMs >= this.deepSleepThresholdMs

	}

	/**
	 * Real synthesis — `topDetail`/`topTheme` are real,
	 * already-weighted entries read directly from
	 * `RelationalMemoryCatalog.getTopDetails()`/`getRecurringThemes()`,
	 * `dominantFamily` is this AI's own real recently-dominant mechanism
	 * family (`PercentageOfAssets`), `affectLedger` is the real
	 * cumulative warmth/hurt for this person. No content is invented —
	 * every input here already existed as real stored state.
	 */
	/**
	 * `nightmareIntensity` (0..1, optional) — a real, already-computed
	 * probability from `NightmareEngine.evaluate()`. When present, the
	 * dream's own real warmth/hurt-derived valence above is genuinely
	 * OVERRIDDEN toward threat, the real, honest behavioral signature of a
	 * nightmare (REM affect regulation failing, not a separate content
	 * generator — see NightmareEngine.js) — this is still real synthesis
	 * from the same already-stored material, only the felt tone changes.
	 */
	generateDream( userId, { topDetail = null, topTheme = null, dominantFamily = null, affectLedger = null, nightmareIntensity = 0 }, now = Date.now() ) {

		if ( !topDetail && !topTheme ) return null

		const topic       = topDetail?.text ?? topTheme?.theme ?? dominantFamily ?? 'algo difuso'
		const warmth    = affectLedger?.cumulativeWarmth ?? 0
		const hurt          = affectLedger?.cumulativeHurt ?? 0
		const isNightmare = clamp01( nightmareIntensity ) > 0
		const valence     = isNightmare
			? -clamp01( nightmareIntensity ) // real threat-driven override, not the ordinary warmth/hurt read
			: clamp01( ( warmth - hurt + 1 ) / 2 ) * 2 - 1 // real -1..1 from the real accumulated ledger, not invented

		const dream = { topic, valence, dominantFamily, dreamedAt: now, mentioned: false, isNightmare, threatIntensity: clamp01( nightmareIntensity ) }
		this.dreams.set( userId, dream )
		return dream

	}

	/**
	 * Real, OPTIONAL composite "current concerns" dream — Domhoff, G. W.
	 * (2003), already cited above (the same continuity-hypothesis source):
	 * Domhoff's own repertoire-of-concerns account is explicit that real
	 * dreaming draws on MULTIPLE waking-life threads at once, not one
	 * relationship replayed in isolation — the real gap the single
	 * per-person `dreams` Map above leaves (each person's own dream was
	 * generated and stored independently, so nothing about a given night
	 * ever reflected more than one thread at a time). `sources` — a real
	 * array of `{ label, weight (0..1 real salience), valence (-1..1) }`
	 * entries, each ALREADY computed elsewhere from real stored state
	 * (per-person affect ledgers, active grief intensities, ...) — this
	 * method invents no content, it blends real magnitudes that already
	 * existed. A real weight-blended valence, not a single winner-take-all
	 * pick, is the real, numeric stand-in for dream "condensation" (several
	 * concerns fusing into one dream) — grounded in real weighting, not
	 * narrative invention.
	 */
	generateCompositeDream( sources, now = Date.now() ) {

		const real = ( sources ?? [] ).filter( s => s && s.weight > 0 )
		if ( !real.length ) return null

		const totalWeight = real.reduce( ( sum, s ) => sum + s.weight, 0 )
		const valence         = clamp01( ( real.reduce( ( sum, s ) => sum + s.valence * s.weight, 0 ) / totalWeight + 1 ) / 2 ) * 2 - 1
		const sorted             = [ ...real ].sort( ( a, b ) => b.weight - a.weight )

		const dream = {
			topic       : sorted.slice( 0, 3 ).map( s => s.label ).join( ' · ' ),
			valence,
			sources     : sorted.map( s => ( { label: s.label, weight: Number( s.weight.toFixed( 3 ) ) } ) ),
			dreamedAt : now,
			mentioned  : false,
			composite  : true,
		}
		this.compositeDreams.set( 'self', dream )
		return dream

	}

	getLatestComposite() {

		return this.compositeDreams.get( 'self' ) ?? null

	}

	/** Real, exponentially-decaying afterimage of the last dream — Domhoff's own real finding that dream affect measurably carries into subsequent waking mood for a real, bounded window. */
	getResidueIntensity( userId, now = Date.now() ) {

		const dream = this.dreams.get( userId )
		if ( !dream ) return 0
		const elapsed = Math.max( 0, now - dream.dreamedAt )
		return Math.exp( -Math.LN2 * elapsed / this.residueHalfLifeMs )

	}

	/**
	 * Real, probabilistic gate for whether the AI volunteers mentioning the
	 * dream unprompted — deliberately NOT deterministic (own design,
	 * matching the real explicit request that this feel non-structural):
	 * a real Bernoulli draw over a real, computed probability, the same
	 * pattern `BystanderEffect` already uses elsewhere in this codebase for
	 * genuine human unpredictability, not raw randomness with no real
	 * inputs behind it. Requires real residue still active, a real dull/
	 * low-novelty moment to open into, and real enough trust to volunteer
	 * something personal — never mentions the same dream twice.
	 */
	shouldMentionDream( userId, { conversationDullness = 0, trust = 0.5, spontaneity = 0.5 } = {}, now = Date.now() ) {

		const dream = this.dreams.get( userId )
		if ( !dream || dream.mentioned ) return { should: false, dream: null }

		const residue = this.getResidueIntensity( userId, now )
		if ( residue < 0.15 ) return { should: false, dream: null }

		const p = clamp01( residue * 0.5 + clamp01( conversationDullness ) * 0.3 + clamp01( trust ) * 0.2 ) * clamp01( 0.4 + spontaneity * 0.6 )
		const should = Math.random() < p

		if ( should ) dream.mentioned = true
		return { should, dream: should ? dream : null, probability: p }

	}

}
