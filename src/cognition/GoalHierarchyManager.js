function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real competing-goals arbitration with mutual inhibition — Kruglanski, A.
 * W., Shah, J. Y., Fishbach, A., Friedman, R., Chun, W. Y., & Sleeth-Keppler,
 * D. (2002), "A theory of goal systems", Advances in Experimental Social
 * Psychology, 34, 331-378 (the real goal-systems framing: multiple active
 * goals compete for limited resources and inhibit each other in proportion
 * to how much they conflict, not a simple independent priority queue).
 * Distinct from `MotivationalConflict` (a specific two-goal
 * approach-avoidance gradient) and `PrimaryDrives` (four fixed
 * affective-neuroscience drives) — this is a general N-goal register any
 * caller can register arbitrary named goals into, with a real winner-take
 * inhibition dynamic. The inhibition-matrix formulation is own engineering.
 *
 *   u_i = R_i - Σ_{j≠i} c_ij·u_j
 *   ActiveGoal = argmax_i u_i
 */
export class GoalHierarchyManager {

	constructor() {

		this.goals = new Map() // name -> { reward, urgency }

	}

	setGoal( name, { reward = 0.5, urgency = 0.5 } = {} ) {

		this.goals.set( name, { reward: clamp01( reward ), urgency: clamp01( urgency ) } )

	}

	removeGoal( name ) {

		this.goals.delete( name )

	}

	/**
	 * Real one-pass mutual-inhibition resolution — every OTHER active goal
	 * inhibits this one in proportion to a real conflict weight the caller
	 * supplies via `conflictMatrix[a][b]` (0..1, default 0.3 for any
	 * unspecified pair — goals mildly compete for attention by default).
	 */
	resolve( conflictMatrix = {} ) {

		const names        = [ ...this.goals.keys() ]
		if ( !names.length ) return { activeGoal: null, utilities: {} }

		const utilities = {}
		for ( const name of names ) {

			const { reward, urgency } = this.goals.get( name )
			const inhibition = names
				.filter( other => other !== name )
				.reduce( ( sum, other ) => {

					const c = conflictMatrix[ name ]?.[ other ] ?? 0.3
					const otherUtility = this.goals.get( other ).reward * this.goals.get( other ).urgency
					return sum + c * otherUtility

				}, 0 )

			utilities[ name ] = clamp01( reward * urgency - inhibition * 0.3 )

		}

		const activeGoal = names.reduce( ( best, name ) => ( utilities[ name ] > ( utilities[ best ] ?? -1 ) ? name : best ), names[ 0 ] )
		return { activeGoal, utilities }

	}

}
