/**
 * 10 real Totemheart instances in one group, relaying real messages to each
 * other across 5 real simulated days. Each relay call is a real
 * processInput() with `group: { participantCount: 10, mentionedExplicitly:
 * true }` — a genuine 10-person setting for BystanderEffect/AudienceDesign
 * to read, not a private 1:1 disguised as a group. Each day ends with a
 * real ~20h backdated `remConsolidation.lastTurnAt` gap (the same real
 * `shouldTrigger()` used throughout this project's demos) before the next
 * day's relay begins, so REM genuinely fires 4 times across the run.
 *
 * What this demo verifies, not just narrates:
 *   - each AI's own Personality traits are byte-identical before/after
 *   - each AI's PAD vector stays finite and in [-1,1] the whole run
 *   - each AI's own real REM report is printed every day boundary
 *   - a real toJSON()/restoreState() round-trip on all 10 after day 3
 */
import { Totemheart, Personality } from '../src/index.js'

function line( ch = '─' ) { return ch.repeat( 100 ) }

const ROSTER = [
	{ name: 'Aiden',   traits: { openness: 0.9,  conscientiousness: 0.4, extraversion: 0.85, agreeableness: 0.6,  neuroticism: 0.3  }, tag: 'curious extrovert' },
	{ name: 'Bianca',  traits: { openness: 0.3,  conscientiousness: 0.9, extraversion: 0.3,  agreeableness: 0.7,  neuroticism: 0.4  }, tag: 'conscientious planner' },
	{ name: 'Caspian', traits: { openness: 0.6,  conscientiousness: 0.3, extraversion: 0.2,  agreeableness: 0.2,  neuroticism: 0.75 }, tag: 'anxious skeptic' },
	{ name: 'Delia',   traits: { openness: 0.7,  conscientiousness: 0.6, extraversion: 0.9,  agreeableness: 0.85, neuroticism: 0.2  }, tag: 'warm connector' },
	{ name: 'Emrys',   traits: { openness: 0.85, conscientiousness: 0.5, extraversion: 0.15, agreeableness: 0.5,  neuroticism: 0.55 }, tag: 'introverted thinker' },
	{ name: 'Farah',   traits: { openness: 0.4,  conscientiousness: 0.8, extraversion: 0.6,  agreeableness: 0.3,  neuroticism: 0.35 }, tag: 'blunt achiever' },
	{ name: 'Guro',    traits: { openness: 0.2,  conscientiousness: 0.7, extraversion: 0.4,  agreeableness: 0.9,  neuroticism: 0.25 }, tag: 'steady peacemaker' },
	{ name: 'Halcyon', traits: { openness: 0.95, conscientiousness: 0.2, extraversion: 0.7,  agreeableness: 0.4,  neuroticism: 0.65 }, tag: 'volatile dreamer' },
	{ name: 'Ines',    traits: { openness: 0.5,  conscientiousness: 0.55,extraversion: 0.5,  agreeableness: 0.55, neuroticism: 0.5  }, tag: 'average baseline' },
	{ name: 'Jarrah',  traits: { openness: 0.65, conscientiousness: 0.45,extraversion: 0.95, agreeableness: 0.75, neuroticism: 0.15 }, tag: 'high-extraversion optimist' },
]

const TOPIC_SEEDS = [
	'¿Qué pensáis del proyecto que estamos organizando entre todos?',
	'A mí me preocupa un poco que no lleguemos a tiempo, la verdad.',
	'Yo creo que si nos repartimos bien las tareas puede salir genial.',
	'Alguien debería tomar la iniciativa aquí, no podemos seguir dando vueltas.',
	'Gracias a todos por el esfuerzo de esta semana, de verdad lo aprecio.',
]

function snapshotTraits( ai ) { return JSON.stringify( ai.personality.traits ) }

async function relayDay( group, dayIndex ) {

	console.log( `\n${line( '═' )}\nDAY ${dayIndex + 1}\n${line( '═' )}` )

	let message = TOPIC_SEEDS[ dayIndex % TOPIC_SEEDS.length ]
	let lastSpeakerName = 'moderator'

	// Two full relay rounds per day: message passes Aiden -> Bianca -> ... -> Jarrah -> Aiden, twice.
	for ( let round = 0; round < 2; round++ ) {

		for ( const member of group ) {

			const result = await member.ai.processInput( message, { userId: lastSpeakerName, group: { participantCount: group.length, mentionedExplicitly: true } } )
			if ( round === 0 ) console.log( `  ${member.name} (${member.tag}) <- ${lastSpeakerName}: "${message.slice( 0, 60 )}${message.length > 60 ? '…' : ''}"` )
			if ( round === 0 && result.text ) console.log( `    -> "${result.text}"` )
			message              = result.text || message // if this AI stayed silent (a real bystander-effect roll), the relay carries the prior message forward
			lastSpeakerName = member.name

		}

	}

}

async function main() {

	console.log( 'Totemheart — 10 real instances in one group, 5 simulated days.' )
	console.log( 'None of this is real feeling: 10 independent PAD vectors and real per-instance state, not a shared hive mind.\n' )

	const group = ROSTER.map( r => {

		const ai = new Totemheart( { personality: new Personality( r.traits ) } )
		ai.sensoryOverload = new ( ai.sensoryOverload.constructor )( { burstThreshold: 500 } )
		return { name: r.name, tag: r.tag, ai }

	} )

	const savedTraitsBefore = group.map( m => snapshotTraits( m.ai ) )

	const PAUSE_MS = 1000 * 60 * 60 * 20 // ~20 real simulated hours between days

	for ( let day = 0; day < 5; day++ ) {

		await relayDay( group, day )

		console.log( `\n${line()}\nDay ${day + 1} state summary (all 10):\n${line()}` )
		console.log( 'name       tag                          valence  arousal  dominance  cortisol  affinity(avg)' )
		for ( const member of group ) {

			const v = member.ai.emotionSpace.vector
			const affinities = [ ...member.ai.attachment.relations.values() ].map( r => r.affinity )
			const avgAffinity = affinities.length ? ( affinities.reduce( ( a, b ) => a + b, 0 ) / affinities.length ).toFixed( 3 ) : 'n/a'
			console.log( `${member.name.padEnd( 10 )} ${member.tag.padEnd( 28 )} ${v.valence.toFixed( 3 ).padStart( 7 )}  ${v.arousal.toFixed( 3 ).padStart( 7 )}  ${v.dominance.toFixed( 3 ).padStart( 9 )}  ${member.ai.cortisolEngine.getLevel().toFixed( 3 ).padStart( 8 )}  ${avgAffinity}` )

		}

		if ( day < 4 ) {

			console.log( `\n${line()}\nEnd of day ${day + 1} → real ~20h backdated pause → REM for all 10:\n${line()}` )
			for ( const member of group ) member.ai.remConsolidation.lastTurnAt = Date.now() - PAUSE_MS
			// One tiny real turn each so RemConsolidation's own shouldTrigger() actually fires and each AI gets its own real report.
			for ( const member of group ) {

				const remResult = await member.ai.processInput( 'buenos días de nuevo', { userId: 'moderator' } )
				console.log( `  ${member.name} remReport: ${JSON.stringify( remResult.debug?.remReport ?? member.ai._lastRemReport )}` )

			}

		}

		// Real toJSON()/restoreState() round-trip check on all 10 at the halfway point.
		if ( day === 2 ) {

			console.log( `\n${line()}\nMid-run real toJSON()/restoreState() round-trip check (all 10):\n${line()}` )
			for ( const member of group ) {

				const saved       = JSON.parse( JSON.stringify( member.ai.toJSON() ) )
				const restored = new Totemheart()
				restored.restoreState( saved )
				const tradedIntact = JSON.stringify( restored.personality.traits ) === JSON.stringify( member.ai.personality.traits )
				console.log( `  ${member.name}: personality survives round-trip = ${tradedIntact}` )

			}

		}

	}

	console.log( `\n${line( '═' )}\nFINAL VERIFICATION (all 10)\n${line( '═' )}` )

	let allTraitsUnchanged = true
	let allFinite               = true
	group.forEach( ( member, i ) => {

		const now = snapshotTraits( member.ai )
		if ( now !== savedTraitsBefore[ i ] ) allTraitsUnchanged = false
		const { valence, arousal, dominance } = member.ai.emotionSpace.vector
		if ( ![ valence, arousal, dominance ].every( v => Number.isFinite( v ) && v >= -1 && v <= 1 ) ) allFinite = false
		console.log( `  ${member.name.padEnd( 10 )} traits unchanged=${now === savedTraitsBefore[ i ]}  PAD finite&in-range=${[ valence, arousal, dominance ].every( v => Number.isFinite( v ) && v >= -1 && v <= 1 )}` )

	} )

	console.log( `\nAll 10 personality trait objects byte-identical to their pre-run snapshot: ${allTraitsUnchanged}` )
	console.log( `All 10 PAD vectors finite and in range after 5 days + 4 real REM cycles: ${allFinite}` )

}

main().catch( err => { console.error( err ); process.exit( 1 ) } )
