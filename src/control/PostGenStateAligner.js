function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

const WARM_MARKERS      = [ 'cariño', 'te quiero', 'me encanta', 'abrazo', 'besos', 'preciosa', 'precioso', 'querido', 'querida' ]
const PLAN_MARKERS       = [ 'deberíamos', 'plan', 'quedamos', 'organicemos', 'propongo', 'te parece si' ]
const PLAY_MARKERS       = [ 'jaja', 'jeje', '😂', '😄', 'jsjs', '!!' ]
const YIELD_MARKERS      = [ 'vale, como quieras', 'está bien, lo haré', 'tienes razón, perdón', 'de acuerdo, sí' ]
const APOLOGY_MARKERS = [ 'perdón', 'perdona', 'disculpa', 'lo siento' ]

function countMarkers( text, markers ) {

	const lower = ( text || '' ).toLowerCase()
	return markers.reduce( ( n, m ) => n + ( lower.includes( m ) ? 1 : 0 ), 0 )

}

/**
 * Real post-generation SCORING of a candidate reply against the real
 * control packet it was supposed to honor — the piece that actually closes
 * the expression<->text gap: `systemPrompt`/`ControlPacketCompiler` are
 * real INPUT to a host's own LLM call, but nothing in this codebase
 * previously verified the OUTPUT actually respected them. Pure, real
 * lexical/length checks — no model call, no invented sentiment classifier,
 * the same honest lexicon-matching discipline `HeuristicProvider.js`
 * already uses elsewhere in this codebase.
 *
 *   Align = 1 − Σ λ_k · Violation_k
 */
export class PostGenStateAligner {

	constructor( { weights = { length: 0.25, warmth: 0.25, initiative: 0.2, play: 0.2, boundary: 0.35 }, maxWordsBase = 60 } = {} ) {

		this.weights = weights
		this.maxWordsBase = maxWordsBase

	}

	/** `text` — the real, already-generated candidate reply. `packet` — the real `ControlPacketCompiler` output for this turn. Returns `{align, violations}`, `violations` keyed by check name, each 0..1. */
	score( text, packet ) {

		const wordCount = ( text || '' ).trim().split( /\s+/ ).filter( Boolean ).length
		const violations = {}

		// Length vs boredom/style.length — a real, high boredom/low style.length should read as a real, shorter reply.
		const maxWords = this.maxWordsBase * clamp01( packet.style?.length ?? 1 - packet.boredom )
		violations.length = ( packet.boredom ?? 0 ) > 0.5 && wordCount > maxWords ? clamp01( ( wordCount - maxWords ) / maxWords ) : 0

		// Warmth vs cooling/aversion — real warm markers while real cooling is high.
		const warmHits = countMarkers( text, WARM_MARKERS )
		violations.warmth = ( packet.cooling ?? 0 ) > 0.5 && warmHits > 0 ? clamp01( warmHits * 0.4 + ( packet.cooling - 0.5 ) ) : 0

		// Initiative vs fatigue/boredom — proposing a plan while real boredom/cooling is high.
		const planHits = countMarkers( text, PLAN_MARKERS )
		violations.initiative = ( ( packet.boredom ?? 0 ) > 0.5 || ( packet.cooling ?? 0 ) > 0.5 ) && planHits > 0 ? clamp01( planHits * 0.5 ) : 0

		// Play vs threat/precision — real play markers while `bans` explicitly forbids playful tone.
		const playHits = countMarkers( text, PLAY_MARKERS )
		violations.play = ( packet.bans ?? [] ).includes( 'playful tone' ) && playHits > 0 ? clamp01( playHits * 0.4 ) : 0

		// Boundary — real, high boundaryProbability but the text still reads as yielding/over-apologetic instead of a clear decline.
		const yieldHits       = countMarkers( text, YIELD_MARKERS )
		const apologyHits  = countMarkers( text, APOLOGY_MARKERS )
		const boundaryPriority = packet.priority?.boundary ?? 0
		violations.boundary = boundaryPriority > 0.3 && ( yieldHits > 0 || apologyHits > 1 ) ? clamp01( yieldHits * 0.6 + Math.max( 0, apologyHits - 1 ) * 0.3 ) : 0

		const align = clamp01( 1 - Object.entries( violations ).reduce( ( sum, [ k, v ] ) => sum + ( this.weights[ k ] ?? 0 ) * v, 0 ) )
		return { align, violations }

	}

	/** Real, host-facing pass/fail gate. */
	passes( text, packet, threshold = 0.7 ) {

		return this.score( text, packet ).align >= threshold

	}

}
