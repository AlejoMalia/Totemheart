function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

/**
 * Real dual-process arbitration between a fast, associative read and a
 * slower, deliberative one — Kahneman, D. (2011), "Thinking, Fast and
 * Slow", Farrar, Straus and Giroux (the popular-but-accurate synthesis of
 * decades of dual-process research: Evans, J. St. B. T., & Stanovich, K. E.
 * (2013), "Dual-process theories of higher cognition: Advances and current
 * controversies", Perspectives on Psychological Science, 8(3), 223-241, for
 * the more rigorous academic framing this module's shape follows). Not a
 * claim of two literal separate reasoning engines running inside
 * Totemheart — one real logistic blend weight over signals Totemheart
 * already computes elsewhere (stakes, conflict, time pressure, depletion,
 * arousal), read OUT as a mode label the rest of the pipeline can act on
 * (how much elaboration/latency this turn's output should carry).
 *
 *   P(S2) = σ(w_s·Stakes + w_c·Conflict + w_t·TimeAvailable
 *             - w_d·Depletion - w_a·Arousal - w_k·Cortisol)
 */
export class DualProcessController {

	constructor( { weights = {} } = {} ) {

		this.weights = {
			stakes    : weights.stakes    ?? 1.4,
			conflict  : weights.conflict  ?? 1.2,
			time      : weights.time      ?? 0.6,
			depletion : weights.depletion ?? 1.0,
			arousal   : weights.arousal   ?? 0.9,
			cortisol  : weights.cortisol  ?? 0.7,
			bias      : weights.bias      ?? -0.8, // real resting bias toward S1 — deliberation is the exception, not the default
		}

	}

	/**
	 * Every input 0..1. `stakes` — how much this decision matters.
	 * `conflict` — real signal-disagreement magnitude (e.g. AppraisalAgreement's
	 * variance). `timeAvailable` — inverse of urgency. `depletion`/`arousal`/
	 * `cortisol` — read straight from EgoDepletionBudget/EmotionSpace/CortisolEngine.
	 */
	compute( { stakes = 0, conflict = 0, timeAvailable = 0.5, depletion = 0, arousal = 0, cortisol = 0 } = {} ) {

		const w = this.weights
		const z = w.bias
			+ w.stakes * clamp01( stakes )
			+ w.conflict * clamp01( conflict )
			+ w.time * clamp01( timeAvailable )
			- w.depletion * clamp01( depletion )
			- w.arousal * clamp01( arousal )
			- w.cortisol * clamp01( cortisol )

		const pS2       = sigmoid( z )
		const mode        = pS2 >= 0.5 ? 'S2' : 'S1'

		return {
			mode,
			pS2,
			latencyBias    : pS2,      // real, bounded proxy for "should this take longer to answer"
			elaborationBias : pS2,     // same signal reused as a real elaboration-level driver for output shaping
		}

	}

}
