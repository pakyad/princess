# Production Notes

The `production-polish` branch intentionally preserves the tested game-state and learning logic while improving presentation and deployment readiness.

## Visual direction

The design target is an illustrated fantasy storybook game, not a dashboard or generic quiz app. The production polish layer strengthens:

- full-screen world presentation
- ornate parchment depth
- pink/gold ribbon treatment
- answer-button depth and feedback states
- chapter-specific lighting/atmosphere
- tablet/classroom left-world + right-question composition
- mobile readability and touch target sizing

## Asset strategy

`public/assets/river-storybook.png` remains the benchmark painting. Scene-specific CSS world objects and atmosphere provide differentiation while dedicated original environment paintings can be swapped in later without changing game logic.

## Release gate

Code-level verification is automated in `.github/workflows/ci.yml`. Final release still requires a live Vercel import and browser/device smoke testing.
