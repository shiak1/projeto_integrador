"use strict";
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const br=v=>String(v).replace(".",","); /* vírgula decimal brasileira */

/* ---------- barra de progresso + menu ---------- */
addEventListener("scroll",()=>{
  const h=document.documentElement;
  $("#progress").style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+"%";
  const ids=["light","refraction","dispersion","lab","world","pool","gallery","quiz"];
  let cur="";
  ids.forEach(id=>{const el=document.getElementById(id);if(el&&el.getBoundingClientRect().top<innerHeight*.4)cur=id;});
  $$("#menu a").forEach(a=>a.classList.toggle("on",a.getAttribute("href")==="#"+cur));
},{passive:true});
$("#burger").onclick=()=>$("#menu").classList.toggle("open");
$$("#menu a").forEach(a=>a.onclick=()=>$("#menu").classList.remove("open"));

/* ---------- brilho do cursor ---------- */
if(matchMedia("(pointer:fine)").matches){
  addEventListener("mousemove",e=>{const g=$("#cursorGlow");g.style.left=e.clientX+"px";g.style.top=e.clientY+"px";});
}

/* ---------- fundo de fótons ---------- */
const pc=$("#photons"),px=pc.getContext("2d");let PW,PH;const parts=[];
const PAL=["#ff5252","#ff9e3d","#ffe066","#3ddc84","#4da6ff","#6b7bff","#b06bff"];
function sizePC(){PW=pc.width=innerWidth;PH=pc.height=innerHeight;}
sizePC();addEventListener("resize",sizePC);
for(let i=0;i<70;i++)parts.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*2+.6,s:Math.random()*.5+.15,c:PAL[i%7],p:Math.random()*6.28});
(function loop(){
  px.clearRect(0,0,PW,PH);const t=Date.now()/1000;
  parts.forEach(p=>{p.y-=p.s;if(p.y<-5){p.y=PH+5;p.x=Math.random()*PW;}
    px.globalAlpha=.25+.35*Math.abs(Math.sin(t+p.p));px.fillStyle=p.c;
    px.beginPath();px.arc(p.x,p.y,p.r,0,7);px.fill();});
  px.globalAlpha=1;requestAnimationFrame(loop);
})();

/* ---------- animações de entrada ---------- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("in");}),{threshold:.12});
$$(".reveal").forEach(el=>io.observe(el));

/* ---------- efeito tilt ---------- */
$$(".tilt").forEach(c=>{
  c.addEventListener("mousemove",e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    c.style.transform="translateY(-6px) rotateX("+(-y*7)+"deg) rotateY("+(x*7)+"deg)";});
  c.addEventListener("mouseleave",()=>{c.style.transform="";});
});

/* ---------- espectro eletromagnético ---------- */
$$("#emBar .seg").forEach(s=>{
  const f=()=>{$("#emInfoT").textContent=s.dataset.t;$("#emInfoD").textContent=s.dataset.d;};
  s.addEventListener("mouseenter",f);s.addEventListener("click",f);
});

/* ---------- explorador da faixa visível ---------- */
function wl2rgb(w){
  let r=0,g=0,b=0;
  if(w<440){r=(440-w)/60;b=1;}
  else if(w<490){g=(w-440)/50;b=1;}
  else if(w<510){g=1;b=(510-w)/20;}
  else if(w<585){r=(w-510)/75;g=1;}
  else if(w<645){r=1;g=(645-w)/60;}
  else{r=1;}
  const f=w>700?.35+.65*(780-w)/80:(w<420?.35+.65*(w-380)/40:1);
  return [r*f,g*f,b*f].map(v=>Math.round(v*255));
}
function colName(w){return w<450?"violeta":w<485?"azul":w<500?"ciano":w<530?"verde":w<565?"verde-amarelo":w<590?"amarelo":w<625?"laranja":"vermelho";}
$("#visBar").addEventListener("mousemove",e=>{
  const r=e.currentTarget.getBoundingClientRect();
  const t=Math.min(1,Math.max(0,(e.clientX-r.left)/r.width));
  const w=Math.round(380+t*370),rgb=wl2rgb(w);
  $("#visMark").style.left=(t*100)+"%";
  $("#visNm").textContent=w+" nm";
  $("#visCol").textContent="· "+colName(w);
  $("#visHz").textContent="≈ "+br(Math.round(299792/w*10)/10)+" THz · E ≈ "+br((1240/w).toFixed(2))+" eV";
  $("#visSwatch").style.background="rgb("+rgb[0]+","+rgb[1]+","+rgb[2]+")";
});

/* ---------- simulador de refração ---------- */
const rc=$("#refCanvas"),rx=rc.getContext("2d");
function drawRef(){
  const th1=+$("#refAngle").value,n=+$("#refMedium").value;
  const W=rc.width,H=rc.height,cx=W/2,cy=H/2;
  rx.clearRect(0,0,W,H);
  rx.fillStyle="rgba(77,166,255,.10)";rx.fillRect(0,cy,W,H-cy);
  rx.strokeStyle="rgba(255,255,255,.25)";rx.beginPath();rx.moveTo(0,cy);rx.lineTo(W,cy);rx.stroke();
  rx.setLineDash([6,8]);rx.strokeStyle="rgba(255,255,255,.3)";rx.beginPath();rx.moveTo(cx,20);rx.lineTo(cx,H-20);rx.stroke();rx.setLineDash([]);
  const a1=th1*Math.PI/180,a2=Math.asin(Math.sin(a1)/n),L=200;
  rx.lineWidth=3;rx.strokeStyle="#fff";rx.shadowColor="#fff";rx.shadowBlur=8;
  rx.beginPath();rx.moveTo(cx-Math.sin(a1)*L,cy-Math.cos(a1)*L);rx.lineTo(cx,cy);rx.stroke();
  rx.shadowBlur=0;rx.strokeStyle="rgba(255,255,255,.35)";
  rx.beginPath();rx.moveTo(cx,cy);rx.lineTo(cx+Math.sin(a1)*L*.7,cy-Math.cos(a1)*L*.7);rx.stroke();
  const g=rx.createLinearGradient(cx,cy,cx+Math.sin(a2)*L,cy+Math.cos(a2)*L);
  g.addColorStop(0,"#ffe066");g.addColorStop(1,"#b06bff");
  rx.strokeStyle=g;rx.shadowColor="#b06bff";rx.shadowBlur=8;
  rx.beginPath();rx.moveTo(cx,cy);rx.lineTo(cx+Math.sin(a2)*L,cy+Math.cos(a2)*L);rx.stroke();rx.shadowBlur=0;
  rx.fillStyle="#9aa3c7";rx.font="13px Space Grotesk";
  rx.fillText("ar (n≈1)",12,cy-12);
  rx.fillText("meio (n="+br(n.toFixed(2))+")",12,cy+22);
  rx.fillText("θ₁="+th1+"°",cx+14,cy-60);
  rx.fillText("θ₂="+Math.round(a2*180/Math.PI)+"°",cx+14,cy+74);
  $("#roT1").textContent=th1+"°";
  $("#roT2").textContent=Math.round(a2*180/Math.PI)+"°";
  $("#roN").textContent=br(n.toFixed(2));
  $("#roV").textContent=br((3/n).toFixed(2))+"×10⁸";
}
$("#refAngle").addEventListener("input",drawRef);
$("#refMedium").addEventListener("change",drawRef);
drawRef();

/* ---------- laboratório do prisma ---------- */
const CO=[
  ["Vermelho",656,"#ff5252"],["Laranja",610,"#ff9e3d"],["Amarelo",580,"#ffe066"],
  ["Verde",530,"#3ddc84"],["Azul",470,"#4da6ff"],["Anil",440,"#6b7bff"],["Violeta",410,"#b06bff"]
];
const MED={water:[1.324,.0033],glass:[1.504,.0042],diamond:[2.382,.0122]};
function cauchy(m,l){const c=MED[m],u=l/1000;return c[0]+c[1]/(u*u);}
const lc=$("#labCanvas"),lx=lc.getContext("2d");
function drawLab(){
  const m=$("#labMedium").value,A=+$("#labApex").value,tilt=+$("#labTilt").value;
  const W=lc.width,H=lc.height;
  lx.clearRect(0,0,W,H);
  const h=270,apex=[W/2-40,80],hb=h*Math.tan(A*Math.PI/360);
  const bl=[apex[0]-hb,apex[1]+h],brt=[apex[0]+hb,apex[1]+h]; /* "brt" evita choque com br() */
  const P1=[(apex[0]+bl[0])/2,(apex[1]+bl[1])/2],P2=[(apex[0]+brt[0])/2,(apex[1]+brt[1])/2];
  lx.lineWidth=3;lx.strokeStyle="#fff";lx.shadowColor="#fff";lx.shadowBlur=9;
  lx.beginPath();lx.moveTo(30,P1[1]-30+tilt*2);lx.lineTo(P1[0],P1[1]);lx.stroke();lx.shadowBlur=0;
  const pg=lx.createLinearGradient(0,apex[1],0,bl[1]);
  pg.addColorStop(0,"rgba(255,255,255,.10)");pg.addColorStop(1,"rgba(176,107,255,.10)");
  lx.fillStyle=pg;lx.beginPath();lx.moveTo(apex[0],apex[1]);lx.lineTo(bl[0],bl[1]);lx.lineTo(brt[0],brt[1]);lx.closePath();lx.fill();
  lx.strokeStyle="rgba(255,255,255,.5)";lx.stroke();
  lx.strokeStyle="rgba(255,255,255,.3)";lx.beginPath();lx.moveTo(P1[0],P1[1]);lx.lineTo(P2[0],P2[1]);lx.stroke();
  const dev={};CO.forEach(c=>{dev[c[0]]=(cauchy(m,c[1])-1)*A;});
  const dGreen=(cauchy(m,530)-1)*A, dRed=(cauchy(m,656)-1)*A, dViolet=(cauchy(m,410)-1)*A;
  const base=(16+tilt)*Math.PI/180,EX=6;
  let rows="";
  CO.forEach(c=>{
    const d=(dev[c[0]]-dGreen)*EX*Math.PI/180+base;
    const ex=P2[0]+Math.cos(d)*430,ey=P2[1]+Math.sin(d)*430;
    lx.strokeStyle=c[2];lx.lineWidth=2.5;lx.shadowColor=c[2];lx.shadowBlur=7;
    lx.beginPath();lx.moveTo(P2[0],P2[1]);lx.lineTo(ex,ey);lx.stroke();lx.shadowBlur=0;
    rows+="<tr><td><span class='dot' style='background:"+c[2]+"'></span>"+c[0]+"</td><td>"+c[1]+" nm</td><td><b>"+br(cauchy(m,c[1]).toFixed(4))+"</b></td><td>"+br(dev[c[0]].toFixed(2))+"°</td></tr>";
  });
  lx.fillStyle="#9aa3c7";lx.font="12px Space Grotesk";
  lx.fillText("feixe branco",34,P1[1]-40+tilt*2);
  $("#labSpread").textContent=br((dViolet-dRed).toFixed(2))+"°";
  $("#labDRed").textContent=br(dRed.toFixed(1))+"°";
  $("#labDVio").textContent=br(dViolet.toFixed(1))+"°";
  $("#labTable").innerHTML="<table><tr><th>Cor</th><th>λ</th><th>n (Cauchy)</th><th>δ (prisma delgado)</th></tr>"+rows+"</table>";
}
["labMedium","labApex","labTilt"].forEach(id=>document.getElementById(id).addEventListener("input",drawLab));
drawLab();

/* ---------- simulador da piscina ---------- */
function pool(){
  const I=+$("#pSun").value,A=+$("#pArea").value,F=+$("#pFlow").value,Ti=+$("#pTin").value,e=+$("#pCover").value;
  const P=I*A*e,md=F/60,dT=P/(md*4186),To=Ti+dT;
  $("#oPower").textContent=Math.round(P)+" W";
  $("#oDelta").textContent="+"+br(dT.toFixed(2))+" °C";
  $("#oTout").textContent=br(To.toFixed(1))+" °C";
  $("#thermFill").style.width=Math.min(100,dT/4*100)+"%";
  const dp=(P*6*3600)/(20000*4186);
  $("#oPool").textContent="Rodando 6 h numa piscina de 20 m³ (20.000 L) ≈ +"+br(dp.toFixed(2))+" °C de aquecimento total. Nota física: P = I·A·η e ΔT = P/(ṁ·c), c = 4186 J/kg·K.";
}
["pSun","pArea","pFlow","pTin","pCover"].forEach(id=>document.getElementById(id).addEventListener("input",pool));
pool();

/* ---------- galeria / upload ---------- */
const drop=$("#drop"),fin=$("#fileIn");
drop.addEventListener("click",()=>fin.click());
drop.addEventListener("dragover",e=>{e.preventDefault();drop.classList.add("over");});
drop.addEventListener("dragleave",()=>drop.classList.remove("over"));
drop.addEventListener("drop",e=>{e.preventDefault();drop.classList.remove("over");addFiles(e.dataTransfer.files);});
fin.addEventListener("change",()=>addFiles(fin.files));
function addFiles(files){
  [...files].filter(f=>f.type.startsWith("image/")).forEach(f=>{
    const r=new FileReader();
    r.onload=()=>{
      const fig=document.createElement("figure");fig.className="shot";
      const img=document.createElement("img");img.src=r.result;img.alt=f.name;
      const cap=document.createElement("figcaption");
      const nm=document.createElement("span");nm.textContent=f.name.replace(/\.[^.]+$/,"");
      const del=document.createElement("button");del.textContent="🗑";del.title="remover";
      del.addEventListener("click",ev=>{ev.stopPropagation();fig.remove();});
      cap.appendChild(nm);cap.appendChild(del);
      fig.appendChild(img);fig.appendChild(cap);
      img.addEventListener("click",()=>{$("#lbImg").src=r.result;$("#lbCap").textContent=f.name;$("#lightbox").classList.add("open");});
      $("#shots").appendChild(fig);
    };
    r.readAsDataURL(f);
  });
}
$("#lbClose").addEventListener("click",()=>$("#lightbox").classList.remove("open"));
$("#lightbox").addEventListener("click",e=>{if(e.target.id==="lightbox")$("#lightbox").classList.remove("open");});
addEventListener("keydown",e=>{if(e.key==="Escape")$("#lightbox").classList.remove("open");});

/* ---------- QUIZ (corrigido: delegação de eventos + botão "próxima") ---------- */
const QS=[
  {q:"O que é dispersão luminosa?",
   o:["A separação da luz branca em suas cores componentes","A reflexão da luz num espelho","A absorção da luz por uma superfície preta","A curvatura da luz ao redor de obstáculos"],
   a:0,e:"A dispersão é a separação da luz branca no espectro porque cada comprimento de onda é refratado de forma diferente."},
  {q:"Qual lei rege a curvatura da luz entre dois meios?",
   o:["Lei de Ohm","Lei de Snell (n₁·sin θ₁ = n₂·sin θ₂)","Segunda lei de Newton","Lei de Coulomb"],
   a:1,e:"A Lei de Snell relaciona os ângulos aos índices de refração dos dois meios."},
  {q:"No vidro, qual cor é mais refratada?",
   o:["Vermelho","Amarelo","Verde","Violeta"],
   a:3,e:"O violeta tem o menor comprimento de onda, o maior n e, portanto, curva mais."},
  {q:"Por que os coletores solares de piscina são pretos?",
   o:["Preto fica mais bonito","O preto absorve todos os comprimentos de onda visíveis e os converte em calor","O preto reflete infravermelho","O preto refrata mais a luz"],
   a:1,e:"Uma superfície preta absorve todo o espectro visível — o oposto da dispersão — maximizando o aquecimento."},
  {q:"O arco-íris se forma porque as gotas de chuva…",
   o:["apenas refletem a luz","refratam, dispersam e refletem internamente a luz do sol","absorvem luz ultravioleta","polarizam a luz"],
   a:1,e:"Cada gota refrata na entrada, dispersa por dentro, reflete atrás e refrata novamente na saída."},
  {q:"O índice de refração de um material depende…",
   o:["do comprimento de onda da luz","da temperatura do observador","do tamanho do prisma","de nada — é sempre constante"],
   a:0,e:"n = f(λ), aproximado pela equação de Cauchy n(λ) = A + B/λ²."},
  {q:"Uma piscina parece mais rasa do que é por causa da…",
   o:["dispersão","reflexão","refração na superfície da água","difração"],
   a:2,e:"A luz que sai da água se afasta da normal, elevando a posição aparente do fundo."}
];
const quizBox=document.getElementById("quizBox");
let qi=0,qScore=0,qLocked=false;

function paintQ(){
  if(!quizBox)return;
  if(qi>=QS.length){paintResult();return;}
  const q=QS[qi];
  let html='<p class="q">Pergunta '+(qi+1)+' de '+QS.length+' — '+q.q+'</p>';
  html+='<div class="qprog"><i style="width:'+(qi/QS.length*100)+'%"></i></div>';
  q.o.forEach(function(o,i){html+='<button type="button" class="qopt" data-i="'+i+'">'+o+'</button>';});
  html+='<p id="qFeed"></p><p class="qmeta">Pontuação até agora: '+qScore+'</p>';
  quizBox.innerHTML=html;
  qLocked=false;
}
function paintResult(){
  const msg=qScore===QS.length?"Perfeito! Newton ficaria orgulhoso. 🏆":
            qScore>=5?"Excelente — você domina o espectro! 🌈":
            qScore>=3?"Bom trabalho! Revise as seções 02 e 03 para gabaritar. 📖":
            "Vale rever as seções e tentar de novo — o prisma aguarda. 🔁";
  quizBox.innerHTML='<p class="q">🎉 Resultado final</p>'+
    '<p class="bigT" style="font-size:2.2rem">'+qScore+' / '+QS.length+'</p>'+
    '<p id="qFeed">'+msg+'</p>'+
    '<button type="button" class="btn solid" id="qRestart">Reiniciar o quiz</button>';
}
if(quizBox){
  quizBox.addEventListener("click",function(ev){
    const opt=ev.target.closest(".qopt");
    if(opt&&!qLocked&&qi<QS.length){
      qLocked=true;
      const q=QS[qi],i=+opt.dataset.i,ok=(i===q.a);
      quizBox.querySelectorAll(".qopt").forEach(function(b){
        if(+b.dataset.i===q.a)b.classList.add("ok");
      });
      if(!ok)opt.classList.add("no");
      if(ok)qScore++;
      const label=qi===QS.length-1?"Ver resultado 🎉":"Próxima pergunta ➜";
      document.getElementById("qFeed").innerHTML=
        (ok?"✅ Correto! ":"❌ Não é bem isso. ")+q.e+
        '<br><button type="button" class="btn solid" id="qNext">'+label+'</button>';
      return;
    }
    if(ev.target.closest("#qNext")){qi++;paintQ();return;}
    if(ev.target.closest("#qRestart")){qi=0;qScore=0;paintQ();}
  });
  paintQ();
}