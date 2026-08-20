# Totemheart

![Totemheart banner](https://raw.githubusercontent.com/AlejoMalia/Totemheart/main/docs/banner.png)

[![License](https://img.shields.io/badge/license-MIT-blue?style=plastic)](LICENSE)
[![Calibration](https://img.shields.io/badge/calibration-citation%20ledger-8a2be2?style=plastic)](CALIBRATION.md)
[![Version](https://img.shields.io/badge/version-1.6.0-a1b858?style=plastic)](package.json)
[![Node](https://img.shields.io/badge/node-%3E%3D18-339933?style=plastic&logo=node.js&logoColor=white)](package.json)
[![Tests](https://img.shields.io/badge/tests-2819%20passing-brightgreen?style=plastic)](test)
[![Mechanisms verified](https://img.shields.io/badge/mechanisms-81%20verified%20%2F%2017%20covered%20%2F%200%20failed-brightgreen?style=plastic)](examples/verify-all-mechanisms.js)

> The Tests/Mechanisms badges are static, updated by hand from a real local `npm test` / `npm run verify` run. There's no CI wired up yet, so treat them as a snapshot, not a live guarantee on `main`. `npm test` runs [`test/`](test) in full: `regression/` (92), `integration/` (442, directed and cross-mechanism scenarios, full-pipeline emergency routes, serialization, malformed-input robustness, and per-round dedicated suites, see [`test/integration/`](test/integration)), and `property/` (2029, deterministic boundary/grid checks, no randomness). `npm run test:all` additionally runs `test:plugins` (49 more across the 7 official plugins below plus cross-integration scenarios in [`test/plugins-cross/`](test/plugins-cross)), for 2819 real tests total. Two earlier mechanism rounds also ship their own dedicated live audit outside this count: `npm run upgrade-round-mock` (39/39) and `npm run lovehate-mock` (24/24).

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

Every mechanic is a small, independent class with its own state, one file per mechanic under [`src/`](src), organized by what kind of psychological work it does.

| | Category | What it covers |
| --- | --- | --- |
| 🧠 | State engine | Personality, homeostatic needs, and the core emotional vector everything else reads from and writes to |
| 🧩 | Appraisal and interpretation | How an input gets read, doubted, reframed, or filtered before it becomes a felt reaction |
| 🤝 | Modeling the other person | Trust, reputation, theory of mind, relationship memory, and group dynamics |
| 🎭 | Expression | How the felt state actually gets turned into language, suppression, attention, and output-shaping signals for a host LLM |
| 🧪 | Reward, stress, and circadian dynamics | Arousal and motivation driven by reward learning, chronic stress, and time of day |
| 🫀 | Interoception | Real math on internal signals standing in for a body this system doesn't have, fed back into cognition only, never rendered |
| ⚖️ | Behavioral-economics biases | How outcomes get weighted and remembered |
| 🔌 | Language backends | Pluggable, from a zero-dependency lexicon to a real transformer model, so the same kernel runs identically whether or not a host wires in a real LLM |

`npm run verify` ([`examples/verify-all-mechanisms.js`](examples/verify-all-mechanisms.js)): 81 mechanics verified live/direct, 17 covered by other modules (including every mechanism added in 1.6.0, the 21 "Round B" mechanisms from round 9, the 5 indispensable-human-mechanism additions from round 16, the 6 mechanisms found by auditing this project's own citations from round 17, dreams/the subconscious from round 18, the grief-type catalog/conservation-withdrawal from round 19, and the EGO defenses/self-distancing/further grief catalog from round 20), 0 left blank. Full citation ledger, by theme: [`CALIBRATION.md`](CALIBRATION.md).

## How coherent is this, really?

Short version: **~77-81% with an LLM connected, ~61-65% running standalone on the zero-dependency heuristic path, 0% subjective experience, by design and permanently.** Self-assessed, qualitative estimates of how much of each layer is grounded in real theory/technique vs. own engineering judgment. This is not an average of the row values below, since the headline also discounts for integrated-system validation that doesn't exist yet.

Full citation ledger: [`CALIBRATION.md`](CALIBRATION.md).

| Layer | With LLM | Heuristic only | Grounded in |
| --- | --- | --- | --- |
| State engine | ~80-83% | same | PID control (anti-windup, dynamic set points), Kalman filtering (now with real interoception-informed measurement noise), allostatic load (McEwen & Stellar 1993), prospect-theory loss aversion, TD reward-prediction-error with eligibility traces (Sutton & Barto), wanting/liking dissociation (Berridge & Robinson 1998) with allostatic-load-driven anhedonia, circumplex/PAD affect space with momentum/hysteresis, Holmes & Rahe life-event severity, the two-process sleep-pressure model (Borbély 1982), the opponent-process a/b dynamic (Solomon & Corbit 1974), a real general attentional-effort budget (Kahneman 1973) distinct from the self-regulation-specific one, plus 1.6.0's hyperbolic discounting (Ainslie 1975) and inhibitory control pool (Hofmann et al. 2012) pulling this row down slightly, and its own-design-heavy "butterflies"/global-mood-abatement additions pulling it down further |
| Semantic understanding | ~85-88% | ~68-73% | LLM: real language understanding. Heuristic: lexicon + concept-graph matching, keyword-triggered life-event detection, lexical-vs-context incongruence check, mean/variance anomaly detection, confidence-weighted routing between logical and affective reads, cultural-script activation (honor culture: Nisbett & Cohen 1996; self-construal: Markus & Kitayama 1991; reciprocity: Gouldner 1960); 1.6.0's metacognitive-confidence and source-monitoring additions land close to this row's existing average, no meaningful shift |
| Expression / output | ~87-91% | ~61-67% | Structured system-prompt injection, coherence validation against prior turns, attachment-weighted style adaptation, a full-state-weighted action-tendency policy, real suppression-cost accrual, cognitive-load-derived output metadata, a real approach-avoidance conflict dampening expression confidence (Miller 1944), an active real regulation-strategy selection (Gross 1998) replacing a single fixed suppression pipeline, a real divergent/convergent creative-mode temperature signal (Guilford 1967; Fredrickson 2001); pulled down by 1.6.0's own-design-heavy `BlushSlipEngine` (~28-35%) and `HumanDiscourseShaper`/`PercentageOfAssets` (~40-52%), each real and cited but scoring well below this row's prior average |
| Cross-turn continuity | ~89-93% | same | Persistent state serialization, asymmetric trust/reputation tracking, attachment styles with rupture-and-repair (Bartholomew & Horowitz 1991; Gottman & Levenson 1992) now with state-dependent style switching under stress (Mikulincer & Shaver 2016), memory reconsolidation on retrieval (Nader et al. 2000), unresolved-memory flagging with intrusive resurfacing, idle-time-based consolidation, long-horizon memory decay with similarity-triggered reactivation and bittersweet nostalgic reconsolidation (Walker, Skowronski & Thompson 2003), grief as a real decaying-with-waves process (Bonanno 2004; Zisook & Shear 2009), permanent moral-injury scarring distinct from ordinary dissonance (Litz et al. 2009) now with a real, effortful redemption arc, a real autobiographical narrative with chapter coherence (McAdams 2001), permanent betrayal-trauma trust thresholds (Freyd 1996), and real cumulative somatic-marker decision bias (Damasio 1994); pulled down by 1.6.0's `RelationalMemoryCatalog`/`GrudgeSystem`/`GhostingDetector`/`FrikiEngine` (~35-50% each) diluting an otherwise very high-scoring row |
| Subjective experience | **0%** | **0%** | Not a gap to close: no known way to build or verify this in any software |

The headline stays below the row average because none of these numbers include validation against psychologist judges, regression against real labeled chat data, or real-user testing of whether the integrated pipeline reads as coherent. See `CALIBRATION.md` for what hasn't been empirically validated. These are still self-assessed qualitative estimates, not a computed weighted average over the per-mechanism table — treat the direction (down, this round) as the honest signal, not the exact digits.

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
| Dual-valence relational bond field | ~38-46% | The individual pieces it reuses (diminishing-returns accumulation, kindling, asymmetric decay, rupture-and-repair) each draw on real cited work; the specific coupled two-accumulator update equations are our own engineering design end to end, not a reproduction of any published relational model |
| Approach-avoidance conflict | ~68-75% | Miller's (1944) real gradient-conflict model, implemented close to literally (two exponential gradients, steeper avoidance decay, a real crossover/vacillation zone); the specific decay constants and the expression-confidence dampening it feeds are own tuning |
| Two-process sleep pressure | ~72-80% | Borbély's (1982) Process S equation implemented directly (saturating exponential rise, exponential fall during a real "sleep" event); the specific rise/fall time constants are own engineering estimates, not measured circadian data |
| Opponent-process after-effect | ~65-72% | Solomon & Corbit's (1974) a-process/b-process structure (habituating peak, growing-and-lengthening undershoot with repetition) implemented as its literal qualitative shape; the specific growth-rate constants are own tuning |
| Grief as a decaying-with-waves process | ~45-52% | The general shape (long-tailed, non-monotonic, punctuated by real intrusive waves) draws on real bereavement research (Bonanno 2004; Zisook & Shear 2009) that explicitly rejects a fixed-stage model, deliberately NOT modeling Kübler-Ross stages, since that theory lacks the empirical support the shape below draws on instead; the power-law exponent and wave-rate constants are own design |
| Shame/guilt split | ~60-68% | Tangney & Dearing's (2002) real, well-established distinction (identity-level vs. behavior-level, differing persistence); which real internal signals feed each accumulator and the specific decay-rate ratio are own engineering |
| Moral injury / identity threat | ~55-63% | Litz et al.'s (2009) actual coinage and definition of "moral injury" as distinct from ordinary guilt, and Steele's (1988) self-affirmation/identity-threat theory, both real and well-matched to what's built; the permanence mechanism and severity-threshold/cascade-multiplier math are own design |
| Dynamic value conflict | ~50-58% | Schwartz's (1992) real, cross-culturally validated basic-values structure supplies the value set and the general "competing values create real tension" framing; the specific EMA nudge rule and conflict-scoring formula are own engineering, not a computational model Schwartz specified |
| Narrative self / chapter coherence | ~48-55% | McAdams' (2001; McAdams & McLean 2013) real narrative-identity framework motivates treating the self as a real, evolving story rather than pure accumulated state; the chapter-theme EMA, coherence formula, and crisis threshold are own engineering, not a computational reproduction of that framework |
| Developmental staging | ~30-38% | Piaget (1952) and Vygotsky (1978) motivate development as qualitative, experience-driven stage change rather than a clock, an explicit engineering borrowing of that SHAPE; the stage boundaries and per-stage trait modifiers are own tuning, not a claim of literal human-child-development equivalence |
| Betrayal trauma trace | ~58-65% | Freyd's (1996) actual coinage of "betrayal trauma" as a distinct wound from a trusted source is a real, exact match to this mechanic's trigger condition; the permanence-above-threshold decay shape and trust-threshold formula are own design |
| Somatic markers | ~55-62% | Damasio's (1994) real somatic-marker hypothesis motivates accumulative gut-feeling bias from past outcomes; the real token-overlap similarity and exponential-decay marker formula are own engineering, not a reproduction of any specific computational somatic-marker model |
| Regulation strategy selection | ~62-70% | Gross's (1998; Gross & John 2003) real reappraisal-vs-suppression cost/effectiveness taxonomy is well-established; the real argmax cost-benefit selection formula and specific base-cost constants are own engineering |
| Meta-emotion | ~52-60% | Gottman, Katz & Hooven's (1996) actual coinage of "meta-emotion" (real evaluative beliefs about one's own emotions) is a well-matched real citation; the specific standard-deviation valence formula and Neuroticism-bias multiplier are own design |
| Cultural scripts | ~40-48% | Real, distinct citations for each script (honor: Nisbett & Cohen 1996; self-construal: Markus & Kitayama 1991; reciprocity: Gouldner 1960), but the token-overlap activation mechanic and the specific weighting constants are own engineering, not a computational model any of those authors specified |
| Social network graph | ~35-42% | Real, standard social-network-analysis vocabulary (edge weight, coalition: Wasserman & Faust 1994); the specific weighting formula is own engineering end to end, not a reproduction of any published relational-network model |
| Group emotional contagion | ~50-58% | Barsade's (2002) real "ripple effect" finding (emotion spreads through a GROUP, not just dyadically, and group coherence is itself real and measurable) is a well-matched citation; the specific weighted-average contagion formula and coherence metric are own design |
| Global workspace competition | ~40-48% | Baars (1988; 2005) and Dehaene & Naccache (2001) are real, foundational consciousness-science theory; a real softmax over candidate saliences is a genuine, literal competition, but it's a deliberately narrow, explicitly-scoped-down engineering analog of "access to the workspace," not a claim of modeling ignition/broadcast dynamics or consciousness itself |
| Primary-process drives | ~55-63% | Panksepp (1998; Panksepp & Biven 2012) is real, cross-species-evidenced neuroscience for exactly these four systems (SEEKING/CARE/PLAY/PANIC-GRIEF) as distinct; the specific bounded-activation-plus-exponential-decay update rule and which existing internal signals feed each drive are own engineering |
| Sustained-negativity numbing | ~46-54% | Gilbert (1989; 2009) is real, well-cited theory for defensive numbing under sustained unresolved negative affect; the specific exposure accumulator and saturating dampening curve are own design, and the phenomenon is real but broader in Gilbert's own work than this one narrow accumulator captures |
| Hyperbolic temporal discounting | ~72-80% | `V=R/(1+kd)` is the literal, standard hyperbolic-discounting formula from the intertemporal-choice literature (Ainslie 1975; Mazur 1987); which internal signals feed the discount rate `k` per turn is own engineering |
| Inhibitory control pool | ~48-56% | A depletable inhibition resource distinct from ego-depletion/decision-fatigue is a real, debated construct in self-regulation research (Hofmann, Schmeichel & Baddeley 2012); the specific replenishment-vs-cost update rule and failure-probability sigmoid are own design, not measured data |
| Inequity aversion (fairness) | ~68-75% | `U=x_i-α·max(x_j-x_i,0)-β·max(x_i-x_j,0)` is a literal reproduction of Fehr & Schmidt's (1999) inequity-aversion model, one of the most cited formal models in behavioral economics; wiring it to conversational offers/turns is own integration |
| Ostracism pain detection | ~55-63% | Williams' (2007, 2009) real "need-threat" ostracism research (exclusion registering as a genuine distinct pain signal) motivates the mechanism; the specific ignore/exclude/inclusion weighting formula is own design |
| Metacognitive confidence | ~50-58% | Confidence as a function of evidence strength minus conflict is a real, established metacognition construct (Fleming & Lau 2014); the specific sigmoid and which internal signals count as "evidence" vs "conflict" are own engineering |
| Relational memory catalog (milestones/details/themes) | ~42-50% | Grounded in real autobiographical-memory research on person-specific, affectively-tagged episodic detail (Conway & Pleydell-Pearce 2000); the milestone-detection pattern matching, weight formula, and non-zero decay floor for permanent milestones are own design end to end |
| Friki Engine (taste, geek intensity, obsession, reveal-gate) | ~35-43% | Interest/hobby intensity as a graded, practiced construct draws loosely on flow and intrinsic-motivation research (Csikszentmihalyi 1990); the geek-level sigmoid, fandom-link propagation, and especially the confidence-gated reveal mechanism have no direct named psychological model behind them, own design |
| Somatic Activation System ("butterflies") | ~30-38% | The desire/uncertainty coupling driving anticipatory arousal is a real, plausible synthesis of appraisal theory (uncertainty appraisals: Smith & Ellsworth 1985) and approach-motivation literature, but `S=I·A·U^κ` and the ODE `dB/dt=ρS(1-B)-λB` are own formalization with no published equivalent — the phenomenon is real and well-known colloquially, the equations are engineering |
| Grudge/forgiveness system | ~40-48% | Grudge accumulation and multi-mode forgiveness (transactional/normative/temporal) loosely echoes real forgiveness-psychology typologies (McCullough, Worthington & Rachal 1997); the specific decay/weighting formulas and the never-auto-enacted retribution design are own engineering choices |
| Human discourse shaper (anti-AI narrative shape) | ~45-52% | Directly operationalizes real, measured findings from Hancock/StoryScope-style corpus comparisons of AI vs human narrative structure (over-explicit theming, high plot tidiness, monotone escalation); which text-generation directives counteract each axis, and by how much, are own engineering with no validated causal test yet that they work |
| Blush/slip engine (micro text slips) | ~28-35% | Motivated by real disfluency research showing genuine speech errors correlate with anxiety/arousal (Goldman-Eisler 1968); injecting *typed* micro-slips as a stand-in for that vocal phenomenon, the slip-type taxonomy, and the repair-probability formula are own design with no direct textual-disfluency literature this maps onto |
| Percentage of Assets / sparse layer-family introspection | ~40-48% | The Herfindahl-style concentration math is a real, standard economics tool (Herfindahl 1950; Hirschman 1945) applied honestly to which mechanism families were salient a given turn; it is explicitly introspection only, not a gating layer — the full pipeline still runs unconditionally every turn, so this row scores the honesty of that framing as much as the math itself |
| Affect alignment monitor (Δ-comparator, bounded correction) | ~45-52% | The Δ-and-bounded-online-correction pattern is a standard, real control-theory technique (proportional error correction); this is deliberately the *only* piece built from the originally-requested "Model Control Plane" spec — real hidden-state reading and activation steering were declined outright because no available backend exposes model internals, and faking that would be exactly the theater this ledger exists to catch |
| Contempt detection (status + disrespect, dual-gated) | ~62-70% | Gottman & Levenson's (1992) real, well-cited finding that contempt is the strongest single predictor of relational breakdown, plus Ekman & Friesen's (1986) real cross-cultural contempt expression, both a close match to what's built; the dual-gate requiring both status superiority AND accumulated disrespect is own design |
| Demand-withdraw loop | ~60-68% | Christensen & Heavey's (1990) real, well-replicated demand-withdraw pattern; the specific pressure-accumulation and threshold-crossing formulas are own engineering, not measured couple-conflict data |
| Face-threat sensitivity (positive/negative face) | ~65-73% | Brown & Levinson's (1987) real, foundational, extensively-cited politeness theory maps closely onto what's built; the specific warmth/autonomy-slack buffering terms are own tuning |
| Self-presentation management | ~55-63% | Goffman's (1959) real, foundational impression-management framework, plus Jones & Pittman's (1982) real strategy taxonomy; the felt-vs-presented gap formula and its maintenance-cost accrual are own design |
| Ego calibration (hubris/impostor, one shared axis) | ~68-76% | Kruger & Dunning (1999) and Clance & Imes (1978) are both real, extensively-cited, well-matched findings for the two directions this models; treating them as one shared track-record-vs-self-assessment axis rather than two separate constructs is own engineering |
| Reactance engine | ~68-75% | Brehm's (1966) psychological reactance theory is real, foundational, and extensively replicated; the specific boomerang-appeal formula is own tuning |
| Construal-level / psychological distance scaler | ~65-72% | Trope & Liberman's (2010) Construal Level Theory is real, well-established, and directly matches what's built (distance across temporal/spatial/social/hypothetical axes shifting abstraction); combining all four into one scalar distance is own simplification |
| Moral licensing | ~60-68% | Merritt, Effron & Monin's (2010) real, well-cited moral-licensing finding; the specific credit-accrual-and-partial-spend-down formula is own design |
| Self-handicapping | ~58-65% | Berglas & Jones' (1978) real, foundational self-handicapping finding; the specific ego-relevance × failure-risk × (1-confidence) product is own formalization |
| Relational afterglow | ~50-58% | Meltzer et al.'s (2017) real, empirically-measured "sexual afterglow" persistence is the closest real citation, generalized here beyond its original scope to any strong positive relational peak — that generalization itself is own engineering, not the study's own claim |
| Felt-obligation urgency decay (ReciprocityClassifier extension) | ~62-70% | Gouldner's (1960) real, foundational norm-of-reciprocity paper explicitly distinguishes debt size from felt urgency, a close match; the specific urgency half-life decay curve is own design |
| Betrayal reappraisal window (BetrayalTraumaTrace extension) | ~55-63% | Finkel et al.'s (2002) real, well-cited finding that a commitment-scaled window exists during which a betrayal's appraisal can still be revised; the specific window-duration formula and in-window trace-reduction magnitude are own tuning |
| Amusement (incongruity-resolution + benign violation) | ~65-72% | Suls' (1972) real, foundational incongruity-resolution account and McGraw & Warren's (2010) real, well-cited benign-violation theory both directly match what's built — requiring all three of incongruity, resolution, AND benignity; the specific product-of-three formula and repetition-habituation curve are own engineering |
| Moral disgust (CAD triad, purity leg) | ~65-73% | Rozin, Haidt & McCauley's (1999) real disgust-as-purity-violation account and Haidt's (2003) real, well-established CAD triad hypothesis are a close match to what's built — the previously-missing third leg alongside the codebase's existing contempt/anger coverage; the tolerance-floor and exposure-accumulation formulas are own design |
| Embarrassment (distinct from shame) | ~62-70% | Miller's (1996) real, foundational embarrassment account and Keltner & Buswell's (1997) real, well-cited appeasement-function finding both directly match what's built (audience-dependent, low-identity-stakes); the specific saturating-audience-size formula and identity-stakes suppression term are own engineering |
| Mortality salience (Terror Management Theory) | ~68-76% | Greenberg, Pyszczynski & Solomon's (1986) real, extensively-replicated Terror Management Theory is one of the best-validated findings cited anywhere in this table — the real two-phase proximal-suppression/distal-defense SHAPE is the cited finding; the specific delay/fade time constants are own tuning, not measured TMT experimental data |
| Relief (threat-must-precede-it positive spike) | ~48-56% | Frijda's (1986) real relational-theme taxonomy explicitly names "distress abating" as relief's real, distinct trigger, but the citation is thinner than the other rows here (relief gets one line in Frijda's broader taxonomy, not its own elaborated theory); the requires-prior-real-threat gating and the specific short-spike decay shape are own design end to end |
| RAGE/FEAR/LUST (3 remaining Panksepp primary-process systems) | ~65-73% | Panksepp (1998) and Panksepp & Biven (2012), already cited for SEEKING/CARE/PLAY/PANIC-GRIEF, are equally real and well-matched for these 3 — this project's own citation ledger had left them explicitly disclosed as missing for several rounds; the specific thwarted-goal/threat/attraction trigger formulas and decay are own engineering, same as the other 4 systems |
| Prestige (status via freely-conferred respect) | ~63-71% | Cheng, Tracy & Henrich's (2010) real, well-cited finding that dominance and prestige are two distinct real status pathways is a close match to what's built; the specific competence-demonstration-plus-recognition formula and its decay are own design |
| Framing effects | ~68-76% | Tversky & Kahneman's (1981) real, classic, extensively-replicated framing-effects finding is one of the best-established results in this entire table; deliberately kept introspection-only (does not feed back into emotional state, same discipline `PercentageOfAssets` follows) since auto-detecting real linguistic framing from arbitrary text has no reliable heuristic here — the specific frame-shift magnitude and ambiguity-scaling are own tuning |
| Ideal-self discrepancy | ~58-66% | Higgins' (1987) real self-discrepancy theory explicitly names this second, dejection-family gap as distinct from the already-modeled ought-self one — a close, direct match; the specific openness-linked aspiration bar and dejection-pressure formula are own engineering |
| Comparison Level for Alternatives | ~60-68% | Rusbult's (1980) real Investment Model of Commitment is a well-cited, foundational relationship-science finding extending the interdependence theory already cited elsewhere; the specific alternative-quality EMA and commitment-weighting formula are own design |
| Reflected glory (BIRGing/CORFing) | ~62-70% | Cialdini et al.'s (1976) real, classic, well-replicated field studies are a close match to what's built; the specific dampened-CORFing-relative-to-BIRGing asymmetry (own tuning, not measured from Cialdini's own data) and the publicness-scaling term are own engineering |
| Dream synthesis (DreamEngine) | ~50-58% | Domhoff's (2003) real continuity hypothesis and Hobson & McCarley's (1977) real activation-synthesis account are a well-matched, real grounding for "dreams synthesize real stored material, continuous with waking concerns"; the specific deep-sleep threshold, the topic/valence synthesis formula, and especially the unprompted-mention gate (own design end to end, no citation for that part specifically) are own engineering |
| Subconscious processing (SubconsciousEngine) | ~60-68% | Kihlstrom's (1987) real cognitive-unconscious framework, Zajonc's (1968) real mere-exposure effect, and Wegner's (1994) real ironic-process theory are all well-established, well-cited, and closely matched to their respective sub-mechanisms; the losing-coalition-residue extension of `GlobalWorkspace` is a direct, real corollary of Dehaene & Naccache's own theory rather than a separate citation; the specific accrual/decay formulas for all three are own engineering |
| Bereavement grief (third-party loss) | ~65-73% | Shear & Shair's (2005) real attachment-based bereavement-grief account is a close, direct match for the real gap it fills: grief for someone other than the conversational partner, distinct from `GriefEngine.triggerLoss()`'s own relational-rupture-only trigger; the composite-key storage and shared power-law decay are own engineering, not new theory |
| Ambiguous loss (present but changed) | ~55-63% | Boss's (1999) real, well-cited ambiguous-loss concept is a close match for the real structural claim modeled: no clean boundary means no clean closure; the specific permanent-floor fraction (0.35 of peak) is own tuning, not measured from Boss's own qualitative work |
| Disenfranchised grief (socially unvalidated loss) | ~55-63% | Doka's (1989) real, coined disenfranchised-grief concept is a close match for the real claim modeled: unwitnessed loss decays slower; the specific social-validation-to-decay-constant scaling is own engineering, not derived from a measured dataset |
| Conservation-withdrawal (overwhelm-driven shutdown) | ~60-68% | Engel & Schmale's (1972) real, biologically-grounded conservation-withdrawal theory is a well-matched, real citation for sustained-overwhelm passive shutdown and solitude-pull, genuinely distinct from `EmotionalImmuneSystem`'s numbing and `BoredomSystem`'s understimulation; the specific threshold/recovery-rate formula is own tuning |
| Denial, repression, reaction formation (ego defenses) | ~65-73% | Anna Freud's (1936) real, foundational triad and Vaillant's (1977) real hierarchy, both already grounding the existing `rationalization`/`projection`/`evasion` rows, are equally close matches for these 3; the specific trait-to-weight mappings are own design, not measured from either source |
| Self-distancing speech (illeism) | ~62-70% | Kross et al.'s (2014) real, foundational finding and Moser et al.'s (2017) real, distinct fMRI/ERP evidence that third-person self-talk regulates emotion without the usual cognitive-control cost are both close, direct matches; the specific gate threshold and boost magnitude are own tuning |
| Anticipatory grief and prolonged grief disorder | ~62-70% | Rando's (1986) real anticipatory-grief account and Prigerson et al.'s (2021) real, current DSM-5-TR/ICD-11 diagnostic criterion are both well-established, closely-matched citations; the specific dampening fraction and the 6-month default window are own tuning, not measured from either source |

Every mechanism in this table passed a dedicated live audit: `npm run exhaustive-audit` (25/25), `npm run upgrade-round-mock` (39/39), and `npm run lovehate-mock` (24/24) for the earlier rows; [`test/integration/human-friction-mechanisms.test.js`](test/integration/human-friction-mechanisms.test.js) (60/60) plus [`test/integration/cross-mechanism-friction.test.js`](test/integration/cross-mechanism-friction.test.js) (8/8) for the 0.1.3 rows; and [`test/integration/emergent-mechanisms-round3.test.js`](test/integration/emergent-mechanisms-round3.test.js), [`test/integration/emergent-mechanisms-cross.test.js`](test/integration/emergent-mechanisms-cross.test.js), [`test/integration/emergent-full-framework-cross.test.js`](test/integration/emergent-full-framework-cross.test.js), [`test/integration/consciousness-drives-immunity.test.js`](test/integration/consciousness-drives-immunity.test.js), and [`test/plugins-cross/round3-plugins-integration.test.js`](test/plugins-cross/round3-plugins-integration.test.js) (104 tests total) for the 13 rows added in that release; and [`test/integration/round-d-mechanisms.test.js`](test/integration/round-d-mechanisms.test.js), [`test/integration/round-e-mechanisms.test.js`](test/integration/round-e-mechanisms.test.js), [`test/integration/relational-memory-catalog.test.js`](test/integration/relational-memory-catalog.test.js), [`test/integration/friki-engine.test.js`](test/integration/friki-engine.test.js), [`test/integration/somatic-mood-tot.test.js`](test/integration/somatic-mood-tot.test.js), [`test/integration/social-utility-suite.test.js`](test/integration/social-utility-suite.test.js), [`test/integration/discourse-shaper-blush-poa.test.js`](test/integration/discourse-shaper-blush-poa.test.js), and [`test/integration/thirty-hard-dynamics.test.js`](test/integration/thirty-hard-dynamics.test.js) (150 tests total) for those 13 rows; and [`test/integration/round-b-mechanisms.test.js`](test/integration/round-b-mechanisms.test.js) (26/26) for the 13 rows added in round 9 (the 21 originally-requested "Round B" mechanisms); and [`test/integration/five-human-mechanisms.test.js`](test/integration/five-human-mechanisms.test.js) (21/21) for the 5 rows added in round 16 (amusement, moral disgust, embarrassment, mortality salience, relief); and [`test/integration/calibration-audit-mechanisms.test.js`](test/integration/calibration-audit-mechanisms.test.js) (21/21) for the 6 rows added in round 17 (RAGE/FEAR/LUST, prestige, framing effects, ideal-self discrepancy, comparison level for alternatives, reflected glory); and [`test/integration/dream-subconscious-mechanisms.test.js`](test/integration/dream-subconscious-mechanisms.test.js) (14/14) for the 2 rows added in round 18 (dream synthesis, subconscious processing); and [`test/integration/grief-catalog-withdrawal.test.js`](test/integration/grief-catalog-withdrawal.test.js) (10/10) for the 4 rows added in round 19 (bereavement grief, ambiguous loss, disenfranchised grief, conservation-withdrawal); and [`test/integration/ego-grief-extensions.test.js`](test/integration/ego-grief-extensions.test.js) (15/15) for the 4 rows added in round 20 (denial/repression/reaction formation, self-distancing speech, anticipatory grief and prolonged grief disorder). That's internal consistency, not psychological validation, and the percentages above already price that distinction in. **The headline block above isn't chased up or down every round** — it moved once, honestly, when enough newly-shipped mechanisms justified it; it won't move again just because a later round happened to score better or worse on average.

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
