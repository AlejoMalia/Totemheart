/**
 * Sarcasm is the collision between literal wording and its context — "GREAT,
 * love that" right after something bad just happened. Honest reframing of
 * the original proposal: there's no "ground truth of the real situation"
 * available to compare against — the real signal this can actually use is
 * recent conversational context, specifically the average valence of this
 * user's last few episodic memories (a real, already-stored history, not an
 * invented oracle). Derr = |semanticValence - contextValence| * visualProsodyIntensity;
 * past a threshold, flags sarcasm and inverts the semantic valence sign
 * before it reaches Appraisal. Own design, no citation.
 *
 * Real bug found running a full personality-mock battery: raw distance alone
 * fires on genuine enthusiasm right after a merely-neutral prior turn (0.89
 * vs. 0.04 is a big gap, but 0.04 isn't a negative context — there's nothing
 * to be incongruent WITH). Fixed by requiring an actual sign mismatch with a
 * context that's meaningfully non-neutral first — sarcasm is words
 * contradicting a real opposite-valence context, not just any wide gap.
 */
export class SarcasmDetector {

	detect( semanticValence, contextValence, prosodyIntensity, threshold = 0.9 ) {

		const incongruent = Math.abs( contextValence ) > 0.2 && Math.sign( semanticValence ) !== Math.sign( contextValence )
		if ( !incongruent ) return { sarcastic: false, derr: 0, adjustedValence: semanticValence }

		const disagreement = Math.abs( semanticValence - contextValence )
		const derr                = disagreement * Math.max( 1, prosodyIntensity )
		const sarcastic           = derr > threshold

		return {
			sarcastic,
			derr,
			adjustedValence : sarcastic ? -semanticValence : semanticValence,
		}

	}

}
