(() => {
  'use strict';
  const D = window.PortfolioData;
  const profile = window.PortfolioProfile || {};
  document.querySelectorAll('[data-resume-link]').forEach(link => {
    link.setAttribute('href', profile.resumeUrl || './CV.pdf');
    link.setAttribute('download', profile.resumeFilename || 'Razin-Rahat-Resume.pdf');
  });
  const defaults = { project:'rag', tab:'overview', filter:'all', step:0, mode:3, metric:'ndcg', experiment:0, sort:'source', ssiStep:0, gestureModel:1, qqpMetric:'f1', financeImported:false };
  const state = {...defaults};
  const order = window.PortfolioOrder || ['rag','three','ssi'];
  let viewerAbort = null, viewerStop = null;
  function stopViewer() { viewerAbort?.abort(); viewerStop?.(); viewerAbort=null; viewerStop=null; }
  const panel = document.getElementById('case-panel');
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const external = (label,url) => `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(label)} <span aria-hidden="true"><svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" focusable="false"><path d="M6 18 18 6M6 6h12v12"/></svg></span></a>`;
  const number = n => Number(n).toLocaleString('en-AU');
  let toastTimer;
  function toast(message) { const el=document.getElementById('toast');el.textContent=message;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),3000); }
  function sourceBlock(p) { return `<div class="evidence-source"><span class="mono">SOURCE & SCOPE</span>${escape(p.source)}<div class="case-links">${p.links.map(l=>external(...l)).join('')}</div></div>`; }
  function limits(p) { return `<div class="callout limit"><strong>What this evidence does not establish</strong>${escape(p.limit)}</div>`; }
  function overview(p) {
    return `<span class="badge ${state.project==='three'?'orange':state.project==='ssi'?'purple':''}">${escape(p.badge)}</span><p class="case-lead" style="margin-top:18px">${escape(p.lead)}</p><p class="body-copy">${escape(p.description)}</p><div class="mini-stat-grid">${p.stats.map(([v,l])=>`<div class="mini-stat"><strong class="${v.length>7?'stat-range':''}">${escape(v)}</strong><span>${escape(l)}</span></div>`).join('')}</div><div class="project-story">${p.story.map(([t,d],i)=>`<section><span class="story-index mono">0${i+1}</span><h4>${escape(t)}</h4><p>${escape(d)}</p></section>`).join('')}</div><div class="case-block"><h4>What I implemented</h4><ul class="contribution-list">${p.contributions.map(([t,d])=>`<li><strong>${escape(t)}.</strong> ${escape(d)}</li>`).join('')}</ul></div><div class="callout"><strong>What I learned</strong>${escape(p.lesson)}</div><div class="case-links"><button data-view="explore">${escape(p.exploreLabel)} <svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" focusable="false"><path d="M6 18 18 6M6 6h12v12"/></svg></button>${external(...p.links[0])}</div>`;
  }
  function ragExplore() {
    const p=D.rag, step=p.steps[state.step], m=D.retrieval.metrics[state.metric];
    return `<p class="panel-label">PIPELINE EXPLORER</p><p class="body-copy">Select a stage to inspect the implemented system. This is an architecture walkthrough; it does not run a live model.</p><div class="pipeline" role="group" aria-label="RAG pipeline stages">${p.steps.map((s,i)=>`<button data-step="${i}" aria-pressed="${i===state.step}"><span>${escape(s.subtitle)}</span>${escape(s.title)}</button>`).join('')}</div><div class="pipeline-detail"><h4>${escape(step.title)}</h4><p>${escape(step.detail)}</p><span class="mono">${escape(step.code)}</span></div><div class="metric-choice"><label for="metric-select">FROZEN HOLDOUT / SIX QUERIES</label><select id="metric-select">${Object.entries(D.retrieval.metrics).map(([k,v])=>`<option value="${k}" ${k===state.metric?'selected':''}>${escape(v.label)}</option>`).join('')}</select></div><div class="segmented" role="group" aria-label="Select retrieval mode">${D.retrieval.modes.map((n,i)=>`<button data-mode="${i}" aria-pressed="${state.mode===i}">${escape(n)}</button>`).join('')}</div><div class="metric-chart" aria-label="Recorded ${escape(m.label)} results">${D.retrieval.modes.map((n,i)=>`<div class="chart-row ${i===state.mode?'selected':''}"><span>${escape(n)}</span><div class="chart-track" aria-hidden="true"><div class="chart-fill" style="width:${m.values[i]*100}%"></div></div><span class="chart-value">${m.values[i].toFixed(4)}</span></div>`).join('')}</div><div class="metric-summary"><strong>${m.values[state.mode].toFixed(4)}</strong><span>${escape(D.retrieval.modes[state.mode])} / ${escape(m.label)}</span></div><p class="panel-note">${escape(m.description)} Recorded aggregate results, not a live query. Three papers; 18 queries split into 12 development and six holdout; 527 model-assisted graded judgments.</p><div class="case-links"><button data-view="evidence">Read the evaluation limits <span aria-hidden="true"><svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" focusable="false"><path d="M6 18 18 6M6 6h12v12"/></svg></span></button></div>`;
  }
  function ragEvidence() {
    return `<p class="case-lead">Retrieval results and evaluation scope.</p><p class="body-copy">After development tuning, the configuration was frozen for six holdout queries. The corpus contains <i>Attention Is All You Need</i>, <i>Language Models are Unsupervised Multitask Learners</i>, and <i>Scaling Laws for Neural Language Models</i>.</p><div class="table-wrap" tabindex="0" role="region" aria-label="Recorded retrieval benchmark table; scroll horizontally if needed"><table><thead><tr><th scope="col">MODE</th><th scope="col">P@5</th><th scope="col">POOLED R@5</th><th scope="col">MRR</th><th scope="col">nDCG@5</th></tr></thead><tbody>${D.retrieval.modes.map((n,i)=>`<tr ${i===3?'class="highlight-row"':''}><td>${escape(n)}</td><td>${D.retrieval.metrics.precision.values[i].toFixed(4)}</td><td>${D.retrieval.metrics.recall.values[i].toFixed(4)}</td><td>${D.retrieval.metrics.mrr.values[i].toFixed(4)}</td><td>${D.retrieval.metrics.ndcg.values[i].toFixed(4)}</td></tr>`).join('')}</tbody></table></div><p class="panel-note">Binary relevance: grades 2–3. nDCG uses grades 0–3. The judged pool is not exhaustive; recall is explicitly pooled recall.</p><div class="callout limit"><strong>A retained failure</strong>The Natural Questions case regressed from nDCG@5 0.637 to 0.343 after reranking. Across the six holdout queries, reranking improved four, left one unchanged, and degraded one.</div><div class="case-block"><h4>Reproducibility detail</h4><p class="body-copy">Dense and BM25 each retrieve up to 40 candidates. Weighted RRF uses k = 5, weights 1.00 / 1.25, retains the hybrid top 20, reranks its top 10, and returns five passages.</p></div>${limits(D.rag)}${sourceBlock(D.rag)}`;
  }
  function threeExplore() {
    const e=D.three.experiments[state.experiment];
    return `<p class="panel-label">RECORDED EXPERIMENT EXPLORER</p><div class="experiment-choice"><label for="experiment-select">CHOOSE AN INPUT</label><select id="experiment-select">${D.three.experiments.map((x,i)=>`<option value="${i}" ${i===state.experiment?'selected':''}>${escape(x.name)}</option>`).join('')}</select></div><div class="experiment-views">${[['input','Input photograph'],['front','Generated front'],['rear','Generated rear']].map(([v,l])=>`<figure class="experiment-view"><button data-image="${e.id}-${v}" data-image-label="${escape(e.name+' / '+l)}" aria-label="Enlarge ${escape(e.name+' '+l)}"><img src="./assets/${e.id}-${v}.webp" alt="${escape(e.name+' — '+l)}" width="575" height="550"></button><figcaption>${escape(l)}</figcaption></figure>`).join('')}</div><p class="panel-note">Actual views from the experiment report, cropped for display. Select an image to enlarge it. These are recorded views; the GLB viewer below opens the original display export when available.</p><div class="experiment-stat-grid"><div><strong>${(e.ms/1000).toFixed(2)} s</strong><span>NEURAL INFERENCE</span></div><div><strong>${number(e.faces)}</strong><span>FACES</span></div><div><strong>${e.watertight?'Yes':'No'}</strong><span>WATERTIGHT</span></div><div><strong>${e.components}</strong><span>COMPONENTS</span></div></div><div class="callout ${!e.watertight?'limit':''}"><strong>What the views show</strong>${escape(e.observation)}</div>${modelPanel(e)}<button class="view-button" data-image="${e.id}-figure" data-image-label="${escape(e.name+' / original report figure')}">Open the original comparison figure <svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" focusable="false"><path d="M6 18 18 6M6 6h12v12"/></svg></button><div class="case-links">${external('Source product photograph',e.source)}<button data-view="evidence">Inspect the full results table <svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" focusable="false"><path d="M6 18 18 6M6 6h12v12"/></svg></button></div><p class="panel-note">One run per input on RTX 4090. Timing excludes initialisation, background removal, mesh extraction, and export.</p>`;
  }
  function threeEvidence() {
    const rows=[...D.three.experiments];
    if(state.sort==='time') rows.sort((a,b)=>a.ms-b.ms);
    if(state.sort==='components') rows.sort((a,b)=>b.components-a.components);
    return `<p class="case-lead">Recorded reconstruction results.</p><p class="body-copy">All five runs completed. Four outputs were watertight, but only the table and carafe had a single connected component. Neither property establishes dimensional or material fidelity.</p><div class="metric-choice"><label for="sort-experiments">RECORDED MESH MEASUREMENTS</label><select id="sort-experiments"><option value="source" ${state.sort==='source'?'selected':''}>Original order</option><option value="time" ${state.sort==='time'?'selected':''}>Fastest inference</option><option value="components" ${state.sort==='components'?'selected':''}>Most components</option></select></div><div class="table-wrap" tabindex="0" role="region" aria-label="TripoSR results table; scroll horizontally if needed"><table><thead><tr><th scope="col">INPUT</th><th scope="col">ms</th><th scope="col">VERTICES</th><th scope="col">FACES</th><th scope="col">CLOSED</th><th scope="col">PARTS</th></tr></thead><tbody>${rows.map(e=>`<tr><td>${escape(e.name)}</td><td>${e.ms.toFixed(2)}</td><td>${number(e.vertices)}</td><td>${number(e.faces)}</td><td>${e.watertight?'Yes':'No'}</td><td>${e.components}</td></tr>`).join('')}</tbody></table></div><p class="panel-note">“Closed” means reported watertightness; “parts” means connected components. Only the neural forward pass is timed.</p><div class="case-block"><h4>Environment & output handling</h4><p class="body-copy">RTX 4090 · Python 3.11 · PyTorch 2.5.1+cu121 · CUDA 12.1 · NumPy 1.26.4 · Trimesh 4.4.0. GPU neural inference with CPU marching-cubes extraction. Raw meshes were retained; upright copies received a display-only rotation in Blender.</p></div><button class="view-button" data-image="geometry-diagnostics" data-image-label="Material and solid-mode diagnostics for LACK and POÄNG">Inspect material vs. solid-mode evidence <svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" focusable="false"><path d="M6 18 18 6M6 6h12v12"/></svg></button>${limits(D.three)}${sourceBlock(D.three)}`;
  }

  function modelPanel(e) {
    if(!e.model) return '<p class="panel-note">The recorded views are available for this input. Explore this specimen through its recorded front and rear views.</p>';
    const m=e.model;
    return `<section class="model-panel" aria-label="Interactive model inspection"><div class="model-heading"><div><p class="panel-label">INSPECT THE ACTUAL EXPORT</p><h4>${escape(e.name)}</h4></div><span class="mono">${(m.bytes/1048576).toFixed(1)} MB · GLB</span></div><div class="model-stage" id="mesh-viewer"><img class="model-poster" src="./assets/${e.id}-front.webp" alt="Recorded front view of ${escape(e.name)}" width="575" height="550"><div class="model-start"><button class="button primary" data-load-model>Load interactive model <svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" focusable="false"><path d="M6 18 18 6M6 6h12v12"/></svg></button><p>Loads only when you choose. Drag to rotate; use the controls to zoom and inspect.</p></div></div><p class="model-status" id="model-status" role="status" aria-live="polite">Original upright display export · ${number(m.faces)} triangles.</p><div class="model-controls" id="model-controls" hidden><div class="model-mode"><label for="mesh-mode">Display</label><select id="mesh-mode"><option value="original">Original colours</option><option value="normals">Surface normals</option><option value="wireframe">Wireframe</option></select></div><div class="model-buttons"><button data-mesh-action="left" aria-label="Rotate model left">Rotate left</button><button data-mesh-action="right" aria-label="Rotate model right">Rotate right</button><button data-mesh-action="in" aria-label="Zoom model in">Zoom +</button><button data-mesh-action="out" aria-label="Zoom model out">Zoom −</button><button data-mesh-action="front">Front</button><button data-mesh-action="rear">Rear</button><button data-mesh-action="reset">Reset view</button></div></div><p class="panel-note">The experiment table reports the original raw mesh. This viewer uses the upright display export, whose vertex layout${m.faces!==e.faces?' and triangle count':''} differs after export. Viewer changes affect presentation only.</p><a class="text-link model-download" href="${m.url}" download="${e.id}-triposr.glb">Download this GLB <svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" focusable="false"><path d="M12 4v16m-6-6 6 6 6-6"/></svg></a></section>`;
  }
  function gestureExplore() {
    const p=D.gesture,m=p.models[state.gestureModel];
    return `<p class="panel-label">RECORDED MODEL COMPARISON</p><div class="segmented" role="group" aria-label="Choose gesture model">${p.models.map((x,i)=>`<button data-gesture-model="${i}" aria-pressed="${i===state.gestureModel}">${escape(x.name)}</button>`).join('')}</div><div class="metric-chart">${p.models.map((x,i)=>`<div class="chart-row ${i===state.gestureModel?'selected':''}"><span>${escape(x.name)}</span><div class="chart-track" aria-hidden="true"><div class="chart-fill" style="width:${x.test}%"></div></div><span class="chart-value">${x.test.toFixed(2)}%</span></div>`).join('')}</div><div class="experiment-stat-grid"><div><strong>${m.dev.toFixed(2)}%</strong><span>BEST DEVELOPMENT ACCURACY</span></div><div><strong>${m.test.toFixed(2)}%</strong><span>TEST ACCURACY</span></div><div><strong>${m.errors}</strong><span>MISCLASSIFIED TEST IMAGES</span></div></div><p class="panel-note">Saved evaluation results for rock, paper and scissors. This page does not activate your camera or run the trained classifier.</p><div class="callout"><strong>From notebook to inference</strong>Camera frame → training-aligned preprocessing → PyTorch checkpoint → class-label mapping → displayed prediction.</div><button class="view-button" data-evidence-image="gesture-accuracy">Inspect the repository comparison figure <svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" focusable="false"><path d="M6 18 18 6M6 6h12v12"/></svg></button>${sourceBlock(p)}`;
  }
  function qqpExplore() {
    const metric=state.qqpMetric,labels={f1:'F1',accuracy:'Accuracy',precision:'Precision',recall:'Recall'};
    return `<p class="panel-label">HELD-OUT QUESTION-PAIR RESULTS</p><div class="metric-choice"><label for="qqp-metric">Compare a metric</label><select id="qqp-metric">${Object.entries(labels).map(([k,v])=>`<option value="${k}" ${k===metric?'selected':''}>${v}</option>`).join('')}</select></div><div class="metric-chart qqp-chart" aria-label="Recorded ${labels[metric]} comparison">${D.qqp.models.map((m,i)=>`<div class="chart-row ${i===5?'selected':''}"><span>${escape(m.name)}</span><div class="chart-track" aria-hidden="true"><div class="chart-fill" style="width:${m[metric]*100}%"></div></div><span class="chart-value">${m[metric].toFixed(4)}</span></div>`).join('')}</div><div class="callout"><strong>Why the baseline matters</strong>The majority classifier reaches 63.2% accuracy while detecting no duplicate pairs. DistilBERT’s F1 of 0.7910 is compared with Naive Bayes at 0.5935 on the same project test subset.</div><p class="panel-note">10,000 training / 2,000 validation / 2,000 held-out test pairs. Threshold selection used validation data. These controls explore recorded results, not live inference.</p><button class="view-button" data-evidence-image="qqp-f1">Inspect the repository F1 figure <svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" focusable="false"><path d="M6 18 18 6M6 6h12v12"/></svg></button>${sourceBlock(D.qqp)}`;
  }
  const money=cents=>new Intl.NumberFormat('en-AU',{style:'currency',currency:'AUD'}).format(cents/100);
  function financeRows() {
    return D.finance.exampleCsv.trim().split(/\r?\n/).slice(1).map(line=>{
      const [date,description,amount]=line.split(','), negative=amount.startsWith('-'), [whole,fraction='']=amount.replace(/^[-+]/,'').split('.');
      const cents=(Number(whole)*100+Number(fraction.padEnd(2,'0')))*(negative?-1:1);
      const category=Object.entries(D.finance.rules).find(([,words])=>words.some(w=>description.toLowerCase().includes(w.toLowerCase())))?.[0]||'Uncategorised';
      return {date,description,cents,category};
    });
  }
  function financeExplore() {
    const rows=financeRows(), imported=state.financeImported, income=rows.filter(r=>r.cents>0).reduce((a,r)=>a+r.cents,0),spending=-rows.filter(r=>r.cents<0).reduce((a,r)=>a+r.cents,0);
    return `<p class="panel-label">FICTIONAL STATEMENT WALKTHROUGH</p><p class="body-copy">Try the public repository’s fictional January statement. This browser example demonstrates categorisation, exact cents and duplicate detection; the Python CLI itself runs locally.</p><div class="finance-actions"><button class="button primary" data-finance-action="import">${imported?'Import the same CSV again':'Import fictional CSV'} <svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" focusable="false"><path d="M6 18 18 6M6 6h12v12"/></svg></button><button class="view-button" data-finance-action="reset">Reset example</button></div><p class="finance-status" role="status" aria-live="polite">${escape(state.financeMessage||(imported?'Statement imported. The report contains 15 transactions.':'No statement imported yet.'))}</p><div class="mini-stat-grid finance-stats"><div class="mini-stat"><strong>${imported?money(income):'—'}</strong><span>INCOME</span></div><div class="mini-stat"><strong>${imported?money(spending):'—'}</strong><span>SPENDING</span></div><div class="mini-stat"><strong>${imported?money(income-spending):'—'}</strong><span>NET</span></div></div>${imported?`<div class="table-wrap" tabindex="0" role="region" aria-label="Fictional categorised transactions"><table><thead><tr><th scope="col">DESCRIPTION</th><th scope="col">CATEGORY</th><th scope="col">AMOUNT</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${escape(r.description)}</td><td>${escape(r.category)}</td><td>${money(r.cents)}</td></tr>`).join('')}</tbody></table></div>`:'<div class="callout"><strong>Import → categorise → report</strong>The example is processed in this page’s memory. It does not access your bank account or retain personal financial data.</div>'}<details class="sample-csv"><summary>Inspect the fictional source CSV</summary><pre>${escape(D.finance.exampleCsv)}</pre></details>${sourceBlock(D.finance)}`;
  }
  function genericEvidence(p) {
    const table=state.project==='qqp'?`<div class="table-wrap" tabindex="0" role="region" aria-label="Question-pair test results"><table><thead><tr><th scope="col">MODEL</th><th scope="col">ACCURACY</th><th scope="col">PRECISION</th><th scope="col">RECALL</th><th scope="col">F1</th></tr></thead><tbody>${p.models.map(m=>`<tr><td>${escape(m.name)}</td>${['accuracy','precision','recall','f1'].map(k=>`<td>${m[k].toFixed(4)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:state.project==='gesture'?`<div class="table-wrap" tabindex="0" role="region" aria-label="Gesture development and test results"><table><thead><tr><th scope="col">MODEL</th><th scope="col">BEST DEV</th><th scope="col">TEST</th><th scope="col">TEST ERRORS</th></tr></thead><tbody>${p.models.map(m=>`<tr><td>${escape(m.name)}</td><td>${m.dev.toFixed(2)}%</td><td>${m.test.toFixed(2)}%</td><td>${m.errors}</td></tr>`).join('')}</tbody></table></div>`:'';
    return `<p class="case-lead">Implementation and evaluation details.</p>${table}${limits(p)}${sourceBlock(p)}`;
  }
  function citationBlock(id) {
    const p=D.publications.find(p=>p.id===id);
    return `<div class="citation-panel"><p class="panel-label">PUBLICATION CITATION</p><p class="citation-text">${escape(p.citation)}</p><div class="case-links"><button data-copy-citation="${id}">Copy citation</button><a href="${p.bibUrl}" download="${id}.bib">Download BibTeX <svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" focusable="false"><path d="M12 4v16m-6-6 6 6 6-6"/></svg></a></div><details class="citation-details"><summary>Read BibTeX</summary><pre>${escape(p.bibtex)}</pre></details></div>`;
  }
  const phone = '<svg viewBox="0 0 24 34" fill="none" aria-hidden="true"><rect x="3" y="1" width="18" height="32" rx="3" stroke="currentColor"/><path d="M8 5h8M10 29h4" stroke="currentColor"/></svg>';
  function ssiExplore() {
    const s=D.ssi.steps[state.ssiStep];
    return `<p class="panel-label">CONNECTION DESIGN WALKTHROUGH</p><p class="body-copy">An illustration of the implemented design, not a live messaging or cryptography demo.</p><div class="ssi-flow"><div class="peer-row"><div class="peer">${phone}<span>PEER A</span></div><div class="peer-connection"><span>${escape(s.connection)}</span></div><div class="peer">${phone}<span>PEER B</span></div></div><div class="ssi-step-detail"><strong>${escape(s.title)}</strong>${escape(s.detail)}</div><div class="progress-dots" aria-hidden="true">${D.ssi.steps.map((_,i)=>`<span class="${i===state.ssiStep?'current':''}"></span>`).join('')}</div><div class="ssi-controls"><button data-ssi-action="previous" ${state.ssiStep===0?'disabled':''}>← Previous</button><span class="mono">0${state.ssiStep+1} / 04</span><button data-ssi-action="next" ${state.ssiStep===3?'disabled':''}>Next →</button></div></div><div class="case-block"><h4>My implementation contributions</h4><ul class="contribution-list">${D.ssi.contributions.map(([t,d])=>`<li><strong>${escape(t)}.</strong> ${escape(d)}</li>`).join('')}</ul></div><div class="case-links">${external(...D.ssi.links[0])}<button data-view="evidence">Read contribution scope <svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" focusable="false"><path d="M6 18 18 6M6 6h12v12"/></svg></button></div>`;
  }
  function ssiEvidence() {
    return `<span class="badge purple">FIRST AUTHOR / IEEE ICCIT 2024</span><p class="case-lead" style="margin-top:18px">An End-to-End Encrypted Peer-to-Peer Chat System with Self-Sovereign Identity</p><p class="body-copy">The publication grew from my undergraduate thesis research. My implementation contributions cover DIDComm-based messaging, QR-code connection establishment, and direct mobile-to-mobile communication without a centralised database.</p><div class="case-block"><h4>Publication record</h4><p class="body-copy">IEEE ICCIT 2024<br>DOI: <a style="text-decoration:underline;overflow-wrap:anywhere" href="https://doi.org/10.1109/ICCIT64611.2024.11022566" target="_blank" rel="noopener noreferrer">10.1109/ICCIT64611.2024.11022566</a></p></div><div class="callout"><strong>Why it belongs in an AI/ML portfolio</strong>This is security and distributed-systems research. It demonstrates prior research writing and implementation work, while my current AI projects add model integration and empirical evaluation.</div>${citationBlock('ssi')}${limits(D.ssi)}${sourceBlock(D.ssi)}`;
  }
  const routeOptions={step:'step',mode:'mode',metric:'metric',experiment:'experiment',sort:'sort',ssiStep:'connection',gestureModel:'model',qqpMetric:'compare',financeImported:'imported'};
  let lastRoute=null;
  function routeHash() {
    const query=new URLSearchParams();
    const relevant={rag:['step','mode','metric'],three:['experiment','sort'],ssi:['ssiStep'],gesture:['gestureModel'],qqp:['qqpMetric'],finance:['financeImported']}[state.project];
    for(const [key,name] of Object.entries(routeOptions)) if(relevant.includes(key)&&state[key]!==defaults[key]) query.set(name,String(state[key]));
    if(state.filter!=='all')query.set('filter',state.filter);
    return `#case/${state.project}/${state.tab}${query.size?'?'+query.toString():''}`;
  }
  function writeRoute(replace=false) {
    const hash=routeHash();
    if(location.hash!==hash) history[replace?'replaceState':'pushState']({portfolio:true},'',hash);
    lastRoute=hash;
  }
  function render(restoreFocus) {
    stopViewer();
    const p=D[state.project];
    document.getElementById('case-title').textContent=p.name;
    document.getElementById('case-kind').textContent=p.kind;
    document.getElementById('map-title').textContent=p.name;
    document.getElementById('map-kind').textContent=p.mapKind;
    document.getElementById('map-summary').textContent=p.summary;
    document.getElementById('map-position').textContent=`${String(order.indexOf(state.project)+1).padStart(2,'0')} / ${String(order.length).padStart(2,'0')}`;
    document.getElementById('map-open').setAttribute('aria-label',`Read case study: ${p.name}`);
    document.querySelectorAll('[data-project]').forEach(el=>{const active=el.dataset.project===state.project;el.classList.toggle('active',active);el.setAttribute('aria-pressed',String(active));el.hidden=state.filter!=='all'&&D[el.dataset.project].category!==state.filter;});
    document.querySelectorAll('[data-filter]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.filter===state.filter)));
    document.querySelectorAll('[data-map-project]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.mapProject===state.project)));
    document.querySelectorAll('[data-tab]').forEach(el=>{const active=el.dataset.tab===state.tab;el.setAttribute('aria-selected',String(active));el.tabIndex=active?0:-1;});
    panel.setAttribute('aria-labelledby',`tab-${state.tab}`);
    const explore={rag:ragExplore,three:threeExplore,ssi:ssiExplore,gesture:gestureExplore,finance:financeExplore,qqp:qqpExplore};
    const evidence={rag:ragEvidence,three:threeEvidence,ssi:ssiEvidence};
    panel.innerHTML=state.tab==='overview'?overview(p):state.tab==='explore'?explore[state.project]():(evidence[state.project]?evidence[state.project]():genericEvidence(p));
    document.title=p.name+' — Razin Rahat';
    if(restoreFocus) { const el=typeof restoreFocus==='string'?panel.querySelector(restoreFocus):null;el?.focus({preventScroll:true}); }
    window.dispatchEvent(new CustomEvent('portfolio:selection',{detail:{project:state.project}}));
  }
  function setProject(key,{scroll=false}={}) {
    if(!order.includes(key)) return;
    if(state.filter!=='all'&&D[key].category!==state.filter) state.filter='all';
    state.project=key;state.tab='overview';render();writeRoute();
    if(scroll) document.getElementById('work').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
  }
  function setTab(tab,focus=false) { if(!['overview','explore','evidence'].includes(tab))return;state.tab=tab;render();writeRoute();if(focus) document.getElementById(`tab-${tab}`).focus({preventScroll:true}); }
  document.querySelectorAll('[data-project]').forEach(el=>el.addEventListener('click',()=>setProject(el.dataset.project)));
  document.querySelectorAll('[data-map-project]').forEach(el=>el.addEventListener('click',()=>setProject(el.dataset.mapProject)));
  document.querySelectorAll('[data-open-project]').forEach(el=>el.addEventListener('click',()=>setProject(el.dataset.openProject,{scroll:true})));
  document.getElementById('map-open').addEventListener('click',()=>setProject(state.project,{scroll:true}));
  document.querySelectorAll('[data-filter]').forEach(el=>el.addEventListener('click',()=>{state.filter=el.dataset.filter;if(state.filter!=='all'&&D[state.project].category!==state.filter){state.project=order.find(k=>D[k].category===state.filter);state.tab='overview';}render();writeRoute();}));
  document.querySelectorAll('[data-tab]').forEach(el=>{
    el.addEventListener('click',()=>setTab(el.dataset.tab));
    el.addEventListener('keydown',e=>{const names=['overview','explore','evidence'];let index=names.indexOf(state.tab);if(e.key==='ArrowRight')index=(index+1)%3;else if(e.key==='ArrowLeft')index=(index+2)%3;else if(e.key==='Home')index=0;else if(e.key==='End')index=2;else return;e.preventDefault();setTab(names[index],true);});
  });
  panel.addEventListener('click',e=>{
    const view=e.target.closest('[data-view]');if(view){setTab(view.dataset.view,true);return;}
    const step=e.target.closest('[data-step]');if(step){state.step=Number(step.dataset.step);writeRoute();render(`[data-step="${state.step}"]`);return;}
    const mode=e.target.closest('[data-mode]');if(mode){state.mode=Number(mode.dataset.mode);writeRoute();render(`[data-mode="${state.mode}"]`);return;}
    const ssi=e.target.closest('[data-ssi-action]');if(ssi){state.ssiStep=Math.max(0,Math.min(3,state.ssiStep+(ssi.dataset.ssiAction==='next'?1:-1)));writeRoute();render();const selector=state.ssiStep===3?'[data-ssi-action="previous"]':state.ssiStep===0?'[data-ssi-action="next"]':`[data-ssi-action="${ssi.dataset.ssiAction}"]`;panel.querySelector(selector)?.focus({preventScroll:true});return;}
    const gesture=e.target.closest('[data-gesture-model]');if(gesture){state.gestureModel=Number(gesture.dataset.gestureModel);writeRoute();render(`[data-gesture-model="${state.gestureModel}"]`);return;}
    const figure=e.target.closest('[data-evidence-image]');if(figure){openEvidenceImage(figure.dataset.evidenceImage);return;}
    const finance=e.target.closest('[data-finance-action]');if(finance){handleFinance(finance.dataset.financeAction);return;}
    const load=e.target.closest('[data-load-model]');if(load){loadModel();return;}
    const img=e.target.closest('[data-image]');if(img){openImage(img.dataset.image,img.dataset.imageLabel);}
  });
  panel.addEventListener('change',e=>{
    if(e.target.id==='qqp-metric'&&['f1','accuracy','precision','recall'].includes(e.target.value)){state.qqpMetric=e.target.value;writeRoute();render('#qqp-metric');}
    if(e.target.id==='metric-select'&&D.retrieval.metrics[e.target.value]){state.metric=e.target.value;writeRoute();render('#metric-select');}
    if(e.target.id==='experiment-select'){const i=Number(e.target.value);if(Number.isInteger(i)&&D.three.experiments[i]){state.experiment=i;writeRoute();render('#experiment-select');}}
    if(e.target.id==='sort-experiments'&&['source','time','components'].includes(e.target.value)){state.sort=e.target.value;writeRoute();render('#sort-experiments');}
  });
  const importedSampleHashes=new Set();
  async function handleFinance(action) {
    if(state.financeBusy)return;
    if(action==='reset'){importedSampleHashes.clear();state.financeImported=false;state.financeMessage='Example reset. No statement imported.';}
    else {
      state.financeBusy=true;
      panel.querySelector('[data-finance-action="import"]').disabled=true;
      let fingerprint='7557c3f8092bed84380d3e7f31d44f5f600b3cf9f38d939eb7e7bb3dfc89d37c';
      try {
        if(globalThis.crypto?.subtle){const bytes=new TextEncoder().encode(D.finance.exampleCsv);const digest=await crypto.subtle.digest('SHA-256',bytes);fingerprint=Array.from(new Uint8Array(digest),n=>n.toString(16).padStart(2,'0')).join('');}
        if(importedSampleHashes.has(fingerprint)||state.financeImported)state.financeMessage='Duplicate statement detected. Import skipped; the report still contains 15 transactions.';
        else{importedSampleHashes.add(fingerprint);state.financeImported=true;state.financeMessage='Imported 15 transactions. Categories matched using the repository’s fictional rules.';}
      }finally{state.financeBusy=false;}
    }
    if(state.project==='finance'&&state.tab==='explore'){writeRoute();render(`[data-finance-action="${action}"]`);}
  }
  async function loadModel() {
    const experiment=D.three.experiments[state.experiment],container=document.getElementById('mesh-viewer'),status=document.getElementById('model-status'),button=panel.querySelector('[data-load-model]');
    if(!experiment.model||!container)return;
    stopViewer();const abort=new AbortController();viewerAbort=abort;button.disabled=true;
    status.textContent=`Loading ${(experiment.model.bytes/1048576).toFixed(1)} MB model…`;
    try {
      const {mountViewer}=await import('./model-viewer.js');
      if(abort.signal.aborted)return;
      const viewer=await mountViewer(container,{url:experiment.model.url,label:experiment.name,signal:abort.signal});
      if(abort.signal.aborted){viewer.dispose();return;}
      viewerStop=viewer.dispose;
      document.getElementById('model-controls').hidden=false;
      status.textContent=viewer.compatibility?`${experiment.name} ready · compatibility point view from the actual GLB. GPU rendering is unavailable in this browser. Use the controls to inspect the geometry.`:`${experiment.name} ready. Drag to rotate, pinch or use the controls to zoom. ${number(experiment.model.faces)} export triangles.`;
      if(viewer.compatibility){document.querySelector('#mesh-mode option[value="original"]').textContent='Original colours · sampled points';document.querySelector('#mesh-mode option[value="wireframe"]').textContent='Sampled wireframe';}
      const controls=document.getElementById('model-controls');
      controls.addEventListener('click',e=>{const b=e.target.closest('[data-mesh-action]');if(b)viewer.action(b.dataset.meshAction);});
      controls.addEventListener('change',e=>{if(e.target.id==='mesh-mode')viewer.setMode(e.target.value);});
    }catch(error){if(!abort.signal.aborted){status.textContent='The interactive viewer could not load here. The recorded views and original GLB download remain available.';button.disabled=false;console.warn('Model viewer:',error.message);}}
  }
  async function copyCitation(id) {
    const p=D.publications.find(p=>p.id===id);if(!p)return;
    try{await navigator.clipboard.writeText(p.citation);toast('Publication citation copied.');}
    catch {const article=document.getElementById('pub-'+id)?.closest('.publication');const details=article?.querySelector('details');if(details){details.open=true;details.scrollIntoView({block:'center'});}toast('Open the citation text to select and copy it.');}
  }
  document.addEventListener('click',e=>{const b=e.target.closest('[data-copy-citation]');if(b)copyCitation(b.dataset.copyCitation);});
  function openEvidenceImage(id) {
    const figures={'gesture-accuracy':'Gesture model test accuracy comparison','qqp-f1':'Question-pair model F1 comparison'};
    if(!figures[id])return;
    const image=document.getElementById('dialog-image');image.src='./assets/'+id+'.png';image.alt=figures[id];
    document.getElementById('dialog-title').textContent=figures[id];
    document.getElementById('dialog-caption').textContent='Original evaluation figure from the project’s pinned public GitHub repository.';
    document.getElementById('image-dialog').showModal();
  }
  const dialog=document.getElementById('image-dialog');
  function openImage(id,label) {
    if(!/^(lack|poang|tertial|carafe|poang-alt)-(input|front|rear|figure)$/.test(id)&&id!=='geometry-diagnostics')return;
    const img=document.getElementById('dialog-image');img.src=`./assets/${id}.webp`;img.alt=label;
    document.getElementById('dialog-title').textContent=label;
    document.getElementById('dialog-caption').textContent='Recorded experiment evidence from the COMP8410 report. Source product photography: IKEA Australia. Reconstruction views: pretrained TripoSR outputs. Images are not verified product geometry.';
    dialog.showModal();
  }
  document.getElementById('close-dialog').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  document.getElementById('copy-case-link').addEventListener('click',async()=>{writeRoute(true);try{await navigator.clipboard.writeText(window.location.href);toast('Case study link copied.');}catch{toast('The case study link is now in your address bar. Copy it there.');}});
  document.querySelectorAll('.mobile-nav a').forEach(a=>a.addEventListener('click',()=>a.closest('details').removeAttribute('open')));
  function readRoute(scroll=false) {
    if(location.hash===lastRoute)return;
    lastRoute=location.hash;
    const match=location.hash.match(/^#case\/([a-z]+)\/(overview|explore|evidence)(?:\?(.*))?$/);
    if(!match){if(!location.hash||location.hash==='#home'){Object.assign(state,defaults);render();document.title='Razin Rayan Rahat — Software & AI/ML Engineering';}return;}
    if(!order.includes(match[1]))return;
    Object.assign(state,defaults,{project:match[1],tab:match[2]});
    const q=new URLSearchParams(match[3]||'');
    for(const [key,name] of Object.entries(routeOptions)){
      if(!q.has(name))continue;const value=q.get(name);
      if(typeof defaults[key]==='boolean')state[key]=value==='true';
      else if(typeof defaults[key]==='number'){const n=Number(value);if(Number.isInteger(n))state[key]=n;}
      else state[key]=value;
    }
    state.step=Math.max(0,Math.min(3,state.step));state.mode=Math.max(0,Math.min(3,state.mode));state.experiment=Math.max(0,Math.min(4,state.experiment));state.ssiStep=Math.max(0,Math.min(3,state.ssiStep));state.gestureModel=Math.max(0,Math.min(1,state.gestureModel));
    if(!D.retrieval.metrics[state.metric])state.metric='ndcg';
    if(!['f1','accuracy','precision','recall'].includes(state.qqpMetric))state.qqpMetric='f1';
    if(!['source','time','components'].includes(state.sort))state.sort='source';
    if(['engineering','ml','research'].includes(q.get('filter'))&&D[state.project].category===q.get('filter'))state.filter=q.get('filter');
    render();if(scroll)document.getElementById('work').scrollIntoView({block:'start'});
  }
  window.addEventListener('hashchange',()=>readRoute(true));
  window.addEventListener('popstate',()=>readRoute(true));
  render();readRoute(true);
  // Small read-only API for deterministic, browser-free behaviour checks.
  window.Portfolio = { getState:()=>({...state}), selectProject:setProject, selectTab:setTab };
})();
