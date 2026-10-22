'use strict';
// Co-op-Server für drug-lord-3d.html – ohne Abhängigkeiten (nur Node >= 18).
//  - liefert die HTML-Dateien aus (optional, nginx kann das auch tun)
//  - WebSocket-Endpunkt /ws?room=<name>: teilt Hof-Zustand, Spielerpositionen, Chat
//  - speichert den Zustand pro Raum in DATA_DIR/room-<name>.json
const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const PORT = +process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const MAX_PLAYERS = +process.env.MAX_PLAYERS || 8;
const MAX_PAYLOAD = 256 * 1024;
const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
const COLORS = ['#e84a3a', '#3a8ee8', '#3ac85a', '#e8c23a', '#b45be8', '#3ae8d4', '#e8823a', '#e83aa8'];

// ---------------- Zustand: erlaubte Felder & Operationen ----------------
const TOP = new Set(['cash', 'xp', 'level', 'day', 'raw', 'trim', 'pack', 'lights', 'potsOwned', 'workers', 'flags', 'price', 'priceT',
  'lab', 'reag', 'drugs', 'recipes', 'up', 'dm', 'batches', 'coins', 'cp', 'cpT', 'evT', 'news', 'rig', 'scams', 'pots']);
const BAD = new Set(['__proto__', 'constructor', 'prototype']);
const NPOTS = 12;

function okVal(v, d = 0) {
  if (v === null || typeof v === 'boolean') return true;
  if (typeof v === 'number') return Number.isFinite(v) && Math.abs(v) < 1e12;
  if (typeof v === 'string') return v.length <= 300;
  if (typeof v === 'object' && !Array.isArray(v) && d < 3) {
    const ks = Object.keys(v);
    return ks.length <= 40 && ks.every(k => k.length <= 32 && !BAD.has(k) && okVal(v[k], d + 1));
  }
  return false;
}
function okPath(p) {
  if (!Array.isArray(p) || p.length < 1 || p.length > 4) return false;
  if (!p.every(k => typeof k === 'string' && k.length > 0 && k.length <= 32 && !BAD.has(k))) return false;
  if (!TOP.has(p[0])) return false;
  if (p[0] === 'pots') return p.length === 3 && /^\d{1,2}$/.test(p[1]) && +p[1] < NPOTS && ['o', 's', 'w'].includes(p[2]);
  return true;
}
function okOp(op) {
  if (!Array.isArray(op) || op.length !== 3 || (op[0] !== 'a' && op[0] !== 's') || !okPath(op[1])) return false;
  if (op[0] === 'a') return typeof op[2] === 'number' && Number.isFinite(op[2]) && Math.abs(op[2]) < 1e12 && op[1][0] !== 'pots';
  if (op[1][0] === 'pots') return typeof op[2] === 'number' && Number.isFinite(op[2]);
  return okVal(op[2]);
}
function applyOp(state, [kind, p, v]) {
  if (p[0] === 'pots') { const q = state.pots[+p[1]]; if (q) q[p[2]] = v; return; }
  let o = state;
  for (let i = 0; i < p.length - 1; i++) {
    if (!o[p[i]] || typeof o[p[i]] !== 'object') o[p[i]] = {};
    o = o[p[i]];
  }
  const k = p[p.length - 1];
  if (kind === 'a') o[k] = (typeof o[k] === 'number' ? o[k] : 0) + v; else o[k] = v;
}
function sanitizeState(st) {
  if (!st || typeof st !== 'object') return null;
  const out = {};
  for (const k of TOP) {
    if (k === 'pots' || !(k in st)) continue;
    if (okVal(st[k])) out[k] = st[k];
  }
  const src = Array.isArray(st.pots) ? st.pots : [];
  out.pots = Array.from({ length: NPOTS }, (_, i) => {
    const q = src[i] || {};
    const num = (x, d) => (typeof x === 'number' && Number.isFinite(x) ? x : d);
    return { o: num(q.o, 0) ? 1 : 0, s: Math.max(-1, Math.min(4, num(q.s, -1) | 0)), w: num(q.w, 0) ? 1 : 0 };
  });
  return out;
}

// ---------------- Räume ----------------
const rooms = new Map();
function roomFile(name) { return path.join(DATA_DIR, 'room-' + name + '.json'); }
function getRoom(name) {
  let r = rooms.get(name);
  if (r) return r;
  r = { name, state: null, clients: [], dirty: false };
  try { r.state = sanitizeState(JSON.parse(fs.readFileSync(roomFile(name), 'utf8'))); } catch (e) { /* neuer Raum */ }
  rooms.set(name, r);
  return r;
}
function saveRoom(r) {
  if (!r.dirty || !r.state) return;
  r.dirty = false;
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(roomFile(r.name) + '.tmp', JSON.stringify(r.state));
    fs.renameSync(roomFile(r.name) + '.tmp', roomFile(r.name));
  } catch (e) { console.error('save failed', e.message); }
}
setInterval(() => rooms.forEach(saveRoom), 10000).unref();
function shutdown() { rooms.forEach(saveRoom); process.exit(0); }
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

const cleanName = s => String(s || '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 16) || 'Spieler';
function roster(r) {
  return { t: 'roster', host: r.clients[0] ? r.clients[0].id : 0, players: r.clients.map(c => ({ id: c.id, name: c.name, color: c.color, x: c.x, z: c.z, yaw: c.yaw })) };
}
function broadcast(r, msg, except) {
  const s = JSON.stringify(msg);
  for (const c of r.clients) if (c !== except) c.send(s);
}

let nextId = 1;
function onMessage(c, raw) {
  let m;
  try { m = JSON.parse(raw); } catch (e) { return; }
  if (!m || typeof m !== 'object') return;
  const r = c.room;
  if (m.t === 'join') {
    if (r) return;
    const room = getRoom(c.roomName);
    if (room.clients.length >= MAX_PLAYERS) { c.send(JSON.stringify({ t: 'full' })); return c.close(); }
    c.room = room;
    c.name = cleanName(m.name);
    c.color = COLORS.find(col => !room.clients.some(o => o.color === col)) || COLORS[c.id % COLORS.length];
    room.clients.push(c);
    c.send(JSON.stringify(Object.assign(roster(room), { t: 'init', id: c.id, room: room.name, state: room.state })));
    broadcast(room, roster(room), c);
    return;
  }
  if (!r) return;
  switch (m.t) {
    case 'seed':
      if (r.state) { c.send(JSON.stringify(Object.assign(roster(r), { t: 'init', id: c.id, room: r.name, state: r.state }))); return; }
      r.state = sanitizeState(m.state); r.dirty = true;
      break;
    case 'ops': {
      if (!r.state || !Array.isArray(m.ops) || m.ops.length > 400) return;
      const ops = m.ops.filter(okOp);
      if (!ops.length) return;
      ops.forEach(op => applyOp(r.state, op));
      r.dirty = true;
      broadcast(r, { t: 'ops', ops }, c);
      // "set"-Operationen gehen an den Absender zurück, damit bei gleichzeitigen Schreibzugriffen alle den Server-Stand haben
      const sets = ops.filter(op => op[0] === 's');
      if (sets.length) c.send(JSON.stringify({ t: 'ops', ops: sets }));
      break;
    }
    case 'pos': {
      const n = k => (typeof m[k] === 'number' && Number.isFinite(m[k]) ? Math.round(m[k] * 100) / 100 : 0);
      c.x = n('x'); c.z = n('z'); c.yaw = n('yaw');
      broadcast(r, { t: 'pos', id: c.id, x: c.x, z: c.z, yaw: c.yaw }, c);
      break;
    }
    case 'tick':
      if (r.clients[0] !== c) return;
      broadcast(r, { t: 'tick', dayT: +m.dayT || 0, pt: Array.isArray(m.pt) ? m.pt.slice(0, NPOTS).map(x => +x || 0) : [],
        w: Array.isArray(m.w) ? m.w.slice(0, 8).map(a => Array.isArray(a) ? a.slice(0, 4).map(x => +x || 0) : [0, 0, 0, 0]) : [] }, c);
      break;
    case 'chat': {
      const text = String(m.text || '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, 160);
      if (text) broadcast(r, { t: 'chat', id: c.id, name: c.name, color: c.color, text });
      break;
    }
    case 'name':
      c.name = cleanName(m.name);
      broadcast(r, roster(r));
      break;
  }
}
function onClose(c) {
  const r = c.room;
  if (!r) return;
  r.clients = r.clients.filter(o => o !== c);
  c.room = null;
  if (r.clients.length) broadcast(r, roster(r));
  else saveRoom(r);
}

// ---------------- Minimaler WebSocket-Server (RFC 6455) ----------------
const conns = new Set();
class Conn {
  constructor(socket, roomName) {
    this.socket = socket; this.roomName = roomName; this.id = nextId++;
    this.buf = Buffer.alloc(0); this.frags = []; this.fragLen = 0; this.alive = true; this.msgs = 0;
    conns.add(this);
    socket.on('data', d => this.onData(d));
    socket.on('close', () => this.dead());
    socket.on('error', () => this.dead());
  }
  dead() { if (this.gone) return; this.gone = true; clearInterval(this.pinger); conns.delete(this); onClose(this); }
  frame(op, payload) {
    const len = payload.length;
    const head = len < 126 ? Buffer.from([0x80 | op, len]) : len < 65536
      ? Buffer.from([0x80 | op, 126, len >> 8, len & 255])
      : (() => { const h = Buffer.alloc(10); h[0] = 0x80 | op; h[1] = 127; h.writeBigUInt64BE(BigInt(len), 2); return h; })();
    return Buffer.concat([head, payload]);
  }
  send(str) { if (!this.gone && this.socket.writable) this.socket.write(this.frame(1, Buffer.from(str))); }
  close(code = 1000) {
    if (this.gone) return;
    try { this.socket.end(this.frame(8, Buffer.from([code >> 8, code & 255]))); } catch (e) { /* weg */ }
    setTimeout(() => this.socket.destroy(), 500).unref();
  }
  onData(chunk) {
    this.buf = Buffer.concat([this.buf, chunk]);
    for (;;) {
      const b = this.buf;
      if (b.length < 2) return;
      const fin = b[0] & 0x80, op = b[0] & 0x0f, masked = b[1] & 0x80;
      let len = b[1] & 0x7f, off = 2;
      if (len === 126) { if (b.length < 4) return; len = b.readUInt16BE(2); off = 4; }
      else if (len === 127) { if (b.length < 10) return; const big = b.readBigUInt64BE(2); if (big > BigInt(MAX_PAYLOAD)) return this.close(1009); len = Number(big); off = 10; }
      if (len > MAX_PAYLOAD) return this.close(1009);
      if (!masked) return this.close(1002);
      if (b.length < off + 4 + len) return;
      const mask = b.subarray(off, off + 4), payload = Buffer.from(b.subarray(off + 4, off + 4 + len));
      for (let i = 0; i < len; i++) payload[i] ^= mask[i & 3];
      this.buf = b.subarray(off + 4 + len);
      this.onFrame(fin, op, payload);
      if (this.gone) return;
    }
  }
  onFrame(fin, op, payload) {
    if (op === 8) return this.close(1000);
    if (op === 9) { this.socket.write(this.frame(10, payload)); return; }
    if (op === 10) { this.alive = true; return; }
    if (op === 1 || op === 0) {
      this.fragLen += payload.length;
      if (this.fragLen > MAX_PAYLOAD) return this.close(1009);
      this.frags.push(payload);
      if (fin) {
        const text = Buffer.concat(this.frags).toString('utf8');
        this.frags = []; this.fragLen = 0;
        if (++this.msgs > 120) return this.close(1008);   // grobes Rate-Limit pro Sekunde
        onMessage(this, text);
      }
    }
  }
}

// ---------------- HTTP: statische Dateien + Upgrade ----------------
const FILES = {
  '/': 'index.html', '/index.html': 'index.html', '/drug-lord-3d.html': 'drug-lord-3d.html'
};
const server = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  if (u.pathname === '/healthz') { res.end('ok'); return; }
  const f = FILES[u.pathname];
  if (!f) { res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }); res.end('Nicht gefunden'); return; }
  fs.readFile(path.join(__dirname, f), (err, data) => {
    if (err) { res.writeHead(500); res.end('Fehler'); return; }
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache' });
    res.end(data);
  });
});
server.on('upgrade', (req, socket) => {
  const u = new URL(req.url, 'http://x');
  const key = req.headers['sec-websocket-key'];
  if (!u.pathname.endsWith('/ws') || !key || req.headers.upgrade?.toLowerCase() !== 'websocket' || req.headers['sec-websocket-version'] !== '13') {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n'); return;
  }
  const roomName = (u.searchParams.get('room') || 'main').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 24) || 'main';
  const accept = crypto.createHash('sha1').update(key + GUID).digest('base64');
  socket.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ' + accept + '\r\n\r\n');
  socket.setNoDelay(true);
  const c = new Conn(socket, roomName);
  c.pinger = setInterval(() => {
    if (!c.alive) return c.socket.destroy();
    c.alive = false;
    try { socket.write(c.frame(9, Buffer.alloc(0))); } catch (e) { /* weg */ }
  }, 25000);
});
setInterval(() => conns.forEach(c => { c.msgs = 0; }), 1000).unref();

server.listen(PORT, HOST, () => console.log(`Drug Lord Tycoon Co-op läuft auf http://${HOST}:${PORT}  (WebSocket: /ws?room=main, Daten: ${DATA_DIR})`));
