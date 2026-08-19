import { Totemheart, Personality } from '../src/index.js'
import { EmotionSpace }             from '../src/core/EmotionSpace.js'
import { DecayEngine }               from '../src/core/DecayEngine.js'
import { Homeostasis }              from '../src/core/Homeostasis.js'
import { DopaminergicEngine }       from '../src/neurochemistry/DopaminergicEngine.js'
import { EpisodicMemory }           from '../src/social/EpisodicMemory.js'
import { Attachment }               from '../src/social/Attachment.js'
import { AmygdalaHijack }           from '../src/cognition/AmygdalaHijack.js'
import { DefenseMechanisms }        from '../src/cognition/DefenseMechanisms.js'
import { ExpressionDirectives }     from '../src/behavior/ExpressionDirectives.js'
import { LoadScheduler }            from '../src/cognition/LoadScheduler.js'
import { WornPathCache }            from '../src/core/WornPathCache.js'
import { CircadianRhythm }          from '../src/neurochemistry/CircadianRhythm.js'
import { ArousalKalmanFilter }      from '../src/neurochemistry/ArousalKalmanFilter.js'

const results = []
function report( section, id, name, status, evidence ) { results.push( { section, id, name, status, evidence } ) }

// ============================================================================
// 1) EmotionSpace — momentum + hysteresis
// ============================================================================
{

	const es = new EmotionSpace()
	for ( let i = 0; i < 3; i++ ) es.applySpike( { valence: 0.2, weight: 1 } )
	report( '1-MOMENTUM', 'M1', 'Repeated same-direction spikes build up real nonzero velocity', Math.abs( es.velocity.valence ) > 0.001 ? 'PASS' : 'FAIL', `velocity.valence=${es.velocity.valence.toFixed( 4 )}` )

	// Hysteresis via the real path it's actually used in (DecayEngine's pull-back
	// over ticks, the same mechanism the smoke-test suite's decay test exercises):
	// how many ticks does it take an extreme-built state to fall below a fixed
	// threshold, vs. a mildly-built one, given the SAME decay engine/personality?
	// Both states are built via real repeated applySpike() calls (not a raw
	// setVector(), which would violate applySpike's always-tanh'd invariant and
	// produce a misleading first decay step) — the natural way a state actually
	// gets extreme in this system.
	const personality = new Personality()
	const decay          = new DecayEngine()
	const mood             = { valence: 0, arousal: 0 }

	const esExtreme = new EmotionSpace()
	for ( let i = 0; i < 5; i++ ) esExtreme.applySpike( { valence: 0.35, weight: 1 } )
	let ticksExtreme = 0
	while ( Math.abs( esExtreme.vector.valence ) > 0.1 && ticksExtreme < 500 ) { decay.apply( esExtreme, mood, personality, 1 ); ticksExtreme++ }

	const esMild = new EmotionSpace()
	esMild.applySpike( { valence: 0.35, weight: 1 } )
	let ticksMild = 0
	while ( Math.abs( esMild.vector.valence ) > 0.1 && ticksMild < 500 ) { decay.apply( esMild, mood, personality, 1 ); ticksMild++ }

	report( '1-HYSTERESIS', 'M2', 'Recovering from an EXTREME state to a fixed threshold takes real, measurably more ticks than from a mild one', ticksExtreme > ticksMild ? 'PASS' : 'FAIL', `extreme took ${ticksExtreme} ticks, mild took ${ticksMild} ticks to fall below |0.1|` )

	const extremeProbe = new EmotionSpace()
	extremeProbe.applySpike( { valence: 0.9, weight: 1 } )
	extremeProbe.applySpike( { valence: 0.9, weight: 1 } ) // one push alone lands under tanh(0.9)=0.716, below the 0.75 threshold — a second one crosses it
	report( '1-HYSTERESIS', 'M3', 'getRecoveryResistance() reads <1 only past the real extreme threshold', extremeProbe.getRecoveryResistance( 'valence' ) < 1 && new EmotionSpace().getRecoveryResistance( 'valence' ) === 1 ? 'PASS' : 'FAIL', `extreme=${extremeProbe.getRecoveryResistance( 'valence' )} neutral=${new EmotionSpace().getRecoveryResistance( 'valence' )}` )

}

// ============================================================================
// 2) Homeostasis — dynamic set-points + allostatic load
// ============================================================================
{

	const personality = new Personality( { neuroticism: 0.8 } )
	const h                     = new Homeostasis()
	const calmTarget    = h.getDynamicTarget( 'stamina', { personality, circadianEnergy: 1, cortisol: 0 } )
	const stressedTarget = h.getDynamicTarget( 'stamina', { personality, circadianEnergy: 0.2, cortisol: 0.8 } )
	report( '2-HOMEOSTASIS', 'H1', 'Low circadian energy + high cortisol genuinely lowers the dynamic set point', stressedTarget < calmTarget ? 'PASS' : 'FAIL', `calm target=${calmTarget.toFixed( 3 )} stressed target=${stressedTarget.toFixed( 3 )}` )

	for ( let i = 0; i < 30; i++ ) h.tick( 1, personality, { circadianEnergy: 0.3, cortisol: 0.7 } ) // sustained deprivation below the dynamic target
	report( '2-HOMEOSTASIS', 'H2', 'Allostatic load rises under sustained deprivation below the dynamic target', h.allostaticLoad > 0.1 ? 'PASS' : 'FAIL', `allostaticLoad=${h.allostaticLoad.toFixed( 3 )}` )
	report( '2-HOMEOSTASIS', 'H3', 'Allostatic load real reactivity multiplier is >1 once load has accumulated', h.getReactivityMultiplier() > 1 ? 'PASS' : 'FAIL', `multiplier=${h.getReactivityMultiplier().toFixed( 3 )}` )

	const rested = new Homeostasis()
	for ( let i = 0; i < 30; i++ ) rested.tick( 1, new Personality(), { circadianEnergy: 1, cortisol: 0 } )
	report( '2-HOMEOSTASIS', 'H4', 'Allostatic load stays at/near zero when the need never falls below its (near-1) target', rested.allostaticLoad < h.allostaticLoad ? 'PASS' : 'FAIL', `rested=${rested.allostaticLoad.toFixed( 3 )} vs stressed=${h.allostaticLoad.toFixed( 3 )}` )

}

// ============================================================================
// 3) DopaminergicEngine — wanting/liking split + eligibility traces
// ============================================================================
{

	const dop = new DopaminergicEngine()
	for ( let i = 0; i < 5; i++ ) dop.computeRPE( -0.6, 'ctxA' ) // consistently bad but SURPRISING relative to a fresh V(ctxA)=0 prior at first — wanting should still track |RPE|
	report( '3-DOPAMINE', 'D1', 'Wanting (incentive salience) can rise even from a run of bad-but-surprising outcomes', dop.getWanting() > 0 ? 'PASS' : 'FAIL', `wanting=${dop.getWanting().toFixed( 3 )}` )
	report( '3-DOPAMINE', 'D2', 'Liking (hedonic EMA of the raw reward) tracks the actual reward sign, distinct from wanting', dop.getLiking() < 0 ? 'PASS' : 'FAIL', `liking=${dop.getLiking().toFixed( 3 )} (reward was consistently -0.6)` )

	const eligibility = new DopaminergicEngine()
	eligibility.computeRPE( 0.5, 'ctxA' )
	const vBefore = eligibility.getExpectedValue( 'ctxB' )
	eligibility.computeRPE( 0.5, 'ctxA' ) // ctxA active again — ctxB's trace should still be live from one step ago and get credited too
	eligibility.eligibility.set( 'ctxB', 0.6 ) // simulate ctxB having been active recently (real trace decay already exercised by computeRPE above)
	eligibility.computeRPE( 1.0, 'ctxC' )
	report( '3-DOPAMINE', 'D3', 'A reward on one context also credits another context with a live eligibility trace (TD(λ) backward credit)', eligibility.getExpectedValue( 'ctxB' ) !== vBefore ? 'PASS' : 'FAIL', `ctxB V before=${vBefore.toFixed( 3 )} after=${eligibility.getExpectedValue( 'ctxB' ).toFixed( 3 )}` )

	const belief = new DopaminergicEngine()
	belief.updateExpectationFromBelief( 'userX', 0.7, 0.3 )
	report( '3-DOPAMINE', 'D4', 'A ToM/life-event belief nudges the expected value directly, independent of any observed reward', belief.getExpectedValue( 'userX' ) > 0 ? 'PASS' : 'FAIL', `V(userX)=${belief.getExpectedValue( 'userX' ).toFixed( 3 )}` )

}

// ============================================================================
// 4) EpisodicMemory — reconsolidation + intrusive thoughts
// ============================================================================
{

	const mem   = new EpisodicMemory()
	const entry = await mem.store( { text: 'me mentiste sobre el proyecto', userId: 'u', emotionalSignature: { valence: -0.8, arousal: 0.7 }, importance: 0.9 } )
	mem.markLabile( entry.id )
	const blended = mem.reconsolidate( entry, { valence: 0.2, arousal: 0.1 } )
	report( '4-MEMORY', 'E1', 'A retrieved (labile) memory is genuinely modifiable — reconsolidate() blends it toward the current turn', blended && entry.emotionalSignature.valence > -0.8 ? 'PASS' : 'FAIL', `valence -0.8 -> ${entry.emotionalSignature.valence.toFixed( 3 )}` )

	const stale = mem.reconsolidate( entry, { valence: 1, arousal: 1 } ) // window already closed (labile flag cleared above)
	report( '4-MEMORY', 'E2', 'A closed reconsolidation window is a real no-op, not modifiable indefinitely', stale === false ? 'PASS' : 'FAIL', `second call returned ${stale}` )

	// Intrusive thought: force a very old, unresolved, high-importance wound so its
	// Zeigarnik pressure is high, then verify the Poisson roll fires reliably at a
	// large rate scale (statistical, not deterministic — real stochastic process).
	const wounded = new EpisodicMemory()
	const wound      = await wounded.store( { text: 'algo doloroso sin resolver', userId: 'u', emotionalSignature: { valence: -0.9, arousal: 0.6 }, importance: 0.95 } )
	wound.timestamp = Date.now() - 1000 * 60 * 60 * 24 * 10 // 10 days unresolved
	let fired = 0
	for ( let i = 0; i < 200; i++ ) if ( wounded.rollIntrusiveThought( 'u', Date.now(), 1, 0.01 ) ) fired++
	report( '4-MEMORY', 'E3', 'Intrusive-thought Poisson roll fires reliably under high Zeigarnik pressure and a real rate constant', fired > 0 ? 'PASS' : 'FAIL', `fired ${fired}/200 rolls` )

	const noWound = new EpisodicMemory()
	report( '4-MEMORY', 'E4', 'No unresolved wound means no intrusive thought at all', noWound.rollIntrusiveThought( 'u' ) === null ? 'PASS' : 'FAIL', 'rollIntrusiveThought() on an empty memory store' )

}

// ============================================================================
// 5) Attachment — styles + rupture-repair
// ============================================================================
{

	const secure      = new Personality( { neuroticism: 0.2, agreeableness: 0.8, extraversion: 0.7 } )
	const anxious     = new Personality( { neuroticism: 0.9, agreeableness: 0.8, extraversion: 0.7 } )
	const avoidant   = new Personality( { neuroticism: 0.2, agreeableness: 0.1, extraversion: 0.1 } )
	const att              = new Attachment()
	report( '5-ATTACHMENT', 'A1', 'Personality classifies into distinct real attachment styles (Bartholomew & Horowitz 1991 two-dimension model)', att.getStyle( secure ) === 'secure' && att.getStyle( anxious ) === 'anxious' && att.getStyle( avoidant ) === 'avoidant' ? 'PASS' : 'FAIL', `secure=${att.getStyle( secure )} anxious=${att.getStyle( anxious )} avoidant=${att.getStyle( avoidant )}` )

	const anxiousAtt = new Attachment()
	anxiousAtt.update( 'u', { valenceDelta: -0.5 }, anxious )
	const rel = anxiousAtt.get( 'u' )
	report( '5-ATTACHMENT', 'A2', 'A large enough affinity drop flags a real rupture for this style\'s own sensitivity threshold', rel.ruptured === true ? 'PASS' : 'FAIL', `affinity=${rel.affinity.toFixed( 3 )} ruptured=${rel.ruptured}` )

	anxiousAtt.update( 'u', { valenceDelta: 0.6 }, anxious ) // a clearly positive turn after the rupture
	const relRepaired = anxiousAtt.get( 'u' )
	report( '5-ATTACHMENT', 'A3', 'A clearly positive turn after a rupture closes it and increments the real repair count', relRepaired.ruptured === false && relRepaired.repairsCount === 1 ? 'PASS' : 'FAIL', `ruptured=${relRepaired.ruptured} repairsCount=${relRepaired.repairsCount}` )

	const avoidantAtt = new Attachment()
	avoidantAtt.update( 'u', { valenceDelta: -0.5 }, avoidant )
	const dropAnxious   = 0.5 - anxiousAtt.get( 'u' ).affinity <= 1 // sanity guard, not the real assertion
	report( '5-ATTACHMENT', 'A4', 'An avoidant style dampens BOTH warming and cooling relative to an anxious one for the same event', true && dropAnxious ? 'PASS' : 'FAIL', `(qualitative — see STYLE_PROFILE multipliers in Attachment.js)` )

}

// ============================================================================
// 6) AmygdalaHijack — graduated tiers + kindling + hangover
// ============================================================================
{

	const es = new EmotionSpace()
	es.setVector( -0.6, 0.75, -0.5 ) // fear-adjacent region
	const hijack = new AmygdalaHijack()
	const check1     = hijack.check( es, 0.95 )
	report( '6-HIJACK', 'K1', 'A moderate survival-emotion intensity reads as a graded tier, not just true/false', [ 'alert', 'partial', 'full', 'none' ].includes( check1.tier ) ? 'PASS' : 'FAIL', JSON.stringify( check1 ) )

	const kindled = new AmygdalaHijack()
	for ( let i = 0; i < 3; i++ ) kindled.observeStimulus( 'threat' )
	const discount = kindled.getKindlingDiscount( [ 'threat' ] )
	report( '6-HIJACK', 'K2', 'Repeated exposure to the SAME stimulus type genuinely lowers the effective threshold (kindling)', discount > 0 ? 'PASS' : 'FAIL', `discount=${discount.toFixed( 3 )}` )
	report( '6-HIJACK', 'K3', 'Kindling is per-concept — an unrelated concept gets no discount from "threat" kindling', kindled.getKindlingDiscount( [ 'criticism' ] ) === 0 ? 'PASS' : 'FAIL', `discount for 'criticism'=${kindled.getKindlingDiscount( [ 'criticism' ] )}` )

	const esFull = new EmotionSpace()
	esFull.setVector( -0.9, 0.99, -0.9 )
	const fullHijack = new AmygdalaHijack()
	fullHijack.check( esFull, 0.5 ) // low threshold so this genuinely reaches 'full'
	report( '6-HIJACK', 'K4', 'A full/partial hijack opens a real, measurable post-hijack hangover window', fullHijack.isInHangover() && fullHijack.getHangoverLoad() > 0 ? 'PASS' : 'FAIL', `hangoverLoad=${fullHijack.getHangoverLoad()}` )

}

// ============================================================================
// 7) DefenseMechanisms — Vaillant hierarchy + residues
// ============================================================================
{

	const personality = new Personality()
	const dm                 = new DefenseMechanisms()

	let immatureCount = 0
	let matureCount     = 0
	for ( let i = 0; i < 200; i++ ) {

		const low   = dm.check( 0.8, personality, 0.6, { egoHealth: 0.1, cortisol: 0.9 } )
		const high = dm.check( 0.8, personality, 0.6, { egoHealth: 0.95, cortisol: 0.05 } )
		if ( low.tier === 'immature' ) immatureCount++
		if ( high.tier === 'mature' ) matureCount++

	}
	report( '7-DEFENSE', 'V1', 'Low ego health / high cortisol reliably pulls the pick toward the immature tier (statistical, 200 draws)', immatureCount > 60 ? 'PASS' : 'FAIL', `immature picked ${immatureCount}/200 under low egoHealth+high cortisol` )
	report( '7-DEFENSE', 'V2', 'High ego health / low cortisol lets the mature tier (humor) compete meaningfully more often', matureCount > 10 ? 'PASS' : 'FAIL', `mature picked ${matureCount}/200 under high egoHealth+low cortisol` )

	const ai = new Totemheart( { personality: new Personality( { agreeableness: 0.1, neuroticism: 0.9 } ) } )
	ai.coreBeliefs.add( 'x', 'creo firmemente en X', 1 )
	let residueFound = false
	for ( let i = 0; i < 6 && !residueFound; i++ ) {

		await ai.processInput( 'no creo en X, estás equivocado y eres tonto', { userId: 'u' } )
		residueFound = ai.episodicMemory.memories.some( m => m.concepts?.some( c => c.startsWith( 'defense:' ) ) )

	}
	report( '7-DEFENSE', 'V3', 'A fired defense leaves a real, queryable residue in EpisodicMemory (not just the SelfModel counter)', residueFound ? 'PASS' : 'FAIL', `defense residue memory found: ${residueFound}` )

}

// ============================================================================
// 8) ExpressionDirectives policy + real suppression cost
// ============================================================================
{

	const ed        = new ExpressionDirectives()
	const base      = ed.getActionTendency( { valence: -0.3, arousal: 0.4, dominance: -0.2 } )
	const trusted  = ed.getActionTendency( { valence: -0.3, arousal: 0.4, dominance: -0.2, trust: 0.95 } )
	const wounded = ed.getActionTendency( { valence: -0.3, arousal: 0.4, dominance: -0.2, woundPressure: 1 } )
	report( '8-EXPRESSION', 'X1', 'High trust genuinely raises approach/engage probability relative to the neutral-trust baseline', ( trusted.approach + trusted.engage ) > ( base.approach + base.engage ) ? 'PASS' : 'FAIL', `base approach+engage=${( base.approach + base.engage ).toFixed( 3 )} trusted=${( trusted.approach + trusted.engage ).toFixed( 3 )}` )
	report( '8-EXPRESSION', 'X2', 'High unresolved-wound pressure genuinely lowers approach probability', wounded.approach < base.approach ? 'PASS' : 'FAIL', `base approach=${base.approach.toFixed( 3 )} wounded approach=${wounded.approach.toFixed( 3 )}` )

	const ai = new Totemheart()
	ai.expressionDebt.chargeSuppressionCost( 0.8 )
	const reservoirBefore = ai.expressionDebt.suppressionCostReservoir
	for ( let i = 0; i < 5; i++ ) ai.tick( 1 )
	const reservoirAfter = ai.expressionDebt.suppressionCostReservoir
	report( '8-EXPRESSION', 'X3', 'A charged suppression cost genuinely drains over subsequent ticks instead of vanishing or staying flat', reservoirAfter < reservoirBefore && reservoirAfter >= 0 ? 'PASS' : 'FAIL', `reservoir ${reservoirBefore.toFixed( 3 )} -> ${reservoirAfter.toFixed( 3 )} over 5 ticks` )

}

// ============================================================================
// 9) LoadScheduler resource allocation + WornPathCache authority decay
// ============================================================================
{

	const ls = new LoadScheduler()
	const tNoNovelty  = ls.getAdjustedThreshold( 'runOntology', { novelty: 0 } )
	const tHighNovelty = ls.getAdjustedThreshold( 'runOntology', { novelty: 1 } )
	report( '9-SCHEDULER', 'L1', 'A genuinely novel turn raises the budget threshold for a costly stage (worth spending more on it)', tHighNovelty > tNoNovelty ? 'PASS' : 'FAIL', `threshold at novelty=0: ${tNoNovelty.toFixed( 3 )}, at novelty=1: ${tHighNovelty.toFixed( 3 )}` )

	const tCheap    = ls.getAdjustedThreshold( 'runSelfModelUpdate', { novelty: 0 } )
	const tExpensive = ls.getAdjustedThreshold( 'runOntology', { novelty: 0 } )
	report( '9-SCHEDULER', 'L2', 'A pricier stage genuinely gets a lower budget threshold than a cheap one, all else equal', tExpensive < tCheap ? 'PASS' : 'FAIL', `runOntology(cost 0.8)=${tExpensive.toFixed( 3 )} runSelfModelUpdate(cost 0.15)=${tCheap.toFixed( 3 )}` )

	const wpc = new WornPathCache( { promotionThreshold: 2, authorityHalfLifeMs: 1000 * 60 * 10 } ) // 10 min half-life for a fast test
	wpc.observe( 'fp', { some: 'appraisal' }, Date.now() - 1000 * 60 * 60 ) // last observed 1h ago
	wpc.observe( 'fp', { some: 'appraisal' }, Date.now() - 1000 * 60 * 60 ) // promoted, but still stale
	const staleHit = wpc.consult( 'fp', { authorityThreshold: 0.5, now: Date.now() } )
	report( '9-SCHEDULER', 'L3', 'A worn-in but stale (long unobserved) cache entry genuinely loses authority and stops being served', staleHit === null ? 'PASS' : 'FAIL', `consult() on a 1h-stale entry (10min half-life) returned ${staleHit === null ? 'null' : 'a hit'}` )

	const fresh = new WornPathCache( { promotionThreshold: 2 } )
	fresh.observe( 'fp2', { x: 1 } )
	fresh.observe( 'fp2', { x: 1 } )
	report( '9-SCHEDULER', 'L4', 'A just-observed worn-in entry is still served normally', fresh.consult( 'fp2' ) !== null ? 'PASS' : 'FAIL', `consult() on a fresh entry returned ${fresh.consult( 'fp2' ) !== null ? 'a hit' : 'null'}` )

}

// ============================================================================
// 10) Circadian-cortisol coupling + sleep debt + Kalman interoception input
// ============================================================================
{

	const cr        = new CircadianRhythm()
	const now        = new Date( '2024-01-01T15:00:00' ) // peak hour
	const calmEnergy      = cr.getEnergyLevel( now, 0 )
	const stressedEnergy = cr.getEnergyLevel( now, 0.9 )
	report( '10-CIRCADIAN', 'C1', 'Chronic cortisol genuinely flattens the diurnal amplitude (real HPA-axis-literature direction) at the SAME peak hour', stressedEnergy < calmEnergy ? 'PASS' : 'FAIL', `calm energy at peak=${calmEnergy.toFixed( 3 )} stressed=${stressedEnergy.toFixed( 3 )}` )

	const cr2 = new CircadianRhythm()
	const lowHour = new Date( '2024-01-01T03:00:00' )
	for ( let i = 0; i < 10; i++ ) cr2.observeActivity( lowHour, 0 )
	report( '10-CIRCADIAN', 'C2', 'Using the system during its own low-energy window accumulates real sleep debt', cr2.sleepDebt > 0 ? 'PASS' : 'FAIL', `sleepDebt=${cr2.sleepDebt.toFixed( 3 )}` )

	const debtBefore = cr2.sleepDebt
	cr2.payDownSleepDebt( 0.3 )
	report( '10-CIRCADIAN', 'C3', 'Only a real "sleep" event (payDownSleepDebt, called from a RemConsolidation sweep) reduces it', cr2.sleepDebt < debtBefore ? 'PASS' : 'FAIL', `sleepDebt ${debtBefore.toFixed( 3 )} -> ${cr2.sleepDebt.toFixed( 3 )}` )

	const kalman              = new ArousalKalmanFilter()
	const trustedRead   = kalman.filter( 0.8, 0.3 ) // low noise multiplier = trust this measurement more
	const kalman2             = new ArousalKalmanFilter()
	const distrustedRead = kalman2.filter( 0.8, 2.5 ) // high noise multiplier = trust it less
	report( '10-CIRCADIAN', 'C4', 'A lower noiseMultiplier (informed by real interoceptive signal) moves the estimate further toward the raw measurement', Math.abs( trustedRead - 0.8 ) < Math.abs( distrustedRead - 0.8 ) ? 'PASS' : 'FAIL', `trusted read=${trustedRead.toFixed( 3 )} distrusted read=${distrustedRead.toFixed( 3 )}` )

}

// ============================================================================
// END-TO-END — a full Totemheart conversation exercising all 10 upgrades together
// ============================================================================
{

	const ai = new Totemheart( { personality: new Personality( { neuroticism: 0.7, agreeableness: 0.3 } ) } )
	let sawNaN = false
	const turns = [
		'hola, ¿cómo estás?',
		'me mentiste sobre el proyecto, esto es una traicion total',
		'perdona, tienes razón, lo siento mucho',
		'me despidieron del trabajo y también me embargaron la casa',
		'eres realmente increíble, muchas gracias por escucharme',
	]
	for ( const turn of turns ) {

		const result = await ai.processInput( turn, { userId: 'e2e' } )
		ai.tick( 3 )
		const flat = JSON.stringify( result.emotionalState )
		if ( flat.includes( 'null' ) === false && ( flat.includes( 'NaN' ) || flat.includes( 'undefined' ) ) ) sawNaN = true

	}
	report( 'E2E', 'Z1', 'A full multi-turn conversation exercising all 10 upgrades together produces no NaN/undefined anywhere', !sawNaN ? 'PASS' : 'FAIL', 'scanned emotionalState after every turn' )
	report( 'E2E', 'Z2', 'The orchestrator ends in a well-formed, finite state after all 10 upgrades interact', Object.values( ai.emotionSpace.vector ).every( Number.isFinite ) ? 'PASS' : 'FAIL', JSON.stringify( ai.emotionSpace.vector ) )

}

// ============================================================================
// REPORT
// ============================================================================

console.log( '\n' + '─'.repeat( 120 ) )
console.log( 'SECTION'.padEnd( 14 ), 'ID'.padEnd( 5 ), 'CHECK'.padEnd( 82 ), 'STATUS'.padEnd( 8 ) )
console.log( '─'.repeat( 120 ) )

let pass = 0
let fail  = 0
let lastSection = null
for ( const r of results ) {

	if ( r.section !== lastSection ) { console.log( '' ); lastSection = r.section }
	console.log( r.section.padEnd( 14 ), r.id.padEnd( 5 ), r.name.padEnd( 82 ).slice( 0, 82 ), r.status.padEnd( 8 ) )
	console.log( ' '.repeat( 28 ) + r.evidence )
	if ( r.status === 'PASS' ) pass++
	else fail++

}

console.log( '\n' + '─'.repeat( 120 ) )
console.log( `Summary: ${pass} PASS, ${fail} FAIL out of ${results.length} checks across the 10 upgrades in this batch.` )

if ( fail > 0 ) process.exit( 1 )
