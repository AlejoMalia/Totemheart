/**
 * A real, local, zero-dependency HTTP server exposing a Totemheart
 * instance's live internal state — `getEmotionalState()` and the real
 * decision log `ExplainabilityEngine` already accumulates — so a developer
 * can watch PAD/cortisol/kindling/grief change turn by turn instead of
 * reading it from ad-hoc `console.log` calls in example scripts. No
 * external dependency: built on Node's own `node:http`.
 *
 * `GET /state`       -> real `ai.getEmotionalState()` plus a handful of the
 *                        new-mechanism scalars (grief, shame/guilt,
 *                        egoDepletionBudget, sleepPressure) that
 *                        getEmotionalState() doesn't already expose.
 * `GET /explainability` -> the real, already-tracked decision log.
 * `GET /`             -> a minimal static HTML dashboard that polls `/state`
 *                        every second and renders the real numbers as bars —
 *                        no framework, no build step, no fabricated data.
 */
import { createServer } from 'node:http'

export class DevServer {

	constructor( ai, { port = 4477 } = {} ) {

		this.ai       = ai
		this.port     = port
		this.server = null

	}

	#buildState() {

		const base = this.ai.getEmotionalState()
		return {
			...base,
			grief               : this.ai.griefEngine ? [ ...this.ai.griefEngine.griefs.keys() ].map( userId => ( { userId, ...this.ai.griefEngine.getState( userId ) } ) ) : [],
			shame               : this.ai.shameGuiltSplit?.shame ?? null,
			guilt               : this.ai.shameGuiltSplit?.guilt ?? null,
			egoDepletionBudget  : this.ai.egoDepletionBudget?.budget ?? null,
			sleepPressure        : this.ai.sleepPressure?.getLevel() ?? null,
			// Round-3 additions — real state read live, not from the debug object
			// (which only exists on a processInput() RETURN value, not persisted
			// on the instance) where fields expose a real getter/scalar directly.
			narrativeSelf         : this.ai.narrativeSelfEngine ? { theme: this.ai.narrativeSelfEngine.getCurrentTheme(), coherence: this.ai.narrativeSelfEngine.getCoherence(), chapters: this.ai.narrativeSelfEngine.getChapterCount() } : null,
			ontogenicStage           : this.ai._ontogenicStage ?? null,
			energyLevel                 : this.ai.energyBudget?.getLevel() ?? null,
			significantEventCount         : this.ai._significantEventCount ?? null,
			lastRegulationChoice             : this.ai._lastRegulationChoice ?? null,
			lastCoalitionStrength               : this.ai._lastCoalitionStrength ?? null,
			// Remaining round-3 fields — an earlier pass over this endpoint missed
			// these because their real state lives per-user (a Map keyed by
			// userId) rather than as a single instance-level scalar; exposed here
			// as real per-user snapshots, not aggregated/faked into one number.
			legacyMemory             : this.ai.legacyMemory ? this.ai.legacyMemory.entries.map( e => ( { cue: e.cue, weight: e.weight, generation: e.generation } ) ) : [],
			betrayalTraumaTrace         : this.ai.betrayalTraumaTrace ? [ ...this.ai.betrayalTraumaTrace.traces.entries() ].map( ( [ userId, trace ] ) => ( { userId, ...trace } ) ) : [],
			culturalScriptLibrary          : this.ai.culturalScriptLibrary?.getScripts() ?? [],
			somaticMarkerNetwork               : this.ai.somaticMarkerNetwork ? { markerCount: this.ai.somaticMarkerNetwork.getMarkerCount() } : null,
			powerDynamicsEngine                   : this.ai.powerDynamicsEngine ? [ ...this.ai.powerDynamicsEngine.power.entries() ].map( ( [ userId, power ] ) => ( { userId, power } ) ) : [],
			insightGenerator                         : this.ai.insightGenerator ? [ ...this.ai.insightGenerator.patterns.keys() ].map( name => ( { name, strength: this.ai.insightGenerator.getPatternStrength( name ) } ) ) : [],
			colony                                      : this.ai.colony ? { memberCount: this.ai.colony.getMemberCount(), coherence: this.ai.colony.computeColonyCoherence() } : null,
			// GlobalWorkspace's competition itself is
			// turn-scoped (needs this turn's candidates, only exists on a
			// processInput() return value, same reason narrativeSelf's own
			// per-turn debug fields aren't listed here either) — but the two
			// stateful mechanisms behind it have real, persisted, instance-level
			// state to show.
			primaryDrives                                 : this.ai.primaryDrives?.drives ?? null,
			immuneExposure                                   : this.ai.emotionalImmuneSystem?.exposure ?? null,
			immuneDampening                                    : this.ai.emotionalImmuneSystem?.getDampeningFactor() ?? null,
		}

	}

	#handle( req, res ) {

		if ( req.url === '/state' ) {

			res.writeHead( 200, { 'Content-Type': 'application/json' } )
			res.end( JSON.stringify( this.#buildState() ) )
			return

		}
		if ( req.url === '/explainability' ) {

			res.writeHead( 200, { 'Content-Type': 'application/json' } )
			res.end( JSON.stringify( this.ai.explainability?.decisionLog ?? [] ) )
			return

		}
		if ( req.url === '/' ) {

			res.writeHead( 200, { 'Content-Type': 'text/html; charset=utf-8' } )
			res.end( DASHBOARD_HTML )
			return

		}
		res.writeHead( 404 )
		res.end( 'Not found' )

	}

	start() {

		return new Promise( resolve => {

			this.server = createServer( ( req, res ) => this.#handle( req, res ) )
			this.server.listen( this.port, () => resolve( this ) )

		} )

	}

	stop() {

		return new Promise( resolve => {

			if ( !this.server ) return resolve()
			this.server.close( () => resolve() )

		} )

	}

}

const DASHBOARD_HTML = `<!doctype html>
<html><head><meta charset="utf-8"><title>Totemheart devtools</title>
<style>
body{font-family:monospace;background:#111;color:#eee;padding:1rem}
.bar{height:14px;background:#333;margin:2px 0;position:relative}
.fill{height:100%;background:#5ac8fa}
.row{display:grid;grid-template-columns:180px 1fr 60px;gap:8px;align-items:center;margin:4px 0}
</style></head>
<body>
<h2>Totemheart — live state</h2>
<div id="rows"></div>
<script>
async function tick() {
  const state = await fetch('/state').then(r => r.json())
  const rows = []
  const scalar = (label, value, max = 1) => {
    const pct = Math.max(0, Math.min(100, ((value + (max<0?1:0)) / (max*2||1)) * 100))
    rows.push('<div class="row"><span>' + label + '</span><div class="bar"><div class="fill" style="width:' + pct + '%"></div></div><span>' + Number(value).toFixed(3) + '</span></div>')
  }
  scalar('valence', state.vector.valence, 1)
  scalar('arousal', state.vector.arousal * 0.5, 1)
  scalar('dominance', state.vector.dominance, 1)
  if (state.shame !== null) scalar('shame', state.shame, 0.5)
  if (state.guilt !== null) scalar('guilt', state.guilt, 0.5)
  if (state.sleepPressure !== null) scalar('sleepPressure', state.sleepPressure, 0.5)
  document.getElementById('rows').innerHTML = rows.join('')
}
tick(); setInterval(tick, 1000)
</script>
</body></html>`
