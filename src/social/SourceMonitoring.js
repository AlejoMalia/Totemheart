function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

/**
 * Real source monitoring — Johnson, M. K., Hashtroudi, S. & Lindsay, D. S.
 * (1993), "Source monitoring." Psychological Bulletin, 114(1), 3-28 (the
 * actual, well-established framework: discriminating whether a memory came
 * from real perceived experience, from being told, or from one's own
 * imagination, using real cues — sensory detail, contextual richness — a
 * genuinely fallible discrimination process, not a tag stored WITH the
 * memory). Applied here to Totemheart's own real episodic entries: an entry
 * built from rich, specific turn content reads as more "lived"; one built
 * from a sparse, generic, or explicitly-hedged report reads as more
 * "told"/"imagined."
 *
 *   P(real | m) = σ(sensoryDetail + context - imaginationTag)
 */
export class SourceMonitoring {

	/**
	 * `sensoryDetail`/`context` (0..1) — real specificity/contextual richness
	 * readings the caller supplies (e.g. from token count, concept-tag
	 * density). `imaginationTag` (0..1) — real hedging/hypothetical-framing
	 * strength detected in the source text ("imagina que...", "y si...").
	 */
	evaluate( { sensoryDetail = 0.5, context = 0.5, imaginationTag = 0 } = {} ) {

		const pReal = sigmoid( 3 * ( clamp01( sensoryDetail ) + clamp01( context ) - 1 - clamp01( imaginationTag ) * 1.5 ) )
		return {
			pReal,
			source : pReal > 0.6 ? 'experienced' : imaginationTag > 0.5 ? 'imagined' : 'told',
		}

	}

}
