"use client";

import { useState, type CSSProperties } from "react";
import { PAINTED_MOCKUP } from "@/lib/art/painted";

type Screen = "title" | "river" | "forest" | "treasure" | "gate" | "bridge" | "garden" | "ending";
const ORDER: Screen[] = ["title", "river", "forest", "treasure", "gate", "bridge", "garden", "ending"];
const PANELS: Record<Screen, { x:number;y:number;w:number;h:number }> = {
  title:{x:8,y:84,w:512,h:320}, river:{x:526,y:84,w:490,h:320}, forest:{x:1023,y:84,w:496,h:320},
  treasure:{x:8,y:412,w:512,h:303}, gate:{x:526,y:412,w:490,h:303}, bridge:{x:1023,y:412,w:496,h:303},
  garden:{x:8,y:723,w:512,h:294}, ending:{x:526,y:723,w:419,h:294},
};
const CORRECT: Partial<Record<Screen,number>> = {river:1,forest:1,treasure:0,gate:1,bridge:1,garden:0};

export function ExactGame(){
  const [index,setIndex]=useState(0); const [wrong,setWrong]=useState<number|null>(null);
  const screen=ORDER[index]; const p=PANELS[screen];
  const advance=()=>{setWrong(null);setIndex(i=>Math.min(i+1,ORDER.length-1));};
  const answer=(c:number)=>{if(CORRECT[screen]===c) advance(); else {setWrong(c);window.setTimeout(()=>setWrong(null),650);}};
  const artStyle:CSSProperties={width:`${1536/p.w*100}%`,height:"auto",left:`${-p.x/p.w*100}%`,top:`${-p.y/p.h*100}%`};
  return <main className="exact-shell"><section className={`exact-screen exact-${screen}`} style={{aspectRatio:`${p.w} / ${p.h}`}} aria-label={`Princess and the Prepo: ${screen}`}>
    <img className="exact-art" src={PAINTED_MOCKUP} alt="" draggable={false} style={artStyle}/>
    {screen==="title"&&<button className="hotspot start" onClick={advance} aria-label="Start Adventure"/>}
    {screen!=="title"&&screen!=="ending"&&<div className="answer-hotspots" aria-label="Answer choices">{[0,1,2].map(c=><button key={c} className={`hotspot answer answer-${c} ${wrong===c?"wrong":""}`} onClick={()=>answer(c)} aria-label={`Answer ${String.fromCharCode(65+c)}`}/>)}</div>}
    {screen==="ending"&&<><button className="hotspot replay" onClick={()=>setIndex(0)} aria-label="Replay adventure"/><button className="hotspot next-level" onClick={()=>setIndex(0)} aria-label="Start again"/></>}
  </section><p className="sr-only" aria-live="polite">{wrong!==null?"Try again.":""}</p></main>;
}
