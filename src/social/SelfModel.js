function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Emergent self-awareness: instead of batch-analyzing history every N turns,
 * each pattern's confidence is nudged toward 1 every time it's observed and
 * decays slowly otherwise (an EMA, computed incrementally — no scheduled
 * "reflection" step needed). "soy defensivo con crítica" becomes something
 * the system can report on because it actually tracked it, not because an
 * LLM was asked to guess. Pure engineering — no citation, see CALIBRATION.md.
 */
export class SelfModel {

	constructor() {

		this.patterns = new Map()

	}

	reinforce( name, amount = 0.15 ) {

		const current = this.patterns.get( name ) ?? 0
		this.patterns.set( name, clamp01( current + amount * ( 1 - current ) ) )

	}

	decay( dt, lambda = 0.01 ) {

		for ( const [ name, value ] of this.patterns ) this.patterns.set( name, Math.max( 0, value - lambda * dt ) )

	}

	get( name ) {

		return this.patterns.get( name ) ?? 0

	}

	getDominant( threshold = 0.6 ) {

		return [ ...this.patterns.entries() ]
			.filter( ( [ , v ] ) => v >= threshold )
			.sort( ( a, b ) => b[ 1 ] - a[ 1 ] )

	}

}
