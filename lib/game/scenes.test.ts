import { describe, expect, it } from "vitest";
import { scenes } from "./scenes";

describe("exact screen registry", () => {
  it("uses the approved eight-screen order and literal assets", () => {
    expect(scenes.map(({ id }) => id)).toEqual(["title", "river", "forest", "treasure", "gate", "bridge", "garden", "ending"]);
    expect(scenes.map(({ image }) => image)).toEqual(scenes.map(({ id }) => `/exact/${id}.png`));
  });

  it("preserves every approved lesson answer", () => {
    expect(Object.fromEntries(scenes.filter(({ correct }) => correct).map(({ id, correct }) => [id, correct]))).toEqual({
      river: "on",
      forest: "under",
      treasure: "in",
      gate: "next to",
      bridge: "over",
      garden: "in",
    });
  });
});
