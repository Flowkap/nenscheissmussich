// "Enterprise": the pointer drops a trail of meeting invites and office documents that tumble
// down and fade; a unicorn buried under enough of them pukes,
// and now and then a unicorn turns something down the way meetings taught it.
// Runs only while the html element carries data-theme="enterprise".
(() => {
  const root = document.documentElement;
  const layer = document.getElementById("invite-trail");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const LABELS = ["1:1", "Sync", "Jour<br>fixe", "Daily", "Call"];
  const MAX = 40;
  // all of them corporate ways of saying no
  const PHRASES = [
    "Das ist leider nicht in Scope.",
    "Dafür habe ich gerade keine Bandbreite.",
    "Lass uns das ins nächste Quartal schieben.",
    "Das ist aktuell nicht priorisiert.",
    "Mach da mal ein Ticket auf.",
    "Das müssen wir erst mit Legal abstimmen.",
    "Dafür gibt es kein Budget.",
    "Gibt es dafür einen Business Case?",
    "Das ist eher ein Nice-to-have.",
    "Lass uns das offline nehmen.",
    "Das parken wir erstmal.",
    "Schreib mir dazu mal eine Mail.",
    "Da fehlt mir das Mandat.",
    "Das muss erst durchs Steering Committee.",
    "Sind alle Stakeholder abgeholt?",
    "Steht auf der Roadmap. Für 2029.",
    "Ich bin bis Ende Q3 ausgebucht.",
    "Das zahlt nicht auf unsere OKRs ein.",
    "Klingt spannend, aber nicht jetzt.",
    "Da bräuchte ich erstmal ein Konzept.",
  ];
  const DOCS = [["W", "#3b6fc4"], ["X", "#2e8b57"], ["P", "#e0662f"]];
  // landed crumbs a unicorn takes before it pukes; older hits wear off after a few seconds
  const PUKE_AT = 5;
  const FORGET_MS = 6000;
  const hits = new WeakMap();
  const isEnterprise = () => root.dataset.theme === "enterprise";

  function land(x, y) {
    for (const away of document.querySelectorAll(".stage .away")) {
      const r = away.getBoundingClientRect();
      // only the middle of the picture counts, its corners are empty
      if (x < r.left + r.width * 0.25 || x > r.right - r.width * 0.25 ||
          y < r.top + r.height * 0.1 || y > r.bottom - r.height * 0.1) continue;
      const now = performance.now();
      const before = hits.get(away);
      const count = (before ? before.count * Math.exp(-(now - before.at) / FORGET_MS) : 0) + 1;
      if (count >= PUKE_AT) {
        hits.delete(away);
        away.dispatchEvent(new CustomEvent("puke", { bubbles: true }));
      } else {
        hits.set(away, { count, at: now });
      }
      return;
    }
  }

  function drop(x, y) {
    if (layer.childElementCount >= MAX) return;
    // mostly small crumbs, now and then a bigger one that is large enough to read
    const size = 8 + Math.random() ** 1.4 * 28;
    const crumb = document.createElement("span");
    if (Math.random() < 0.6) {
      crumb.className = "crumb invite";
      if (size >= 16) crumb.innerHTML = LABELS[Math.floor(Math.random() * LABELS.length)];
    } else {
      const [letter, colour] = DOCS[Math.floor(Math.random() * DOCS.length)];
      crumb.className = "crumb doc";
      crumb.dataset.letter = letter;
      crumb.style.setProperty("--c", colour);
    }
    const left = x + (Math.random() - 0.5) * 12;
    const top = y + (Math.random() - 0.5) * 12;
    const dx = (Math.random() - 0.5) * 60;
    const dy = 60 + Math.random() * 80;
    crumb.style.cssText +=
      `left:${left.toFixed(1)}px;top:${top.toFixed(1)}px;--s:${size.toFixed(1)}px;` +
      `--dx:${dx.toFixed(0)}px;--dy:${dy.toFixed(0)}px;` +
      `--r:${((Math.random() - 0.5) * 240).toFixed(0)}deg;--life:${(0.9 + Math.random() * 0.6).toFixed(2)}s`;
    crumb.addEventListener("animationend", () => {
      crumb.remove();
      land(left + dx, top + dy);
    });
    layer.append(crumb);
  }

  let last = 0;
  function trail(event) {
    if (event.timeStamp - last < 80) return;
    last = event.timeStamp;
    drop(event.clientX, event.clientY);
  }

  let chatter = 0;
  function say() {
    chatter = setTimeout(say, 5000 + Math.random() * 7000);
    const unicorns = [...document.querySelectorAll(".stage .away")].filter((u) => !u.querySelector(".bubble"));
    if (!unicorns.length) return;
    const unicorn = unicorns[Math.floor(Math.random() * unicorns.length)];
    const bubble = document.createElement("div");
    // the head sits a little left of the middle, right of it when the picture is mirrored
    bubble.className = unicorn.querySelector("img.mirrored") ? "bubble mirrored" : "bubble";
    bubble.textContent = PHRASES[Math.floor(Math.random() * PHRASES.length)];
    bubble.addEventListener("animationend", () => bubble.remove());
    unicorn.append(bubble);
  }

  let running = false;
  function start() {
    if (running) return;
    running = true;
    chatter = setTimeout(say, 3000 + Math.random() * 5000);
    if (!reduced.matches) window.addEventListener("pointermove", trail, { passive: true });
  }
  function stop() {
    if (!running) return;
    running = false;
    clearTimeout(chatter);
    window.removeEventListener("pointermove", trail);
    layer.replaceChildren();
    document.querySelectorAll(".stage .bubble").forEach((b) => b.remove());
  }

  new MutationObserver(() => (isEnterprise() ? start() : stop()))
    .observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  if (isEnterprise()) start();
})();
