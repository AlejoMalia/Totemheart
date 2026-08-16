import { classify } from './EmotionSpace.js'

/**
 * Rolling average of recent microemotions. A single "irá" spike is a
 * microemotion; being irritable for the next several turns is the mood
 * this module produces from a run of similar spikes.
 */
export class MoodTracker {

	constructor( { windowSize = 10 } = {} ) {

		this.windowSize = windowSize
		this.window     = []

	}

	/**
	 * Defaults missing fields to 0, same convention EmotionSpace.applySpike already
	 * uses — a spike object that only sets `arousal` (e.g. a startle with no valence
	 * opinion) must not silently poison every future mood average with NaN via
	 * `undefined + number`. Real bug found running the full demo pipeline after this
	 * round's new spikes; fixed at the source instead of patching every call site.
	 */
	push( spike ) {

		this.window.push( { valence: spike.valence ?? 0, arousal: spike.arousal ?? 0 } )
		if ( this.window.length > this.windowSize ) this.window.shift()

	}

	getMood() {

		if ( !this.window.length ) return { valence: 0, arousal: 0 }
		const sum = this.window.reduce( ( acc, e ) => ( {
			valence : acc.valence + e.valence,
			arousal : acc.arousal + e.arousal,
		} ), { valence: 0, arousal: 0 } )

		return {
			valence : sum.valence / this.window.length,
			arousal : sum.arousal / this.window.length,
		}

	}

	getMoodLabel( neuroticism = 0 ) {

		const blend = classify( this.getMood(), 1, neuroticism )
		return Object.keys( blend )[ 0 ]

	}

}
