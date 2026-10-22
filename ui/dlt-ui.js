/* Drug Lord Tycoon – gemeinsames UI: Startmenü, Pause, Einstellungen, Steuerung, Multiplayer-Lobby, Dialoge, Toasts.
   Reine Oberfläche: Die Spiele binden sich über DLT.init({...}) ein. */
(function(){
'use strict';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const lsGet=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const lsSet=(k,v)=>{try{localStorage.setItem(k,v);return true}catch(e){return false}};
const lsDel=k=>{try{localStorage.removeItem(k)}catch(e){}};
const rnd=(a,b)=>a+Math.random()*(b-a);
const pick=a=>a[Math.floor(Math.random()*a.length)];

const D={opts:null,cfg:{},defs:[],root:null,card:null,screen:'main',mode:'start',stack:[],listeners:[],lobby:null,timers:[]};
const API={noSave:false};
window.DLT=API;

// ---------- Einstellungen ----------
const BASE_SETTINGS=[
  {id:'uiScale',tab:'Allgemein',label:'Menü-Größe',desc:'Skaliert Menüs und Dialoge.',type:'range',min:.8,max:1.4,step:.05,def:1,fmt:v=>Math.round(v*100)+' %',cssVar:'--ui'},
  {id:'reduceMotion',tab:'Allgemein',label:'Reduzierte Animationen',desc:'Schaltet Übergänge und Hintergrundeffekte ab.',type:'toggle',
   def:(()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}})()},
];
function loadCfg(){
  let saved={};try{saved=JSON.parse(lsGet(D.skey)||'{}')||{}}catch(e){}
  D.cfg={};D.defs.forEach(d=>{const v=saved[d.id];D.cfg[d.id]=(v===undefined||typeof v!==typeof d.def)?d.def:v});
}
function saveCfg(){lsSet(D.skey,JSON.stringify(D.cfg))}
function applyOne(d){
  const v=D.cfg[d.id];
  if(d.cssVar)document.documentElement.style.setProperty(d.cssVar,v);
  if(d.id==='reduceMotion'){v?document.documentElement.setAttribute('data-motion','reduced'):document.documentElement.removeAttribute('data-motion')}
  D.listeners.forEach(f=>{try{f(d.id,v,D.cfg)}catch(e){console.error(e)}});
}
API.get=id=>D.cfg[id];
API.set=(id,v)=>{const d=D.defs.find(x=>x.id===id);if(!d)return;D.cfg[id]=v;saveCfg();applyOne(d)};
API.onChange=(fn,fireNow)=>{D.listeners.push(fn);if(fireNow)D.defs.forEach(d=>{try{fn(d.id,D.cfg[d.id],D.cfg)}catch(e){console.error(e)}})};
API.refresh=()=>{if(D.root&&API.isOpen())render(false)};
API.isOpen=()=>!!(D.root&&D.root.classList.contains('open'));

// ---------- Dialoge & Toasts ----------
let toastBox=null;
API.toast=(text,type='',ms=2600)=>{
  if(!toastBox){toastBox=document.createElement('div');toastBox.className='dlt-toasts';toastBox.setAttribute('role','status');document.body.appendChild(toastBox)}
  const t=document.createElement('div');t.className='dlt-toast '+type;t.textContent=text;toastBox.appendChild(t);
  while(toastBox.children.length>3)toastBox.firstChild.remove();
  setTimeout(()=>{t.style.transition='opacity .3s';t.style.opacity=0;setTimeout(()=>t.remove(),320)},ms);
};
API.confirm=({title='Sicher?',text='',ok='OK',cancel='Abbrechen',danger=false,extra=null}={})=>new Promise(res=>{
  const prev=document.activeElement;
  const m=document.createElement('div');m.className='dlt-modal';
  m.innerHTML=`<div class="dlt-dlg" role="alertdialog" aria-modal="true"><h3>${esc(title)}</h3><p>${esc(text)}</p><div class="acts">${cancel?`<button class="dlt-sm" data-r="0">${esc(cancel)}</button>`:''}${extra?`<button class="dlt-sm" data-r="x">${esc(extra)}</button>`:''}<button class="dlt-sm ${danger?'red':'go'}" data-r="1">${esc(ok)}</button></div></div>`;
  document.body.appendChild(m);
  const done=r=>{m.remove();document.removeEventListener('keydown',kd,true);prev&&prev.focus&&prev.focus();res(r)};
  const kd=e=>{if(e.code==='Escape'){e.preventDefault();e.stopPropagation();done(false)}else if(e.code==='Tab'){const b=[...m.querySelectorAll('button')];const i=b.indexOf(document.activeElement);e.preventDefault();b[(i+(e.shiftKey?-1:1)+b.length)%b.length].focus()}else e.stopPropagation()};
  document.addEventListener('keydown',kd,true);
  m.addEventListener('click',e=>{const b=e.target.closest('button');if(b)done(b.dataset.r==='1'?true:b.dataset.r==='x'?'extra':false);else if(e.target===m)done(false)});
  m.querySelector('[data-r="1"]').focus();
});

// ---------- Hilfen ----------
const kbd=k=>`<kbd class="dlt-kbd">${esc(k)}</kbd>`;
function copyText(txt,ok='In die Zwischenablage kopiert'){
  const fb=()=>{const ta=document.createElement('textarea');ta.value=txt;ta.style.cssText='position:fixed;opacity:0';document.body.appendChild(ta);ta.select();let r=false;try{r=document.execCommand('copy')}catch(e){}ta.remove();API.toast(r?ok:'Kopieren nicht möglich – bitte manuell markieren',r?'':'bad')};
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(txt).then(()=>API.toast(ok),fb);else fb();
}
function playerName(){let n=lsGet('dlt_player');if(!n){n='Boss'+Math.floor(rnd(100,999));lsSet('dlt_player',n)}return n}

// ---------- Aufbau ----------
API.init=function(o){
  D.opts=o;D.skey='dlt_settings_'+(o.gameId||'game');
  D.defs=[...BASE_SETTINGS,...(o.settings||[])];
  loadCfg();
  const r=document.createElement('div');r.className='dlt-root';r.setAttribute('role','dialog');r.setAttribute('aria-label','Menü');
  r.innerHTML=`<div class="dlt-bg"></div><div class="dlt-smoke"></div><div class="dlt-grid"></div><div class="dlt-vig"></div>
  <div class="dlt-shell"><div class="dlt-brand" id="dltBrand"></div><div class="dlt-card" id="dltCard"></div></div>
  <div class="dlt-ver">${esc(o.version||'')}</div><div class="dlt-legal">${esc(o.legal||'Satire · fiktive Spielmechanik · keine echten Anleitungen · ab 18')}</div>`;
  document.body.appendChild(r);D.root=r;D.card=r.querySelector('#dltCard');
  const L=o.logo||['DRUG LORD','TYCOON'];
  r.querySelector('#dltBrand').innerHTML=`<h1 class="dlt-logo"><span><i class="dlt-skull">☠</i>${esc(L[0])}</span><span class="l2">${esc(L[1])}</span></h1>
    <p class="dlt-sub">${o.sub||''}</p><p class="dlt-tag">${esc(o.tagline||'')}</p><div class="dlt-chips" id="dltChips"></div>`;
  r.addEventListener('click',onClick);
  r.addEventListener('input',onInput);
  r.addEventListener('change',onInput);
  addEventListener('keydown',onKey,true);
  D.defs.forEach(applyOne);
};
API.warn=t=>{D.warnText=t;const e=D.root&&D.root.querySelector('.dlt-warnline');if(e)e.textContent=t||''};
API.open=function(screen='main',{mode}={}){
  if(mode)D.mode=mode;
  D.stack=[];D.root.classList.add('open');go(screen,true);
  if(D.opts.onOpen)D.opts.onOpen(D.mode);
};
API.close=function(){D.root.classList.remove('open');if(D.opts.onClose)D.opts.onClose()};

// ---------- Navigation ----------
function go(screen,reset){
  if(!reset&&D.screen&&D.screen!==screen)D.stack.push(D.screen);
  D.screen=screen;render(true);
}
function back(){
  const s=D.stack.pop();
  if(s){D.screen=s;render(true)}else if(D.screen!=='main'){D.screen='main';render(true)}
}
function render(anim){
  const S=screens[D.screen];if(!S)return;
  D.card.className='dlt-card'+(S.wide?' wide':'')+(D.screen==='settings'?' tall':'');
  if(!anim)D.card.style.animation='none';else D.card.style.animation='';
  const ae=!anim&&document.activeElement,keep=ae&&ae.id&&D.card.contains(ae)?{id:ae.id,v:ae.value,s:ae.selectionStart}:null;
  D.card.innerHTML=S.html();
  if(keep){const n=D.card.querySelector('#'+keep.id);if(n){if(n.tagName==='INPUT'||n.tagName==='TEXTAREA'){n.value=keep.v;try{n.setSelectionRange(keep.s,keep.s)}catch(e){}}n.focus({preventScroll:true})}}
  if(S.after)S.after(D.card);
  chips();
  if(anim){const f=D.card.querySelector('[data-autofocus]')||D.card.querySelector('.dlt-btn:not(:disabled)')||D.card.querySelector('button');f&&f.focus({preventScroll:true});D.card.scrollTop=0}
}
function chips(){
  const c=D.root.querySelector('#dltChips');
  const pause=D.mode==='pause';
  c.innerHTML=`<span class="dlt-chip ${pause?'warn':'ok'}">${pause?'⏸ Pausiert':'● Bereit'}</span><span class="dlt-chip">👤 ${esc(playerName())}</span>`+(D.lobby?`<span class="dlt-chip ok">👥 Lobby ${esc(D.lobby.code)}</span>`:'');
}
const head=(title,sub,showBack=true)=>`<div class="dlt-head">${showBack?'<button class="dlt-back" data-act="back" aria-label="Zurück" title="Zurück (Esc)">←</button>':''}<h2>${title}${sub?`<small>${sub}</small>`:''}</h2></div>`;
const btn=(act,ic,label,sub,cls='')=>`<button class="dlt-btn ${cls}" data-act="${act}"><span class="ic">${ic}</span><span>${label}${sub?`<small>${sub}</small>`:''}</span><span class="gt">›</span></button>`;

// ---------- Screens ----------
const screens={
 main:{html(){
  const o=D.opts,pause=D.mode==='pause',has=o.hasSave&&o.hasSave();
  let h='';
  if(pause){h+=btn('play','▶','Weiter','zurück ins Spiel','primary');if(o.onSave)h+=btn('save','💾','Speichern','Spielstand jetzt sichern')}
  else if(has){h+=btn('play','▶','Weiter',o.saveInfo?esc(o.saveInfo()):'Spielstand fortsetzen','primary')+btn('new','✦','Neues Spiel','Startet bei null (Sicherheitsabfrage)')}
  else h+=btn('play','▶','Spiel starten',o.startHint?esc(o.startHint):'','primary');
  h+=btn('mp','👥','Multiplayer','Lobby erstellen oder beitreten',D.lobby?'':'')+btn('settings','⚙','Einstellungen','Grafik, Steuerung, Daten')+btn('controls','⌨','Steuerung','Tasten &amp; Bedienung')+btn('about','ℹ','Über &amp; Hinweis','Satire-Hinweis, Infos');
  h+=`<div class="dlt-warnline">${esc(D.warnText||'')}</div>`;
  return h}},
 settings:{wide:true,html(){
  const tabs=[...new Set(D.defs.map(d=>d.tab))];tabs.push('Daten');
  if(!tabs.includes(D.tab))D.tab=tabs[0];
  let h=head('Einstellungen','Änderungen gelten sofort und werden automatisch gespeichert.');
  h+=`<div class="dlt-tabs" role="tablist">${tabs.map(t=>`<button class="dlt-tab ${t===D.tab?'on':''}" role="tab" aria-selected="${t===D.tab}" data-act="tab" data-v="${esc(t)}">${esc(t)}</button>`).join('')}</div>`;
  if(D.tab==='Daten')return h+dataTab();
  D.defs.filter(d=>d.tab===D.tab).forEach(d=>{h+=optRow(d)});
  h+=`<div class="dlt-foot"><span></span><button class="dlt-sm" data-act="cfgreset">↺ Alle Einstellungen zurücksetzen</button></div>`;
  return h}},
 controls:{wide:true,html(){
  let h=head('Steuerung','Bedienung des Spiels');
  (D.opts.controls||[]).forEach(g=>{h+=`<div class="dlt-sect">${esc(g.title)}</div><div class="dlt-keys">`+g.rows.map(([k,t])=>`<div class="dlt-keyrow"><span class="k">${k.map(kbd).join('')}</span><span>${esc(t)}</span></div>`).join('')+'</div>'});
  return h}},
 about:{html(){
  const o=D.opts;
  return head('Über &amp; Hinweis')+`<div class="dlt-note">⚠ <span><b>Satire-Spiel.</b> Alle Stoffe, Abläufe, Mengen und Werte sind frei erfunden und keine Anleitung für irgendetwas. Herstellung, Besitz und Handel mit Drogen sind in der Realität strafbar und gefährlich. Nur zur Unterhaltung – ab 18.</span></div>
   <p style="color:#b7c0cf;line-height:1.6;margin:0 0 10px">${esc(o.about||'Inoffizieller Fan-Nachbau, inspiriert von „Drug Lord Tycoon“. Läuft komplett im Browser; der Spielstand liegt lokal in deinem Browser-Speicher.')}</p>
   <div class="dlt-foot"><span>${esc(o.version||'')}</span><span>Spielstand: nur lokal gespeichert</span></div>`}},
 mp:{wide:true,html(){
  const L=D.lobby;
  return head('Multiplayer','Lobby erstellen oder per Code beitreten')+
  `<div class="dlt-note">🚧 <span><b>UI-Vorschau.</b> Der Online-Modus (Server &amp; Netzcode) ist noch nicht angebunden. Lobby, Bereit-Status und Chat laufen lokal mit Demo-Bots, damit man die Oberfläche testen kann.</span></div>
   <div class="dlt-field"><label for="dltName">Dein Name</label><input class="dlt-input" id="dltName" maxlength="16" value="${esc(playerName())}" autocomplete="off" spellcheck="false"></div>
   ${L?`<div class="dlt-box" style="margin-bottom:14px"><h3>Aktive Lobby</h3><div class="dlt-row"><b style="font:700 20px ui-monospace,Consolas,monospace;letter-spacing:.15em;color:var(--gold)">${esc(L.code)}</b><span class="dlt-spacer"></span><button class="dlt-sm go" data-act="lobbyopen">Zur Lobby ›</button></div></div>`:''}
   <div class="dlt-two">
    <div class="dlt-box"><h3>Lobby erstellen</h3>
      <div class="dlt-field"><label>Modus</label>${seg('mpMode',[['coop','Koop'],['versus','Wettbewerb']],D.mpMode||'coop')}</div>
      <div class="dlt-field"><label>Max. Spieler</label>${seg('mpMax',[[2,'2'],[3,'3'],[4,'4']],D.mpMax||4)}</div>
      <div class="dlt-field"><label>Sichtbarkeit</label>${seg('mpPriv',[['0','Öffentlich'],['1','Nur Code']],D.mpPriv||'0')}</div>
      <button class="dlt-sm go" style="width:100%;justify-content:center;padding:11px" data-act="create" ${L?'disabled title="Du bist bereits in einer Lobby"':''}>＋ Lobby erstellen</button></div>
    <div class="dlt-box"><h3>Per Code beitreten</h3>
      <div class="dlt-field"><label for="dltJoin">Lobby-Code</label><input class="dlt-input" id="dltJoin" maxlength="8" placeholder="DLT-XXXX" autocomplete="off" spellcheck="false" style="text-transform:uppercase;letter-spacing:.15em;font-family:ui-monospace,Consolas,monospace"></div>
      <button class="dlt-sm" style="width:100%;justify-content:center;padding:11px" data-act="join" id="dltJoinBtn">Beitreten</button>
      <div class="dlt-warnline" id="dltJoinMsg" style="color:#ff8a96"></div></div>
   </div>
   <div class="dlt-box" style="margin-top:14px"><h3>Öffentliche Lobbys <button class="dlt-sm" style="float:right;padding:3px 10px;margin-top:-6px" data-act="refresh" id="dltRefresh">⟳ Aktualisieren</button></h3>
     <div id="dltList">${D.listState==='busy'?'<div class="dlt-empty"><span class="dlt-spin"></span><br>Suche Server …</div>':`<div class="dlt-empty"><b>📡</b>${D.listState==='done'?'Keine öffentlichen Lobbys gefunden.<br>Erstelle selbst eine!':'Noch nicht gesucht.'}</div>`}</div></div>`}},
 lobby:{wide:true,after(c){const x=c.querySelector('#dltChat');if(x)x.scrollTop=x.scrollHeight},html(){
  const L=D.lobby;if(!L)return head('Lobby')+'<div class="dlt-empty">Keine Lobby aktiv.</div>';
  const me=L.players[0],allReady=L.players.length>1&&L.players.every(p=>p.ready||p.host);
  const slots=[];for(let i=0;i<L.max;i++){const p=L.players[i];
    slots.push(p?`<div class="dlt-slot" style="--c:${p.color}"><span class="av">${p.bot?'🤖':'😎'}</span><span class="nm">${esc(p.name)}${i===0?' <small style="display:inline">(du)</small>':''}<small>${p.host?'Host':p.bot?'Demo-Bot':'Spieler'}</small></span>${p.host?'<span class="dlt-badge host">Host</span>':''}<span class="dlt-badge ${p.ready||p.host?'rdy':''}">${p.ready||p.host?'Bereit':'Wartet'}</span>${p.bot?`<button class="dlt-sm red" style="padding:4px 9px" data-act="kick" data-v="${i}" title="Entfernen">✕</button>`:''}</div>`
      :`<div class="dlt-slot empty"><span class="av">＋</span><span class="nm">Freier Platz<small>Warte auf Spieler …</small></span></div>`)}
  return head('Lobby',(L.mode==='coop'?'Koop':'Wettbewerb')+' · '+(L.priv==='1'?'Nur Code':'Öffentlich')+` · ${L.players.length}/${L.max} Spieler`)+
   `<div class="dlt-note">🚧 <span>UI-Vorschau – ohne Server. Mit „Demo-Bot“ siehst du, wie sich die Lobby mit Mitspielern anfühlt.</span></div>
    <div class="dlt-two"><div>
      <div class="dlt-code"><span id="dltCode">${esc(L.code)}</span><span class="dlt-row"><button class="dlt-sm" data-act="copycode" title="Code kopieren">📋</button><button class="dlt-sm" data-act="copylink" title="Einladungslink kopieren">🔗</button></span></div>
      <div class="dlt-sect">Spieler</div><div class="dlt-slots" id="dltSlots">${slots.join('')}</div>
      <div class="dlt-row"><button class="dlt-sm" data-act="bot" ${L.players.length>=L.max?'disabled':''}>🤖 Bot hinzufügen</button><span class="dlt-spacer"></span><button class="dlt-sm ${me.ready?'':'go'}" data-act="ready">${me.ready?'✖ Nicht bereit':'✔ Bereit'}</button></div>
    </div><div>
      <div class="dlt-sect" style="margin-top:0">Chat</div>
      <div class="dlt-chat" id="dltChat" aria-live="polite">${L.chat.map(chatLine).join('')}</div>
      <div class="dlt-chatin"><input class="dlt-input" id="dltMsg" maxlength="120" placeholder="Nachricht … (Enter)" autocomplete="off"><button class="dlt-sm" data-act="send">Senden</button></div>
    </div></div>
    <div class="dlt-foot"><button class="dlt-sm red" data-act="leave">Lobby verlassen</button><button class="dlt-sm go" data-act="lstart" ${allReady?'':'disabled'} title="${allReady?'':'Alle Spieler müssen bereit sein (mind. 2)'}">▶ Spiel starten ${allReady?'':'(warte auf Spieler)'}</button></div>`}},
};
const chatLine=m=>m.sys?`<div class="sys">${esc(m.t)}</div>`:`<div><b class="${m.me?'me':''}">${esc(m.n)}</b>${m.bot?' <span class="dlt-badge" style="padding:0 5px;font-size:9px">BOT</span>':''}: ${esc(m.t)}</div>`;
const seg=(id,opts,cur)=>`<div class="dlt-seg" data-seg="${id}">${opts.map(([v,l])=>`<button type="button" class="${String(v)===String(cur)?'on':''}" data-act="seg" data-k="${id}" data-v="${v}">${l}</button>`).join('')}</div>`;

function optRow(d){
  const v=D.cfg[d.id];let ct='';
  if(d.type==='range'){const p=(v-d.min)/(d.max-d.min)*100;ct=`<input class="dlt-range" type="range" id="o_${d.id}" data-opt="${d.id}" min="${d.min}" max="${d.max}" step="${d.step||1}" value="${v}" style="--p:${p}%" aria-label="${esc(d.label)}"><span class="val" id="v_${d.id}">${d.fmt?d.fmt(v):v}</span>`}
  else if(d.type==='toggle')ct=`<button class="dlt-tgl" role="switch" aria-checked="${!!v}" aria-label="${esc(d.label)}" data-act="tgl" data-opt="${d.id}"></button>`;
  else if(d.type==='select')ct=`<div class="dlt-seg">${d.options.map(([val,l])=>`<button type="button" class="${String(val)===String(v)?'on':''}" data-act="sel" data-opt="${d.id}" data-v="${val}">${esc(l)}</button>`).join('')}</div>`;
  return `<div class="dlt-opt"><div class="lb">${esc(d.label)}${d.desc?`<small>${esc(d.desc)}</small>`:''}</div><div class="ct">${ct}</div></div>`;
}
function dataTab(){
  const raw=D.opts.storageKey?lsGet(D.opts.storageKey):null;
  return `<div class="dlt-sect" style="margin-top:4px">Spielstand sichern</div>
   <p style="color:var(--mut);font-size:13px;margin:4px 0 8px;line-height:1.5">Der Spielstand liegt nur in diesem Browser. Kopiere ihn, um ihn zu sichern oder auf ein anderes Gerät zu übertragen.</p>
   <textarea class="dlt-area" id="dltExp" readonly placeholder="Noch kein Spielstand vorhanden …">${raw?esc(raw):''}</textarea>
   <div class="dlt-row" style="margin-top:8px"><button class="dlt-sm" data-act="exp" ${raw?'':'disabled'}>📋 Kopieren</button></div>
   <div class="dlt-sect">Spielstand laden</div>
   <textarea class="dlt-area" id="dltImp" placeholder="Gesicherten Spielstand hier einfügen …"></textarea>
   <div class="dlt-row" style="margin-top:8px"><button class="dlt-sm" data-act="imp">⤓ Importieren</button></div>
   <div class="dlt-sect">Gefahrenzone</div>
   <button class="dlt-btn danger" data-act="wipe" style="font-size:15px;padding:11px 16px"><span class="ic">🗑</span><span>Spielstand löschen<small>Setzt das Spiel komplett zurück</small></span></button>`;
}

// ---------- Ereignisse ----------
function onInput(e){
  const t=e.target;
  if(t.dataset&&t.dataset.opt&&t.type==='range'){
    const d=D.defs.find(x=>x.id===t.dataset.opt),v=parseFloat(t.value);D.cfg[d.id]=v;
    t.style.setProperty('--p',((v-d.min)/(d.max-d.min)*100)+'%');
    const l=D.root.querySelector('#v_'+d.id);if(l)l.textContent=d.fmt?d.fmt(v):v;
    clearTimeout(onInput.t);onInput.t=setTimeout(saveCfg,250);applyOne(d);
  }else if(t.id==='dltName'){const n=t.value.replace(/[<>]/g,'').trim().slice(0,16);if(n){lsSet('dlt_player',n);chips()}}
  else if(t.id==='dltJoin'){t.value=t.value.toUpperCase()}
}
function onClick(e){
  const b=e.target.closest('[data-act]');if(!b||b.disabled)return;
  const a=b.dataset.act,o=D.opts;
  if(a==='back')back();
  else if(a==='play'){API.close();o.onPlay&&o.onPlay(D.mode)}
  else if(a==='save'){o.onSave&&o.onSave();API.toast('Gespeichert ✔')}
  else if(a==='new')API.confirm({title:'Neues Spiel starten?',text:'Dein aktueller Spielstand wird gelöscht. Das kann nicht rückgängig gemacht werden.',ok:'Neues Spiel',danger:true}).then(y=>y&&wipe());
  else if(a==='mp'||a==='settings'||a==='controls'||a==='about')go(a);
  else if(a==='tab'){D.tab=b.dataset.v;render(false)}
  else if(a==='tgl'){const d=D.defs.find(x=>x.id===b.dataset.opt);API.set(d.id,!D.cfg[d.id]);b.setAttribute('aria-checked',!!D.cfg[d.id])}
  else if(a==='sel'){const d=D.defs.find(x=>x.id===b.dataset.opt),op=d.options.find(x=>String(x[0])===b.dataset.v);API.set(d.id,op[0]);render(false)}
  else if(a==='cfgreset')API.confirm({title:'Einstellungen zurücksetzen?',text:'Alle Optionen gehen auf die Standardwerte.',ok:'Zurücksetzen'}).then(y=>{if(y){D.defs.forEach(d=>{D.cfg[d.id]=d.def;applyOne(d)});saveCfg();render(false);API.toast('Einstellungen zurückgesetzt')}});
  else if(a==='exp'){const r=D.root.querySelector('#dltExp');copyText(r.value,'Spielstand kopiert')}
  else if(a==='imp')importSave();
  else if(a==='wipe')API.confirm({title:'Spielstand löschen?',text:'Alles wird zurückgesetzt – Geld, Fortschritt, Upgrades. Das kann nicht rückgängig gemacht werden.',ok:'Endgültig löschen',danger:true}).then(y=>y&&wipe());
  // Multiplayer
  else if(a==='seg'){const k=b.dataset.k,v=b.dataset.v;if(k==='mpMode')D.mpMode=v;if(k==='mpMax')D.mpMax=+v;if(k==='mpPriv')D.mpPriv=v;b.parentNode.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b))}
  else if(a==='create')createLobby();
  else if(a==='join')joinLobby();
  else if(a==='refresh')refreshList();
  else if(a==='lobbyopen')go('lobby');
  else if(a==='copycode')copyText(D.lobby.code,'Lobby-Code kopiert');
  else if(a==='copylink')copyText(location.origin+location.pathname+'?lobby='+D.lobby.code,'Einladungslink kopiert');
  else if(a==='bot')addBot();
  else if(a==='kick'){const i=+b.dataset.v,p=D.lobby.players[i];D.lobby.players.splice(i,1);sys(p.name+' wurde entfernt.');lobbyRefresh()}
  else if(a==='ready'){const me=D.lobby.players[0];me.ready=!me.ready;sys(me.name+(me.ready?' ist bereit.':' ist nicht mehr bereit.'));lobbyRefresh()}
  else if(a==='send')sendChat();
  else if(a==='leave')leaveLobby();
  else if(a==='lstart')API.confirm({title:'Online-Modus noch nicht verfügbar',text:'Diese Lobby ist eine UI-Vorschau ohne Server. Du kannst stattdessen eine Solo-Partie starten.',ok:'Solo spielen',cancel:'Zurück'}).then(y=>{if(y){leaveLobby(true);API.close();D.opts.onPlay&&D.opts.onPlay(D.mode)}});
}
function onKey(e){
  if(!API.isOpen())return;
  if(document.querySelector('.dlt-modal'))return;
  const inField=/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)&&e.target.type!=='range';
  if(e.code==='Escape'){
    if(D.screen!=='main'){e.preventDefault();back()}
    e.stopPropagation();return;
  }
  if(e.code==='Enter'&&e.target.id==='dltMsg'){e.preventDefault();sendChat()}
  else if(e.code==='Enter'&&e.target.id==='dltJoin'){e.preventDefault();joinLobby()}
  if((e.code==='ArrowDown'||e.code==='ArrowUp')&&!inField&&e.target.type!=='range'){
    const l=[...D.card.querySelectorAll('.dlt-btn:not(:disabled)')];
    if(l.length){e.preventDefault();const i=l.indexOf(document.activeElement);l[(i+(e.code==='ArrowDown'?1:-1)+l.length)%l.length].focus()}
  }
  e.stopPropagation();
}
function wipe(){
  API.noSave=true;if(D.opts.storageKey)lsDel(D.opts.storageKey);
  if(D.opts.onReset)D.opts.onReset();else location.reload();
}
function importSave(){
  const t=D.root.querySelector('#dltImp').value.trim();if(!t){API.toast('Bitte zuerst einen Spielstand einfügen','warn');return}
  let obj;try{obj=JSON.parse(t)}catch(e){API.toast('Ungültiger Spielstand (kein JSON)','bad');return}
  const ok=D.opts.validateSave?D.opts.validateSave(obj):(obj&&typeof obj==='object'&&obj.cash!==undefined);
  if(!ok){API.toast('Das ist kein Spielstand dieses Spiels','bad');return}
  API.confirm({title:'Spielstand importieren?',text:'Der aktuelle Spielstand wird überschrieben und das Spiel neu geladen.',ok:'Importieren',danger:true}).then(y=>{if(!y)return;API.noSave=true;lsSet(D.opts.storageKey,JSON.stringify(obj));location.reload()});
}

// ---------- Multiplayer (lokale UI-Simulation) ----------
const COLORS=['#3ddc84','#4da3ff','#ffc83d','#ff4d5e','#a06bff'];
const BOTS=['Rico','Mama_Hustle','Don_Kartoffel','NightOwl','El_Chefe','Tante_Erna'];
const BOTCHAT=['Moin! Ich bin bereit.','Wer braucht noch Samen?','Ich nehm den Laptop.','Kurze Pause, Kaffee holen.','Los geht\'s!'];
function code(){const c='ABCDEFGHJKMNPQRSTUVWXYZ23456789';let s='';for(let i=0;i<4;i++)s+=c[Math.floor(Math.random()*c.length)];return 'DLT-'+s}
function sys(t){if(!D.lobby)return;D.lobby.chat.push({sys:1,t});chatAppend()}
function chatAppend(){const c=D.root.querySelector('#dltChat');if(!c)return;const L=D.lobby;c.innerHTML=L.chat.slice(-60).map(chatLine).join('');c.scrollTop=c.scrollHeight}
function lobbyRefresh(){if(D.screen==='lobby')render(false);chips()}
function later(fn,ms){const t=setTimeout(()=>{D.timers=D.timers.filter(x=>x!==t);fn()},ms);D.timers.push(t)}
function createLobby(){
  const n=playerName();
  D.lobby={code:code(),mode:D.mpMode||'coop',max:D.mpMax||4,priv:D.mpPriv||'0',players:[{name:n,host:true,ready:false,color:COLORS[0]}],chat:[]};
  sys('Lobby '+D.lobby.code+' erstellt. Gib den Code an deine Mitspieler weiter.');
  go('lobby');API.toast('Lobby erstellt – '+D.lobby.code);
}
function joinLobby(){
  const inp=D.root.querySelector('#dltJoin'),msg=D.root.querySelector('#dltJoinMsg'),b=D.root.querySelector('#dltJoinBtn');
  const c=(inp.value||'').trim().toUpperCase();
  if(!/^DLT-?[A-Z0-9]{4}$/.test(c)){msg.textContent='Ungültiger Code – Format: DLT-XXXX';inp.focus();return}
  if(D.lobby){msg.textContent='Du bist bereits in einer Lobby – verlasse sie zuerst.';return}
  msg.textContent='';b.disabled=true;b.innerHTML='<span class="dlt-spin"></span> Verbinde …';
  later(()=>{if(D.screen!=='mp')return;b.disabled=false;b.textContent='Beitreten';msg.textContent='Keine Verbindung zum Lobby-Server (Online-Modus noch nicht verfügbar).';API.toast('Beitritt fehlgeschlagen','bad')},1300);
}
function refreshList(){
  D.listState='busy';render(false);
  later(()=>{D.listState='done';if(D.screen==='mp')render(false)},1100);
}
function addBot(){
  const L=D.lobby;if(!L||L.players.length>=L.max)return;
  const used=L.players.map(p=>p.name),free=BOTS.filter(b=>!used.includes(b)),name=pick(free.length?free:BOTS)+(free.length?'':L.players.length);
  const p={name,bot:true,ready:false,color:COLORS[L.players.length%COLORS.length]};
  L.players.push(p);sys(name+' ist der Lobby beigetreten.');lobbyRefresh();
  later(()=>{if(D.lobby&&D.lobby.players.includes(p)){L.chat.push({n:p.name,t:pick(BOTCHAT),bot:1});chatAppend()}},rnd(700,1400));
  later(()=>{if(D.lobby&&D.lobby.players.includes(p)){p.ready=true;sys(p.name+' ist bereit.');lobbyRefresh()}},rnd(1600,3000));
}
function sendChat(){
  const i=D.root.querySelector('#dltMsg');if(!i||!D.lobby)return;const t=i.value.trim();if(!t)return;
  D.lobby.chat.push({n:D.lobby.players[0].name,t,me:1});i.value='';chatAppend();i.focus();
}
function leaveLobby(silent){
  const L=D.lobby;if(!L)return;
  const doit=()=>{D.timers.forEach(clearTimeout);D.timers=[];D.lobby=null;D.stack=D.stack.filter(s=>s!=='lobby'&&s!=='mp');D.screen='mp';render(true);if(!silent)API.toast('Lobby verlassen')};
  if(silent)return doit();
  if(L.players.length>1)API.confirm({title:'Lobby verlassen?',text:'Die anderen Spieler bleiben ohne dich zurück.',ok:'Verlassen',danger:true}).then(y=>y&&doit());
  else doit();
}
})();
