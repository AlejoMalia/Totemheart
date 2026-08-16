function weightedPick( weights ) {

	const entries = Object.entries( weights )
	const roll     = Math.random() * entries.reduce( ( sum, [ , w ] ) => sum + w, 0 )
	let acc        = 0
	for ( const [ name, w ] of entries ) {

		acc += w
		if ( roll <= acc ) return name

	}
	return entries[ 0 ][ 0 ]

}

/**
 * Fires when cognitive stress crosses a critical threshold. Returns a
 * behaviorDirective the text generator / linguistic modulation layer must
 * act on: evasion (change subject), projection (blame the user), sarcasm.
 */
export class DefenseMechanisms {

	check( stress, personality, threshold = 0.6 ) {

		if ( stress < threshold ) return { active: false }

		const mechanism = weightedPick( personality.getDefenseWeights() )
		return { active: true, mechanism, stress }

	}

}
