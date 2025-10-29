// canvas + effect manager
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let W = canvas.width = innerWidth;
let H = canvas.height = innerHeight;

window.addEventListener('resize', ()=>{ W = canvas.width = innerWidth; H = canvas.height = innerHeight; });

let particles = [];
let effect = 'stars'; // default effect

// utility: random
const R = (a,b)=> a + Math.random()*(b-a);

// initialize different effect systems
function initStars(){
  particles = [];
  for(let i=0;i<120;i++){
    particles.push({
      x: Math.random()*W,
      y: Math.random()*H,
      r: R(0.6,2.6),
      tw: Math.random()*Math.PI*2,
      speed: R(0.1,0.6),
      alpha: R(0.2,0.9)
    });
  }
}

function initRain(){
  particles = [];
  for(let i=0;i<220;i++){
    particles.push({
      x: Math.random()*W,
      y: Math.random()*H,
      l: R(10,28),
      speed: R(3.5,7),
      alpha: R(0.12,0.35)
    });
  }
}

function initFire(){
  particles = [];
  for(let i=0;i<140;i++){
    particles.push({
      x: Math.random()*W,
      y: H + Math.random()*200,
      vx: (Math.random()-0.5)*0.6,
      vy: -R(0.4,2.2),
      size: R(2,8),
      life: R(60,220),
      age:0,
      hue: Math.floor(R(10,40))
    });
  }
}

function initBubbles(){
  particles = [];
  for(let i=0;i<160;i++){
    particles.push({
      x: Math.random()*W,
      y: Math.random()*H,
      r: R(6,20),
      vy: -R(0.2,1.2),
      alpha: R(0.08,0.3)
    });
  }
}

function initWaves(){
  particles = [];
  // use sin-lines layered as soft shapes
  for(let i=0;i<6;i++){
    particles.push({
      phase: Math.random()*Math.PI*2,
      amp: R(8,36),
      speed: R(0.002,0.01),
      offset: i*30 + 60,
      color: i
    });
  }
}

// render loop
function render(){
  ctx.clearRect(0,0,W,H);
  if(effect === 'stars'){
    // dark-blue soft background
    // draw subtle gradient
    const g = ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,'#0f1226');
    g.addColorStop(1,'#12233a');
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
    // stars
    particles.forEach(p=>{
      p.tw += 0.01;
      const a = 0.5 + 0.5*Math.sin(p.tw);
      ctx.globalAlpha = p.alpha * a;
      ctx.fillStyle = 'rgba(255,255,255,1)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
      // slow drift
      p.x += (Math.random()-0.5)*0.2;
      p.y += (Math.random()-0.5)*0.2;
      if(p.x<0) p.x=W;
      if(p.x>W) p.x=0;
      if(p.y<0) p.y=H;
      if(p.y>H) p.y=0;
    });
    ctx.globalAlpha = 1;
  }
  else if(effect === 'rain'){
    // rainy gradient
    const g = ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,'#223b6b');
    g.addColorStop(1,'#2b5f9e');
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
    // rain lines
    ctx.strokeStyle = 'rgba(200,230,255,0.4)';
    ctx.lineWidth = 1;
    particles.forEach(p=>{
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + 2, p.y + p.l);
      ctx.stroke();
      p.y += p.speed;
      p.x += 0.6; // wind
      if(p.y > H + 20){ p.y = -20; p.x = Math.random()*W; }
      if(p.x > W) p.x = 0;
    });
    ctx.globalAlpha = 1;
  }
  else if(effect === 'fire'){
    // warm dark background
    const g = ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,'#2b0e0e');
    g.addColorStop(1,'#3b1b1b');
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
    // fire particles (glowing)
    particles.forEach(p=>{
      p.age += 1;
      const lifeRatio = 1 - (p.age / p.life);
      const size = p.size * (0.6 + lifeRatio);
      const alpha = Math.max(0, lifeRatio);
      ctx.globalAlpha = alpha * 0.9;
      // radial gradient for glow
      const rg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size*6);
      rg.addColorStop(0, `hsla(${p.hue}, 100%, 60%, 1)`);
      rg.addColorStop(0.5, `hsla(${p.hue}, 100%, 45%, 0.6)`);
      rg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rg;
      ctx.beginPath(); ctx.arc(p.x, p.y, size*6, 0, Math.PI*2); ctx.fill();
      // core
      ctx.globalAlpha = 1;
      ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, ${0.8*alpha})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, size, 0, Math.PI*2); ctx.fill();
      // move
      p.x += p.vx;
      p.y += p.vy;
      if(p.age > p.life){
        p.x = Math.random()*W;
        p.y = H + Math.random()*120;
        p.vx = (Math.random()-0.5)*0.6;
        p.vy = -R(0.4,2.2);
        p.size = R(2,8);
        p.age = 0;
        p.life = R(60,220);
        p.hue = Math.floor(R(10,40));
      }
    });
  }
  else if(effect === 'bubbles'){
    // soft pastel background
    const g = ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,'#1b2b3a');
    g.addColorStop(1,'#14384b');
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
    // bubbles
    particles.forEach(p=>{
      p.y += p.vy;
      ctx.globalAlpha = p.alpha;
      ctx.strokeStyle = 'rgba(200,255,255,0.5)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.stroke();
      // drift
      p.x += Math.sin(p.y*0.01 + p.r)*0.2;
      if(p.y < -20){ p.y = H + 20; p.x = Math.random()*W; }
    });
    ctx.globalAlpha = 1;
  }
  else if(effect === 'waves'){
    // ocean gradient
    const g = ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,'#021b3a');
    g.addColorStop(1,'#063a6f');
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
    // layered sine waves
    const now = Date.now()*0.001;
    for(let i=0;i<4;i++){
      ctx.beginPath();
      const amp = 18 + i*8;
      const freq = 0.005 + i*0.004;
      const yOff = H - (40 + i*30);
      ctx.moveTo(0, H);
      for(let x=0;x<=W;x+=10){
        const y = yOff + Math.sin((x*freq) + now*(0.5+i*0.3)) * amp * (1 + i*0.2);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W,H); ctx.closePath();
      ctx.fillStyle = `rgba(255,255,255,${0.01 + i*0.01})`;
      ctx.fill();
    }
  }

  requestAnimationFrame(render);
}

// choose effect initializer
function setEffect(name){
  effect = name;
  if(name === 'stars') initStars();
  else if(name === 'rain') initRain();
  else if(name === 'fire') initFire();
  else if(name === 'bubbles') initBubbles();
  else if(name === 'waves') initWaves();
}

// UI wiring
const buttons = document.querySelectorAll('.mood-btn');
const panel = document.getElementById('panel');
const quoteEl = document.getElementById('quote');
const tipsEl = document.getElementById('tips');
const reviewBtn = document.getElementById('reviewBtn');
const reviewInput = document.getElementById('reviewInput');
const reviewMsg = document.getElementById('reviewMsg');

buttons.forEach(b=>{
  b.addEventListener('click', async ()=>{
    const mood = b.dataset.mood || b.textContent.trim();
    // fetch content (GET)
    try{
      const res = await fetch(`/get_content/${encodeURIComponent(mood)}`);
      const json = await res.json();
      if(json.error) return;
      quoteEl.textContent = json.quote;
      tipsEl.innerHTML = '';
      json.tips.forEach(t=>{
        const li = document.createElement('li');
        li.textContent = t;
        tipsEl.appendChild(li);
      });
      panel.classList.remove('hidden');

      // map mood to effect name
      if(mood.toLowerCase() === 'happy') setEffect('stars'), document.body.style.background = 'linear-gradient(120deg,#2b3a67,#4b6fb7)';
      if(mood.toLowerCase() === 'sad') setEffect('rain'), document.body.style.background = 'linear-gradient(120deg,#123a5a,#2b5f9e)';
      if(mood.toLowerCase() === 'angry') setEffect('fire'), document.body.style.background = 'linear-gradient(120deg,#3b0f0f,#6b1414)';
      if(mood.toLowerCase() === 'anxious') setEffect('bubbles'), document.body.style.background = 'linear-gradient(120deg,#12323f,#2b6b7f)';
      if(mood.toLowerCase() === 'calm') setEffect('waves'), document.body.style.background = 'linear-gradient(120deg,#05213a,#064b7a)';
    }catch(err){
      console.error(err);
    }
  });
});

// review handler (local only)
reviewBtn.addEventListener('click', ()=>{
  const v = reviewInput.value.trim();
  if(!v){ reviewMsg.textContent = 'If you want to share, type something and press send.'; return; }
  reviewMsg.textContent = '💖 Thanks — your reflection was received.';
  reviewInput.value = '';
});

// start default
setEffect('stars');
render();
