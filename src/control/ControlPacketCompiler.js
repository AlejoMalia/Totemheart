function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function softmax( scores ) {

	const max   = Math.max( ...scores )
	const exps = scores.map( s => Math.exp( s - max ) )
	const sum   = exps.reduce( ( a, b ) => a + b, 0 )
	return exps.map( e => e / sum )

}

/**
 * Real, machine-readable compilation of already-real Totemheart state into
 * one structured packet, instead of only prose (`systemPrompt` already
 * exists and stays useful for a text-only host; this is the SAME
 * underlying state, restructured for a host that wants to branch on real
 * fields programmatically — JSON-mode prompting, a constrained-decoding
 * schema, or simple `if` logic in a host's own generation loop). Compiles,
 * does not invent: every field here is read from an already-real, already-
 * computed Totemheart engine, not a new appraisal.
 *
 *   Priority = softmax(w ⊙ |s|)   — threat/freeze/boundary outrank play/flirt
 *   when directives conflict, the higher-priority one's bans/musts win.
 */
export class ControlPacketCompiler {

	constructor( { priorityWeights = { threat: 2.5, freeze: 2.2, boundary: 1.8, cooling: 1.4, play: 0.8, flirt: 0.6 } } = {} ) {

		this.priorityWeights = priorityWeights

	}

	/**
	 * All fields real, already-computed per-turn Totemheart reads — a flat
	 * parameter shape (rather than digging paths out of the full `debug`
	 * object) so a caller can compile a packet from whichever real local
	 * values are already in scope at their own call site, without needing
	 * the entire assembled `debug` object to exist first. Nothing here
	 * computes a NEW appraisal; every field is a real read passed straight
	 * through.
	 */
	compile( { valence = 0, arousal = 0, cooling = 0, trust = 0.5, desire = 0, boredom = 0, threat = 0, freeze = 0, boundaryProbability: boundaryP = 0, play = 0, flirt = 0, audienceFormality = 0.3, prosody = null, actionTendency = null } = {} ) {

		const bans = []
		const must = []

		if ( cooling > 0.6 ) { bans.push( 'unsolicited affection', 'warm closing line' ); must.push( 'acknowledge distance, keep it short' ) }
		if ( boredom > 0.5 ) bans.push( 'long reply', 'unprompted follow-up questions' )
		if ( threat > 0.3 || freeze > 0.3 ) bans.push( 'joke', 'playful tone' )
		if ( boundaryP > 0.7 ) must.push( 'decline clearly, no excessive apology' )
		if ( play > 0.5 && threat < 0.2 ) bans.push( 'moralizing', 'unsolicited advice' )

		const priorityScores = [ threat, freeze, boundaryP, cooling, play, flirt ]
			.map( ( v, i ) => v * Object.values( this.priorityWeights )[ i ] )
		const [ pThreat, pFreeze, pBoundary, pCooling, pPlay, pFlirt ] = softmax( priorityScores )

		return {
			valence, arousal, cooling, trust, desire,
			style : {
				length     : clamp01( 1 - boredom ),
				warmth   : clamp01( ( valence + 1 ) / 2 - cooling * 0.5 ),
				questions : clamp01( 1 - boredom - cooling * 0.3 ),
				formality : audienceFormality,
				play         : clamp01( play * ( 1 - threat ) ),
			},
			bans, must,
			prosody             : prosody,
			actionTendency  : actionTendency,
			childlike           : play,
			boredom               : boredom,
			priority                : { threat: pThreat, freeze: pFreeze, boundary: pBoundary, cooling: pCooling, play: pPlay, flirt: pFlirt },
		}

	}

}
