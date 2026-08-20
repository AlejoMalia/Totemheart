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

## A grief-type catalog beyond relational rupture, and conservation-withdrawal (added in 1.6.0, round 19)

- Shear, M. K. & Shair, H. (2005). *Attachment, loss, and complicated grief.* Developmental Psychobiology, 47(3), 253-267: real bereavement for a third party, distinct from `GriefEngine.triggerLoss()`'s own relational-rupture-with-the-conversational-partner scope.
- Boss, P. (1999). *Ambiguous Loss: Learning to Live with Unresolved Grief.* Harvard University Press: a real loss with no clean boundary or confirming event never reaches ordinary closure — modeled as a real permanent floor instead of decay-to-zero.
- Doka, K. J. (1989). *Disenfranchised Grief: Recognizing Hidden Sorrow.* Lexington Books: a real loss lacking social validation genuinely takes longer to fade.
- Engel, G. L. & Schmale, A. H. (1972). *Conservation-withdrawal: a primary regulatory process for organismic homeostasis.* Ciba Foundation Symposium 8: real, biologically-grounded, overwhelm-driven passive shutdown and solitude-pull, distinct from `EmotionalImmuneSystem`'s numbing of new input and from `BoredomSystem`'s own understimulation response.

## Dreams and the subconscious (added in 1.6.0, round 18)

- Domhoff, G. W. (2003). *The Scientific Study of Dreams: Neural Networks, Cognitive Development, and Content Analysis.* American Psychological Association: the continuity hypothesis — dream content is real, measurably continuous with waking concerns.
- Hobson, J. A. & McCarley, R. W. (1977). *The brain as a dream-state generator: An activation-synthesis hypothesis of the dream process.* American Journal of Psychiatry, 134(12), 1335-1348.
- Kihlstrom, J. F. (1987). *The cognitive unconscious.* Science, 237(4821), 1445-1452: the real framework distinguishing genuine nonconscious cognitive processing from the Freudian dynamic unconscious already cited elsewhere.
- Dehaene, S. & Naccache, L. (2001), already cited above for `GlobalWorkspace.js`: extended with the real observation that a losing coalition leaves a measurable subliminal trace, not nothing.
- Zajonc, R. B. (1968). *Attitudinal effects of mere exposure.* Journal of Personality and Social Psychology, 9(2, Pt.2), 1-27.
- Wegner, D. M. (1994). *Ironic processes of mental control.* Psychological Review, 101(1), 34-52.

## Six mechanisms found by auditing this document's own existing citations (added in 1.6.0, round 17)

- Panksepp, J. (1998) and Panksepp & Biven (2012), already cited above: RAGE, FEAR, and LUST were the 3 remaining primary-process systems this document had itself left explicitly disclosed as unmodeled ("four of which are modeled") — now extended into `PrimaryDrives.js`, no new citation needed.
- Cheng, J. T., Tracy, J. L. & Henrich, J. (2010). *Pride, personality, and the evolutionary foundations of human social status.* Evolution and Human Behavior, 31(5), 334-347: real prestige as the second, genuinely distinct pathway to status alongside dominance.
- Tversky, A. & Kahneman, D. (1981). *The framing of decisions and the psychology of choice.* Science, 211(4481), 453-458: real, classic framing effects, distinct from loss aversion's own value-function curve.
- Higgins, E. T. (1987), already cited above: the real ideal-self discrepancy, the dejection-family counterpart to the already-modeled ought-self agitation-family gap.
- Rusbult, C. E. (1980). *Commitment and satisfaction in romantic associations: A test of the investment model.* Journal of Experimental Social Psychology, 16(2), 172-186: the real Comparison Level for Alternatives term, extending Kelley & Thibaut's interdependence theory already cited above.
- Cialdini, R. B., Borden, R. J., Thorne, A., Walker, M. R., Freeman, S. & Sloan, L. R. (1976). *Basking in reflected glory: Three (football) field studies.* Journal of Personality and Social Psychology, 34(3), 366-375: real BIRGing/CORFing, building on the in-group/out-group machinery already cited from Tajfel & Turner.

## Five indispensable human mechanisms: amusement, moral disgust, embarrassment, mortality salience, relief (added in 1.6.0, round 16)

- Suls, J. M. (1972). *A two-stage model for the appreciation of jokes and cartoons.* In Goldstein & McGhee (eds.), The Psychology of Humor: real incongruity-resolution account of amusement.
- McGraw, A. P. & Warren, C. (2010). *Benign violations: Making immoral behavior funny.* Psychological Science, 21(8), 1141-1149: real benign-violation theory.
- Rozin, P., Haidt, J. & McCauley, C. R. (1999). *Disgust: The body and soul emotion.* In Dalgleish & Power (eds.), Handbook of Cognition and Emotion.
- Haidt, J. (2003): the real CAD triad hypothesis (Contempt-Anger-Disgust mapped to Community-Autonomy-Divinity violations).
- Miller, R. S. (1996). *Embarrassment: Poise and Peril in Everyday Life.* Guilford Press.
- Keltner, D. & Buswell, B. N. (1997). *Embarrassment: Its distinct form and appeasement functions.* Psychological Bulletin, 122(3), 250-270.
- Greenberg, J., Pyszczynski, T. & Solomon, S. (1986). *The causes and consequences of a need for self-esteem: A terror management theory.* In Baumeister (ed.), Public Self and Private Self, Springer-Verlag.
- Frijda, N. H. (1986), already cited above: relief's real relational theme ("distress abating").

## Content-level moral ambiguity in discourse shaping (added in 1.6.0, round 15)

- No new citation: this extends `HumanDiscourseShaper`'s existing real formula with a second real input (`AppraisalAgreement`'s already-cited, uncited plain-statistic disagreement measure — see the Signal processing entries above), it doesn't introduce new theory. The distinction it encodes — the AI's own felt inconsistency (`CognitiveDissonance.getStress()`) versus real disagreement across independent readings of the SITUATION being discussed — is own engineering.

## Post-conflict recovery, self-presentation, and relational risk-taking (added in 1.6.0, round 9)

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

## Discourse shape, micro-slips, and attentional introspection (added in 1.6.0, round 4)

- Gómez-Rodríguez, C. & Williams, P. (2023). *A confederacy of models: a comprehensive evaluation of LLMs on creative writing.* Findings of EMNLP 2023: real, empirical evidence that LLM-generated narrative clusters in a narrow region of discourse-structure space relative to human writing.
- Goffman, E. (1956). *Embarrassment and social organization.* American Journal of Sociology, 62(3), 264-271: real social slips/false-starts as genuine byproducts of high arousal and self-consciousness.
- Fraundorf, S. H. & Watson, D. G. (2011). *The disfluent discourse: Effects of filled pauses on recall.* Journal of Memory and Language, 65(2), 161-175: real evidence that disfluency correlates with genuine real-time processing load.
- Simon, H. A. (1971). *Designing organizations for an information-rich world.* In Greenberger, M. (ed.), Computers, Communication, and the Public Interest, Johns Hopkins Press: the real, foundational observation that attention, not information, is the scarce resource.

## Grievance, vicarious discomfort, empathy, and courtship signaling (added in 1.6.0, round 3)

- Axelrod, R. (1984). *The Evolution of Cooperation.* Basic Books: real, conditional retaliation as a genuine game-theoretic strategy, not blind aggression.
- McCullough, M. E., Kurzban, R. & Tabak, B. A. (2013). *Cognitive systems for revenge and forgiveness.* Behavioral and Brain Sciences, 36(1), 1-15: the real, well-established finding that revenge and forgiveness are two outputs of the same cost-benefit deterrence system.
- Krach, S., Cohrs, J. C., de Echeverría Loebell, N. C., Kircher, T., Sommer, J., Jansen, A. & Paulus, F. M. (2011). *Your flaws are my pain: linking empathy to vicarious embarrassment.* PLoS ONE, 6(4), e18675: real empathic distress from witnessing another's public status loss.
- Batson, C. D. (2011). *Altruism in Humans.* Oxford University Press: the empathy-altruism hypothesis, empathy as a real, distinct precursor to actually acting to relieve another's state.
- Singer, T. & Klimecki, O. M. (2014). *Empathy and compassion.* Current Biology, 24(18), R875-R878: real neuroscientific evidence empathy and compassion are two separate systems.
- Grammer, K., Kruck, K., Juette, A. & Fink, B. (2000). *Non-verbal behavior as courtship signals: the role of control and choice in selecting partners.* Evolution and Human Behavior, 21(6), 371-390: courtship as a real, low-cost signaling game.

## Somatic activation, global mood, and retrieval blocks (added in 1.6.0, round 2)

- Mendes, W. B., Blascovich, J., Hunter, S. B., Lickel, B. & Jost, J. T. (2007). *Threatened by the unexpected: physiological responses during social interactions with expectancy-violating group members.* Journal of Personality and Social Psychology, 92(4), 698-716: real sympathetic activation from the genuine combination of high stakes and low predictability, "butterflies."
- Critchley, H. D. & Garfinkel, S. N. (2017). *Interoception and emotion.* Current Opinion in Psychology, 17, 7-14.
- Frijda, N. H. (1993). *Moods, emotion episodes, and emotions.* In Lewis, M. & Haviland, J. M. (eds.), Handbook of Emotions, Guilford Press: the real, well-established distinction between a diffuse, prolonged, non-object-directed mood and a discrete emotion.
- Freedman, G., Powell, D. N., Le, B. & Williams, K. D. (2019). *Ghosting and destiny: Implicit theories of relationships predict beliefs about ghosting.* Journal of Social and Personal Relationships, 36(3), 905-924: the real, distinct psychological profile of ghosting.
- Brown, R. & McNeill, D. (1966). *The "tip of the tongue" phenomenon.* Journal of Verbal Learning and Verbal Behavior, 5(4), 325-337: the actual coinage and the real finding that a concept can be accessible while its specific lexical form is blocked.
- Brown, A. S. (1991). *A review of the tip-of-the-tongue experience.* Psychological Bulletin, 109(2), 204-223: the real graded nature of partial recall.

## Interest identity and structured relational memory (added in 1.6.0)

- Silvia, P. J. (2006). *Exploring the Psychology of Interest.* Oxford University Press: interest as a real, distinct emotion with its own novelty/complexity appraisal.
- Renninger, K. A. & Hidi, S. (2011). *Revisiting the conceptualization, measurement, and generation of interest.* Educational Psychologist, 46(3), 168-184: the real phase model of interest development a geek-intensity field's levels follow the shape of.
- Petty, R. E. & Cacioppo, J. T. (1986). *The Elaboration Likelihood Model of Persuasion.* Advances in Experimental Social Psychology.
- Aron, A., Aron, E. N. & Smollan, D. (1992). *Inclusion of Other in the Self Scale.* Journal of Personality and Social Psychology: the general self-expansion/fusion pattern an identity-fusion mechanic borrows the shape of, applied to an interest rather than a relationship.
- Bower, G. H. (1981). *Mood and memory.* American Psychologist, 36(2), 129-148: affect-weighted memory retention.
- Conway, M. A. & Pleydell-Pearce, C. W. (2000). *The construction of autobiographical memories in the self-memory system.* Psychological Review, 107(2), 261-288: the real hierarchical organization of autobiographical memory (lifetime periods, general events, specific episodic details) a structured relational-memory catalog's milestone/theme/detail three-tier structure follows the shape of.

## Schemas, reciprocity, awe, and social comparison (added in 0.1.8)

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

## Discounting, inhibition, ostracism, and meaning (added in 0.1.7)

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

## Dual-process control, prediction, and global drives (added in 0.1.6)

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

## Consciousness, primary drives, and affective numbing (added in 0.1.5)

- Baars, B. J. (1988). *A Cognitive Theory of Consciousness.* Cambridge University Press: Global Workspace Theory, the real premise that access to conscious processing is a competition among candidate contents, not a fixed pipeline stage.
- Baars, B. J. (2005). *Global workspace theory of consciousness: toward a cognitive neuroscience of human experience.* Progress in Brain Research.
- Dehaene, S. & Naccache, L. (2001). *Towards a cognitive neuroscience of consciousness: basic evidence and a workspace framework.* Cognition: the "ignition"/broadcast dynamic a real, explicitly-scoped-down softmax competition is an engineering analog of, not a claim of modeling consciousness itself.
- Panksepp, J. (1998). *Affective Neuroscience: The Foundations of Human and Animal Emotions.* Oxford University Press: the cross-species primary-process emotional systems (SEEKING, CARE, PLAY, PANIC/GRIEF), four of which are modeled.
- Panksepp, J. & Biven, L. (2012). *The Archaeology of Mind: Neuroevolutionary Origins of Human Emotions.* W. W. Norton: elaboration and clinical grounding of the same seven systems, four of which are modeled here.
- Gilbert, P. (1989). *Human Nature and Suffering.* Lawrence Erlbaum: the real defensive-numbing/dissociation response to sustained, unresolved negative affect that a sustained-exposure dampening mechanism is a real, bounded engineering analog of.
- Gilbert, P. (2009). *The Compassionate Mind.* Constable: later elaboration of the same self-protective threat/soothing system dynamics.

## Identity, social cognition, and self-regulation (added in 0.1.5)

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

## Relational friction, grief, and moral psychology (added in 0.1.3)

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
