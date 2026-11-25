/* ============================================================
   app.js — Quiz UI logic
   Depends on: data.js (RAW, T)
   ============================================================ */

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const pair = x => { const a = x.split("//"); return [a[0], a[1] ?? a[0]]; };

/* Build structured data from RAW */
const D = RAW.map(([id, en, fr, s]) => ({
  id,
  n: { en, fr },
  q: s.split("\n").map((l, j) => {
    const p = l.split("|");
    const o = p.slice(2).map(pair);
    return {
      k: id + j,
      q: { en: p[0], fr: p[1] },
      o,
      ord: o.map((_, i) => i).sort(() => Math.random() - .5),
    };
  }),
}));

const Q = D.flatMap(s => s.q);
const scoreMessages = [
  "bhim w mnayek w mafkich dwe",
  "mzlt 7altk mnayka",
  "cv 9rib twali rajel",
  "aya 5rit fih nikni ken l9it 5edma",
];

/* ── State ──────────────────────────────────────────────────────────────── */
let S = {}, cur = "all", lang = "en";
try {
  S = JSON.parse(localStorage.getItem("csq2") || "{}");
  lang = localStorage.getItem("csl") || ((navigator.language || "").slice(0, 2) === "fr" ? "fr" : "en");
} catch (e) {}

const save = () => {
  try {
    localStorage.setItem("csq2", JSON.stringify(S));
    localStorage.setItem("csl", lang);
  } catch (e) {}
};

/* ── Rendering ──────────────────────────────────────────────────────────── */
function paint(li) {
  const a = S[li.dataset.k];
  if (a === undefined) return;
  li.querySelectorAll(".opt").forEach(b => {
    const i = +b.dataset.i;
    b.disabled = true;
    b.classList.toggle("ok", i === 0);
    b.classList.toggle("bad", i === a && a !== 0);
  });
}

function render() {
  const t = T[lang];
  document.documentElement.lang = lang;
  $("h1").innerHTML = t.h;
  $(".lead").innerHTML = t.lead(Q.length);
  $("#rnd").textContent = t.rnd;
  $("#calculate").textContent = t.calculate;
  $("#close-score").textContent = t.close;
  $("#reset").textContent = t.reset;

  $$(".lang button").forEach(b => b.classList.toggle("on", b.dataset.l === lang));

  $("#chips").innerHTML = [["all", t.all], ...D.map(s => [s.id, s.n[lang]])]
    .map(([id, n]) => `<button data-c="${id}"${id === cur ? ' class="on"' : ""}>${n}</button>`)
    .join("");

  $("#main").innerHTML = D.map(s =>
    `<section id="${s.id}"><h2>${s.n[lang]}<small></small></h2><ol>${
      s.q.map(x =>
        `<li data-k="${x.k}"><p>${x.q[lang]}</p><div class="opts">${
          x.ord.map(i => `<button class="opt" data-i="${i}">${x.o[i][lang === "fr" ? 1 : 0]}</button>`).join("")
        }</div></li>`
      ).join("")
    }</ol></section>`
  ).join("");

  $$("li").forEach(paint);
  update();
}

function update() {
  const t = T[lang];
  let ans = 0, ok = 0;

  $$("section").forEach(sec => {
    const all = sec.querySelectorAll("li");
    let c = 0;

    all.forEach(li => {
      const a = S[li.dataset.k];
      if (a !== undefined) { ans++; if (a === 0) { ok++; c++; } }
    });

    sec.hidden = cur !== "all" && cur !== sec.id;
    sec.querySelector("small").textContent = t.d(c, all.length);
  });

  $("#pb").style.width = (ans / Q.length * 100) + "%";
  $("#stat").textContent = t.st(ok, ans, Q.length);

}

/* ── Event listeners ────────────────────────────────────────────────────── */
$("#main").addEventListener("click", e => {
  const b = e.target.closest(".opt");
  if (!b || b.disabled) return;
  const li = b.closest("li");
  S[li.dataset.k] = +b.dataset.i;
  save();
  li.classList.remove("pick");
  paint(li);
  update();
});

$("#chips").addEventListener("click", e => {
  const c = e.target.dataset.c;
  if (!c) return;
  cur = c;
  $$(".chips button").forEach(b => b.classList.toggle("on", b === e.target));
  update();
  scrollTo({ top: 0 });
});

$("#calculate").addEventListener("click", () => {
  let answered = 0, correct = 0;
  Q.forEach(question => {
    const answer = S[question.k];
    if (answer !== undefined) {
      answered++;
      if (answer === 0) correct++;
    }
  });
  if (!answered) {
    $("#feedback-message").textContent = T[lang].noAnswers;
    $("#feedback-score").textContent = "";
    $("#score-dialog").showModal();
    return;
  }

  const score = Math.round(correct / answered * 100);
  const band = Math.min(Math.floor(score / 25), scoreMessages.length - 1);
  $("#feedback-message").textContent = scoreMessages[band];
  $("#feedback-score").textContent = T[lang].score(correct, answered, score);
  $("#score-dialog").showModal();
});

$("#close-score").addEventListener("click", () => {
  S = {};
  cur = "all";
  save();
  $("#score-dialog").close();
  render();
  scrollTo({ top: 0, behavior: "instant" });
});

$(".lang").addEventListener("click", e => {
  const l = e.target.dataset.l;
  if (!l || l === lang) return;
  lang = l;
  save();
  render();
});

$("#rnd").addEventListener("click", () => {
  const pool = $$("li:not([hidden])").filter(li => S[li.dataset.k] === undefined);
  if (!pool.length) return;
  $$("li.pick").forEach(l => l.classList.remove("pick"));
  const li = pool[Math.floor(Math.random() * pool.length)];
  li.classList.add("pick");
  li.scrollIntoView({ block: "center", behavior: "smooth" });
});

$("#reset").addEventListener("click", () => {
  if (confirm(T[lang].conf)) { S = {}; save(); render(); }
});

addEventListener("pointermove", e => {
  $("#mouse").style.transform = `translate(${e.clientX - innerWidth * .07}px,${e.clientY - innerWidth * .07}px)`;
}, { passive: true });

/* ── Init ───────────────────────────────────────────────────────────────── */
render();
