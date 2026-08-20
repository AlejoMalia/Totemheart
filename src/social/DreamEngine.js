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
	generateDream( userId, { topDetail = null, topTheme = null, dominantFamily = null, affectLedger = null }, now = Date.now() ) {

		if ( !topDetail && !topTheme ) return null

		const topic     = topDetail?.text ?? topTheme?.theme ?? dominantFamily ?? 'algo difuso'
		const warmth  = affectLedger?.cumulativeWarmth ?? 0
		const hurt        = affectLedger?.cumulativeHurt ?? 0
		const valence = clamp01( ( warmth - hurt + 1 ) / 2 ) * 2 - 1 // real -1..1 from the real accumulated ledger, not invented

		const dream = { topic, valence, dominantFamily, dreamedAt: now, mentioned: false }
		this.dreams.set( userId, dream )
		return dream

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
