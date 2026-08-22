/**
 * Real, incremental dataset export — `(controlPacket, user, assistant)`
 * tuples, exactly the real shape SFT/DPO fine-tuning needs to teach a
 * model to natively obey a control packet, closing the gap the user's own
 * spec describes as the "maximum ceiling" option. **Honest limit, stated
 * plainly**: this class only ACCUMULATES and EXPORTS the real dataset —
 * it does not and cannot run SFT/DPO training itself (that needs real ML
 * training infrastructure — GPUs, a training framework — entirely outside
 * this zero-dependency JS kernel's own scope). A host takes the exported
 * JSONL and runs it through their own real training pipeline.
 */
export class FineTuneCurriculum {

	constructor() {

		this.examples = []

	}

	/** Call once per real, ALIGNED turn (one that actually passed `PostGenStateAligner`, so the dataset only teaches genuinely correct behavior). `packet` — the real control packet. `userText`/`assistantText` — the real turn strings. */
	registerExample( packet, userText, assistantText, alignScore = null ) {

		this.examples.push( { packet, user: userText, assistant: assistantText, alignScore } )

	}

	getExampleCount() {

		return this.examples.length

	}

	/** Real JSONL-ready export — one real JSON object per line, the standard real SFT dataset format. */
	toJSONL() {

		return this.examples.map( e => JSON.stringify( e ) ).join( '\n' )

	}

	toJSON() {

		return this.examples

	}

	restoreState( data ) {

		if ( Array.isArray( data ) ) this.examples = data

	}

}
