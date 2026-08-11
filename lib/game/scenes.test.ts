import { describe, expect, it } from "vitest";
import { scenes } from "./scenes";

describe("locked learning flow registry", () => {
  it("uses the complete pedagogy-first flow", () => {
    expect(scenes.map(({ id }) => id)).toEqual([
      "title",
      "word-scattering",
      "sentence-reconstruction",
      "picture-matching",
      "storybook-intro",
      "river",
      "forest",
      "treasure",
      "gate",
      "bridge",
      "garden",
      "puzzle-question",
      "puzzle-word",
      "puzzle-jigsaw",
      "progress-map",
      "completion",
    ]);
  });

  it("keeps the generated learning artwork locked to one literal atlas", () => {
    const generated = scenes.filter(({ crop }) => crop);
    expect(generated).toHaveLength(9);
    expect(new Set(generated.map(({ image }) => image))).toEqual(new Set(["/exact/learning-flow.png"]));
    expect(generated.every(({ crop }) => crop?.sourceWidth === 1536 && crop?.sourceHeight === 1024)).toBe(true);
  });

  it("preserves the approved story answers and retention answers", () => {
    expect(Object.fromEntries(scenes.filter(({ correct }) => correct).map(({ id, correct }) => [id, correct]))).toMatchObject({
      "word-scattering": "under",
      river: "on",
      forest: "under",
      treasure: "in",
      gate: "next to",
      bridge: "over",
      garden: "in",
      "puzzle-question": "behind",
      "puzzle-word": "in",
    });
  });
});
