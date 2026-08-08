"use strict";
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
/* ---------- progress + nav ---------- */
addEventListener("scroll",()=>{const h=document.documentElement;$("#progress").style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+"%";
  const ids=["light","refraction","dispersion","lab","world","pool","gallery","quiz"];let cur="";
  ids.forEach(id=>{const el=document.getElementById(id);if(el&&el.getBoundingClientRect().top<innerHeight*.4)cur=id});
  $$("#menu a").forEach(a=>a.classList.toggle("on",a.getAttribute("href")==="#"+cur));},{passive:true});
$("#burger").onclick=()=>$("#menu").classList.toggle("open");
$$("#menu a").forEach(a=>a.onclick=()=>$("#menu").classList.remove("open"));
/* ---------- cursor glow ---------- */
if(matchMedia("(pointer:fine)").matches){addEventListener("mousemove",e=>{const g=$("#cursorGlow");g.style.left=e.clientX+"px";g.style.top=e.clientY+"px";});}
/* ---------- photon background ---------- */
const pc=$("#photons"),px=pc.getContext("2d");let PW,PH,parts=[];
const PAL=["#ff5252","#ff9e3d","#ffe066","#3ddc84","#4da6ff","#6b7bff","#b06bff"];
function sizePC(){PW=pc.width=innerWidth;PH=pc.height=innerHeight;}
sizePC();addEventListener("resize",sizePC);
for(let i=0;i<70;i++)parts.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*2+.6,s:Math.random()*.5+.15,c:PAL[i%7],p:Math.random()*6.28});
(function loop(){px.clearRect(0,0,PW,PH);const t=Date.now()/1000;
  parts.forEach(p=>{p.y-=p.s;if(p.y<-5){p.y=PH+5;p.x=Math.random()*PW}
    const a=.25+.35*Math.abs(Math.sin(t+p.p));px.globalAlpha=a;px.fillStyle=p.c;px.beginPath();px.arc(p.x,p.y,p.r,0,7);px.fill();});
  px.globalAlpha=1;requestAnimationFrame(loop);})();
/* ---------- reveal ---------- */
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add("in")),{threshold:.12});
$$(".reveal").forEach(el=>io.observe(el));
/* ---------- tilt ---------- */
$$(".tilt").forEach(c=>{c.addEventListener("mousemove",e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`translateY(-6px) rotateX(${-y*7}deg) rotateY(${x*7}deg)`;});c.addEventListener("mouseleave",()=>c.style.transform="");});
/* ---------- EM bar ---------- */
$$("#emBar .seg").forEach(s=>{const f=()=>{$("#emInfoT").textContent=s.dataset.t;$("#emInfoD").textContent=s.dataset.d;};s.addEventListener("mouseenter",f);s.addEventListener("click",f);});
/* ---------- visible explorer ---------- */
function wl2rgb(w){let r,g,b;if(w<440){r=(440-w)/60;g=0;b=1}else if(w<490){r=0;g=(w-440)/50;b=1}else if(w<510){r=0;g=1;b=(510-w)/20}else if(w<585){r=(w-510)/75;g=1;b=0}else if(w<645){r=1;g=(645-w)/60;b=0}else{r=1;g=0;b=0}
  const f=w>700?.35+.65*(780-w)/80:w<420?.35+.65*(w-380)/40:1;
  return [r*f,g*f,b*f].map(v=>Math.round(v*255));}
function colName(w){return w<450?"violet":w<485?"blue":w<500?"cyan-blue":w<530?"green":w<565?"green-yellow":w<590?"yellow":w<625?"orange":"red";}
$("#visBar").addEventListener("mousemove",e=>{const r=e.currentTarget.getBoundingClientRect(),t=Math.min(1,Math.max(0,(e.clientX-r.left)/r.width)),w=Math.round(380+t*370),[R,G,B]=wl2rgb(w);
  $("#visMark").style.left=(t*100)+"%";$("#visNm").textContent=w+" nm";$("#visCol").textContent="· "+colName(w);
  $("#visHz").textContent="≈ "+Math.round(299792/w*10)/10+" THz · E ≈ "+(1240/w).toFixed(2)+" eV";
  $("#visSwatch").style.background=`rgb(${R},${G},${B})`;});
/* ---------- refraction demo ---------- */
const rc=$("#refCanvas"),rx=rc.getContext("2d");
function drawRef(){const th1=+$("#refAngle").value,n=+$("#refMedium").value,W=rc.width,H=rc.height,cx=W/2,cy=H/2;
  rx.clearRect(0,0,W,H);
  rx.fillStyle="rgba(77,166,255,.10)";rx.fillRect(0,cy,W,H-cy);
  rx.strokeStyle="rgba(255,255,255,.25)";rx.beginPath();rx.moveTo(0,cy);rx.lineTo(W,cy);rx.stroke();
  rx.setLineDash([6,8]);rx.strokeStyle="rgba(255,255,255,.3)";rx.beginPath();rx.moveTo(cx,20);rx.lineTo(cx,H-20);rx.stroke();rx.setLineDash([]);
  const a1=th1*Math.PI/180,a2=Math.asin(Math.sin(a1)/n),L=200;
  rx.lineWidth=3;rx.strokeStyle="#fff";rx.shadowColor="#fff";rx.shadowBlur=8;
  rx.beginPath();rx.moveTo(cx-Math.sin(a1)*L,cy-Math.cos(a1)*L);rx.lineTo(cx,cy);rx.stroke();
  rx.shadowBlur=0;rx.strokeStyle="rgba(255,255,255,.35)";rx.beginPath();rx.moveTo(cx,cy);rx.lineTo(cx+Math.sin(a1)*L*.7,cy-Math.cos(a1)*L*.7);rx.stroke();
  const g=rx.createLinearGradient(cx,cy,cx+Math.sin(a2)*L,cy+Math.cos(a2)*L);g.addColorStop(0,"#ffe066");g.addColorStop(1,"#b06bff");
  rx.strokeStyle=g;rx.shadowColor="#b06bff";rx.shadowBlur=8;rx.beginPath();rx.moveTo(cx,cy);rx.lineTo(cx+Math.sin(a2)*L,cy+Math.cos(a2)*L);rx.stroke();rx.shadowBlur=0;
  rx.fillStyle="#9aa3c7";rx.font="13px Space Grotesk";rx.fillText("air (n≈1)",12,cy-12);rx.fillText("medium (n="+n.toFixed(2)+")",12,cy+22);
  rx.fillText("θ₁="+th1+"°",cx+14,cy-60);rx.fillText("θ₂="+Math.round(a2*180/Math.PI)+"°",cx+14,cy+74);
  $("#roT1").textContent=th1+"°";$("#roT2").textContent=Math.round(a2*180/Math.PI)+"°";$("#roN").textContent=n.toFixed(2);
  $("#roV").textContent=(3/n).toFixed(2)+"×10⁸";}
$("#refAngle").oninput=drawRef;$("#refMedium").onchange=drawRef;drawRef();
/* ---------- prism lab ---------- */
const CO=[["Red",656,"#ff5252"],["Orange",610,"#ff9e3d"],["Yellow",580,"#ffe066"],["Green",530,"#3ddc84"],["Blue",470,"#4da6ff"],["Indigo",440,"#6b7bff"],["Violet",410,"#b06bff"]];
const MED={water:[1.324,.0033],glass:[1.504,.0042],diamond:[2.382,.0122]};
const cauchy=(m,l)=>{const[A,B]=MED[m],u=l/1000;return A+B/(u*u);};
const lc=$("#labCanvas"),lx=lc.getContext("2d");
function drawLab(){const m=$("#labMedium").value,A=+$("#labApex").value,tilt=+$("#labTilt").value,W=lc.width,H=lc.height;
  lx.clearRect(0,0,W,H);
  const h=270,apex=[W/2-40,80],hb=h*Math.tan(A*Math.PI/360),bl=[apex[0]-hb,apex[1]+h],br=[apex[0]+hb,apex[1]+h];
  const P1=[(apex[0]+bl[0])/2,(apex[1]+bl[1])/2],P2=[(apex[0]+br[0])/2,(apex[1]+br[1])/2];
  lx.lineWidth=3;lx.strokeStyle="#fff";lx.shadowColor="#fff";lx.shadowBlur=9;
  lx.beginPath();lx.moveTo(30,P1[1]-30+tilt*2);lx.lineTo(P1[0],P1[1]);lx.stroke();lx.shadowBlur=0;
  const pg=lx.createLinearGradient(0,apex[1],0,bl[1]);pg.addColorStop(0,"rgba(255,255,255,.10)");pg.addColorStop(1,"rgba(176,107,255,.10)");
  lx.fillStyle=pg;lx.beginPath();lx.moveTo(...apex);lx.lineTo(...bl);lx.lineTo(...br);lx.closePath();lx.fill();
  lx.strokeStyle="rgba(255,255,255,.5)";lx.stroke();
  lx.strokeStyle="rgba(255,255,255,.3)";lx.beginPath();lx.moveTo(...P1);lx.lineTo(...P2);lx.stroke();
  const dev={};CO.forEach(c=>dev[c[0]]=(cauchy(m,c[1])-1)*A);
  const base=(16+tilt)*Math.PI/180,dg=dev["Green"],EX=6;let rows="";
  CO.forEach((c,i)=>{const d=(dev[c[0]]-dg)*EX*Math.PI/180+base,ex=P2[0]+Math.cos(d)*430,ey=P2[1]+Math.sin(d)*430;
    lx.strokeStyle=c[2];lx.lineWidth=2.5;lx.shadowColor=c[2];lx.shadowBlur=7;
    lx.beginPath();lx.moveTo(...P2);lx.lineTo(ex,ey);lx.stroke();lx.shadowBlur=0;
    rows+=`<tr><td><span class="dot" style="background:${c[2]}"></span>${c[0]}</td><td>${c[1]} nm</td><td><b>${cauchy(m,c[1]).toFixed(4)}</b></td><td>${dev[c[0]].toFixed(2)}°</td></tr>`;});
  lx.fillStyle="#9aa3c7";lx.font="12px Space Grotesk";lx.fillText("white beam",34,P1[1]-40+tilt*2);
  $("#labSpread").textContent=(dev["Violet"]-dev["Red"]).toFixed(2)+"°";
  $("#labDRed").textContent=dev["Red"].toFixed(1)+"°";$("#labDVio").textContent=dev["Violet"].toFixed(1)+"°";
  $("#labTable").innerHTML=`<table><tr><th>Colour</th><th>λ</th><th>n (Cauchy)</th><th>δ (thin prism)</th></tr>${rows}</table>`;}
["labMedium","labApex","labTilt"].forEach(id=>document.getElementById(id).addEventListener("input",drawLab));drawLab();
/* ---------- pool simulator ---------- */
function pool(){const I=+$("#pSun").value,A=+$("#pArea").value,F=+$("#pFlow").value,Ti=+$("#pTin").value,e=+$("#pCover").value;
  const P=I*A*e,md=F/60,dT=P/(md*4186),To=Ti+dT;
  $("#oPower").textContent=Math.round(P)+" W";$("#oDelta").textContent="+"+dT.toFixed(2)+" °C";$("#oTout").textContent=To.toFixed(1)+" °C";
  $("#thermFill").style.width=Math.min(100,dT/4*100)+"%";
  const E6=P*6*3600,dp=E6/(20000*4186);
  $("#oPool").textContent=`Running 6 h on a 20 m³ (20 000 L) pool ≈ +${dp.toFixed(2)} °C of whole‑pool warming. Physics note: P = I·A·η and ΔT = P/(ṁ·c), c = 4186 J/kg·K.`;}
["pSun","pArea","pFlow","pTin","pCover"].forEach(id=>document.getElementById(id).addEventListener("input",pool));pool();
/* ---------- uploader ---------- */
const drop=$("#drop"),fin=$("#fileIn");
drop.onclick=()=>fin.click();
drop.ondragover=e=>{e.preventDefault();drop.classList.add("over")};
drop.ondragleave=()=>drop.classList.remove("over");
drop.ondrop=e=>{e.preventDefault();drop.classList.remove("over");addFiles(e.dataTransfer.files)};
fin.onchange=()=>addFiles(fin.files);
function addFiles(files){[...files].filter(f=>f.type.startsWith("image/")).forEach(f=>{const r=new FileReader();
  r.onload=()=>{const fig=document.createElement("figure");fig.className="shot";
    fig.innerHTML=`<img src="${r.result}" alt=""><figcaption><span>${f.name.replace(/\.[^.]+$/,"")}</span><button title="remove">🗑</button></figcaption>`;
    fig.querySelector("img").onclick=()=>{ $("#lbImg").src=r.result;$("#lbCap").textContent=f.name;$("#lightbox").classList.add("open");};
    fig.querySelector("button").onclick=ev=>{ev.stopPropagation();fig.remove();};
    $("#shots").appendChild(fig);};
  r.readAsDataURL(f);});}
$("#lbClose").onclick=()=>$("#lightbox").classList.remove("open");
$("#lightbox").onclick=e=>{if(e.target.id==="lightbox")e.target.classList.remove("open")};
addEventListener("keydown",e=>{if(e.key==="Escape")$("#lightbox").classList.remove("open")});
/* ---------- quiz ---------- */
const QS=[
 {q:"What is luminous dispersion?",o:["The splitting of white light into its component colours","The reflection of light on a mirror","The absorption of light by a black surface","The bending of light around obstacles"],a:0,e:"Dispersion is the separation of white light into its spectrum because each wavelength is refracted by a different amount."},
 {q:"Which law governs the bending of light between two media?",o:["Ohm's law","Snell's law — n₁sinθ₁ = n₂sinθ₂","Newton's second law","Coulomb's law"],a:1,e:"Snell's law relates the angles to the refractive indices of the two media."},
 {q:"In glass, which colour is refracted the MOST?",o:["Red","Yellow","Green","Violet"],a:3,e:"Violet has the shortest wavelength, the highest n, and therefore bends the most."},
 {q:"Why are solar pool collectors black?",o:["Black looks cleaner","Black absorbs all visible wavelengths and converts them to heat","Black reflects infrared","Black refracts light more"],a:1,e:"A black surface absorbs the whole visible spectrum — the opposite of dispersion — maximising heating."},
 {q:"A rainbow forms because raindrops…",o:["reflect light only","refract, disperse and internally reflect sunlight","absorb UV light","polarise light"],a:1,e:"Each drop refracts on entry, disperses inside, reflects on the back and refracts again on exit."},
 {q:"The refractive index of a material depends on…",o:["the wavelength of light","the temperature of the observer","the size of the prism","nothing — it is always constant"],a:0,e:"n = f(λ), approximated by Cauchy's equation n(λ) = A + B/λ²."},
 {q:"A pool looks shallower than it is because of…",o:["dispersion","reflection","refraction at the water surface","diffraction"],a:2,e:"Light leaving the water bends away from the normal, lifting the apparent position of the bottom."}];
let qi=0,qs=0;
function renderQ(){if(qi>=QS.length){$("#quizBox").innerHTML=`<p class="q">🎉 Result</p><p id="qScore" class="bigT" style="font-size:2rem">${qs} / ${QS.length}</p><p id="qFeed">${qs===QS.length?"Perfect! Newton would be proud.":qs>=4?"Great — you truly understood the spectrum!":"Review the sections and try again — the prism awaits."}</p><button class="btn solid" onclick="location.reload()">Restart</button>`;return;}
  const q=QS[qi];$("#quizBox").innerHTML=`<p class="q">Q${qi+1}/${QS.length} — ${q.q}</p>`+q.o.map((o,i)=>`<button class="qopt" data-i="${i}">${o}</button>`).join("")+`<p id="qFeed"></p><p style="color:var(--muted);font-size:.8rem">Score: ${qs}</p>`;
  $$(".qopt").forEach(b=>b.onclick=()=>{const i=+b.dataset.i,ok=i===q.a;
    $$(".qopt").forEach(x=>{x.disabled=true;if(+x.dataset.i===q.a)x.classList.add("ok")});
    if(!ok)b.classList.add("no");if(ok)qs++;
    $("#qFeed").innerHTML=(ok?"✅ Correct! ":"❌ Not quite. ")+q.e;
    setTimeout(()=>{qi++;renderQ();},2600);});}
renderQ();