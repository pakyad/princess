"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { scenes } from "@/lib/game/scenes";
import type { Hotspot, SceneCrop } from "@/lib/game/types";

function hotspotStyle(hotspot: Hotspot, screenWidth: number, screenHeight: number): CSSProperties {
  return {
    left: `${(hotspot.x / screenWidth) * 100}%`,
    top: `${(hotspot.y / screenHeight) * 100}%`,
    width: `${(hotspot.width / screenWidth) * 100}%`,
    height: `${(hotspot.height / screenHeight) * 100}%`,
  };
}

function cropStyle(crop: SceneCrop): CSSProperties {
  return {
    width: `${(crop.sourceWidth / crop.width) * 100}%`,
    height: `${(crop.sourceHeight / crop.height) * 100}%`,
    left: `${(-crop.x / crop.width) * 100}%`,
    top: `${(-crop.y / crop.height) * 100}%`,
  };
}

type Feedback = { label: string; result: "correct" | "wrong"; attempt: number } | null;

export function Game() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [collected, setCollected] = useState<ReadonlySet<string>>(new Set());
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitioning = useRef(false);
  const scene = scenes[sceneIndex];

  const selectedValues = useMemo(() => collected, [collected]);

  useEffect(() => () => {
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
  }, []);

  function resetInteractionState() {
    transitioning.current = false;
    setFeedback(null);
    setSequenceIndex(0);
    setCollected(new Set());
  }

  function goTo(index: number) {
    resetInteractionState();
    setSceneIndex(Math.max(0, Math.min(index, scenes.length - 1)));
  }

  function advance() {
    goTo(sceneIndex + 1);
  }

  function finishCorrect(label: string) {
    transitioning.current = true;
    setFeedback((current) => ({ label, result: "correct", attempt: (current?.attempt ?? 0) + 1 }));
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    transitionTimer.current = setTimeout(advance, 450);
  }

  function markWrong(label: string) {
    setFeedback((current) => ({ label, result: "wrong", attempt: (current?.attempt ?? 0) + 1 }));
  }

  function activate(hotspot: Hotspot) {
    if (transitioning.current) return;

    switch (hotspot.action) {
      case "start":
      case "advance":
        advance();
        break;
      case "answer": {
        const value = hotspot.value ?? hotspot.answer;
        if (!value || !scene.correct) return;
        if (value === scene.correct) finishCorrect(hotspot.label);
        else markWrong(hotspot.label);
        break;
      }
      case "sequence": {
        if (!hotspot.value || !scene.sequence?.length) return;
        const expected = scene.sequence[sequenceIndex];
        if (hotspot.value !== expected) {
          setSequenceIndex(0);
          markWrong(hotspot.label);
          return;
        }
        const nextIndex = sequenceIndex + 1;
        setFeedback((current) => ({ label: hotspot.label, result: "correct", attempt: (current?.attempt ?? 0) + 1 }));
        if (nextIndex >= scene.sequence.length) finishCorrect(hotspot.label);
        else setSequenceIndex(nextIndex);
        break;
      }
      case "collect": {
        if (!hotspot.value || selectedValues.has(hotspot.value)) return;
        const next = new Set(collected);
        next.add(hotspot.value);
        setCollected(next);
        setFeedback((current) => ({ label: hotspot.label, result: "correct", attempt: (current?.attempt ?? 0) + 1 }));
        if (next.size >= (scene.collectCount ?? 1)) finishCorrect(hotspot.label);
        break;
      }
      case "replay":
        goTo(1);
        break;
      case "next":
        goTo(0);
        break;
    }
  }

  return (
    <main className="exact-game" aria-label="Princess and the Prepo">
      <div
        className="exact-screen-frame"
        data-scene={scene.id}
        style={{ "--screen-ratio": scene.width / scene.height } as CSSProperties}
      >
        <div className="exact-art-clip" aria-hidden="true">
          <img
            className={`exact-screen${scene.crop ? " exact-atlas" : ""}`}
            src={scene.image}
            alt=""
            draggable={false}
            style={scene.crop ? cropStyle(scene.crop) : undefined}
          />
        </div>
        <span className="sr-only">{scene.alt}</span>
        {scene.hotspots.map((hotspot) => {
          const isCollected = hotspot.value ? selectedValues.has(hotspot.value) : false;
          const isFeedbackTarget = feedback?.label === hotspot.label;
          const stateClass = isCollected || (isFeedbackTarget && feedback?.result === "correct")
            ? " is-correct"
            : isFeedbackTarget && feedback?.result === "wrong"
              ? " is-wrong"
              : "";
          return (
            <button
              key={`${hotspot.label}-${isFeedbackTarget ? feedback?.attempt : 0}`}
              className={`exact-hotspot${stateClass}`}
              type="button"
              aria-label={hotspot.label}
              aria-pressed={hotspot.action === "collect" ? isCollected : undefined}
              style={hotspotStyle(hotspot, scene.width, scene.height)}
              onClick={() => activate(hotspot)}
            />
          );
        })}
        <span key={feedback?.attempt ?? 0} className="sr-only" role="status" aria-live="polite">
          {feedback?.result === "correct" ? "Correct!" : feedback?.result === "wrong" ? "Try again." : ""}
        </span>
      </div>
    </main>
  );
}
