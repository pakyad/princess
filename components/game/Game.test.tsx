import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Game } from "./Game";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
beforeEach(() => vi.useFakeTimers());
afterEach(() => { cleanup(); vi.useRealTimers(); });
const settle = () => act(() => vi.advanceTimersByTime(850));
const sceneId = () => screen.getByRole("main").querySelector("[data-scene]")?.getAttribute("data-scene");
const click = (name: string, wait = false) => { fireEvent.click(screen.getByRole("button", { name })); if (wait) settle(); };

function openBook() {
  click("Begin the Adventure");
  click("Let's Try");
  click("Open Storybook");
}

function finishStoryAndQuestions() {
  openBook();
  for (let page = 1; page < 9; page += 1) click("Next story page");
  click("Start Questions");
  for (const answer of ["Answer in", "Answer over", "Answer on", "Answer by", "Answer in front of", "Answer between", "Answer behind", "Answer next to", "Answer at"]) click(answer, true);
}

describe("Princess storybook learning journey", () => {
  it("starts with the title and shows the simple discover lesson", () => {
    render(<Game />);
    expect(sceneId()).toBe("title");
    click("Begin the Adventure");
    expect(sceneId()).toBe("discover");
    expect(screen.getByText("Where is she?")).toBeInTheDocument();
    expect(screen.getByText("PREPOSITIONS.")).toBeInTheDocument();
  });

  it("opens a real storybook with backward and forward navigation", () => {
    render(<Game />);
    openBook();
    expect(sceneId()).toBe("story-1");
    expect(screen.getByRole("button", { name: "Previous story page" })).toBeDisabled();
    click("Next story page");
    expect(sceneId()).toBe("story-2");
    click("Previous story page");
    expect(sceneId()).toBe("story-1");
  });

  it("shows all nine story pages before questions", () => {
    render(<Game />);
    openBook();
    for (let page = 2; page <= 9; page += 1) {
      click("Next story page");
      expect(sceneId()).toBe(`story-${page}`);
    }
    click("Start Questions");
    expect(sceneId()).toBe("q1");
  });

  it("keeps a wrong recall answer on the same question", () => {
    render(<Game />);
    openBook();
    for (let page = 1; page < 9; page += 1) click("Next story page");
    click("Start Questions");
    click("Answer on");
    expect(sceneId()).toBe("q1");
    expect(screen.getByText(/Think back to that part/)).toBeInTheDocument();
    click("Answer in", true);
    expect(sceneId()).toBe("q2");
  });

  it("tests every uploaded-story preposition including BY", () => {
    render(<Game />);
    finishStoryAndQuestions();
    expect(sceneId()).toBe("story-puzzle");
  });

  it("finishes the puzzle and can reopen the story", () => {
    render(<Game />);
    finishStoryAndQuestions();
    for (const value of ["in", "over", "on", "by", "in front of", "between", "behind", "next to", "at"]) click(`Puzzle ${value}`);
    settle();
    expect(sceneId()).toBe("completion");
    click("Read the Story Again");
    expect(sceneId()).toBe("story-1");
  });
});
