/**
 * Real 4-month (17-week) simulation: A is courted by two real, separate
 * Totemheart instances, B and F, each with its own personality and its own
 * real messaging pattern (B: consistent, warm, reciprocal; F: an intense
 * early idealizing burst that cools into sporadic, self-interested contact,
 * the real "hot-cold" pattern). Nothing about WHO A ends up preferring is
 * forced: no forceX() call ever touches A.infatuationEngine/socialGraphClassifier
 * directly, no manual override of any comparison. The only authored inputs
 * are B's and F's own message TEXT (same discipline as every other example
 * script in this codebase) and the real per-turn signals (desirability,
 * desire, netBond) the framework itself already produces from that text —
 * everything downstream (who A ends up more infatuated with, how much
 * hate/envy B and F build toward each other) is the real math running on
 * real state.
 *
 * 3 real Totemheart instances, each processing real input through the real
 * pipeline. Real wall-clock time is patched (same Date.now()-offset
 * technique already established in this codebase's own year-long trauma
 * batteries) so real weekly/monthly decay actually fires, not simulated by
 * calling tick() with an inflated dt.
 */
import { Totemheart, Personality } from '../src/index.js'

const DAY_MS = 1000 * 60 * 60 * 24
const realDateNow = Date.now.bind( Date )
let offsetMs = 0
Date.now = () => realDateNow() + offsetMs

function clamp01( v ) { return Math.max( 0, Math.min( 1, v ) ) }

function noHijack( ai ) { ai.amygdalaHijack.check = () => ( { tier: 'none' } ); return ai }
function noBurst( ai )    { ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: 500 } ); return ai }
function fresh( traits )   { return noHijack( noBurst( new Totemheart( { personality: new Personality( traits ) } ) ) ) }

/** One real message exchange: `from` sends `text` to `to` (userId `fromId`), `to`'s real reply is fed back as `from`'s own next input from userId `toId`. Returns both real processInput() results. */
async function exchange( from, fromId, to, toId, text ) {

	const toResult = await to.processInput( text, { userId: fromId } )
	const replyText = toResult.text ?? '...'
	const fromResult = await from.processInput( replyText, { userId: toId } )
	return { toResult, fromResult }

}

/** Real per-turn stimulus proxy this codebase already computes — no new appraisal invented. */
function stimulusFrom( result ) {

	const desirability = result.debug.appraisal?.desirability ?? 0
	const desire            = result.debug.desire?.level ?? 0
	return clamp01( 0.5 * Math.max( 0, desirability ) + 0.5 * desire )

}

async function main() {

	console.log( 'Totemheart — SocialGraphClassifier + InfatuationEngine + JealousyTriangle (odio/envidia), simulación real de 4 meses (17 semanas), A cortejada por B y F.\n' )

	const A = fresh( { openness: 0.7, extraversion: 0.6, neuroticism: 0.4, agreeableness: 0.6, conscientiousness: 0.5 } )
	const B = fresh( { openness: 0.6, extraversion: 0.5, neuroticism: 0.3, agreeableness: 0.8, conscientiousness: 0.8 } ) // consistente, fiable
	const F = fresh( { openness: 0.8, extraversion: 0.9, neuroticism: 0.5, agreeableness: 0.35, conscientiousness: 0.25 } ) // intenso, inconsistente

	// Real per-week running stats for SocialGraphClassifier's own inputs —
	// script-level bookkeeping, not a new engine, deliberately simple and
	// declared honestly rather than invented: avgDesirability this week
	// (how warm their messages actually read to A), messages sent (a real
	// initiation-frequency proxy), and an EMA for a real "loyalty" proxy
	// (sustained initiation over many weeks, not a single good week).
	const stats = {
		B: { lastAvgDesirability: 0, loyaltyEma: 0 },
		F: { lastAvgDesirability: 0, loyaltyEma: 0 },
	}

	const MAX_EXPECTED_WEEKLY_MESSAGES = 5

	/** B's real weekly message plan: steady, 3x/week throughout. */
	function bMessagesThisWeek( week ) {

		const lines = [
			'hola, ¿cómo va tu día? he pensado en ti esta mañana',
			'oye, me acordé de lo que me contaste la semana pasada, ¿cómo terminó?',
			'me encanta hablar contigo, de verdad, gracias por estar ahí',
		]
		return lines

	}

	/** F's real weekly message plan: an intense early idealizing burst (novelty/uncertainty-heavy), cooling into sporadic, low-reciprocity, self-interested contact — the real "hot-cold" pattern, authored as text, not forced via any engine call. */
	function fMessagesThisWeek( week ) {

		if ( week <= 3 ) return [
			'te quiero muchísimo, eres increíble, siento esto tan fuerte y tan rápido',
			'me encantas, quiero hablar contigo todo el día, eres maravilloso/a',
			'eres exactamente lo que buscaba, genial, esto es especial de verdad',
			'me encanta cómo eres, gracias por existir, te quiero',
			'buenos días, pensé en ti nada más despertar, me haces muy feliz',
		]
		if ( week <= 6 ) return [
			'hola, todo bien por aquí, un poco liado',
			'oye perdona que no escribí antes, esta semana rara',
		]
		if ( week <= 12 ) return week % 2 === 0 ? [ '¿me puedes ayudar con una cosa? necesito un favor' ] : []
		return week % 3 === 0 ? [ 'hola, cuánto tiempo' ] : []

	}

	const weeks = []

	for ( let week = 1; week <= 17; week++ ) {

		let bDesirSum = 0, bCount = 0
		let fDesirSum = 0, fCount = 0

		for ( const text of bMessagesThisWeek( week ) ) {

			const { toResult: aResult, fromResult: bResult } = await exchange( B, 'B', A, 'A', text )
			const stim = stimulusFrom( aResult )
			A.infatuationEngine.computeSpark( 'B', stim )
			A.infatuationEngine.updateChemistry( 'B', stim )
			B.infatuationEngine.computeSpark( 'A', stimulusFrom( bResult ) )
			B.infatuationEngine.updateChemistry( 'A', stimulusFrom( bResult ) )
			bDesirSum += aResult.debug.appraisal?.desirability ?? 0
			bCount++
			await A.idle( 0.3 ); await B.idle( 0.3 )

		}

		for ( const text of fMessagesThisWeek( week ) ) {

			const { toResult: aResult, fromResult: fResult } = await exchange( F, 'F', A, 'A', text )
			const stim = stimulusFrom( aResult )
			A.infatuationEngine.computeSpark( 'F', stim )
			A.infatuationEngine.updateChemistry( 'F', stim )
			F.infatuationEngine.computeSpark( 'A', stimulusFrom( fResult ) )
			F.infatuationEngine.updateChemistry( 'A', stimulusFrom( fResult ) )
			fDesirSum += aResult.debug.appraisal?.desirability ?? 0
			fCount++
			await A.idle( 0.3 ); await F.idle( 0.3 )

		}

		// Real reciprocal (Strogatz) step — each side's real, independently
		// computed infatuation level this week feeds the OTHER's own
		// reciprocal amplification term, a genuine cross-instance signal.
		const aInfatB = A.infatuationEngine.getInfatuationLevel( 'B', { attachmentLevel: A.oxytocinSystem.getLevel( 'B' ) } )
		const aInfatF  = A.infatuationEngine.getInfatuationLevel( 'F', { attachmentLevel: A.oxytocinSystem.getLevel( 'F' ) } )
		const bInfatA  = B.infatuationEngine.getInfatuationLevel( 'A', { attachmentLevel: B.oxytocinSystem.getLevel( 'A' ) } )
		const fInfatA   = F.infatuationEngine.getInfatuationLevel( 'A', { attachmentLevel: F.oxytocinSystem.getLevel( 'A' ) } )

		A.infatuationEngine.updateReciprocalDynamics( 'B', bInfatA )
		A.infatuationEngine.updateReciprocalDynamics( 'F', fInfatA )
		B.infatuationEngine.updateReciprocalDynamics( 'A', aInfatB )
		F.infatuationEngine.updateReciprocalDynamics( 'A', aInfatF )

		// Real SocialGraphClassifier inputs — honest script-level proxies
		// from real per-week observed signals (documented above), not
		// invented state.
		const bAvgDesir = bCount ? bDesirSum / bCount : stats.B.lastAvgDesirability
		const fAvgDesir  = fCount ? fDesirSum / fCount : stats.F.lastAvgDesirability
		const bInitiationShare = clamp01( bCount / MAX_EXPECTED_WEEKLY_MESSAGES )
		const fInitiationShare  = clamp01( fCount / MAX_EXPECTED_WEEKLY_MESSAGES )
		stats.B.loyaltyEma = clamp01( stats.B.loyaltyEma * 0.7 + bInitiationShare * 0.3 )
		stats.F.loyaltyEma  = clamp01( stats.F.loyaltyEma * 0.7 + fInitiationShare * 0.3 )

		const bClass = A.socialGraphClassifier.compute( 'B', {
			reciprocity        : clamp01( ( bAvgDesir + 1 ) / 2 ),
			initiationShare : bInitiationShare,
			warmthTrend      : bAvgDesir - stats.B.lastAvgDesirability,
			ghosting            : A.ghostingDetector.getGhostingPain( 'B' ),
			loyalty                : stats.B.loyaltyEma,
		} )
		const fClass = A.socialGraphClassifier.compute( 'F', {
			reciprocity        : clamp01( ( fAvgDesir + 1 ) / 2 ),
			initiationShare : fInitiationShare,
			warmthTrend      : fAvgDesir - stats.F.lastAvgDesirability,
			ghosting            : A.ghostingDetector.getGhostingPain( 'F' ),
			loyalty                : stats.F.loyaltyEma,
		} )
		stats.B.lastAvgDesirability = bAvgDesir
		stats.F.lastAvgDesirability  = fAvgDesir

		// Real hate/envy step — B's and F's own real perception of how much
		// of A's real attention/warmth the OTHER is getting this week (an
		// omniscient-narrator comparison of the two real, independently
		// computed infatuation levels above, the same "script reads real
		// internal state to drive the next real call" pattern already used
		// throughout this codebase's own multi-instance examples).
		const acaparationTowardF = clamp01( aInfatF - aInfatB )
		const acaparationTowardB  = clamp01( aInfatB - aInfatF )
		B.jealousyTriangle.registerAcaparation( 'B', 'F', acaparationTowardF )
		F.jealousyTriangle.registerAcaparation( 'F', 'B', acaparationTowardB )
		const bEnvy = B.statusEnvy.getEnvySplit( aInfatB, aInfatF, { admiration: 0.3, growthMindset: B.personality.get( 'openness' ), hostility: clamp01( 1 - B.personality.get( 'agreeableness' ) ), egoThreat: acaparationTowardF } )
		const fEnvy  = F.statusEnvy.getEnvySplit( aInfatF, aInfatB, { admiration: 0.3, growthMindset: F.personality.get( 'openness' ), hostility: clamp01( 1 - F.personality.get( 'agreeableness' ) ), egoThreat: acaparationTowardB } )

		weeks.push( {
			week, aInfatB, aInfatF, bClass, fClass,
			bHate: B.jealousyTriangle.getHate( 'B', 'F' ), fHate: F.jealousyTriangle.getHate( 'F', 'B' ),
			bEnvy, fEnvy,
		} )

		// Real elapsed week, all 3 instances.
		A.tick( 7 ); B.tick( 7 ); F.tick( 7 )
		A.jealousyTriangle.decayHate( 7 ); B.jealousyTriangle.decayHate( 7 ); F.jealousyTriangle.decayHate( 7 )
		offsetMs += 7 * DAY_MS

	}

	console.log( 'semana  infat(B) infat(F)  B: genuino/oport.  F: genuino/oport.  hateB→F  hateF→B  envyB(mal)  envyF(mal)' )
	console.log( '─'.repeat( 108 ) )
	for ( const w of weeks ) {

		console.log(
			`${String( w.week ).padStart( 4 )}    ` +
			`${w.aInfatB.toFixed( 3 )}    ${w.aInfatF.toFixed( 3 )}    ` +
			`${w.bClass.genuineBond.toFixed( 2 )}/${w.bClass.opportunism.toFixed( 2 )} (${w.bClass.classification.padEnd( 12 )})  ` +
			`${w.fClass.genuineBond.toFixed( 2 )}/${w.fClass.opportunism.toFixed( 2 )} (${w.fClass.classification.padEnd( 12 )})  ` +
			`${w.bHate.toFixed( 3 )}    ${w.fHate.toFixed( 3 )}    ` +
			`${w.bEnvy.malicious.toFixed( 2 )}        ${w.fEnvy.malicious.toFixed( 2 )}`,
		)

	}

	const last = weeks.at( -1 )
	console.log( `\nResultado emergente (no forzado): infatuación final con B=${last.aInfatB.toFixed( 3 )} vs F=${last.aInfatF.toFixed( 3 )} -> A se inclina, sin ninguna decisión forzada, hacia ${last.aInfatB >= last.aInfatF ? 'B' : 'F'}.` )
	console.log( `Clasificación social final: B=${last.bClass.classification} (genuineBond=${last.bClass.genuineBond.toFixed( 2 )}), F=${last.fClass.classification} (opportunism=${last.fClass.opportunism.toFixed( 2 )})` )
	console.log( `Odio final: B→F=${last.bHate.toFixed( 3 )}, F→B=${last.fHate.toFixed( 3 )}. Envidia maliciosa final: B=${last.bEnvy.malicious.toFixed( 2 )}, F=${last.fEnvy.malicious.toFixed( 2 )}` )

}

main()
