/**
 * Text has no volume, but capitalization and punctuation density function
 * as a real proxy for it — shouting "HOLA" isn't semantically different
 * from "hola" (same word), but it's a real, measurable spike in typographic
 * energy. Scanned directly on the raw input string, before any lexicon or
 * LLM parsing touches it. Own design, no citation: this is a plain ratio +
 * saturating exponential, not a reproduction of any named prosody model.
 */
function countLetters( text ) {

	return ( text.match( /\p{L}/gu ) || [] ).length

}

function countUppercaseLetters( text ) {

	return ( text.match( /\p{Lu}/gu ) || [] ).length

}

function countExtremePunctuation( text ) {

	return ( text.match( /[!?¡¿]/gu ) || [] ).length

}

export class VisualProsody {

	/**
	 * Returns { capsRatio, punctuationDensity, intensity } — intensity is
	 * capsRatio + (1 - e^(-k·punctCount)), unbounded above ~2 but in
	 * practice rarely exceeds ~1.5 for real text.
	 */
	analyze( text, k = 0.4 ) {

		const letters    = countLetters( text )
		const uppercase = countUppercaseLetters( text )
		const punctCount  = countExtremePunctuation( text )

		const capsRatio           = letters > 0 ? uppercase / letters : 0
		const punctuationDensity = 1 - Math.exp( -k * punctCount )
		const intensity                = capsRatio + punctuationDensity

		return { capsRatio, punctuationDensity, intensity }

	}

}
