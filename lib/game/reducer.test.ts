import { describe, expect, it } from "vitest";
import { gameReducer, initialGameState } from "./reducer";

describe("gameReducer", () => {
  it("starts the adventure", () => {
    expect(gameReducer(initialGameState, { type: "START" })).toMatchObject({ sceneIndex: 1, status: "question" });
  });

  it("preserves progress and adds a hint after repeated wrong answers", () => {
    const first = gameReducer({ ...initialGameState, sceneIndex: 2, status: "question" }, { type: "ANSWER", answer: "in", correct: "on", sceneId: "river" });
    const second = gameReducer(first, { type: "ANSWER", answer: "under", correct: "on", sceneId: "river" });
    expect(first).toMatchObject({ attempts: 1, status: "wrong", stars: 0 });
    expect(second).toMatchObject({ attempts: 2, status: "hint", stars: 0 });
  });

  it("awards one star and blocks duplicate answers during the world reaction", () => {
    const correct = gameReducer({ ...initialGameState, status: "question" }, { type: "ANSWER", answer: "on", correct: "on", sceneId: "river" });
    const duplicate = gameReducer(correct, { type: "ANSWER", answer: "on", correct: "on", sceneId: "river" });
    expect(correct).toMatchObject({ status: "animating", stars: 1, completed: ["river"] });
    expect(duplicate).toBe(correct);
  });

  it("advances without changing rewards", () => {
    const advanced = gameReducer({ ...initialGameState, sceneIndex: 2, status: "correct", stars: 1 }, { type: "CONTINUE" });
    expect(advanced).toMatchObject({ sceneIndex: 3, status: "question", stars: 1, attempts: 0 });
  });

  it("retains sound preference when replaying or practicing", () => {
    const muted = { ...initialGameState, soundOn: false, stars: 4 };
    expect(gameReducer(muted, { type: "REPLAY" })).toMatchObject({ sceneIndex: 0, stars: 0, soundOn: false });
    expect(gameReducer(muted, { type: "PRACTICE" })).toMatchObject({ sceneIndex: 2, practice: true, soundOn: false });
  });

  it("finishes reactions and toggles pupil controls immutably", () => {
    const animating = { ...initialGameState, status: "animating" as const };
    expect(gameReducer(animating, { type: "REACTION_FINISHED" }).status).toBe("correct");
    expect(gameReducer(initialGameState, { type: "REACTION_FINISHED" })).toBe(initialGameState);
    expect(gameReducer(initialGameState, { type: "TOGGLE_SOUND" }).soundOn).toBe(false);
    expect(gameReducer(initialGameState, { type: "TOGGLE_TEACHER" }).teacherOpen).toBe(true);
  });

  it("does not award a completed scene twice", () => {
    const completed = { ...initialGameState, status: "question" as const, completed: ["river"], stars: 1 };
    expect(gameReducer(completed, { type: "ANSWER", answer: "on", correct: "on", sceneId: "river" })).toMatchObject({ stars: 1, completed: ["river"] });
  });
});
