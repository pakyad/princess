# Princess and the Prepo — Implementation Plan

## Repository audit

- **Framework:** Empty repository; scaffold Next.js 15 + React 19 + TypeScript.
- **Dependencies:** None initially. Add only Next, React, Vitest, Testing Library, and ESLint.
- **Structure/assets/prototype:** No existing files, assets, or prototype.
- **Reuse:** The supplied visual reference is the sole reusable design authority.
- **Replace:** Nothing to replace.
- **Risks:** Original illustration production, responsive storybook composition, pointer/keyboard parity, speech-synthesis browser differences, and keeping scene transitions race-free.
- **Missing assets:** All environments, Princess states, objects, ornaments, rewards, and audio recordings. Use an asset manifest and original generated art; SpeechSynthesis remains replaceable.
- **Implementation order:** Typed state/tests → storybook shell → golden River scene → remaining scenes → active learning → ending → responsive/accessibility QA.

## Phase 1 — Foundation

- [x] Scaffold Next.js/TypeScript project and scene-oriented folders.
- [x] Define immutable game state and data-driven scene registry.
- [x] Add audio abstraction with SpeechSynthesis and mute/replay controls.
- [x] Add storybook tokens and responsive full-viewport stage.
- [x] Write reducer tests for retry, hints, rewards, transitions, replay, and sound.

## Phase 2 — Visual shell

- [x] Build parchment, ribbon, question panel, answer buttons, feedback, rewards, Princess layer, and teacher control.
- [x] Preserve the reference left-world/right-challenge composition at 16:9.
- [x] Add portrait/mobile stacking, focus states, touch targets, and reduced motion.

## Phase 3 — Golden River scene

- [x] Implement exact ON challenge, retry/hints, stepping-stone reaction, Princess crossing, narration, reward, and Continue.
- [x] Use the generated River environment as the visual benchmark.

## Phase 4 — Story journey

- [x] Title and story introduction.
- [x] Forest / UNDER world reaction.
- [x] Treasure / IN chest and key reaction.
- [x] NEXT TO drag, touch, keyboard, and tap fallback.

## Phase 5 — Learning interactions

- [x] Magic sentence completion.
- [x] Sentence builder with drag and tap-to-place.
- [x] Optional physical-kit hybrid moment with Skip.
- [x] Final transfer challenge.

## Phase 6 — Ending and replay

- [x] Flower-garden celebration, learned concepts, rewards, Play Again, and Practice Again.

## Phase 7 — Polish

- [x] Purposeful scene/world animations and contextual feedback.
- [x] Teacher mode: objective, answer, physical prompt, oral follow-up, and skip.
- [ ] Add recorded narration assets when supplied.
- [ ] Expand original generated environment set beyond the benchmark River artwork.

## Phase 8 — QA

- [x] Install dependencies.
- [x] Run unit tests and coverage (100% lines / 95.23% branches for game logic).
- [x] Run lint and typecheck.
- [x] Run production build.
- [ ] Run browser smoke tests at desktop, tablet landscape/portrait, and mobile sizes.
- [ ] Verify mouse, touch, keyboard, narration, mute, reduced motion, and console cleanliness in a reachable browser session.
- [x] Run production dependency audit (0 vulnerabilities).
