export type Answer = "in" | "on" | "under" | "next to" | "over";

export interface Hotspot {
  readonly label: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly action: "start" | "answer" | "replay" | "next";
  readonly answer?: Answer;
}

export interface SceneDefinition {
  readonly id: string;
  readonly image: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  readonly correct?: Answer;
  readonly hotspots: readonly Hotspot[];
}

export interface GameState {
  readonly sceneIndex: number;
}

export type GameAction =
  | { readonly type: "START" }
  | { readonly type: "ANSWER"; readonly answer: Answer; readonly correct: Answer }
  | { readonly type: "REPLAY" }
  | { readonly type: "NEXT" };
