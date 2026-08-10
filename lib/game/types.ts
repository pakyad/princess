export type GameStatus = "idle" | "question" | "wrong" | "hint" | "correct" | "animating" | "complete" | "transitioning";
export type Interaction = "intro" | "choice" | "drag" | "builder" | "hybrid" | "ending";

export interface Choice { id: string; label: string }
export interface SceneDefinition {
  id: string;
  chapter: string;
  interaction: Interaction;
  objective: string;
  question?: string;
  choices?: Choice[];
  correct?: string;
  sentence?: string;
  wrong?: string;
  hint?: string;
  oralPrompt?: string;
  physicalPrompt?: string;
  theme: string;
}

export interface GameState {
  sceneIndex: number;
  status: GameStatus;
  attempts: number;
  selected: string | null;
  completed: readonly string[];
  stars: number;
  soundOn: boolean;
  teacherOpen: boolean;
  practice: boolean;
}

export type GameAction =
  | { type: "START" }
  | { type: "ANSWER"; answer: string; correct: string; sceneId: string }
  | { type: "REACTION_FINISHED" }
  | { type: "CONTINUE" }
  | { type: "TOGGLE_SOUND" }
  | { type: "TOGGLE_TEACHER" }
  | { type: "REPLAY" }
  | { type: "PRACTICE" };
