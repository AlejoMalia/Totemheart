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
