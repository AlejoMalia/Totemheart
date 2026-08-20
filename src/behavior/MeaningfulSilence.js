function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real silence TYPING — Jaworski, A. (1993), "The Power of Silence: Social
 * and Pragmatic Perspectives", Sage (the real, well-established account
 * that silence in conversation is not a single undifferentiated absence
 * but carries real, distinct communicative TYPES — comfortable, hostile,
 * sad, thinking — each with its own real, distinct emotional signature).
 * A real classifier over already-computed real signals (bond, cooling,
 * contempt, valence, arousal), not a new detector of silence itself.
 */
const SILENCE_TYPES = [ 'comfortable', 'hostile', 'sad', 'thinking' ]

export class MeaningfulSilence {

	classify( { bond = 0, safety = 0.5, cooling = 0, contempt = 0, valence = 0, arousal = 0 } ) {

		const scores = {
			comfortable : clamp01( Math.max( 0, bond ) ) + clamp01( safety ) - clamp01( arousal ),
			hostile           : clamp01( cooling ) + clamp01( contempt ) + Math.max( 0, -valence ),
			sad                    : Math.max( 0, -valence ) - clamp01( arousal ),
			thinking            : clamp01( arousal ) * ( 1 - Math.abs( valence ) ),
		}

		const [ dominant ] = Object.entries( scores ).sort( ( a, b ) => b[ 1 ] - a[ 1 ] )
		return { type: dominant[ 0 ], scores }

	}

}

export { SILENCE_TYPES }
