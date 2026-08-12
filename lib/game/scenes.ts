import type { Hotspot, SceneDefinition } from "./types";

const UI_WIDTH = 1280;
const UI_HEIGHT = 720;
const point = (label: string, value: string, action: Hotspot["action"]): Hotspot => ({
  label,
  value,
  action,
  x: 0,
  y: 0,
  width: 1,
  height: 1,
});

const story = (
  id: string,
  page: number,
  text: string,
  preposition: string,
  image: string,
): SceneDefinition => ({
  id,
  storyPage: page,
  storyText: text,
  preposition,
  image,
  alt: `Storybook page ${page}. ${text}`,
  width: UI_WIDTH,
  height: UI_HEIGHT,
  hotspots: [point("Next story page", "next", "advance")],
});

const question = (
  id: string,
  prompt: string,
  correct: string,
  choices: readonly string[],
  image: string,
): SceneDefinition => ({
  id,
  question: prompt,
  correct,
  choices,
  image,
  alt: `Story question. ${prompt}`,
  width: UI_WIDTH,
  height: UI_HEIGHT,
  hotspots: choices.map((choice) => point(`Answer ${choice}`, choice, "answer")),
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
    id: "word-scattering",
    image: "/exact/forest.png",
    alt: "Word Scattering. Find the preposition UNDER in the sentence The princess is under the tree.",
    width: UI_WIDTH,
    height: UI_HEIGHT,
    correct: "under",
    hotspots: [
      point("Choose THE", "the", "answer"),
      point("Choose PRINCESS", "princess", "answer"),
      point("Choose IS", "is", "answer"),
      point("Choose UNDER", "under", "answer"),
      point("Choose TREE", "tree", "answer"),
      point("Choose CASTLE", "castle", "answer"),
    ],
  },
  {
    id: "sentence-reconstruction",
    image: "/exact/forest.png",
    alt: "Sentence Reconstruction. Build: The princess is under the tree.",
    width: UI_WIDTH,
    height: UI_HEIGHT,
    sequence: ["the-1", "princess", "is", "under", "the-2", "tree", "period"],
    hotspots: [
      point("Word THE", "the-1", "sequence"),
      point("Word PRINCESS", "princess", "sequence"),
      point("Word IS", "is", "sequence"),
      point("Word UNDER", "under", "sequence"),
      point("Word THE second", "the-2", "sequence"),
      point("Word TREE", "tree", "sequence"),
      point("Word PERIOD", "period", "sequence"),
    ],
  },
  {
    id: "picture-matching",
    image: "/exact/garden.png",
    alt: "Picture Matching. Match Princess Prepo scenes to the correct preposition sentence.",
    width: UI_WIDTH,
    height: UI_HEIGHT,
    sequence: ["under", "on", "in"],
    hotspots: [
      point("The princess is UNDER the tree", "under", "sequence"),
      point("The princess is ON the stones", "on", "sequence"),
      point("The princess is IN the garden", "in", "sequence"),
    ],
  },
  {
    id: "storybook-intro",
    image: "/exact/title.png",
    alt: "Digital Storybook. Read the whole story first. Questions and puzzles come after the final page.",
    width: UI_WIDTH,
    height: UI_HEIGHT,
    hotspots: [point("Begin digital storybook", "begin", "advance")],
  },

  story("story-1", 1, "Once upon a time, there was a beautiful princess who lived in a tower.", "in", "/exact/title.png"),
  story("story-2", 2, "And one day, she decided to escape. She climbed over the wall quietly and ran away.", "over", "/exact/gate.png"),
  story("story-3", 3, "She walked slowly through the forest and saw a bird sitting on the tree. The bird sang a sweet song.", "on", "/exact/forest.png"),
  story("story-4", 4, "The princess walked by a small river carefully.", "by", "/exact/river.png"),
  story("story-5", 5, "Then, she saw a giant monster standing in front of a dark cave. Its eyes glowed red. ‘ROAR!’ shouted the monster.", "in front of", "/exact/forest.png"),
  story("story-6", 6, "The princess hid between two big rocks because she felt afraid.", "between", "/exact/forest.png"),
  story("story-7", 7, "Suddenly, a prince came from behind and attacked the monster. He saved the princess, and she felt happy and safe.", "behind", "/exact/gate.png"),
  story("story-8", 8, "Then, they continued walking next to each other under the starry night. The stars shone brightly in the sky.", "next to", "/exact/bridge.png"),
  story("story-9", 9, "Finally, they arrived at her castle and lived happily together.", "at", "/exact/garden.png"),

  question("q1", "Where did the princess live?", "in", ["on", "in", "under"], "/exact/title.png"),
  question("q2", "How did the princess escape?", "over", ["behind", "over", "between"], "/exact/gate.png"),
  question("q3", "Where was the bird sitting?", "on", ["by", "on", "under"], "/exact/forest.png"),
  question("q4", "Where was the monster standing?", "in front of", ["behind", "in front of", "next to"], "/exact/forest.png"),
  question("q5", "Where did the princess hide?", "between", ["between", "over", "at"], "/exact/forest.png"),
  question("q6", "Where did the prince come from?", "behind", ["in front of", "behind", "by"], "/exact/gate.png"),
  question("q7", "How did the prince and princess walk?", "next to", ["under", "next to", "between"], "/exact/bridge.png"),
  question("q8", "Where did they arrive at the end?", "at", ["by", "in", "at"], "/exact/garden.png"),

  {
    id: "story-puzzle",
    image: "/exact/garden.png",
    question: "Rebuild the preposition trail from the story.",
    alt: "Story Puzzle. Tap the remembered prepositions in story order.",
    width: UI_WIDTH,
    height: UI_HEIGHT,
    sequence: ["in", "over", "on", "by", "in front of", "between", "behind", "next to", "at"],
    hotspots: ["in", "over", "on", "by", "in front of", "between", "behind", "next to", "at"].map((value) => point(`Puzzle ${value}`, value, "sequence")),
  },
  {
    id: "completion",
    image: "/exact/ending.png",
    alt: "Well done. You completed Princess and the Prepo.",
    width: UI_WIDTH,
    height: UI_HEIGHT,
    hotspots: [point("Play Again", "replay", "replay"), point("Back to Start", "start", "next")],
  },
] as const;
