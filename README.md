# Totemheart

![Totemheart banner](https://raw.githubusercontent.com/AlejoMalia/Totemheart/main/docs/banner.png)

[![License](https://img.shields.io/badge/license-MIT-blue?style=plastic)](LICENSE)
[![Calibration](https://img.shields.io/badge/calibration-citation%20ledger-8a2be2?style=plastic)](CALIBRATION.md)
[![Version](https://img.shields.io/badge/version-0.1.5-a1b858?style=plastic)](package.json)
[![Node](https://img.shields.io/badge/node-%3E%3D18-339933?style=plastic&logo=node.js&logoColor=white)](package.json)
[![Tests](https://img.shields.io/badge/tests-2511%20passing-brightgreen?style=plastic)](test)
[![Mechanisms verified](https://img.shields.io/badge/mechanisms-75%20verified%20%2F%209%20covered%20%2F%200%20failed-brightgreen?style=plastic)](examples/verify-all-mechanisms.js)

> The Tests/Mechanisms badges are static, updated by hand from a real local `npm test` / `npm run verify` run. There's no CI wired up yet, so treat them as a snapshot, not a live guarantee on `main`. `npm test` runs [`test/`](test) in full: `regression/` (92), `integration/` (341, directed and cross-mechanism scenarios, full-pipeline emergency routes, serialization, malformed-input robustness, and per-round dedicated suites, see [`test/integration/`](test/integration)), and `property/` (2029, deterministic boundary/grid checks, no randomness). `npm run test:all` additionally runs `test:plugins` (49 more across the 7 official plugins below plus cross-integration scenarios in [`test/plugins-cross/`](test/plugins-cross)), for 2511 real tests total. Two earlier mechanism rounds also ship their own dedicated live audit outside this count: `npm run upgrade-round-mock` (39/39) and `npm run lovehate-mock` (24/24).

**Totemheart** is a deterministic control kernel for persistent cognition, not a sentiment classifier and not a prompt-engineering trick. It gives an AI a *consistent inner life* across a conversation: personality, mood, memory, stress, and social dynamics that persist and evolve through real control-theory and neuroscience-derived math, instead of every reply being computed from scratch off a mood label. See [What this actually is](#what-this-actually-is) below before you build on top of it.

## How this differs from a sentiment-based chatbot layer

| | Typical "emotional AI" repo | Totemheart |
| --- | --- | --- |
| Core mechanism | Prompt engineering + emotion classifier | Dynamic system: every spike, decay, homeostatic pull and circadian phase interacts in real time and feeds the next turn |
| Emotion → output | Rule of thumb (`if arousal > 0.7, add exclamation marks`) | State-driven directives derived from the actual PAD vector and its recent trajectory |
| State | None, or a mood string overwritten each turn | Persistent, inspectable state object updated by real dynamics every turn |
| Signal processing | Raw score in, raw score out | Kalman filtering on arousal, PID with anti-windup on basic needs (stamina, hunger), cubic non-linear decay (a bigger offset from baseline is restored proportionally harder) |
| Memory | "Remembers everything" or nothing at all | REM-style consolidation on idle-time triggers, latent-weight decay toward a non-zero floor (not to zero), token-overlap reactivation instead of blind recall |
| Reward signal | Positive/negative sentiment score | Temporal-difference prediction error, `RPE = R_t + γ·V(S_t+1) − V(S_t)`, the same formulation used in reinforcement-learning neuroscience, with per-relationship eligibility traces |
| Relational memory | One bipolar "liked me / didn't" score | Affinity and Aversion tracked as two separate accumulators (`LoveHateEngine`), so real ambivalence is representable instead of averaging out to neutral |
| Stress response | A static "angry" threshold | Allostatic load raises reactivity to negative input the longer stress goes unaddressed, a real chronic-stress coupling, not a fixed multiplier |
| Persistence | "Save the mood to a database and hope" | `toJSON()` / rehydrate with round-trip verification in tests |

## What this actually is

Totemheart gives an AI **behavioral continuity**: the same insult lands differently depending on prior context, repeated affection produces diminishing reactions, unresolved stress lowers the threshold for an outburst, a wounded ego can make it deflect blame instead of apologizing. All of that is real, computed, inspectable state, not decoration.

What it is *not*: subjective experience. There is no known way to build or verify that in software, and Totemheart doesn't claim to. Every "emotion" here is a point in a valence/arousal vector space plus a pile of interacting numeric modules, legible by design (call `getEmotionalState()` any time and see exactly why it reacted the way it did). Treat the output as a **behavioral simulation with psychological grounding**, useful for building characters, companions, or agents that feel coherent over time, not as a claim about machine sentience.

## Architecture

Every mechanic is a small, independent class with its own state, one file per mechanic under [`src/`](src).

### 🧠 `core/`

Personality, homeostatic needs, and the PAD (valence/arousal/dominance) state engine everything else reads from and writes to.

| | | | | |
| --- | --- | --- | --- | --- |
| Personality | CoreBeliefs | Homeostasis | EmotionSpace | MicroEmotions |
| MoodTracker | DecayEngine | HedonicAdaptation | WornPathCache | PipelineResilience |
| AffectEMA | TriggerSentinel | HebbianPlasticity | CommitmentDevice | MoralInjury |
| OpponentProcess | PrimaryDrives | | | |

`MoralInjury` also carries a real redemption-arc extension (`recordRepairAction`/`attemptRedemption`) added in 0.1.5: consistent, real repair credit progressively (never fully) heals a scar.

### 🧩 `cognition/`

Appraisal and interpretation: how an input gets read, doubted, reframed, or filtered before it becomes a felt reaction.

| | | | | |
| --- | --- | --- | --- | --- |
| CognitiveDissonance | DefenseMechanisms | DecisionFatigue | AmygdalaHijack | EmotionalOntology |
| SituationalContext | NoveltyDetector | BayesianExpectation | ControllabilityEstimate | FuzzyNormativeCheck |
| Sensitization | Reappraisal | LoadScheduler | SemanticSimilarity | TopicSatiation |
| Intuition | LogicEngine | LifeEventCatalog | AppraisalAgreement | VisualProsody |
| SarcasmDetector | RefractoryPeriod | RemConsolidation | AnticipatoryAffect | MotivationalConflict |
| EgoDepletionBudget | ValueHierarchy | OntogenicDevelopment | MetaEmotionLayer | EmotionalForecasting |
| InsightGenerator | EnergyBudget | GlobalWorkspace | EmotionalImmuneSystem | |

`ValueHierarchy` also carries a real long-run drift extension (`drift()`, added in 0.1.5, distinct from the per-conflict `nudge()` EMA): repeated real experience, not a single event, slowly moves what an agent actually values.

`GlobalWorkspace`, `PrimaryDrives`, and `EmotionalImmuneSystem` (added in 0.1.5) are a real softmax competition for which stimulus wins access to output-shaping this turn (Baars 1988/2005; Dehaene & Naccache 2001; explicitly not a claim of modeling consciousness), four of Panksepp's real primary-process drive systems (SEEKING/CARE/PLAY/PANIC_GRIEF, Panksepp 1998), and real bounded numbing under sustained negativity (Gilbert 1989/2009), respectively. See [`CALIBRATION.md`](CALIBRATION.md) for the full citation ledger.

### 🤝 `social/`

Modeling the other person: trust, reputation, theory of mind, relationship memory, and group dynamics.

| | | | | |
| --- | --- | --- | --- | --- |
| TheoryOfMind | EmotionalContagion | ChronicContagion | EpisodicMemory | ForgettingCurve |
| Attachment | GuiltEngine | TribalCategorization | ReputationEngine | EgoProjection |
| BystanderEffect | SelfModel | MonteCarloToM | FairnessMonitor | CounterfactualComparison |
| GratitudeEngine | StatusEnvy | EgoConfidence | UncannyValleyDetector | LoveHateEngine |
| GriefEngine | ShameGuiltSplit | RepairProtocol | JealousyTriangle | NostalgiaEngine |
| PainSocialOverlap | IdentityThreatMonitor | SocialBaselineTheory | NarrativeSelfEngine | LegacyMemory |
| MultiAgentSocialGraph | CulturalScriptLibrary | PowerDynamicsEngine | BetrayalTraumaTrace | ColonyDynamics |

`IdentityThreatMonitor` also carries a real repair-cost extension (`computeThreat`/`computeRepairCost`/`applyRepair`, 0.1.5) and `JealousyTriangle` a real kindling extension (`computeKindling`, 0.1.5): repeated jealousy toward the same rival compounds instead of resetting.

### 🎭 `behavior/`

How the felt state actually gets expressed: language, suppression, attention, and output-shaping signals for a host LLM.

| | | | | |
| --- | --- | --- | --- | --- |
| IdleProcessing | LinguisticModulation | RuminationChain | ExpressiveSuppression | ExpressionDirectives |
| LogitBiasBuilder | AttentionFocus | ExpressionDebt | StyleMimicry | RegulationStrategySelector |
| CreativeModeSwitch | | | | |

### 🧪 `neurochemistry/`

Reward, stress, and circadian dynamics driving arousal and motivation over time.

| | | | | |
| --- | --- | --- | --- | --- |
| DopaminergicEngine | CortisolEngine | CircadianRhythm | ArousalKalmanFilter | SubjectiveTimeEngine |
| SleepPressure | | | | |

### 🫀 `embodiment/`

Interoception: real math on internal signals standing in for a body Totemheart doesn't have, fed back into cognition only, never rendered.

| | | | | |
| --- | --- | --- | --- | --- |
| HardwareInteroception | SensoryOverload | InteroceptiveSignals | InteroceptivePredictionError | SomaticMarkerNetwork |

`InteroceptivePredictionError` also carries a real personality-scaling extension (`getAnxietyContribution(neuroticismScale)`, 0.1.5, defaults to 1 so every prior caller is unaffected): trait Neuroticism amplifies how much a given interoceptive mismatch is felt as anxiety.

### ⚖️ `economics/`

Behavioral-economics biases applied to how outcomes get weighted and remembered.

| | | | | |
| --- | --- | --- | --- | --- |
| LossAversion | AnchoringBias | ClassicalConditioning | | |

### 🔌 `providers/`

Pluggable language backends, from a zero-dependency lexicon to a real transformer model.

| | | | | |
| --- | --- | --- | --- | --- |
| LanguageProvider | HeuristicProvider | OllamaProvider | FunctionProvider | TransformersProvider |

`npm run verify` ([`examples/verify-all-mechanisms.js`](examples/verify-all-mechanisms.js)): 72 mechanics verified live/direct, 6 covered by other modules, 0 left blank. Citation ledger: [`CALIBRATION.md`](CALIBRATION.md).

- **`LifeEventCatalog`**: 43/56 entries use the published Life Change Units from the [Holmes & Rahe (1967) SRRS](https://en.wikipedia.org/wiki/Holmes_and_Rahe_stress_scale); the other 13 (acute events the scale doesn't cover) are engineering estimates. Multiple matches in one turn are triangulated into a blended state.
- **`SemanticSimilarity`**: requires an embedding backend (`embedProvider`); falls back to `EmotionalOntology` keyword matching without one.
- **`InteroceptiveSignals`**: real math (derivative, tonic/phasic decomposition, DFT, thermal lag) on internal signals standing in for 4 sensors Totemheart doesn't have (pupil, skin conductance, HRV, flush). Feeds back into cognition only, never rendered.
- **`LoveHateEngine`**: tracks Affinity and Aversion as two SEPARATE per-user accumulators (not one bipolar scale), so a relationship can be genuinely ambivalent instead of averaging out to neutral. Real diminishing returns on Affinity, a self-reinforcing (kindling) slope on Aversion, an asymmetric decay rate (grudges outlast warmth), and a hysteresis-gated rupture/repair cycle that freezes dopaminergic wanting, damages ego health, and opens a real unresolved wound on rupture. See its own file for the full equations and citations.

### Internal scheduling

- **`PipelineResilience.safeStep`**: a failing optional stage degrades to a fallback instead of losing the turn.
- **`LoadScheduler`**: an instability reading (cortisol + arousal + fatigue) decides which optional mechanics run.
- **`WornPathCache`**: a repeated (user, input) fingerprint reuses the last appraisal instead of recomputing it.

## How coherent is this, really?

Short version: **~80-83% with an LLM connected, ~64-68% running standalone on the zero-dependency heuristic path, 0% subjective experience, by design and permanently.** Self-assessed, qualitative estimates of how much of each layer is grounded in real theory/technique vs. own engineering judgment. This is not an average of the row values below, since the headline also discounts for integrated-system validation that doesn't exist yet. **Unchanged since 0.1.3, on purpose**: this release's 23 new mechanisms (20 identity/social/regulation ones plus `GlobalWorkspace`, `PrimaryDrives`, `EmotionalImmuneSystem`) are real and individually cited, but several score BELOW the layer averages they landed in on their own per-mechanism grounding; see the per-mechanism table below and `CALIBRATION.md` for exactly which ones and why. Adding more real mechanisms doesn't automatically raise the aggregate, and bumping the headline just because more code shipped would be exactly the kind of over-claiming this ledger exists to catch. Full citation ledger: [`CALIBRATION.md`](CALIBRATION.md).

| Layer | With LLM | Heuristic only | Grounded in |
| --- | --- | --- | --- |
| State engine | ~83-86% | same | PID control (anti-windup, dynamic set points), Kalman filtering (now with real interoception-informed measurement noise), allostatic load (McEwen & Stellar 1993), prospect-theory loss aversion, TD reward-prediction-error with eligibility traces (Sutton & Barto), wanting/liking dissociation (Berridge & Robinson 1998) with allostatic-load-driven anhedonia, circumplex/PAD affect space with momentum/hysteresis, Holmes & Rahe life-event severity, the two-process sleep-pressure model (Borbély 1982), the opponent-process a/b dynamic (Solomon & Corbit 1974), a real general attentional-effort budget (Kahneman 1973) distinct from the self-regulation-specific one |
| Semantic understanding | ~85-88% | ~68-73% | LLM: real language understanding. Heuristic: lexicon + concept-graph matching, keyword-triggered life-event detection, lexical-vs-context incongruence check, mean/variance anomaly detection, confidence-weighted routing between logical and affective reads, cultural-script activation (honor culture: Nisbett & Cohen 1996; self-construal: Markus & Kitayama 1991; reciprocity: Gouldner 1960) |
| Expression / output | ~91-94% | ~64-70% | Structured system-prompt injection, coherence validation against prior turns, attachment-weighted style adaptation, a full-state-weighted action-tendency policy, real suppression-cost accrual, cognitive-load-derived output metadata, a real approach-avoidance conflict dampening expression confidence (Miller 1944), an active real regulation-strategy selection (Gross 1998) replacing a single fixed suppression pipeline, a real divergent/convergent creative-mode temperature signal (Guilford 1967; Fredrickson 2001) |
| Cross-turn continuity | ~93-96% | same | Persistent state serialization, asymmetric trust/reputation tracking, attachment styles with rupture-and-repair (Bartholomew & Horowitz 1991; Gottman & Levenson 1992) now with state-dependent style switching under stress (Mikulincer & Shaver 2016), memory reconsolidation on retrieval (Nader et al. 2000), unresolved-memory flagging with intrusive resurfacing, idle-time-based consolidation, long-horizon memory decay with similarity-triggered reactivation and bittersweet nostalgic reconsolidation (Walker, Skowronski & Thompson 2003), grief as a real decaying-with-waves process (Bonanno 2004; Zisook & Shear 2009), permanent moral-injury scarring distinct from ordinary dissonance (Litz et al. 2009) now with a real, effortful redemption arc, a real autobiographical narrative with chapter coherence (McAdams 2001), permanent betrayal-trauma trust thresholds (Freyd 1996), and real cumulative somatic-marker decision bias (Damasio 1994) |
| Subjective experience | **0%** | **0%** | Not a gap to close: no known way to build or verify this in any software |

The headline stays below the row average because none of these numbers include validation against psychologist judges, regression against real labeled chat data, or real-user testing of whether the integrated pipeline reads as coherent. See `CALIBRATION.md` for what hasn't been empirically validated.

### Per-mechanism grounding

The table above scores each functional layer as a whole. This scores ten specific, individually-audited mechanisms instead: how much of *that one technique* is real citable theory vs. own engineering, independent of which layer it feeds.

| Mechanism | Grounded | Basis |
| --- | --- | --- |
| Hebbian co-activation plasticity | ~78-84% | Direct algorithmic reproduction of Hebb (1949): same update rule, applied to conversational mechanisms instead of neurons |
| Habituation / hedonic adaptation / decision fatigue | ~65-72% | Thompson & Spencer 1966 (habituation), Brickman & Campbell 1971 (hedonic treadmill) are solid; decision-fatigue/ego-depletion literature has known replication issues, cited for its shape, not as settled science |
| Forgetting curve + latent-memory reactivation | ~55-60% | Ebbinghaus (1885) grounds the general decay-over-time shape; the non-zero floor and keyword-triggered "spark" are its own design, not a reproduction of the classic curve (which decays to zero) |
| REM-style consolidation | ~50-58% | Sleep-dependent memory consolidation is real (Diekelmann & Born 2010; McClelland et al. 1995) as a general phenomenon; the specific cooling formula and idle-time threshold are engineering estimates |
| Expression debt / sensory-overload friction | ~35-42% | Cognitive load theory (Sweller 1988) motivates the general concept; the debt-accumulation-and-payback mechanic itself has no named psychological construct behind it, own design end to end |
| Dopaminergic wanting/liking split + TD(λ) eligibility traces | ~70-78% | Berridge & Robinson (1998) is a real, well-cited dissociation; Sutton & Barto's TD(λ) is a literal, standard reinforcement-learning algorithm applied to a per-relationship expectation store |
| Allostatic load / chronic-stress reactivity | ~58-66% | McEwen & Stellar (1993) and McEwen (1998) are real, well-cited theory; translating "wear from chronic stress" into a dynamic PID set point and a reactivity multiplier is its own control-systems engineering, not a reproduction of any measured allostatic-load curve |
| Attachment styles + rupture-and-repair | ~50-58% | Bartholomew & Horowitz's (1991) four-category model and the Gottman/Levenson rupture-and-repair literature are real; mapping OCEAN traits onto attachment-style buckets is our own engineering choice, explicitly not a validated psychometric equivalence |
| Vaillant defense hierarchy | ~55-63% | Vaillant's (1977) mature/neurotic/immature taxonomy is real, established clinical theory; the ego-health/cortisol-weighted tier-shifting mechanism that picks among them each turn is own design |
| `LoveHateEngine` dual-valence bond field | ~38-46% | The individual pieces it reuses (diminishing-returns accumulation, kindling, asymmetric decay, rupture-and-repair) each draw on real cited work; the specific coupled two-accumulator update equations are our own engineering design end to end, not a reproduction of any published relational model |
| Approach-avoidance conflict (`MotivationalConflict`) | ~68-75% | Miller's (1944) real gradient-conflict model, implemented close to literally (two exponential gradients, steeper avoidance decay, a real crossover/vacillation zone); the specific decay constants and the expression-confidence dampening it feeds are own tuning |
| Two-process sleep pressure (`SleepPressure`) | ~72-80% | Borbély's (1982) Process S equation implemented directly (saturating exponential rise, exponential fall during a real "sleep" event); the specific rise/fall time constants are own engineering estimates, not measured circadian data |
| Opponent-process after-effect (`OpponentProcess`) | ~65-72% | Solomon & Corbit's (1974) a-process/b-process structure (habituating peak, growing-and-lengthening undershoot with repetition) implemented as its literal qualitative shape; the specific growth-rate constants are own tuning |
| Grief as a decaying-with-waves process (`GriefEngine`) | ~45-52% | The general shape (long-tailed, non-monotonic, punctuated by real intrusive waves) draws on real bereavement research (Bonanno 2004; Zisook & Shear 2009) that explicitly rejects a fixed-stage model, deliberately NOT modeling Kübler-Ross stages, since that theory lacks the empirical support the shape below draws on instead; the power-law exponent and wave-rate constants are own design |
| Shame/guilt split (`ShameGuiltSplit`) | ~60-68% | Tangney & Dearing's (2002) real, well-established distinction (identity-level vs. behavior-level, differing persistence); which real Totemheart signals feed each accumulator and the specific decay-rate ratio are own engineering |
| Moral injury / identity threat (`MoralInjury`, `IdentityThreatMonitor`) | ~55-63% | Litz et al.'s (2009) actual coinage and definition of "moral injury" as distinct from ordinary guilt, and Steele's (1988) self-affirmation/identity-threat theory, both real and well-matched to what's built; the permanence mechanism and severity-threshold/cascade-multiplier math are own design |
| Dynamic value conflict (`ValueHierarchy`) | ~50-58% | Schwartz's (1992) real, cross-culturally validated basic-values structure supplies the value set and the general "competing values create real tension" framing; the specific EMA nudge rule and conflict-scoring formula are own engineering, not a computational model Schwartz specified |
| Narrative self / chapter coherence (`NarrativeSelfEngine`) | ~48-55% | McAdams' (2001; McAdams & McLean 2013) real narrative-identity framework motivates treating the self as a real, evolving story rather than pure accumulated state; the chapter-theme EMA, coherence formula, and crisis threshold are own engineering, not a computational reproduction of that framework |
| Developmental staging (`OntogenicDevelopment`) | ~30-38% | Piaget (1952) and Vygotsky (1978) motivate development as qualitative, experience-driven stage change rather than a clock, an explicit engineering borrowing of that SHAPE; the stage boundaries and per-stage trait modifiers are own tuning, not a claim of literal human-child-development equivalence |
| Betrayal trauma trace (`BetrayalTraumaTrace`) | ~58-65% | Freyd's (1996) actual coinage of "betrayal trauma" as a distinct wound from a trusted source is a real, exact match to this module's trigger condition; the permanence-above-threshold decay shape and trust-threshold formula are own design |
| Somatic markers (`SomaticMarkerNetwork`) | ~55-62% | Damasio's (1994) real somatic-marker hypothesis motivates accumulative gut-feeling bias from past outcomes; the real token-overlap similarity and exponential-decay marker formula are own engineering, not a reproduction of any specific computational somatic-marker model |
| Regulation strategy selection (`RegulationStrategySelector`) | ~62-70% | Gross's (1998; Gross & John 2003) real reappraisal-vs-suppression cost/effectiveness taxonomy is well-established; the real argmax cost-benefit selection formula and specific base-cost constants are own engineering |
| Meta-emotion (`MetaEmotionLayer`) | ~52-60% | Gottman, Katz & Hooven's (1996) actual coinage of "meta-emotion" (real evaluative beliefs about one's own emotions) is a well-matched real citation; the specific standard-deviation valence formula and Neuroticism-bias multiplier are own design |
| Cultural scripts (`CulturalScriptLibrary`) | ~40-48% | Real, distinct citations for each script (honor: Nisbett & Cohen 1996; self-construal: Markus & Kitayama 1991; reciprocity: Gouldner 1960), but the token-overlap activation mechanic and the specific `cultural_weight`/`honor_factor` constants are own engineering, not a computational model any of those authors specified |
| Social network graph (`MultiAgentSocialGraph`) | ~35-42% | Real, standard social-network-analysis vocabulary (edge weight, coalition: Wasserman & Faust 1994); the specific Affinity−Aversion+StatusDiff weighting formula is own engineering end to end, not a reproduction of any published relational-network model |
| Group emotional contagion (`ColonyDynamics`) | ~50-58% | Barsade's (2002) real "ripple effect" finding (emotion spreads through a GROUP, not just dyadically, and group coherence is itself real and measurable) is a well-matched citation; the specific weighted-average contagion formula and 1−variance coherence metric are own design |
| Global workspace competition (`GlobalWorkspace`) | ~40-48% | Baars (1988; 2005) and Dehaene & Naccache (2001) are real, foundational consciousness-science theory; a real softmax over candidate saliences is a genuine, literal competition, but it's a deliberately narrow, explicitly-scoped-down engineering analog of "access to the workspace," not a claim of modeling ignition/broadcast dynamics or consciousness itself |
| Primary-process drives (`PrimaryDrives`) | ~55-63% | Panksepp (1998; Panksepp & Biven 2012) is real, cross-species-evidenced neuroscience for exactly these four systems (SEEKING/CARE/PLAY/PANIC-GRIEF) as distinct; the specific bounded-activation-plus-exponential-decay update rule and which existing Totemheart signals feed each drive are own engineering |
| Sustained-negativity numbing (`EmotionalImmuneSystem`) | ~46-54% | Gilbert (1989; 2009) is real, well-cited theory for defensive numbing under sustained unresolved negative affect; the specific exposure accumulator and saturating dampening curve are own design, and the phenomenon is real but broader in Gilbert's own work than this one narrow accumulator captures |

Every mechanism in this table passed a dedicated live audit: `npm run exhaustive-audit` (25/25), `npm run upgrade-round-mock` (39/39), and `npm run lovehate-mock` (24/24) for the earlier rows; [`test/integration/human-friction-mechanisms.test.js`](test/integration/human-friction-mechanisms.test.js) (60/60) plus [`test/integration/cross-mechanism-friction.test.js`](test/integration/cross-mechanism-friction.test.js) (8/8) for the 0.1.3 rows; and [`test/integration/emergent-mechanisms-round3.test.js`](test/integration/emergent-mechanisms-round3.test.js), [`test/integration/emergent-mechanisms-cross.test.js`](test/integration/emergent-mechanisms-cross.test.js), [`test/integration/emergent-full-framework-cross.test.js`](test/integration/emergent-full-framework-cross.test.js), [`test/integration/consciousness-drives-immunity.test.js`](test/integration/consciousness-drives-immunity.test.js), and [`test/plugins-cross/round3-plugins-integration.test.js`](test/plugins-cross/round3-plugins-integration.test.js) (104 tests total) for the 13 rows added in this release. That's internal consistency, not psychological validation, and the percentages above already price that distinction in.

## Prerequisites

None required. `HeuristicProvider` runs standalone with zero npm dependencies. Optionally, install [Ollama](https://ollama.com) if you want `OllamaProvider` to give the semantic modules (dissonance, theory of mind, appraisal) real language understanding instead of keyword heuristics.

## Installation

```bash
npm install totemheart
# or
pnpm install totemheart
# or
yarn add totemheart
```

## Usage

```js
import { Totemheart, Personality, VERSION } from 'totemheart'

console.log( VERSION ) // '0.1.5', also available as Totemheart.VERSION and in toJSON().version

const ai = new Totemheart( {
  personality: new Personality( { neuroticism: 0.7, agreeableness: 0.3 } ),
} )

const result = await ai.processInput( 'te quiero mucho', { userId: 'user-1' } )
console.log( result.text, result.emotionalState )

ai.tick( 1 ) // advance decay/homeostasis/forgetting, call this on your own clock
```

### Wiring it into a real LLM (Claude, GPT, Ollama, anything)

`processInput()` includes a `systemPrompt`: a provider-agnostic block of text describing the current emotional state (dominant emotion, valence/arousal, cognitive stress, cortisol, fatigue, active defense mechanism...) with instructions for an LLM to let it shape tone and content. Prepend it to whatever system message field your provider uses:

```js
const result = await ai.processInput( userMessage, { userId } )

// Anthropic
await anthropic.messages.create( {
  model    : 'claude-...',
  system   : result.systemPrompt,
  messages : [ { role: 'user', content: userMessage } ],
} )

// OpenAI-compatible / Ollama chat
await client.chat.completions.create( {
  messages: [ { role: 'system', content: result.systemPrompt }, { role: 'user', content: userMessage } ],
} )
```

`result.structuredContext` gives you the same information as plain JSON if you'd rather build your own prompt formatting. Call `ai.getSystemPrompt()` on its own (no new turn) to seed the very first message of a conversation, or to refresh context after `ai.idle()`/`ai.tick()` shifts the mood between turns.

Run `npm run demo` for a full scripted conversation showing decay, hedonic adaptation, dopaminergic surprise, sensory overload, and a generated system prompt in action. Run `npm test` for the mechanic-level test suite. Run `npm run stress-test` ([`examples/full-stress-test.js`](examples/full-stress-test.js)) for a before/after weight trace across a battery of positive/negative/severe shocks, repeated hostility, idle time passing, hardware latency, worn-path caching, and a group/bystander turn. Run `npm run upgrade-round-mock` for the momentum/hysteresis, allostatic-load, wanting/liking, reconsolidation, attachment-style, graded-hijack, Vaillant-defense, expression-policy, resource-allocation, and circadian-coupling round, or `npm run lovehate-mock` for `LoveHateEngine`'s ambivalence, kindling, and rupture-and-repair cycle end to end.

### Real ML instead of heuristics: `TransformersProvider`

`HeuristicProvider` is a hand-written lexicon; `TransformersProvider` runs an actual model trained on [GoEmotions](https://arxiv.org/abs/2005.00547) (28 emotion labels, Reddit-sourced) via [transformers.js](https://huggingface.co/docs/transformers.js): real inference, no API key, no server. It's an optional peer dependency, so it doesn't touch the zero-dependency default:

```bash
npm install @xenova/transformers
```

```js
import { Totemheart, TransformersProvider } from 'totemheart'

const ai = new Totemheart( { provider: new TransformersProvider() } )
```

The default model (`kamaludeen/multilingual_go_emotions-ONNX`) was chosen because it was actually tested against Spanish input during development. The better-known English-only GoEmotions checkpoint was tried first and returned near-garbage on Spanish text. If your content is English-only, pass `{ model: 'MicahB/roberta-base-go_emotions' }` instead. **Known interaction found while testing this**: a real classifier gives stronger-magnitude appraisal signals than the heuristic lexicon does, which can make the existing `AnchoringBias` mechanic pull harder than expected in short conversations.

## Plugins

Seven official, separately-published packages under [`packages/`](packages), each real and independently tested (39 per-plugin tests + 10 cross-integration tests in [`test/plugins-cross/`](test/plugins-cross); none of them share fate with the core suite, `npm test` alone never runs them; use `npm run test:all`). Every plugin is a duck-typed consumer of the core's real, already-documented extension points (`LanguageProvider`'s `analyze()` contract, `EpisodicMemory`'s `adapter` interface, `ExpressionDirectives`' output); none of them required changing core to build.

| Package | What it is | Real, not simulated |
| --- | --- | --- |
| [`@totemheart/provider-openai`](packages/provider-openai) | An OpenAI-compatible chat-completions `LanguageProvider` | Real `fetch` to `/chat/completions`; throws on any failure (missing key, unreachable host, bad status), same resilience contract as the built-in `OllamaProvider`; Totemheart falls back to `HeuristicProvider` transparently |
| [`@totemheart/provider-anthropic`](packages/provider-anthropic) | An Anthropic Messages API `LanguageProvider` | Real `fetch` to `/v1/messages` with `x-api-key`/`anthropic-version` headers; throws on any failure (missing key, unreachable host, bad status), same throw-and-fallback resilience contract as `OllamaProvider`/`OpenAIProvider` |
| [`@totemheart/store-sqlite`](packages/store-sqlite) | A real, on-disk `EpisodicMemory` adapter | Node's built-in `node:sqlite`, zero external dependency; real persistence verified by closing and reopening the database file. **Known, documented limitation**: `EpisodicMemory`'s adapter contract as implemented in core today only routes `store()`/`recall()` through the adapter; `markResolved()`, `getUnresolvedMemories()`, Zeigarnik pressure, and REM-salience all still read the in-memory array, which stays empty when an adapter is set. Verified explicitly in this plugin's own tests, not silently assumed to work |
| [`@totemheart/bridge-tts`](packages/bridge-tts) | Maps real `ExpressionDirectives.getProsodyDirectives()` output onto standard SSML `<prosody>` markup | W3C SSML, not a single vendor's proprietary format; usable as-is with Azure, Amazon Polly, or Google Cloud TTS. No API calls (no credentials this package could honestly claim to have) |
| [`@totemheart/bridge-robotics`](packages/bridge-robotics) | Maps real `getPostureDirectives()`/`getActionTendency()` output onto a generic actuator-command schema and sends it over real HTTP | Genuine network I/O, tested against a real local listener; not a claim of ROS2/vendor-protocol conformance, since there's no real robot here to verify that against |
| [`@totemheart/devtools`](packages/devtools) | A zero-dependency local HTTP dashboard for a running `Totemheart` instance | Real `node:http` server exposing `getEmotionalState()` and the real `ExplainabilityEngine` decision log live, including every round-3 field (`legacyMemory`, `betrayalTraumaTrace`, `culturalScriptLibrary`, `somaticMarkerNetwork`, `powerDynamicsEngine`, `insightGenerator`, `colony`, `primaryDrives`, `immuneExposure`, `immuneDampening`), polled by a minimal dashboard page, no `console.log`-only debugging |
| [`@totemheart/audit-kit`](packages/audit-kit) | Reusable cross-mechanism test helpers | Extracted directly from `test/integration/cross-mechanism-friction.test.js`: the same `assertFiniteState`/`driveToRupture`/`noBurst`/`noHijack` helpers this repo uses on itself, packaged for a fork or downstream app to run the same discipline against its own scenarios |

```bash
npm install @totemheart/provider-openai @totemheart/provider-anthropic @totemheart/store-sqlite @totemheart/bridge-tts @totemheart/bridge-robotics @totemheart/devtools @totemheart/audit-kit
```

## License

This software is licensed with **[MIT](/LICENSE)**.
