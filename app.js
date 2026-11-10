const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const dk = (d) => d.toLocaleDateString("sv");
const ICO = {
    user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8", phone: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z",
    at: "M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0zm0 0v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.6 7.2", pin: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6",
    book: "M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z", wave: "M3 10v4M7 6v12M11 3v18M15 7v10M19 9v6", bolt: "M13 2 3 14h9l-1 8 10-12h-9z",
    redo: "M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5", lock: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4", vol: "M11 5 6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14",
    arrow: "M5 12h14M13 6l6 6-6 6", x: "M18 6 6 18M6 6l12 12", flame: "M12 22a7 7 0 0 0 7-7c0-4-3-6-4-10-3 2-4 4-4 6-2-1-2-3-2-3-2 2-4 4-4 7a7 7 0 0 0 7 7z",
    gap: "M4 8h5M15 8h5M4 16h16M11 6v4", bulb: "M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c1 1 1 2 1 3h6c0-1 0-2 1-3a7 7 0 0 0-4-12z", pen: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z", check: "M5 12l5 5L20 7", home: "M3 11l9-8 9 8v10H3z", chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
};
const ico = (n, s = 20) => `<svg class="ico" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${ICO[n]}"/></svg>`;

// ---------- Date ----------
DATA.phone = Array.from({ length: 40 }, () => {
    const d = (n) => Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join("");
    let b = d(6); const i = Math.floor(Math.random() * 5);
    if (Math.random() < 0.6) b = b.slice(0, i) + b[i] + b[i] + b.slice(i + 2);
    return `07${d(3)} ${b}`;
});
const L = (label, sub, ic, from) => ({ mode: "letters", label, sub, ico: ic, from });
const Wd = (label, sub, ic = "book") => ({ mode: "words", label, sub, ico: ic });
const CATS = {
    names: L("Names", "People & places", "user", ["firstname", "surname"]),
    phone: L("Phone numbers", "Digits & dial codes", "phone", ["phone"]),
    email: L("Emails", "Dots, dashes & domains", "at", ["email"]),
    address: L("Addresses & codes", "Streets, towns, postcodes", "pin", ["street", "city", "postcode"]),
    core: Wd("Essay essentials", "Words every essay uses"), double: Wd("Double letters", "accommodation, necessary"),
    th: Wd("TH words", "method, rhythm, thorough"), silent: Wd("Silent letters", "knowledge, government"),
    ie: Wd("EI / IE", "receive, believe"), ending: Wd("Tricky endings", "-tion, -ous, -ance, -ible"),
    environment: Wd("Environment", "Nature & wildlife"), culture: Wd("Culture", "Tourism & languages"), crime: Wd("Crime", "Punishment & justice"),
    character: Wd("Character", "People & generations"), books: Wd("Books", "Reading & libraries"), business: Wd("Business", "Money & work"),
    art: Wd("Art", "Museums & creativity"), education: Wd("Education", "Schools & learning"), health: Wd("Health", "Exercise & medicine"), food: Wd("Food", "Diet & cooking"), family: Wd("Family", "Parents & generations"), task1: Wd("Task 1", "Charts, maps & trends"),
};
const FOCUS = ["names", "phone", "email", "address", "core", "double", "th", "silent"];
const SILENT = /kn|wr|gh|mb$|^ps|^gn|ign|stle|^hon|ould|alk|sc[ie]|mn$/;
const ASK = { firstname: "first name", surname: "surname", street: "street", city: "town", email: "email address", postcode: "postcode", phone: "phone number" };
const LEVELS = ["Warm-up listener", "Sound scout", "Word weaver", "Spelling ace", "Letter legend"];
const MODES = { letters: ["01 / LETTER LAB", "lime"], words: ["02 / ONE-SHOT WORDS", "lav"], gap: ["03 / FILL THE GAP", "sand"] };

// ---------- Stare ----------
const DB = Object.assign({ mist: {}, mastered: {}, log: {}, xp: 0, st: {}, err: {}, essays: [], emist: {}, drafts: {} }, (() => { try { return JSON.parse(localStorage.getItem("spellclub-v2")) || {}; } catch { return {}; } })());
const save = () => { try { localStorage.setItem("spellclub-v2", JSON.stringify(DB)); } catch {} };
const S = { view: "home", wm: "words", all: false, speed: 1, queue: [], i: 0, q: null, played: false, playing: false, checked: false, hint: false, right: 0, xp: 0, grp: null, review: false, tab: "revisit", pid: 0, res: null, et: "write", etopic: "all", eq: null, hl: 0, tm: null, sp: null, errs: [], fix: [], saved: {}, ro: false, text: "", prefill: "" };
const key = (q) => (q.mode === "letters" ? "L|" : "W|") + q.text;
const today = () => DB.log[dk(new Date())] || { c: 0, t: 0 };
const streak = () => { let n = 0; const d = new Date(); if (!DB.log[dk(d)]?.t) d.setDate(d.getDate() - 1); while (DB.log[dk(d)]?.t) { n++; d.setDate(d.getDate() - 1); } return n; };
const nMist = () => Object.keys(DB.mist).length, nAll = () => nMist() + Object.keys(DB.emist).length;
const ent = (m) => ({ ...m, mode: m.mode === "letters" ? "letters" : S.wm, sentence: m.sentence || WORDS[m.text] });

// ---------- Audio ----------
let VOICE = null;
const vscore = (v) => (v.lang === "en-GB" ? 4 : 0) + (/natural|online/i.test(v.name) ? 3 : 0) + (/google uk|libby|sonia|ryan|daniel|serena/i.test(v.name) ? 2 : 0);
const pickVoice = () => { VOICE = speechSynthesis.getVoices().filter((v) => /^en/i.test(v.lang)).sort((a, b) => vscore(b) - vscore(a))[0] || null; };
speechSynthesis.onvoiceschanged = pickVoice; pickVoice();
function say(text, rate, onstart, onend) {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (VOICE) { u.voice = VOICE; u.lang = VOICE.lang; } else u.lang = "en-GB";
    u.rate = rate; u.onstart = onstart; u.onend = u.onerror = onend;
    speechSynthesis.speak(u);
}
const speech = (q) => (q.mode === "letters" ? buildSpeech(q) : q.mode === "gap" ? q.sentence : q.text);
function play() {
    const q = S.q; if (!q || (q.mode === "words" && !S.checked && (S.played || S.playing))) return;
    const id = ++S.pid; S.playing = true; paintAudio();
    say(speech(q), q.mode === "letters" ? S.speed : 0.9, () => {}, () => { if (id !== S.pid) return; S.playing = false; S.played = true; paintAudio(); });
}

// ---------- Sesiune ----------
const lettersOf = (g) => CATS[g].from.flatMap((cat) => DATA[cat].map((text) => ({ mode: "letters", cat, grp: g, text })));
const wordsOf = (g, mode) => (g ? CAT_W[g] : [...new Set(Object.values(CAT_W).flat())]).map((w) => ({ mode, grp: g || "mix", text: w, sentence: WORDS[w] }));
function start({ grp = null, mode = null, review = false, only = null, n = 8, essay = false } = {}) {
    mode = mode || (grp && CATS[grp].mode === "letters" ? "letters" : S.wm);
    let p;
    if (only) p = [only];
    else if (essay) p = Object.values(DB.emist).map((m) => ({ ...m, mode: "gap" }));
    else if (review) p = Object.values(DB.mist).map(ent);
    else if (mode === "letters") p = (grp ? [grp] : Object.keys(CATS).filter((k) => CATS[k].mode === "letters")).flatMap(lettersOf);
    else p = wordsOf(grp, mode);
    if (!p.length) { S.view = "home"; render(); return; }
    Object.assign(S, { queue: shuffle(p).slice(0, n), i: 0, right: 0, xp: 0, grp, review, view: "practice" });
    setQ();
}
function setQ() {
    S.q = S.queue[S.i]; S.played = S.playing = S.checked = S.hint = false; S.res = null; S.pid++;
    render(); $("#ans")?.focus();
    if (S.q.mode === "letters") setTimeout(play, 350);
}
function next() { speechSynthesis.cancel(); if (S.i + 1 >= S.queue.length) { S.view = "sum"; render(); } else { S.i++; setQ(); } }

// ---------- Verificare ----------
function classify(ops, t) {
    const lc = (x) => (x || "").toLowerCase();
    const dbl = ops.some((o, i) => { const a = ops[i - 1], b = ops[i + 1];
        return (o.type === "del" && ((a && lc(a.c) === lc(o.c)) || (b && lc(b.c) === lc(o.c)))) || (o.type === "ins" && ((a && lc(a.c) === lc(o.t)) || (b && lc(b.c) === lc(o.t)))); });
    if (dbl) return { type: "Double sounds", tip: "A repeated letter or digit is hiding here. Check the middle of the word." };
    if (ops.some((o) => o.type === "del" && "bghklnptw".includes(lc(o.c))) && SILENT.test(lc(t))) return { type: "Silent letters", tip: "Some letters stay silent but still belong in the spelling." };
    for (const o of ops) if (o.type === "sub") {
        const m = { bv: "B / V", cs: "C / S", gj: "G / J", ei: "E / I", mn: "M / N", dt: "D / T", ck: "C / K", au: "A / U" }[[lc(o.c), lc(o.t)].sort().join("")];
        if (m) return { type: m + " confusion", tip: `You wrote ${o.t.toUpperCase()} where ${o.c.toUpperCase()} belongs. Listen for the difference.` };
    }
    return { type: "Other letters", tip: "Break the word into beats and check each letter." };
}
function check(skip) {
    const q = S.q; if (!q || S.checked) return;
    if (!skip && q.mode !== "gap" && !S.played && !S.playing) { $("#note").textContent = "Listen first, then type what you hear."; return; }
    const norm = (s) => (["phone", "postcode"].includes(q.cat) ? s.replace(/\s+/g, "") : s.trim());
    const typed = skip ? "" : norm($("#ans").value), target = norm(q.text);
    const ops = align(target, typed, false), ok = !skip && ops.every((o) => o.type === "eq");
    S.checked = true; S.pid++; S.playing = false; speechSynthesis.cancel(); S.res = { ops, ok, skip };
    const d = dk(new Date()), l = DB.log[d] || (DB.log[d] = { c: 0, t: 0 }), s = DB.st[q.grp] || (DB.st[q.grp] = { c: 0, t: 0, m: q.mode === "letters" ? "L" : "W" });
    l.t++; s.t++;
    if (ok) {
        l.c++; s.c++; S.right++;
        const g = q.mode === "letters" ? 15 : 20; DB.xp += g; S.xp += g;
        if (DB.mist[key(q)] || DB.emist[key(q)]) { delete DB.mist[key(q)]; delete DB.emist[key(q)]; DB.mastered[key(q)] = 1; }
    } else {
        const cl = classify(ops, target), M = q.src === "essay" ? DB.emist : DB.mist, m = M[key(q)];
        M[key(q)] = { mode: q.mode, grp: q.grp, cat: q.cat, src: q.src, text: q.text, sentence: q.sentence, n: (m?.n || 0) + 1, wrong: typed || "(skipped)", type: cl.type, tip: cl.tip };
        DB.err[cl.type] = (DB.err[cl.type] || 0) + 1;
    }
    save();
    $("#fb").innerHTML = resultHtml(); $("#foot").innerHTML = footHtml(); $("#ans").className = "ans " + (ok ? "good" : "bad"); $("#ans").readOnly = true; paintAudio();
    $("#nextbtn")?.focus();
}

// ---------- Randare: practică ----------
const BARS = Array.from({ length: 34 }, (_, i) => `<i style="--h:${22 + Math.round(Math.abs(Math.sin(i * 1.7)) * 70)}%;--d:${(i % 7) * 0.09}s"></i>`).join("");
const blank = (q) => esc(q.sentence).replace(new RegExp("\\b" + q.text + "\\b", "i"), (m) => (S.checked ? `<mark>${m}</mark>` : `<span class="blank">${S.hint ? m[0] : ""}${"_".repeat(m.length - (S.hint ? 1 : 0))}</span> <small>(${m.length})</small>`));
function audioHtml() {
    const q = S.q;
    if (q.mode === "letters") return `<p class="ask">What's the ${ASK[q.cat]}?</p><div class="wave ${S.playing ? "live" : ""}">${BARS}</div>
    <div class="arow"><button class="btn dark" data-act="play">${ico("vol", 18)} ${S.played ? "Listen again" : "Listen"}</button>
    <select id="spd" aria-label="Speed">${[0.75, 1, 1.25, 1.5].map((v) => `<option value="${v}" ${v === S.speed ? "selected" : ""}>${v}×</option>`).join("")}</select></div><p class="micro">Unlimited replays</p>`;
    if (q.mode === "gap") return `<p class="sent">${blank(q)}</p><div class="arow"><button class="btn dark" data-act="play">${ico("vol", 18)} ${S.playing ? "Playing…" : "Hear the sentence"}</button>
    ${S.checked ? "" : `<button class="btn ghost" data-act="hint">Hint</button>`}</div>`;
    if (S.checked) return `<span class="pill">YOUR WORD</span><div class="wave ${S.playing ? "live" : ""}">${BARS}</div><button class="btn light" data-act="play">${ico("vol", 18)} Hear it again</button>`;
    if (S.playing) return `<span class="pill">ONE LISTEN ONLY</span><div class="wave live">${BARS}</div><p class="big2">Listening…</p>`;
    if (S.played) return `<span class="pill">ONE LISTEN ONLY</span><div class="lockc">${ico("lock", 26)}</div><p class="big2">You heard it. You've got this.</p><p class="micro">1 of 1 plays used · Replay locked</p>`;
    return `<span class="pill">ONE LISTEN ONLY</span><button class="playc" data-act="play" aria-label="Play">${ico("vol", 28)}</button><p class="big2">Get ready, then press play.</p>`;
}
const paintAudio = () => { const a = $("#audio"); if (a) a.innerHTML = audioHtml(); };
function resultHtml() {
    const { ops, ok, skip } = S.res, q = S.q, nb = ops.filter((o) => o.type !== "eq").length, m = (q.src === "essay" ? DB.emist : DB.mist)[key(q)];
    const you = ops.filter((o) => o.type !== "del").map((o) => (o.type === "eq" ? esc(o.t) : `<s>${esc(o.t)}</s>`)).join("");
    const fix = ops.filter((o) => o.type !== "ins").map((o) => (o.type === "eq" ? esc(o.c) : `<u>${esc(o.c)}</u>`)).join("");
    const title = ok ? "Perfect. Nicely heard." : skip ? "No problem. Here it is." : nb === 1 ? "So close. One letter to catch." : `Not quite. ${nb} letters to fix.`;
    return `<div class="fb ${ok ? "good" : ""}"><p class="ft">${ico(ok ? "check" : "bolt", 18)} ${title}${ok ? ` <b>+${q.mode === "letters" ? 15 : 20} XP</b>` : ""}</p><p class="big">${fix}</p>
  ${ok ? "" : `<p class="you">You wrote: <span>${you || "nothing"}</span></p><p class="tip"><b>${m.type}.</b> ${m.tip}</p><p class="micro">✓ Saved to Mistakes</p>`}
  ${q.mode !== "letters" && q.sentence && q.mode !== "gap" ? `<p class="ctx">${esc(q.sentence)}</p>` : ""}</div>`;
}
const footHtml = () => (S.checked
    ? `<span class="micro">Press Enter to continue ↵</span><button class="btn pri" id="nextbtn" data-act="next">${S.i + 1 >= S.queue.length ? "Finish" : "Next question"} ${ico("arrow", 18)}</button>`
    : `<button class="link" data-act="skip">I didn't catch it · Skip</button><button class="btn pri" data-act="check">Check answer ${ico("arrow", 18)}</button>`);
function practice() {
    const q = S.q, [badge, col] = MODES[q.mode], isL = q.mode === "letters", g = CATS[q.grp];
    const copy = { letters: ["CATCH THE DETAILS", "Small letters. Big difference.", "Listen to each letter, then type the name, number or address. Replays are always welcome."],
        words: ["TRUST YOUR EARS", "One listen. All you.", "Hear the whole word just once. Hold the sound in your head, then spell it out."],
        gap: ["FIND THE WORD", "Read it. Hear it. Spell it.", "Real sentences from your IELTS essays, with one word missing."] }[q.mode];
    const list = Object.keys(CATS).filter((k) => (CATS[k].mode === "letters") === isL);
    return `<div class="wrap practice"><div class="phead"><span class="chip ${col}">${badge}</span><span class="micro">${S.i + 1} of ${S.queue.length} questions</span></div>
  <div class="segs ${col}">${S.queue.map((_, i) => `<i class="${i < S.i || (i === S.i && S.checked) ? "on" : ""}"></i>`).join("")}</div>
  <div class="pgrid"><aside><p class="eye">${copy[0]}</p><h2>${copy[1]}</h2><p class="lead">${copy[2]}</p>
    ${isL ? "" : `<div class="seg2"><button class="${q.mode === "words" ? "on" : ""}" data-act="wm" data-m="words">One-shot</button><button class="${q.mode === "gap" ? "on" : ""}" data-act="wm" data-m="gap">Fill the gap</button></div>`}
    <div class="cats">${isL ? "" : `<button class="${!S.grp ? "on" : ""}" data-act="cat" data-g="">${ico("wave", 18)} Mixed</button>`}${list.map((k) => `<button class="${S.grp === k ? "on" : ""}" data-act="cat" data-g="${k}">${ico(CATS[k].ico, 18)} ${CATS[k].label}</button>`).join("")}</div>
    <div class="tipc"><p><b>The little things count.</b></p><p>${isL ? "“Dot” is a period. “At” is @. Listen right to the end: silent letters can still be spelled out." : "Double letters, TH and silent letters are the usual traps. Break the word into beats."}</p></div></aside>
  <section class="pcard"><div class="meta"><span class="eye">${(g?.label || (q.src === "essay" ? "Your essays" : "Mixed")).toUpperCase()} / ${q.mode === "letters" ? "LETTER LAB" : q.mode === "gap" ? "FILL THE GAP" : "ONE-SHOT"}</span><span class="eye">+${isL ? 15 : 20} XP</span></div>
    <div id="audio" class="audio ${q.mode}">${audioHtml()}</div>
    <label class="lab" for="ans">${q.mode === "gap" ? "Type the missing word" : q.mode === "words" ? "Spell the word you heard" : "Your answer"}</label>
    <input id="ans" class="ans" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" inputmode="text" placeholder="Type here">
    <p id="note" class="note"></p><div id="fb"></div><div id="foot" class="foot">${footHtml()}</div></section></div></div>`;
}
function sum() {
    const p = Math.round((S.right / S.queue.length) * 100);
    return `<div class="wrap sum"><p class="eye">SESSION COMPLETE</p><h1>${p >= 75 ? "Look at you, listening better." : "Every miss is saved. Come back to it."}</h1>
  <div class="stats3"><div class="card"><b>${S.right}/${S.queue.length}</b><span>correct</span></div><div class="card"><b>+${S.xp}</b><span>XP earned</span></div><div class="card"><b>${nMist()}</b><span>to revisit</span></div></div>
  <div class="row"><button class="btn pri" data-act="again">Keep going ${ico("arrow", 18)}</button><button class="btn" data-act="nav" data-v="mist">Review mistakes</button><button class="btn" data-act="exit">Back home</button></div></div>`;
}

// ---------- Randare: pagini ----------
function hdr() {
    const inP = ["practice", "sum", "write", "eres", "read"].includes(S.view), t = (v, ic, l, extra = "") => `<button class="${S.view === v ? "on" : ""}" data-act="nav" data-v="${v}">${ico(ic, 18)}<span>${l}${extra}</span></button>`;
    return `<header class="top"><div class="wrap"><div class="logo"><span class="lg">${ico("wave", 20)}</span>spellclub</div>
  ${inP ? `<button class="link" data-act="exit">Save &amp; exit ${ico("x", 16)}</button>` : `<nav class="tabs">${t("home", "home", "Study")}${t("essays", "pen", "Essays")}${t("mist", "redo", "Mistakes", ` <em>${nAll()}</em>`)}${t("prog", "chart", "Progress")}</nav>
  <div class="who"><span class="fl">${ico("flame", 16)} ${streak()} day streak</span><span class="av">A</span></div>`}</div></header>`;
}
function home() {
    const t = today(), goal = 12, left = Math.max(0, goal - t.t), keys = S.all ? Object.keys(CATS) : FOCUS;
    const card = (c, m, h, p, b, k) => `<div class="mode ${c}"><div class="mh"><span class="eye">${m}</span>${ico(k, 22)}</div><h3>${h}</h3><p>${p}</p><div class="mf"><span class="micro">${b}</span><button class="btn dark" data-act="mode" data-m="${c === "lime" ? "letters" : c === "lav" ? "words" : "gap"}">${c === "lime" ? "Enter the lab" : c === "lav" ? "Try one-shot" : "Fill the gaps"} ${ico("arrow", 16)}</button></div></div>`;
    return `<div class="wrap home"><div class="hero"><div><p class="lead sm">Hey Alexia, good to hear you.</p><h1>Your ears.<br>Your superpower.</h1><p class="lead">Turn “was that B or V?” into “got it.”<br>A few focused minutes, a little more confidence.</p></div>
  <div class="goal"><div class="gh"><span class="eye lime">ON A ROLL</span><span>${DB.xp} XP</span></div><p class="gn"><b>${t.t}</b> / ${goal} daily answers</p><div class="bar"><i style="width:${Math.min(100, (t.t / goal) * 100)}%"></i></div>
  <p class="micro">${left ? `${left} more answers to hit today's goal.` : "Daily goal done. Nice work."}</p></div></div>
  <div class="sech"><h2>How will you listen?</h2><span class="micro">Three ways to tune in</span></div>
  <div class="modes">${card("lime", "01 / HEAR THE LETTERS", "Letter by letter.", "Catch every letter in names, phone numbers and emails. Replay as you learn.", "8 questions · 5 min", "wave")}${card("lav", "02 / HEAR THE WORD", "One-shot words.", "One word. One listen. Trust your ears and spell it from memory.", "8 questions · 4 min", "bolt")}${card("sand", "03 / READ THE SENTENCE", "Fill the gap.", "Real sentences from IELTS essays with one word missing. Type it from memory.", "8 questions · 4 min", "gap")}</div>
  <div class="banner essb">${ico("pen", 26)}<div><b>Writing Task 2: Essay lab</b><p class="micro">Pick a question, write the essay, get a hint if you are stuck, then have your spelling checked.</p></div><button class="btn dark" data-act="nav" data-v="essays">Open essay lab ${ico("arrow", 16)}</button></div>
  <div class="sech"><h2>Find your focus</h2><button class="link" data-act="all">${S.all ? "Fewer" : "All categories"} ${ico("arrow", 14)}</button></div>
  <div class="focus">${keys.map((k) => { const s = DB.st[k], p = s ? Math.round((s.c / s.t) * 100) : 0;
        return `<button class="fcard" data-act="focus" data-g="${k}"><div class="fh">${ico(CATS[k].ico, 22)}<span class="micro">${p}%</span></div><b>${CATS[k].label}</b><span class="micro">${CATS[k].sub}</span><div class="bar lavb"><i style="width:${p}%"></i></div></button>`; }).join("")}</div>
  <div class="banner">${ico("redo", 26)}<div><b>Mistakes make great teachers.</b><p class="micro">${nMist() ? `${nMist()} little lessons are ready for another listen.` : "Nothing to revisit yet. Misses will land here."}</p></div><button class="btn light" data-act="nav" data-v="mist">Review mistakes ${ico("arrow", 16)}</button></div></div>`;
}
function mist() {
    const el = Object.entries(DB.emist).sort((a, b) => b[1].n - a[1].n), list = Object.entries(DB.mist).sort((a, b) => b[1].n - a[1].n), mast = Object.keys(DB.mastered), f = list[0]?.[1];
    const row = ([k, m]) => `<div class="mrow"><div><s>${esc(m.wrong)}</s><b>${esc(m.text)}</b><span class="micro">${esc(CATS[m.grp]?.label || "Mixed")} · ${m.mode === "letters" ? "Letter lab" : "Words"}</span></div><div><b class="sm">${m.type}</b><span class="micro">${m.tip}</span></div><button class="link" data-act="retry" data-k="${esc(k)}">${ico("redo", 16)} Retry</button></div>`;
    return `<div class="wrap mistp"><div class="mh2"><div><p class="eye">THE COMEBACK CORNER</p><h1>Miss it. Meet it. Master it.</h1><p class="lead">Not a scorecard. A second chance to make it stick.</p></div>${list.length ? `<button class="btn lime" data-act="retryall">Retry all ${list.length} ${ico("redo", 18)}</button>` : ""}</div>
  <div class="tabs2"><button class="${S.tab === "revisit" ? "on" : ""}" data-act="tab" data-t="revisit">To revisit · ${list.length}</button><button class="${S.tab === "mastered" ? "on" : ""}" data-act="tab" data-t="mastered">Mastered · ${mast.length}</button><button class="${S.tab === "essay" ? "on" : ""}" data-act="tab" data-t="essay">From essays · ${el.length}</button></div>
  ${S.tab === "essay" ? essayTab(el) : S.tab === "mastered" ? `<div class="mlist pad">${mast.length ? mast.map((k) => `<span class="chip lav">${esc(k.slice(2))}</span>`).join(" ") : "<p class='micro'>Words you fix will show up here.</p>"}</div>`
        : !list.length ? `<div class="mlist pad"><p class="micro">No mistakes saved yet. Do a session and the words you miss will land here.</p></div>` : `${f ? `<div class="feat"><div><p class="eye">LET'S UNTANGLE THIS ONE</p><s>${esc(f.wrong)}</s><p class="fw">${esc(f.text)}</p><button class="link" data-act="hear" data-k="${esc(list[0][0])}">${ico("vol", 16)} Hear it again</button></div>
  <div><span class="chip">${f.type}</span><h3>${f.tip}</h3><button class="btn dark" data-act="retry" data-k="${esc(list[0][0])}">Try this word ${ico("arrow", 16)}</button></div></div>` : ""}
  <div class="mlist">${list.slice(1).map(row).join("")}</div>`}</div>`;
}
function prog() {
    const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - 6 + i); return { l: d.toLocaleDateString("en", { weekday: "narrow" }), ...(DB.log[dk(d)] || { c: 0, t: 0 }) }; });
    const c = days.reduce((a, d) => a + d.c, 0), t = days.reduce((a, d) => a + d.t, 0), mx = Math.max(8, ...days.map((d) => d.t));
    const errs = Object.entries(DB.err).sort((a, b) => b[1] - a[1]).slice(0, 3), et = Object.values(DB.err).reduce((a, b) => a + b, 0) || 1;
    const mm = (m) => { const a = Object.values(DB.st).filter((s) => s.m === m); const cc = a.reduce((x, s) => x + s.c, 0), tt = a.reduce((x, s) => x + s.t, 0); return [cc, tt, tt ? Math.round((cc / tt) * 100) : 0]; };
    const [lc, lt, lp] = mm("L"), [wc, wt, wp] = mm("W"), top1 = errs[0]?.[0] || "", lvl = Math.floor(DB.xp / 200), xp = DB.xp % 200;
    const mv = top1 === "Double sounds" ? ["Double down on double sounds.", "Practice doubles", "double"] : top1 === "Silent letters" ? ["Listen for the silent ones.", "Practice silent letters", "silent"] : nMist() ? ["Turn your misses into wins.", "Review mistakes", ""] : ["Start with essay essentials.", "Start a session", "core"];
    return `<div class="wrap progp"><p class="eye">PROOF YOU'RE GETTING THERE</p><h1>Look at you, listening better.</h1><p class="lead">Small sessions. Real progress. Here's what your ears have been up to.</p>
  <div class="stats3"><div class="card"><b class="xl">${t ? Math.round((c / t) * 100) : 0}%</b><span>Accuracy</span><em class="micro">last 7 days</em></div><div class="card"><b class="xl">${t}</b><span>Answers</span><em class="micro">${c} correct · ${t - c} to revisit</em></div><div class="card"><b class="xl">${streak()} ${streak() === 1 ? "day" : "days"}</b><span>Streak</span><em class="micro">Keep it going!</em></div></div>
  <div class="two"><div class="card"><h3>Showing up pays off.</h3><div class="chart">${days.map((d) => `<div class="col"><em>${d.t || ""}</em><div class="cb" style="height:${(d.t / mx) * 100}%"><i style="height:${d.t ? (d.c / d.t) * 100 : 0}%"></i></div><span>${d.l}</span></div>`).join("")}</div></div>
  <div class="card"><h3>Your sticking points</h3>${errs.length ? errs.map(([k, n]) => `<div class="sp"><div><b>${k}</b><span class="micro">${n} / ${et}</span></div><div class="bar lavb"><i style="width:${(n / et) * 100}%"></i></div></div>`).join("") : "<p class='micro'>Mistake patterns will show up here after your first session.</p>"}</div></div>
  <div class="two"><div class="move"><p class="eye">YOUR NEXT GOOD MOVE</p><h3>${mv[0]}</h3><button class="btn dark" data-act="move" data-g="${mv[2]}">${mv[1]} ${ico("arrow", 16)}</button></div>
  <div class="card"><h3>Three modes. More confidence.</h3><div class="mr"><span class="lg">${ico("wave", 18)}</span><div><b>Letter lab</b><span class="micro">${lc} / ${lt} correct</span></div><b class="xl2">${lp}%</b></div><div class="mr"><span class="lg lv">${ico("bolt", 18)}</span><div><b>Words &amp; gaps</b><span class="micro">${wc} / ${wt} correct</span></div><b class="xl2">${wp}%</b></div></div></div>
  <div class="banner lvl"><div><b>Level ${lvl + 1} · ${LEVELS[Math.min(lvl, 4)]}</b><div class="bar dk"><i style="width:${xp / 2}%"></i></div><p class="micro">${200 - xp} XP to your next chapter.</p></div><b>${xp} / 200 XP</b></div></div>`;
}
function render() {
    document.body.dataset.view = S.view;
    $("#app").innerHTML = hdr() + `<main>${{ home, practice, sum, mist, prog, essays: essaysPage, write: writePage, eres, read: readPage }[S.view]()}</main>`;
    clearInterval(S.tm); if (S.view === "write") startTimer(); if (S.view === "eres") renderRes();
    scrollTo(0, 0);
}

// ---------- Evenimente ----------
$("#app").addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]"); if (!b) return;
    const d = b.dataset, A = {
        nav: () => { S.view = d.v; if (d.t) S.tab = d.t; render(); }, exit: () => { speechSynthesis.cancel(); S.view = ["write", "eres", "read"].includes(S.view) ? "essays" : "home"; render(); },
        mode: () => { if (d.m !== "letters") S.wm = d.m; start({ mode: d.m }); }, focus: () => start({ grp: d.g }),
        cat: () => start({ grp: d.g || null, mode: d.g ? null : S.q.mode }), wm: () => { S.wm = d.m; start({ grp: S.grp && CATS[S.grp].mode === "words" ? S.grp : null, mode: d.m }); },
        play, next, check: () => check(), skip: () => check(true), hint: () => { S.hint = true; paintAudio(); $("#ans").focus(); },
        all: () => { S.all = !S.all; render(); }, tab: () => { S.tab = d.t; render(); },
        retry: () => start({ only: ent(DB.mist[d.k]) }), retryall: () => start({ review: true, n: 12 }),
        hear: () => { const m = ent(DB.mist[d.k]); say(speech(m), m.mode === "letters" ? 1 : 0.9, () => {}, () => {}); },
        again: () => (S.review ? start({ review: true, n: 12 }) : start({ grp: S.grp, mode: S.q.mode })),
        move: () => (d.g ? start({ grp: d.g }) : start({ review: true, n: 12 })),
    };
    ({ ...A, ...EA(d) })[d.act]?.();
});
$("#app").addEventListener("change", (e) => { if (e.target.id === "spd") S.speed = +e.target.value; });
$("#app").addEventListener("keydown", (e) => { if (e.target.id === "ans" && e.key === "Enter") { e.preventDefault(); S.checked ? next() : check(); } });
render();