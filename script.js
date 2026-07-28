/* ============ DATA ============ */
const SCHEDULE = [
    { time: "DAY 01 · 09:00", title: "SYSTEM INIT", desc: "Check-in, kit distribution, and opening keynote. Arena goes live.", room: "AUDITORIUM A", mentors: 12 },
    { time: "DAY 01 · 11:00", title: "BUILD PHASE — EXECUTE", desc: "48-hour clock starts. Teams deploy to their workstations and compile their first commits.", room: "INNOVATION LAB 1-3", mentors: 24 },
    { time: "DAY 01 · 20:00", title: "NIGHT PROTOCOL", desc: "Midnight checkpoints. Mentor office hours open. Caffeine grid online.", room: "LAB WING", mentors: 8 },
    { time: "DAY 02 · 09:00", title: "DEBUG SURGE", desc: "Mid-build review. Mentors rotate for architecture audits and refactors.", room: "INNOVATION LAB 1-3", mentors: 24 },
    { time: "DAY 02 · 15:00", title: "FINALIZE & PACKAGE", desc: "Feature freeze. Code cleanup, README compilation, demo rehearsal.", room: "ALL STATIONS", mentors: 16 },
    { time: "DAY 02 · 17:00", title: "DEMO EXECUTION", desc: "Live pitches before the panel. Judging on scalability, originality, and depth.", room: "MAIN AUDITORIUM", mentors: 6 },
    { time: "DAY 02 · 20:00", title: "AWARDS — TERMINATE", desc: "Winners announced. Closing ceremony. The grid goes offline until next year.", room: "MAIN AUDITORIUM", mentors: 0 },
];

const PRIZES = [
    { place: "01", title: "BEST OVERALL EXECUTION", amount: "₹2,50,000", icon: "🏆", feat: true, desc: "Awarded to the team whose system demonstrates the deepest engineering rigor, originality, and deployment-readiness." },
    { place: "02", title: "MOST SCALABLE", amount: "₹1,00,000", icon: "🚀", desc: "Architecture that holds under load and grows beyond the demo." },
    { place: "03", title: "BEST HARDWARE HACK", amount: "₹75,000", icon: "🔧", desc: "Where the physical and digital compile into one." },
    { place: "04", title: "PEOPLE'S CHOICE", amount: "₹50,000", icon: "🏆", desc: "Voted live by the arena. The build the grid believed in." },
    { place: "05", title: "BEST UI/UX PROTOCOL", amount: "₹40,000", icon: "🔧", desc: "Interfaces engineered with the same discipline as the stack beneath them." },
];

const SPONSORS = [
    { tier: "TITLE_PARTNER", size: "lg", list: [{ name: "VOLTCORP", tag: "INFRASTRUCTURE" }] },
    { tier: "SYSTEM_PARTNERS", size: "md", list: [{ name: "NEXUS_LABS", tag: "AI/ML" }, { name: "GRIDWORKS", tag: "CLOUD" }, { name: "CIRCUITA", tag: "HARDWARE" }] },
    { tier: "COMMUNITY_PARTNERS", size: "sm", list: [{ name: "DEVKIT", tag: "DEV TOOLS" }, { name: "OPENFORGE", tag: "OSS" }, { name: "BYTEBLOCK", tag: "WEB3" }, { name: "PIXELFORGE", tag: "DESIGN" }] },
];

const TRACKS = ["AI/ML", "WEB3", "HARDWARE", "SUSTAINABILITY", "OPEN INNOVATION"];

/* ============ HELPERS ============ */
const $ = (s) => document.querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

/* ============ THEME ============ */
const themeToggle = $("#themeToggle");
const saved = localStorage.getItem("ng-theme");
if (saved) document.body.setAttribute("data-theme", saved);
themeToggle.addEventListener("click", () => {
    const cur = document.body.getAttribute("data-theme");
    const next = cur === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", next);
    localStorage.setItem("ng-theme", next);
});

/* ============ NAVBAR SCROLL ============ */
const navbar = $("#navbar");
window.addEventListener("scroll", () => navbar.classList.toggle("scrolled", window.scrollY > 24));

/* ============ COUNTDOWN ============ */
const TARGET = new Date("2026-09-18T09:00:00+05:30").getTime();
function tick() {
    const diff = Math.max(0, TARGET - Date.now());
    const map = {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
    };
    Object.keys(map).forEach((u) => {
        const node = document.querySelector(`.cd-val[data-u="${u}"]`);
        if (node) node.textContent = String(map[u]).padStart(2, "0");
    });
}
tick(); setInterval(tick, 1000);

/* ============ BINARY CANVAS ============ */
const canvas = $("#binaryCanvas");
const ctx = canvas.getContext("2d");
let cols = [];
const FS = 14;
function sizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    const count = Math.floor(canvas.width / FS);
    cols = Array.from({ length: count }, () => ({ y: Math.random() * canvas.height, sp: 0.4 + Math.random() * 0.9 }));
}
sizeCanvas(); window.addEventListener("resize", sizeCanvas);
function drawBinary() {
    ctx.fillStyle = "rgba(5,5,5,0.08)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${FS}px "IBM Plex Mono", monospace`;
    cols.forEach((c, i) => {
        const bit = Math.random() > 0.5 ? "1" : "0";
        ctx.fillStyle = `rgba(204,255,0,${0.12 + Math.random() * 0.28})`;
        ctx.fillText(bit, i * FS, c.y);
        c.y += c.sp * FS;
        if (c.y > canvas.height + FS) c.y = -FS;
    });
    requestAnimationFrame(drawBinary);
}
drawBinary();

/* ============ MAGNETIC BUTTONS ============ */
document.querySelectorAll(".m-btn").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        if (Math.hypot(x, y) < 60 + r.width / 2) btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
        else btn.style.transform = "";
    });
    btn.addEventListener("mouseleave", () => (btn.style.transform = ""));
});

/* ============ RENDER SCHEDULE ============ */
const timeline = $("#timeline");
SCHEDULE.forEach((it) => {
    const item = el("div", "tl-item reveal");
    item.innerHTML = `
    <span class="tl-marker"></span>
    <div class="tl-card">
      <div class="tl-top"><span class="tl-time">${it.time}</span><span class="tl-room">⌖ ${it.room}</span></div>
      <h3>${it.title}</h3>
      <p>${it.desc}</p>
      ${it.mentors > 0 ? `<div class="tl-badge">◆ ${it.mentors} MENTORS ON GRID</div>` : ""}
    </div>`;
    timeline.appendChild(item);
});

/* ============ RENDER PRIZES + TILT ============ */
const prizeGrid = $("#prizeGrid");
PRIZES.forEach((p) => {
    const card = el("div", "prize-card reveal" + (p.feat ? " feat" : ""));
    card.innerHTML = `
    <div class="prize-num">${p.place}</div>
    <div class="prize-icon">${p.icon}</div>
    <div class="prize-tag">PRIZE_${p.place}</div>
    <h3>${p.title}</h3>
    <div class="prize-amount">${p.amount}</div>
    <p>${p.desc}</p>`;
    card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateX(${py * -8}deg) rotateY(${px * 8}deg)`;
    });
    card.addEventListener("mouseleave", () => (card.style.transform = ""));
    prizeGrid.appendChild(card);
});

/* ============ RENDER SPONSORS ============ */
const sponsorTiers = $("#sponsorTiers");
SPONSORS.forEach((g) => {
    const wrap = el("div", "sponsor-tier");
    const row = el("div", "sponsor-row");
    g.list.forEach((s) => {
        const card = el("div", "sponsor-card reveal" + (g.size === "lg" ? " lg" : ""));
        card.innerHTML = `<div class="sponsor-name">${s.name}</div><div class="sponsor-tag">${s.tag}</div>`;
        row.appendChild(card);
    });
    wrap.innerHTML = `<div class="tier-label">[${g.tier}]</div>`;
    wrap.appendChild(row);
    sponsorTiers.appendChild(wrap);
});

/* ============ REVEAL ON SCROLL ============ */
const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((n) => io.observe(n));

/* ============ REGISTRATION FORM ============ */
const formBody = $("#formBody");
const nextBtn = $("#nextBtn");
const backBtn = $("#backBtn");
const consoleBody = $("#consoleBody");
const progressBar = $("#progressBar");
const stepLabel = $("#stepLabel");
const statusLabel = $("#statusLabel");

let step = 0;
let submitted = false;
const data = { teamName: "", tagline: "", leadName: "", leadEmail: "", leadPhone: "", teamSize: 4, track: "" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9]{10}$/;

function validate() {
    const logs = [];
    let ok = true;
    if (step === 0) {
        const v = data.teamName.trim().length >= 3;
        logs.push({ t: `CHECKING TEAM_NAME... ${v ? "VALID" : "ERROR: MIN 3 CHARS"}`, err: !v });
        if (!v) ok = false;
    }
    if (step === 1) {
        const ev = !!EMAIL_RE.test(data.leadEmail);
        const lv = data.leadName.trim().length >= 2;
        const pv = PHONE_RE.test(data.leadPhone);
        logs.push({ t: `CHECKING LEAD_NAME... ${lv ? "VALID" : "ERROR: REQUIRED"}`, err: !lv });
        logs.push({ t: `CHECKING EMAIL... ${ev ? "VALID" : "ERROR: INVALID FORMAT"}`, err: !ev });
        logs.push({ t: `CHECKING PHONE... ${pv ? "VALID" : "ERROR: 10 DIGITS"}`, err: !pv });
        if (!ev || !lv || !pv) ok = false;
    }
    if (step === 2) {
        const s = data.teamSize >= 2 && data.teamSize <= 6;
        const t = data.track.length > 0;
        logs.push({ t: `CHECKING TEAM_SIZE... ${s ? "VALID" : "ERROR: MIN 2, MAX 6"}`, err: !s });
        logs.push({ t: `CHECKING TRACK... ${t ? "VALID" : "ERROR: SELECT ONE"}`, err: !t });
        if (!s || !t) ok = false;
    }
    return { logs, ok };
}

function renderConsole(logs, ok) {
    consoleBody.innerHTML = "";
    const cmd = el("div", "console-line muted", `$ run --step ${step + 1}`);
    consoleBody.appendChild(cmd);
    logs.forEach((l, i) => {
        const line = el("div", "console-line " + (l.err ? "err" : "ok"), l.t);
        line.style.opacity = 0; line.style.transform = "translateX(-6px)";
        consoleBody.appendChild(line);
        setTimeout(() => { line.style.transition = "all .3s"; line.style.opacity = 1; line.style.transform = ""; }, i * 80);
    });
    const prompt = el("div", "console-line muted", `${ok ? ">> READY" : ">> AWAITING_VALID_INPUT"}<span class="blink">_</span>`);
    consoleBody.appendChild(prompt);
}

function renderForm() {
    if (submitted) {
        formBody.innerHTML = `
      <div class="success">
        <div class="success-check">✓</div>
        <h3>ENTRY <span class="volt">COMPILED</span></h3>
        <p>Team <span class="volt">${data.teamName}</span> registered to the grid. Confirmation routed to ${data.leadEmail}.</p>
      </div>`;
        nextBtn.style.display = "none";
        backBtn.style.display = "none";
        return;
    }
    nextBtn.style.display = "";
    backBtn.style.display = "";
    nextBtn.textContent = step < 2 ? "NEXT →" : "COMPILE & SUBMIT →";
    nextBtn.classList.toggle("m-btn-outline", step < 2);
    nextBtn.classList.toggle("m-btn-primary", step === 2);
    backBtn.disabled = step === 0;

    if (step === 0) {
        formBody.innerHTML = `
      <div class="step-head"><span class="n">01</span><span class="t">TEAM IDENTITY</span><span class="ln"></span></div>
      <div class="field"><label>TEAM_NAME</label><input type="text" id="i_teamName" placeholder="e.g. BYTEFORGE" value="${data.teamName}"></div>
      <div class="field"><label>TEAM_TAGLINE (OPTIONAL)</label><input type="text" id="i_tagline" placeholder="one line. make it count." value="${data.tagline}"></div>`;
        $("#i_teamName").addEventListener("input", (e) => { data.teamName = e.target.value; update(); });
        $("#i_tagline").addEventListener("input", (e) => { data.tagline = e.target.value; update(); });
    } else if (step === 1) {
        formBody.innerHTML = `
      <div class="step-head"><span class="n">02</span><span class="t">TEAM LEAD</span><span class="ln"></span></div>
      <div class="field"><label>LEAD_NAME</label><input type="text" id="i_leadName" placeholder="Full name" value="${data.leadName}"></div>
      <div class="two-col">
        <div class="field"><label>EMAIL</label><input type="email" id="i_leadEmail" placeholder="lead@team.dev" value="${data.leadEmail}"></div>
        <div class="field"><label>PHONE</label><input type="tel" id="i_leadPhone" placeholder="10-digit mobile" value="${data.leadPhone}" maxlength="10"></div>
      </div>`;
        $("#i_leadName").addEventListener("input", (e) => { data.leadName = e.target.value; update(); });
        $("#i_leadEmail").addEventListener("input", (e) => { data.leadEmail = e.target.value; update(); });
        $("#i_leadPhone").addEventListener("input", (e) => { data.leadPhone = e.target.value.replace(/[^0-9]/g, ""); update(); });
    } else {
        formBody.innerHTML = `
      <div class="step-head"><span class="n">03</span><span class="t">EXECUTION CONFIG</span><span class="ln"></span></div>
      <div class="field"><label>TEAM_SIZE :: ${data.teamSize}</label><input type="range" id="i_teamSize" min="2" max="6" value="${data.teamSize}"></div>
      <div class="field"><label>TRACK</label><div class="track-row" id="trackRow"></div></div>`;
        $("#i_teamSize").addEventListener("input", (e) => { data.teamSize = +e.target.value; e.target.previousElementSibling.textContent = `TEAM_SIZE :: ${data.teamSize}`; update(); });
        const tr = $("#trackRow");
        TRACKS.forEach((t) => {
            const b = el("button", "track-btn" + (data.track === t ? " active" : ""), t);
            b.type = "button";
            b.addEventListener("click", () => { data.track = t;[...tr.children].forEach((c) => c.classList.remove("active")); b.classList.add("active"); update(); });
            tr.appendChild(b);
        });
    }
}

function update() {
    const { logs, ok } = validate();
    renderConsole(logs, ok);
    const ready = step === 2 && ok;
    const progress = submitted ? 100 : Math.round(((step + (ok ? 1 : 0)) / 3) * 100);
    progressBar.style.width = progress + "%";
    progressBar.style.filter = `saturate(${0.6 + (progress / 100) * 1.4})`;
    stepLabel.textContent = `STEP ${step + 1} / 3`;
    statusLabel.textContent = submitted ? "SYSTEM_REGISTERED ✓" : ready ? "SYSTEM_READY" : "AWAITING_INPUT...";
    statusLabel.className = ready || submitted ? "ready" : "";
    nextBtn.disabled = !ok;
}

nextBtn.addEventListener("click", () => {
    const { ok } = validate();
    if (!ok) return;
    if (step < 2) { step++; renderForm(); }
    else { submitted = true; renderForm(); update(); return; }
    update();
});
backBtn.addEventListener("click", () => { if (step > 0) { step--; renderForm(); update(); } });

renderForm();
update();