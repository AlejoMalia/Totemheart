/**
 * Real Hebbian update (Hebb, 1949 — "neurons that fire together wire
 * together", the classic shape, not a citation of any specific numeric
 * result): W(t+1) = W(t) + η(Mi·Mj) − γW(t), applied to co-activation of
 * this project's own mechanism trigger flags instead of biological neurons.
 * If SarcasmDetector and DefenseMechanisms keep firing on the same turns
 * across a conversation, their association weight grows; if the
 * conversation moves on and they stop co-firing, γ decays it back down —
 * own tuning of η/γ, not a reproduction of a published parameter set.
 */
export class HebbianPlasticity {

	constructor( { eta = 0.1, gamma = 0.02 } = {} ) {

		this.eta      = eta
		this.gamma  = gamma
		this.weights = new Map() // "a|b" (sorted pair key) -> association weight

	}

	#key( a, b ) {

		return [ a, b ].sort().join( '|' )

	}

	/** `active` — array of mechanism names that fired (trigger==1) this turn. */
	update( active ) {

		for ( const [ key, w ] of this.weights ) this.weights.set( key, Math.max( 0, w - this.gamma * w ) )

		for ( let i = 0; i < active.length; i++ ) {

			for ( let j = i + 1; j < active.length; j++ ) {

				const key   = this.#key( active[ i ], active[ j ] )
				const prior = this.weights.get( key ) ?? 0
				this.weights.set( key, prior + this.eta * ( 1 - prior ) ) // co-activation term Mi·Mj = 1·1 here, bounded toward 1

			}

		}

	}

	/** Extra decay pass with no co-activation term — REM's "synaptic pruning" of associations that went stale during a long silence. */
	decayOnly( extraGamma ) {

		for ( const [ key, w ] of this.weights ) this.weights.set( key, Math.max( 0, w - extraGamma * w ) )

	}

	getAssociation( a, b ) {

		return this.weights.get( this.#key( a, b ) ) ?? 0

	}

}
