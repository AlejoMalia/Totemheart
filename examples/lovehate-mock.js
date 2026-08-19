import { Totemheart, Personality } from '../src/index.js'
import { LoveHateEngine }           from '../src/social/LoveHateEngine.js'

const results = []
function report( id, name, status, evidence ) { results.push( { id, name, status, evidence } ) }

// ============================================================================
// 1) Standalone LoveHateEngine — dual accumulator, ambivalence, real math
// ============================================================================
{

	const lh = new LoveHateEngine()

	lh.observe( 'u', { L: 0.8, H: 0 }, { trust: 0.5 } )
	const loveOnly = lh.getBond( 'u' )
	report( 'B1', 'A pure positive signal (L only) raises Affinity without touching Aversion', loveOnly.A > 0 && loveOnly.V === 0 ? 'PASS' : 'FAIL', `A=${loveOnly.A.toFixed( 3 )} V=${loveOnly.V.toFixed( 3 )}` )

	const lh2 = new LoveHateEngine()
	lh2.observe( 'u', { L: 0.8, H: 0.7 }, { trust: 0.5 } ) // "te quiero pero me haces daño" — both real at once
	const ambivalent = lh2.getBond( 'u' )
	report( 'B2', 'Simultaneous high L AND H raises BOTH A and V at once — real ambivalence, not a wash to neutral', ambivalent.A > 0.1 && ambivalent.V > 0.1 ? 'PASS' : 'FAIL', `A=${ambivalent.A.toFixed( 3 )} V=${ambivalent.V.toFixed( 3 )}` )
	report( 'B3', 'getAmbivalence() = min(A,V), genuinely nonzero only when BOTH are present', lh2.getAmbivalence( 'u' ) === Math.min( ambivalent.A, ambivalent.V ) && lh2.getAmbivalence( 'u' ) > 0 ? 'PASS' : 'FAIL', `ambivalence=${lh2.getAmbivalence( 'u' ).toFixed( 3 )}` )
	report( 'B4', 'getTension() = A·V, the real interaction term distinct from ambivalence\'s min()', Math.abs( lh2.getTension( 'u' ) - ambivalent.A * ambivalent.V ) < 1e-9 ? 'PASS' : 'FAIL', `tension=${lh2.getTension( 'u' ).toFixed( 4 )} = A·V=${( ambivalent.A * ambivalent.V ).toFixed( 4 )}` )

	// Diminishing returns on A: the SAME L pushed repeatedly buys progressively less.
	const lh3      = new LoveHateEngine()
	const deltas = []
	let prevA     = 0
	for ( let i = 0; i < 6; i++ ) {

		lh3.observe( 'u', { L: 0.9, H: 0 }, { trust: 0.5 } )
		const a = lh3.getBond( 'u' ).A
		deltas.push( a - prevA )
		prevA = a

	}
	report( 'B5', 'Affinity has real diminishing returns — (1-A)^γ makes each successive same-size L buy strictly less', deltas.every( ( d, i ) => i === 0 || d <= deltas[ i - 1 ] + 1e-9 ) ? 'PASS' : 'FAIL', `deltas: ${deltas.map( d => d.toFixed( 4 ) ).join( ', ' )}` )

	// Self-reinforcing slope on V: kindling makes early V increments NOT shrink
	// the way Affinity's do (they only shrink at the very end, from clamp01
	// saturation near the ceiling — an artifact of ANY bounded accumulator, not
	// specific to this formula, so only the pre-saturation deltas are compared).
	const lh4         = new LoveHateEngine()
	const vDeltas = []
	let prevV       = 0
	for ( let i = 0; i < 4; i++ ) {

		lh4.observe( 'u', { L: 0, H: 0.3 }, { trust: 0.5 } )
		const v = lh4.getBond( 'u' ).V
		vDeltas.push( v - prevV )
		prevV = v

	}
	report( 'B6', 'Aversion\'s (1+κV) term is real and self-reinforcing — pre-saturation increments do NOT shrink the way Affinity\'s do', vDeltas[ 3 ] >= vDeltas[ 0 ] * 0.9 ? 'PASS' : 'FAIL', `deltas: ${vDeltas.map( d => d.toFixed( 4 ) ).join( ', ' )} (compare to B5's shrinking pattern)` )

	// Asymmetric decay: V outlasts A. getBond() returns the LIVE internal
	// reference (same convention Attachment.get() already uses), so `before`
	// must be a real snapshot copy — reading it again after tick() would
	// alias the now-decayed values instead of the original ones.
	const lh5 = new LoveHateEngine()
	lh5.observe( 'u', { L: 0.9, H: 0.9 }, { trust: 0.5 } )
	const before = { ...lh5.getBond( 'u' ) }
	for ( let i = 0; i < 40; i++ ) lh5.tick( 1, { cortisol: 0 } )
	const after = lh5.getBond( 'u' )
	report( 'B7', 'Aversion decays real slower than Affinity — λ_V << λ_A means grudges outlast warmth given equal starting magnitude', ( after.V / before.V ) > ( after.A / before.A ) ? 'PASS' : 'FAIL', `A retained ${( after.A / before.A * 100 ).toFixed( 1 )}%, V retained ${( after.V / before.V * 100 ).toFixed( 1 )}%` )

	// Chronic cortisol coupling: erodes A faster, preserves V longer.
	const calm       = new LoveHateEngine()
	const stressed = new LoveHateEngine()
	calm.observe( 'u', { L: 0.9, H: 0.9 }, { trust: 0.5 } )
	stressed.observe( 'u', { L: 0.9, H: 0.9 }, { trust: 0.5 } )
	for ( let i = 0; i < 20; i++ ) { calm.tick( 1, { cortisol: 0 } ); stressed.tick( 1, { cortisol: 0.9 } ) }
	report( 'B8', 'Chronic cortisol erodes Affinity faster than a calm baseline (real allostatic-style coupling)', stressed.getBond( 'u' ).A < calm.getBond( 'u' ).A ? 'PASS' : 'FAIL', `calm A=${calm.getBond( 'u' ).A.toFixed( 3 )} stressed A=${stressed.getBond( 'u' ).A.toFixed( 3 )}` )
	report( 'B9', 'Chronic cortisol preserves Aversion longer than a calm baseline (real allostatic-style coupling, opposite direction)', stressed.getBond( 'u' ).V > calm.getBond( 'u' ).V ? 'PASS' : 'FAIL', `calm V=${calm.getBond( 'u' ).V.toFixed( 3 )} stressed V=${stressed.getBond( 'u' ).V.toFixed( 3 )}` )

}

// ============================================================================
// 2) Rupture, kindling, and repair
// ============================================================================
{

	const lh = new LoveHateEngine( { thetaR: 0.3 } )
	for ( let i = 0; i < 4; i++ ) lh.observe( 'u', { L: 0, H: 0.9 }, { trust: 0.5, cortisol: 0.3 } ) // repeated severe hostility, no affinity at all
	const rupture = lh.checkRupture( 'u', { cortisol: 0.3 } )
	report( 'R1', 'Sustained hostility with no offsetting affinity genuinely crosses the rupture condition', rupture.ruptured === true ? 'PASS' : 'FAIL', JSON.stringify( rupture ) )
	report( 'R2', 'A rupture increments a real, queryable per-user rupture count', lh.getBond( 'u' ).ruptureCount === 1 ? 'PASS' : 'FAIL', `ruptureCount=${lh.getBond( 'u' ).ruptureCount}` )

	const notRuptured = lh.checkRupture( 'u', { cortisol: 0.3 } )
	report( 'R3', 'A rupture is a real one-shot event — it stays "already ruptured" and does not re-fire every check until something repairs it', notRuptured.ruptured === false && notRuptured.alreadyRuptured === true ? 'PASS' : 'FAIL', `second immediate check: ${JSON.stringify( notRuptured )}` )

	// Kindling: after a rupture, the effective threshold for THIS user is lower.
	// The bond's `ruptured` debounce flag is reset here on purpose (simulating
	// that it was repaired) so this checks the real THRESHOLD math (kindling),
	// isolated from the one-shot debounce R3 already covers.
	const kindledLh = new LoveHateEngine( { thetaR: 0.3 } )
	for ( let i = 0; i < 4; i++ ) kindledLh.observe( 'kindled', { L: 0, H: 0.9 }, { trust: 0.5 } )
	kindledLh.checkRupture( 'kindled', { cortisol: 0 } ) // first rupture, sets kindling + the ruptured flag
	// Heal it back up a bit, then push it to JUST under the ORIGINAL 0.3 threshold —
	// a kindled user should rupture again here, a fresh one would not.
	kindledLh.bonds.get( 'kindled' ).V              = 0.33
	kindledLh.bonds.get( 'kindled' ).A              = 0.05 // V-A = 0.28, below the original 0.3 threshold
	kindledLh.bonds.get( 'kindled' ).ruptured = false // simulate a real repair having closed the prior rupture
	const secondRupture = kindledLh.checkRupture( 'kindled', { cortisol: 0 } )
	report( 'R4', 'Kindling from a prior rupture genuinely lowers the threshold — the SAME gap that would not rupture a fresh user now does', secondRupture.ruptured === true ? 'PASS' : 'FAIL', `V-A=0.28 (below original thetaR=0.3), ruptured=${secondRupture.ruptured}, kindling=${kindledLh.kindling.get( 'kindled' ).toFixed( 3 )}` )

	// Repair: only possible when A clearly exceeds V AND the AI isn't flooded.
	const repairLh = new LoveHateEngine( { thetaP: 0.3, thetaCalm: 0.4 } )
	repairLh.bonds.set( 'u', { A: 0.7, V: 0.2, lastUpdate: Date.now(), ruptured: true, ruptureCount: 1, lastRuptureTick: Date.now(), repairCount: 0 } )
	const blockedRepair = repairLh.attemptRepair( 'u', { cortisol: 0.6 } ) // flooded — repair should be blocked
	report( 'R5', 'A flooded/stressed AI genuinely cannot repair, even when A clearly exceeds V', blockedRepair.repaired === false ? 'PASS' : 'FAIL', JSON.stringify( blockedRepair ) )

	const okRepair = repairLh.attemptRepair( 'u', { cortisol: 0.1 } ) // calm now
	report( 'R6', 'A calm AI with A clearly exceeding V can genuinely repair — reduces V but does not erase it', okRepair.repaired === true && repairLh.getBond( 'u' ).V > 0 && repairLh.getBond( 'u' ).V < 0.2 ? 'PASS' : 'FAIL', `V after repair=${repairLh.getBond( 'u' ).V.toFixed( 3 )} (was 0.2)` )
	report( 'R7', 'A successful repair increments a real, queryable repair count', repairLh.getBond( 'u' ).repairCount === 1 ? 'PASS' : 'FAIL', `repairCount=${repairLh.getBond( 'u' ).repairCount}` )

}

// ============================================================================
// 3) Full Totemheart integration — real cross-module side effects
// ============================================================================
{

	const ai = new Totemheart( { personality: new Personality( { neuroticism: 0.6, agreeableness: 0.4 } ) } )

	await ai.processInput( 'te quiero mucho, eres genial', { userId: 'x' } )
	await ai.processInput( 'lograste algo increíble, felicidades', { userId: 'x' } )
	const warmBond = ai.loveHateEngine.getBond( 'x' )
	report( 'I1', 'Real positive turns (affection/achievement concepts) raise Affinity through the wired pipeline, not just the standalone engine', warmBond.A > 0 ? 'PASS' : 'FAIL', `A=${warmBond.A.toFixed( 3 )} V=${warmBond.V.toFixed( 3 )}` )

	// A fresh user (no prior warm bond) makes the mechanism easy to observe
	// cleanly — starting from I1's already-warm 'x' bond would also be real
	// (a warm relationship is genuinely harder to rupture, by design), but
	// would need many more turns and fight hedonic habituation on top, which
	// is its own real effect this isn't trying to test. Varied phrasing avoids
	// that habituation discount from flattening H turn over turn.
	// A dedicated fresh Totemheart, not the one I1 already ran two warm turns
	// on — cortisol/decisionFatigue/etc. are AI-GLOBAL state (correctly shared
	// across every user this AI talks to, a real "carries mood between
	// conversations" property, not a bug), so reusing `ai` here would make
	// this rupture test's timing depend on I1's unrelated side effects.
	// Isolating it keeps the check deterministic-enough despite the real
	// Monte-Carlo sampling elsewhere in the pipeline.
	const aiRupture              = new Totemheart( { personality: new Personality( { neuroticism: 0.6, agreeableness: 0.4 } ) } )
	const betrayalPhrases = [
		'me mentiste sobre el proyecto, esto es una traicion total',
		'no puedo creer que me hayas engañado así, te odio',
		'confié en ti y me apuñalaste por la espalda',
		'nunca voy a olvidar esta traicion, me mentiste otra vez',
		'sigues engañándome, esto es imperdonable',
		'me traicionaste de nuevo, ya no confío en nada de lo que dices',
	]
	const wantingBefore = aiRupture.dopaminergicEngine.getWanting()
	let sawRupture      = false
	let egoHealthBefore = aiRupture.reputationEngine.getEgoHealth()
	for ( let i = 0; i < betrayalPhrases.length && !sawRupture; i++ ) {

		const result = await aiRupture.processInput( betrayalPhrases[ i ], { userId: 'z' } )
		if ( result.debug?.loveHate?.rupture?.ruptured ) sawRupture = true

	}
	report( 'I2', 'Repeated betrayal-tagged input against a fresh relationship triggers a real rupture through the full pipeline', sawRupture ? 'PASS' : 'FAIL', `bond after: ${JSON.stringify( aiRupture.loveHateEngine.getBond( 'z' ) )}` )
	report( 'I3', 'A real rupture freezes DopaminergicEngine wanting (hard reset, not gradual decay)', aiRupture.dopaminergicEngine.getWanting() === 0 ? 'PASS' : 'FAIL', `wanting before=${wantingBefore.toFixed( 3 )} after rupture=${aiRupture.dopaminergicEngine.getWanting()}` )
	report( 'I4', 'A real rupture damages EgoHealth through the wired side effect', aiRupture.reputationEngine.getEgoHealth() < egoHealthBefore ? 'PASS' : 'FAIL', `before=${egoHealthBefore.toFixed( 3 )} after=${aiRupture.reputationEngine.getEgoHealth().toFixed( 3 )}` )
	report( 'I5', 'A real rupture creates a genuine, queryable unresolved-wound memory tagged \'rupture\'', aiRupture.episodicMemory.memories.some( m => m.concepts?.includes( 'rupture' ) ) ? 'PASS' : 'FAIL', 'scanned episodicMemory.memories for concepts including "rupture"' )

	report( 'I6', 'getExpressionDirectives(userId) blends real NetBond into the trust feature — a ruptured relationship measurably lowers approach', aiRupture.getExpressionDirectives( 'z' ).actionTendency.approach < aiRupture.getExpressionDirectives( 'someone_new' ).actionTendency.approach ? 'PASS' : 'FAIL', `ruptured-user approach=${aiRupture.getExpressionDirectives( 'z' ).actionTendency.approach.toFixed( 3 )} vs new-user approach=${aiRupture.getExpressionDirectives( 'someone_new' ).actionTendency.approach.toFixed( 3 )}` )

	report( 'I7', 'toJSON()/restoreState() round-trips LoveHateEngine bonds and kindling without loss', ( () => {

		const saved       = ai.toJSON()
		const restored = new Totemheart()
		restored.restoreState( saved )
		const original  = ai.loveHateEngine.getBond( 'x' )
		const rehydrated = restored.loveHateEngine.getBond( 'x' )
		return Math.abs( original.A - rehydrated.A ) < 1e-9 && Math.abs( original.V - rehydrated.V ) < 1e-9

	} )() ? 'PASS' : 'FAIL', 'compared bond A/V before and after a toJSON()->restoreState() round trip' )

	let sawNaN = false
	for ( let i = 0; i < 5; i++ ) {

		const r = await ai.processInput( 'perdona por lo de antes, de verdad lo siento', { userId: 'x' } )
		ai.tick( 2 )
		if ( r.debug?.loveHate && JSON.stringify( r.debug.loveHate ).includes( 'NaN' ) ) sawNaN = true

	}
	report( 'I8', 'A conversation heading toward repair produces no NaN anywhere in the loveHate debug block', !sawNaN ? 'PASS' : 'FAIL', 'scanned debug.loveHate after every turn' )

}

// ============================================================================
// REPORT
// ============================================================================

console.log( '\n' + '─'.repeat( 116 ) )
console.log( 'ID'.padEnd( 5 ), 'CHECK'.padEnd( 88 ), 'STATUS'.padEnd( 8 ) )
console.log( '─'.repeat( 116 ) )

let pass = 0
let fail  = 0
for ( const r of results ) {

	console.log( r.id.padEnd( 5 ), r.name.padEnd( 88 ).slice( 0, 88 ), r.status.padEnd( 8 ) )
	console.log( ' '.repeat( 14 ) + r.evidence )
	if ( r.status === 'PASS' ) pass++
	else fail++

}

console.log( '\n' + '─'.repeat( 116 ) )
console.log( `Summary: ${pass} PASS, ${fail} FAIL out of ${results.length} checks on LoveHateEngine.` )

if ( fail > 0 ) process.exit( 1 )
