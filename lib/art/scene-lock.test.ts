import { describe, expect, it } from "vitest";
import { scenes } from "@/lib/game/scenes";
import { SCENE_LOCKS, assertSceneLock } from "./scene-lock";

describe("strict scene artwork contract", () => {
  it("locks every game scene to an explicit artwork slot", () => {
    expect(Object.keys(SCENE_LOCKS).sort()).toEqual(scenes.map((scene) => scene.id).sort());
  });

  it("never silently falls back when artwork is missing", () => {
    for (const scene of scenes) expect(() => assertSceneLock(scene.id)).not.toThrow();
    expect(() => assertSceneLock("missing-scene")).toThrow(/Missing strict scene artwork lock/);
  });

  it("keeps every lock fully specified", () => {
    for (const scene of scenes) {
      const lock = assertSceneLock(scene.id);
      expect(lock.backgroundSize).toMatch(/%/);
      expect(lock.backgroundPosition).toMatch(/%/);
      expect(lock.previewSize).toMatch(/%/);
      expect(lock.previewPosition).toMatch(/%/);
    }
  });
});
