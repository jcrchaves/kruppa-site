// The supplied image remains the fallback and can be restored with hero-config.js.
// Generated poses keep the raster character; no articulated vector replacement.
(() => {
  const root = document.querySelector('.hero-still');
  const frame = root?.querySelector('.hero-illustration');
  const original = frame?.querySelector('.hero-still-image');
  const mode = new URLSearchParams(location.search).get('hero') || window.KRUPPA_HERO?.mode;
  if (!original || mode !== 'animated') return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const ns = 'http://www.w3.org/2000/svg';
  const headroom = 160;
  const boyScale = 1.3;
  const supports = [[330.5,392],[626.5,392],[932.5,392],[1241,391],[1542,391],[1840,389]]
    .map(([x,y]) => ({x,y:y + headroom + 8}));
  // Each crop uses the character's actual opaque bounds, rather than assuming
  // perfectly registered sprite cells. The last two values are the support point.
  const poses = [
    [94,29,168,283,175,260], [396,43,182,269,475,254],
    [718,29,154,286,793,307], [1013,8,144,307,1084,307],
    [66,395,227,229,180,615], [389,330,200,294,476,629],
    [670,331,216,278,775,630], [986,332,217,244,1100,631],
    [66,621,209,290,181,920], [382,664,206,260,485,915],
    [707,617,165,310,790,918], [1001,662,198,255,1090,888],
    [94,933,171,294,177,1169], [376,932,198,294,471,1168],
    [687,936,215,290,789,1172], [998,932,190,294,1091,1168]
  ];
  const lerp = (a,b,u) => a + (b-a)*u;
  const smooth = u => u*u*(3-2*u);
  const between = (a,b,u) => ({a,b,mix:smooth(Math.max(0,Math.min(1,u)))});
  const jumpStart = 1.55, jumpPeriod = 1.08;
  const sitStart = jumpStart + 5*jumpPeriod;
  const waveStart = sitStart + .62;
  const duration = waveStart + 1.65;
  const returnDuration = waveStart;

  function poseAt(t, returning=false) {
    const path=returning?[5,4,3,2,1,0]:[0,1,2,3,4,5];
    const direction=returning?-1:1;
    let cube=path[0],nextCube=null;
    let point = {...supports[cube]}, pose = {a:0,b:0,mix:0};
    let stage = returning?'sentado-no-A':'sentado-no-K', air = 0, shadowMix = 0;
    const facing=t>=sitStart+.15?-direction:direction;
    if (t < .65) {
      if(returning&&t<.35) {pose=between(15,0,t/.35);stage='descer-mao';}
      return {point,pose,stage,cube,nextCube,air,shadowMix,facing};
    }
    if (t < 1.05) { pose=between(0,1,(t-.65)/.25); stage='preparar-levantar'; }
    else if (t < 1.30) { pose=between(1,2,(t-1.05)/.25); stage='levantar'; }
    else if (t < jumpStart) { pose=between(2,3,(t-1.30)/.25); stage='de-pe-no-K'; }
    else if (t < sitStart) {
      const step = Math.min(4,Math.floor((t-jumpStart)/jumpPeriod));
      cube=path[step]; nextCube=path[step+1];
      const local = t-jumpStart-step*jumpPeriod;
      const from = supports[cube], to = supports[nextCube];
      point={...from};
      if (local < .20) {
        pose=between(3,4,local/.16); stage='preparar-salto';
      } else if (local < .92) {
        const u=(local-.20)/.72;
        // Constant horizontal speed and a gravity-driven parabola. The apex
        // clears the next cube, then the feet meet its measured top surface.
        point={x:lerp(from.x,to.x,u),y:lerp(from.y,to.y,u)-4*145*u*(1-u)};
        air=4*u*(1-u); shadowMix=u; stage='saltar';
        if(u<.20)pose=between(5,6,u/.20);
        else if(u<.45)pose=between(6,7,(u-.20)/.25);
        else if(u<.62)pose={a:7,b:7,mix:0};
        else if(u<.91)pose=between(7,8,(u-.62)/.29);
        else pose=between(8,9,(u-.91)/.09);
      } else {
        point={...to}; pose=between(9,10,(local-.92)/.16);
        cube=nextCube; nextCube=null; stage='aterrar';
      }
    } else {
      cube=path[5]; point={...supports[cube]};
      const seatedStage=returning?'sentar-no-K':'sentar-no-A';
      if(t < sitStart+.30) { pose=between(10,11,(t-sitStart)/.30); stage=seatedStage; }
      else if(t < waveStart) { pose=between(11,12,(t-sitStart-.30)/.32); stage=seatedStage; }
      else if(returning) { pose={a:12,b:12,mix:0}; stage='sentado-no-K'; }
      else if(t < waveStart+.28) { pose=between(12,13,(t-waveStart)/.28); stage='levantar-mao'; }
      else if(t < duration-.15) {
        const cycle=(t-waveStart-.28)/.28;
        const fraction=cycle-Math.floor(cycle);
        pose=between(Math.floor(cycle)%2 ? 15:14,Math.floor(cycle)%2 ? 14:15,fraction);
        stage='acenar';
      } else { pose={a:15,b:15,mix:0}; stage='tchau'; }
    }
    return {point,pose,stage,cube,nextCube,air,shadowMix,facing};
  }

  function loadImage(src) {
    return new Promise((resolve,reject) => {
      const image=new Image();
      image.onload=()=>resolve(image); image.onerror=()=>reject(new Error(`Imagem indisponível: ${src}`));
      image.src=src;
    });
  }
  const svgElement = (name,attributes={}) => {
    const element=document.createElementNS(ns,name);
    Object.entries(attributes).forEach(([key,value])=>element.setAttribute(key,String(value)));
    return element;
  };

  Promise.all([loadImage('assets/kruppa-cubos-v1.png'),loadImage('assets/kruppa-menino-poses-v1.png')]).then(([plate,atlas])=>{
    const scene=svgElement('svg',{'class':'hero-motion-scene',viewBox:'0 0 2172 884',role:'img','aria-label':'O menino salta do K até ao A, senta-se virado para o centro e acena. Ao repetir, regressa ao K antes de brincar outra vez.'});
    scene.append(svgElement('image',{href:plate.src,x:0,y:headroom,width:2172,height:724}));
    const shadows=supports.map(point=>svgElement('ellipse',{cx:point.x,cy:point.y-1,rx:55,ry:7,fill:'#1a2b6d',opacity:0}));
    shadows.forEach(shadow=>scene.append(shadow));
    const boy=svgElement('g',{'class':'hero-moving-boy'});
    const layers=poses.map(([x,y,w,h,anchorX,anchorY])=>{
      const crop=svgElement('svg',{x:x-anchorX,y:y-anchorY,width:w,height:h,viewBox:`${x} ${y} ${w} ${h}`,overflow:'hidden',opacity:0});
      crop.append(svgElement('image',{href:atlas.src,x:0,y:0,width:atlas.naturalWidth,height:atlas.naturalHeight}));
      boy.append(crop);return crop;
    });
    scene.append(boy); frame.append(scene);
    const controls=document.createElement('div'); controls.className='hero-motion-controls animation-controls';
    const replay=document.createElement('button'); replay.type='button'; replay.className='motion-replay hero-replay';
    replay.setAttribute('aria-label','Repetir a brincadeira do menino'); replay.innerHTML='↻ <span>Brincar outra vez</span>';
    controls.append(replay); root.append(controls);
    let elapsed=0,lastTime=null,running=false,finished=false,visible=false,request=null;
    let withReturn=false;
    replay.disabled=true;
    const cycleDuration=()=>duration+(withReturn?returnDuration:0);

    function render(t) {
      const returning=withReturn&&t<returnDuration;
      const state=poseAt(returning?t:t-(withReturn?returnDuration:0),returning),{point,pose}=state;
      // One registered pose per frame avoids double faces and translucent bodies.
      const activePose=pose.mix<.5?pose.a:pose.b;
      layers.forEach((layer,index)=>layer.setAttribute('opacity',index===activePose?1:0));
      // Mirror only the character; the letters and cube plate remain unchanged.
      boy.setAttribute('transform',`translate(${point.x.toFixed(2)} ${point.y.toFixed(2)}) scale(${boyScale*state.facing} ${boyScale})`);
      shadows.forEach((shadow,index)=>{
        const supportOpacity=state.stage==='saltar' ? (index===state.cube ? (1-state.shadowMix)**2 : index===state.nextCube ? state.shadowMix**2:0) : index===state.cube ? 1:0;
        shadow.setAttribute('opacity',(.17*supportOpacity).toFixed(3));
      });
      scene.dataset.phase=state.stage; scene.dataset.cube=String(state.cube);
      scene.dataset.elapsed=t.toFixed(3); scene.dataset.duration=cycleDuration().toFixed(3);
      scene.dataset.route=returning?'regresso':'ida'; scene.dataset.facing=String(state.facing);
      scene.dataset.boyX=point.x.toFixed(2); scene.dataset.boyY=point.y.toFixed(2);
    }
    function pause() {
      running=false;lastTime=null;
      if(request!==null)cancelAnimationFrame(request);
      request=null;
    }
    function tick(now) {
      if(!running)return;
      if(lastTime!==null)elapsed+=Math.min((now-lastTime)/1000,.05);
      lastTime=now;render(Math.min(elapsed,cycleDuration()));
      if(elapsed>=cycleDuration()) { finished=true;replay.disabled=false;pause(); }
      else request=requestAnimationFrame(tick);
    }
    function resume() {
      if(running||finished||!visible||document.hidden||reduced.matches)return;
      running=true;lastTime=null;request=requestAnimationFrame(tick);
    }
    function displayMode() {
      const staticMode=reduced.matches;
      original.hidden=!staticMode; scene.hidden=staticMode; controls.hidden=staticMode;
      root.classList.toggle('hero-motion-ready',!staticMode);
      if(staticMode)pause();else resume();
    }
    replay.addEventListener('click',()=>{
      if(!finished)return;
      pause();elapsed=0;finished=false;withReturn=true;replay.disabled=true;
      render(0);resume();
    });
    document.addEventListener('visibilitychange',()=>document.hidden?pause():resume());
    reduced.addEventListener('change',displayMode);
    const observer=new IntersectionObserver(entries=>{
      visible=entries[0].isIntersecting&&entries[0].intersectionRatio>=.2;
      if(visible)resume();else pause();
    },{threshold:[0,.2]});
    observer.observe(root);render(0);displayMode();
  }).catch(error=>{
    // Asset failure leaves the exact original image in place with no dead controls.
    console.warn('A ilustração original foi mantida.',error.message);
  });
})();
