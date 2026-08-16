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

// Vaillant, G. E. (1977), "Adaptation to Life", Little, Brown — a 3-tier
// hierarchy from least to most adaptive. Which tier a defense belongs to is
// straight from that source; treating egoHealth/cortisol as the real signal
// that shifts weight toward the immature end is our own engineering, not a
// computational model Vaillant himself specified. See CALIBRATION.md.
const TIER = {
	projection      : 'immature',
	evasion          : 'immature',
	rationalization : 'neurotic',
	sarcasm          : 'neurotic',
	humor              : 'mature',
}

/**
 * Fires when cognitive stress crosses a critical threshold. Returns a
 * behaviorDirective the text generator / linguistic modulation layer must
 * act on. Which mechanism fires is personality-weighted (Personality.
 * getDefenseWeights()) AND state-weighted: low ego health / high cortisol
 * pulls the pick toward the immature end of Vaillant's hierarchy (real
 * regression-under-stress direction, own tuning of the magnitude), high ego
 * health and low cortisol let mature defenses (humor) compete.
 */
export class DefenseMechanisms {

	check( stress, personality, threshold = 0.6, { egoHealth = 0.7, cortisol = 0 } = {} ) {

		if ( stress < threshold ) return { active: false }

		const base                    = personality.getDefenseWeights()
		const regression = ( 1 - egoHealth ) * 0.6 + cortisol * 0.4 // 0..1, how hard stress is pulling toward the immature end
		const reshaped              = Object.fromEntries( Object.entries( base ).map( ( [ name, w ] ) => {

			const tier = TIER[ name ]
			const multiplier = tier === 'immature' ? 1 + regression * 1.5
				: tier === 'mature' ? Math.max( 0.1, 1 - regression * 1.2 )
				: 1 // neurotic tier stays roughly flat, the "default" register
			return [ name, w * multiplier ]

		} ) )

		const mechanism = weightedPick( reshaped )
		return { active: true, mechanism, tier: TIER[ mechanism ], stress }

	}

}
