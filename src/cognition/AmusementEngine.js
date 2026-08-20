function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

/**
 * Real amusement (finding something genuinely funny), distinct from
 * `SarcasmDetector` (which reads sarcasm FROM others, produces no felt
 * emotion of its own) and from `DefenseMechanisms`'s "humor" entry (a
 * COPING STRATEGY CHOICE, Vaillant 1977 — a probability of responding
 * with humor, not the emotion of finding something funny in the first
 * place) — Suls, J. M. (1972), "A two-stage model for the appreciation
 * of jokes and cartoons: Information-processing analysis", in Goldstein
 * & McGhee (eds.), The Psychology of Humor (the real, well-established
 * incongruity-resolution account: humor requires BOTH a genuine
 * incongruity AND its successful resolution — an unresolved incongruity
 * just reads as confusing, not funny); McGraw, A. P. & Warren, C. (2010),
 * "Benign violations: Making immoral behavior funny", Psychological
 * Science, 21(8), 1141-1149 (the real, well-cited finding that a genuine
 * norm violation is ALSO required to be appraised as safe/non-threatening
 * — the same violation reads as funny or as offensive/threatening
 * depending on real perceived benignity, not on the violation's content
 * alone).
 *
 *   amusement = incongruity · resolution · benignity  (requires ALL THREE, own engineering of the specific product form)
 */
export class AmusementEngine {

	constructor( { repetitionDecay = 0.35 } = {} ) {

		this.repetitionDecay = repetitionDecay
		this.recentBits           = new Map() // bitFingerprint -> real exposure count, for real habituation to a repeated joke

	}

	/**
	 * `incongruity` (0..1, real unexpectedness/norm-violation magnitude —
	 * e.g. from `NoveltyDetector`/appraisal surprise), `resolution` (0..1,
	 * real understanding of WHY it's incongruous — an incongruity that
	 * stays confusing scores low here), `benignity` (0..1, real perceived
	 * safety of the violation — high threat/high stakes collapses this).
	 */
	computeAmusement( incongruity, resolution, benignity, bitFingerprint = null ) {

		let amusement = clamp01( incongruity ) * clamp01( resolution ) * clamp01( benignity )

		if ( bitFingerprint ) {

			const exposures = this.recentBits.get( bitFingerprint ) ?? 0
			amusement          = amusement * Math.pow( 1 - this.repetitionDecay, exposures ) // real habituation — the same joke lands softer each real repeat
			this.recentBits.set( bitFingerprint, exposures + 1 )

		}

		return clamp01( amusement )

	}

	/** Real, bounded decay of the repetition-habituation ledger — a joke not heard in a while can land fresh again. */
	decay( dt = 1, lambda = 0.1 ) {

		for ( const [ key, count ] of this.recentBits ) {

			const decayed = count * Math.pow( 1 - lambda, dt )
			if ( decayed < 0.05 ) this.recentBits.delete( key )
			else this.recentBits.set( key, decayed )

		}

	}

}
