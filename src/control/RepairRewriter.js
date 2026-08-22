const WARM_MARKERS  = [ 'cariño', 'te quiero', 'me encanta', 'abrazo', 'besos', 'preciosa', 'precioso', 'querido', 'querida' ]
const PLAN_MARKERS  = [ 'deberíamos', 'plan', 'quedamos', 'organicemos', 'propongo', 'te parece si' ]
const PLAY_MARKERS = [ 'jaja', 'jeje', '😂', '😄', 'jsjs' ]

function stripSentencesContaining( text, markers ) {

	const sentences = text.split( /(?<=[.!?])\s+/ )
	return sentences.filter( s => !markers.some( m => s.toLowerCase().includes( m ) ) ).join( ' ' ).trim()

}

/**
 * Real, LOCAL, minimal repair for a candidate that mostly worked but
 * violated one or two real checks — a genuinely cheaper fix than throwing
 * the whole reply away and regenerating (Totemheart never calls an LLM
 * itself, so this repairs the STRING it was handed, deterministically, no
 * model call). For a violation this simple local pass can't safely fix
 * (the failure isn't about warmth/plan/play/length in isolation), this
 * returns real, structured REPAIR INSTRUCTIONS instead — a host with an
 * LLM can feed those back into one cheap, targeted rewrite call, still far
 * smaller than a full regeneration.
 */
export class RepairRewriter {

	constructor( { maxWordsBase = 60 } = {} ) {

		this.maxWordsBase = maxWordsBase

	}

	/** `text` — the real candidate. `violations` — the real `PostGenStateAligner.score()` output. `packet` — the real control packet. Returns `{text: repairedText, applied: [...], instructions: [...]}`. */
	repair( text, violations, packet ) {

		let repaired = text
		const applied           = []
		const instructions   = []

		if ( violations.warmth > 0 ) {

			repaired = stripSentencesContaining( repaired, WARM_MARKERS )
			applied.push( 'stripped warm phrasing' )
			instructions.push( 'lower warmth, this relationship is currently cooling' )

		}

		if ( violations.initiative > 0 ) {

			repaired = stripSentencesContaining( repaired, PLAN_MARKERS )
			applied.push( 'stripped plan-proposing lines' )
			instructions.push( 'do not propose plans or next steps this turn' )

		}

		if ( violations.play > 0 ) {

			repaired = stripSentencesContaining( repaired, PLAY_MARKERS )
			applied.push( 'stripped playful markers' )
			instructions.push( 'keep tone serious, no jokes' )

		}

		if ( violations.length > 0 ) {

			const words = repaired.trim().split( /\s+/ )
			const maxWords = Math.max( 5, Math.round( this.maxWordsBase * ( packet.style?.length ?? 0.5 ) ) )
			if ( words.length > maxWords ) {

				repaired = words.slice( 0, maxWords ).join( ' ' )
				applied.push( `truncated to ${maxWords} words` )

			}
			instructions.push( 'keep the reply short' )

		}

		if ( violations.boundary > 0 ) {

			instructions.push( 'decline clearly, without excessive apology — this needs a real rewrite, not a local strip, since a genuine boundary line has to be composed, not deleted' )

		}

		return { text: repaired.trim(), applied, instructions }

	}

}
