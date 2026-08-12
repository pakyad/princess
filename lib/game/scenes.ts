import type { Hotspot, SceneDefinition } from "./types";

const FLOW_ART = "/exact/learning-flow.svg";
const FLOW_SIZE = { sourceWidth: 1536, sourceHeight: 1024 } as const;
const crop = (x:number,y:number,width:number,height:number) => ({...FLOW_SIZE,x,y,width,height});
const next = (width:number,height:number): Hotspot => ({label:"Next",x:Math.max(0,width-90),y:Math.max(0,height-60),width:80,height:50,action:"advance"});
const answer = (label:string,value:string,x:number,y:number,width:number,height:number):Hotspot => ({label,value,x,y,width,height,action:"answer"});

const story = (id:string,page:number,text:string,preposition:string):SceneDefinition => ({
  id, storyPage:page, storyText:text, preposition,
  alt:`Storybook page ${page}. ${text}`, width:768,height:768,hotspots:[next(768,768)]
});
const question = (id:string,q:string,correct:string,choices:readonly string[]):SceneDefinition => ({
  id, question:q, correct, choices, alt:`Story question. ${q}`, width:768,height:768,
  hotspots: choices.map((choice,i)=>answer(`Answer ${choice}`,choice,128,360+i*82,512,64))
});

export const scenes: readonly SceneDefinition[] = [
  {id:"title",image:"/exact/title.png",alt:"Princess and the Prepo. Start Adventure.",width:512,height:322,hotspots:[{label:"Start Adventure",x:51,y:202,width:152,height:35,action:"start"}]},
  {id:"word-scattering",image:FLOW_ART,alt:"Word Scattering. Find UNDER.",width:362,height:321,crop:crop(13,86,362,321),correct:"under",hotspots:[answer("Choose THE","the",135,75,58,38),answer("Choose CAT","cat",198,75,58,38),answer("Choose IS","is",260,75,53,38),answer("Choose UNDER","under",150,120,87,43),answer("Choose THE second tile","the",245,120,64,43),answer("Choose TABLE","table",170,168,80,42)]},
  {id:"sentence-reconstruction",image:FLOW_ART,alt:"Sentence Reconstruction. Build The cat is under the table.",width:374,height:321,crop:crop(388,86,374,321),sequence:["the-1","cat","is","under","the-2","table","period"],hotspots:[
    {label:"THE",value:"the-1",x:11,y:80,width:48,height:42,action:"sequence"},{label:"CAT",value:"cat",x:61,y:80,width:48,height:42,action:"sequence"},{label:"IS",value:"is",x:111,y:80,width:43,height:42,action:"sequence"},{label:"UNDER",value:"under",x:157,y:80,width:59,height:42,action:"sequence"},{label:"THE 2",value:"the-2",x:219,y:80,width:47,height:42,action:"sequence"},{label:"TABLE",value:"table",x:269,y:80,width:62,height:42,action:"sequence"},{label:"PERIOD",value:"period",x:334,y:80,width:34,height:42,action:"sequence"}]},
  {id:"picture-matching",image:FLOW_ART,alt:"Picture Matching.",width:296,height:321,crop:crop(775,86,296,321),sequence:["under","on","in"],hotspots:[{label:"On",value:"on",x:150,y:76,width:132,height:60,action:"sequence"},{label:"Under",value:"under",x:150,y:141,width:132,height:60,action:"sequence"},{label:"In",value:"in",x:150,y:207,width:132,height:60,action:"sequence"}]},
  {id:"storybook-intro",image:FLOW_ART,alt:"Digital Storybook. Read the complete story, then answer questions from memory.",width:438,height:321,crop:crop(1084,86,438,321),hotspots:[{label:"Begin Storybook",x:330,y:245,width:90,height:60,action:"advance"}]},

  story("story-1",1,"Once upon a time, there was a beautiful princess who lived in a tower.","in"),
  story("story-2",2,"And one day, she decided to escape. She climbed over the wall quietly and ran away.","over"),
  story("story-3",3,"She walked slowly through the forest and saw a bird sitting on the tree. The bird sang a sweet song.","on"),
  story("story-4",4,"The princess walked by a small river carefully.","by"),
  story("story-5",5,"Then, she saw a giant monster standing in front of a dark cave. Its eyes glowed red. ‘ROAR!’ shouted the monster.","in front of"),
  story("story-6",6,"The princess hid between two big rocks because she felt afraid.","between"),
  story("story-7",7,"Suddenly, a prince came from behind and attacked the monster. He saved the princess, and she felt happy and safe.","behind"),
  story("story-8",8,"Then, they continued walking next to each other under the starry night. The stars shone brightly in the sky.","next to"),
  story("story-9",9,"Finally, they arrived at her castle and lived happily together.","at"),

  question("q1","Where did the princess live?","in",["on","in","under"]),
  question("q2","How did the princess escape?","over",["behind","over","between"]),
  question("q3","Where was the bird sitting?","on",["by","on","under"]),
  question("q4","Where was the monster standing?","in front of",["behind","in front of","next to"]),
  question("q5","Where did the princess hide?","between",["between","over","at"]),
  question("q6","Where did the prince come from?","behind",["in front of","behind","by"]),
  question("q7","How did the prince and princess walk?","next to",["under","next to","between"]),
  question("q8","Where did they arrive at the end?","at",["by","in","at"]),

  {id:"story-puzzle",question:"Put the remembered story prepositions in order.",alt:"Story Puzzle. Rebuild the preposition trail from the story.",width:768,height:768,sequence:["in","over","on","by","in front of","between","behind","next to","at"],hotspots:["in","over","on","by","in front of","between","behind","next to","at"].map((value,i)=>({label:value,value,x:110+(i%3)*190,y:310+Math.floor(i/3)*90,width:170,height:62,action:"sequence"}))},
  {id:"completion",image:FLOW_ART,alt:"Well done. You completed the learning activities, remembered the digital storybook and solved the story puzzle.",width:606,height:277,crop:crop(916,724,606,277),hotspots:[{label:"Play Again",x:169,y:224,width:117,height:40,action:"replay"},{label:"Back to Map",x:318,y:224,width:127,height:40,action:"next"}]}
] as const;
