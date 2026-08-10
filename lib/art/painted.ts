import { mockupPart1 } from "./mockup-part-1";
import { mockupPart2 } from "./mockup-part-2";
import { mockupPart3 } from "./mockup-part-3";
import { mockupPart4 } from "./mockup-part-4";
import { mockupPart5 } from "./mockup-part-5";
import { mockupPart6 } from "./mockup-part-6";
import { mockupPart7 } from "./mockup-part-7";
import type { SceneDefinition } from "@/lib/game/types";

export const PAINTED_MOCKUP = `data:image/jpeg;base64,${mockupPart1}${mockupPart2}${mockupPart3}${mockupPart4}${mockupPart5}${mockupPart6}${mockupPart7}`;

export function paintedEnvironmentStyle(scene: SceneDefinition): React.CSSProperties {
  const base: React.CSSProperties = {
    backgroundImage: `linear-gradient(rgba(255,255,255,.02), rgba(20,12,18,.08)), url(${PAINTED_MOCKUP})`,
    backgroundRepeat: "no-repeat",
  };

  switch (scene.theme) {
    case "castle":
      return { ...base, backgroundSize: "300% 232%", backgroundPosition: "0% 0%" };
    case "river":
      return { ...base, backgroundSize: "355% 236%", backgroundPosition: "100% 2%" };
    case "forest":
    case "camp":
      return { ...base, backgroundSize: "590% 320%", backgroundPosition: "35% 58%" };
    case "treasure":
      return { ...base, backgroundSize: "520% 250%", backgroundPosition: "66% 5%" };
    case "gate":
      return { ...base, backgroundSize: "520% 250%", backgroundPosition: "48% 10%" };
    case "bridge":
    case "bridge-under":
      return { ...base, backgroundSize: "500% 255%", backgroundPosition: "56% 16%" };
    case "final":
    case "garden":
      return { ...base, backgroundSize: "500% 255%", backgroundPosition: "68% 14%" };
    default:
      return base;
  }
}
