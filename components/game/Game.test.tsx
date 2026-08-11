import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Game } from "./Game";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function settle() {
  act(() => vi.advanceTimersByTime(500));
}

function sceneId() {
  return screen.getByRole("main").querySelector("[data-scene]")?.getAttribute("data-scene");
}

function click(name: string, settleAfter = false) {
  fireEvent.click(screen.getByRole("button", { name }));
  if (settleAfter) settle();
}

function finishWarmup() {
  click("Start Adventure");
  click("Choose UNDER, the preposition", true);
  for (const name of ["Word 1 THE", "Word 2 CAT", "Word 3 IS", "Word 4 UNDER", "Word 5 THE", "Word 6 TABLE", "Word 7 PERIOD"]) click(name);
  settle();
  for (const name of ["Sentence: The cat is under the table", "Sentence: The cat is on the chair", "Sentence: The cat is in the box"]) click(name);
  settle();
}

describe("Princess and the Prepo story-centred learning flow", () => {
  it("runs recognise, reconstruct and picture match before the storybook", () => {
    render(<Game />);
    finishWarmup();
    expect(sceneId()).toBe("storybook-intro");
  });

  it("shows the complete digital storybook before asking any comprehension question", () => {
    render(<Game />);
    finishWarmup();
    click("Begin digital storybook");
    expect(sceneId()).toBe("story-river");

    for (const next of ["story-forest", "story-treasure", "story-gate", "story-bridge", "story-garden", "question-river"]) {
      click("Next story page");
      expect(sceneId()).toBe(next);
    }
  });

  it("asks questions only after the story and in the same narrative order", () => {
    render(<Game />);
    finishWarmup();
    click("Begin digital storybook");
    for (let i = 0; i < 6; i += 1) click("Next story page");

    const answers = [
      ["Answer B: ON", "question-forest"],
      ["Answer B: UNDER", "question-treasure"],
      ["Answer A: IN", "question-gate"],
      ["Answer B: NEXT TO", "question-bridge"],
      ["Answer B: OVER", "question-garden"],
      ["Answer A: IN", "story-puzzle-question"],
    ] as const;

    for (const [answer, nextScene] of answers) {
      click(answer, true);
      expect(sceneId()).toBe(nextScene);
    }
  });

  it("uses only story-based puzzles after comprehension", () => {
    render(<Game />);
    finishWarmup();
    click("Begin digital storybook");
    for (let i = 0; i < 6; i += 1) click("Next story page");
    for (const answer of ["Answer B: ON", "Answer B: UNDER", "Answer A: IN", "Answer B: NEXT TO", "Answer B: OVER", "Answer A: IN"]) click(answer, true);

    expect(sceneId()).toBe("story-puzzle-question");
    click("The bunny is behind the bush", true);
    expect(sceneId()).toBe("story-puzzle-jigsaw");
    click("Puzzle piece one");
    click("Puzzle piece two");
    click("Puzzle piece three");
    settle();
    expect(sceneId()).toBe("progress-map");
  });

  it("finishes with rewards and can restart the learning journey", () => {
    render(<Game />);
    finishWarmup();
    click("Begin digital storybook");
    for (let i = 0; i < 6; i += 1) click("Next story page");
    for (const answer of ["Answer B: ON", "Answer B: UNDER", "Answer A: IN", "Answer B: NEXT TO", "Answer B: OVER", "Answer A: IN"]) click(answer, true);
    click("The bunny is behind the bush", true);
    click("Puzzle piece one");
    click("Puzzle piece two");
    click("Puzzle piece three");
    settle();
    click("Open completion treasure chest");
    expect(sceneId()).toBe("completion");
    click("Play Again");
    expect(sceneId()).toBe("word-scattering");
  });
});
