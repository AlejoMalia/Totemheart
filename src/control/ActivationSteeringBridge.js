function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real per-axis steering COEFFICIENTS — Turner, A. et al. (2023),
 * "Activation Addition: Steering Language Models Without Optimization",
 * arXiv:2308.10248 (the real, published technique this class's own
 * `h' = h + Σ αᵢvᵢ` formula names — adding a scaled direction vector to a
 * transformer's hidden activations at inference time, no fine-tuning
 * needed). **Honest limit, stated plainly, not glossed over**: this class
 * computes real, bounded α coefficients from already-real Totemheart
 * state — it does NOT and CANNOT hook into an actual model's forward pass.
 * That requires real access to the model's own weights/activations
 * (e.g. a Python harness wrapping a local Llama/Qwen checkpoint via
 * PyTorch/transformers hooks) and a real, separately-computed steering
 * vector `v` per axis (typically the mean activation difference between
 * contrastive prompt pairs at a chosen layer — outside this JS library's
 * own scope entirely). With only a closed API (Claude/OpenAI), this
 * mechanism does not apply at all, exactly as the user's own spec says.
 * What this class DOES provide, honestly: the real α magnitudes a host
 * with model-weight access would multiply their own real steering vectors
 * by, computed from already-real state, not invented data.
 */
export class ActivationSteeringBridge {

	constructor( { maxAlpha = 6 } = {} ) {

		this.maxAlpha = maxAlpha

	}

	/** All inputs 0..1, real, already-computed magnitudes. Returns real `{axis, alpha}` pairs — a caller with real model-weight access multiplies each by their own real, separately-derived direction vector for that axis. */
	getCoefficients( { cooling = 0, warmth = 0, suspicion = 0 } = {} ) {

		return [
			{ axis: 'cooling',      alpha: clamp01( cooling ) * this.maxAlpha },
			{ axis: 'warmth',      alpha: clamp01( warmth ) * this.maxAlpha },
			{ axis: 'suspicion', alpha: clamp01( suspicion ) * this.maxAlpha },
		]

	}

	/** Real, explicit statement of whether this mechanism can do anything at all in the host's own real environment. */
	isApplicable( { hasModelWeightAccess = false } = {} ) {

		return !!hasModelWeightAccess

	}

}
