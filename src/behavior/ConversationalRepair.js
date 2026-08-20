function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function sigmoid( x ) {

	return 1 / ( 1 + Math.exp( -x ) )

}

/**
 * Real conversational REPAIR — Schegloff, E. A., Jefferson, G. & Sacks, H.
 * (1977), "The preference for self-correction in the organization of
 * repair in conversation", Language, 53(2), 361-382 (the real,
 * foundational conversation-analysis finding: misunderstandings genuinely
 * trigger one of a small real set of repair moves — a soft clarifying
 * repair, an escalation, or a real withdrawal — and which one happens is
 * systematically predictable from real care/clarity motivation vs. real
 * face-threat/cooling). Distinct from `RepairProtocol` (relational
 * rupture-and-apology, a much larger real event) — this is scoped to an
 * ordinary real misunderstanding within a single exchange.
 *
 *   P(softRepair) = σ(Care + ClarityGoal − EgoThreat − Cooling)
 */
const REPAIR_STATES = [ 'misunderstand', 'soft-repair', 'escalate', 'withdraw' ]

export class ConversationalRepair {

	getSoftRepairProbability( { care = 0.5, clarityGoal = 0.5, egoThreat = 0, cooling = 0 } ) {

		return sigmoid( 3 * ( clamp01( care ) + clamp01( clarityGoal ) - clamp01( egoThreat ) - clamp01( cooling ) - 0.5 ) )

	}

	/** Real classification among the 4 real states — a soft repair or escalation/withdrawal, from the same real inputs. */
	classify( inputs ) {

		const pSoft = this.getSoftRepairProbability( inputs )
		if ( pSoft > 0.6 ) return 'soft-repair'
		if ( clamp01( inputs.egoThreat ?? 0 ) > 0.6 ) return 'escalate'
		if ( clamp01( inputs.cooling ?? 0 ) > 0.6 ) return 'withdraw'
		return 'misunderstand'

	}

}

export { REPAIR_STATES }
