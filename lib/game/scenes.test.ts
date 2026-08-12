import { describe, expect, it } from "vitest";
import { scenes } from "./scenes";

describe("Princess locked learning flow", () => {
  it("uses discover, book, recall, puzzle and completion in order", () => {
    expect(scenes.map(({ id }) => id)).toEqual([
      "title",
      "discover",
      "storybook-intro",
      "story-1","story-2","story-3","story-4","story-5","story-6","story-7","story-8","story-9",
      "q1","q2","q3","q4","q5","q6","q7","q8","q9",
      "story-puzzle",
      "completion",
    ]);
  });

  it("shows the whole story before any recall question", () => {
    const ids = scenes.map(({ id }) => id);
    expect(ids.indexOf("story-9")).toBeLessThan(ids.indexOf("q1"));
    expect(ids.indexOf("q9")).toBeLessThan(ids.indexOf("story-puzzle"));
  });

  it("preserves all nine storybook prepositions in narrative order", () => {
    expect(scenes.filter(({ id }) => /^story-\d+$/.test(id)).map(({ preposition }) => preposition)).toEqual([
      "in", "over", "on", "by", "in front of", "between", "behind", "next to", "at",
    ]);
  });

  it("makes every recall question correspond to the same nine prepositions", () => {
    expect(scenes.filter(({ id }) => /^q\d+$/.test(id)).map(({ correct }) => correct)).toEqual([
      "in", "over", "on", "by", "in front of", "between", "behind", "next to", "at",
    ]);
  });
});
