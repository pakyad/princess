import { scenes } from "./scenes";
import type { GameAction, GameState } from "./types";

export const initialGameState: GameState = { sceneIndex: 0 };

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START":
      return { sceneIndex: 1 };
    case "ANSWER":
      if (action.answer !== action.correct || state.sceneIndex >= scenes.length - 1) return state;
      return { sceneIndex: state.sceneIndex + 1 };
    case "REPLAY":
      return { sceneIndex: 1 };
    case "NEXT":
      return initialGameState;
    default:
      return state;
  }
}
