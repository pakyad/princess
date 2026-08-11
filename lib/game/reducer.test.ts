import { describe, expect, it } from "vitest";
import { scenes } from "./scenes";
import { gameReducer, initialGameState } from "./reducer";

describe("gameReducer", () => {
  it("starts at the first activity and resets from either ending action", () => {
    expect(gameReducer(initialGameState, { type: "START" })).toEqual({ sceneIndex: 1 });
    expect(gameReducer({ sceneIndex: scenes.length - 1 }, { type: "REPLAY" })).toEqual({ sceneIndex: 1 });
    expect(gameReducer({ sceneIndex: scenes.length - 1 }, { type: "NEXT" })).toEqual(initialGameState);
  });

  it("advances only when the selected answer is correct", () => {
    expect(gameReducer({ sceneIndex: 5 }, { type: "ANSWER", answer: "in", correct: "on" })).toEqual({ sceneIndex: 5 });
    expect(gameReducer({ sceneIndex: 5 }, { type: "ANSWER", answer: "on", correct: "on" })).toEqual({ sceneIndex: 6 });
  });

  it("never advances beyond the final completion screen", () => {
    const final = scenes.length - 1;
    expect(gameReducer({ sceneIndex: final }, { type: "ANSWER", answer: "in", correct: "in" })).toEqual({ sceneIndex: final });
  });
});
