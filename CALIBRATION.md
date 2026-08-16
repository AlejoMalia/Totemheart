# Sourcing

Totemheart's design draws on published research and established mathematical/engineering technique across several fields. This page lists what that grounding actually is — real theories, models, and papers, by theme — without walking through how any specific mechanism is built from them. That's deliberate: the *what it's grounded in* is worth being transparent about; the *how it's implemented* is the project's own engineering and isn't described here.

Not every citation below corresponds to a literal, numerically-faithful reproduction of the cited work. Some are used as-is; many are used for their general shape or concept, with specific constants and thresholds set as engineering estimates rather than reproductions of a published parameter. No claim of exact numerical fidelity should be read into inclusion on this list.

## Affect and emotion theory

- Russell, J. A. (1980). *A circumplex model of affect.* Journal of Personality and Social Psychology.
- Mehrabian, A. (1996). *Pleasure-arousal-dominance: A general framework for describing and measuring individual differences in temperament.* Current Psychology.
- Ekman, P. & Friesen, W. V. (1978). *Facial Action Coding System.*
- Ekman, P. — work on the refractory period of emotion and mood-congruent information filtering.
- Frijda, N. H. (1986). *The Emotions* — appraisal theory.
- Scherer, K. R. — component process model of appraisal.

## Personality and individual differences

- Costa, P. T. & McCrae, R. R. (1992). *Revised NEO Personality Inventory* — the Five-Factor / OCEAN model.

## Decision-making and behavioral economics

- Kahneman, D. & Tversky, A. (1979). *Prospect Theory: An Analysis of Decision under Risk.* Econometrica.
- Tversky, A. & Kahneman, D. (1992). *Advances in Prospect Theory: Cumulative Representation of Uncertainty.*
- Fehr, E. & Schmidt, K. M. (1999). *A Theory of Fairness, Competition, and Cooperation.* Quarterly Journal of Economics.

## Neuroscience and neurochemistry

- Schultz, W., Dayan, P. & Montague, P. R. (1997). *A Neural Substrate of Prediction and Reward.* Science — dopaminergic reward-prediction-error.
- Berridge, K. C. & Robinson, T. E. (1998). *What is the role of dopamine in reward: hedonic impact, reward learning, or incentive salience?* Brain Research Reviews — the wanting/liking dissociation.
- Selye, H. — general adaptation syndrome / stress response (cortisol).
- McEwen, B. S. & Stellar, E. (1993). *Stress and the individual: mechanisms leading to disease.* Archives of Internal Medicine — allostatic load.
- McEwen, B. S. (1998). *Protective and damaging effects of stress mediators.* New England Journal of Medicine.
- Miller, G. E., Chen, E. & Zhou, E. S. (2007). *If it goes up, must it come down? Chronic stress and the hypothalamic-pituitary-adrenal axis in humans.* Psychological Bulletin — flattened diurnal cortisol slope under chronic stress.
- Goddard, G. V. (1967). *Development of epileptic seizures through brain stimulation at low intensity.* Nature — kindling (used here as a metaphorical borrowing of the qualitative shape, not a claim of literal synaptic kindling).
- Diekelmann, S. & Born, J. (2010). *The memory function of sleep.* Nature Reviews Neuroscience.
- McClelland, J. L., McNaughton, B. L. & O'Reilly, R. C. (1995). *Why there are complementary learning systems in the hippocampus and neocortex.* Psychological Review.

## Memory and learning

- Ebbinghaus, H. (1885). *Über das Gedächtnis* — the forgetting curve.
- Zeigarnik, B. (1927). *Über das Behalten von erledigten und unerledigten Handlungen.*
- Hebb, D. O. (1949). *The Organization of Behavior* — Hebbian learning.
- Squire, L. R. & Alvarez, P. (1995). *Retrograde amnesia and memory consolidation.*
- Nader, K., Schafe, G. E. & LeDoux, J. E. (2000). *Fear memories require protein synthesis in the amygdala for reconsolidation after retrieval.* Nature — memory reconsolidation.
- Sutton, R. S. & Barto, A. G. (2018). *Reinforcement Learning: An Introduction* (2nd ed.), MIT Press — TD(λ) and eligibility traces.

## Social psychology

- Premack, D. & Woodruff, G. (1978). *Does the chimpanzee have a theory of mind?* Behavioral and Brain Sciences.
- Tajfel, H. & Turner, J. C. — social identity theory / in-group–out-group dynamics.
- Holmes, T. H. & Rahe, R. H. (1967). *The Social Readjustment Rating Scale.* Journal of Psychosomatic Research.
- Festinger, L. (1957). *A Theory of Cognitive Dissonance.*
- Latané, B. & Darley, J. M. — the bystander effect.
- Freud, S. — defense mechanisms, later formalized by A. Freud and by Vaillant, G. E. (1977), *Adaptation to Life*, Little, Brown — the mature/neurotic/immature hierarchy.
- Bartholomew, K. & Horowitz, L. M. (1991). *Attachment styles among young adults: a test of a four-category model.* Journal of Personality and Social Psychology — secure/anxious/avoidant/fearful.
- Gottman, J. M. & Levenson, R. W. (1992) and the broader couples rupture-and-repair literature.

## Signal processing and control theory

- Kalman, R. E. (1960). *A New Approach to Linear Filtering and Prediction Problems.*
- Classical PID control theory (Ziegler–Nichols and successors) — proportional-integral-derivative control and anti-windup technique.
- Kullback, S. & Leibler, R. A. (1951). *On Information and Sufficiency* — KL divergence.
- Shannon, C. E. (1948). *A Mathematical Theory of Communication* — information entropy.
- Kuramoto, Y. (1975). *Self-entrainment of a population of coupled non-linear oscillators.*
- Mamdani, E. H. & Assilian, S. (1975). *An experiment in linguistic synthesis with a fuzzy logic controller* — fuzzy inference.

## Machine learning and NLP

- Hochreiter, S. & Schmidhuber, J. (1997). *Long Short-Term Memory.* Neural Computation.
- Bayesian conjugate inference (Beta-Bernoulli) — standard Bayesian statistics.
- Vector-space cosine similarity — standard information-retrieval/NLP technique (Salton, G. et al.).
- Demszky, D. et al. (2020). *GoEmotions: A Dataset of Fine-Grained Emotions.* Google Research.
- Xenova/Transformers.js — in-browser/Node ONNX inference runtime used for the optional real-model language provider.

## What hasn't been empirically validated

In the interest of the same honesty this list is meant to serve: no part of this project has been validated against professional psychological judgment, regressed against labeled real-world conversational data, or tested with real users for whether the *integrated, end-to-end* behavior reads as coherent. Citation of a theory or technique above establishes conceptual or mathematical grounding — it is not a claim of clinical or empirical validation of the system as a whole.
