import type { GameAction, GameState } from "./types";

export const initialGameState: GameState = {
  sceneIndex: 0, status: "idle", attempts: 0, selected: null,
  completed: [], stars: 0, soundOn: true, teacherOpen: false, practice: false,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START": return { ...state, sceneIndex: 1, status: "question", attempts: 0, selected: null };
    case "ANSWER": {
      if (["animating", "correct", "transitioning"].includes(state.status)) return state;
      if (action.answer !== action.correct) {
        const attempts = state.attempts + 1;
        return { ...state, attempts, selected: action.answer, status: attempts >= 2 ? "hint" : "wrong" };
      }
      const isNew = !state.completed.includes(action.sceneId);
      return {
        ...state, selected: action.answer, status: "animating",
        completed: isNew ? [...state.completed, action.sceneId] : state.completed,
        stars: isNew ? state.stars + 1 : state.stars,
      };
    }
    case "REACTION_FINISHED": return state.status === "animating" ? { ...state, status: "correct" } : state;
    case "CONTINUE": return { ...state, sceneIndex: state.sceneIndex + 1, status: "question", attempts: 0, selected: null, teacherOpen: false };
    case "TOGGLE_SOUND": return { ...state, soundOn: !state.soundOn };
    case "TOGGLE_TEACHER": return { ...state, teacherOpen: !state.teacherOpen };
    case "REPLAY": return { ...initialGameState, soundOn: state.soundOn };
    case "PRACTICE": return { ...initialGameState, sceneIndex: 2, status: "question", soundOn: state.soundOn, practice: true };
    default: return state;
  }
}
