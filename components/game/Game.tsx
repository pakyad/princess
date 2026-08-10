"use client";

import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { speak } from "@/lib/audio/speech";
import { gameReducer, initialGameState } from "@/lib/game/reducer";
import { scenes } from "@/lib/game/scenes";
import type { GameState, SceneDefinition } from "@/lib/game/types";

const LETTERS = "ABCD";
const BUILDER_WORDS = ["under", "The princess", "the bridge", "is"];
const CORRECT_BUILDER = ["The princess", "is", "under", "the bridge"];

function Princess({ scene, moving, dragging = false }: { scene: SceneDefinition; moving: boolean; dragging?: boolean }) {
  return <div className={`princess princess--${scene.theme} ${moving ? "is-moving" : ""} ${dragging ? "is-dragging" : ""}`} aria-label="Princess Prepo">
    <div className="crown" /><div className="hair" /><div className="face"><i /><b /></div>
    <div className="body"><span className="sleeve left" /><span className="sleeve right" /></div><div className="skirt" />
  </div>;
}

function Parchment({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`parchment ${className}`}>{children}</section>;
}

function TeacherPanel({ scene, onSkip }: { scene: SceneDefinition; onSkip: () => void }) {
  return <aside className="teacher-panel" aria-label="Teacher mode">
    <h3>Teacher Notes</h3><p><strong>Objective:</strong> {scene.objective}</p>
    {scene.correct && <p><strong>Answer:</strong> {scene.correct.toUpperCase()}</p>}
    <p><strong>Hands-on:</strong> {scene.physicalPrompt ?? "Invite the pupil to model the sentence with the physical kit."}</p>
    <p><strong>Ask:</strong> {scene.oralPrompt ?? "Can you say a sentence using this preposition?"}</p>
    <button className="small-button" onClick={onSkip}>Skip scene</button>
  </aside>;
}

function SceneObjects({ scene, success }: { scene: SceneDefinition; success: boolean }) {
  return <div className={`scene-objects objects--${scene.theme} ${success ? "is-success" : ""}`} aria-hidden="true">
    {scene.id === "forest" && <><div className="fallen-tree" /><div className="fireflies" /></>}
    {scene.id === "treasure" && <div className="chest"><div className="chest-lid" /><div className="key" /></div>}
    {scene.id === "gate" && <><div className="statue" /><div className="gate" /></>}
    {scene.id.includes("bridge") || scene.id === "builder" ? <div className="magic-bridge" /> : null}
    {scene.id === "final" && <div className="final-tree" />}
    {scene.id === "ending" && <div className="celebration-rays" />}
  </div>;
}

export function Game() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const [built, setBuilt] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const reactionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scene = scenes[Math.min(state.sceneIndex, scenes.length - 1)];
  const success = state.status === "animating" || state.status === "correct";
  const isTitle = scene.id === "title";

  const narration = useMemo(() => state.status === "correct" && scene.sentence ? scene.sentence : (scene.question ?? scene.objective), [scene, state.status]);
  useEffect(() => () => { if (reactionTimer.current) clearTimeout(reactionTimer.current); }, []);

  function answer(value: string) {
    if (!scene.correct) return;
    const correct = value === scene.correct;
    dispatch({ type: "ANSWER", answer: value, correct: scene.correct, sceneId: scene.id });
    if (correct) {
      speak(scene.sentence ?? "Wonderful!", state.soundOn);
      reactionTimer.current = setTimeout(() => dispatch({ type: "REACTION_FINISHED" }), 1450);
    } else speak(state.attempts > 0 ? (scene.hint ?? "Try again.") : (scene.wrong ?? "Try again."), state.soundOn);
  }

  function continueScene() { setBuilt([]); dispatch({ type: "CONTINUE" }); }
  function completeBuilder() {
    const next = CORRECT_BUILDER.find((word) => !built.includes(word));
    if (!next) return;
    const updated = [...built, next]; setBuilt(updated);
    if (updated.length === BUILDER_WORDS.length) answer(updated.map((word) => word.toLowerCase()).join("|"));
  }

  const feedback = state.status === "wrong" ? scene.wrong : state.status === "hint" ? scene.hint : state.status === "correct" ? scene.sentence : null;

  return <main className={`game-stage theme--${scene.theme} status--${state.status}`}>
    <div className="environment" /><div className="mist" /><SceneObjects scene={scene} success={success} />
    <header className="world-controls">
      <button aria-label={state.soundOn ? "Turn sound off" : "Turn sound on"} onClick={() => dispatch({ type: "TOGGLE_SOUND" })}>{state.soundOn ? "Sound On" : "Sound Off"}</button>
      {!isTitle && <button onClick={() => dispatch({ type: "TOGGLE_TEACHER" })}>Teacher</button>}
      {!isTitle && <div className="reward" aria-label={`${state.stars} stars earned`}><span className="reward-icon" aria-hidden="true" /> {state.stars}</div>}
    </header>

    <div className="world-left">
      {!isTitle && <Parchment className="story-panel"><span className="eyebrow">{scene.chapter}</span><p>{scene.objective}</p><button className="narrate" onClick={() => speak(narration, state.soundOn)}>Replay narration</button></Parchment>}
      <Princess scene={scene} moving={success} dragging={dragging} />
      {feedback && <Parchment className={`feedback feedback--${state.status}`}><div role="status" aria-live="polite" aria-atomic="true"><strong>{state.status === "correct" ? "Wonderful!" : "Oops!"}</strong><p>{feedback}</p></div></Parchment>}
    </div>

    {isTitle ? <div className="title-card"><span className="sparkle" aria-hidden="true" /><h1>Princess <small>and the</small> Prepo</h1><p>{scene.objective}</p><button className="primary-button" onClick={() => { dispatch({ type: "START" }); speak(scenes[1].objective, state.soundOn); }}>Start Adventure</button></div> : <ActivityPanel scene={scene} state={state} built={built} answer={answer} setBuilt={setBuilt} completeBuilder={completeBuilder} continueScene={continueScene} dragging={dragging} setDragging={setDragging} replay={() => dispatch({ type: "REPLAY" })} practice={() => dispatch({ type: "PRACTICE" })} />}

    {state.teacherOpen && <TeacherPanel scene={scene} onSkip={continueScene} />}
  </main>;
}

function ActivityPanel({ scene, state, built, answer, setBuilt, completeBuilder, continueScene, dragging, setDragging, replay, practice }: {
  scene: SceneDefinition; state: GameState; built: string[]; answer: (value: string) => void;
  setBuilt: React.Dispatch<React.SetStateAction<string[]>>; completeBuilder: () => void; continueScene: () => void; dragging: boolean; setDragging: (value: boolean) => void; replay: () => void; practice: () => void;
}) {
  const [dragPosition, setDragPosition] = useState({ x: 16, y: 220 });
  if (scene.id === "intro") return <Parchment className="question-panel intro-panel"><div className="ribbon">Story</div><h2>Four magic words</h2><div className="word-gems"><b>IN</b><b>ON</b><b>UNDER</b><b>NEXT TO</b></div><button className="primary-button" onClick={continueScene}>Follow the path</button></Parchment>;
  if (scene.interaction === "hybrid") return <Parchment className="question-panel"><div className="ribbon">Hands-On Challenge</div><h2>{scene.objective}</h2><div className="kit-scene"><div className="kit-bridge" /><div className="kit-piece" /></div><button className="primary-button" onClick={continueScene}>Done — Continue Adventure</button><button className="text-button" onClick={continueScene}>Skip</button></Parchment>;
  if (scene.interaction === "ending") return <Parchment className="question-panel ending-panel"><div className="ribbon">Adventure Complete!</div><h2>Great job!</h2><div className="big-crown" aria-label="Golden crown reward" /><p>You earned <strong>{state.stars} golden stars</strong>.</p><div className="word-gems learned"><b>IN</b><b>ON</b><b>UNDER</b><b>NEXT TO</b></div><button className="primary-button" onClick={replay}>Play Again</button><button className="secondary-button" onClick={practice}>Practice Again</button></Parchment>;
  if (scene.interaction === "drag") return <Parchment className="question-panel"><div className="ribbon">Move Princess</div><h2>{scene.question}</h2><div className="drag-board" onPointerMove={(event) => { if (!dragging) return; const bounds = event.currentTarget.getBoundingClientRect(); setDragPosition({ x: Math.max(8, Math.min(event.clientX - bounds.left - 45, bounds.width - 105)), y: Math.max(60, Math.min(event.clientY - bounds.top - 28, bounds.height - 70)) }); }} onPointerUp={(event) => { if (dragging) { const bounds = event.currentTarget.getBoundingClientRect(); const isBesideStatue = event.clientX - bounds.left > bounds.width * .54 && event.clientY - bounds.top > bounds.height * .42; answer(isBesideStatue ? "next" : "not-next"); } setDragging(false); }}><button className="drag-princess" style={{ left: dragPosition.x, top: dragPosition.y }} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); setDragging(true); }} onKeyDown={(e) => { if (["Enter", " "].includes(e.key)) answer("next"); }} aria-label="Move Princess next to the statue"><span className="mini-crown" aria-hidden="true" />Princess</button><button className="drop-zone" onClick={() => answer("next")}>Glowing spot beside statue</button></div>{state.status === "correct" && <button className="primary-button" onClick={continueScene}>Continue</button>}</Parchment>;
  if (scene.interaction === "builder") return <Parchment className="question-panel"><div className="ribbon">Magic Spell</div><h2>{scene.question}</h2><div className="sentence-tray">{built.length ? built.map((word) => <button key={word} onClick={() => setBuilt(built.filter((item) => item !== word))}>{word}</button>) : <span>Place the words here…</span>}</div><div className="word-bank">{BUILDER_WORDS.filter((word) => !built.includes(word)).map((word) => <button key={word} onClick={() => { const updated = [...built, word]; setBuilt(updated); if (updated.length === 4) answer(updated.map((item) => item.toLowerCase()).join("|")); }}>{word}</button>)}</div>{built.length < 4 && <button className="text-button" onClick={completeBuilder}>Tap-to-place hint</button>}{state.status === "correct" && <button className="primary-button" onClick={continueScene}>Continue</button>}</Parchment>;
  return <Parchment className="question-panel"><div className="ribbon">Question</div><h2>{scene.question}</h2><div className={`picture-window picture--${scene.theme}`} aria-hidden="true"><Princess scene={scene} moving={false} /></div><div className="answers">{scene.choices?.map((choice, index) => <button key={choice.id} className={`${state.selected === choice.id ? "is-selected" : ""} ${state.status === "correct" && choice.id === scene.correct ? "is-correct" : ""}`} onClick={() => answer(choice.id)} disabled={state.status === "animating" || state.status === "correct"}><span>{LETTERS[index]}</span>{choice.label}</button>)}</div>{state.status === "correct" && <button className="primary-button continue" onClick={continueScene}>Continue Adventure</button>}</Parchment>;
}
