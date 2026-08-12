import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Game } from "./Game";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
beforeEach(() => vi.useFakeTimers());
afterEach(() => { cleanup(); vi.useRealTimers(); });
const settle = () => act(() => vi.advanceTimersByTime(650));
const sceneId = () => screen.getByRole("main").querySelector("[data-scene]")?.getAttribute("data-scene");
const click = (name: string, wait = false) => { fireEvent.click(screen.getByRole("button", { name })); if (wait) settle(); };

function finishWarmup() {
  click("Begin the Adventure");
  click("Choose UNDER", true);
  for (const name of ["Word THE", "Word PRINCESS", "Word IS", "Word UNDER", "Word THE second", "Word TREE", "Word PERIOD"]) click(name);
  click("Check sentence", true);
  for (const name of ["The princess is UNDER the tree", "The princess is ON the stones", "The princess is IN the garden"]) click(name);
  settle();
}

describe("Princess learning journey", () => {
  it("starts with Princess and enters discovery", () => {
    render(<Game />);
    expect(sceneId()).toBe("title");
    expect(screen.getByText("PRINCESS")).toBeInTheDocument();
    click("Begin the Adventure");
    expect(sceneId()).toBe("word-scattering");
    expect(screen.getByText("FIND THE MAGIC WORD")).toBeInTheDocument();
  });

  it("supports sentence building and undo before checking", () => {
    render(<Game />); click("Begin the Adventure"); click("Choose UNDER", true);
    click("Word THE"); click("Word PRINCESS");
    click("Remove PRINCESS");
    expect(screen.getByRole("button", { name: "Word PRINCESS" })).not.toBeDisabled();
  });

  it("completes the warm-up before opening the storybook", () => {
    render(<Game />); finishWarmup();
    expect(sceneId()).toBe("storybook-intro");
    expect(screen.getByText("THE STORYBOOK")).toBeInTheDocument();
  });

  it("shows all nine story pages before recall", () => {
    render(<Game />); finishWarmup(); click("Open Storybook");
    expect(sceneId()).toBe("story-1");
    for (let page = 2; page <= 9; page += 1) { click("Next story page"); expect(sceneId()).toBe(`story-${page}`); }
    click("Next story page"); expect(sceneId()).toBe("q1");
  });

  it("tests all nine story prepositions including BY", () => {
    render(<Game />); finishWarmup(); click("Open Storybook");
    for (let i = 0; i < 9; i += 1) click("Next story page");
    for (const answer of ["Answer in","Answer over","Answer on","Answer by","Answer in front of","Answer between","Answer behind","Answer next to","Answer at"]) click(answer, true);
    expect(sceneId()).toBe("story-puzzle");
  });

  it("finishes the final trail and can reopen the story", () => {
    render(<Game />); finishWarmup(); click("Open Storybook");
    for (let i = 0; i < 9; i += 1) click("Next story page");
    for (const answer of ["Answer in","Answer over","Answer on","Answer by","Answer in front of","Answer between","Answer behind","Answer next to","Answer at"]) click(answer, true);
    for (const value of ["in","over","on","by","in front of","between","behind","next to","at"]) click(`Puzzle ${value}`);
    settle(); expect(sceneId()).toBe("completion");
    click("Read the Story Again"); expect(sceneId()).toBe("story-1");
  });
});
