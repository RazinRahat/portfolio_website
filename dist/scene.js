/* A real perspective-projected 3D map. No animation loop, tracking or CDN dependencies. */
(() => {
  'use strict';
  const canvas=document.getElementById('project-scene'),frame=document.getElementById('scene-frame');
  let ctx;try{ctx=canvas.getContext('2d');}catch{return;}if(!ctx)return;
  const slider=document.getElementById('map-rotation');
  const points={rag:[-.68,-.50,.65],gesture:[.72,-.48,.50],finance:[-.92,.15,-.36],qqp:[.85,.22,-.25],three:[-.44,.72,.55],ssi:[.47,.80,-.40]};
  const colors={engineering:'#547b68',ml:'#b44f23',research:'#756783'};
  const nodes=Array.from(document.querySelectorAll('[data-map-project]'),el=>({id:el.dataset.mapProject,point:points[el.dataset.mapProject],color:colors[el.dataset.mapCategory],el}));
  let angle=0,tilt=-.2,width=500,height=355,active='rag',drag=null;
  function project(x,y,z){const c=Math.cos(angle),s=Math.sin(angle),ct=Math.cos(tilt),st=Math.sin(tilt);let rx=x*c+z*s,rz=-x*s+z*c,ry=y*ct-rz*st;rz=y*st+rz*ct;const scale=Math.min(width*.30,height*.35)*(3.5/(3.5-rz));return{x:width/2+rx*scale,y:height*.49+ry*scale,z:rz};}
  function line(points,color,lineWidth){ctx.beginPath();points.forEach((p,i)=>{const q=project(...p);i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y);});ctx.strokeStyle=color;ctx.lineWidth=lineWidth;ctx.stroke();}
  function draw(){
    ctx.clearRect(0,0,width,height);
    // Longitude and latitude rings let rotation reveal actual depth.
    for(let lon=0;lon<Math.PI;lon+=Math.PI/8){const p=[];for(let a=0;a<=Math.PI*2+.04;a+=.04)p.push([Math.cos(a)*Math.cos(lon),Math.sin(a),Math.cos(a)*Math.sin(lon)]);line(p,'rgba(109,128,91,.18)',.65);}
    for(let lat=-Math.PI/3;lat<=Math.PI/3;lat+=Math.PI/6){const p=[];for(let a=0;a<=Math.PI*2+.04;a+=.04)p.push([Math.cos(a)*Math.cos(lat),Math.sin(lat),Math.sin(a)*Math.cos(lat)]);line(p,'rgba(109,128,91,.18)',.65);}
    const orbit=[];for(let a=0;a<=Math.PI*2+.03;a+=.03)orbit.push([1.31*Math.cos(a),.23*Math.sin(a),1.05*Math.sin(a)]);line(orbit,'rgba(180,79,35,.27)',.8);
    for(let i=0;i<70;i++){const y=1-(i/69)*2,r=Math.sqrt(1-y*y),phi=i*2.39996,p=project(Math.cos(phi)*r,y,Math.sin(phi)*r);ctx.beginPath();ctx.arc(p.x,p.y,p.z>.1?1.4:.9,0,Math.PI*2);ctx.fillStyle=p.z>.1?'#92a57d':'#c2cbbb';ctx.fill();}
    const labels=nodes.map(n=>({n,p:project(...n.point),el:n.el})).sort((a,b)=>a.p.x-b.p.x);
    // Two label lanes keep all six targets readable at every angle, even on a phone.
    [labels.slice(0,3),labels.slice(3)].forEach((lane,side)=>{
      lane.sort((a,b)=>a.p.y-b.p.y);
      lane.forEach((l,i)=>{const buttonWidth=l.el.offsetWidth||Math.min(154,width/2-12);l.x=side?width-buttonWidth/2-6:buttonWidth/2+6;l.y=Math.max(28,Math.min(height-28,l.p.y));if(i)l.y=Math.max(l.y,lane[i-1].y+50);});
      if(lane.at(-1).y>height-28){lane.at(-1).y=height-28;for(let i=lane.length-2;i>=0;i--)lane[i].y=Math.min(lane[i].y,lane[i+1].y-50);}
    });
    labels.forEach(({n,p,el,x,y})=>{const selected=n.id===active;el.style.left=`${x}px`;el.style.top=`${y}px`;el.style.zIndex=String(3+Math.round((p.z+1)*3));ctx.beginPath();ctx.moveTo(width/2,height*.49);ctx.lineTo(p.x,p.y);ctx.lineTo(x,y);ctx.strokeStyle=selected?n.color+'90':'#abb7a060';ctx.lineWidth=selected?1.2:.7;ctx.setLineDash([2,4]);ctx.stroke();ctx.setLineDash([]);ctx.beginPath();ctx.arc(p.x,p.y,selected?5:3,0,Math.PI*2);ctx.fillStyle=n.color+(p.z<0?'85':'ff');ctx.fill();});
  }
  function resize(){const r=frame.getBoundingClientRect();width=r.width||500;height=r.height||355;const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw();}
  slider.addEventListener('input',()=>{angle=Number(slider.value)*Math.PI/180;draw();});
  document.getElementById('reset-map').addEventListener('click',()=>{angle=0;tilt=-.2;slider.value='0';draw();});
  frame.addEventListener('pointerdown',e=>{if(e.target.closest('button')||e.button!==0)return;drag={x:e.clientX,y:e.clientY,angle,tilt};frame.setPointerCapture?.(e.pointerId);frame.classList.add('dragging');});
  frame.addEventListener('pointermove',e=>{if(!drag)return;angle=drag.angle+(e.clientX-drag.x)*.009;tilt=Math.max(-.65,Math.min(.65,drag.tilt+(e.clientY-drag.y)*.004));slider.value=String(Math.round(((angle*180/Math.PI+180)%360+360)%360-180));draw();});
  function endDrag(){drag=null;frame.classList.remove('dragging');}
  frame.addEventListener('pointerup',endDrag);frame.addEventListener('pointercancel',endDrag);
  window.addEventListener('portfolio:selection',e=>{active=e.detail.project;draw();});
  if('ResizeObserver' in window)new ResizeObserver(resize).observe(frame);else window.addEventListener('resize',resize);
  resize();
})();
