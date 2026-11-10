// Essay lab: întrebări Writing Task 2, indicii, verificare ortografică, bibliotecă. Încărcat înaintea app.js.
const TOPICS = { art: "Art", environment: "Environment", education: "Education", culture: "Culture & tourism", crime: "Crime", character: "Character", books: "Books", business: "Business & money", health: "Health & exercise", food: "Food", family: "Family", world: "World & social issues", transport: "Transport", technology: "Technology", media: "Media & internet", language: "Language & communication", work: "Work" };
const SKEL = {
    "Opinion": ["Intro: paraphrase the question. This essay agrees / disagrees that … because … and … .", "Body 1: The primary reason is that … This is because … As a result, … For example, …", "Body 2: Another important point is that … That is to say, … For instance, …", "Conclusion: In conclusion, this essay agrees / disagrees that … because … and … ."],
    "Discussion": ["Intro: Some people believe that …, while others argue that … This essay agrees with the former / latter view because … .", "Body 1: On the one hand, … This is because … For example, … However, I believe … .", "Body 2: On the other hand, … That is to say, … For instance, … .", "Conclusion: In conclusion, although …, this essay believes that … because … ."],
    "Advantages / Disadvantages": ["Intro: paraphrase. The main advantages are … and …, whereas the main disadvantages are … and … .", "Body 1: The main advantage of … is that … This is because … For example, … .", "Body 2: One major disadvantage is that … In other words, … For instance, … .", "Conclusion: In conclusion, the benefits of … are …, but the drawbacks are … ."],
    "Problem / Solution": ["Intro: paraphrase. The main causes / problems are … and …, and the most viable solutions are … and … .", "Body 1: The main cause of this problem is … This is because … For example, … .", "Body 2: A viable solution is to … If …, then … For instance, … .", "Conclusion: In conclusion, … is caused by …, but it can be solved by … ."],
    "Two-part Question": ["Intro: paraphrase. This is due to …, and it should be seen as a positive / negative development because … .", "Body 1: answer question 1 directly: People … because … This is because … For example, … .", "Body 2: answer question 2: This is a positive / negative trend because … That is to say, … For instance, … .", "Conclusion: In conclusion, … (answer 1) and … (answer 2)."],
};
const CONTR = { dont: "don't", doesnt: "doesn't", didnt: "didn't", cant: "can't", wont: "won't", isnt: "isn't", arent: "aren't", wasnt: "wasn't", werent: "weren't", couldnt: "couldn't", wouldnt: "wouldn't", shouldnt: "shouldn't", havent: "haven't", hasnt: "hasn't", im: "I'm", ive: "I've", youre: "you're", theyre: "they're", thats: "that's" };
const wc = (t) => (t.trim().match(/\S+/g) || []).length;
const qOf = (id) => ESSAYS.find((e) => e.id === id);
const pick = (a) => a[Math.floor(Math.random() * a.length)];

// ---------- Ortografie ----------
function getSpell() {
    if (S.sp) return S.sp;
    const extra = new Set(), add = (t) => (t.match(/[A-Za-z]+(?:'[A-Za-z]+)*/g) || []).forEach((w) => extra.add(w));
    ESSAYS.forEach((e) => { add(e.q); e.ex.forEach(add); e.essay.forEach(add); });
    Object.keys(WORDS).forEach((w) => extra.add(w));
    return (S.sp = makeSpell([...extra]));
}
function spellErrors(text) {
    const sp = getSpell(), out = [], re = /[A-Za-z]+(?:['’][A-Za-z]+)*/g, toks = []; let m;
    while ((m = re.exec(text))) toks.push({ w: m[0], i: m.index });
    toks.forEach((t, k) => {
        const w = t.w, e = t.i + w.length, pre = text.slice(0, t.i), start = /(^|[.!?]\s+|\n\s*)$/.test(pre);
        if (w === "i") return out.push({ ...t, e, sug: ["I"], kind: "capital letter" });
        const p = toks[k - 1];
        if (p && p.w.toLowerCase() === w.toLowerCase() && /^[ \t]+$/.test(text.slice(p.i + p.w.length, t.i))) return out.push({ ...t, e, sug: [""], kind: "repeated word" });
        if ((/^[A-Z]/.test(w) && !start) || (w === w.toUpperCase() && w.length > 1)) return;
        const lw = w.replace(/’/g, "'");
        if (sp.correct(lw) || sp.correct(lw.toLowerCase())) return;
        let sg = [CONTR[lw.toLowerCase()], ...sp.suggest(lw)].filter(Boolean).slice(0, 3);
        if (/^[A-Z]/.test(w)) sg = sg.map((s) => s[0].toUpperCase() + s.slice(1));
        out.push({ ...t, e, sug: sg.length ? sg : [w], kind: "spelling" });
    });
    return out;
}
function sentenceAround(text, k) {
    const r = S.errs[k], a = Math.max(text.slice(0, r.i).search(/[.!?\n][^.!?\n]*$/) + 1, 0);
    let b = text.slice(r.e).search(/[.!?\n]/); b = b < 0 ? text.length : r.e + b + 1;
    let out = "", p = a;
    S.errs.forEach((x, j) => { if (x.i >= a && x.e <= b) { out += text.slice(p, x.i) + (x.sug[S.fix[j]] ?? x.w); p = x.e; } });
    const s = (out + text.slice(p, b)).replace(/ {2,}/g, " ").trim();
    return s.length > 230 ? s.slice(0, 230).replace(/\s\S*$/, "") + "…" : s;
}
function saveFix(i) {
    const r = S.errs[i]; unsaveFix(i);
    const fx = r.sug[S.fix[i]]; if (r.kind !== "spelling" || !fx || fx.toLowerCase() === r.w.toLowerCase()) return;
    const key = "W|" + fx.toLowerCase(), m = DB.emist[key];
    DB.emist[key] = { mode: "gap", grp: "essay", src: "essay", text: fx.toLowerCase(), wrong: r.w, sentence: sentenceAround(S.text, i), n: (m?.n || 0) + 1, type: "Essay spelling", tip: `In your essay: “${r.w}” should be “${fx}”.`, topic: S.eq.topic };
    S.saved[i] = key;
}
function unsaveFix(i) { const k = S.saved[i]; if (!k) return; const m = DB.emist[k]; if (m) { if (m.n <= 1) delete DB.emist[k]; else m.n--; } delete S.saved[i]; }

// ---------- Pagini ----------
function essaysPage() {
    const t = S.etopic, inT = (q) => t === "all" || q.topic === t;
    let body, n;
    if (S.et === "mine") {
        const mine = DB.essays.filter((x) => inT(qOf(x.qid))).sort((a, b) => b.id - a.id); n = mine.length;
        body = mine.map((x) => { const q = qOf(x.qid); return `<div class="qcard"><button class="qb" data-act="openmine" data-i="${x.id}"><span class="chip lav">${TOPICS[q.topic]}</span><b>${esc(q.q)}</b><span class="micro">${new Date(x.id).toLocaleDateString("en-GB")} · ${x.words} words · ${x.errs} spelling ${x.errs === 1 ? "mistake" : "mistakes"}</span></button><button class="link" data-act="delmine" data-i="${x.id}">Delete</button></div>`; }).join("") || `<p class="micro">Nothing here yet. Write an essay and it will be saved here.</p>`;
    } else {
        const l = ESSAYS.filter(inT); n = l.length;
        body = l.map((e) => { const done = DB.essays.some((x) => x.qid === e.id), dr = DB.drafts[e.id];
            return `<div class="qcard"><button class="qb" data-act="${S.et === "model" ? "readq" : "writeq"}" data-q="${e.id}"><span class="chip ${S.et === "model" ? "sand" : "lime"}">${e.type}</span><b>${esc(e.q)}</b><span class="micro">${TOPICS[e.topic]}${done ? " · ✓ written" : dr ? " · draft saved" : ""}</span></button></div>`; }).join("");
    }
    return `<div class="wrap essp"><p class="eye">WRITING TASK 2</p><h1>Your ideas.<br>Your words.</h1><p class="lead">Pick a question, write the essay yourself, then get your spelling checked. Every wrong word is saved in Mistakes.</p>
  <div class="tabs2">${[["write", "Write"], ["mine", "My essays"], ["model", "Model essays"]].map(([k, l]) => `<button class="${S.et === k ? "on" : ""}" data-act="etab" data-t="${k}">${l}</button>`).join("")}</div>
  <div class="tchips">${[["all", "All topics"], ...Object.entries(TOPICS)].map(([k, l]) => `<button class="${t === k ? "on" : ""}" data-act="etopic" data-t="${k}">${l}</button>`).join("")}</div>
  <div class="row shuf"><button class="btn lime" data-act="eshuffle">${ico("redo", 18)} Shuffle</button><span class="micro">${n} ${S.et === "mine" ? "essays" : "questions"}</span></div><div class="qgrid">${body}</div></div>`;
}
function usefulWords(q) {
    const skip = new Set(q.q.toLowerCase().match(/[a-z]+/g)), seen = new Set();
    return q.essay.join(" ").toLowerCase().match(/[a-z]{8,}/g).filter((w) => !skip.has(w) && !seen.has(w) && seen.add(w)).slice(0, 14);
}
function hintsHtml() {
    const q = S.eq, L = S.hl, h = [];
    if (L >= 1) h.push(["Arguments you could develop", q.ideas]);
    if (L >= 2) h.push(["Examples you can use", q.ex]);
    if (L >= 3) h.push(["Structure", SKEL[q.type]]);
    if (L >= 4) h.push(["Useful words", [usefulWords(q).join(", ")]]);
    return h.map(([t, l]) => `<div class="hint"><b>${t}</b><ul>${l.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>`).join("");
}
function writePage() {
    const q = S.eq, d = DB.drafts[q.id] || S.prefill || "";
    return `<div class="wrap writep"><div class="phead"><span class="chip lime">WRITING TASK 2 · ${q.type.toUpperCase()}</span><span class="micro" id="timer">00:00</span></div>
  <div class="wgrid"><aside><p class="eye">${TOPICS[q.topic].toUpperCase()}</p><h2 class="qq">${esc(q.q)}</h2><p class="lead">Aim for 250+ words in about 40 minutes. When you finish I check your spelling.</p>
  <button class="btn bulb" data-act="bulb">${ico("bulb", 18)} <span id="bl">${S.hl ? `Hint ${S.hl}/4` : "Need an idea?"}</span></button><div id="hints">${hintsHtml()}</div></aside>
  <section class="pcard"><textarea id="essay" placeholder="Start writing here…" spellcheck="false" autocapitalize="sentences">${esc(d)}</textarea>
  <div class="foot"><span class="micro" id="wcount">${wc(d)} words · draft saves automatically</span><button class="btn pri" data-act="finish">Check my spelling ${ico("arrow", 18)}</button></div><p id="note" class="note"></p></section></div></div>`;
}
function eres() {
    const n = S.errs.length, ro = S.ro;
    return `<div class="wrap resp"><p class="eye">${ro ? "YOUR ESSAY" : "ESSAY SAVED"}</p><h1>${n ? `${n} ${n === 1 ? "word" : "words"} to fix.` : "Clean spelling."}</h1>
  <p class="lead">${wc(S.text)} words${ro ? "" : " · +50 XP"} · ${n ? (ro ? "Spelling mistakes are underlined." : "Pick the right correction. Each one is saved in Mistakes › From essays.") : "No spelling mistakes found. Nice work."}</p>
  <p class="micro">${esc(S.eq.q)}</p>
  ${n ? `<div class="card fixes">${S.errs.map((r, k) => `<div class="fx"><s>${esc(r.w)}</s> → ${r.sug.map((s, j) => ro ? `<span class="sg">${esc(s) || "(remove)"}</span>` : `<button class="sg ${S.fix[k] === j ? "on" : ""}" data-act="fix" data-k="${k}" data-j="${j}">${esc(s) || "(remove)"}</button>`).join("")}<em class="micro">${r.kind}</em></div>`).join("")}</div>` : ""}
  <div class="two eq"><div class="card"><h3>Your text</h3><p id="orig" class="etext"></p></div><div class="card"><h3>Corrected</h3><p id="corr" class="etext"></p></div></div>
  <div class="row"><button class="btn pri" data-act="model">Compare with the model essay</button>${ro ? `<button class="btn" data-act="rewrite">Rewrite it</button>` : n ? `<button class="btn" data-act="pracess">Practise these words</button>` : ""}<button class="btn" data-act="exit">Back to essays</button></div><div id="modelbox"></div></div>`;
}
function renderRes() {
    let a = "", b = "", p = 0;
    S.errs.forEach((r, k) => { const pre = esc(S.text.slice(p, r.i)), fx = r.sug[S.fix[k]]; a += pre + `<mark class="er">${esc(r.w)}</mark>`; b += pre + (fx ? `<ins>${esc(fx)}</ins>` : ""); p = r.e; });
    const tail = esc(S.text.slice(p));
    $("#orig").innerHTML = (a + tail).replace(/\n/g, "<br>"); $("#corr").innerHTML = (b + tail).replace(/ {2,}/g, " ").replace(/\n/g, "<br>");
}
function modelHtml(q) {
    return `<div class="card model"><p class="eye">MODEL ESSAY · ${q.type.toUpperCase()}</p><h3>${esc(q.q)}</h3>${q.essay.map((p) => `<p>${esc(p)}</p>`).join("")}
  <div class="hint"><b>Ideas</b><ul>${q.ideas.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div><div class="hint"><b>Examples</b><ul>${q.ex.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div></div>`;
}
function readPage() {
    return `<div class="wrap resp"><p class="eye">${TOPICS[S.eq.topic].toUpperCase()}</p>${modelHtml(S.eq)}<div class="row"><button class="btn pri" data-act="writeq" data-q="${S.eq.id}">Write this essay myself</button><button class="btn" data-act="exit">Back to essays</button></div></div>`;
}
function startTimer() { S.t0 = Date.now(); clearInterval(S.tm); S.tm = setInterval(() => { const s = Math.floor((Date.now() - S.t0) / 1000), t = $("#timer"); if (t) t.textContent = String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); }, 1000); }

// ---------- Acțiuni ----------
function openWrite(id) { S.eq = qOf(id); S.hl = 0; S.prefill = ""; S.view = "write"; render(); }
function openMine(id) { const x = DB.essays.find((e) => e.id === +id); S.eq = qOf(x.qid); S.text = x.text; S.errs = spellErrors(x.text); S.fix = S.errs.map(() => 0); S.saved = {}; S.ro = true; S.rid = x.id; S.view = "eres"; render(); }
function finish() {
    const text = $("#essay").value.trim();
    if (wc(text) < 30) { $("#note").textContent = "Write a bit more first (at least 30 words)."; return; }
    $("#note").textContent = "Checking…";
    setTimeout(() => {
        S.text = text; S.errs = spellErrors(text); S.fix = S.errs.map(() => 0); S.saved = {}; S.ro = false;
        S.errs.forEach((_, i) => saveFix(i)); delete DB.drafts[S.eq.id];
        DB.essays.push({ id: Date.now(), qid: S.eq.id, text, words: wc(text), errs: S.errs.length }); DB.xp += 50; save();
        S.view = "eres"; render();
    }, 30);
}
const EA = (d) => ({
    etab: () => { S.et = d.t; render(); }, etopic: () => { S.etopic = d.t; render(); },
    eshuffle: () => {
        const inT = (q) => S.etopic === "all" || q.topic === S.etopic;
        if (S.et === "mine") { const l = DB.essays.filter((x) => inT(qOf(x.qid))); if (l.length) openMine(pick(l).id); return; }
        const l = ESSAYS.filter(inT), fresh = l.filter((q) => !DB.essays.some((x) => x.qid === q.id)), q = pick(fresh.length && S.et === "write" ? fresh : l);
        if (S.et === "model") { S.eq = q; S.view = "read"; render(); } else openWrite(q.id);
    },
    writeq: () => openWrite(d.q), readq: () => { S.eq = qOf(d.q); S.view = "read"; render(); }, openmine: () => openMine(d.i),
    delmine: () => { if (confirm("Delete this essay?")) { DB.essays = DB.essays.filter((x) => x.id !== +d.i); save(); render(); } },
    bulb: () => { S.hl = Math.min(4, S.hl + 1); $("#hints").innerHTML = hintsHtml(); $("#bl").textContent = `Hint ${S.hl}/4`; },
    finish, fix: () => { S.fix[+d.k] = +d.j; if (!S.ro) { saveFix(+d.k); save(); } renderRes(); document.querySelectorAll(`[data-act=fix][data-k="${d.k}"]`).forEach((b) => b.classList.toggle("on", b.dataset.j === d.j)); },
    model: () => { $("#modelbox").innerHTML = modelHtml(S.eq); $("#modelbox").scrollIntoView({ behavior: "smooth" }); },
    rewrite: () => { S.hl = 0; S.prefill = S.text; S.view = "write"; render(); }, pracess: () => start({ essay: true }),
    retrye: () => start({ only: { ...DB.emist[d.k], mode: "gap" } }),
});
document.getElementById("app").addEventListener("input", (e) => {
    if (e.target.id !== "essay") return;
    const t = e.target.value; DB.drafts[S.eq.id] = t; clearTimeout(S.dt); S.dt = setTimeout(save, 500);
    document.getElementById("wcount").textContent = `${wc(t)} words · draft saves automatically`;
});

const essayTab = (el) => !el.length ? `<div class="mlist pad"><p class="micro">No essay words yet. Write an essay and every misspelled word will land here.</p></div>`
    : `<div class="row shuf"><button class="btn lime" data-act="pracess">Practise all ${el.length} ${ico("redo", 18)}</button></div><div class="mlist">${el.map(([k, m]) => `<div class="mrow"><div><s>${esc(m.wrong)}</s><b>${esc(m.text)}</b><span class="micro">${esc(TOPICS[m.topic] || "")} · from your essay</span></div><div><b class="sm">${esc(m.sentence)}</b></div><button class="link" data-act="retrye" data-k="${esc(k)}">${ico("redo", 16)} Retry</button></div>`).join("")}</div>`;