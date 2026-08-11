import { describe, expect, it } from "vitest";
import { scenes } from "./scenes";

describe("locked learning flow registry", () => {
  it("uses the full retention-first story flow", () => {
    expect(scenes.map(({ id }) => id)).toEqual([
      "title",
      "word-scattering",
      "sentence-reconstruction",
      "picture-matching",
      "storybook-intro",
      "story-river",
      "story-forest",
      "story-treasure",
      "story-gate",
      "story-bridge",
      "story-garden",
      "question-river",
      "question-forest",
      "question-treasure",
      "question-gate",
      "question-bridge",
      "question-garden",
      "story-puzzle-question",
      "story-puzzle-jigsaw",
      "progress-map",
      "completion",
    ]);
  });

  it("keeps the storybook separate from the questions and puzzles", () => {
    const ids = scenes.map(({ id }) => id);
    expect(ids.indexOf("story-garden")).toBeLessThan(ids.indexOf("question-river"));
    expect(ids.indexOf("question-garden")).toBeLessThan(ids.indexOf("story-puzzle-question"));
    expect(ids).not.toContain("puzzle-word");
  });

  it("makes every comprehension answer recall an event from the digital storybook", () => {
    expect(Object.fromEntries(scenes.filter(({ id }) => id.startsWith("question-")).map(({ id, correct }) => [id, correct]))).toEqual({
      "question-river": "on",
      "question-forest": "under",
      "question-treasure": "in",
      "question-gate": "next to",
      "question-bridge": "over",
      "question-garden": "in",
    });
  });

  it("keeps the generated supporting artwork locked to the literal atlas", () => {
    const atlasScenes = scenes.filter(({ image }) => image === "/exact/learning-flow.svg");
    expect(atlasScenes.map(({ id }) => id)).toEqual([
      "word-scattering",
      "sentence-reconstruction",
      "picture-matching",
      "storybook-intro",
      "story-puzzle-question",
      "story-puzzle-jigsaw",
      "progress-map",
      "completion",
    ]);
    expect(atlasScenes.every(({ crop }) => crop?.sourceWidth === 1536 && crop?.sourceHeight === 1024)).toBe(true);
  });
});
