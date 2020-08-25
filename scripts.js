function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}const random=(a=100)=>Math.round(Math.random()*a),average=a=>a.reduce((c,a)=>c+a,0)/a.length,median=a=>{const b=0|a.length/2,c=a.slice().sort((c,a)=>c<a?-1:a<c?1:0);return c.length%2?c[b]:(c[b-1]+c[b])/2},now=()=>new Date().toLocaleString("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"numeric"}).replace(/\D/g,""),QUERY_NAME_MAP={".body :nth-child(1)":"1 / 23",".body :nth-child(2)":"2 / 23",".body :nth-child(3)":"3 / 23",".body :nth-child(4)":"4 / 23",".body :nth-child(5)":"5 / 23",".body :nth-child(6)":"6 / 23",".body :nth-child(7)":"7 / 23",".body :nth-child(8)":"8 / 23",".body :nth-child(9)":"9 / 23",".body :nth-child(10)":"10 / 23",".body :nth-child(11)":"11 / 23",".body :nth-child(12)":"12 / 23",".body :nth-child(13)":"13 / 23",".body :nth-child(14)":"14 / 23",".body :nth-child(15)":"15 / 23",".body :nth-child(16)":"16 / 23",".body :nth-child(17)":"17 / 23",".body :nth-child(18)":"18 / 23",".body :nth-child(19)":"19 / 23",".body :nth-child(20)":"20 / 23",".body :nth-child(21)":"21 / 23",".body :nth-child(22)":"22 / 23",".body :nth-child(22)":"23 / 23"};class Entity{get searchParams(){const a=new URLSearchParams;return Entity.RESTORABLE_ATTRIBUTES.map(a=>[a,this.element.style.getPropertyValue(a)]).forEach(([b,c])=>c&&a.append(`${this.uniqQuery}:${b}`,c)),a}get value(){const a=a=>(a||"").split(/[^0-9^\\.]/).filter(Boolean).map(Number),[b,c,d,e]=a(this.element.style.getPropertyValue("transform")),[f,g]=a(this.element.style.getPropertyValue("transform-origin"));return{x:b,y:c,scale:d,rotate:e,originX:f,originY:g}}constructor(a){_defineProperty(this,"uniqQuery",void 0),_defineProperty(this,"name",void 0),_defineProperty(this,"element",void 0),_defineProperty(this,"animation",!1),this.uniqQuery=a,this.name=QUERY_NAME_MAP[a]||"",this.element=document.querySelector(a)}removeClass(...a){this.element.classList.remove(a)}addClass(...a){this.element.classList.add(a)}updateStyle(a,b){this.element.style.setProperty(a,b)}reset(){this.updateStyle("transform",`translate(0px, 0px) scale(1) rotate(0deg)`),this.updateStyle("transform-origin",`60px 70px`)}restore(){const a=Object.fromEntries(new URLSearchParams(location.search));Entity.RESTORABLE_ATTRIBUTES.forEach(b=>{const c=a[`${this.uniqQuery}:${b}`];c&&this.updateStyle(b,c),location.search.includes("%2C")||this.element.setAttribute(b,c)})}}_defineProperty(Entity,"RESTORABLE_ATTRIBUTES",["stroke","transform","transform-origin"]);class Service{get bgColor(){return`hsl(${this.hue}, 100%, 70%)`}get accentColor(){return`hsl(${(this.hue-90)%360}, 100%, 40%)`}get resultURL(){const a=new URLSearchParams;this.animEntities.forEach(b=>[...b.searchParams].forEach(([b,c])=>a.append(b,c))),a.append("hue",this.hue);const b=location.href.replace(/(?!.*\/).*/,"");return`${b}?${a}`}get score(){const a=this.animEntities.reduce((b,{value:a})=>({x:[...b.x,a.x],y:[...b.y,a.y],scale:[...b.scale,a.scale],rotate:[...b.rotate,a.rotate],originX:[...b.originX,a.originX]}),{x:[],y:[],scale:[],rotate:[],originX:[]}),b=(a,b,c)=>{const d=(a,b,c,d,e=!1)=>{const f=Math.abs(c-d%b*(e?2:1));return 100-100*(f/(b-a))};return average(a.map(e=>d(b,c,median(a),e)))},c=[b(a.x,-64,64),b(a.y,-64,64),b(a.scale,.8,1.2),b(a.rotate,0,180,!0),b(a.originX,55,65)];return Math.round(10*average(c))/10}constructor(){_defineProperty(this,"hue",random()),_defineProperty(this,"world",new Entity(".world")),_defineProperty(this,"topText",new Entity(".top .text")),_defineProperty(this,"buttons",new Entity(".buttons")),_defineProperty(this,"saveImageButton",new Entity(".bottom .left.button")),_defineProperty(this,"tweetButton",new Entity(".bottom .center.button")),_defineProperty(this,"resetButton",new Entity(".bottom .right.button")),_defineProperty(this,"animEntities",Object.keys(QUERY_NAME_MAP).map(a=>new Entity(a))),_defineProperty(this,"params",new URLSearchParams(location.href)),new Control(this),null!=this.params.get("hue")&&this.restore(),null!=this.params.get("download")&&this.downloadImage()}downloadImage(){this.restore(),this.buttons.addClass("hidden"),svg2png(this.world.element).then(a=>{Object.assign(document.createElement("a"),{href:a,download:`inochi-warai_${now()}.png`}).click(),close()})}openDownloadWindow(){open(this.resultURL+"&download=")}tweet(){const a=encodeURIComponent(this.resultURL),b=this.score,c=6>b?"\uFF7C\uFF83\u2026\u2026 \uFF9B\uFF7C\uFF83\u2026\u2026":30>b?"\u8F1D\u3044\u3066\u3044\u306A\u3044":50>b?"\u306A\u305C\uFF1F":70>b?"\u7D30\u80DE\uFF01":90>b?"\u592A\u967D\uFF01":95>b?"\u3044\u306E\u3061\uFF01":"\u3044\u306E\u3061\u306E\u8F1D\u304D\uFF01",d=encodeURIComponent(`${b}点！ ${c} キミもいのちを輝かせよう！`),e=encodeURIComponent("\u3044\u306E\u3061\u306E\u8F1D\u304D\u308F\u3089\u3044");open(`//twitter.com/intent/tweet?text=${d}&url=${a}&hashtags=${e}`,"_blank",`menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=710,height=400`)}reset(){this.hue=random(360),this.animEntities.forEach(a=>a.reset()),new Control(this)}restore(){this.hue=this.params.get("hue"),this.animEntities.forEach(a=>a.restore()),this.world.element.style.setProperty("background-color",this.bgColor),this.topText.updateStyle("stroke",this.accentColor),this.finish(),this.updateTopText()}finish(){this.world.element.onclick=this.world.element.onkeyup=null,this.world.addClass("loading"),setTimeout(()=>{this.buttons.removeClass("hidden"),this.updateTopText(`Score: ${this.score}`)},500)}updateTopText(a=""){this.topText.element.innerHTML=a}}class Control{constructor(a){_defineProperty(this,"currentEntity",null),_defineProperty(this,"service",void 0),this.service=a,this.start()}saveImageButtonClick(a){a.stopPropagation(),this.service.openDownloadWindow()}tweetButtonClick(a){a.stopPropagation(),this.service.tweet()}resetButtonClick(a){a.stopPropagation(),this.service.reset()}nextStep(){null==this.currentEntity?(this.service.animEntities.forEach(a=>this.animate(a)),this.currentEntity=this.service.animEntities[0]):(this.currentEntity.updateStyle("stroke",null),this.currentEntity.animation=!1,this.currentEntity=this.service.animEntities[this.service.animEntities.indexOf(this.currentEntity)+1]),this.currentEntity?(this.service.updateTopText(this.currentEntity.name),this.currentEntity.updateStyle("stroke",this.service.accentColor)):this.service.finish()}start(){this.service.world.element.focus(),this.service.world.removeClass("loading"),this.service.updateTopText("\u30AF\u30EA\u30C3\u30AF\u3059\u308B\u3068\u59CB\u307E\u308B\u3088\uFF01\u2015\u2015 Click to Start!"),this.service.world.element.style.setProperty("background-color",this.service.bgColor),this.service.topText.updateStyle("stroke",this.service.accentColor),this.service.buttons.addClass("hidden"),this.service.saveImageButton.element.onclick=a=>this.saveImageButtonClick(a),this.service.tweetButton.element.onclick=a=>this.tweetButtonClick(a),this.service.resetButton.element.onclick=a=>this.resetButtonClick(a),this.service.world.element.onclick=()=>this.nextStep(),this.service.world.element.onkeyup=()=>this.nextStep()}animate(a){var b=Math.abs;const c=({origin:d,x:e,y:f,scale:g,rotate:h})=>{const i=60+b(d-5),j=(8+b(g-4))/10,k=64-b(64-e),l=64-b(64-f);a.updateStyle("transform",`translate(${k}px, ${l}px) scale(${j}) rotate(${h}deg)`),a.updateStyle("transform-origin",`${i}px 70px`),d=(d+1)%10,e=(e+7)%128,f=(f+3)%128,g=(g+1)%8,h=(h+9)%360,a.animation&&setTimeout(()=>requestAnimationFrame(()=>c({origin:d,x:e,y:f,scale:g,rotate:h})),30)};a.animation=!0,c({origin:random(10),x:random(128),y:random(128),scale:random(4),rotate:random(360)})}}addEventListener("load",async()=>new Service);const svg2png=a=>{const b=a.cloneNode(!1),c=[[a,b]];for(b.version=1.1,b.xmlns="http://www.w3.org/2000/svg";0!==c.length;){const[a,b]=c.pop(),d=window.getComputedStyle(a,""),e=a.children;for(let a of d)b.style[a]=d.getPropertyValue(a);if(0!==e.length)for(let a of e){const d=a.cloneNode(!1);b.appendChild(d),c.push([a,d])}else b.innerHTML=a.innerHTML}const d=new XMLSerializer().serializeToString(b),e={width:a.width.baseVal.value,height:a.height.baseVal.value},f=Object.assign(document.createElement("canvas"),e),g=f.getContext("2d"),h=new Image;return new Promise((a,b)=>{h.onload=()=>{g.drawImage(h,0,0),a(f.toDataURL("image/png"))},h.onerror=a=>b(a),h.src="data:image/svg+xml;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(d)))})};
