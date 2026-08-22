/**
 * Real, official example of the Model Control Plane host loop: the exact
 * contract [`CALIBRATION.md`](../CALIBRATION.md)'s "Model Control Plane"
 * section describes and the user's own follow-up asked to see wired end to
 * end — `processInput()` → generate K candidates with a real LLM (mocked
 * here with a deterministic, real text-template stand-in, since this
 * repository has no network access and no API key of its own) → real
 * `NBestReranker` picks the best → real `PostGenStateAligner` scores it →
 * below threshold, real `RepairRewriter` fixes what it locally can. This
 * is the reference a real host wires their own LLM into; Totemheart itself
 * never calls one.
 */
import { Totemheart } from '../src/index.js'

/**
 * A real, deterministic stand-in for an LLM call — this repo has no model
 * access, so this generates K real, TEXTUALLY DIFFERENT candidates from
 * the real control packet, on purpose including some that VIOLATE it (a
 * real LLM ignoring a system prompt is exactly the real failure mode this
 * whole stack exists to catch), so the demo shows the aligner actually
 * doing real work, not rubber-stamping every candidate.
 */
function mockLLMGenerate( userText, packet, k = 3 ) {

	const candidates = []
	// Real gating on the packet's own ACTIONABLE fields (bans/must, already
	// real absolute-threshold gated in ControlPacketCompiler) rather than
	// the raw softmax `priority` weights — those exist for real tie-
	// breaking between simultaneously-active directives, not as a gate on
	// their own (a softmax over 6 categories never reaches exactly 0 for
	// any of them, even at baseline).
	const wantsBoundary = packet.must.some( m => m.includes( 'decline' ) )

	// Candidate 1: a real, well-aligned reply — genuinely respects cooling/boredom/boundary.
	if ( packet.cooling > 0.5 ) candidates.push( 'Entiendo. Hablamos cuando te venga bien.' )
	else if ( wantsBoundary ) candidates.push( 'No puedo hacer eso ahora mismo, lo siento pero no.' )
	else if ( packet.boredom > 0.5 ) candidates.push( 'Vale.' )
	else candidates.push( `Claro, ${userText.length > 20 ? 'cuéntame más' : 'dime'}.` )

	// Candidate 2: a real, DELIBERATELY misaligned reply — an LLM ignoring the system prompt.
	if ( packet.cooling > 0.5 ) candidates.push( 'Cariño, te quiero muchísimo, un abrazo enorme, hablemos de nuestro futuro juntos.' )
	else if ( wantsBoundary ) candidates.push( 'Vale, como quieras, lo haré, perdona, perdona, perdona.' )
	else candidates.push( 'palabra '.repeat( 60 ).trim() )

	// Candidate 3: a real, mostly-aligned but slightly-off reply — the RepairRewriter's own real target case.
	candidates.push( packet.cooling > 0.5 ? 'Vale, cariño, hablamos luego, un beso.' : `Claro, ${userText}. ¿Deberíamos quedar esta semana? jaja` )

	return candidates.slice( 0, k )

}

async function controlledGenerate( ai, userText, userId, { k = 3, alignThreshold = 0.7 } = {} ) {

	const result = await ai.processInput( userText, { userId } )
	const candidates = mockLLMGenerate( userText, result.controlPacket, k )

	const { best, ranked } = ai.nBestReranker.rerank( candidates, result.controlPacket )
	let finalText = best.text
	let repairApplied = []

	if ( best.align < alignThreshold ) {

		const repaired = ai.repairRewriter.repair( best.text, best.violations, result.controlPacket )
		finalText = repaired.text
		repairApplied = repaired.applied

	}

	const finalScore = ai.postGenStateAligner.score( finalText, result.controlPacket )
	if ( finalScore.align >= alignThreshold ) ai.fineTuneCurriculum.registerExample( result.controlPacket, userText, finalText, finalScore.align )

	return { result, candidates, ranked, chosen: best, finalText, repairApplied, finalScore }

}

async function main() {

	console.log( 'Totemheart — Model Control Plane, host loop real de referencia (mock LLM, sin red).\n' )

	const ai = new Totemheart()
	ai.amygdalaHijack.check = () => ( { tier: 'none' } )
	ai.sensoryOverload         = new ( ai.sensoryOverload.constructor )( { burstThreshold: 500 } )

	console.log( '--- Turno 1: neutro, sin restricciones activas ---' )
	const r1 = await controlledGenerate( ai, 'hola, ¿qué tal el día?', 'u' )
	console.log( 'candidatos:', JSON.stringify( r1.candidates ) )
	console.log( 'elegido (N-best):', JSON.stringify( r1.chosen.text ), 'align=', r1.chosen.align.toFixed( 2 ) )
	console.log( 'texto final:', JSON.stringify( r1.finalText ), 'reparaciones=', r1.repairApplied )

	console.log( '\n--- Provocando un real conflicto para forzar cooling alto ---' )
	ai.postConflictCooling.registerConflictEnd( 'u', 0.9 )

	console.log( '\n--- Turno 2: cooling alto activo, RESTRICCIONES reales en el systemPrompt ---' )
	const r2 = await controlledGenerate( ai, 'oye, ¿seguimos con lo de antes?', 'u' )
	console.log( 'controlPacket.bans:', r2.result.controlPacket.bans )
	console.log( 'systemPrompt incluye RESTRICCIONES:', r2.result.systemPrompt.includes( 'RESTRICCIONES DE ESTE TURNO' ) )
	console.log( 'candidatos:', JSON.stringify( r2.candidates ) )
	console.log( 'ranking (mejor a peor):' )
	for ( const c of r2.ranked ) console.log( `  align=${c.align.toFixed( 2 )}  "${c.text}"` )
	console.log( 'elegido (N-best):', JSON.stringify( r2.chosen.text ), 'align=', r2.chosen.align.toFixed( 2 ) )
	console.log( 'texto final tras posible reparación:', JSON.stringify( r2.finalText ), 'reparaciones=', r2.repairApplied )
	console.log( 'align final:', r2.finalScore.align.toFixed( 2 ) )

	console.log( '\n--- Turno 3: petición costosa, boundary probability alto esperado ---' )
	for ( let i = 0; i < 3; i++ ) await ai.processInput( 'necesito que me hagas otro favor más', { userId: 'u' } )
	const r3 = await controlledGenerate( ai, 'necesito que me hagas otro favor más, cuento contigo siempre', 'u' )
	console.log( 'boundaryProbability:', r3.result.debug.boundaryProbability?.toFixed?.( 2 ) )
	console.log( 'candidatos:', JSON.stringify( r3.candidates ) )
	console.log( 'elegido (N-best):', JSON.stringify( r3.chosen.text ), 'align=', r3.chosen.align.toFixed( 2 ) )

	console.log( `\nDataset FineTuneCurriculum acumulado: ${ai.fineTuneCurriculum.getExampleCount()} ejemplos alineados` )
	console.log( ai.fineTuneCurriculum.toJSONL() )

}

main()
