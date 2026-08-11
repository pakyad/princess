import type { Answer, Hotspot, SceneCrop, SceneDefinition } from "./types";

const FLOW_ART = "/exact/learning-flow.svg";
const FLOW_SIZE = { sourceWidth: 1536, sourceHeight: 1024 } as const;

const answerHotspot = (label: string, answer: Answer, x: number, y: number, width: number, height: number): Hotspot => ({
  label,
  answer,
  value: answer,
  x,
  y,
  width,
  height,
  action: "answer",
});

const crop = (x: number, y: number, width: number, height: number): SceneCrop => ({ ...FLOW_SIZE, x, y, width, height });
const storyCrop = (sourceWidth: number, sourceHeight: number, width: number): SceneCrop => ({ sourceWidth, sourceHeight, x: 0, y: 0, width, height: sourceHeight });
const storyNext = (width: number, height: number): Hotspot => ({ label: "Next story page", x: Math.max(0, width - 82), y: Math.max(0, height - 54), width: 72, height: 44, action: "advance" });

export const scenes: readonly SceneDefinition[] = [
  { id: "title", image: "/exact/title.png", alt: "Princess and the Prepo. An interactive adventure to learn prepositions in a magical way. Start Adventure.", width: 512, height: 322, hotspots: [{ label: "Start Adventure", x: 51, y: 202, width: 152, height: 35, action: "start" }] },
  { id: "word-scattering", image: FLOW_ART, alt: "Word Scattering. Find the preposition among the scattered words. The target sentence is The cat is under the table.", width: 362, height: 321, crop: crop(13, 86, 362, 321), correct: "under", hotspots: [
    { label: "Choose THE", value: "the", x: 135, y: 75, width: 58, height: 38, action: "answer" },
    { label: "Choose CAT", value: "cat", x: 198, y: 75, width: 58, height: 38, action: "answer" },
    { label: "Choose IS", value: "is", x: 260, y: 75, width: 53, height: 38, action: "answer" },
    { label: "Choose UNDER, the preposition", value: "under", x: 150, y: 120, width: 87, height: 43, action: "answer" },
    { label: "Choose THE second tile", value: "the", x: 245, y: 120, width: 64, height: 43, action: "answer" },
    { label: "Choose TABLE", value: "table", x: 170, y: 168, width: 80, height: 42, action: "answer" },
  ] },
  { id: "sentence-reconstruction", image: FLOW_ART, alt: "Sentence Reconstruction. Tap the words in order to build: The cat is under the table.", width: 374, height: 321, crop: crop(388, 86, 374, 321), sequence: ["the-1", "cat", "is", "under", "the-2", "table", "period"], hotspots: [
    { label: "Word 1 THE", value: "the-1", x: 11, y: 80, width: 48, height: 42, action: "sequence" },
    { label: "Word 2 CAT", value: "cat", x: 61, y: 80, width: 48, height: 42, action: "sequence" },
    { label: "Word 3 IS", value: "is", x: 111, y: 80, width: 43, height: 42, action: "sequence" },
    { label: "Word 4 UNDER", value: "under", x: 157, y: 80, width: 59, height: 42, action: "sequence" },
    { label: "Word 5 THE", value: "the-2", x: 219, y: 80, width: 47, height: 42, action: "sequence" },
    { label: "Word 6 TABLE", value: "table", x: 269, y: 80, width: 62, height: 42, action: "sequence" },
    { label: "Word 7 PERIOD", value: "period", x: 334, y: 80, width: 34, height: 42, action: "sequence" },
  ] },
  { id: "picture-matching", image: FLOW_ART, alt: "Picture Matching. Match each cat picture with the sentence that describes its position.", width: 296, height: 321, crop: crop(775, 86, 296, 321), sequence: ["under", "on", "in"], hotspots: [
    { label: "Sentence: The cat is on the chair", value: "on", x: 150, y: 76, width: 132, height: 60, action: "sequence" },
    { label: "Sentence: The cat is under the table", value: "under", x: 150, y: 141, width: 132, height: 60, action: "sequence" },
    { label: "Sentence: The cat is in the box", value: "in", x: 150, y: 207, width: 132, height: 60, action: "sequence" },
  ] },
  { id: "storybook-intro", image: FLOW_ART, alt: "Digital Storybook. Listen and remember what Princess Prepo does. The questions and puzzle after the story will be based on this journey.", width: 438, height: 321, crop: crop(1084, 86, 438, 321), hotspots: [{ label: "Begin digital storybook", x: 340, y: 250, width: 70, height: 54, action: "advance" }] },
  { id: "story-river", image: "/exact/river.png", alt: "Story page 1. Princess Prepo reaches the river. She walks on the stepping stones to cross safely.", width: 280, height: 322, crop: storyCrop(491, 322, 280), hotspots: [storyNext(280, 322)] },
  { id: "story-forest", image: "/exact/forest.png", alt: "Story page 2. In the whispering forest, a fallen tree blocks the path. Princess Prepo goes under the tree.", width: 290, height: 322, crop: storyCrop(494, 322, 290), hotspots: [storyNext(290, 322)] },
  { id: "story-treasure", image: "/exact/treasure.png", alt: "Story page 3. Princess Prepo enters the treasure room and finds the treasure in the chest.", width: 300, height: 303, crop: storyCrop(512, 303, 300), hotspots: [storyNext(300, 303)] },
  { id: "story-gate", image: "/exact/gate.png", alt: "Story page 4. At the castle, Princess Prepo stands next to the gate.", width: 300, height: 303, crop: storyCrop(491, 303, 300), hotspots: [storyNext(300, 303)] },
  { id: "story-bridge", image: "/exact/bridge.png", alt: "Story page 5. Princess Prepo continues her journey over the bridge.", width: 300, height: 303, crop: storyCrop(494, 303, 300), hotspots: [storyNext(300, 303)] },
  { id: "story-garden", image: "/exact/garden.png", alt: "Story page 6. Princess Prepo finally arrives in the magical flower garden.", width: 300, height: 293, crop: storyCrop(512, 293, 300), hotspots: [storyNext(300, 293)] },
  { id: "question-river", image: "/exact/river.png", alt: "Story Question 1. How did Princess Prepo cross the river? Choices: in, on, under.", width: 491, height: 322, correct: "on", hotspots: [answerHotspot("Answer A: IN", "in", 292, 197, 174, 27), answerHotspot("Answer B: ON", "on", 292, 227, 174, 27), answerHotspot("Answer C: UNDER", "under", 292, 257, 174, 27)] },
  { id: "question-forest", image: "/exact/forest.png", alt: "Story Question 2. Where did Princess Prepo go at the fallen tree? Choices: on, under, next to.", width: 494, height: 322, correct: "under", hotspots: [answerHotspot("Answer A: ON", "on", 294, 201, 176, 27), answerHotspot("Answer B: UNDER", "under", 294, 232, 176, 27), answerHotspot("Answer C: NEXT TO", "next to", 294, 262, 176, 29)] },
  { id: "question-treasure", image: "/exact/treasure.png", alt: "Story Question 3. Where was the treasure? Choices: in, on, next to.", width: 512, height: 303, correct: "in", hotspots: [answerHotspot("Answer A: IN", "in", 323, 195, 162, 27), answerHotspot("Answer B: ON", "on", 323, 225, 162, 27), answerHotspot("Answer C: NEXT TO", "next to", 323, 254, 162, 27)] },
  { id: "question-gate", image: "/exact/gate.png", alt: "Story Question 4. Where did Princess Prepo stand at the castle gate? Choices: on, next to, under.", width: 491, height: 303, correct: "next to", hotspots: [answerHotspot("Answer A: ON", "on", 305, 199, 163, 27), answerHotspot("Answer B: NEXT TO", "next to", 305, 228, 163, 27), answerHotspot("Answer C: UNDER", "under", 305, 257, 163, 27)] },
  { id: "question-bridge", image: "/exact/bridge.png", alt: "Story Question 5. How did Princess Prepo continue toward the garden? Choices: in, over, under.", width: 494, height: 303, correct: "over", hotspots: [answerHotspot("Answer A: IN", "in", 305, 199, 165, 27), answerHotspot("Answer B: OVER", "over", 305, 228, 165, 27), answerHotspot("Answer C: UNDER", "under", 305, 258, 165, 26)] },
  { id: "question-garden", image: "/exact/garden.png", alt: "Story Question 6. Where did Princess Prepo arrive at the end of the story? Choices: in, on, next to.", width: 512, height: 293, correct: "in", hotspots: [answerHotspot("Answer A: IN", "in", 323, 194, 164, 27), answerHotspot("Answer B: ON", "on", 323, 224, 164, 27), answerHotspot("Answer C: NEXT TO", "next to", 323, 254, 164, 27)] },
  { id: "story-puzzle-question", image: FLOW_ART, alt: "Story Puzzle. Remember the garden page. Where was the bunny? Choose the sentence that says the bunny was behind the bush.", width: 480, height: 288, crop: crop(13, 421, 480, 288), correct: "behind", hotspots: [
    { label: "The bunny is in front of the bush", value: "in front", x: 228, y: 96, width: 232, height: 39, action: "answer" },
    { label: "The bunny is behind the bush", value: "behind", x: 228, y: 138, width: 232, height: 39, action: "answer" },
    { label: "The bunny is under the bush", value: "under", x: 228, y: 180, width: 232, height: 39, action: "answer" },
  ] },
  { id: "story-puzzle-jigsaw", image: FLOW_ART, alt: "Story Puzzle. Rebuild a picture from Princess Prepo's castle journey by selecting all three loose puzzle pieces.", width: 561, height: 288, crop: crop(961, 421, 561, 288), collectCount: 3, hotspots: [
    { label: "Puzzle piece one", value: "piece-1", x: 448, y: 48, width: 104, height: 73, action: "collect" },
    { label: "Puzzle piece two", value: "piece-2", x: 446, y: 126, width: 106, height: 72, action: "collect" },
    { label: "Puzzle piece three", value: "piece-3", x: 444, y: 204, width: 108, height: 72, action: "collect" },
  ] },
  { id: "progress-map", image: FLOW_ART, alt: "Your Progress. Word Scattering, Sentence Reconstruction, Picture Matching, Digital Storybook, Story Questions and Story Puzzle are complete. Open the treasure chest to finish.", width: 889, height: 277, crop: crop(13, 724, 889, 277), hotspots: [{ label: "Open completion treasure chest", x: 720, y: 42, width: 155, height: 186, action: "advance" }] },
  { id: "completion", image: FLOW_ART, alt: "Well Done, Princess! You remembered the story, answered its questions and completed the story puzzle.", width: 606, height: 277, crop: crop(916, 724, 606, 277), hotspots: [
    { label: "Play Again", x: 169, y: 224, width: 117, height: 40, action: "replay" },
    { label: "Back to Map", x: 318, y: 224, width: 127, height: 40, action: "next" },
  ] },
] as const;
