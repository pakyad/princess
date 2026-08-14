"use client";

import Image from "next/image";
import { useEffect, useReducer, useRef, useState } from "react";
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
  const [feedback, setFeedback] = useState<{ label: string; result: "correct" | "wrong"; attempt: number } | null>(null);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scene = scenes[state.sceneIndex];

  useEffect(() => () => {
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
  }, []);

  function changeScene(action: { type: "START" | "REPLAY" | "NEXT" }) {
    setFeedback(null);
    dispatch(action);
  }

  function activate(hotspot: Hotspot) {
    switch (hotspot.action) {
      case "start":
        changeScene({ type: "START" });
        break;
      case "answer":
        if (!hotspot.answer || !scene.correct || feedback?.result === "correct") break;
        if (hotspot.answer !== scene.correct) {
          setFeedback((current) => ({ label: hotspot.label, result: "wrong", attempt: (current?.attempt ?? 0) + 1 }));
          break;
        }
        setFeedback((current) => ({ label: hotspot.label, result: "correct", attempt: (current?.attempt ?? 0) + 1 }));
        transitionTimer.current = setTimeout(() => {
          dispatch({ type: "ANSWER", answer: hotspot.answer!, correct: scene.correct! });
          setFeedback(null);
        }, 500);
        break;
      case "replay":
        changeScene({ type: "REPLAY" });
        break;
      case "next":
        changeScene({ type: "NEXT" });
        break;
    }
  }

  return (
    <main className="exact-game" aria-label="Princess and the Prepo">
      <div
        key={scene.id}
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
            key={`${hotspot.label}-${feedback?.label === hotspot.label ? feedback.attempt : 0}`}
            className={`exact-hotspot${feedback?.label === hotspot.label ? ` is-${feedback.result}` : ""}`}
            type="button"
            aria-label={hotspot.label}
            style={hotspotStyle(hotspot, scene.width, scene.height)}
            onClick={() => activate(hotspot)}
          />
        ))}
        <span key={feedback?.attempt ?? 0} className="sr-only" role="status" aria-live="polite">
          {feedback?.result === "correct" ? "Correct!" : feedback?.result === "wrong" ? "Try again." : ""}
        </span>
      </div>
    </main>
  );
}
