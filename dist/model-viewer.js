import * as THREE from './vendor/three.module.js';
import { GLTFLoader } from './vendor/GLTFLoader.js';
import { OrbitControls } from './vendor/OrbitControls.js';

// Original geometry is retained. Normalisation below only positions the object for display.
// Render on interaction and resize; there is no idle animation loop.
export async function mountViewer(container, { url, label, signal }) {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false }); }
  catch { return mountCompatibilityViewer(container, { url, label, signal }); }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0xf1f1e8);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-label', `${label}: interactive 3D model. Use the rotate and zoom buttons below, or drag the model.`);
  canvas.setAttribute('role', 'img');
  canvas.tabIndex = 0;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 100);
  camera.position.set(2.2, 1.4, 2.8);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = false;
  controls.enablePan = false;
  controls.minDistance = 1.15;
  controls.maxDistance = 8;
  controls.target.set(0, 0, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xa5ab97, 2.3));
  const key = new THREE.DirectionalLight(0xfff8ea, 3.0);
  key.position.set(3, 5, 4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 1.4);
  fill.position.set(-3, 1, -2);
  scene.add(fill);
  let model = null, stopped = false, observer = null;
  const meshes = [];
  const alternatives = [];
  const render = () => { if (!stopped) renderer.render(scene, camera); };
  const resize = () => {
    if (stopped) return;
    const rect = container.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    renderer.setSize(Math.round(rect.width), Math.round(rect.height), false);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
    render();
  };
  function dispose() {
    if (stopped) return;
    stopped = true;
    observer?.disconnect();
    controls.removeEventListener('change', render);
    controls.dispose();
    canvas.removeEventListener('keydown', keydown);
    signal?.removeEventListener('abort', dispose);
    const textures = new Set();
    for (const { mesh, original } of meshes) {
      mesh.geometry.dispose();
      for (const material of Array.isArray(original) ? original : [original]) {
        for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
        material.dispose();
      }
    }
    for (const texture of textures) { texture.image?.close?.(); texture.dispose(); }
    for (const material of alternatives) material.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  }
  function action(name) {
    if (stopped) return;
    if (name === 'reset') { controls.reset(); render(); return; }
    if (name === 'front' || name === 'rear') {
      const distance = camera.position.distanceTo(controls.target);
      camera.position.set(0, .25, distance * (name === 'rear' ? -1 : 1));
    } else if (name === 'left' || name === 'right') {
      const offset = camera.position.clone().sub(controls.target);
      offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), name === 'left' ? -.25 : .25);
      camera.position.copy(offset.add(controls.target));
    } else if (name === 'in' || name === 'out') {
      const offset = camera.position.clone().sub(controls.target);
      const distance = THREE.MathUtils.clamp(offset.length() * (name === 'in' ? .8 : 1.25), controls.minDistance, controls.maxDistance);
      camera.position.copy(offset.normalize().multiplyScalar(distance).add(controls.target));
    }
    controls.update();
    render();
  }
  function keydown(event) {
    const actions = { ArrowLeft: 'left', ArrowRight: 'right', '+': 'in', '=': 'in', '-': 'out', Home: 'reset' };
    if (actions[event.key]) { event.preventDefault(); action(actions[event.key]); }
  }
  function setMode(mode) {
    if (!['original', 'normals', 'wireframe'].includes(mode)) return;
    for (const item of meshes) item.mesh.material = mode === 'original' ? item.original : mode === 'normals' ? item.normals : item.wireframe;
    render();
  }
  signal?.addEventListener('abort', dispose, { once: true });
  try {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error(`Model request returned ${response.status}`);
    const bytes = await response.arrayBuffer();
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    const result = await new GLTFLoader().parseAsync(bytes, '');
    model = result.scene;
    model.traverse(mesh => {
      if (!mesh.isMesh) return;
      const normals = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
      const wireframe = new THREE.MeshBasicMaterial({ color: 0x3e6555, wireframe: true, side: THREE.DoubleSide });
      alternatives.push(normals, wireframe);
      meshes.push({ mesh, original: mesh.material, normals, wireframe });
    });
    if (stopped || signal?.aborted) {
      // parseAsync can finish after a cancellation. Release its newly created resources.
      for (const item of meshes) { item.mesh.geometry.dispose(); for (const m of Array.isArray(item.original) ? item.original : [item.original]) m.dispose(); }
      for (const m of alternatives) m.dispose();
      throw new DOMException('Aborted', 'AbortError');
    }
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const centre = box.getCenter(new THREE.Vector3());
    const wrapper = new THREE.Group();
    wrapper.add(model);
    model.position.sub(centre);
    wrapper.scale.setScalar(2 / Math.max(size.x, size.y, size.z));
    scene.add(wrapper);
    container.replaceChildren(canvas);
    controls.update();
    controls.saveState();
    controls.addEventListener('change', render);
    canvas.addEventListener('keydown', keydown);
    observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();
    return { dispose, setMode, action };
  } catch (error) {
    dispose();
    throw error;
  }
}

// A sampled point-and-edge view of the same uploaded geometry for browsers without WebGL.
// It changes only how the preview is drawn; downloaded GLBs retain their original bytes.
async function mountCompatibilityViewer(container, { url, label, signal }) {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Model request returned ${response.status}`);
  const loaded = await new GLTFLoader().parseAsync(await response.arrayBuffer(), '');
  const root = loaded.scene;
  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root), centre = box.getCenter(new THREE.Vector3()), extent = box.getSize(new THREE.Vector3());
  const scale = 2 / Math.max(extent.x, extent.y, extent.z), points = [], edges = [], resources = [];
  const point = new THREE.Vector3(), normal = new THREE.Vector3(), color = new THREE.Color();
  const budget = container.clientWidth < 500 ? 12000 : 18000;
  let vertexCount = 0;
  root.traverse(mesh => { if (mesh.isMesh) vertexCount += mesh.geometry.attributes.position.count; });
  const stride = Math.max(1, Math.ceil(vertexCount / budget));
  root.traverse(mesh => {
    if (!mesh.isMesh) return;
    resources.push(mesh);
    const geometry = mesh.geometry, positions = geometry.attributes.position, colours = geometry.attributes.color, normals = geometry.attributes.normal;
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld);
    for (let i = 0; i < positions.count; i += stride) {
      point.fromBufferAttribute(positions, i).applyMatrix4(mesh.matrixWorld).sub(centre).multiplyScalar(scale);
      if (normals) normal.fromBufferAttribute(normals, i).applyMatrix3(normalMatrix).normalize(); else normal.set(0, 1, 0);
      if (colours) color.setRGB(colours.getX(i), colours.getY(i), colours.getZ(i)).convertLinearToSRGB(); else color.set(0x547b68);
      points.push({x:point.x,y:point.y,z:point.z,nx:normal.x,ny:normal.y,nz:normal.z,colour:`rgb(${Math.round(color.r*255)},${Math.round(color.g*255)},${Math.round(color.b*255)})`});
    }
    const indices = geometry.index, count = indices ? indices.count : positions.count, faceStride = Math.max(1, Math.ceil(count / 3 / 2200));
    for (let triangle = 0; triangle < Math.floor(count / 3); triangle += faceStride) {
      const face = [];
      for (let k = 0; k < 3; k++) {
        const index = indices ? indices.getX(triangle * 3 + k) : triangle * 3 + k;
        point.fromBufferAttribute(positions, index).applyMatrix4(mesh.matrixWorld).sub(centre).multiplyScalar(scale);
        face.push({x:point.x,y:point.y,z:point.z});
      }
      edges.push(face);
    }
  });
  if (signal?.aborted) {
    for (const mesh of resources) { mesh.geometry.dispose(); for (const m of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) m.dispose(); }
    throw new DOMException('Aborted', 'AbortError');
  }
  const canvas = document.createElement('canvas'), context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas is unavailable');
  canvas.tabIndex = 0;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', `${label}: compatibility point view from the original model. Drag, or use the rotation and zoom controls.`);
  container.replaceChildren(canvas);
  let yaw = .65, pitch = .32, zoom = 1, mode = 'original', width = 500, height = 375, stopped = false, drag = null, frame = null;
  const rotate = p => {
    const x = p.x * Math.cos(yaw) + p.z * Math.sin(yaw), z = -p.x * Math.sin(yaw) + p.z * Math.cos(yaw);
    return {x, y:p.y * Math.cos(pitch) - z * Math.sin(pitch), z:p.y * Math.sin(pitch) + z * Math.cos(pitch)};
  };
  const project = p => { const r = rotate(p), f = Math.min(width, height) * 1.8 * zoom / (4 - r.z); return {x:width/2+r.x*f,y:height/2-r.y*f,z:r.z}; };
  function render() {
    frame = null;
    if (stopped) return;
    context.fillStyle = '#f1f1e8'; context.fillRect(0, 0, width, height);
    const projected = points.map(p => ({...project(p),p})).sort((a,b) => a.z-b.z);
    const dot = mode === 'wireframe' ? 1 : Math.max(1.4, Math.min(width,height)/210) * Math.sqrt(zoom);
    context.globalAlpha = mode === 'wireframe' ? .35 : .95;
    for (const v of projected) {
      if (mode === 'normals') { const n = rotate({x:v.p.nx,y:v.p.ny,z:v.p.nz}); context.fillStyle=`rgb(${Math.round((n.x+1)*127.5)},${Math.round((n.y+1)*127.5)},${Math.round((n.z+1)*127.5)})`; }
      else context.fillStyle = v.p.colour;
      context.fillRect(v.x-dot/2, v.y-dot/2, dot, dot);
    }
    if (mode === 'wireframe') {
      context.globalAlpha=.5;context.strokeStyle='#426652';context.lineWidth=.65;context.beginPath();
      for (const face of edges) { const a=project(face[0]),b=project(face[1]),c=project(face[2]);context.moveTo(a.x,a.y);context.lineTo(b.x,b.y);context.lineTo(c.x,c.y);context.closePath(); }
      context.stroke();
    }
    context.globalAlpha=1;
  }
  function requestRender() { if (!stopped && frame===null) frame=requestAnimationFrame(render); }
  function resize() {
    const rect=container.getBoundingClientRect();width=rect.width;height=rect.height;
    const ratio=Math.min(window.devicePixelRatio||1,1.5);canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);context.setTransform(ratio,0,0,ratio,0,0);requestRender();
  }
  function action(name) {
    if(name==='left')yaw-=.25;if(name==='right')yaw+=.25;
    if(name==='in')zoom=Math.min(2.8,zoom*1.2);if(name==='out')zoom=Math.max(.5,zoom/1.2);
    if(name==='front'){yaw=0;pitch=0;}if(name==='rear'){yaw=Math.PI;pitch=0;}
    if(name==='reset'){yaw=.65;pitch=.32;zoom=1;}
    requestRender();
  }
  const listeners = [];
  const on=(type,handler,options)=>{canvas.addEventListener(type,handler,options);listeners.push([type,handler,options]);};
  on('pointerdown',e=>{if(e.button!==0)return;drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);canvas.style.cursor='grabbing';});
  on('pointermove',e=>{if(!drag)return;yaw+=(e.clientX-drag.x)*.012;pitch=THREE.MathUtils.clamp(pitch+(e.clientY-drag.y)*.008,-1.3,1.3);drag={x:e.clientX,y:e.clientY};requestRender();});
  on('pointerup',()=>{drag=null;canvas.style.cursor='grab';});on('pointercancel',()=>{drag=null;});
  on('wheel',e=>{e.preventDefault();action(e.deltaY<0?'in':'out');},{passive:false});
  on('keydown',e=>{const keys={ArrowLeft:'left',ArrowRight:'right','+':'in','=':'in','-':'out',Home:'reset'};if(keys[e.key]){e.preventDefault();action(keys[e.key]);}});
  canvas.style.touchAction='none';canvas.style.cursor='grab';
  const observer=new ResizeObserver(resize);observer.observe(container);resize();
  function dispose() {
    if(stopped)return;stopped=true;if(frame!==null)cancelAnimationFrame(frame);observer.disconnect();
    for(const [type,handler,options] of listeners)canvas.removeEventListener(type,handler,options);
    for(const mesh of resources){mesh.geometry.dispose();for(const m of Array.isArray(mesh.material)?mesh.material:[mesh.material])m.dispose();}
    signal?.removeEventListener('abort',dispose);canvas.remove();
  }
  signal?.addEventListener('abort',dispose,{once:true});
  return {dispose,action,setMode(next){mode=next;requestRender();},compatibility:true};
}
