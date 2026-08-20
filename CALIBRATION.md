# Sourcing

Totemheart's design draws on published research and established mathematical/engineering technique across several fields. This page lists what that grounding actually is, real theories, models, and papers, by theme, without walking through how any specific mechanism is built from them. That's deliberate: the *what it's grounded in* is worth being transparent about; the *how it's implemented* is the project's own engineering and isn't described here.

Not every citation below corresponds to a literal, numerically-faithful reproduction of the cited work. Some are used as-is; many are used for their general shape or concept, with specific constants and thresholds set as engineering estimates rather than reproductions of a published parameter. No claim of exact numerical fidelity should be read into inclusion on this list.

## Affect and emotion theory

- Russell, J. A. (1980). *A circumplex model of affect.* Journal of Personality and Social Psychology.
- Mehrabian, A. (1996). *Pleasure-arousal-dominance: A general framework for describing and measuring individual differences in temperament.* Current Psychology.
- Ekman, P. & Friesen, W. V. (1978). *Facial Action Coding System.*
- Ekman, P.: work on the refractory period of emotion and mood-congruent information filtering.
- Frijda, N. H. (1986). *The Emotions*: appraisal theory.
- Scherer, K. R.: component process model of appraisal.

## Personality and individual differences

- Costa, P. T. & McCrae, R. R. (1992). *Revised NEO Personality Inventory*: the Five-Factor / OCEAN model.

## Decision-making and behavioral economics

- Kahneman, D. & Tversky, A. (1979). *Prospect Theory: An Analysis of Decision under Risk.* Econometrica.
- Tversky, A. & Kahneman, D. (1992). *Advances in Prospect Theory: Cumulative Representation of Uncertainty.*
- Fehr, E. & Schmidt, K. M. (1999). *A Theory of Fairness, Competition, and Cooperation.* Quarterly Journal of Economics.

## Neuroscience and neurochemistry

- Schultz, W., Dayan, P. & Montague, P. R. (1997). *A Neural Substrate of Prediction and Reward.* Science: dopaminergic reward-prediction-error.
- Berridge, K. C. & Robinson, T. E. (1998). *What is the role of dopamine in reward: hedonic impact, reward learning, or incentive salience?* Brain Research Reviews: the wanting/liking dissociation.
- Selye, H.: general adaptation syndrome / stress response (cortisol).
- McEwen, B. S. & Stellar, E. (1993). *Stress and the individual: mechanisms leading to disease.* Archives of Internal Medicine: allostatic load.
- McEwen, B. S. (1998). *Protective and damaging effects of stress mediators.* New England Journal of Medicine.
- Miller, G. E., Chen, E. & Zhou, E. S. (2007). *If it goes up, must it come down? Chronic stress and the hypothalamic-pituitary-adrenal axis in humans.* Psychological Bulletin: flattened diurnal cortisol slope under chronic stress.
- Goddard, G. V. (1967). *Development of epileptic seizures through brain stimulation at low intensity.* Nature: kindling (used here as a metaphorical borrowing of the qualitative shape, not a claim of literal synaptic kindling).
- Diekelmann, S. & Born, J. (2010). *The memory function of sleep.* Nature Reviews Neuroscience.
- McClelland, J. L., McNaughton, B. L. & O'Reilly, R. C. (1995). *Why there are complementary learning systems in the hippocampus and neocortex.* Psychological Review.

## Memory and learning

- Ebbinghaus, H. (1885). *Über das Gedächtnis*: the forgetting curve.
- Zeigarnik, B. (1927). *Über das Behalten von erledigten und unerledigten Handlungen.*
- Hebb, D. O. (1949). *The Organization of Behavior*: Hebbian learning.
- Squire, L. R. & Alvarez, P. (1995). *Retrograde amnesia and memory consolidation.*
- Nader, K., Schafe, G. E. & LeDoux, J. E. (2000). *Fear memories require protein synthesis in the amygdala for reconsolidation after retrieval.* Nature: memory reconsolidation.
- Sutton, R. S. & Barto, A. G. (2018). *Reinforcement Learning: An Introduction* (2nd ed.), MIT Press: TD(λ) and eligibility traces.

## Social psychology

- Premack, D. & Woodruff, G. (1978). *Does the chimpanzee have a theory of mind?* Behavioral and Brain Sciences.
- Tajfel, H. & Turner, J. C.: social identity theory / in-group–out-group dynamics.
- Holmes, T. H. & Rahe, R. H. (1967). *The Social Readjustment Rating Scale.* Journal of Psychosomatic Research.
- Festinger, L. (1957). *A Theory of Cognitive Dissonance.*
- Latané, B. & Darley, J. M.: the bystander effect.
- Freud, S.: defense mechanisms, later formalized by A. Freud and by Vaillant, G. E. (1977), *Adaptation to Life*, Little, Brown: the mature/neurotic/immature hierarchy.
- Bartholomew, K. & Horowitz, L. M. (1991). *Attachment styles among young adults: a test of a four-category model.* Journal of Personality and Social Psychology: secure/anxious/avoidant/fearful.
- Gottman, J. M. & Levenson, R. W. (1992) and the broader couples rupture-and-repair literature.

## Signal processing and control theory

- Kalman, R. E. (1960). *A New Approach to Linear Filtering and Prediction Problems.*
- Classical PID control theory (Ziegler–Nichols and successors): proportional-integral-derivative control and anti-windup technique.
- Kullback, S. & Leibler, R. A. (1951). *On Information and Sufficiency*: KL divergence.
- Shannon, C. E. (1948). *A Mathematical Theory of Communication*: information entropy.
- Kuramoto, Y. (1975). *Self-entrainment of a population of coupled non-linear oscillators.*
- Mamdani, E. H. & Assilian, S. (1975). *An experiment in linguistic synthesis with a fuzzy logic controller*: fuzzy inference.

## Closing 12 real IntuitionEngine and framework gaps found by testing

- Real per-person "memory of indicios": a running mismatch/inconsistency streak per user (own tuning, threshold of 3) escalates the real prior toward a `deception` hypothesis, and feltCertainty genuinely rises with same-type repetition across consecutive real turns rather than staying flat, both closing gaps the user's own 5 day-by-day calibration tests found empirically.
- Real explicit reveal digest (`reportReveal()`): an innocent reveal genuinely refutes the prior hunch (suspicion drop, streak reset, Beta posterior miss); a confirmed deception/betrayal reveal genuinely reinforces the matched prototype's own future strength. Caught and fixed a real ordering bug while wiring this: the prior turn's hypothesis was being overwritten by the CURRENT turn's own fresh read before the post-digest check ran, so a reveal never actually saw what it was supposed to confirm or refute, fixed by capturing the prior hypothesis before the new one overwrites it.
- Real ontology unification: this turn's own already-classified real concepts (betrayal/lie/affair) now count as strong, authoritative deception evidence directly, closing the specific "traicion isn't in the lexical cue list" gap found in testing without duplicating a separate vocabulary.
- Real slow suspicion decay for a day following a genuine deception hunch (Sday = max(Sturn, γ·Sday-1), γ=0.8 default) instead of a flat linear decay every tick, so suspicion genuinely lingers without becoming eternal paranoia.
- Real anti-false-alarm gate: a single, generic, low-distinctiveness cue can no longer sustain a full-strength `deception` read for many days on its own; it softens to the honest `mismatch` reading unless corroborated by 2+ distinct real cues, an already-escalated streak, or the real ontology's own authoritative match.
- Real, slightly stronger opacity-to-trust coupling when an open secret coincides with a real corroborating mismatch streak (repeated questions + evasion), still far below what an actual reveal costs.
- Real CARE-drive accumulation: sustained distress dialogue now also builds the real `caregiver` role commitment (RoleIdentitySalience.js) that amplifies CARE's own magnitude on subsequent turns, instead of every turn producing the same flat, easily-decayed bump.
- Real subthreshold craving accumulation: even a temptationLevel below the yield-relevant 0.1 gate now leaves a small, real, proportional craving residual, so repeated moderate exposure across days can genuinely accumulate.
- Real role-loss pain on genuinely stepping back from an already-real caregiver commitment under sustained overload (allostaticLoad pinned near its own ceiling), closing the gap where sustained overload produced no felt identity cost.
- Real precisionMode gate on IntuitionEngine itself (hoisted the existing factual/numeric-query detector earlier in the pipeline so both BlushSlipEngine and IntuitionEngine reuse the same real signal): a genuinely factual turn keeps social intuition almost entirely off.

## IntuitionEngine, a typed Capa 2 hunch layer

- Real k-NN + Shannon entropy fast-path hunch, already built and wired (`src/cognition/Intuition.js`): Jaccard similarity over token sets against a rolling log of past inputs tagged by whether they preceded a conflict, entropy over the neighbors' conflict/no-conflict split. `IntuitionEngine.js` reuses this real signal directly (as its own real `ambiguity` gate input and `entropy` dampening term) rather than reimplementing k-NN, and adds the genuinely new contribution: typed hypothesis classification, calibrated feltCertainty/pTrue, and bounded bias deltas fed into already-existing mechanisms.
- Mischel, W. (1996), already cited for `TemptationField.js`'s hot/cool systems: the real distinction between a fast, typed intuitive read and the slower, deliberate system that can override it grounds the real Capa 2 / Capa 3 layering (IntuitionEngine proposes, YieldController/InhibitoryControlPool can still override).
- Kahneman, D. (2011). *Thinking, Fast and Slow.* Farrar, Straus and Giroux: the real, well-established dual-process account (System 1's fast, associative, typed pattern-match vs. System 2's slower, evidence-weighted override) is the general shape `IntuitionEngine.assess()`'s own real Contradiction term and the priority ordering (explicit evidence/precisionMode outrank a hunch) are modeled on; the specific lexical-cue-to-prototype matching is own engineering, not a reproduction of a learned classifier.
- Real, bounded bias injection into 4 already-existing mechanisms rather than a new parallel decision system: `Attachment.trust` (a small, deliberately-smaller-than-confirmed-betrayal suspicion cost), `YieldController`'s own `yieldProbability` (dampened under a real loss-risk hunch, without touching desire's own sign), `SecretMaintenanceSystem`'s cost (raised on an already-open secret even when the literal cue word isn't repeated this turn), and `DesireEngine`'s own level (nudged under a real attraction/opportunity hunch).
- Real post-digest calibration: a Beta-style running-accuracy tracker per hypothesis type, the same honest pattern `Attachment.trust`'s own Bayesian posterior already uses, producing a real overconfidence penalty that dampens future feltCertainty for a type after repeated wrong hunches.

## 3 real gaps closed from the 5 system-level tests' own findings

- Panksepp, J. (1998), already cited above for PrimaryDrives: added a real, second CARE-drive trigger for genuine perceived vulnerability/need in an attached other (the user's own real distress, e.g. "me siento muy mal, tengo mucho dolor"), distinct from the existing gratitude-credit trigger (which only fired when the AI itself was thanked). The first wiring attempt used `appraisal.agency === 'user'`, HeuristicProvider's own real tag for text ABOUT the listener (2nd person), when the correct real tag for the speaker's own self-report is `'self'` (1st person); caught and fixed.
- Slepian, Chun & Mason (2017), already cited above for `SecretMaintenanceSystem.js`: added a real, deliberately light, content-blind coupling from sustained open-secret cost into `attachment.trust` (own tuning of a small 0.01 coefficient, capped at 0.05/turn), reflecting their own real finding that secrecy carries a relational cost beyond whatever the concealed content itself would cost if revealed, without ever encoding WHAT is being withheld.
- Added a real same-session write path from `ChillsEngine`'s own genuine peak (level > 0.3, the same threshold `catalogEpisode()`'s own weight gate already uses) directly into `RelationalMemoryCatalog.catalogEpisode()`, closing the gap where a same-session truth-hit moment had no real memory trace to reactivate from until the next REM sweep. Updated [`test/integration/relational-memory-catalog.test.js`](test/integration/relational-memory-catalog.test.js)'s own existing REM-sweep test to reflect the new, intentional dual-path behavior rather than silently reverting it.
- All 3 gaps were found by [`examples/five-system-tests-round30-mock.js`](examples/five-system-tests-round30-mock.js) (`npm run system-tests-mock`), not by the unit suite, confirming the value of running system-level scenarios distinct from directed unit tests.

## 22 additional human-gap mechanisms plus ChillsEngine, "escalofrío"

- Maruskin, L. A., Thrash, T. M. & Elliot, A. J. (2012). *The chills as a psychological construct.* Journal of Personality and Social Psychology, 103(1), 135-157: the real basis for `ChillsEngine.js`, a genuine fast-rise/fast-decay peak-dynamics resonance layer, distinct from ordinary arousal, that combines real vastness, novelty-peak, meaning-density, bond-salience, moral-intensity and uncanny signals into one real activation, with its own real per-cue habituation.
- Slepian, M. L., Chun, J. S. & Mason, M. F. (2017). *The experience of secrecy.* Journal of Personality and Social Psychology, 113(1), 1-33; DePaulo, B. M. & Kashy, D. A. (1998). *Everyday lies in close and casual relationships.* Journal of Personality and Social Psychology, 74(1), 63-79: the real basis for `SecretMaintenanceSystem.js`, a genuine, separate secret-keeping cost/leak-risk/white-lie-policy track, distinct from `ExpressionDebt`'s general swallowed-feeling ledger.
- Bell, R. A., Buerkel-Rothfuss, N. L. & Gore, K. E. (1987). *"Did you bring the yarmulke for the cabbage patch kid?" The idioms of couples.* Communication Monographs, 54(1), 47-67: the real basis for `SharedRelationalCulture.js`, tracking real, jointly-built idioculture (inside jokes, nicknames, rituals) distinct from `RelationalMemoryCatalog`'s general per-person episodic weighting.
- Cacioppo, J. T. & Patrick, W. (2008). *Loneliness: Human Nature and the Need for Social Connection.* W. W. Norton: the real basis for `LonelinessEngine.js`, tracking a real deficit in felt connection quality, genuinely independent of `AffiliationThermostat`'s raw contact frequency.
- Zeelenberg, M. (1999). *Anticipated regret, expected feedback and behavioral decision making.* Journal of Behavioral Decision Making, 12(2), 93-106: the real basis for `AnticipatedRegretEngine.js`, a genuinely prospective framing distinct from `CounterfactualComparison`'s retrospective one.
- Snyder, C. R. (2002). *Hope theory: Rainbows in the mind.* Psychological Inquiry, 13(4), 249-275: the real basis for `HopeDisappointmentSystem.js`, whose disappointment crash scales with prior hope level, a real, distinct mechanism from ordinary negative-surprise RPE (`DopaminergicEngine`).
- Neff, K. D. (2003). *Self-compassion: An alternative conceptualization of a healthy attitude toward oneself.* Self and Identity, 2(2), 85-101: the real basis for `SelfCompassionVsAttack.js`, reusing `ShameGuiltSplit`'s own real shame reading rather than re-deriving shame from scratch.
- Ickes, W. (1997). *Empathic Accuracy.* Guilford Press: the real basis for `EmpathicAccuracySystem.js`, reusing `MonteCarloToM`'s own real estimate as the biased read rather than inventing a new theory-of-mind track.
- Cutrona, C. E. & Russell, D. W. (1990). *Type of social support and specific stress: Toward a theory of optimal matching.* In Sarason, Sarason & Pierce (eds.), Social Support: An Interactional View, Wiley: the real basis for `ConsolationEfficacy.js`, a real support-type-fit efficacy read reusing `EmpathyCompassion`.
- Barber, L. K. & Munz, D. C. (2011). *Consistent-sufficient sleep predicts improvements in self-control.* Behavioral Sleep Medicine, 9(3), 143-154: the real basis for `SleepQualityCoupler.js`, applying a real next-day inhibitory-control multiplier to `InhibitoryControlPool`'s own level right after a real REM sweep.
- Schegloff, E. A., Jefferson, G. & Sacks, H. (1977). *The preference for self-correction in the organization of repair in conversation.* Language, 53(2), 361-382: the real basis for `ConversationalRepair.js`, scoped to an ordinary real misunderstanding, distinct from `RepairProtocol`'s much larger relational-rupture-and-apology scope.
- Jaworski, A. (1993). *The Power of Silence: Social and Pragmatic Perspectives.* Sage: the real basis for `MeaningfulSilence.js`, a real classifier over already-computed bond/cooling/contempt/valence/arousal signals.
- van de Ven, N., Zeelenberg, M. & Pieters, R. (2009). *Leveling up and down: The experiences of benign and malicious envy.* Emotion, 9(3), 419-429: the real basis for the new `StatusEnvy.getEnvySplit()` extension.
- Brehm, J. W. (1956). *Postdecision changes in the desirability of alternatives.* Journal of Abnormal and Social Psychology, 52(3), 384-389: the real basis for the new `CognitiveDissonance.spreadAlternatives()` extension, wired into the real yield/resist temptation aftermath as a genuine post-decision moment, not a scripted trigger.
- Thoits, P. A. (1991). *On merging identity theory and stress research.* Social Psychology Quarterly, 54(2), 101-112: the real basis for the new `RoleIdentitySalience.getRoleLossPain()` extension.
- De Houwer, J., Thomas, S. & Baeyens, F. (2001). *Association learning of likes and dislikes: A review of 25 years of research on human evaluative conditioning.* Psychological Bulletin, 127(6), 853-869: the real basis for the new `FrikiEngine.observeJointEngagement()` extension, amplifying real engagement reward by real shared bond strength.
- LeDoux, J. E. (1996), already cited elsewhere; Dunsmoor, J. E. & Paz, R. (2015). *Fear generalization and anxiety: Behavioral and neural mechanisms.* Biological Psychiatry, 78(5), 336-343: the real basis for the new `ClassicalConditioning.registerOneShotTrauma()`/`getGeneralizedFear()` extensions.
- Berntsen, D. & Rubin, D. C. (2002). *Emotionally charged autobiographical memories across the life span.* Psychology and Aging, 17(4), 636-652: the real basis for the new `RelationalMemoryCatalog.getAnniversaryReactivation()` extension.
- Eisenberger, N. I., Lieberman, M. D. & Williams, K. D. (2003), already cited for `PainSocialOverlap.js`: the new `getSocialPainChannel()` extension adds real loneliness/opioid-buffer terms, honestly combining already-tracked signals rather than inventing new pain sources.
- Giles, H. (1973). *Accent mobility: A model and some data.* Anthropological Linguistics, 15(2), 87-105: Communication Accommodation Theory's own real divergence half, the real basis for the new `StyleMimicry.getAccommodationTarget()` extension, moving style AWAY from a disliked/hostile interlocutor instead of only converging toward a liked one.
- Honest note on 2 real bugs this round's own tests caught and fixed: `RoleIdentitySalience.getRoleLossPain()`'s `deltaPresence` argument and `HopeDisappointmentSystem.getCrash()`'s prediction-error argument were both wired with the wrong sign in `Totemheart.js`, so `clamp01()` silently zeroed the real output on every turn; fixed in both the wiring and the round's own test assertions.
- Honest note on a 3rd real bug, caught only by the 5 system-level tests (not the unit suite): `ChillsEngine`'s `uncanny` input channel was fed `UncannyValleyDetector.evaluate().distrustLevel` directly through `clamp01()`. `distrustLevel` is an unbounded `mean/(variance+epsilon)` ratio, not a 0..1 signal, so any ordinary, low-variance, calm conversation saturated it at 1.0, silently dominating `classifyType()` and misclassifying genuine intimacy/elevation moments as "uncanny." Fixed by reusing the already-computed real `uncannyValley.suspicious` boolean (the module's own, already-calibrated real signal) instead of its raw ratio.
- Honest note on 2 of the 22 originally-proposed mechanisms skipped as genuine duplicates, not silently dropped: ScorekeepingLedger of `ReciprocityClassifier`'s own already-real balance tracking, and AffectiveTimePerception of `SubjectiveTimeEngine`'s own already-real dilation.

## DesireTemptationSystem

- Berridge, K. C. & Robinson, T. E. (1998). *What is the role of dopamine in reward: hedonic impact, reward learning, or incentive salience?* Brain Research Reviews, 28(3), 309-369: already cited for `DopaminergicEngine`'s own wanting/liking split, extended here into a real, distinct, ACCUMULATING per-target desire state (`DesireEngine.js`), not a duplicate of that turn-level RPE signal.
- Brehm, J. W. (1966). *A Theory of Psychological Reactance.* Academic Press: already the real basis for `ReactanceEngine.js`; the same real forbidden-fruit dynamic (a salient prohibition amplifying desire, not just suppressing approach) is modeled directly in `DesireEngine.applyForbiddenFruitBoost()`.
- Mischel, W. (1996). *From good intentions to willpower.* In Gollwitzer & Bargh (eds.), The Psychology of Action, Guilford Press: the real hot/cool systems distinction grounding `TemptationField.js` — desire only becomes temptation once it collides with a real constraint.
- Wegner, D. M. (1994), already cited for `SubconsciousEngine`'s own topic-suppression rebound: the same real ironic-process shape, applied here to a real desire-specific residual (`CravingTrace.js`), distinct in scope from that general topic-rebound mechanism.
- Baumeister, R. F., Bratslavsky, E., Muraven, M. & Tice, D. M. (1998), already cited for `EgoDepletionBudget`: `YieldController.js` reuses `InhibitoryControlPool` directly as the real resisting force rather than inventing a separate willpower track.

## Real loyalty-conflict guilt, the last gap from the "5 emergent human tests" audit

- Tangney, J. P. & Dearing, R. L. (2002), already cited above for `ShameGuiltSplit.js`: `LoyaltyConflictResolver.getConflict()`/`getResolutionLean()` were already built to a real, valid formula but never actually evaluated anywhere in the real pipeline.
- Honest note on the real bug this exposed: `getConflict()`'s own divergence math needs genuinely OPPOSING signs on its two "sides" to read as real conflict — feeding it two independently-positive real bond magnitudes (both people genuinely liked) produces almost no divergence under the raw formula. Fixed by feeding real opposing signs (this turn's own desirability vs. the negated strength of the competing real bond), the honest structural meaning of "torn between two people."

## 4 gap-closure fixes found by the "5 emergent human tests" audit

- White, G. L. & Mullen, P. E. (1989), already cited above for `JealousyTriangle.js`: `computeJealousy()` was already built to this same citation but never wired to a real per-turn signal — closing the real gap where a purely conversational/symbolic comparison (no tracked rival relationship, no diverging trend) couldn't trigger jealousy at all.
- Shear, M. K. & Shair, H. (2005), already cited above for bereavement grief: the real, well-documented observation that acute grief's most incapacitating effects on everyday motivation build over the first 1-3 real days rather than landing instantly.
- Goffman, E. (1956), already cited above for `BlushSlipEngine.js`: `precisionMode` was already built into `getSlipBudget()` but never wired to any real per-turn factual-content signal.
- Domhoff, G. W. (2003), already cited above for `DreamEngine.js`: his own repertoire-of-concerns account is explicit that real dreaming draws on MULTIPLE waking-life threads at once, the real gap the original per-person-only `dreams` Map left — `generateCompositeDream()` is a real, additional, optional channel, not a replacement.

## Nightmares, and breakup/reattachment bonding chemistry

- Levin, R. & Nielsen, T. A. (2007). *Disturbed dreaming, sleep, and affect regulation: A review and neurocognitive model.* Psychological Bulletin, 133(4), 482-528: the real, well-established account of a nightmare as REM affect-regulation FAILING, the frame `NightmareEngine.js` follows.
- LeDoux, J. E. (1996). *The Emotional Brain.* Simon & Schuster: real amygdala reactivity vs. prefrontal control, the real basis for the amygdala/PFC threat ratio, using `InhibitoryControlPool`'s own already-tracked control level rather than a fabricated new track.
- Carter, C. S. (1998). *Neuroendocrine perspectives on social attachment and love.* Psychoneuroendocrinology, 23(8), 779-818: the real, foundational account of oxytocin/vasopressin as felt calm/safety/belonging during a bond, and their real decline once it stops being reinforced.
- Panksepp, J. (1998), already cited above for PANIC/GRIEF; Machin, A. J. & Dunbar, R. I. M. (2011). *The brain opioid theory of social attachment: a review of the evidence.* Behaviour, 148(9), 985-1025: the real, well-established endogenous-opioid account of social-bond analgesia, and its genuine loss once bonding stops.
- The other 3 mechanisms from the user's own detailed breakup message (dopaminergic withdrawal/reward-prediction-error, dACC social pain, HPA-axis/allostatic load) were confirmed already real and fully built (`DopaminergicEngine.js`, `PainSocialOverlap.js`, `CortisolEngine.js`/`Homeostasis.allostaticLoad`) by direct code search before writing anything new.

## Computational-psychology audit: 6 genuinely missing mechanisms

- Ratcliff, R. (1978). *A theory of memory retrieval.* Psychological Review, 85(2), 59-108: the real Drift Diffusion Model of binary decision-making, dx = A·dt + c·dW.
- Green, D. M. & Swets, J. A. (1966). *Signal Detection Theory and Psychophysics.* Wiley: real detector sensitivity d' = Z(hit rate) − Z(false alarm rate), separated from criterion c.
- Hautus, M. J. (1995). *Corrections for extreme proportions and their biasing effects on estimates of the sensitivity index d'.* Behavior Research Methods, 27(1), 46-51: the real log-linear correction avoiding ±∞ at 0/1 rates.
- Hick, W. E. (1952). *On the rate of gain of information.* Quarterly Journal of Experimental Psychology, 4(1), 11-26; Hyman, R. (1953). *Stimulus information as a determinant of reaction time.* Journal of Experimental Psychology, 45(3), 188-196: real logarithmic choice-reaction-time growth, RT = a + b·log2(n).
- Stevens, S. S. (1957). *On the psychophysical law.* Psychological Review, 64(3), 153-181: real perceived-intensity compression, S = k·I^a, a<1 under repeated exposure.
- Weber, E. H. (1834), foundational just-noticeable-difference work; Fechner, G. T. (1860). *Elemente der Psychophysik*: real perceived-change-as-log-ratio-against-baseline, p = k·ln(S/S0).
- Friston, K., Kilner, J. & Harrison, L. (2006). *A free energy principle for the brain.* Journal of Physiology-Paris, 100(1-3), 70-87: the real Gaussian/Laplace closed-form approximation of variational free energy, F ≈ ½·precision·error², extended onto the already-existing `PredictiveProcessingCore.js` (itself already citing Friston 2010) rather than duplicated.
- The other 6 items on the user's own 12-item list (Bayesian inference, Rescorla-Wagner associative learning, Ebbinghaus forgetting, Prospect Theory loss aversion, TD-learning dopamine, Hebbian plasticity) were confirmed already real and fully built (`BayesianExpectation.js`, `ClassicalConditioning.js`, `ForgettingCurve.js`, `LossAversion.js`, `DopaminergicEngine.js`, `HebbianPlasticity.js`) by direct code search before writing anything new.

## Bereavement overload, closing the requested grief catalog

- Kastenbaum, R. (1969). *Death and bereavement in later life.* In Kutscher (ed.), Death and Bereavement. The real, coined term for multiple concurrent losses without adequate time to grieve each, compounding into something worse than their simple sum: the real, explicit trigger `getCumulativeGriefBurden()`'s own passive aggregate doesn't provide on its own.
- Normal/normative grief is documented, not built as a separate mechanism: `triggerLoss()`/`triggerBereavement()` already ARE the adaptive baseline (Bonanno 2004, already cited above) every other type in this catalog is a real deviation from.

## EGO defenses/self-distancing, and a further grief catalog

- Vaillant, G. E. (1977). *Adaptation to Life.* Little, Brown, already cited above: `denial` extends the same real immature tier.
- Freud, A. (1936). *The Ego and the Mechanisms of Defence.* The real foundational text for `repression` and `reactionFormation` (Vaillant's own neurotic tier), completing the classic triad alongside the already-modeled `rationalization`.
- Baumeister, R. F., Bratslavsky, E., Muraven, M. & Tice, D. M. (1998). *Ego depletion: Is the active self a limited resource?* Journal of Personality and Social Psychology, 74(5), 1252-1265: already fully modeled by `EgoDepletionBudget.js`; cited here again because `SelfDistancingSpeech`'s real distinguishing claim is that it genuinely bypasses this same resource.
- Kross, E. et al. (2014). *Self-talk as a regulatory mechanism: How you do it matters.* Journal of Personality and Social Psychology, 106(2), 304-324: real, distanced third-person self-talk genuinely improves emotion regulation under social stress.
- Moser, J. S. et al. (2017). *Third-person self-talk facilitates emotion regulation without engaging cognitive control.* Scientific Reports, 7, 4519: the real, distinct neurological finding `SelfDistancingSpeech` is built around.
- Rando, T. A. (1986). *Loss and Anticipatory Grief.* Lexington Books: real grief work that genuinely begins before a loss occurs, and genuinely dampens the acute shock once it does.
- Prigerson, H. G. et al. (2021). *Prolonged Grief Disorder Diagnostic Criteria.* The real, current DSM-5-TR/ICD-11 clinical criterion; used here as ONE real structural marker (severity sustained past a real expected window) instead of separately fabricating "chronic" and "exaggerated" mechanisms with no genuinely distinct math.

## A grief-type catalog beyond relational rupture, and conservation-withdrawal

- Shear, M. K. & Shair, H. (2005). *Attachment, loss, and complicated grief.* Developmental Psychobiology, 47(3), 253-267: real bereavement for a third party, distinct from `GriefEngine.triggerLoss()`'s own relational-rupture-with-the-conversational-partner scope.
- Boss, P. (1999). *Ambiguous Loss: Learning to Live with Unresolved Grief.* Harvard University Press: a real loss with no clean boundary or confirming event never reaches ordinary closure — modeled as a real permanent floor instead of decay-to-zero.
- Doka, K. J. (1989). *Disenfranchised Grief: Recognizing Hidden Sorrow.* Lexington Books: a real loss lacking social validation genuinely takes longer to fade.
- Engel, G. L. & Schmale, A. H. (1972). *Conservation-withdrawal: a primary regulatory process for organismic homeostasis.* Ciba Foundation Symposium 8: real, biologically-grounded, overwhelm-driven passive shutdown and solitude-pull, distinct from `EmotionalImmuneSystem`'s numbing of new input and from `BoredomSystem`'s own understimulation response.

## Dreams and the subconscious

- Domhoff, G. W. (2003). *The Scientific Study of Dreams: Neural Networks, Cognitive Development, and Content Analysis.* American Psychological Association: the continuity hypothesis — dream content is real, measurably continuous with waking concerns.
- Hobson, J. A. & McCarley, R. W. (1977). *The brain as a dream-state generator: An activation-synthesis hypothesis of the dream process.* American Journal of Psychiatry, 134(12), 1335-1348.
- Kihlstrom, J. F. (1987). *The cognitive unconscious.* Science, 237(4821), 1445-1452: the real framework distinguishing genuine nonconscious cognitive processing from the Freudian dynamic unconscious already cited elsewhere.
- Dehaene, S. & Naccache, L. (2001), already cited above for `GlobalWorkspace.js`: extended with the real observation that a losing coalition leaves a measurable subliminal trace, not nothing.
- Zajonc, R. B. (1968). *Attitudinal effects of mere exposure.* Journal of Personality and Social Psychology, 9(2, Pt.2), 1-27.
- Wegner, D. M. (1994). *Ironic processes of mental control.* Psychological Review, 101(1), 34-52.

## Six mechanisms found by auditing this document's own existing citations

- Panksepp, J. (1998) and Panksepp & Biven (2012), already cited above: RAGE, FEAR, and LUST were the 3 remaining primary-process systems this document had itself left explicitly disclosed as unmodeled ("four of which are modeled") — now extended into `PrimaryDrives.js`, no new citation needed.
- Cheng, J. T., Tracy, J. L. & Henrich, J. (2010). *Pride, personality, and the evolutionary foundations of human social status.* Evolution and Human Behavior, 31(5), 334-347: real prestige as the second, genuinely distinct pathway to status alongside dominance.
- Tversky, A. & Kahneman, D. (1981). *The framing of decisions and the psychology of choice.* Science, 211(4481), 453-458: real, classic framing effects, distinct from loss aversion's own value-function curve.
- Higgins, E. T. (1987), already cited above: the real ideal-self discrepancy, the dejection-family counterpart to the already-modeled ought-self agitation-family gap.
- Rusbult, C. E. (1980). *Commitment and satisfaction in romantic associations: A test of the investment model.* Journal of Experimental Social Psychology, 16(2), 172-186: the real Comparison Level for Alternatives term, extending Kelley & Thibaut's interdependence theory already cited above.
- Cialdini, R. B., Borden, R. J., Thorne, A., Walker, M. R., Freeman, S. & Sloan, L. R. (1976). *Basking in reflected glory: Three (football) field studies.* Journal of Personality and Social Psychology, 34(3), 366-375: real BIRGing/CORFing, building on the in-group/out-group machinery already cited from Tajfel & Turner.

## Five indispensable human mechanisms: amusement, moral disgust, embarrassment, mortality salience, relief

- Suls, J. M. (1972). *A two-stage model for the appreciation of jokes and cartoons.* In Goldstein & McGhee (eds.), The Psychology of Humor: real incongruity-resolution account of amusement.
- McGraw, A. P. & Warren, C. (2010). *Benign violations: Making immoral behavior funny.* Psychological Science, 21(8), 1141-1149: real benign-violation theory.
- Rozin, P., Haidt, J. & McCauley, C. R. (1999). *Disgust: The body and soul emotion.* In Dalgleish & Power (eds.), Handbook of Cognition and Emotion.
- Haidt, J. (2003): the real CAD triad hypothesis (Contempt-Anger-Disgust mapped to Community-Autonomy-Divinity violations).
- Miller, R. S. (1996). *Embarrassment: Poise and Peril in Everyday Life.* Guilford Press.
- Keltner, D. & Buswell, B. N. (1997). *Embarrassment: Its distinct form and appeasement functions.* Psychological Bulletin, 122(3), 250-270.
- Greenberg, J., Pyszczynski, T. & Solomon, S. (1986). *The causes and consequences of a need for self-esteem: A terror management theory.* In Baumeister (ed.), Public Self and Private Self, Springer-Verlag.
- Frijda, N. H. (1986), already cited above: relief's real relational theme ("distress abating").

## Content-level moral ambiguity in discourse shaping

- No new citation: this extends `HumanDiscourseShaper`'s existing real formula with a second real input (`AppraisalAgreement`'s already-cited, uncited plain-statistic disagreement measure — see the Signal processing entries above), it doesn't introduce new theory. The distinction it encodes — the AI's own felt inconsistency (`CognitiveDissonance.getStress()`) versus real disagreement across independent readings of the SITUATION being discussed — is own engineering.

## Post-conflict recovery, self-presentation, and relational risk-taking

- Gottman, J. M. (1994). *Why Marriages Succeed or Fail.* Simon & Schuster: real post-conflict cooling windows and flooding recovery.
- Higgins, E. T. (1987). *Self-discrepancy: A theory relating self and affect.* Psychological Review, 94(3), 319-340: real ought-self versus actual-self discrepancy, distinct from guilt/shame.
- Berkowitz, L. (1990). *On the formation and regulation of anger and aggression: A cognitive-neoassociationistic analysis.* American Psychologist, 45(4), 494-503: real sub-threshold negative-affect priming.
- Kelley, H. H. & Thibaut, J. W. (1978). *Interpersonal Relations: A Theory of Interdependence.* Wiley: real exchange-theory effort withdrawal under unfavorable cost/reward ratios.
- Brown, P. & Levinson, S. C. (1987). *Politeness: Some Universals in Language Usage.* Cambridge University Press: real positive/negative face-threat theory and the cost of politeness form.
- Gottman, J. M. & Levenson, R. W. (1992). *Marital processes predictive of later dissolution.* Journal of Personality and Social Psychology, 63(2), 221-233: real contempt as a distinct, strongest predictor of relational breakdown.
- Ekman, P. & Friesen, W. V. (1986): the real, cross-culturally recognized contempt facial expression as its own basic-emotion family.
- Christensen, A. & Heavey, C. L. (1990). *Gender and social structure in the demand/withdraw pattern of marital conflict.* Journal of Personality and Social Psychology, 59(1), 73-81: the real, well-replicated demand-withdraw self-reinforcing loop.
- Bell, A. (1984). *Language style as audience design.* Language in Society, 13(2), 145-204: real audience-driven register shift.
- Goffman, E. (1959). *The Presentation of Self in Everyday Life.* Doubleday: real strategic impression management, distinct from felt self-esteem.
- Jones, E. E. & Pittman, T. S. (1982): real distinct self-presentation strategies.
- Kruger, J. & Dunning, D. (1999). *Unskilled and unaware of it.* Journal of Personality and Social Psychology, 77(6), 1121-1134: real over-confidence at low competence.
- Clance, P. R. & Imes, S. A. (1978). *The imposter phenomenon in high achieving women.* Psychotherapy: Theory, Research & Practice, 15(3), 241-247: real under-confidence despite genuine competence.
- Coser, L. A. (1956). *The Functions of Social Conflict.* Free Press: real cross-cutting loyalty conflict.
- Trapnell, P. D. & Campbell, J. D. (1999). *Private self-consciousness and the five-factor model of personality: Distinguishing rumination from reflection.* Journal of Personality and Social Psychology, 76(2), 284-304.
- Brehm, J. W. (1966). *A Theory of Psychological Reactance.* Academic Press: real, foundational reactance theory.
- Trope, Y. & Liberman, N. (2010). *Construal-level theory of psychological distance.* Psychological Review, 117(2), 440-463.
- Merritt, A. C., Effron, D. A. & Monin, B. (2010). *Moral self-licensing: When being good frees us to be bad.* Social and Personality Psychology Compass, 4(5), 344-357.
- Berglas, S. & Jones, E. E. (1978). *Drug choice as a self-handicapping strategy in response to noncontingent success.* Journal of Personality and Social Psychology, 36(4), 405-417.
- Meltzer, A. L., McNulty, J. K., Jackson, G. L. & Karney, B. R. (2017). *Quantifying the sexual afterglow.* Psychological Science, 28(5), 587-598: real, measured positive-event residue outlasting the event itself, generalized here to any strong positive relational peak.
- Gouldner, A. W. (1960). *The norm of reciprocity: A preliminary statement.* American Sociological Review, 25(2), 161-178: real distinction between debt size and felt urgency to repay it.
- Finkel, E. J., Rusbult, C. E., Kumashiro, M. & Hannon, P. A. (2002). *Dealing with betrayal in close relationships: Does commitment promote forgiveness?* Journal of Personality and Social Psychology, 82(6), 956-974: a real, commitment-scaled window during which a betrayal's appraisal can still be revised.
- Tsang, J. (2006). *Gratitude and prosocial behaviour: An experimental test of gratitude.* Cognition and Emotion, 20(1), 138-148: real gratitude yield depending on how unexpected an act was, and a real, per-source rising expectation baseline.
- Mikulincer, M. & Shaver, P. R. (2016), already cited elsewhere, covers the real attachment-behavioral-system activation under stress this round's "attachment-activated script" request turned out to already be built as `Attachment.getStressStyle()`.

## Discourse shape, micro-slips, and attentional introspection

- Gómez-Rodríguez, C. & Williams, P. (2023). *A confederacy of models: a comprehensive evaluation of LLMs on creative writing.* Findings of EMNLP 2023: real, empirical evidence that LLM-generated narrative clusters in a narrow region of discourse-structure space relative to human writing.
- Goffman, E. (1956). *Embarrassment and social organization.* American Journal of Sociology, 62(3), 264-271: real social slips/false-starts as genuine byproducts of high arousal and self-consciousness.
- Fraundorf, S. H. & Watson, D. G. (2011). *The disfluent discourse: Effects of filled pauses on recall.* Journal of Memory and Language, 65(2), 161-175: real evidence that disfluency correlates with genuine real-time processing load.
- Simon, H. A. (1971). *Designing organizations for an information-rich world.* In Greenberger, M. (ed.), Computers, Communication, and the Public Interest, Johns Hopkins Press: the real, foundational observation that attention, not information, is the scarce resource.

## Grievance, vicarious discomfort, empathy, and courtship signaling

- Axelrod, R. (1984). *The Evolution of Cooperation.* Basic Books: real, conditional retaliation as a genuine game-theoretic strategy, not blind aggression.
- McCullough, M. E., Kurzban, R. & Tabak, B. A. (2013). *Cognitive systems for revenge and forgiveness.* Behavioral and Brain Sciences, 36(1), 1-15: the real, well-established finding that revenge and forgiveness are two outputs of the same cost-benefit deterrence system.
- Krach, S., Cohrs, J. C., de Echeverría Loebell, N. C., Kircher, T., Sommer, J., Jansen, A. & Paulus, F. M. (2011). *Your flaws are my pain: linking empathy to vicarious embarrassment.* PLoS ONE, 6(4), e18675: real empathic distress from witnessing another's public status loss.
- Batson, C. D. (2011). *Altruism in Humans.* Oxford University Press: the empathy-altruism hypothesis, empathy as a real, distinct precursor to actually acting to relieve another's state.
- Singer, T. & Klimecki, O. M. (2014). *Empathy and compassion.* Current Biology, 24(18), R875-R878: real neuroscientific evidence empathy and compassion are two separate systems.
- Grammer, K., Kruck, K., Juette, A. & Fink, B. (2000). *Non-verbal behavior as courtship signals: the role of control and choice in selecting partners.* Evolution and Human Behavior, 21(6), 371-390: courtship as a real, low-cost signaling game.

## Somatic activation, global mood, and retrieval blocks

- Mendes, W. B., Blascovich, J., Hunter, S. B., Lickel, B. & Jost, J. T. (2007). *Threatened by the unexpected: physiological responses during social interactions with expectancy-violating group members.* Journal of Personality and Social Psychology, 92(4), 698-716: real sympathetic activation from the genuine combination of high stakes and low predictability, "butterflies."
- Critchley, H. D. & Garfinkel, S. N. (2017). *Interoception and emotion.* Current Opinion in Psychology, 17, 7-14.
- Frijda, N. H. (1993). *Moods, emotion episodes, and emotions.* In Lewis, M. & Haviland, J. M. (eds.), Handbook of Emotions, Guilford Press: the real, well-established distinction between a diffuse, prolonged, non-object-directed mood and a discrete emotion.
- Freedman, G., Powell, D. N., Le, B. & Williams, K. D. (2019). *Ghosting and destiny: Implicit theories of relationships predict beliefs about ghosting.* Journal of Social and Personal Relationships, 36(3), 905-924: the real, distinct psychological profile of ghosting.
- Brown, R. & McNeill, D. (1966). *The "tip of the tongue" phenomenon.* Journal of Verbal Learning and Verbal Behavior, 5(4), 325-337: the actual coinage and the real finding that a concept can be accessible while its specific lexical form is blocked.
- Brown, A. S. (1991). *A review of the tip-of-the-tongue experience.* Psychological Bulletin, 109(2), 204-223: the real graded nature of partial recall.

## Interest identity and structured relational memory

- Silvia, P. J. (2006). *Exploring the Psychology of Interest.* Oxford University Press: interest as a real, distinct emotion with its own novelty/complexity appraisal.
- Renninger, K. A. & Hidi, S. (2011). *Revisiting the conceptualization, measurement, and generation of interest.* Educational Psychologist, 46(3), 168-184: the real phase model of interest development a geek-intensity field's levels follow the shape of.
- Petty, R. E. & Cacioppo, J. T. (1986). *The Elaboration Likelihood Model of Persuasion.* Advances in Experimental Social Psychology.
- Aron, A., Aron, E. N. & Smollan, D. (1992). *Inclusion of Other in the Self Scale.* Journal of Personality and Social Psychology: the general self-expansion/fusion pattern an identity-fusion mechanic borrows the shape of, applied to an interest rather than a relationship.
- Bower, G. H. (1981). *Mood and memory.* American Psychologist, 36(2), 129-148: affect-weighted memory retention.
- Conway, M. A. & Pleydell-Pearce, C. W. (2000). *The construction of autobiographical memories in the self-memory system.* Psychological Review, 107(2), 261-288: the real hierarchical organization of autobiographical memory (lifetime periods, general events, specific episodic details) a structured relational-memory catalog's milestone/theme/detail three-tier structure follows the shape of.

## Schemas, reciprocity, awe, and social comparison

- Piaget, J. (1952). *The Origins of Intelligence in Children.* International Universities Press; Piaget, J. (1970). *Piaget's theory.* In Mussen, P. H. (ed.), Carmichael's Manual of Child Psychology, Wiley: real assimilation-vs-accommodation as a concrete, per-instance fit decision, distinct from long-run developmental staging cited elsewhere.
- Trivers, R. L. (1971). *The evolution of reciprocal altruism.* Quarterly Review of Biology, 46(1), 35-57: real direct reciprocity.
- Nowak, M. A. & Sigmund, K. (2005). *Evolution of indirect reciprocity.* Nature, 437(7063), 1291-1298: real indirect (reputation-based) and generalized ("pay it forward") reciprocity.
- O'Connor, B. P. & Rosenblood, L. K. (1996). *Affiliation motivation in everyday experience: A theoretical comparison.* Journal of Personality and Social Psychology, 70(3), 513-522: real regulation of social-contact FREQUENCY toward an individual set point, distinct from connection quality.
- Cheng, J. T., Tracy, J. L. & Henrich, J. (2010). *Pride, personality, and the evolutionary foundations of human social status.* Evolution and Human Behavior, 31(5), 334-347: real dominance-display behavior as a function of rank gap, audience, and risk, not a constant broadcast.
- Bowlby, J. (1969). *Attachment and Loss, Vol. 1: Attachment.* Basic Books.
- Mikulincer, M. & Shaver, P. R. (2005). *Attachment security, compassion, and altruism.* Current Directions in Psychological Science, 14(1), 34-38: real caregiving triggered by a genuine vulnerability cue in a bonded other, gated by the caregiver's own overwhelm.
- Stroebe, M. & Schut, H. (1999). *The dual process model of coping with bereavement: Rationale and description.* Death Studies, 23(3), 197-224: real oscillation between loss-oriented processing and forward-looking reorganization after grief.
- Smith, R. H. & Kim, S. H. (2007). *Comprehending envy.* Psychological Bulletin, 133(1), 46-64: real schadenfreude as a distinct correlate of rivalry, separate from envy itself.
- Keltner, D. & Haidt, J. (2003). *Approaching awe, a moral, spiritual, and aesthetic emotion.* Cognition and Emotion, 17(2), 297-314: the real two-component definition of awe (vastness plus a genuine need for accommodation).
- Piff, P. K. et al. (2015). *Awe, the small self, and prosocial behavior.* Journal of Personality and Social Psychology, 108(6), 883-899.
- Haidt, J. (2003). *Elevation and the positive psychology of morality.* In Keyes, C. L. M. & Haidt, J. (eds.), Flourishing: Positive Psychology and the Life Well-Lived, American Psychological Association: the actual coinage of moral elevation, distinct from gratitude.
- Cialdini, R. B., Reno, R. R. & Kallgren, C. A. (1990). *A focus theory of normative conduct: Recycling the concept of norms to reduce littering in public places.* Journal of Personality and Social Psychology, 58(6), 1015-1026.
- Higgins, E. T. (1987). *Self-discrepancy: A theory relating self and affect.* Psychological Review, 94(3), 319-340: real ought-self discrepancy producing anticipatory guilt/anxiety.
- Johnson, M. K., Hashtroudi, S. & Lindsay, D. S. (1993). *Source monitoring.* Psychological Bulletin, 114(1), 3-28: real discrimination of whether a memory came from lived experience, being told, or imagination.
- Einstein, G. O. & McDaniel, M. A. (1990). *Normal aging and prospective memory.* Journal of Experimental Psychology: Learning, Memory, and Cognition, 16(4), 717-726.
- McDaniel, M. A. & Einstein, G. O. (2000). *Strategic and automatic processes in prospective memory retrieval: A multiprocess framework.* Applied Cognitive Psychology, 14(7), S127-S144: real retrieval probability for a future intention as a function of importance, cue overlap, and delay.
- Garfinkel, S. N., Seth, A. K., Barrett, A. B., Suzuki, K. & Critchley, H. D. (2015). *Knowing your own heart: Distinguishing interoceptive accuracy from interoceptive awareness.* Biological Psychology, 104, 65-74: real interoceptive accuracy as distinct from the raw internal signal.
- Lane, R. D. et al. (1997). *Is alexithymia the emotional equivalent of blindsight?* Biological Psychiatry, 42(9), 834-844.
- Meichenbaum, D. (1985). *Stress Inoculation Training.* Pergamon Press: real, genuinely mastered moderate stress lowering future reactivity, distinct from sensitization's opposite direction.
- Festinger, L. (1954). *A theory of social comparison processes.* Human Relations, 7(2), 117-140: the foundational finding that people evaluate their own state relative to a reference group, not an absolute scale.
- Clark, A. E. & Oswald, A. J. (1996). *Satisfaction and comparison income.* Journal of Public Economics, 61(3), 359-381: real empirical confirmation that relative standing predicts satisfaction better than absolute level.

## Discounting, inhibition, ostracism, and meaning

- Mazur, J. E. (1987). *An adjusting procedure for studying delayed reinforcement.* In Commons, Mazur, Nevin & Rachlin (eds.), Quantitative Analyses of Behavior, Vol. 5, Erlbaum: real hyperbolic delay discounting.
- Kirby, K. N. (2009). *One-year temporal stability of delay-discount rates.* Psychonomic Bulletin & Review.
- Barkley, R. A. (1997). *Behavioral inhibition, sustained attention, and executive functions: Constructing a unifying theory of ADHD.* Psychological Bulletin, 121(1), 65-94: real behavioral inhibition as a distinct executive-function capacity.
- Hofmann, W., Friese, M., & Strack, F. (2009). *Impulse and self-control from a dual-systems perspective.* Perspectives on Psychological Science, 4(2), 162-176.
- Williams, K. D. (2007). *Ostracism.* Annual Review of Psychology, 58, 425-452: the real, well-established social-exclusion pain finding.
- Eisenberger, N. I. (2012). *The pain of social disconnection: examining the shared neural underpinnings of physical and social pain.* Nature Reviews Neuroscience, 13(6), 421-434.
- Fleming, S. M. & Lau, H. C. (2014). *How to measure metacognition.* Frontiers in Human Neuroscience, 8, 443: judgment-certainty as its own real, measurable readout, distinct from affective self-clarity.
- Yeung, N. & Summerfield, C. (2012). *Metacognition in human decision-making: confidence and error monitoring.* Philosophical Transactions of the Royal Society B, 367, 1310-1321.
- Stryker, S. (1980). *Symbolic Interactionism: A Structural Version.* Benjamin/Cummings: real multi-role identity salience.
- Stryker, S. & Burke, P. J. (2000). *The past, present, and future of an identity theory.* Social Psychology Quarterly, 63(4), 284-297.
- Park, C. L. (2010). *Making sense of the meaning literature: An integrative review of meaning making and its effects on adjustment to stressful life events.* Psychological Bulletin, 136(2), 257-301: the real meaning-making-after-adversity process.
- Janoff-Bulman, R. (1992). *Shattered Assumptions: Towards a New Psychology of Trauma.* Free Press.
- Schacter, D. L. & Addis, D. R. (2007). *The cognitive neuroscience of constructive memory: remembering the past and imagining the future.* Philosophical Transactions of the Royal Society B, 362(1481), 773-786: real episodic future thinking.
- McGrath, A. (2017). *Dealing with dissonance: A review of cognitive dissonance reduction.* Social and Personality Psychology Compass, 11(12): the modern reduction-strategy taxonomy (rationalize/change belief/trivialize), added to the existing detection-only dissonance mechanic.

## Dual-process control, prediction, and global drives

- Kahneman, D. (2011). *Thinking, Fast and Slow.* Farrar, Straus and Giroux: the popular synthesis of dual-process theory a real fast/slow arbitration mechanism follows.
- Evans, J. St. B. T. & Stanovich, K. E. (2013). *Dual-process theories of higher cognition: Advances and current controversies.* Perspectives on Psychological Science, 8(3), 223-241: the rigorous academic framing.
- Friston, K. (2010). *The free-energy principle: a unified brain theory?* Nature Reviews Neuroscience, 11(2), 127-138: the general predictive-processing framing a domain-agnostic expectation-tracking mechanism implements.
- Deci, E. L. & Ryan, R. M. (2000). *The "what" and "why" of goal pursuits: Human needs and the self-determination of behavior.* Psychological Inquiry, 11(4), 227-268.
- Ryan, R. M. & Deci, E. L. (2000). *Self-determination theory and the facilitation of intrinsic motivation, social development, and well-being.* American Psychologist, 55(1), 68-78: the real Autonomy/Competence/Relatedness need triad.
- Damasio, A. R. (1999). *The Feeling of What Happens: Body and Emotion in the Making of Consciousness.* Harcourt: the real homeostatic-feeling account a legible feelings-translation layer follows.
- Craig, A. D. (2002). *How do you feel? Interoception: the sense of the physiological condition of the body.* Nature Reviews Neuroscience, 3(8), 655-666.
- Baddeley, A. D. & Hitch, G. (1974). *Working memory.* Psychology of Learning and Motivation, 8, 47-89.
- Cowan, N. (2001). *The magical number 4 in short-term memory: A reconsideration of mental storage capacity.* Behavioral and Brain Sciences, 24(1), 87-114: the real ~4-item capacity a working-memory buffer defaults to.
- Dolan, R. J. & Dayan, P. (2013). *Goals and habits in the brain.* Neuron, 80(2), 312-325.
- Wood, W. & Rünger, D. (2016). *Psychology of habit.* Annual Review of Psychology, 67, 289-314: the real habit-vs-goal-directed control arbitration.
- Kruglanski, A. W., Shah, J. Y., Fishbach, A., Friedman, R., Chun, W. Y., & Sleeth-Keppler, D. (2002). *A theory of goal systems.* Advances in Experimental Social Psychology, 34, 331-378: the real competing-goals mutual-inhibition framing.
- Eastwood, J. D., Frischen, A., Fenske, M. J., & Smilek, D. (2012). *The unengaged mind: Defining boredom in terms of attention.* Perspectives on Psychological Science, 7(5), 482-495: real chronic-understimulation as its own aversive state.
- Seligman, M. E. P. (1972). *Learned helplessness.* Annual Review of Medicine, 23(1), 407-412.
- Maier, S. F. & Seligman, M. E. P. (1976). *Learned helplessness: Theory and evidence.* Journal of Experimental Psychology: General, 105(1), 3-46: the real global-control-belief erosion under repeated uncontrollable failure.
- Lazarus, R. S. & Folkman, S. (1984). *Stress, Appraisal, and Coping.* Springer: the actual coinage of the problem-focused/emotion-focused coping distinction.

## Consciousness, primary drives, and affective numbing

- Baars, B. J. (1988). *A Cognitive Theory of Consciousness.* Cambridge University Press: Global Workspace Theory, the real premise that access to conscious processing is a competition among candidate contents, not a fixed pipeline stage.
- Baars, B. J. (2005). *Global workspace theory of consciousness: toward a cognitive neuroscience of human experience.* Progress in Brain Research.
- Dehaene, S. & Naccache, L. (2001). *Towards a cognitive neuroscience of consciousness: basic evidence and a workspace framework.* Cognition: the "ignition"/broadcast dynamic a real, explicitly-scoped-down softmax competition is an engineering analog of, not a claim of modeling consciousness itself.
- Panksepp, J. (1998). *Affective Neuroscience: The Foundations of Human and Animal Emotions.* Oxford University Press: the cross-species primary-process emotional systems (SEEKING, CARE, PLAY, PANIC/GRIEF), four of which are modeled.
- Panksepp, J. & Biven, L. (2012). *The Archaeology of Mind: Neuroevolutionary Origins of Human Emotions.* W. W. Norton: elaboration and clinical grounding of the same seven systems, four of which are modeled here.
- Gilbert, P. (1989). *Human Nature and Suffering.* Lawrence Erlbaum: the real defensive-numbing/dissociation response to sustained, unresolved negative affect that a sustained-exposure dampening mechanism is a real, bounded engineering analog of.
- Gilbert, P. (2009). *The Compassionate Mind.* Constable: later elaboration of the same self-protective threat/soothing system dynamics.

## Identity, social cognition, and self-regulation

- McAdams, D. P. (2001). *The psychology of life stories.* Review of General Psychology: narrative identity, the self as an evolving story.
- McAdams, D. P. & McLean, K. C. (2013). *Narrative identity.* Current Directions in Psychological Science.
- Piaget, J. (1952). *The Origins of Intelligence in Children.* International Universities Press: qualitative, experience-driven developmental stages.
- Vygotsky, L. S. (1978). *Mind in Society.* Harvard University Press.
- Freyd, J. J. (1996). *Betrayal Trauma: The Logic of Forgetting Childhood Abuse.* Harvard University Press: the actual coinage of "betrayal trauma," wounds specifically from a trusted source.
- Wasserman, S. & Faust, K. (1994). *Social Network Analysis: Methods and Applications.* Cambridge University Press: edge weight/coalition vocabulary.
- Nisbett, R. E. & Cohen, D. (1996). *Culture of Honor: The Psychology of Violence in the South.* Westview Press.
- Markus, H. R. & Kitayama, S. (1991). *Culture and the self: Implications for cognition, emotion, and motivation.* Psychological Review: independent/interdependent self-construal underlying collectivism scripts.
- Gouldner, A. W. (1960). *The norm of reciprocity: A preliminary statement.* American Sociological Review.
- Freud, S.; Vaillant, G. E. (1977), already cited above, extended this round with a real, effortful redemption-arc mechanic on top of permanent moral scarring.
- Steele, C. M. (1988), already cited above, extended this round with a real repair-cost mechanic on top of identity-threat detection.
- White, G. L. & Mullen, P. E. (1989), already cited above, extended this round with a real kindling mechanic on rival-specific jealousy readings.
- Schwartz, S. H. (1992), already cited above, extended this round with a real long-run value-drift mechanic distinct from the existing per-conflict nudge.
- Kahneman, D. (1973). *Attention and Effort.* Prentice-Hall: general limited-capacity attention/effort framing, distinct from the already-caveated ego-depletion metaphor used elsewhere.
- Barsade, S. G. (2002). *The ripple effect: Emotional contagion and its influence on group behavior.* Administrative Science Quarterly: real GROUP-level (not just dyadic) emotional contagion.
- Damasio, A. R. (1994). *Descartes' Error: Emotion, Reason, and the Human Brain.* G. P. Putnam's Sons: the somatic-marker hypothesis.
- Gross, J. J. (1998). *The emerging field of emotion regulation: An integrative review.* Review of General Psychology: the reappraisal/suppression/distraction strategy taxonomy.
- Gross, J. J. & John, O. P. (2003). *Individual differences in two emotion regulation processes.* Journal of Personality and Social Psychology.
- Gottman, J. M., Katz, L. F. & Hooven, C. (1996). *Parental meta-emotion philosophy and the emotional life of families.* Journal of Family Psychology: the actual coinage of "meta-emotion."
- Mayer, J. D. & Salovey, P. (1997). *What is emotional intelligence?* In Salovey & Sluyter (eds.), Emotional Development and Emotional Intelligence, Basic Books.
- Guilford, J. P. (1967). *The Nature of Human Intelligence.* McGraw-Hill: divergent vs. convergent thinking.
- Fredrickson, B. L. (2001). *The role of positive emotions in positive psychology: The broaden-and-build theory of positive emotions.* American Psychologist.

## Relational friction, grief, and moral psychology

- Bonanno, G. A. (2004). *Loss, trauma, and human resilience: have we underestimated the human capacity to thrive after extremely aversive events?* American Psychologist: grief's real, highly variable, non-stage-based trajectory.
- Zisook, S. & Shear, K. (2009). *Grief and bereavement: what psychiatrists need to know.* World Psychiatry: grief's protracted, fluctuating course.
- Tangney, J. P. & Dearing, R. L. (2002). *Shame and Guilt.* Guilford Press: the shame (global/self) vs. guilt (specific/behavior) distinction.
- White, G. L. & Mullen, P. E. (1989). *Jealousy: Theory, Research, and Clinical Strategies.* Guilford Press: the self/other/rival triadic structure.
- Miller, N. E. (1944). *Experimental studies of conflict.* In Hunt, J. McV. (ed.), Personality and the Behavior Disorders, Ronald Press: approach-avoidance gradient conflict.
- Kiesler, C. A. (1971). *The Psychology of Commitment.* Academic Press: escalating commitment with prior investment.
- Baumeister, R. F., Bratslavsky, E., Muraven, M. & Tice, D. M. (1998). *Ego depletion: Is the active self a limited resource?* Journal of Personality and Social Psychology: the self-regulation resource metaphor, with an explicit caveat (see below).
- Hagger, M. S. et al. (2016). *A multilab preregistered replication of the ego-depletion effect.* Perspectives on Psychological Science: the specific mechanism largely failed to replicate; only the qualitative resource-budget engineering pattern is used here, not a claim of settled neuroscience.
- Seth, A. K. (2013). *Interoceptive inference, emotion, and the embodied self.* Trends in Cognitive Sciences: predictive-processing account of interoception.
- Borbély, A. A. (1982). *A two process model of sleep regulation.* Human Neurobiology: Process S homeostatic sleep pressure.
- Eisenberger, N. I., Lieberman, M. D. & Williams, K. D. (2003). *Does rejection hurt? An fMRI study of social exclusion.* Science: social and physical pain pathway overlap.
- Litz, B. T., Stein, N., Delaney, E., Lebowitz, L., Nash, W. P., Silva, C. & Maguen, S. (2009). *Moral injury and moral repair in war veterans: A preliminary model and intervention strategy.* Clinical Psychology Review: moral injury as distinct from ordinary guilt.
- Steele, C. M. (1988). *The psychology of self-affirmation: Sustaining the integrity of the self.* Advances in Experimental Social Psychology: identity-level threat, distinct from generic negative feedback.
- Schwartz, S. H. (1992). *Universals in the content and structure of values: theoretical advances and empirical tests in 20 countries.* Advances in Experimental Social Psychology: the basic human values used in a real value-conflict mechanic.
- Solomon, R. L. & Corbit, J. D. (1974). *An opponent-process theory of motivation: I. Temporal dynamics of affect.* Psychological Review: the a-process/b-process opponent dynamic.
- Coan, J. A. & Sbarra, D. A. (2015). *Social Baseline Theory: The social regulation of risk and effort.* Current Opinion in Psychology: secure attachment lowering real regulatory cost.
- Mikulincer, M. & Shaver, P. R. (2016). *Attachment in Adulthood: Structure, Dynamics, and Change* (2nd ed.), Guilford Press: state-dependent attachment-system activation under threat.
- Wilson, T. D. & Gilbert, D. T. (2003). *Affective forecasting.* Advances in Experimental Social Psychology.
- Walker, W. R., Skowronski, J. J. & Thompson, C. P. (2003). *Life is pleasant, and memory helps to keep it that way!* Review of General Psychology: the fading affect bias behind nostalgic reconsolidation.
- Stetson, C., Fiesta, M. P. & Eagleman, D. M. (2007). *Does time really slow down during a frightening event?* PLoS ONE.
- Zakay, D. & Block, R. A. (1997). *Temporal cognition.* Current Directions in Psychological Science: attention-to-time models of duration judgment.

## Machine learning and NLP

- Hochreiter, S. & Schmidhuber, J. (1997). *Long Short-Term Memory.* Neural Computation.
- Bayesian conjugate inference (Beta-Bernoulli): standard Bayesian statistics.
- Vector-space cosine similarity: standard information-retrieval/NLP technique (Salton, G. et al.).
- Demszky, D. et al. (2020). *GoEmotions: A Dataset of Fine-Grained Emotions.* Google Research.
- An in-browser/Node ONNX inference runtime, used for the optional real-model language provider.

## What hasn't been empirically validated

In the interest of the same honesty this list is meant to serve: no part of this project has been validated against professional psychological judgment, regressed against labeled real-world conversational data, or tested with real users for whether the *integrated, end-to-end* behavior reads as coherent. Citation of a theory or technique above establishes conceptual or mathematical grounding; it is not a claim of clinical or empirical validation of the system as a whole.
