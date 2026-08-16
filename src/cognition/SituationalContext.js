const URGENCY_WORDS = [ 'ahora', 'ya', 'urgente', 'rápido', 'deprisa', 'inmediatamente', 'now', 'urgent', 'hurry', 'immediately', 'asap' ]

function tokenize( text ) {

	return ( text || '' ).toLowerCase().match( /[\p{L}']+/gu ) || []

}

function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Reads situational signals out of the raw message itself — is the user
 * stressed, in a hurry, upbeat — independent of what the appraisal/ontology
 * concludes about desirability. Used to amplify threat-sensitivity: a
 * message read as mildly critical lands harder if the user also seems to be
 * in crisis. This is engineering informed by a general Gestalt-style
 * observation (meaning is read in context, not word-by-word in isolation),
 * not a citation of any specific formula — see CALIBRATION.md.
 */
export class SituationalContext {

	extract( text, sentimentScore = 0 ) {

		const tokens        = tokenize( text )
		const exclaimCount    = ( ( text || '' ).match( /[!¡]/g ) || [] ).length
		const urgencyHits       = tokens.filter( t => URGENCY_WORDS.includes( t ) ).length
		const capsRatio          = ( ( text || '' ).match( /[A-ZÁÉÍÓÚÑ]{3,}/g ) || [] ).length

		const urgency = clamp01( urgencyHits * 0.3 + exclaimCount * 0.15 + capsRatio * 0.2 )
		const stress    = clamp01( Math.max( 0, -sentimentScore ) * 0.7 + urgency * 0.3 )
		const joy         = clamp01( Math.max( 0, sentimentScore ) )

		return { stress, urgency, joy }

	}

	/** Multiplier applied to threat-sensitive appraisal fields (arousal, moralWeight). */
	getThreatMultiplier( context ) {

		return 1 + context.stress * 0.3

	}

}
