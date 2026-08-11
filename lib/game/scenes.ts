import type { Answer, Hotspot, SceneDefinition } from "./types";

const answerHotspot = (label: string, answer: Answer, x: number, y: number, width: number, height: number): Hotspot => ({
  label,
  answer,
  x,
  y,
  width,
  height,
  action: "answer",
});

export const scenes: readonly SceneDefinition[] = [
  {
    id: "title",
    image: "/exact/title.png",
    alt: "Princess and the Prepo. An interactive adventure to learn prepositions in a magical way. Start Adventure.",
    width: 512,
    height: 322,
    hotspots: [{ label: "Start Adventure", x: 51, y: 202, width: 152, height: 35, action: "start" }],
  },
  {
    id: "river",
    image: "/exact/river.png",
    alt: "Across the River. The princess can walk blank the stones to cross the river. Choices: A, in; B, on; C, under.",
    width: 491,
    height: 322,
    correct: "on",
    hotspots: [
      answerHotspot("Answer A: IN", "in", 292, 197, 174, 27),
      answerHotspot("Answer B: ON", "on", 292, 227, 174, 27),
      answerHotspot("Answer C: UNDER", "under", 292, 257, 174, 27),
    ],
  },
  {
    id: "forest",
    image: "/exact/forest.png",
    alt: "Under the Tree. The princess can walk blank the fallen tree. Choices: A, on; B, under; C, next to.",
    width: 494,
    height: 322,
    correct: "under",
    hotspots: [
      answerHotspot("Answer A: ON", "on", 294, 201, 176, 27),
      answerHotspot("Answer B: UNDER", "under", 294, 232, 176, 27),
      answerHotspot("Answer C: NEXT TO", "next to", 294, 262, 176, 29),
    ],
  },
  {
    id: "treasure",
    image: "/exact/treasure.png",
    alt: "In the Treasure Room. The treasure is blank the chest. Choices: A, in; B, on; C, next to.",
    width: 512,
    height: 303,
    correct: "in",
    hotspots: [
      answerHotspot("Answer A: IN", "in", 323, 195, 162, 27),
      answerHotspot("Answer B: ON", "on", 323, 225, 162, 27),
      answerHotspot("Answer C: NEXT TO", "next to", 323, 254, 162, 27),
    ],
  },
  {
    id: "gate",
    image: "/exact/gate.png",
    alt: "Next to the Gate. The princess is standing blank the gate. Choices: A, on; B, next to; C, under.",
    width: 491,
    height: 303,
    correct: "next to",
    hotspots: [
      answerHotspot("Answer A: ON", "on", 305, 199, 163, 27),
      answerHotspot("Answer B: NEXT TO", "next to", 305, 228, 163, 27),
      answerHotspot("Answer C: UNDER", "under", 305, 257, 163, 27),
    ],
  },
  {
    id: "bridge",
    image: "/exact/bridge.png",
    alt: "Over the Bridge. The princess can walk blank the bridge. Choices: A, in; B, over; C, under.",
    width: 494,
    height: 303,
    correct: "over",
    hotspots: [
      answerHotspot("Answer A: IN", "in", 305, 199, 165, 27),
      answerHotspot("Answer B: OVER", "over", 305, 228, 165, 27),
      answerHotspot("Answer C: UNDER", "under", 305, 258, 165, 26),
    ],
  },
  {
    id: "garden",
    image: "/exact/garden.png",
    alt: "In the Garden. The princess is walking blank the flowers. Choices: A, in; B, on; C, next to.",
    width: 512,
    height: 293,
    correct: "in",
    hotspots: [
      answerHotspot("Answer A: IN", "in", 323, 194, 164, 27),
      answerHotspot("Answer B: ON", "on", 323, 224, 164, 27),
      answerHotspot("Answer C: NEXT TO", "next to", 323, 254, 164, 27),
    ],
  },
  {
    id: "ending",
    image: "/exact/ending.png",
    alt: "Level Complete. Great job, Princess! You earned three stars. Choose Replay or Next Level.",
    width: 419,
    height: 293,
    hotspots: [
      { label: "Replay", x: 151, y: 209, width: 90, height: 43, action: "replay" },
      { label: "Next Level", x: 249, y: 209, width: 103, height: 43, action: "next" },
    ],
  },
] as const;
