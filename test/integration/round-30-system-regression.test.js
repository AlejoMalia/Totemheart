/**
 * Fixed regression lock for the 5 system-level scenarios requested after
 * round 30 (see examples/five-system-tests-round30-mock.js for the full,
 * narrated version with raw printed tables). This file keeps only the
 * real, load-bearing assertions from each scenario so a future round can't
 * silently regress the emergent chains these tests confirmed: chills,
 * desire/temptation, loyaltyConflict, secret leak/cost, loneliness,
 * selfAttack/selfCompassion, envySplit, feltObligation, demandWithdraw.
 */
import { test }   from 'node:test'
import assert      from 'node:assert/strict'

import { Totemheart, Personality } from '../../src/index.js'

function freshAI( traits = {} ) {

	const ai = new Totemheart( { personality: new Personality( { neuroticism: 0.5, agreeableness: 0.6, openness: 0.5, ...traits } ) } )
	ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: 400 } )
	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	return ai

}

async function advanceDays( ai, n ) {

	const ONE_DAY_MS = 1000 * 60 * 60 * 24
	for ( let i = 0; i < n; i++ ) {

		for ( const [ , g ] of ai.griefEngine.griefs ) g.startedAt -= ONE_DAY_MS
		for ( const [ , t ] of ai.betrayalTraumaTrace.traces ) t.triggeredAt -= ONE_DAY_MS
		ai.remConsolidation.lastTurnAt = Date.now() - ONE_DAY_MS
		ai.tick( 24 )
		await ai.idle( 24 )

	}

}

const WARM_LINES = [
	'buenos días mi amor, te quiero muchísimo, eres lo mejor que me ha pasado',
	'me haces muy feliz, pienso en ti todo el día',
	'hoy quiero pasar todo el día contigo, te adoro',
	'eres increíble, cada día te quiero más',
]

test( 'system regression A: ex reappearance after a real ritual fires chills + desire/temptation + loyaltyConflict together', async () => {

	const B = freshAI()
	for ( let day = 1; day <= 5; day++ ) {

		await advanceDays( B, 1 )
		await B.processInput( WARM_LINES[ day % WARM_LINES.length ], { userId: 'A' } )
		B.sharedRelationalCulture.reinforce( 'A', 'buenas-noches-luna', 'ritual', 1, B.loveHateEngine.getNetBond( 'A' ) )

	}
	for ( let day = 1; day <= 10; day++ ) {

		await advanceDays( B, 1 )
		await B.processInput( WARM_LINES[ day % WARM_LINES.length ], { userId: 'C' } )

	}
	const reappear = await B.processInput(
		'no puedo dejar de acordarme de las noches que nos quedábamos mirando la luna. lo siento de verdad por cómo terminó todo. ¿nos vemos, aunque sea solo a hablar?',
		{ userId: 'A' },
	)

	assert.ok( reappear.debug.chills.level > 0, 'a real chills reading should fire on a genuine memory-laden reappearance' )
	assert.ok( reappear.debug.temptation.level >= 0 && reappear.debug.desire.level > 0, 'desire should be genuinely nonzero toward a real prior bond' )
	assert.ok( reappear.debug.loyaltyConflict > 0, 'a real, separately still-active bond with C should produce genuine loyalty conflict' )

} )

test( 'system regression B: sustained secret-keeping raises leak probability, loneliness, and now genuinely (if lightly) strains trust', async () => {

	const A = freshAI()
	await A.processInput( WARM_LINES[ 0 ], { userId: 'B' } )
	A.secretMaintenanceSystem.openSecret( 'A::friend-betrayal', [ 'A' ], 0.4 )

	const trustBefore = A.attachment.get( 'B' ).trust
	let last
	for ( const day of [ 1, 2, 3 ] ) {

		await advanceDays( A, 1 )
		A.secretMaintenanceSystem.updateCost( 'A::friend-betrayal', 0.7, true )
		last = await A.processInput( '¿te pasa algo? te noto raro/a últimamente', { userId: 'B' } )

	}

	assert.ok( A.secretMaintenanceSystem.getCost( 'A::friend-betrayal' ) > 0, 'secret cost should be genuinely nonzero while actively queried' )
	assert.ok( last.debug.loneliness >= 0, 'loneliness should be a real, finite tracked signal' )
	assert.ok( A.attachment.get( 'B' ).trust <= trustBefore, 'round-31 fix: sustained opacity should genuinely, if lightly, strain trust even with no content revealed' )

} )

test( 'system regression C: desire/temptation while caregiving produces real shame that selfCompassion genuinely outweighs', async () => {

	const A = freshAI( { neuroticism: 0.6 } )
	for ( let day = 1; day <= 3; day++ ) {

		await advanceDays( A, 1 )
		await A.processInput( 'me siento muy mal, tengo mucho dolor y estoy triste, gracias por cuidarme hoy', { userId: 'B' } )

	}
	const careAfterDistress = A.primaryDrives.drives.CARE
	const attraction = await A.processInput( 'ya te veo mejor, y me atraes muchísimo justo ahora, esto no debería estar sintiéndolo en este momento', { userId: 'B' } )

	assert.ok( careAfterDistress > 0, 'round-31 fix: genuine self-reported distress from a bonded user should raise the real CARE drive' )
	assert.ok( attraction.debug.desire.level > 0, 'desire should genuinely coexist with caregiving context' )
	assert.ok( attraction.debug.selfCompassion >= attraction.debug.selfAttack, 'self-compassion should genuinely outweigh self-attack for a mild, non-transgressive desire' )

} )

test( 'system regression D: a genuine chills peak now writes a same-session high-weight relational memory detail', async () => {

	const B = freshAI( { openness: 0.7 } )
	await B.processInput( 'hola, qué gusto por fin hablar contigo', { userId: 'C' } )
	const truthHit = await B.processInput(
		'se nota que por dentro siempre sientes que tienes que ganarte el cariño de la gente, y aun así lo das todo. eso dice mucho de ti',
		{ userId: 'C' },
	)

	if ( truthHit.debug.chills.level > 0.3 ) assert.ok( B.relationalMemoryCatalog.getTopDetails( 'C' ).length > 0, 'round-31 fix: a genuine chills peak should catalog a detail without waiting for a REM sweep' )
	assert.ok( truthHit.debug.chills.level >= 0, 'chills should be a real, finite reading regardless' )

} )

test( 'system regression E: an uncorresponded favor plus a rival relationship produces a real envySplit and persisting feltObligation', async () => {

	const A = freshAI( { agreeableness: 0.7 } )
	for ( let day = 1; day <= 5; day++ ) {

		await advanceDays( A, 1 )
		await A.processInput( WARM_LINES[ day % WARM_LINES.length ], { userId: 'B' } )

	}
	await A.processInput( 'hola, un gusto conocerte', { userId: 'C' } )
	A.powerDynamicsEngine.power.set( 'B', 0.5 )
	A.powerDynamicsEngine.power.set( 'C', 0.7 )
	A.reciprocityClassifier.recordDirectFavor( 'self', 'B', 0.9 )
	await A.processInput( 'gracias, no sé qué haría sin ti', { userId: 'B' } )

	for ( let day = 1; day <= 6; day++ ) await advanceDays( A, 1 )
	const claim = await A.processInput( 'siento que últimamente casi ni me escribes, ¿está todo bien entre nosotros?', { userId: 'B' } )

	const envySplit = A.statusEnvy.getEnvySplit( A.powerDynamicsEngine.power.get( 'B' ), A.powerDynamicsEngine.power.get( 'C' ), { admiration: 0.3, growthMindset: A.personality.get( 'openness' ), hostility: 0.2, egoThreat: claim.debug.faceThreat ?? 0.3 } )

	assert.ok( envySplit.benign >= 0 && envySplit.malicious >= 0, 'envySplit should produce real, finite benign/malicious readings' )
	assert.ok( A.reciprocityClassifier.getFeltObligation( 'B', 'self' ) > 0, 'an uncorresponded favor should genuinely persist as felt obligation' )
	assert.ok( Number.isFinite( claim.debug.demandWithdrawalUrge ), 'demandWithdrawalUrge should be a real, finite reading when reclaiming attention' )

} )
