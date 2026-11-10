// ---------- Date ----------

const DATA = {
    surname: ["Hargreaves", "Featherstone", "Whitcombe", "Pemberton", "Wetherby", "Mackenzie", "Cavendish", "Ainsworth", "Thackeray", "Kowalski", "Fitzgerald", "Hoffmann", "Lockhart", "Bannerman", "Wainwright", "Delacroix", "Ravenscroft", "Abernathy", "Sutherland", "Yardley", "Quigley", "Beauchamp", "Papadopoulos", "O'Connell", "Smythe-Jones", "Nguyen", "Kavanagh", "Bletchley"],
    firstname: ["Charlotte", "Rebecca", "Katherine", "Siobhan", "Jonathan", "Matthew", "Stephen", "Zachary", "Isabella", "Gareth", "Bethany", "Nathaniel", "Alexandra", "Christopher", "Yvonne", "Philippa", "Gwendolyn", "Mohammed", "Priya", "Svetlana", "Wojciech", "Joaquin", "Hannah", "Rhiannon", "Geoffrey", "Eleanor"],
    street: ["Hawthorne Road", "Wellington Crescent", "Brookfield Avenue", "Kingsmead Close", "Ravensbourne Gardens", "Whitechapel Lane", "Fairhaven Drive", "Gloucester Terrace", "Thistlewood Way", "Aldersgate Street", "Pickering Walk", "Woodhouse Grove", "Ashbourne Place", "Quayside Road"],
    city: ["Wolverhampton", "Cheltenham", "Loughborough", "Gloucester", "Edinburgh", "Leicester", "Southampton", "Aberystwyth", "Chelmsford", "Bournemouth", "Kidderminster", "Warrington", "Cirencester", "Worcester"],
    email: ["j.hargreaves@gmail.com", "sarah_whitcombe@outlook.com", "m.kowalski92@yahoo.com", "info@brightway.org", "katherine.mackenzie@gmail.com", "t-bannerman77@hotmail.com", "gareth.wetherby@outlook.com", "p.delacroix@gmail.com", "enquiries@oakleigh.co.uk"],
    postcode: ["SW1A 2AA", "M14 5QT", "LS6 3PD", "B33 8TH", "EH12 7XY", "CB2 1TN", "NG7 2RD", "BS8 1TH", "WC2N 5DU", "G12 8QQ", "OX1 3BW", "E14 5AB"],
    custom: [],
};

// Cum se pronunță literele la IELTS (britanic)
const LETTERS = {
    a: "ay", b: "bee", c: "see", d: "dee", e: "ee", f: "eff", g: "jee", h: "aitch", i: "eye", j: "jay",
    k: "kay", l: "el", m: "em", n: "en", o: "oh", p: "pee", q: "queue", r: "ar", s: "ess", t: "tee",
    u: "you", v: "vee", w: "double you", x: "ex", y: "why", z: "zed",
};
const DIGITS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const SYMBOLS = { ".": "dot", "@": "at", "_": "underscore", "-": "dash", "'": "apostrophe" };
const COMMON_DOMAINS = ["gmail", "outlook", "yahoo", "hotmail", "com", "org", "net"];

// ---------- Construirea textului vorbit ----------
function spellToken(ch) {
    const l = ch.toLowerCase();
    if (LETTERS[l]) return LETTERS[l];
    if (/\d/.test(ch)) return DIGITS[+ch];
    return SYMBOLS[ch] || null; // spațiul se ignoră
}

function spellString(str) {
    const useDouble = true;
    const chars = [...str].filter((c) => spellToken(c));
    const out = [];
    for (let i = 0; i < chars.length; ) {
        let run = 1;
        while (useDouble && i + run < chars.length && chars[i + run].toLowerCase() === chars[i].toLowerCase() && /[a-z0-9]/i.test(chars[i])) run++;
        const tok = spellToken(chars[i]);
        if (run === 2) out.push("double " + tok);
        else if (run === 3) out.push("triple " + tok);
        else { for (let k = 0; k < run; k++) out.push(tok); }
        i += run;
    }
    return out.join(", ");
}

function buildSpeech(entry) {
    const { cat, text } = entry;
    if (cat === "email") {
        const [local, domain] = text.split("@");
        const dom = domain.split(".").map((p) => (COMMON_DOMAINS.includes(p.toLowerCase()) ? p : spellString(p))).join(", dot, ");
        return `Email address. ${spellString(local)}, at, ${dom}.`;
    }
    if (cat === "phone") return `Phone number. ${spellString(text).replace(/zero/g, "oh")}.`;
    if (cat === "postcode") return `Postcode. ${spellString(text)}.`;
    if (cat === "street") {
        const [first, ...rest] = text.split(" ");
        return `${text}. ${spellString(first)}. ${rest.join(" ")}.`;
    }
    return `${text}. ${spellString(text)}.`;
}

// ---------- Verificare ----------
function align(target, typed, strict) {
    const eq = (a, b) => (strict ? a === b : a.toLowerCase() === b.toLowerCase());
    const n = target.length, m = typed.length;
    const d = Array.from({ length: n + 1 }, (_, i) => Array(m + 1).fill(0).map((_, j) => (i === 0 ? j : j === 0 ? i : 0)));
    for (let i = 1; i <= n; i++)
        for (let j = 1; j <= m; j++)
            d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (eq(target[i - 1], typed[j - 1]) ? 0 : 1));
    const ops = [];
    let i = n, j = m;
    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + (eq(target[i - 1], typed[j - 1]) ? 0 : 1)) {
            ops.push({ type: eq(target[i - 1], typed[j - 1]) ? "eq" : "sub", c: target[i - 1], t: typed[j - 1] }); i--; j--;
        } else if (i > 0 && d[i][j] === d[i - 1][j] + 1) { ops.push({ type: "del", c: target[i - 1], t: "" }); i--; }
        else { ops.push({ type: "ins", c: "", t: typed[j - 1] }); j--; }
    }
    return ops.reverse();
}

const vis = (ch) => (ch === " " ? "␣" : ch || "·");