"use client";

import Image from "next/image";
import { useReducer } from "react";
import { gameReducer, initialGameState } from "@/lib/game/reducer";
import { scenes } from "@/lib/game/scenes";
import type { Hotspot } from "@/lib/game/types";

function hotspotStyle(hotspot: Hotspot, screenWidth: number, screenHeight: number) {
  return {
    left: `${(hotspot.x / screenWidth) * 100}%`,
    top: `${(hotspot.y / screenHeight) * 100}%`,
    width: `${(hotspot.width / screenWidth) * 100}%`,
    height: `${(hotspot.height / screenHeight) * 100}%`,
  };
}

export function Game() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const scene = scenes[state.sceneIndex];

  function activate(hotspot: Hotspot) {
    switch (hotspot.action) {
      case "start":
        dispatch({ type: "START" });
        break;
      case "answer":
        if (hotspot.answer && scene.correct) dispatch({ type: "ANSWER", answer: hotspot.answer, correct: scene.correct });
        break;
      case "replay":
        dispatch({ type: "REPLAY" });
        break;
      case "next":
        dispatch({ type: "NEXT" });
        break;
    }
  }

  return (
    <main className="exact-game" aria-label="Princess and the Prepo">
      <div
        className="exact-screen-frame"
        style={{ "--screen-ratio": scene.width / scene.height } as React.CSSProperties}
      >
        <Image
          className="exact-screen"
          src={scene.image}
          alt={scene.alt}
          width={scene.width}
          height={scene.height}
          priority
          unoptimized
        />
        {scene.hotspots.map((hotspot) => (
          <button
            key={hotspot.label}
            className="exact-hotspot"
            type="button"
            aria-label={hotspot.label}
            style={hotspotStyle(hotspot, scene.width, scene.height)}
            onClick={() => activate(hotspot)}
          />
        ))}
      </div>
    </main>
  );
}
