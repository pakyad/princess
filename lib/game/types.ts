export type Answer = "in" | "on" | "under" | "next to" | "over" | "behind";

export type HotspotAction = "start" | "answer" | "advance" | "sequence" | "collect" | "replay" | "next";

export interface Hotspot {
  readonly label: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly action: HotspotAction;
  readonly answer?: Answer;
  readonly value?: string;
}

export interface SceneCrop {
  readonly sourceWidth: number;
  readonly sourceHeight: number;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface SceneDefinition {
  readonly id: string;
  readonly image: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  readonly correct?: string;
  readonly sequence?: readonly string[];
  readonly collectCount?: number;
  readonly crop?: SceneCrop;
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
