import type { Hotspot, SceneDefinition } from "./types";

const W = 1280;
const H = 720;
const point = (label: string, value: string, action: Hotspot["action"]): Hotspot => ({ label, value, action, x: 0, y: 0, width: 1, height: 1 });

const story = (id: string, page: number, text: string, preposition: string, image: string): SceneDefinition => ({
  id,
  storyPage: page,
  storyText: text,
  preposition,
  image,
  alt: `Storybook page ${page}. ${text}`,
  width: W,
  height: H,
  hotspots: [point("Next story page", "next", "advance")],
});

const question = (id: string, prompt: string, correct: string, choices: readonly string[], image: string): SceneDefinition => ({
  id,
  question: prompt,
  correct,
  choices,
  image,
  alt: `Story question. ${prompt}`,
  width: W,
  height: H,
  hotspots: choices.map((choice) => point(`Answer ${choice}`, choice, "answer")),
});

export const scenes: readonly SceneDefinition[] = [
  {
    id: "title",
    image: "/exact/title.png",
    alt: "Princess. A story adventure for learning prepositions.",
    width: 512,
    height: 322,
    hotspots: [{ label: "Begin the Adventure", x: 51, y: 202, width: 152, height: 35, action: "start" }],
  },
  {
    id: "discover",
    image: "/exact/title.png",
    alt: "Look at Princess. The Princess is IN the tower. IN is a preposition because it tells us where something is.",
    width: W,
    height: H,
    hotspots: [point("Let's Try", "continue", "advance")],
  },
  {
    id: "storybook-intro",
    image: "/exact/title.png",
    alt: "Open the digital storybook. Read the whole story before answering questions.",
    width: W,
    height: H,
    hotspots: [point("Open Storybook", "begin", "advance")],
  },

  story("story-1", 1, "Once upon a time, there was a beautiful princess who lived in a tower.", "in", "/exact/title.png"),
  story("story-2", 2, "One day, she decided to escape. She climbed over the wall quietly and ran away.", "over", "/exact/gate.png"),
  story("story-3", 3, "She walked through the forest and saw a bird sitting on the tree. The bird sang a sweet song.", "on", "/exact/forest.png"),
  story("story-4", 4, "The princess walked by a small river carefully.", "by", "/exact/river.png"),
  story("story-5", 5, "Then she saw a giant monster standing in front of a dark cave. ‘ROAR!’ shouted the monster.", "in front of", "/exact/forest.png"),
  story("story-6", 6, "The princess hid between two big rocks because she felt afraid.", "between", "/exact/forest.png"),
  story("story-7", 7, "Suddenly, a prince came from behind and attacked the monster. He saved the princess.", "behind", "/exact/gate.png"),
  story("story-8", 8, "They continued walking next to each other under the starry night.", "next to", "/exact/bridge.png"),
  story("story-9", 9, "Finally, they arrived at the castle and lived happily together.", "at", "/exact/garden.png"),

  question("q1", "Where did the princess live at the beginning?", "in", ["on", "in", "under"], "/exact/title.png"),
  question("q2", "How did the princess get past the wall?", "over", ["behind", "over", "between"], "/exact/gate.png"),
  question("q3", "Where was the bird sitting?", "on", ["by", "on", "under"], "/exact/forest.png"),
  question("q4", "Where did the princess walk beside the water?", "by", ["at", "by", "behind"], "/exact/river.png"),
  question("q5", "Where was the monster standing?", "in front of", ["behind", "in front of", "next to"], "/exact/forest.png"),
  question("q6", "Where did the princess hide?", "between", ["between", "over", "at"], "/exact/forest.png"),
  question("q7", "Where did the prince come from?", "behind", ["in front of", "behind", "by"], "/exact/gate.png"),
  question("q8", "How did the prince and princess walk together?", "next to", ["under", "next to", "between"], "/exact/bridge.png"),
  question("q9", "Where did they arrive at the end?", "at", ["by", "in", "at"], "/exact/garden.png"),

  {
    id: "story-puzzle",
    image: "/exact/garden.png",
    question: "Rebuild Princess's adventure in story order.",
    alt: "Final puzzle. Put all nine prepositions in the order they appeared in the story.",
    width: W,
    height: H,
    sequence: ["in", "over", "on", "by", "in front of", "between", "behind", "next to", "at"],
    hotspots: ["in", "over", "on", "by", "in front of", "between", "behind", "next to", "at"].map((value) => point(`Puzzle ${value}`, value, "sequence")),
  },
  {
    id: "completion",
    image: "/exact/ending.png",
    alt: "Adventure complete. Princess reached the castle and all nine prepositions were remembered.",
    width: W,
    height: H,
    hotspots: [point("Play Again", "replay", "replay"), point("Read the Story Again", "story", "next")],
  },
] as const;
