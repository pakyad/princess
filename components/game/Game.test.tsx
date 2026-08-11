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

describe("Princess and the Prepo complete learning flow", () => {
  it("starts with the locked title artwork and enters Word Scattering", () => {
    render(<Game />);
    expect(sceneId()).toBe("title");
    click("Start Adventure");
    expect(sceneId()).toBe("word-scattering");
    expect(screen.getByRole("button", { name: "Choose UNDER, the preposition" })).toBeInTheDocument();
  });

  it("runs recognise, reconstruct and picture-match activities before the story", () => {
    render(<Game />);
    click("Start Adventure");

    click("Choose THE");
    expect(sceneId()).toBe("word-scattering");
    expect(screen.getByRole("button", { name: "Choose THE" })).toHaveClass("is-wrong");
    click("Choose UNDER, the preposition", true);
    expect(sceneId()).toBe("sentence-reconstruction");

    for (const name of ["Word 1 THE", "Word 2 CAT", "Word 3 IS", "Word 4 UNDER", "Word 5 THE", "Word 6 TABLE", "Word 7 PERIOD"]) click(name);
    settle();
    expect(sceneId()).toBe("picture-matching");

    for (const name of ["Sentence: The cat is under the table", "Sentence: The cat is on the chair", "Sentence: The cat is in the box"]) click(name);
    settle();
    expect(sceneId()).toBe("storybook-intro");
    click("Begin interactive story");
    expect(sceneId()).toBe("river");
  });

  it("keeps all six story comprehension questions in the established order", () => {
    render(<Game />);
    click("Start Adventure");
    click("Choose UNDER, the preposition", true);
    for (const name of ["Word 1 THE", "Word 2 CAT", "Word 3 IS", "Word 4 UNDER", "Word 5 THE", "Word 6 TABLE", "Word 7 PERIOD"]) click(name);
    settle();
    for (const name of ["Sentence: The cat is under the table", "Sentence: The cat is on the chair", "Sentence: The cat is in the box"]) click(name);
    settle();
    click("Begin interactive story");

    const storyAnswers = [
      ["Answer B: ON", "forest"],
      ["Answer B: UNDER", "treasure"],
      ["Answer A: IN", "gate"],
      ["Answer B: NEXT TO", "bridge"],
      ["Answer B: OVER", "garden"],
      ["Answer A: IN", "puzzle-question"],
    ] as const;

    for (const [answer, nextScene] of storyAnswers) {
      click(answer, true);
      expect(sceneId()).toBe(nextScene);
    }
  });

  it("finishes the retention puzzle, progress map and completion screen", () => {
    render(<Game />);
    click("Start Adventure");
    click("Choose UNDER, the preposition", true);
    for (const name of ["Word 1 THE", "Word 2 CAT", "Word 3 IS", "Word 4 UNDER", "Word 5 THE", "Word 6 TABLE", "Word 7 PERIOD"]) click(name);
    settle();
    for (const name of ["Sentence: The cat is under the table", "Sentence: The cat is on the chair", "Sentence: The cat is in the box"]) click(name);
    settle();
    click("Begin interactive story");
    for (const answer of ["Answer B: ON", "Answer B: UNDER", "Answer A: IN", "Answer B: NEXT TO", "Answer B: OVER", "Answer A: IN"]) click(answer, true);

    click("The bunny is behind the bush", true);
    expect(sceneId()).toBe("puzzle-word");
    click("Choose IN", true);
    expect(sceneId()).toBe("puzzle-jigsaw");
    click("Puzzle piece one");
    click("Puzzle piece two");
    click("Puzzle piece three");
    settle();
    expect(sceneId()).toBe("progress-map");
    click("Open completion treasure chest");
    expect(sceneId()).toBe("completion");

    click("Play Again");
    expect(sceneId()).toBe("word-scattering");
  });

  it("uses the generated atlas without reconstructing its artwork in CSS", () => {
    render(<Game />);
    click("Start Adventure");
    const image = document.querySelector("img.exact-atlas");
    expect(image).toHaveAttribute("src", "/exact/learning-flow.png");
    expect(image).toHaveClass("exact-screen", "exact-atlas");
  });
});
