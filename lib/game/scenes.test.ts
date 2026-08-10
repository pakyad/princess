import { describe, expect, it } from "vitest";
import { scenes } from "./scenes";

describe("lesson scene definitions", () => {
  it("uses unique scene ids in the intended journey order", () => {
    const ids = scenes.map((scene) => scene.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual([
      "title", "intro", "river", "forest", "treasure", "gate",
      "bridge-word", "builder", "hybrid", "final", "ending",
    ]);
  });

  it("keeps every multiple-choice answer reachable from its choices", () => {
    const choiceScenes = scenes.filter((scene) => scene.interaction === "choice");
    for (const scene of choiceScenes) {
      expect(scene.correct).toBeTruthy();
      expect(scene.choices?.some((choice) => choice.id === scene.correct)).toBe(true);
      expect(scene.wrong).toBeTruthy();
      expect(scene.hint).toBeTruthy();
    }
  });

  it("covers the four target prepositions in contextual challenges", () => {
    const sentences = scenes.map((scene) => scene.sentence ?? "").join(" ");
    expect(sentences).toContain(" IN ");
    expect(sentences).toContain(" ON ");
    expect(sentences).toContain(" UNDER ");
    expect(sentences).toContain(" NEXT TO ");
  });

  it("keeps the sentence-builder answer aligned with the displayed prompt", () => {
    const builder = scenes.find((scene) => scene.id === "builder");
    expect(builder?.correct).toBe("the princess|is|under|the bridge");
    expect(builder?.sentence).toBe("The princess is UNDER the bridge.");
  });

  it("keeps the final challenge answer aligned with the visual lesson intent", () => {
    const final = scenes.find((scene) => scene.id === "final");
    expect(final?.correct).toBe("tree-next");
    expect(final?.sentence).toBe("The princess is NEXT TO the tree.");
  });
});
