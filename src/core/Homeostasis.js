function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

const BASE_DECAY = {
	stamina      : 0.01,
	socialization : 0.008,
	curiosity     : 0.006,
}

/**
 * Real PID controller per need: error = target(1, "fully satisfied") − current
 * level. Proportional term reacts to how deprived the need is right now,
 * Integral accumulates how long it's been neglected (a need that's been low
 * for a while generates more urgency than one that just dipped), Derivative
 * dampens the output if the need is already recovering fast (being satisfied
 * quickly right now), so urgency doesn't overshoot right as it's being fixed.
 * Gains (Kp/Ki/Kd) are engineering defaults, not tuned against any reference
 * controller — see CALIBRATION.md.
 */
class PID {

	constructor( { kp = 1, ki = 0.05, kd = 0.3, outputLimit = 1 } = {} ) {

		this.kp = kp
		this.ki = ki
		this.kd = kd
		this.outputLimit = outputLimit // saturation bound for anti-windup
		this.integral      = 0
		this.prevError    = 0

	}

	/**
	 * Standard anti-windup by clamping: a plain PID's integral term keeps
	 * accumulating while the output is saturated, so once the error finally
	 * starts improving the controller keeps overreacting for a while purely
	 * because of that stale accumulated integral — the real cause of the
	 * "won't come back down" symptom in a saturating PID. Fix: freeze the
	 * integral (don't add this step's contribution) whenever the raw output
	 * would already be past ±outputLimit, exactly the standard back-calculation-
	 * free clamping technique from control theory, not a citation of a
	 * specific paper.
	 */
	step( current, target, dt ) {

		const error       = target - current
		const derivative = dt > 0 ? ( error - this.prevError ) / dt : 0
		this.prevError   = error

		const unclampedIntegral = this.integral + error * dt
		const provisionalOutput   = this.kp * error + this.ki * unclampedIntegral + this.kd * derivative
		const saturated                = Math.abs( provisionalOutput ) >= this.outputLimit

		this.integral = saturated ? this.integral : unclampedIntegral

		const output = this.kp * error + this.ki * this.integral + this.kd * derivative
		return Math.max( -this.outputLimit, Math.min( this.outputLimit, output ) )

	}

}

/**
 * Needs that decay over ticks (a clock, not wall time — the host decides the
 * cadence). Each need's PID controller produces a graded "urgency" (drive
 * intensity), not just a binary below/above-threshold alert.
 */
export class Homeostasis {

	constructor( { alertThreshold = 0.2 } = {} ) {

		this.needs          = { stamina: 1, socialization: 1, curiosity: 1 }
		this.alertThreshold = alertThreshold
		this.controllers      = { stamina: new PID(), socialization: new PID(), curiosity: new PID() }

	}

	tick( dt, personality ) {

		this.needs.stamina      = clamp01( this.needs.stamina - BASE_DECAY.stamina * dt )
		this.needs.socialization = clamp01( this.needs.socialization - personality.getSocialDecayRate() * dt )
		this.needs.curiosity     = clamp01( this.needs.curiosity - BASE_DECAY.curiosity * dt )

		for ( const need of Object.keys( this.needs ) ) this.controllers[ need ].step( this.needs[ need ], 1, dt )

	}

	satisfy( need, amount ) {

		if ( !( need in this.needs ) ) return
		this.needs[ need ] = clamp01( this.needs[ need ] + amount )

	}

	/** PID-driven urgency for a need — how insistently it should be "felt" right now. */
	getUrgency( need ) {

		return this.controllers[ need ] ? Math.max( 0, this.controllers[ need ].prevError * this.controllers[ need ].kp + this.controllers[ need ].integral * this.controllers[ need ].ki ) : 0

	}

	getAlerts() {

		return Object.entries( this.needs )
			.filter( ( [ , value ] ) => value < this.alertThreshold )
			.map( ( [ need, value ] ) => ( { need, value, urgency: this.getUrgency( need ) } ) )

	}

	getState() {

		return { ...this.needs }

	}

}
