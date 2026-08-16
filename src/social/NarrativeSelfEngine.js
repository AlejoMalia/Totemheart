function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * A real autobiographical narrative, built incrementally — the self as a
 * story the agent tells about itself, not just accumulated state (McAdams,
 * D. P. (2001), "The psychology of life stories", Review of General
 * Psychology, 5(2), 100-122; McAdams, D. P., & McLean, K. C. (2013),
 * "Narrative identity", Current Directions in Psychological Science, 22(3),
 * 233-238). Tracks "chapters" — a running theme (a real EMA of recent event
 * valence, not a text summary) that new events are compared against; a
 * chapter whose recent events genuinely stop matching its own theme is a
 * real narrative-coherence break, the engineering analog of what identity
 * researchers call an incoherent or ruptured life story.
 *
 *   ChapterUpdate = α·new_event + (1-α)·previous_chapter
 *   Coherence = 1 - (Σ|event_valence - chapter_theme| / n)
 *   Crisis = Coherence < 0.6 (personality-modulated threshold, not fixed)
 */
export class NarrativeSelfEngine {

	constructor( { alpha = 0.2, windowSize = 8 } = {} ) {

		this.alpha         = alpha
		this.windowSize    = windowSize
		this.chapters       = [ { theme: 0, events: [], startedAt: Date.now() } ]

	}

	#current() {

		return this.chapters[ this.chapters.length - 1 ]

	}

	/**
	 * `eventValence` — real valence of a significant event (life event, rupture,
	 * repair — whatever the caller judges significant enough to matter to the
	 * narrative, not every single turn). Personality modulates two real
	 * things: `openness` lowers the bar for starting a genuinely NEW chapter
	 * (more narrative flexibility), `conscientiousness` dampens how much a
	 * single event can pull the theme (forces more coherence, own tuning).
	 */
	addEvent( eventValence, { openness = 0.5, neuroticism = 0.5, conscientiousness = 0.5 } = {} ) {

		const chapter          = this.#current()
		const effectiveAlpha = this.alpha * ( 1 - clamp01( conscientiousness ) * 0.5 )

		chapter.theme = effectiveAlpha * eventValence + ( 1 - effectiveAlpha ) * chapter.theme
		chapter.events.push( eventValence )
		if ( chapter.events.length > this.windowSize ) chapter.events.shift()

		const coherence   = this.getCoherence()
		const crisisBar    = 0.6 + clamp01( neuroticism ) * 0.15 // more neurotic minds read the SAME coherence dip as more of a real crisis
		const crisis          = coherence < crisisBar

		// A genuinely open mind starts a new chapter more readily once a real
		// crisis is detected — narrative flexibility as a real, deterministic
		// lower bar (not a coin flip): openness shrinks how much WORSE than its
		// own crisisBar coherence has to fall before a fresh chapter starts.
		const chapterSwitchMargin = 0.15 * ( 1 - clamp01( openness ) )
		if ( crisis && coherence < crisisBar - chapterSwitchMargin ) this.#startChapter()

		return { theme: chapter.theme, coherence, crisis, chapterIndex: this.chapters.length - 1 }

	}

	#startChapter() {

		this.chapters.push( { theme: this.#current().theme, events: [], startedAt: Date.now() } )

	}

	getCoherence() {

		const chapter = this.#current()
		if ( !chapter.events.length ) return 1

		const meanAbsDeviation = chapter.events.reduce( ( sum, v ) => sum + Math.abs( v - chapter.theme ), 0 ) / chapter.events.length
		return clamp01( 1 - meanAbsDeviation )

	}

	getChapterCount() {

		return this.chapters.length

	}

	getCurrentTheme() {

		return this.#current().theme

	}

}
