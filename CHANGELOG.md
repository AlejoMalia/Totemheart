# Totemheart

## 0.1.2

### Patch Changes

- Fixed a real bug: `ForgettingCurve` was pruning `unresolved` (but non-`permanent`) memories, contradicting its own documented contract that an unresolved wound persists until explicitly healed. Affected any unresolved wound below the permanence threshold, including `LoveHateEngine` rupture wounds.
- Grew the automated test suite from 205 to 2274 real, deterministic tests (no RNG), reorganized into `test/regression/`, `test/integration/`, and `test/property/`. Added full-pipeline threshold-crossing checks (real consecutive turns, not isolated module calls), an exhaustive field-by-field `toJSON()`/`restoreState()` round-trip, combined-extreme OCEAN personality corners, `WornPathCache` eviction-boundary checks, malformed/hostile-input robustness, and long-horizon saturation limits.
- Fixed `npm test` accidentally auto-discovering and executing `examples/full-stress-test.js` as a test file.
- Closed the 4 remaining production-scale coverage gaps with 24 real tests in `test/integration/production-gaps.test.js` (2274 → 2298 total): concurrent `processInput()` calls on one instance (no state corruption, finite PAD, coherent per-user memories), memory/window boundedness beyond 500 turns (`MoodTracker.window` capped after 5000 pushes, `EpisodicMemory` pruning verified over 3000 turns via `ForgettingCurve`, an unresolved wound surviving 2000 unrelated turns, PAD staying in bounds over 5000 alternating-valence turns), real provider integration (`OllamaProvider` throwing on an unreachable daemon and `Totemheart` transparently falling back to `HeuristicProvider`, `@xenova/transformers` confirmed importable, the real provider contract exercised with a custom `analyze()`), and non-ES/EN language robustness (French, German, Japanese, Chinese, Arabic, Russian, and mixed-script input all verified to produce a finite, honestly-neutral score — `HeuristicProvider`'s lexicon is ES/EN only, by design, not a bug — with no crash through the full pipeline).

## 0.1.1

### Patch Changes

- Added 10 real dynamics upgrades: EmotionSpace momentum/hysteresis, Homeostasis allostatic load, DopaminergicEngine wanting/liking split with eligibility traces, EpisodicMemory reconsolidation and intrusive thoughts, Attachment styles with rupture-and-repair, graduated AmygdalaHijack with kindling, Vaillant defense hierarchy, a full-state ExpressionDirectives policy with real suppression cost, resource-aware LoadScheduler/WornPathCache, and circadian-cortisol-Kalman coupling.
- Added `LoveHateEngine`: a dual-valence Affinity/Aversion relational field per user, with real ambivalence, kindling, and rupture-and-repair.

## 0.1.0

### Minor Changes

- set pre-alpha version
