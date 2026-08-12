import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Game } from "./Game";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
beforeEach(() => vi.useFakeTimers());
afterEach(() => { cleanup(); vi.useRealTimers(); });
const settle = () => act(() => vi.advanceTimersByTime(520));
const sceneId = () => screen.getByRole("main").querySelector("[data-scene]")?.getAttribute("data-scene");
const click = (name: string, wait = false) => { fireEvent.click(screen.getByRole("button", { name })); if (wait) settle(); };

function finishWarmup() {
  click("Start Adventure");
  click("Choose UNDER", true);
  for (const name of ["Word THE", "Word PRINCESS", "Word IS", "Word UNDER", "Word THE second", "Word TREE", "Word PERIOD"]) click(name);
  settle();
  for (const name of ["The princess is UNDER the tree", "The princess is ON the stones", "The princess is IN the garden"]) click(name);
  settle();
}

describe("Princess and the Prepo themed learning journey", () => {
  it("starts with the approved title and enters Word Scattering", () => {
    render(<Game />);
    expect(sceneId()).toBe("title");
    click("Start Adventure");
    expect(sceneId()).toBe("word-scattering");
    expect(screen.getByText("WORD SCATTERING")).toBeInTheDocument();
  });

  it("completes the themed warm-up before opening the storybook", () => {
    render(<Game />);
    finishWarmup();
    expect(sceneId()).toBe("storybook-intro");
    expect(screen.getByText("DIGITAL STORYBOOK")).toBeInTheDocument();
  });

  it("shows all nine story pages before questions", () => {
    render(<Game />);
    finishWarmup();
    click("Begin digital storybook");
    expect(sceneId()).toBe("story-1");
    for (let page = 2; page <= 9; page += 1) { click("Next story page"); expect(sceneId()).toBe(`story-${page}`); }
    click("Next story page");
    expect(sceneId()).toBe("q1");
  });

  it("answers the eight story questions and enters the puzzle", () => {
    render(<Game />);
    finishWarmup();
    click("Begin digital storybook");
    for (let i = 0; i < 9; i += 1) click("Next story page");
    for (const answer of ["Answer in","Answer over","Answer on","Answer in front of","Answer between","Answer behind","Answer next to","Answer at"]) click(answer, true);
    expect(sceneId()).toBe("story-puzzle");
  });

  it("finishes the story puzzle and can replay", () => {
    render(<Game />);
    finishWarmup();
    click("Begin digital storybook");
    for (let i = 0; i < 9; i += 1) click("Next story page");
    for (const answer of ["Answer in","Answer over","Answer on","Answer in front of","Answer between","Answer behind","Answer next to","Answer at"]) click(answer, true);
    for (const value of ["in","over","on","by","in front of","between","behind","next to","at"]) click(`Puzzle ${value}`);
    settle();
    expect(sceneId()).toBe("completion");
    click("Play Again");
    expect(sceneId()).toBe("word-scattering");
  });
});
