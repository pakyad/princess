import { describe, expect, it } from "vitest";
import { scenes } from "./scenes";

describe("Princess Prepo locked learning flow", () => {
  it("uses the complete eight-stage retention journey", () => {
    expect(scenes.map(({ id }) => id)).toEqual([
      "title",
      "word-scattering",
      "sentence-reconstruction",
      "picture-matching",
      "storybook-intro",
      "story-1","story-2","story-3","story-4","story-5","story-6","story-7","story-8","story-9",
      "q1","q2","q3","q4","q5","q6","q7","q8",
      "story-puzzle",
      "completion",
    ]);
  });

  it("shows the whole story before any comprehension question", () => {
    const ids = scenes.map(({ id }) => id);
    expect(ids.indexOf("story-9")).toBeLessThan(ids.indexOf("q1"));
    expect(ids.indexOf("q8")).toBeLessThan(ids.indexOf("story-puzzle"));
  });

  it("preserves the storybook prepositions in narrative order", () => {
    expect(scenes.filter(({ id }) => id.startsWith("story-") && id !== "story-puzzle").map(({ preposition }) => preposition)).toEqual([
      "in", "over", "on", "by", "in front of", "between", "behind", "next to", "at",
    ]);
  });

  it("makes story questions recall the uploaded story", () => {
    expect(scenes.filter(({ id }) => /^q\d+$/.test(id)).map(({ correct }) => correct)).toEqual([
      "in", "over", "on", "in front of", "between", "behind", "next to", "at",
    ]);
  });
});
