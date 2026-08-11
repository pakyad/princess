import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Game } from "./Game";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function chooseAnswer(name: string) {
  fireEvent.click(screen.getByRole("button", { name }));
  act(() => vi.advanceTimersByTime(600));
}

function expectOnlyImage(filename: string) {
  const images = screen.getAllByRole("img");
  expect(images).toHaveLength(1);
  expect(images[0]).toHaveAttribute("src", expect.stringContaining(`/exact/${filename}.png`));
}

describe("Game exact-image flow", () => {
  it("renders the title as one image with one empty accessible Start hotspot", () => {
    render(<Game />);
    expectOnlyImage("title");
    const start = screen.getByRole("button", { name: "Start Adventure" });
    expect(start).toHaveTextContent("");
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  it("keeps a wrong answer on the same screen and advances on the correct answer", () => {
    render(<Game />);
    fireEvent.click(screen.getByRole("button", { name: "Start Adventure" }));
    expectOnlyImage("river");
    expect(screen.getAllByRole("button")).toHaveLength(3);
    fireEvent.click(screen.getByRole("button", { name: "Answer A: IN" }));
    const firstWrongAttempt = screen.getByRole("button", { name: "Answer A: IN" });
    expect(firstWrongAttempt).toHaveClass("is-wrong");
    fireEvent.click(firstWrongAttempt);
    expect(screen.getByRole("button", { name: "Answer A: IN" })).not.toBe(firstWrongAttempt);
    expectOnlyImage("river");
    const correct = screen.getByRole("button", { name: "Answer B: ON" });
    fireEvent.click(correct);
    expect(screen.getByRole("button", { name: "Answer B: ON" })).toHaveClass("is-correct");
    expectOnlyImage("river");
    act(() => vi.advanceTimersByTime(600));
    expectOnlyImage("forest");
  });

  it("completes all approved lessons and exposes only Replay and Next at the end", () => {
    render(<Game />);
    fireEvent.click(screen.getByRole("button", { name: "Start Adventure" }));
    for (const answer of ["Answer B: ON", "Answer B: UNDER", "Answer A: IN", "Answer B: NEXT TO", "Answer B: OVER", "Answer A: IN"]) {
      chooseAnswer(answer);
    }
    expectOnlyImage("ending");
    const stage = screen.getByRole("main");
    expect(within(stage).getAllByRole("button").map((button) => button.getAttribute("aria-label"))).toEqual(["Replay", "Next Level"]);
    fireEvent.click(screen.getByRole("button", { name: "Replay" }));
    expectOnlyImage("river");
  });

  it("returns to the title from Next Level", () => {
    render(<Game />);
    fireEvent.click(screen.getByRole("button", { name: "Start Adventure" }));
    for (const answer of ["Answer B: ON", "Answer B: UNDER", "Answer A: IN", "Answer B: NEXT TO", "Answer B: OVER", "Answer A: IN"]) {
      chooseAnswer(answer);
    }
    fireEvent.click(screen.getByRole("button", { name: "Next Level" }));
    expectOnlyImage("title");
  });

  it("scales hotspot geometry from the approved source pixels", () => {
    render(<Game />);
    expect(screen.getByRole("button", { name: "Start Adventure" })).toHaveStyle({
      left: `${(51 / 512) * 100}%`,
      top: `${(202 / 322) * 100}%`,
      width: `${(152 / 512) * 100}%`,
      height: `${(35 / 322) * 100}%`,
    });
  });
});

