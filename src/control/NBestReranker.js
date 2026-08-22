/**
 * Real reranking of already-generated candidates by real alignment score —
 * a host generates K candidates from the SAME real control packet (K real
 * LLM calls, or K samples at one call, outside this library's own scope:
 * Totemheart never calls an LLM itself), this picks the one that actually
 * respects the real state, a cheap, real, well-established technique
 * (best-of-N sampling) rather than trusting the first sample.
 */
export class NBestReranker {

	constructor( aligner ) {

		this.aligner = aligner // a real PostGenStateAligner instance

	}

	/** `candidates` — real array of candidate reply strings. `packet` — the real control packet they were all generated from. Returns the real best candidate plus every real score, sorted best-first. */
	rerank( candidates, packet ) {

		const scored = candidates.map( text => ( { text, ...this.aligner.score( text, packet ) } ) )
		scored.sort( ( a, b ) => b.align - a.align )
		return { best: scored[ 0 ] ?? null, ranked: scored }

	}

}
