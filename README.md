# Princess and the Prepo

An interactive storybook learning adventure for Year 1–3 pupils to practise **IN**, **ON**, **UNDER**, and **NEXT TO** through story scenes, world reactions, narration, drag interaction, sentence completion, sentence building, and a physical-kit hybrid moment.

## Experience

The pupil follows Princess Prepo from the castle to the magical flower garden. Correct answers change the world instead of only showing a tick: stepping stones unlock, obstacles are passed, a treasure chest opens, a garden gate responds to positioning, and the final challenge reinforces transfer of learning.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- CSS storybook UI
- Vitest + Testing Library
- Browser SpeechSynthesis narration

## Local development

```bash
npm ci
npm run dev
```

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

GitHub Actions runs the same verification on `main`, `production-polish`, and pull requests.

## Current production status

Core gameplay, all learning scenes, teacher notes, rewards, replay/practice, accessibility fallbacks, responsive layouts, and automated tests are implemented. The production-polish pass strengthens the ornate parchment/pink-gold storybook presentation and classroom/tablet composition while preserving the working game logic.

## Deployment

The application is a standard Next.js project and is ready to import into Vercel from the `pakyad/princess` GitHub repository. No backend or environment variables are required for the MVP.
