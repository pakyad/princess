import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Game } from "./Game";

afterEach(cleanup);

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
    expectOnlyImage("river");
    fireEvent.click(screen.getByRole("button", { name: "Answer B: ON" }));
    expectOnlyImage("forest");
  });

  it("completes all approved lessons and exposes only Replay and Next at the end", () => {
    render(<Game />);
    fireEvent.click(screen.getByRole("button", { name: "Start Adventure" }));
    for (const answer of ["Answer B: ON", "Answer B: UNDER", "Answer A: IN", "Answer B: NEXT TO", "Answer B: OVER", "Answer A: IN"]) {
      fireEvent.click(screen.getByRole("button", { name: answer }));
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
      fireEvent.click(screen.getByRole("button", { name: answer }));
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
