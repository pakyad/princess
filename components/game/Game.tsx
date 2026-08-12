"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { scenes } from "@/lib/game/scenes";
import type { Hotspot } from "@/lib/game/types";

type Feedback = { label: string; result: "correct" | "wrong"; attempt: number } | null;

const pretty = (value?: string) => !value ? "" : value.toUpperCase();
const storyStart = scenes.findIndex((scene) => scene.id === "story-1");
const storyEnd = scenes.findIndex((scene) => scene.id === "story-9");
const questionStart = scenes.findIndex((scene) => scene.id === "q1");

function StoryText({ text, preposition }: { text: string; preposition: string }) {
  const index = text.toLowerCase().indexOf(preposition.toLowerCase());
  if (index < 0) return <>{text}</>;
  return <>{text.slice(0, index)}<strong className="learn-word">{text.slice(index, index + preposition.length)}</strong>{text.slice(index + preposition.length)}</>;
}

function Frame({ stage, sceneImage, soundOn, onSound, children }: { stage: string; sceneImage?: string; soundOn: boolean; onSound: () => void; children: ReactNode }) {
  return <div className="lesson-frame" style={{ "--scene-image": `url(${sceneImage ?? "/exact/title.png"})` } as CSSProperties}>
    <div className="lesson-shade" />
    <div className="stage-pill">{stage}</div>
    <button className="sound-button" aria-label={soundOn ? "Turn sound off" : "Turn sound on"} onClick={onSound}>{soundOn ? "🔊" : "🔇"}</button>
    {children}
  </div>;
}

export function Game() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const locked = useRef(false);
  const scene = scenes[sceneIndex];

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const questionNumber = useMemo(() => scene.id.startsWith("q") ? Number(scene.id.slice(1)) : 0, [scene.id]);

  function resetInteraction() {
    locked.current = false;
    setFeedback(null);
    setPuzzleIndex(0);
  }

  function goTo(index: number) {
    resetInteraction();
    setSceneIndex(Math.max(0, Math.min(index, scenes.length - 1)));
  }

  function next() { goTo(sceneIndex + 1); }

  function speak(text?: string) {
    if (!soundOn || !text || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
  }

  function finishCorrect(label: string) {
    locked.current = true;
    setFeedback((current) => ({ label, result: "correct", attempt: (current?.attempt ?? 0) + 1 }));
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(next, 700);
  }

  function markWrong(label: string) {
    setFeedback((current) => ({ label, result: "wrong", attempt: (current?.attempt ?? 0) + 1 }));
  }

  function answer(hotspot: Hotspot) {
    if (locked.current || !scene.correct) return;
    const value = hotspot.value ?? hotspot.answer;
    if (!value) return;
    if (value === scene.correct) finishCorrect(hotspot.label);
    else markWrong(hotspot.label);
  }

  function choosePuzzle(hotspot: Hotspot) {
    if (locked.current || !scene.sequence?.length || !hotspot.value) return;
    const expected = scene.sequence[puzzleIndex];
    if (hotspot.value !== expected) {
      markWrong(hotspot.label);
      return;
    }
    const nextIndex = puzzleIndex + 1;
    setFeedback({ label: hotspot.label, result: "correct", attempt: (feedback?.attempt ?? 0) + 1 });
    if (nextIndex === scene.sequence.length) {
      locked.current = true;
      timer.current = setTimeout(next, 750);
    } else {
      setPuzzleIndex(nextIndex);
    }
  }

  const feedbackClass = (label: string) => feedback?.label === label ? ` is-${feedback.result}` : "";

  if (scene.id === "title") {
    return <main className="game-root" aria-label="Princess preposition adventure">
      <div className="title-screen" data-scene="title" style={{ "--scene-image": `url(${scene.image})` } as CSSProperties}>
        <div className="title-wash" />
        <div className="title-panel">
          <span className="title-kicker">AN INTERACTIVE STORY ADVENTURE</span>
          <h1>PRINCESS</h1>
          <p>Learn where things are, follow the story, then see what you remember.</p>
          <button className="primary-button" aria-label="Begin the Adventure" onClick={() => goTo(1)}>Begin the Adventure <span>→</span></button>
        </div>
      </div>
    </main>;
  }

  if (scene.id === "discover") {
    return <main className="game-root" aria-label="Princess preposition adventure"><div className="game-canvas" data-scene={scene.id}>
      <Frame stage="1 / 5" sceneImage={scene.image} soundOn={soundOn} onSound={() => setSoundOn((value) => !value)}>
        <section className="discover-card">
          <h2><small>Look at Princess.</small>Where is she?</h2>
          <div className="discover-sentence">The Princess is <strong className="learn-chip">IN</strong> the tower.</div>
          <div className="definition"><strong>IN</strong><span>tells us where something is.</span></div>
          <div className="definition definition-soft">Words like <strong>IN</strong> that tell us where things are are called <strong>PREPOSITIONS.</strong></div>
        </section>
        <button className="primary-button discover-cta" aria-label="Let's Try" onClick={() => goTo(2)}>Let&apos;s Try! <span>✦</span></button>
      </Frame>
    </div></main>;
  }

  if (scene.id === "storybook-intro") {
    return <main className="game-root"><div className="game-canvas" data-scene={scene.id}>
      <Frame stage="2 / 5" sceneImage={scene.image} soundOn={soundOn} onSound={() => setSoundOn((value) => !value)}>
        <section className="book-intro">
          <div className="closed-book"><span>♛</span><h2>Princess&apos;s<br/>Adventure</h2><small>DIGITAL STORYBOOK</small></div>
          <div className="book-intro-copy"><span className="section-label">READ FIRST · QUESTIONS LATER</span><h2>Read the whole story.</h2><p>You can go backward or forward anytime. Pink words tell you where things are.</p><button className="primary-button" aria-label="Open Storybook" onClick={() => goTo(storyStart)}>Open Storybook →</button></div>
        </section>
      </Frame>
    </div></main>;
  }

  if (scene.storyText) {
    const isFirst = sceneIndex === storyStart;
    const isLast = sceneIndex === storyEnd;
    return <main className="game-root"><div className="game-canvas" data-scene={scene.id}>
      <Frame stage="2 / 5" sceneImage={scene.image} soundOn={soundOn} onSound={() => setSoundOn((value) => !value)}>
        <section className="open-book" aria-label={`Storybook page ${scene.storyPage} of 9`}>
          <div className="book-page book-art"><img src={scene.image} alt=""/><span className="page-tag">{scene.storyPage} / 9</span></div>
          <article className="book-page book-copy">
            <span className="section-label">PRINCESS&apos;S ADVENTURE</span>
            <p><StoryText text={scene.storyText} preposition={scene.preposition!}/></p>
            <button className="read-button" onClick={() => speak(scene.storyText)} aria-label="Read this page aloud">🔊 Read to me</button>
            <div className="book-nav">
              <button className="secondary-button" aria-label="Previous story page" disabled={isFirst} onClick={() => goTo(sceneIndex - 1)}>← Back</button>
              <span>{scene.storyPage} / 9</span>
              <button className="primary-button compact" aria-label={isLast ? "Start Questions" : "Next story page"} onClick={() => goTo(isLast ? questionStart : sceneIndex + 1)}>{isLast ? "Start Questions →" : "Next →"}</button>
            </div>
          </article>
        </section>
      </Frame>
    </div></main>;
  }

  if (scene.question && scene.id.startsWith("q")) {
    return <main className="game-root"><div className="game-canvas" data-scene={scene.id}>
      <Frame stage="3 / 5" sceneImage={scene.image} soundOn={soundOn} onSound={() => setSoundOn((value) => !value)}>
        <section className="question-card">
          <div className="question-visual"><img src={scene.image} alt="Story scene"/><span>Question {questionNumber} / 9</span></div>
          <div className="question-copy"><span className="section-label">REMEMBER THE STORY</span><h2>{scene.question}</h2><div className="answer-grid">{scene.hotspots.map((hotspot, index) => <button key={hotspot.label} aria-label={hotspot.label} className={`answer-button${feedbackClass(hotspot.label)}`} onClick={() => answer(hotspot)}><b>{String.fromCharCode(65 + index)}</b><span>{pretty(hotspot.value)}</span></button>)}</div>{feedback?.result === "wrong" && <p className="gentle-hint">Think back to that part of the story and try again.</p>}</div>
        </section>
      </Frame>
    </div></main>;
  }

  if (scene.id === "story-puzzle") {
    return <main className="game-root"><div className="game-canvas" data-scene={scene.id}>
      <Frame stage="4 / 5" sceneImage={scene.image} soundOn={soundOn} onSound={() => setSoundOn((value) => !value)}>
        <section className="puzzle-card">
          <span className="section-label">FINAL MEMORY PUZZLE</span>
          <h2>Rebuild Princess&apos;s adventure.</h2>
          <p>Tap the pink position words in the same order they appeared in the story.</p>
          <div className="journey-strip">{scene.sequence?.map((value, index) => <div className={`journey-stop${index < puzzleIndex ? " complete" : ""}`} key={value}><span>{index < puzzleIndex ? pretty(value) : index + 1}</span></div>)}</div>
          <div className="puzzle-words">{scene.hotspots.map((hotspot) => {
            const alreadyPlaced = Boolean(hotspot.value && scene.sequence && scene.sequence.indexOf(hotspot.value) < puzzleIndex);
            return <button key={hotspot.label} aria-label={hotspot.label} className={`puzzle-word${feedbackClass(hotspot.label)}`} disabled={alreadyPlaced} onClick={() => choosePuzzle(hotspot)}>{pretty(hotspot.value)}</button>;
          })}</div>
          {feedback?.result === "wrong" && <p className="gentle-hint">Not that one yet. Follow the adventure from the beginning.</p>}
        </section>
      </Frame>
    </div></main>;
  }

  return <main className="game-root"><div className="game-canvas" data-scene={scene.id}>
    <Frame stage="5 / 5" sceneImage={scene.image} soundOn={soundOn} onSound={() => setSoundOn((value) => !value)}>
      <section className="finish-card">
        <span className="finish-crown">♛</span><span className="section-label">ADVENTURE COMPLETE</span><h2>Great job!</h2><p>You remembered Princess&apos;s whole adventure and all nine prepositions.</p>
        <div className="word-badges">{["IN", "OVER", "ON", "BY", "IN FRONT OF", "BETWEEN", "BEHIND", "NEXT TO", "AT"].map((word) => <span key={word}>{word}</span>)}</div>
        <div className="finish-actions"><button className="primary-button" aria-label="Play Again" onClick={() => goTo(1)}>↻ Play Again</button><button className="secondary-button" aria-label="Read the Story Again" onClick={() => goTo(storyStart)}>Read the Story Again</button></div>
      </section>
    </Frame>
  </div></main>;
}
