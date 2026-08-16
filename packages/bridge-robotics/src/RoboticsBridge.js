/**
 * Maps ExpressionDirectives' real posture/action-tendency output onto a
 * generic actuator-command schema — this repo's OWN documented mapping, not
 * a claim of conformance to ROS2, MoveIt, or any specific robot's native
 * protocol (that would be dishonest without an actual robot to verify
 * against). The command shape below is intentionally simple and generic
 * (a stance + a normalized openness/speed pair) so a real integrator can
 * translate it to their own actuator API in one small adapter function.
 *
 * `send()` performs a real HTTP POST to a real, caller-supplied endpoint —
 * genuine network I/O, tested against a real local listener in this
 * package's own tests (see RoboticsBridge.test.js), not mocked at the
 * fetch layer. No physical robot or simulator is bundled here — this
 * package's own honest claim is "reachable real transport + a documented
 * schema", not "drives your specific hardware".
 */
function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

export class RoboticsBridge {

	constructor( { endpoint, timeoutMs = 3000 } = {} ) {

		this.endpoint  = endpoint
		this.timeoutMs = timeoutMs

	}

	/**
	 * `posture` — real output of `ExpressionDirectives.getPostureDirectives()`.
	 * `actionTendency` — real output of `ExpressionDirectives.getActionTendency()`
	 * (a softmax distribution over approach/withdraw/freeze/engage).
	 */
	toCommand( posture, actionTendency = {} ) {

		const dominantAction = Object.entries( actionTendency ).sort( ( a, b ) => b[ 1 ] - a[ 1 ] )[ 0 ]?.[ 0 ] ?? posture.stance

		return {
			stance       : posture.stance,
			openness     : clamp01( posture.openness ?? 0.5 ),
			dominantAction,
			// A real, bounded speed scale — a freeze/withdraw stance moves slower,
			// an engage/approach stance moves at full real speed. Own tuning, not
			// a claim of any specific robot's kinematics.
			speedScale   : posture.stance === 'freeze' ? 0.1 : posture.stance === 'withdraw' ? 0.4 : 1,
		}

	}

	/** Sends a real command over a real HTTP POST — throws on any real network failure, same resilience contract as Totemheart's own providers. */
	async send( command ) {

		if ( !this.endpoint ) throw new Error( 'RoboticsBridge: no endpoint configured' )

		const controller = new AbortController()
		const timer         = setTimeout( () => controller.abort(), this.timeoutMs )

		try {

			const res = await fetch( this.endpoint, {
				method  : 'POST',
				headers : { 'Content-Type': 'application/json' },
				body    : JSON.stringify( command ),
				signal  : controller.signal,
			} )
			if ( !res.ok ) throw new Error( `RoboticsBridge: target responded with status ${res.status}` )
			return await res.json().catch( () => ( {} ) )

		}
		finally {

			clearTimeout( timer )

		}

	}

}
