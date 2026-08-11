import { describe, expect, it } from "vitest";
import { gameReducer, initialGameState } from "./reducer";

describe("gameReducer", () => {
  it("starts on the river and resets from either ending action", () => {
    expect(gameReducer(initialGameState, { type: "START" })).toEqual({ sceneIndex: 1 });
    expect(gameReducer({ sceneIndex: 7 }, { type: "REPLAY" })).toEqual({ sceneIndex: 1 });
    expect(gameReducer({ sceneIndex: 7 }, { type: "NEXT" })).toEqual(initialGameState);
  });

  it("advances only when the selected answer is correct", () => {
    expect(gameReducer({ sceneIndex: 1 }, { type: "ANSWER", answer: "in", correct: "on" })).toEqual({ sceneIndex: 1 });
    expect(gameReducer({ sceneIndex: 1 }, { type: "ANSWER", answer: "on", correct: "on" })).toEqual({ sceneIndex: 2 });
  });

  it("never advances beyond the ending screen", () => {
    expect(gameReducer({ sceneIndex: 7 }, { type: "ANSWER", answer: "in", correct: "in" })).toEqual({ sceneIndex: 7 });
  });
});
