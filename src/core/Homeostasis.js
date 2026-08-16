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
		// Allostatic load (McEwen, B. S., & Stellar, E. (1993), "Stress and the
		// individual: mechanisms leading to disease", Arch Intern Med, 153(18)):
		// the cumulative "wear" of repeatedly falling short of what the regulatory
		// set point demands. Real accumulator here, distinct from CortisolEngine's
		// acute level — it only rises while a need actually sits below its dynamic
		// target and decays slowly otherwise, so it tracks CHRONIC deprivation, not
		// a single bad tick. The specific accumulation/decay rates are own tuning,
		// not measured allostatic-load coefficients. See CALIBRATION.md.
		this.allostaticLoad = 0

	}

	/**
	 * The regulatory set point itself drifts under sustained load — the real
	 * allostatic-load idea (McEwen & Stellar 1993): a chronically stressed or
	 * circadian-depleted system doesn't just fail to reach "fully satisfied",
	 * its own definition of "satisfied" contracts. `personality` shifts the
	 * baseline (higher neuroticism tolerates less deprivation before the target
	 * itself starts slipping); `circadianEnergy` and `cortisol` (both 0..1,
	 * optional) pull it down further. Own tuning of the specific coefficients,
	 * not a reproduction of any measured set-point-shift curve.
	 */
	getDynamicTarget( need, { personality = null, circadianEnergy = 1, cortisol = 0 } = {} ) {

		const neuroticism  = typeof personality?.get === 'function' ? personality.get( 'neuroticism' ) : 0.5
		const circadianDrag = ( 1 - circadianEnergy ) * 0.15
		const cortisolDrag   = cortisol * 0.2
		const loadDrag        = this.allostaticLoad * 0.15
		const neuroticismDrag = neuroticism * 0.05

		return clamp01( 1 - circadianDrag - cortisolDrag - loadDrag - neuroticismDrag )

	}

	tick( dt, personality, { circadianEnergy = 1, cortisol = 0 } = {} ) {

		this.needs.stamina      = clamp01( this.needs.stamina - BASE_DECAY.stamina * dt )
		this.needs.socialization = clamp01( this.needs.socialization - personality.getSocialDecayRate() * dt )
		this.needs.curiosity     = clamp01( this.needs.curiosity - BASE_DECAY.curiosity * dt )

		for ( const need of Object.keys( this.needs ) ) {

			const target = this.getDynamicTarget( need, { personality, circadianEnergy, cortisol } )
			this.controllers[ need ].step( this.needs[ need ], target, dt )

		}

		// Load accumulation is driven by two INDEPENDENT real signals, not the
		// self-lowering dynamic target from above (checking deprivation against
		// a target that itself drops under stress would perversely make chronic
		// stress look "more satisfied" and accumulate LESS load — the opposite
		// of the real allostatic-load direction). Deprivation is checked against
		// a fixed, undrifted reference instead; the chronic-stress drag
		// (circadian + cortisol, the same terms getDynamicTarget uses) directly
		// scales how fast load builds once there IS real deprivation.
		const deprived = Object.values( this.needs ).some( v => v < 0.85 )
		const drag       = ( 1 - circadianEnergy ) * 0.15 + cortisol * 0.2

		this.allostaticLoad = ( deprived || drag > 0.1 )
			? clamp01( this.allostaticLoad + ( 0.01 + drag * 0.03 ) * dt )
			: Math.max( 0, this.allostaticLoad - 0.02 * dt )

	}

	/**
	 * Chronic-stress reactivity: real allostatic load makes a system MORE
	 * reactive to negative stimuli, not less — the well-documented "wear and
	 * tear" direction from the allostatic-load literature (McEwen & Stellar
	 * 1993; McEwen, B. S. (1998), "Protective and damaging effects of stress
	 * mediators", NEJM, 338(3)). Returns a multiplier >=1 a caller applies to
	 * a negative-appraisal spike; the specific 0.4 ceiling is own tuning.
	 */
	getReactivityMultiplier() {

		return 1 + this.allostaticLoad * 0.4

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
