function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}const random=(range=100)=>Math.round(Math.random()*range);const average=nums=>nums.reduce((a,b)=>a+b,0)/nums.length;const median=nums=>{const half=nums.length/2|0;const temp=nums.slice().sort((a,b)=>a<b?-1:b<a?1:0);return temp.length%2?temp[half]:(temp[half-1]+temp[half])/2};const now=()=>new Date().toLocaleString("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"numeric"}).replace(/\D/g,"");const QUERY_NAME_MAP={".body":"\u8EAB\u4F53\u2015\u2015 Body",".nose":"\u9F3B\u2015\u2015 Nose",".fang .left":"\u5DE6\u306E\u30AD\u30D0\u2015\u2015 Left Fang",".fang .right":"\u53F3\u306E\u30AD\u30D0\u2015\u2015 Right Fang",".eye .left":"\u5DE6\u76EE\u2015\u2015 Left Eye",".eye .right":"\u53F3\u76EE\u2015\u2015 Right Eye"};/**
 * DOMを扱いやすくするためのラッパー。
 */class Entity{get searchParams(){const params=new URLSearchParams;Entity.RESTORABLE_ATTRIBUTES.map(x=>[x,this.element.style.getPropertyValue(x)]).forEach(([k,v])=>v&&params.append(`${this.uniqQuery}:${k}`,v));return params}get value(){const toNumbers=str=>(str||"").split(/[^0-9^\\.]/).filter(Boolean).map(Number);const[x,y,scale,rotate]=toNumbers(this.element.style.getPropertyValue("transform"));const[originX,originY]=toNumbers(this.element.style.getPropertyValue("transform-origin"));return{x,y,scale,rotate,originX,originY}}constructor(uniqQuery){_defineProperty(this,"uniqQuery",void 0);_defineProperty(this,"name",void 0);_defineProperty(this,"element",void 0);_defineProperty(this,"animation",false);this.uniqQuery=uniqQuery;this.name=QUERY_NAME_MAP[uniqQuery]||"";this.element=document.querySelector(uniqQuery)}removeClass(...tokens){this.element.classList.remove(tokens)}addClass(...tokens){this.element.classList.add(tokens)}updateStyle(property,value){this.element.style.setProperty(property,value)}/**
   * HACK: iOS Safariにて、styleの削除やリセットを行うと、スタイルが以前のママ残ってしまうので、
   * 新しく初期値を設置してリセットする
   */reset(){this.updateStyle("transform",`translate(0px, 0px) scale(1) rotate(0deg)`);this.updateStyle("transform-origin",`50px 40px`)}restore(){const params=Object.fromEntries(new URLSearchParams(location.search));Entity.RESTORABLE_ATTRIBUTES.forEach(attr=>{const value=params[`${this.uniqQuery}:${attr}`];if(value){this.updateStyle(attr,value)}// `%2C`(,)がsearchParamsに含まれていなければ、f6cb61c以前の手法でrestoreできるように後方互換
if(!location.search.includes("%2C")){this.element.setAttribute(attr,value)}})}}/**
 * シングルトン的に利用するロジックをまとめたサービス。
 */_defineProperty(Entity,"RESTORABLE_ATTRIBUTES",["stroke","transform","transform-origin"]);class Service{get bgColor(){return`hsl(${this.hue}, 100%, 70%)`}get accentColor(){return`hsl(${(this.hue-90)%360}, 100%, 40%)`}get resultURL(){const params=new URLSearchParams;this.animEntities.forEach(x=>[...x.searchParams].forEach(([k,v])=>params.append(k,v)));params.append("hue",this.hue);const url=location.href.replace(/(?!.*\/).*/,"");return`${url}?${params}`}/** 変更に弱い設計なので注意 */get score(){const value=this.animEntities.reduce((a,{value})=>({x:[...a.x,value.x],y:[...a.y,value.y],scale:[...a.scale,value.scale],rotate:[...a.rotate,value.rotate],originX:[...a.originX,value.originX]}),{x:[],y:[],scale:[],rotate:[],originX:[]});const calculateScoreAverage=(values,min,max)=>{// 理想値(中央値)`ideal`までの近似度を百分率にしてスコアとする
const calculateScore=(min,max,ideal,value,isRotate=false)=>{const range=max-min;const distance=Math.abs(ideal-value%max*(isRotate?2:1));return 100-distance/range*100};return average(values.map(x=>calculateScore(min,max,median(values),x)))};const scoreAverages=[calculateScoreAverage(value.x,-64,64),calculateScoreAverage(value.y,-64,64),calculateScoreAverage(value.scale,.5,5.5),calculateScoreAverage(value.rotate,0,180,true),calculateScoreAverage(value.originX,45,55)];return Math.round(average(scoreAverages)*10)/10}constructor(){_defineProperty(this,"hue",random());_defineProperty(this,"world",new Entity(".world"));_defineProperty(this,"topText",new Entity(".top .text"));_defineProperty(this,"buttons",new Entity(".buttons"));_defineProperty(this,"saveImageButton",new Entity(".bottom .left.button"));_defineProperty(this,"tweetButton",new Entity(".bottom .center.button"));_defineProperty(this,"resetButton",new Entity(".bottom .right.button"));_defineProperty(this,"animEntities",Object.keys(QUERY_NAME_MAP).map(x=>new Entity(x)));_defineProperty(this,"params",new URLSearchParams(location.href));new Control(this);if(this.params.get("hue")!=null){this.restore()}if(this.params.get("download")!=null){this.downloadImage()}}downloadImage(){this.restore();this.buttons.addClass("hidden");svg2png(this.world.element).then(href=>{Object.assign(document.createElement("a"),{href,download:`akaino-warai_${now()}.png`}).click();close()})}openDownloadWindow(){open(this.resultURL+"&download=")}tweet(){const url=encodeURIComponent(this.resultURL);const score=this.score;const message=score<6?"\u30AD\u30DF\u306F\u4F1D\u8AAC\u306E\u4F4E\u7D1A\u6226\u58EB\u2026\u2026":score<30?"\u3082\u3046\u306A\u3093\u3060\u304B\u3088\u304F\u308F\u304B\u3089\u306A\u3044\uFF01":score<50?"\u3053\u3093\u306A\u6731\u732A\u306B\u306A\u3063\u3061\u3083\u3063\u305F\uFF01":score<70?"\u307E\u3042\u307E\u3042\u306E\u51FA\u6765\uFF01":score<90?"\u30A4\u30A4\u7DDA\u3044\u3063\u3066\u308B\uFF01":score<95?"\u30DF\u30E9\u30AF\u30EB\u30B7\u30E7\u30C3\u30C8\uFF01\u3042\u3068\u4E00\u6B69\uFF01":"\u3053\u3093\u306A\u5B8C\u74A7\u306A\u6731\u732A\u3063\u3066\u3042\u308B\uFF1F\uFF1F\uFF1F";const text=encodeURIComponent(`${score}点！ ${message} 朱猪わらいで朱猪を完成させよう！`);const hashtag=encodeURIComponent("\u6731\u732A\u308F\u3089\u3044");const twitterUrl=`//twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=${hashtag}`;open(twitterUrl,"_blank",`menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=710,height=400`)}reset(){this.hue=random(360);this.animEntities.forEach(x=>x.reset());new Control(this)}restore(){this.hue=this.params.get("hue");this.animEntities.forEach(x=>x.restore());this.world.element.style.setProperty("background-color",this.bgColor);this.topText.updateStyle("stroke",this.accentColor);this.finish();this.updateTopText()}finish(){this.world.addClass("loading");setTimeout(()=>{this.buttons.removeClass("hidden");this.updateTopText(`Score: ${this.score}`)},500)}updateTopText(text=""){this.topText.element.innerHTML=text}}/**
 * コントロールを記述するクラス。
 */class Control{constructor(service){_defineProperty(this,"currentEntity",null);_defineProperty(this,"service",void 0);this.service=service;this.start()}saveImageButtonClick(e){e.stopPropagation();this.service.openDownloadWindow()}tweetButtonClick(e){e.stopPropagation();this.service.tweet()}resetButtonClick(e){e.stopPropagation();this.service.reset()}worldClick(){if(this.currentEntity==null){// 初回
this.service.animEntities.forEach(entity=>this.animate(entity));this.currentEntity=this.service.animEntities[0]}else{// 初回以降
this.currentEntity.updateStyle("stroke",null);this.currentEntity.animation=false;this.currentEntity=this.service.animEntities[this.service.animEntities.indexOf(this.currentEntity)+1]}if(this.currentEntity){// 終了以前
this.service.updateTopText(this.currentEntity.name);this.currentEntity.updateStyle("stroke",this.service.accentColor)}else{// 終了処理
this.service.finish()};}start(){this.service.world.removeClass("loading");this.service.updateTopText("\u30AF\u30EA\u30C3\u30AF\u3059\u308B\u3068\u59CB\u307E\u308B\u3088\uFF01\u2015\u2015 Click to Start!");this.service.world.element.style.setProperty("background-color",this.service.bgColor);this.service.topText.updateStyle("stroke",this.service.accentColor);this.service.buttons.addClass("hidden");this.service.saveImageButton.element.onclick=e=>this.saveImageButtonClick(e);this.service.tweetButton.element.onclick=e=>this.tweetButtonClick(e);this.service.resetButton.element.onclick=e=>this.resetButtonClick(e);this.service.world.element.onclick=()=>this.worldClick()}animate(entity){const update=({origin,x,y,scale,rotate})=>{const dOrigin=50+Math.abs(origin-5);// 45 ~ 55
const dScale=(5+Math.abs(scale-50))/10;// .5 ~ 5.5
const dX=64-Math.abs(128-x);// -64 ~ 64
const dY=64-Math.abs(128-y);// -64 ~ 64
entity.updateStyle("transform",`translate(${dX}px, ${dY}px) scale(${dScale}) rotate(${rotate}deg)`);entity.updateStyle("transform-origin",`${dOrigin}px 40px`);origin=(origin+1)%10;x=(x+7)%256;y=(y+3)%256;scale=(scale+1)%100;rotate=(rotate+9)%360;if(entity.animation){requestAnimationFrame(()=>update({origin,x,y,scale,rotate}))}};entity.animation=true;update({origin:random(10),x:random(256),y:random(256),scale:random(100),rotate:random(360)})}};addEventListener("load",async load=>new Service);/**
 * 渡されたSVGのcomputedStyleを計算して、Promise<DataURI>として返却する関数。
 *
 * {@link https://qiita.com/Nikkely/items/aa485ebdbec51e49ecbc}
 */const svg2png=svg=>{const clonedSvg=svg.cloneNode(false);const queue=[[svg,clonedSvg]];clonedSvg.version=1.1;clonedSvg.xmlns="http://www.w3.org/2000/svg";while(queue.length!==0){const[rEle,vEle]=queue.pop();const computedStyle=window.getComputedStyle(rEle,"");const rChildren=rEle.children;for(let property of computedStyle){vEle.style[property]=computedStyle.getPropertyValue(property)}if(rChildren.length!==0){for(let rChild of rChildren){const vChild=rChild.cloneNode(false);vEle.appendChild(vChild);queue.push([rChild,vChild])}}else{vEle.innerHTML=rEle.innerHTML}}const serializedSvg=new XMLSerializer().serializeToString(clonedSvg);const size={width:svg.width.baseVal.value,height:svg.height.baseVal.value};const canvas=Object.assign(document.createElement("canvas"),size);const ctx=canvas.getContext("2d");const image=new Image;return new Promise((resolve,reject)=>{image.onload=()=>{ctx.drawImage(image,0,0);resolve(canvas.toDataURL("image/png"))};image.onerror=e=>reject(e);image.src="data:image/svg+xml;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(serializedSvg)))})};
