import * as THREE from 'three';

// 3D SCENE
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050507, 0.007);
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0, 1, 9);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
container.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0x111118));
const gl = new THREE.PointLight(0xd4af37, 2, 30); gl.position.set(4, 5, 5); scene.add(gl);
const bl = new THREE.PointLight(0xffcc44, 0.8, 20); bl.position.set(-3, 2, -3); scene.add(bl);
const fl = new THREE.DirectionalLight(0xffffff, 0.5); fl.position.set(1, 2, 2); scene.add(fl);

const grp = new THREE.Group();
const mat1 = new THREE.MeshStandardMaterial({ color: 0xd4af37, emissive: 0xd4af37, emissiveIntensity: 0.3, transparent: true, opacity: 0.2 });
const mat2 = new THREE.MeshStandardMaterial({ color: 0xd4af37, wireframe: true, emissive: 0xd4af37, emissiveIntensity: 0.45 });
const mat3 = new THREE.MeshStandardMaterial({ color: 0xf0d060, wireframe: true, emissive: 0xf0d060, emissiveIntensity: 0.25 });
grp.add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.9, 2), mat1));
grp.add(new THREE.Mesh(new THREE.IcosahedronGeometry(1.1, 1), mat2));
grp.add(new THREE.Mesh(new THREE.IcosahedronGeometry(1.28, 0), mat3));
scene.add(grp);

const rm = new THREE.MeshStandardMaterial({ color: 0xd4af37, emissive: 0xd4af37, emissiveIntensity: 0.5 });
const rm2 = new THREE.MeshStandardMaterial({ color: 0xf0d060, emissive: 0xf0d060, emissiveIntensity: 0.3 });
const r1 = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.04, 64, 300), rm); scene.add(r1);
const r2 = new THREE.Mesh(new THREE.TorusGeometry(1.88, 0.025, 64, 300), rm2); scene.add(r2);
const r3 = new THREE.Mesh(new THREE.TorusGeometry(2.15, 0.015, 64, 200), rm2); scene.add(r3);

const orb = new THREE.Mesh(new THREE.SphereGeometry(0.45, 48, 48), new THREE.MeshStandardMaterial({ color: 0xd4af37, emissive: 0xd4af37, emissiveIntensity: 0.7, transparent: true, opacity: 0.25 }));
orb.position.set(4, 0.5, 1); scene.add(orb);

const isMobile = innerWidth < 768;
const N = isMobile ? 500 : 1600;
const pg = new THREE.BufferGeometry();
const pp = new Float32Array(N * 3);
for (let i = 0; i < N; i++) { const r = 6.5 * Math.cbrt(Math.random()), t = Math.random() * Math.PI * 2, p = Math.acos(2 * Math.random() - 1); pp[i * 3] = r * Math.sin(p) * Math.cos(t); pp[i * 3 + 1] = r * Math.sin(p) * Math.sin(t); pp[i * 3 + 2] = r * Math.cos(p); }
pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
// On mobile, reduce particle opacity so they don't overpower text
const particleOpacity = isMobile ? 0.4 : 0.75;
const ps = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xd4af37, size: isMobile ? 0.04 : 0.06, transparent: true, opacity: particleOpacity }));
scene.add(ps);

const dg = new THREE.BufferGeometry();
const dp = [];
for (let i = 0; i < (isMobile ? 800 : 3000); i++)dp.push((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 22, (Math.random() - 0.5) * 30 - 12);
dg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(dp), 3));
const dust = new THREE.Points(dg, new THREE.PointsMaterial({ color: 0xffe090, size: 0.025, transparent: true, opacity: isMobile ? 0.2 : 0.4 }));
scene.add(dust);

const sg = new THREE.BufferGeometry();
const sp = [];
for (let i = 0; i < (isMobile ? 800 : 2500); i++)sp.push((Math.random() - 0.5) * 250, (Math.random() - 0.5) * 120, (Math.random() - 0.5) * 100 - 50);
sg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(sp), 3));
const stars = new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true, opacity: isMobile ? 0.3 : 0.6 }));
scene.add(stars);

let t = 0;
function animate() {
    t += 0.012;
    grp.rotation.y = t * 0.28; grp.rotation.x = Math.sin(t * 0.18) * 0.18;
    r1.rotation.z = t * 0.5; r1.rotation.x = t * 0.28;
    r2.rotation.z = -t * 0.38; r2.rotation.y = t * 0.2;
    r3.rotation.x = t * 0.15; r3.rotation.z = t * 0.22;
    orb.position.y = 0.5 + Math.sin(t * 1.1) * 0.3; orb.position.x = 4 + Math.cos(t * 0.6) * 0.5;
    ps.rotation.y = t * 0.035;
    dust.rotation.x = t * 0.018; dust.rotation.y = t * 0.012;
    stars.rotation.y = t * 0.008;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();
addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });

// PRELOADER
window.addEventListener('load', () => setTimeout(() => document.getElementById('preloader').classList.add('hidden'), 1800));

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

function toggleMenu(force) {
    menuOpen = force !== undefined ? force : !menuOpen;
    hamburger.classList.toggle('open', menuOpen);
    mobileMenu.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
}

hamburger.addEventListener('click', () => toggleMenu());

// Close menu when clicking a link
document.querySelectorAll('.mobile-menu-links a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const pg = link.getAttribute('href').substring(1);
        history.pushState(null, '', '#' + pg);
        showPage(pg);
        toggleMenu(false);
        // update active states
        document.querySelectorAll('.mobile-menu-links a').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// ===== ROUTING =====
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-links a, footer a[data-page]');
window.showPage = function (id) {
    pages.forEach(p => p.classList.remove('active-page'));
    const pg = document.getElementById(id);
    if (pg) pg.classList.add('active-page');
    document.querySelectorAll('.nav-links a').forEach(l => {
        const h = l.getAttribute('href').substring(1);
        l.classList.toggle('active', h === id);
    });
    document.querySelectorAll('.mobile-menu-links a').forEach(l => {
        const h = l.getAttribute('href').substring(1);
        l.classList.toggle('active', h === id);
    });
    if (id === 'chat') initFullChat();
    if (id === 'settings') initSettings();
    if (id === 'api') initApi();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};
navLinks.forEach(l => {
    l.addEventListener('click', e => { e.preventDefault(); const pg = l.getAttribute('href').substring(1); history.pushState(null, '', '#' + pg); showPage(pg); });
});
document.querySelectorAll('.intro-card').forEach(c => {
    c.addEventListener('click', () => { const t = c.getAttribute('data-href'); if (t) { history.pushState(null, '', '' + t); showPage(t.substring(1)); } });
});
document.getElementById('startChatBtnNav')?.addEventListener('click', () => { history.pushState(null, '', '#chat'); showPage('chat'); });
document.getElementById('affiliateBtn')?.addEventListener('click', () => alert('Join the affiliate program: email affiliate@armanxai.com'));
window.addEventListener('hashchange', () => { const h = location.hash.substring(1) || 'home'; showPage(h); });
const initHash = location.hash.substring(1) || 'home';
showPage(initHash);

// ===== FULL CHAT =====
let msgs = [{ role: 'ai', content: "✨ Hello! I'm Arxon AI. Select a model above and let's build something extraordinary together." }];
let curModel = 'Arxon Main', typing = false;
const models = ['Arxon Main', 'Arxon Agentic', 'Arxon Reasoning', 'Arxon Fast'];
const modelMap = {
    'Arxon Main': 'armanxai/main',
    'Arxon Agentic': 'armanxai/agentic',
    'Arxon Reasoning': 'armanxai/reasoning',
    'Arxon Fast': 'armanxai/fast'
};
function esc(s) { return s.replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m])) }
function renderChat() {
    const md = document.getElementById('fullChatMessages');
    const mb = document.getElementById('fullChatModelBar');
    if (!md) return;
    mb.innerHTML = models.map(m => `<div class="model-badge ${m === curModel ? 'active' : ''}" data-model="${m}">${m}</div>`).join('');
    md.innerHTML = msgs.map(m => `<div class="chat-message ${m.role}"><div class="msg-avatar">${m.role === 'ai' ? '✦' : 'U'}</div><div class="msg-bubble-full">${esc(m.content)}</div></div>`).join('') + (typing ? `<div class="chat-message ai"><div class="msg-avatar">✦</div><div class="typing-indicator"><div class="typing-dots"><span></span><span></span><span></span></div> Arxon composing…</div></div>` : '');
    md.scrollTop = md.scrollHeight;
    document.querySelectorAll('#fullChatModelBar .model-badge').forEach(el => el.addEventListener('click', e => { curModel = e.target.dataset.model; renderChat(); }));
}
function sendMsg() {
    const inp = document.getElementById('fullChatInput');
    const txt = inp?.value.trim();
    if (!txt || typing) return;
    msgs.push({ role: 'user', content: txt }); inp.value = ''; renderChat();
    typing = true; renderChat();
    const apiKey = localStorage.getItem('arxon-api-key');
    if (apiKey) {
        // Real API call
        fetch('https://arxon.armanxai.com/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: modelMap[curModel],
                messages: msgs.slice(-10), // last 10 messages for context
                stream: true
            })
        }).then(res => {
            if (!res.ok) throw new Error(`API Error: ${res.status}`);
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let aiMsg = '';
            function readChunk() {
                reader.read().then(({ done, value }) => {
                    if (done) {
                        typing = false;
                        msgs.push({ role: 'ai', content: aiMsg });
                        renderChat();
                        return;
                    }
                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n');
                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6);
                            if (data === '[DONE]') continue;
                            try {
                                const json = JSON.parse(data);
                                const content = json.choices[0]?.delta?.content;
                                if (content) {
                                    aiMsg += content;
                                    msgs[msgs.length - 1] = { role: 'ai', content: aiMsg };
                                    renderChat();
                                }
                            } catch (e) {}
                        }
                    }
                    readChunk();
                }).catch(err => {
                    typing = false;
                    msgs.push({ role: 'ai', content: `Error: ${err.message}` });
                    renderChat();
                });
            }
            readChunk();
        }).catch(err => {
            typing = false;
            msgs.push({ role: 'ai', content: `Error: ${err.message}` });
            renderChat();
        });
    } else {
        // Demo mode
        setTimeout(() => { typing = false; msgs.push({ role: 'ai', content: `[${curModel}] I received: "${txt}" — Arxon is online and ready to go deeper. Ask me anything.` }); renderChat(); }, 1400);
    }
}
function initFullChat() {
    renderChat();
    document.getElementById('fullChatSendBtn').onclick = sendMsg;
    document.getElementById('fullChatInput').onkeydown = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); } };
    document.getElementById('clearChatBtn').onclick = () => { msgs = [{ role: 'ai', content: "✨ Conversation cleared. How can I help you next?" }]; renderChat(); };
    document.getElementById('shareChatBtn').onclick = () => alert('📋 Share:\n' + msgs.slice(-3).map(m => `${m.role}: ${m.content.slice(0, 80)}`).join('\n'));
}

// ===== SETTINGS =====
function initSettings() {
    const qf = document.getElementById('quotaFill');
    if (qf) setTimeout(() => qf.style.width = '48%', 100);
    document.querySelectorAll('.settings-nav button').forEach(b => {
        b.onclick = () => {
            document.querySelectorAll('.settings-nav button').forEach(x => x.classList.remove('active-sett'));
            b.classList.add('active-sett');
            ['appearance-settings', 'quota-settings', 'api-settings', 'notifications', 'danger-settings'].forEach(id => document.getElementById(id).style.display = 'none');
            const map = { appearance: 'appearance-settings', quota: 'quota-settings', api: 'api-settings', notifications: 'notifications', danger: 'danger-settings' };
            document.getElementById(map[b.dataset.settings]).style.display = 'block';
        };
    });
    document.getElementById('darkLightToggleSettings')?.addEventListener('click', toggleTheme);
    document.getElementById('saveNotifBtn')?.addEventListener('click', () => alert('Preferences saved!'));
    document.getElementById('deleteAccountBtn')?.addEventListener('click', () => { if (confirm('Permanently delete your account?')) alert('Deletion requested (demo mode).'); });
    // API Key handling
    const apiKeyInput = document.getElementById('apiKeyInput');
    const apiKeyStatus = document.getElementById('apiKeyStatus');
    const savedKey = localStorage.getItem('arxon-api-key');
    if (savedKey) {
        apiKeyInput.value = savedKey;
        apiKeyStatus.textContent = 'API Key set. Chat will use real API.';
    }
    document.getElementById('saveApiKeyBtn')?.addEventListener('click', () => {
        const key = apiKeyInput.value.trim();
        if (key) {
            localStorage.setItem('arxon-api-key', key);
            apiKeyStatus.textContent = 'API Key saved. Chat will use real API.';
        } else {
            localStorage.removeItem('arxon-api-key');
            apiKeyStatus.textContent = 'API Key not set. Chat will use demo mode.';
        }
    });
}
function toggleTheme() { document.body.classList.toggle('light'); localStorage.setItem('arxon-theme', document.body.classList.contains('light') ? 'light' : 'dark'); }
if (localStorage.getItem('arxon-theme') === 'light') document.body.classList.add('light');
document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
document.getElementById('themeToggleMobile')?.addEventListener('click', toggleTheme);

// ===== API PAGE =====
function initApi() {
    const snips = {
        python: `import openai\n\nopenai.api_base = "https://arxon.armanxai.com/api/v1"\nopenai.api_key  = "sk-your-key-here"\n\nresponse = openai.ChatCompletion.create(\n    model="armanxai/main",\n    messages=[{"role": "user", "content": "Hello, Arxon!"}],\n    stream=True\n)\n\nfor chunk in response:\n    print(chunk.choices[0].delta.get("content", ""), end="")`,
        js: `const res = await fetch("https://arxon.armanxai.com/api/v1/chat/completions", {\n  method: "POST",\n  headers: {\n    "Authorization": "Bearer sk-your-key-here",\n    "Content-Type": "application/json"\n  },\n  body: JSON.stringify({\n    model: "armanxai/main",\n    messages: [{ role: "user", content: "Hello, Arxon!" }],\n    stream: true\n  })\n});\n\nconst reader = res.body.getReader();\n// read chunks...`,
        curl: `curl -X POST https://arxon.armanxai.com/api/v1/chat/completions \\\n  -H "Authorization: Bearer sk-your-key-here" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "model": "armanxai/main",\n    "messages": [{"role": "user", "content": "Hello, Arxon!"}],\n    "stream": true\n  }'`
    };
    const cb = document.getElementById('codeBlock');
    document.querySelectorAll('.code-tab').forEach(tab => {
        tab.onclick = () => { document.querySelectorAll('.code-tab').forEach(t => t.classList.remove('active')); tab.classList.add('active'); cb.innerText = snips[tab.dataset.lang] || snips.python; };
    });
}

// ===== FLOATING WIDGET =====
let wState = 'loader', wLoggedIn = false, wMsgs = [], wModel = 'Arxon Main';
const wContainer = document.getElementById('chatWidget');
const wInner = document.getElementById('widgetInner');
function openWidget() { wContainer.classList.remove('hidden'); setTimeout(() => wContainer.classList.add('visible'), 10); renderWidget(); }
function closeWidget() { wContainer.classList.remove('visible'); setTimeout(() => wContainer.classList.add('hidden'), 350); }
document.getElementById('chatFabBtn')?.addEventListener('click', openWidget);
document.getElementById('closeWidgetBtn')?.addEventListener('click', closeWidget);

function renderWidget() {
    if (wState === 'loader') {
        wInner.innerHTML = `<div class="loader-state"><div class="pre-ring"></div><p>LAUNCHING ARXON</p></div>`;
        setTimeout(() => { wState = 'login'; renderWidget(); }, 1200);
    } else if (wState === 'login') {
        wInner.innerHTML = `<div class="login-state"><div style="font-size:3rem">✦</div><h3>Welcome back</h3><p>Sign in to start chatting with Arxon AI</p><input type="email" id="wEmail" placeholder="your@email.com"><button id="wLoginBtn" class="btn btn-primary" style="width:280px;justify-content:center">Unlock Arxon →</button><p style="font-size:0.73rem;color:var(--text3)">Demo: any email works</p></div>`;
        document.getElementById('wLoginBtn')?.addEventListener('click', () => {
            const e = document.getElementById('wEmail')?.value.trim();
            if (e) { wLoggedIn = true; wState = 'chat'; wMsgs = [{ role: 'ai', content: "Hi! I'm Arxon. How can I help you today?" }]; renderWidget(); }
            else alert('Please enter an email.');
        });
    } else if (wState === 'chat') {
        const mHtml = wMsgs.map(m => `<div class="msg-bubble msg-${m.role}">${esc(m.content)}</div>`).join('');
        wInner.innerHTML = `
  <div class="widget-model-bar">${models.map(m => `<div class="model-chip ${wModel === m ? 'active' : ''}" data-model="${m}">${m}</div>`).join('')}</div>
  <div class="widget-body" id="wBody">${mHtml}</div>
  <div class="widget-input"><textarea id="wInput" rows="1" placeholder="Ask Arxon anything…"></textarea><button id="wSend" class="widget-send">↑</button></div>`;
        const wb = document.getElementById('wBody');
        if (wb) wb.scrollTop = wb.scrollHeight;
        document.querySelectorAll('.widget-model-bar .model-chip').forEach(c => c.onclick = e => { wModel = e.target.dataset.model; renderWidget(); });
        document.getElementById('wSend')?.addEventListener('click', sendWidget);
        document.getElementById('wInput')?.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendWidget(); } });
    }
}
function sendWidget() {
    const inp = document.getElementById('wInput');
    const txt = inp?.value.trim();
    if (!txt) return;
    wMsgs.push({ role: 'user', content: txt }); inp.value = ''; renderWidget();
    const apiKey = localStorage.getItem('arxon-api-key');
    if (apiKey) {
        // Real API call
        fetch('https://arxon.armanxai.com/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: modelMap[wModel],
                messages: wMsgs.slice(-10),
                stream: true
            })
        }).then(res => {
            if (!res.ok) throw new Error(`API Error: ${res.status}`);
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let aiMsg = '';
            function readChunk() {
                reader.read().then(({ done, value }) => {
                    if (done) {
                        wMsgs.push({ role: 'ai', content: aiMsg });
                        renderWidget();
                        return;
                    }
                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n');
                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6);
                            if (data === '[DONE]') continue;
                            try {
                                const json = JSON.parse(data);
                                const content = json.choices[0]?.delta?.content;
                                if (content) {
                                    aiMsg += content;
                                    wMsgs[wMsgs.length - 1] = { role: 'ai', content: aiMsg };
                                    renderWidget();
                                }
                            } catch (e) {}
                        }
                    }
                    readChunk();
                }).catch(err => {
                    wMsgs.push({ role: 'ai', content: `Error: ${err.message}` });
                    renderWidget();
                });
            }
            readChunk();
        }).catch(err => {
            wMsgs.push({ role: 'ai', content: `Error: ${err.message}` });
            renderWidget();
        });
    } else {
        // Demo mode
        setTimeout(() => { wMsgs.push({ role: 'ai', content: `${wModel}: I got your message — "${txt}". Need more depth?` }); renderWidget(); }, 1000);
    }
}

// ===== GLOBAL MODAL =====
const gModal = document.getElementById('globalLoginModal');
document.getElementById('closeGlobalModal')?.addEventListener('click', () => gModal.classList.remove('active'));
document.getElementById('globalLoginBtn')?.addEventListener('click', () => {
    const e = document.getElementById('globalEmail')?.value.trim();
    if (e) { gModal.classList.remove('active'); alert(`✦ Welcome! You now have access, ${e}.`); }
    else alert('Please enter your email.');
});
gModal.addEventListener('click', e => { if (e.target === gModal) gModal.classList.remove('active'); });
setTimeout(() => gModal.classList.add('active'), 2800);