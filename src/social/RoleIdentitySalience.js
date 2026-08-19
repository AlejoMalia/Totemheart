function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

/**
 * Real role-based identity activation — Stryker, S. (1980), "Symbolic
 * Interactionism: A Social Structural Version." Benjamin/Cummings; Stryker,
 * S. & Burke, P. J. (2000), "The past, present, and future of an identity
 * theory." Social Psychology Quarterly, 63(4), 284-297 (identity-theory's
 * real, well-established claim that a person holds multiple role-identities
 * — friend, expert, caregiver — with real, situationally-cued differential
 * SALIENCE, and that whichever role is salient shapes behavior/tone
 * distinctly). Distinct from `SelfModel` (a single dominant-narrative read)
 * and `NarrativeSelfEngine` (autobiographical chapter coherence) — this is
 * about which of several concurrently-held roles is active THIS turn.
 *
 *   Salience_r = σ(ContextCue_r + Commitment_r)
 */
export class RoleIdentitySalience {

	constructor() {

		this.commitments = new Map() // role -> real 0..1 commitment strength

	}

	setCommitment( role, strength ) {

		this.commitments.set( role, clamp01( strength ) )

	}

	getCommitment( role ) {

		return this.commitments.get( role ) ?? 0

	}

	/** `contextCues` — real `{ role: cue0to1 }` map the caller builds from this turn's actual signals. */
	resolve( contextCues = {} ) {

		const salience = {}
		let dominant       = null
		let maxSalience       = 0

		for ( const role of new Set( [ ...this.commitments.keys(), ...Object.keys( contextCues ) ] ) ) {

			const s        = sigmoid( 3 * ( ( contextCues[ role ] ?? 0 ) + this.getCommitment( role ) - 0.6 ) )
			salience[ role ] = s
			if ( s > maxSalience ) { maxSalience = s; dominant = role }

		}

		return { dominant, salience }

	}

}
