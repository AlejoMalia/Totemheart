function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function label( v, thresholds = [ 0.35, 0.65 ] ) {

	if ( v < thresholds[ 0 ] ) return 'bajo'
	if ( v < thresholds[ 1 ] ) return 'medio'
	return 'alto'

}

/**
 * Real anti-amnesia digest — the real problem this closes: an LLM's own
 * context window is not where Totemheart's real affective state lives, and
 * a long enough conversation (or a fresh context, a new session, a
 * summarized history) genuinely loses it if a host relies on the model
 * "remembering" bond/trust/cooling from earlier turns. This compiles a
 * real, SHORT, re-injectable digest from already-real, already-persisted
 * state every single turn, regardless of what's actually still in the
 * model's own context — the same discipline `toJSON()`/`restoreState()`
 * already apply to full state, scoped down to what's worth re-stating
 * every turn.
 */
export class StateLockedMemory {

	/** `relation` — real `Attachment.get(userId)`. `bondNet` — real `LoveHateEngine.getNetBond(userId)`. `cooling` — real, 0..1. `activeRituals` — real, array of up to a few real `SharedRelationalCulture` item keys. `constraints` — real, this-turn `bans`/`must` from `ControlPacketCompiler`. */
	compile( { relation = {}, bondNet = 0, cooling = 0, activeRituals = [], constraints = { bans: [], must: [] } } = {} ) {

		const trust  = relation.trust ?? 0.5
		const digest = [
			`vínculo: ${label( clamp01( ( bondNet + 1 ) / 2 ) )} (netBond=${bondNet.toFixed( 2 )})`,
			`confianza: ${label( trust )}`,
			cooling > 0.3 ? `enfriamiento activo: ${label( cooling )}` : null,
			activeRituals.length ? `rituales/temas compartidos: ${activeRituals.slice( 0, 3 ).join( ', ' )}` : null,
			constraints.bans.length ? `evitar este turno: ${constraints.bans.join( '; ' )}` : null,
			constraints.must.length ? `debe cumplir este turno: ${constraints.must.join( '; ' )}` : null,
		].filter( Boolean )

		return { text: digest.join( '\n' ), fields: { trust, bondNet, cooling, activeRituals, constraints } }

	}

}
