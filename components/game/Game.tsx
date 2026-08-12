"use client";

import { useEffect,useMemo,useRef,useState,type CSSProperties } from "react";
import { scenes } from "@/lib/game/scenes";
import type { Hotspot,SceneCrop } from "@/lib/game/types";

function hotspotStyle(h:Hotspot,w:number,ht:number):CSSProperties{return{left:`${h.x/w*100}%`,top:`${h.y/ht*100}%`,width:`${h.width/w*100}%`,height:`${h.height/ht*100}%`}}
function cropStyle(c:SceneCrop):CSSProperties{return{width:`${c.sourceWidth/c.width*100}%`,height:`${c.sourceHeight/c.height*100}%`,left:`${-c.x/c.width*100}%`,top:`${-c.y/c.height*100}%`}}
type Feedback={label:string;result:"correct"|"wrong";attempt:number}|null;

function StoryText({text,preposition}:{text:string;preposition:string}){
 const i=text.toLowerCase().indexOf(preposition.toLowerCase());
 if(i<0)return <>{text}</>;
 return <>{text.slice(0,i)}<strong className="story-preposition">{text.slice(i,i+preposition.length)}</strong>{text.slice(i+preposition.length)}</>;
}

export function Game(){
 const [sceneIndex,setSceneIndex]=useState(0);const [feedback,setFeedback]=useState<Feedback>(null);const [sequenceIndex,setSequenceIndex]=useState(0);const [collected,setCollected]=useState<ReadonlySet<string>>(new Set());const timer=useRef<ReturnType<typeof setTimeout>|null>(null);const transitioning=useRef(false);const scene=scenes[sceneIndex];const selected=useMemo(()=>collected,[collected]);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current)},[]);
 function reset(){transitioning.current=false;setFeedback(null);setSequenceIndex(0);setCollected(new Set())}
 function goTo(i:number){reset();setSceneIndex(Math.max(0,Math.min(i,scenes.length-1)))}
 function advance(){goTo(sceneIndex+1)}
 function correct(label:string){transitioning.current=true;setFeedback(c=>({label,result:"correct",attempt:(c?.attempt??0)+1}));if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(advance,500)}
 function wrong(label:string){setFeedback(c=>({label,result:"wrong",attempt:(c?.attempt??0)+1}))}
 function activate(h:Hotspot){if(transitioning.current)return;switch(h.action){case"start":case"advance":advance();break;case"answer":{const v=h.value??h.answer;if(!v||!scene.correct)return;v===scene.correct?correct(h.label):wrong(h.label);break}case"sequence":{if(!h.value||!scene.sequence?.length)return;const expected=scene.sequence[sequenceIndex];if(h.value!==expected){setSequenceIndex(0);wrong(h.label);return}const n=sequenceIndex+1;setFeedback(c=>({label:h.label,result:"correct",attempt:(c?.attempt??0)+1}));n>=scene.sequence.length?correct(h.label):setSequenceIndex(n);break}case"collect":{if(!h.value||selected.has(h.value))return;const n=new Set(collected);n.add(h.value);setCollected(n);if(n.size>=(scene.collectCount??1))correct(h.label);break}case"replay":goTo(1);break;case"next":goTo(0);break}}

 const isStory=Boolean(scene.storyText);const isQuestion=Boolean(scene.question);
 return <main className="exact-game" aria-label="Princess and the Prepo"><div className={`exact-screen-frame${isStory||isQuestion?" story-mode":""}`} data-scene={scene.id} style={{"--screen-ratio":scene.width/scene.height} as CSSProperties}>
   {isStory ? <div className="storybook-page"><div className="storybook-ornament">✦</div><div className="storybook-kicker">THE PRINCESS AND THE PREPO</div><div className="storybook-illustration" aria-hidden="true"><span>♕</span><span className="storybook-path">· · · ✦ · · ·</span><span>🏰</span></div><p className="storybook-copy"><StoryText text={scene.storyText!} preposition={scene.preposition!}/></p><div className="storybook-page-number">{scene.storyPage} / 9</div></div>
   : isQuestion ? <div className="question-page"><div className="storybook-kicker">STORY QUESTIONS</div><h1>Remember the story</h1><p>{scene.question}</p>{scene.choices?.map(choice=><div key={choice} className="question-choice">{choice}</div>)}</div>
   : <div className="exact-art-clip" aria-hidden="true"><img className={`exact-screen${scene.crop?" exact-atlas":""}`} src={scene.image} alt="" draggable={false} style={scene.crop?cropStyle(scene.crop):undefined}/></div>}
   <span className="sr-only">{scene.alt}</span>{scene.hotspots.map(h=>{const collected=h.value?selected.has(h.value):false;const target=feedback?.label===h.label;const state=collected||(target&&feedback?.result==="correct")?" is-correct":target&&feedback?.result==="wrong"?" is-wrong":"";return <button key={`${h.label}-${target?feedback?.attempt:0}`} className={`exact-hotspot${state}`} type="button" aria-label={h.label} style={hotspotStyle(h,scene.width,scene.height)} onClick={()=>activate(h)}/>})}<span key={feedback?.attempt??0} className="sr-only" role="status" aria-live="polite">{feedback?.result==="correct"?"Correct!":feedback?.result==="wrong"?"Try again.":""}</span>
 </div></main>
}
