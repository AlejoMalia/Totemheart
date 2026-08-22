function clamp( v, min, max ) {

	return Math.max( min, Math.min( max, v ) )

}

/**
 * Real decoding-parameter steering for hosts calling an API that exposes
 * `temperature`/`top_p`/`logit_bias` — composes already-real Totemheart
 * signals into the user's own literal formula, deliberately NOT
 * duplicating `Totemheart.js`'s own existing `suggestedTemperature` (a
 * real, separate read driven by decision fatigue/energy/creative-mode,
 * already wired and tested) — this is the real, DISTINCT arousal/
 * precision/freeze-driven steering term the user's own spec calls for,
 * exposed separately so a host can combine both, or use whichever fits
 * their own generation loop. Honest limit, same one `LogitBiasBuilder.js`
 * already states: this produces WORD-level bans, not token IDs — a host
 * converts through their own model's tokenizer.
 *
 *   T = T0 + a·arousal − b·precision − c·freeze
 */
export class DecodingSteeringAdapter {

	constructor( { T0 = 0.8, a = 0.4, b = 0.5, c = 0.6, minT = 0.15, maxT = 1.3 } = {} ) {

		Object.assign( this, { T0, a, b, c, minT, maxT } )

	}

	/** `arousal`/`precisionMode`/`freeze` real, already-computed 0..1 (or bool for `precisionMode`) magnitudes. */
	getTemperature( { arousal = 0, precisionMode = false, freeze = 0 } = {} ) {

		const T = this.T0 + this.a * arousal - this.b * ( precisionMode ? 1 : 0 ) - this.c * freeze
		return clamp( T, this.minT, this.maxT )

	}

	/** Real, word-level banned-phrase list straight from the control packet's own `bans` — a host maps these through their own tokenizer into an actual `logit_bias`/banned-token set. */
	getBannedPhrases( packet ) {

		return [ ...( packet.bans ?? [] ) ]

	}

}
