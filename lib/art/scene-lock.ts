export type SceneLock = {
  id: string;
  artKey: "title" | "map" | "river" | "forest" | "treasure" | "gate" | "bridge" | "garden" | "ending";
  backgroundSize: string;
  backgroundPosition: string;
  previewSize: string;
  previewPosition: string;
};

/**
 * STRICT VISUAL CONTRACT
 * ----------------------
 * Every game state is intentionally assigned to one fixed artwork slot.
 * Do not derive artwork from `theme`, do not add fallbacks, and do not reuse
 * a different crop when a scene is missing. A new scene must add a lock here
 * before it can ship.
 */
export const SCENE_LOCKS: Record<string, SceneLock> = {
  title: {
    id: "title", artKey: "title",
    backgroundSize: "300% 232%", backgroundPosition: "0% 0%",
    previewSize: "300% 232%", previewPosition: "0% 0%",
  },
  intro: {
    id: "intro", artKey: "map",
    backgroundSize: "300% 232%", backgroundPosition: "50% 0%",
    previewSize: "300% 232%", previewPosition: "50% 0%",
  },
  river: {
    id: "river", artKey: "river",
    backgroundSize: "300% 232%", backgroundPosition: "100% 0%",
    previewSize: "310% 235%", previewPosition: "100% 0%",
  },
  forest: {
    id: "forest", artKey: "forest",
    backgroundSize: "600% 320%", backgroundPosition: "35% 59%",
    previewSize: "610% 325%", previewPosition: "35% 59%",
  },
  treasure: {
    id: "treasure", artKey: "treasure",
    backgroundSize: "590% 270%", backgroundPosition: "67% 7%",
    previewSize: "590% 270%", previewPosition: "67% 7%",
  },
  gate: {
    id: "gate", artKey: "gate",
    backgroundSize: "560% 270%", backgroundPosition: "49% 18%",
    previewSize: "560% 270%", previewPosition: "49% 18%",
  },
  "bridge-word": {
    id: "bridge-word", artKey: "bridge",
    backgroundSize: "550% 270%", backgroundPosition: "57% 19%",
    previewSize: "550% 270%", previewPosition: "57% 19%",
  },
  builder: {
    id: "builder", artKey: "bridge",
    backgroundSize: "550% 270%", backgroundPosition: "57% 19%",
    previewSize: "550% 270%", previewPosition: "57% 19%",
  },
  hybrid: {
    id: "hybrid", artKey: "bridge",
    backgroundSize: "550% 270%", backgroundPosition: "57% 19%",
    previewSize: "550% 270%", previewPosition: "57% 19%",
  },
  final: {
    id: "final", artKey: "garden",
    backgroundSize: "555% 270%", backgroundPosition: "69% 18%",
    previewSize: "555% 270%", previewPosition: "69% 18%",
  },
  ending: {
    id: "ending", artKey: "ending",
    backgroundSize: "300% 232%", backgroundPosition: "100% 100%",
    previewSize: "300% 232%", previewPosition: "100% 100%",
  },
};

export function assertSceneLock(sceneId: string): SceneLock {
  const lock = SCENE_LOCKS[sceneId];
  if (!lock) throw new Error(`Missing strict scene artwork lock for: ${sceneId}`);
  return lock;
}
