"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { scenes } from "@/lib/game/scenes";
import type { Hotspot } from "@/lib/game/types";

type Feedback = { label: string; result: "correct" | "wrong"; attempt: number } | null;
const pretty = (value?: string) => !value ? "" : value === "period" ? "." : value.replace(/-\d$/, "").toUpperCase();

function StoryText({ text, preposition }: { text: string; preposition: string }) {
  const index = text.toLowerCase().indexOf(preposition.toLowerCase());
  if (index < 0) return <>{text}</>;
  return <>{text.slice(0, index)}<strong className="prepo-word">{text.slice(index, index + preposition.length)}</strong>{text.slice(index + preposition.length)}</>;
}

function Shell({ title, chapter, sceneImage, children }: { title: string; chapter: string; sceneImage?: string; children: ReactNode }) {
  return <div className="prepo-screen" style={{ "--scene-image": `url(${sceneImage ?? "/exact/title.png"})` } as CSSProperties}>
    <div className="prepo-vignette" />
    <header className="prepo-topbar"><div className="prepo-brand"><span>♛</span> PRINCESS</div><div className="prepo-step">{chapter}</div></header>
    <section className="prepo-scroll"><div className="scroll-pin pin-left"/><div className="scroll-pin pin-right"/><div className="prepo-ribbon"><span>{title}</span></div>{children}</section>
  </div>;
}

export function Game() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [builtWords, setBuiltWords] = useState<string[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitioning = useRef(false);
  const scene = scenes[sceneIndex];

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  function resetInteraction() { transitioning.current = false; setFeedback(null); setSequenceIndex(0); setBuiltWords([]); }
  function goTo(index: number) { resetInteraction(); setSceneIndex(Math.max(0, Math.min(index, scenes.length - 1))); }
  function advance() { goTo(sceneIndex + 1); }
  function finishCorrect(label: string) { transitioning.current = true; setFeedback((c) => ({ label, result: "correct", attempt: (c?.attempt ?? 0) + 1 })); if (timer.current) clearTimeout(timer.current); timer.current = setTimeout(advance, 650); }
  function markWrong(label: string) { setFeedback((c) => ({ label, result: "wrong", attempt: (c?.attempt ?? 0) + 1 })); }

  function activate(hotspot: Hotspot) {
    if (transitioning.current) return;
    if (hotspot.action === "start" || hotspot.action === "advance") return advance();
    if (hotspot.action === "replay") return goTo(1);
    if (hotspot.action === "next") return goTo(scene.id === "completion" ? 5 : 0);
    const value = hotspot.value ?? hotspot.answer;
    if (!value) return;
    if (hotspot.action === "answer") {
      if (!scene.correct) return;
      return value === scene.correct ? finishCorrect(hotspot.label) : markWrong(hotspot.label);
    }
    if (hotspot.action === "sequence") {
      if (!scene.sequence?.length) return;
      if (scene.id === "sentence-reconstruction") {
        if (builtWords.includes(value)) return;
        setBuiltWords((words) => [...words, value]);
        setFeedback(null);
        return;
      }
      const expected = scene.sequence[sequenceIndex];
      if (value !== expected) { setSequenceIndex(0); markWrong(hotspot.label); return; }
      const next = sequenceIndex + 1;
      setFeedback((c) => ({ label: hotspot.label, result: "correct", attempt: (c?.attempt ?? 0) + 1 }));
      if (next >= scene.sequence.length) finishCorrect(hotspot.label); else setSequenceIndex(next);
    }
  }

  function checkSentence() {
    const expected = scene.sequence ?? [];
    if (builtWords.length !== expected.length) return;
    if (builtWords.every((word, i) => word === expected[i])) finishCorrect("Check sentence");
    else { markWrong("Check sentence"); setBuiltWords([]); }
  }
  function removeBuiltWord(index: number) { setBuiltWords((words) => words.filter((_, i) => i !== index)); setFeedback(null); }
  const feedbackClass = (label: string) => feedback?.label === label ? ` is-${feedback.result}` : "";

  if (scene.id === "title") return <main className="exact-game" aria-label="Princess learning adventure"><div className="exact-screen-frame title-frame" data-scene="title" style={{ "--screen-ratio": scene.width / scene.height } as CSSProperties}><img className="exact-screen" src={scene.image} alt={scene.alt} draggable={false}/><div className="title-copy"><span className="eyebrow">A MAGICAL LANGUAGE ADVENTURE</span><h1>PRINCESS</h1><p>Discover nine magic position words and guide Princess home.</p><button aria-label="Begin the Adventure" className="title-cta" onClick={() => activate(scene.hotspots[0])}>Begin the Adventure <span>→</span></button></div></div></main>;

  let content: ReactNode;
  if (scene.id === "word-scattering") content = <Shell title="FIND THE MAGIC WORD" chapter="CHAPTER I · DISCOVER" sceneImage={scene.image}><p className="prepo-instruction">One word tells us <em>where</em> Princess is. Can you find it?</p><div className="word-cloud">{scene.hotspots.map((h) => <button aria-label={h.label} key={h.label} className={`word-gem${h.value === "under" ? " target-preposition" : ""}${feedbackClass(h.label)}`} onClick={() => activate(h)}>{pretty(h.value)}</button>)}</div><div className="learning-hint"><span className="hint-icon">✦</span> The Princess is <span className="prepo-word">UNDER</span> the tree.</div></Shell>;
  else if (scene.id === "sentence-reconstruction") content = <Shell title="BUILD THE SENTENCE" chapter="CHAPTER II · BUILD" sceneImage={scene.image}><p className="prepo-instruction">Tap the words in order. Tap a placed word to send it back.</p><div className="sentence-slots">{scene.sequence?.map((_, i) => <button key={i} className={`sentence-slot${builtWords[i] ? " filled" : ""}`} onClick={() => builtWords[i] && removeBuiltWord(i)} aria-label={builtWords[i] ? `Remove ${pretty(builtWords[i])}` : `Empty word slot ${i + 1}`}>{builtWords[i] ? <span className={builtWords[i] === "under" ? "prepo-word" : ""}>{pretty(builtWords[i])}</span> : <span className="slot-number">{i + 1}</span>}</button>)}</div><div className="word-bank">{scene.hotspots.map((h) => <button aria-label={h.label} disabled={builtWords.includes(h.value!)} key={h.label} className={`word-tile${h.value === "under" ? " target-preposition" : ""}`} onClick={() => activate(h)}>{pretty(h.value)}</button>)}</div><button aria-label="Check sentence" disabled={builtWords.length !== scene.sequence?.length} className={`check-button${feedbackClass("Check sentence")}`} onClick={checkSentence}>Check My Sentence</button></Shell>;
  else if (scene.id === "picture-matching") { const cards = [{ image:"/exact/forest.png", hotspot:scene.hotspots[0], label:<>Princess is <span className="prepo-word">UNDER</span> the tree.</>},{image:"/exact/river.png",hotspot:scene.hotspots[1],label:<>Princess is <span className="prepo-word">ON</span> the stones.</>},{image:"/exact/garden.png",hotspot:scene.hotspots[2],label:<>Princess is <span className="prepo-word">IN</span> the garden.</>}]; content=<Shell title="MATCH THE MOMENT" chapter="CHAPTER III · CONNECT" sceneImage={scene.image}><p className="prepo-instruction">Choose the pictures in story order: <span className="prepo-word">UNDER</span>, then <span className="prepo-word">ON</span>, then <span className="prepo-word">IN</span>.</p><div className="picture-grid">{cards.map(({image,hotspot,label})=><button aria-label={hotspot.label} key={hotspot.label} className={`picture-card${feedbackClass(hotspot.label)}`} onClick={()=>activate(hotspot)}><img src={image} alt=""/><span>{label}</span></button>)}</div><div className="mini-progress"><b>{sequenceIndex}</b><span>/ 3 moments matched</span></div></Shell>; }
  else if (scene.id === "storybook-intro") content=<Shell title="THE STORYBOOK" chapter="CHAPTER IV · REMEMBER" sceneImage={scene.image}><div className="storybook-intro-layout"><div className="storybook-cover"><div className="cover-crown">♛</div><span>THE ADVENTURE OF</span><h2>PRINCESS</h2><div className="cover-rule"/><p>Nine position words hide inside her journey.</p></div><div className="storybook-intro-copy"><span className="eyebrow">READ FIRST · QUESTIONS LATER</span><h2>Follow the whole journey.</h2><p>Notice where Princess, the bird, the monster and the prince are. When the book closes, you&apos;ll need to remember.</p><button aria-label="Open Storybook" className="royal-button" onClick={()=>activate(scene.hotspots[0])}>Open the Storybook →</button></div></div></Shell>;
  else if (scene.storyText) content=<Shell title="PRINCESS'S JOURNEY" chapter={`STORYBOOK · ${scene.storyPage} / 9`} sceneImage={scene.image}><div className="story-spread"><div className="story-image"><img src={scene.image} alt=""/><div className="page-medallion">{scene.storyPage}</div></div><article className="story-paper"><div className="story-chapter">A PAGE FROM THE ADVENTURE</div><p><StoryText text={scene.storyText} preposition={scene.preposition!}/></p><div className="story-focus"><span>MAGIC POSITION WORD</span><b>{scene.preposition?.toUpperCase()}</b></div><button aria-label="Next story page" className="royal-button" onClick={()=>activate(scene.hotspots[0])}>{scene.storyPage===9?"Close the Book →":"Turn the Page →"}</button></article></div></Shell>;
  else if (scene.question && scene.id.startsWith("q")) content=<Shell title="MEMORY CHALLENGE" chapter={`CHAPTER V · ${scene.id.slice(1)} / 9`} sceneImage={scene.image}><div className="question-layout"><div className="question-memory"><img src={scene.image} alt="Story memory"/><span>Look closely. Remember the adventure.</span></div><div className="question-panel"><span className="eyebrow">STORY RECALL</span><h2>{scene.question}</h2><div className="answer-stack">{scene.hotspots.map((h,i)=><button aria-label={h.label} key={h.label} className={`answer-choice${feedbackClass(h.label)}`} onClick={()=>activate(h)}><b>{String.fromCharCode(65+i)}</b><span>{pretty(h.value)}</span></button>)}</div></div></div></Shell>;
  else if (scene.id === "story-puzzle") content=<Shell title="THE FINAL TRAIL" chapter="CHAPTER VI · MASTER" sceneImage={scene.image}><p className="prepo-instruction">Rebuild Princess&apos;s entire journey from the tower to the castle.</p><div className="trail-map"><span>🏰</span><div className="trail-line"/><span>👑</span></div><div className="trail-slots">{scene.sequence?.map((value,i)=><div key={`${value}-${i}`} className={`trail-slot${i<sequenceIndex?" filled":""}`}>{i<sequenceIndex?pretty(value):<span>{i+1}</span>}</div>)}</div><div className="puzzle-bank">{scene.hotspots.map((h)=><button aria-label={h.label} key={h.label} className={`puzzle-token${feedbackClass(h.label)}`} onClick={()=>activate(h)}>{pretty(h.value)}</button>)}</div></Shell>;
  else content=<Shell title="THE END" chapter="ADVENTURE COMPLETE" sceneImage={scene.image}><div className="completion-card"><div className="completion-stars">✦ ♛ ✦</div><span className="eyebrow">THE CASTLE GATES ARE OPEN</span><h2>Princess made it home.</h2><p>You discovered all nine magic position words and remembered the whole adventure.</p><div className="badge-row">{["IN","OVER","ON","BY","IN FRONT OF","BETWEEN","BEHIND","NEXT TO","AT"].map(x=><span key={x}>{x}</span>)}</div><div className="completion-actions"><button aria-label="Play Again" className="royal-button" onClick={()=>activate(scene.hotspots[0])}>↻ Play Again</button><button aria-label="Read the Story Again" className="secondary-button" onClick={()=>activate(scene.hotspots[1])}>Read the Story Again</button></div></div></Shell>;

  return <main className="exact-game" aria-label="Princess learning adventure"><div className="prepo-frame" data-scene={scene.id}>{content}<span className="sr-only" role="status" aria-live="polite">{feedback?.result === "correct"?"Correct!":feedback?.result === "wrong"?"Try again.":""}</span></div></main>;
}
