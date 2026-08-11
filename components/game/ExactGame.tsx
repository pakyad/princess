"use client";

import { useState } from "react";
import { PAINTED_MOCKUP } from "@/lib/art/painted";

type Screen = "title" | "river" | "forest" | "treasure" | "gate" | "bridge" | "garden" | "ending";

const ORDER: Screen[] = ["title", "river", "forest", "treasure", "gate", "bridge", "garden", "ending"];

// Exact panel rectangles measured from the approved 1536×1024 design board.
const PANELS: Record<Screen, { x: number; y: number; w: number; h: number }> = {
  title:    { x: 8,    y: 84,  w: 512, h: 320 },
  river:    { x: 526,  y: 84,  w: 490, h: 320 },
  forest:   { x: 1023, y: 84,  w: 496, h: 320 },
  treasure: { x: 8,    y: 412, w: 512, h: 303 },
  gate:     { x: 526,  y: 412, w: 490, h: 303 },
  bridge:   { x: 1023, y: 412, w: 496, h: 303 },
  garden:   { x: 8,    y: 723, w: 512, h: 294 },
  ending:   { x: 526,  y: 723, w: 419, h: 294 },
};

const CORRECT: Partial<Record<Screen, number>> = {
  river: 1,
  forest: 1,
  treasure: 0,
  gate: 1,
  bridge: 1,
  garden: 0,
};

export function ExactGame() {
  const [index, setIndex] = useState(0);
  const [wrong, setWrong] = useState<number | null>(null);
  const screen = ORDER[index];
  const panel = PANELS[screen];
  const scaleX = 1536 / panel.w;
  const scaleY = 1024 / panel.h;

  const advance = () => {
    setWrong(null);
    setIndex((i) => Math.min(i + 1, ORDER.length - 1));
  };

  const answer = (choice: number) => {
    if (CORRECT[screen] === choice) advance();
    else {
      setWrong(choice);
      window.setTimeout(() => setWrong(null), 650);
    }
  };

  const style = {
    "--panel-x": `${panel.x}px`,
    "--panel-y": `${panel.y}px`,
    "--panel-w": `${panel.w}px`,
    "--panel-h": `${panel.h}px`,
    "--atlas-w": `${1536 * (1 / scaleX)}px`,
    "--atlas-h": `${1024 * (1 / scaleY)}px`,
    "--atlas-x": `${-panel.x * (1 / scaleX)}px`,
    "--atlas-y": `${-panel.y * (1 / scaleY)}px`,
  } as React.CSSProperties;

  return (
    <main className="exact-shell">
      <section className={`exact-screen exact-${screen}`} style={style} aria-label={`Princess and the Prepo: ${screen}`}>
        <img
          className="exact-art"
          src={PAINTED_MOCKUP}
          alt=""
          draggable={false}
          style={{
            width: `${1536 / scaleX}px`,
            height: `${1024 / scaleY}px`,
            left: `${-panel.x / scaleX}px`,
            top: `${-panel.y / scaleY}px`,
          }}
        />

        {screen === "title" && <button className="hotspot start" onClick={advance} aria-label="Start Adventure" />}

        {screen !== "title" && screen !== "ending" && (
          <div className="answer-hotspots" aria-label="Answer choices">
            {[0, 1, 2].map((choice) => (
              <button
                key={choice}
                className={`hotspot answer answer-${choice} ${wrong === choice ? "wrong" : ""}`}
                onClick={() => answer(choice)}
                aria-label={`Answer ${String.fromCharCode(65 + choice)}`}
              />
            ))}
          </div>
        )}

        {screen === "ending" && (
          <>
            <button className="hotspot replay" onClick={() => { setWrong(null); setIndex(0); }} aria-label="Replay adventure" />
            <button className="hotspot next-level" onClick={() => { setWrong(null); setIndex(0); }} aria-label="Start again" />
          </>
        )}
      </section>
      <p className="sr-only" aria-live="polite">{wrong !== null ? "Try again." : ""}</p>
    </main>
  );
}
