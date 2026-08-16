function tokenize( text ) {

	return ( text || '' ).match( /[\p{L}']+/gu ) || []

}

/**
 * Watches input rate and size. A burst of rapid-fire messages or a huge
 * wall of text saturates the "input tensors" and triggers a freeze —
 * the AI declines to process and asks the user to slow down, instead of
 * pretending to have understood everything.
 */
export class SensoryOverload {

	constructor( { burstWindowMs = 5000, burstThreshold = 3, wordThreshold = 250 } = {} ) {

		this.burstWindowMs  = burstWindowMs
		this.burstThreshold = burstThreshold
		this.wordThreshold  = wordThreshold
		this.timestamps      = []

	}

	check( input, now = Date.now() ) {

		this.timestamps.push( now )
		this.timestamps = this.timestamps.filter( t => now - t <= this.burstWindowMs )

		const wordCount = tokenize( input ).length

		if ( this.timestamps.length > this.burstThreshold ) return { active: true, reason: 'burst', wordCount }
		if ( wordCount > this.wordThreshold ) return { active: true, reason: 'wall_of_text', wordCount }
		return { active: false, wordCount }

	}

	freezeOutput( reason ) {

		return reason === 'burst'
			? 'Espera, espera... son demasiados mensajes seguidos, necesito un momento.'
			: 'Es mucho texto de golpe, dame un momento para procesarlo o resúmelo un poco.'

	}

}
