"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { scenes } from "@/lib/game/scenes";
import type { Hotspot } from "@/lib/game/types";

type Feedback = { label: string; result: "correct" | "wrong"; attempt: number } | null;

const pretty = (value?: string) => {
  if (!value) return "";
  if (value === "period") return ".";
  return value.replace(/-\d$/, "").toUpperCase();
};

function StoryText({ text, preposition }: { text: string; preposition: string }) {
  const index = text.toLowerCase().indexOf(preposition.toLowerCase());
  if (index < 0) return <>{text}</>;
  return <>{text.slice(0, index)}<strong className="prepo-word">{text.slice(index, index + preposition.length)}</strong>{text.slice(index + preposition.length)}</>;
}

function Shell({ title, step, sceneImage, children }: { title: string; step: string; sceneImage?: string; children: ReactNode }) {
  return (
    <div className="prepo-screen" style={{ "--scene-image": `url(${sceneImage ?? "/exact/title.png"})` } as CSSProperties}>
      <div className="prepo-vignette" />
      <div className="prepo-topbar">
        <div className="prepo-brand">♛ Princess &amp; the Prepo</div>
        <div className="prepo-step">{step}</div>
      </div>
      <section className="prepo-scroll">
        <div className="scroll-pin pin-left" /><div className="scroll-pin pin-right" />
        <div className="prepo-ribbon"><span>{title}</span></div>
        {children}
      </section>
    </div>
  );
}

export function Game() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitioning = useRef(false);
  const scene = scenes[sceneIndex];

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function resetInteraction() {
    transitioning.current = false;
    setFeedback(null);
    setSequenceIndex(0);
  }
  function goTo(index: number) {
    resetInteraction();
    setSceneIndex(Math.max(0, Math.min(index, scenes.length - 1)));
  }
  function advance() { goTo(sceneIndex + 1); }
  function finishCorrect(label: string) {
    transitioning.current = true;
    setFeedback((current) => ({ label, result: "correct", attempt: (current?.attempt ?? 0) + 1 }));
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(advance, 520);
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
        const next = sequenceIndex + 1;
        setFeedback((current) => ({ label: hotspot.label, result: "correct", attempt: (current?.attempt ?? 0) + 1 }));
        if (next >= scene.sequence.length) finishCorrect(hotspot.label);
        else setSequenceIndex(next);
        break;
      }
      case "collect":
        break;
      case "replay":
        goTo(1);
        break;
      case "next":
        goTo(0);
        break;
    }
  }

  const feedbackClass = (label: string) => feedback?.label === label ? ` is-${feedback.result}` : "";

  if (scene.id === "title") {
    return (
      <main className="exact-game" aria-label="Princess and the Prepo">
        <div className="exact-screen-frame" data-scene="title" style={{ "--screen-ratio": scene.width / scene.height } as CSSProperties}>
          <img className="exact-screen" src={scene.image} alt={scene.alt} draggable={false} />
          <button className="exact-hotspot" aria-label="Start Adventure" style={{ left: "10%", top: "62%", width: "30%", height: "12%" }} onClick={() => activate(scene.hotspots[0])} />
        </div>
      </main>
    );
  }

  let content: ReactNode;

  if (scene.id === "word-scattering") {
    content = (
      <Shell title="WORD SCATTERING" step="1 / 8" sceneImage={scene.image}>
        <p className="prepo-instruction">Find the <strong>preposition</strong>. It tells us where Princess Prepo is.</p>
        <div className="word-cloud">
          {scene.hotspots.map((hotspot) => <button aria-label={hotspot.label} key={hotspot.label} className={`word-gem${hotspot.value === "under" ? " target-preposition" : ""}${feedbackClass(hotspot.label)}`} onClick={() => activate(hotspot)}>{pretty(hotspot.value)}</button>)}
        </div>
        <div className="learning-hint">Sentence clue: The princess is <span className="prepo-word">under</span> the tree.</div>
      </Shell>
    );
  } else if (scene.id === "sentence-reconstruction") {
    content = (
      <Shell title="SENTENCE RECONSTRUCTION" step="2 / 8" sceneImage={scene.image}>
        <p className="prepo-instruction">Build the sentence in the correct order. The preposition stays <span className="prepo-word">pink</span>.</p>
        <div className="sentence-slots">
          {scene.sequence?.map((value, index) => <div className={`sentence-slot${index < sequenceIndex ? " filled" : ""}`} key={`${value}-${index}`}>{index < sequenceIndex ? <span className={value === "under" ? "prepo-word" : ""}>{pretty(value)}</span> : ""}</div>)}
        </div>
        <div className="word-bank">
          {scene.hotspots.map((hotspot) => <button aria-label={hotspot.label} key={hotspot.label} className={`word-tile${hotspot.value === "under" ? " target-preposition" : ""}${feedbackClass(hotspot.label)}`} onClick={() => activate(hotspot)}>{pretty(hotspot.value)}</button>)}
        </div>
      </Shell>
    );
  } else if (scene.id === "picture-matching") {
    const cards = [
      { image: "/exact/forest.png", hotspot: scene.hotspots[0], label: <>The princess is <span className="prepo-word">UNDER</span> the tree.</> },
      { image: "/exact/river.png", hotspot: scene.hotspots[1], label: <>The princess is <span className="prepo-word">ON</span> the stones.</> },
      { image: "/exact/garden.png", hotspot: scene.hotspots[2], label: <>The princess is <span className="prepo-word">IN</span> the garden.</> },
    ];
    content = (
      <Shell title="MATCH THE PICTURE" step="3 / 8" sceneImage={scene.image}>
        <p className="prepo-instruction">Match the story picture to the correct sentence. Complete them from left to right.</p>
        <div className="picture-grid">
          {cards.map(({ image, hotspot, label }) => <button aria-label={hotspot.label} key={hotspot.label} className={`picture-card${feedbackClass(hotspot.label)}`} onClick={() => activate(hotspot)}><img src={image} alt="" /><span>{label}</span></button>)}
        </div>
        <div className="mini-progress">Matched {sequenceIndex} of 3</div>
      </Shell>
    );
  } else if (scene.id === "storybook-intro") {
    content = (
      <Shell title="DIGITAL STORYBOOK" step="4 / 8" sceneImage={scene.image}>
        <div className="storybook-intro-layout"><div className="storybook-cover"><div className="cover-crown">♛</div><h2>The Princess<br/>and the Prepo</h2><p>Read • Remember • Retell</p></div><div className="storybook-intro-copy"><h2>Read the whole adventure first</h2><p>Look carefully at where each character is. The questions and puzzle come only after the final page.</p><button aria-label="Begin digital storybook" className="royal-button" onClick={() => activate(scene.hotspots[0])}>Open Storybook</button></div></div>
      </Shell>
    );
  } else if (scene.storyText) {
    content = (
      <Shell title="THE STORY" step={`4 / 8 • Page ${scene.storyPage} of 9`} sceneImage={scene.image}>
        <div className="story-spread"><div className="story-image"><img src={scene.image} alt="" /></div><div className="story-paper"><div className="story-chapter">Princess Prepo&apos;s Journey</div><p><StoryText text={scene.storyText} preposition={scene.preposition!} /></p><div className="story-focus">Focus word: <span className="prepo-word">{scene.preposition?.toUpperCase()}</span></div><button aria-label="Next story page" className="royal-button" onClick={() => activate(scene.hotspots[0])}>{scene.storyPage === 9 ? "Finish Story" : "Turn Page →"}</button></div></div>
      </Shell>
    );
  } else if (scene.question && scene.id.startsWith("q")) {
    content = (
      <Shell title="STORY QUESTIONS" step="5 / 8" sceneImage={scene.image}>
        <div className="question-layout"><div className="question-memory"><img src={scene.image} alt="Story memory scene" /><span>Remember what happened in the story.</span></div><div className="question-panel"><div className="question-number">Question {scene.id.slice(1)} of 8</div><h2>{scene.question}</h2><div className="answer-stack">{scene.hotspots.map((hotspot, index) => <button aria-label={hotspot.label} key={hotspot.label} className={`answer-choice${feedbackClass(hotspot.label)}`} onClick={() => activate(hotspot)}><b>{String.fromCharCode(65 + index)}</b><span>{pretty(hotspot.value)}</span></button>)}</div></div></div>
      </Shell>
    );
  } else if (scene.id === "story-puzzle") {
    content = (
      <Shell title="STORY PUZZLE" step="6 / 8" sceneImage={scene.image}>
        <p className="prepo-instruction">Can you rebuild the preposition trail from the story in order?</p>
        <div className="trail-slots">{scene.sequence?.map((value, index) => <div key={`${value}-${index}`} className={`trail-slot${index < sequenceIndex ? " filled" : ""}`}>{index < sequenceIndex ? pretty(value) : index + 1}</div>)}</div>
        <div className="puzzle-bank">{scene.hotspots.map((hotspot) => <button aria-label={hotspot.label} key={hotspot.label} className={`puzzle-token${feedbackClass(hotspot.label)}`} onClick={() => activate(hotspot)}>{pretty(hotspot.value)}</button>)}</div>
      </Shell>
    );
  } else {
    content = (
      <Shell title="ADVENTURE COMPLETE" step="8 / 8" sceneImage={scene.image}>
        <div className="completion-card"><div className="completion-stars">★ ★ ★</div><h2>Well done, Princess!</h2><p>You found the prepositions, rebuilt sentences, matched pictures, remembered the story and completed the puzzle.</p><button aria-label="Play Again" className="royal-button" onClick={() => activate(scene.hotspots[0])}>Play Again</button></div>
      </Shell>
    );
  }

  return <main className="exact-game" aria-label="Princess and the Prepo"><div className="prepo-frame" data-scene={scene.id}>{content}<span className="sr-only" role="status" aria-live="polite">{feedback?.result === "correct" ? "Correct!" : feedback?.result === "wrong" ? "Try again." : ""}</span></div></main>;
}
