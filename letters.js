// Custom text from the URL hash, drawn in the lettering style. After a short pause the letters
// swirl around the middle of the screen, turn into the letters of "'Nen Scheiss muss ich!"
// on the way and settle into it.
(() => {
  // [width, path] on a cap height of 120 units, drawn as a dark round stroke with a coloured one
  // on top; same construction as graphics/lettering/lettering.svg
  const GLYPHS = {
    "A": [72, "M0 120 L36 0 L72 120 M14 78 H58"],
    "B": [64, "M0 60 H32 C66 60 66 0 32 0 H0 V120 H36 C72 120 72 60 36 60"],
    "C": [68, "M68 22 C52 -6 0 -4 0 60 C0 124 52 126 68 98"],
    "D": [70, "M0 0 H22 C86 0 86 120 22 120 H0 Z"],
    "E": [60, "M60 0 H0 V120 H60 M0 60 H50"],
    "F": [60, "M60 0 H0 V120 M0 60 H50"],
    "G": [68, "M68 22 C52 -6 0 -4 0 60 C0 124 52 126 68 98 V68 H40"],
    "H": [64, "M0 0 V120 M64 0 V120 M0 60 H64"],
    "I": [0, "M0 0 V120"],
    "J": [52, "M52 0 V82 C52 130 2 130 0 94"],
    "K": [64, "M0 0 V120 M62 0 L0 74 M24 48 L64 120"],
    "L": [58, "M0 0 V120 H58"],
    "M": [84, "M0 120 V0 L42 84 L84 0 V120"],
    "N": [70, "M0 120 V0 L70 120 V0"],
    "O": [74, "M37 0 C-12 0 -12 120 37 120 C86 120 86 0 37 0 Z"],
    "P": [62, "M0 120 V0 H30 C72 0 72 66 30 66 H0"],
    "Q": [78, "M37 0 C-12 0 -12 120 37 120 C86 120 86 0 37 0 Z M46 86 L78 124"],
    "R": [64, "M0 120 V0 H30 C72 0 72 66 30 66 H0 M30 66 L64 120"],
    "S": [64, "M62 20 C52 0 6 -4 4 28 C2 58 64 54 64 88 C64 124 10 126 0 100"],
    "T": [72, "M0 0 H72 M36 0 V120"],
    "U": [66, "M0 0 V80 C0 130 66 130 66 80 V0"],
    "V": [72, "M0 0 L36 120 L72 0"],
    "W": [108, "M0 0 L26 120 L54 34 L82 120 L108 0"],
    "X": [68, "M0 0 L68 120 M68 0 L0 120"],
    "Y": [70, "M0 0 L35 60 L70 0 M35 60 V120"],
    "Z": [66, "M2 0 H66 L0 120 H66"],
    "Ä": [72, "M0 120 L36 0 L72 120 M14 78 H58 M12 -42 V-40 M60 -42 V-40"],
    "Ö": [74, "M37 0 C-12 0 -12 120 37 120 C86 120 86 0 37 0 Z M20 -42 V-40 M54 -42 V-40"],
    "Ü": [66, "M0 0 V80 C0 130 66 130 66 80 V0 M16 -42 V-40 M50 -42 V-40"],
    "ẞ": [66, "M0 120 V34 C0 -10 62 -12 62 24 L32 54 C78 52 80 120 30 120"],
    "0": [66, "M33 0 C-10 0 -10 120 33 120 C76 120 76 0 33 0 Z"],
    "1": [36, "M0 26 L36 0 V120"],
    "2": [64, "M2 28 C8 -6 62 -8 62 32 C62 66 0 88 0 120 H64"],
    "3": [64, "M2 16 C18 -6 62 -2 62 30 C62 54 40 60 26 60 C44 60 66 66 66 92 C66 128 14 128 0 104"],
    "4": [70, "M50 120 V0 L0 84 H70"],
    "5": [64, "M60 0 H8 L4 54 C30 40 66 46 66 84 C66 126 14 128 0 104"],
    "6": [66, "M58 8 C20 -8 0 26 0 72 C0 132 66 132 66 84 C66 40 8 38 0 74"],
    "7": [64, "M0 0 H64 L20 120"],
    "8": [66, "M33 60 C0 60 4 0 33 0 C62 0 66 60 33 60 C-4 60 -2 120 33 120 C68 120 70 60 33 60 Z"],
    "9": [66, "M66 48 C58 82 0 80 0 40 C0 -12 66 -12 66 48 C66 92 46 126 8 112"],
    ".": [0, "M0 118 V120"],
    ",": [8, "M8 114 L0 136"],
    "!": [0, "M0 0 V80 M0 118 V120"],
    "?": [60, "M0 26 C4 -8 60 -8 60 26 C60 54 30 54 30 82 M30 118 V120"],
    "'": [0, "M0 -4 V24"],
    "\"": [28, "M0 -4 V24 M28 -4 V24"],
    "-": [42, "M0 64 H42"],
    ":": [0, "M0 46 V48 M0 118 V120"],
    ";": [8, "M8 46 V48 M8 114 L0 136"],
    "(": [26, "M26 -8 C-8 26 -8 94 26 128"],
    ")": [26, "M0 -8 C34 26 34 94 0 128"],
    "/": [50, "M50 -6 L0 126"],
    "&": [72, "M72 120 L12 42 C-4 14 14 -4 32 0 C54 4 54 34 28 52 C-4 74 2 120 36 120 C56 120 66 104 70 82"],
    "+": [60, "M0 60 H60 M30 30 V90"],
    "=": [56, "M0 44 H56 M0 80 H56"],
    "*": [56, "M28 26 V94 M0 42 L56 78 M56 42 L0 78"],
    "#": [66, "M24 6 L14 114 M56 6 L46 114 M4 42 H66 M0 78 H62"],
    "%": [66, "M0 120 L66 0 M6 10 V22 M60 98 V110"],
    "€": [72, "M72 16 C56 -6 12 -4 12 60 C12 124 56 126 72 104 M0 46 H50 M0 74 H46"],
  };
  // typographic variants that have no glyph of their own
  const ALIASES = {
    "„": "\"", "“": "\"", "”": "\"", "«": "\"", "»": "\"", "‚": "'", "‘": "'", "’": "'", "`": "'",
    "´": "'", "–": "-", "—": "-", "…": "...", "ß": "ẞ",
  };
  const COLORS = ["#2fb35a", "#f39a2b", "#f2d43a"];
  const OUTLINE = "#2b1d26";
  const GAP = 52; // between two letters of a word
  const WORD_GAP = 122; // between two words
  const LINE_PITCH = 190;
  const STROKE = 36;
  // umlaut dots reach this far above the cap height
  const ACCENT = 60;
  const TARGET = "'Nen Scheiss muss ich!";
  const TARGET_LINES = { landscape: ["'NEN SCHEISS MUSS ICH!"], portrait: ["'NEN SCHEISS", "MUSS ICH!"] };
  // a short sentence, not an essay
  const MAX_LENGTH = 80;
  const HOLD = 5000;

  // the glyphs a character turns into, possibly none
  function glyphsOf(char) {
    if (/\s/.test(char)) return [" "];
    const alias = ALIASES[char];
    if (alias) return [...alias];
    const upper = char.toUpperCase();
    if (GLYPHS[upper]) return [upper];
    // é → E and so on; Ä, Ö, Ü have glyphs of their own and never get here
    const base = upper.normalize("NFD").replace(/\p{M}/gu, "");
    return [...base].every((c) => GLYPHS[c]) ? [...base] : [];
  }

  // what the text keeps once unsupported characters are dropped: the original spelling, for the URL
  function tidy(text) {
    let kept = "";
    for (const char of text.normalize("NFC")) {
      if (glyphsOf(char).length) kept += /\s/.test(char) ? " " : char;
    }
    return kept.replace(/ +/g, " ").trim().slice(0, MAX_LENGTH).trim();
  }

  function words(text) {
    return [...tidy(text)].flatMap(glyphsOf).join("").split(" ").filter(Boolean).map((w) => [...w]);
  }

  const wordWidth = (word) => word.reduce((sum, c) => sum + GLYPHS[c][0], 0) + GAP * (word.length - 1);
  const lineWidth = (line) => line.reduce((sum, w) => sum + wordWidth(w), 0) + WORD_GAP * (line.length - 1);

  // greedy wrap at `limit` units; a word wider than the limit is broken when `split` is set
  function wrap(list, limit, split) {
    const lines = [];
    let line = [];
    const flush = () => { if (line.length) lines.push(line); line = []; };
    for (const word of list) {
      if (split && wordWidth(word) > limit) {
        flush();
        // pieces of about equal length instead of full lines and a short rest
        const size = Math.ceil(word.length / Math.ceil(wordWidth(word) / limit));
        for (let i = 0; i < word.length; i += size) lines.push([word.slice(i, i + size)]);
        line = [lines.pop()[0]];
      } else if (line.length && lineWidth([...line, word]) > limit) {
        flush();
        line = [word];
      } else {
        line.push(word);
      }
    }
    flush();
    return lines;
  }

  const blockHeight = (count) => (count - 1) * LINE_PITCH + 120 + STROKE + ACCENT;
  const scaleFor = (lines, width, height) =>
    Math.min(width / (Math.max(...lines.map(lineWidth)) + STROKE), height / blockHeight(lines.length));

  // the line breaks that let the text grow largest inside width × height
  function fit(list, width, height) {
    const longest = Math.max(...list.map(wordWidth));
    const total = lineWidth(list);
    let best = null;
    let bestScale = 0;
    // fewest lines for every limit between the longest word and the whole text on one line
    for (let count = 1; count <= list.length; count++) {
      let low = longest;
      let high = Math.max(longest, total);
      while (high - low > 1) {
        const mid = (low + high) / 2;
        if (wrap(list, mid, false).length <= count) high = mid; else low = mid;
      }
      const lines = wrap(list, high, false);
      const scale = scaleFor(lines, width, height);
      if (scale > bestScale) { bestScale = scale; best = lines; }
    }
    // breaking a word only pays off for very long words
    for (let count = 2; count <= 40; count++) {
      const lines = wrap(list, total / count, true);
      const scale = scaleFor(lines, width, height);
      if (scale > bestScale * 1.5) { bestScale = scale; best = lines; }
    }
    return { lines: best, scale: bestScale };
  }

  // centre point, scale and character of every glyph, in px
  function place(lines, scale, cx, cy) {
    const glyphs = [];
    const top = cy - ((lines.length - 1) * LINE_PITCH + 120) * scale / 2;
    lines.forEach((line, row) => {
      let x = cx - lineWidth(line) * scale / 2;
      const y = top + (row * LINE_PITCH + 60) * scale;
      line.forEach((word, i) => {
        if (i) x += WORD_GAP * scale;
        word.forEach((c, j) => {
          if (j) x += GAP * scale;
          const w = GLYPHS[c][0];
          glyphs.push({ char: c, x: x + w * scale / 2, y, scale });
          x += w * scale;
        });
      });
    });
    return glyphs;
  }

  // the final lettering at the size and position of the static one, and the custom text in a
  // larger box around it, never drawn larger than the final lettering
  function layouts(text, width, height) {
    const portrait = height > width;
    const cx = width / 2;
    const cy = height * (portrait ? 0.46 : 0.47);
    const targetLines = TARGET_LINES[portrait ? "portrait" : "landscape"]
      .map((line) => line.split(" ").map((w) => [...w]));
    const targetScale = Math.min(portrait ? width * 0.88 : Math.min(width * 0.92, 1400), width) /
      (Math.max(...targetLines.map(lineWidth)) + STROKE);
    const list = words(text);
    const source = fit(list, width * (portrait ? 0.88 : 0.92), height * 0.7);
    return {
      source: place(source.lines, Math.min(source.scale, targetScale), cx, cy),
      target: place(targetLines, targetScale, cx, cy),
      centre: { x: cx, y: cy },
    };
  }

  // seeded so a resize keeps the choreography
  const seeded = (seed) => () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  // every source letter gets a target; same letters find each other first, the rest at random;
  // left over sources vanish in the swirl, left over targets appear from it
  function pair(source, target, random) {
    const order = (list) => list.map((item, i) => [random(), i, item]).sort((a, b) => a[0] - b[0]).map((e) => e[2]);
    const free = new Set(target);
    const pairs = [];
    const rest = [];
    for (const from of order(source)) {
      const same = order([...free]).find((to) => to.char === from.char);
      if (same) { free.delete(same); pairs.push({ from, to: same }); } else rest.push(from);
    }
    const remaining = order([...free]);
    for (const from of rest) {
      const to = remaining.pop();
      pairs.push(to ? { from, to } : { from, to: null });
    }
    for (const to of remaining) pairs.push({ from: null, to });
    return pairs;
  }

  if (typeof document === "undefined") {
    globalThis.Letters = { GLYPHS, glyphsOf, tidy, words, fit, layouts, pair, seeded, wrap, MAX_LENGTH };
    return;
  }

  const SVG_NS = "http://www.w3.org/2000/svg";
  const svg = document.getElementById("letters");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  function glyph(char, colour) {
    const [w, d] = GLYPHS[char];
    const g = document.createElementNS(SVG_NS, "g");
    g.setAttribute("transform", `translate(${-w / 2} -60)`);
    for (const [stroke, width] of [[OUTLINE, STROKE], [colour, 22]]) {
      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("d", d);
      path.setAttribute("stroke", stroke);
      path.setAttribute("stroke-width", width);
      g.append(path);
    }
    return g;
  }

  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
  const smooth = (a, b, t) => {
    const x = Math.min(1, Math.max(0, (t - a) / (b - a)));
    return x * x * (3 - 2 * x);
  };
  const lerp = (a, b, t) => a + (b - a) * t;
  const TAU = Math.PI * 2;

  let run = 0;
  let state = null;

  function play(text) {
    const id = ++run;
    const seed = Math.floor(Math.random() * 4294967296);
    state = { text, seed, phase: "hold", id };
    document.documentElement.classList.add("custom");
    document.documentElement.classList.remove("settled");
    svg.removeAttribute("aria-hidden");
    svg.setAttribute("aria-label", tidy(text));
    render();
    state.timer = setTimeout(() => {
      if (run !== id) return;
      state.phase = "swirl";
      state.start = performance.now();
      svg.setAttribute("aria-label", TARGET);
      render();
    }, HOLD);
  }

  function stop() {
    run++;
    if (state) clearTimeout(state.timer);
    state = null;
    document.documentElement.classList.remove("custom", "settled");
    svg.setAttribute("aria-hidden", "true");
    svg.replaceChildren();
  }

  // builds the letters for the current phase and viewport, and drives the swirl
  function render() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    const { source, target, centre } = layouts(state.text, width, height);
    const sway = document.createElementNS(SVG_NS, "g");
    sway.setAttribute("class", "sway");
    svg.replaceChildren(sway);

    const still = (list, opacity = 1) => {
      const group = document.createElementNS(SVG_NS, "g");
      group.style.opacity = opacity;
      list.forEach((g, i) => {
        const el = glyph(g.char, COLORS[i % 3]);
        el.setAttribute("transform", `translate(${g.x} ${g.y}) scale(${g.scale}) ${el.getAttribute("transform")}`);
        group.append(el);
      });
      sway.append(group);
      return group;
    };

    if (state.phase === "hold") { still(source); return; }
    if (state.phase === "done") {
      still(target);
      // the unicorns only float in once the lettering has settled
      document.documentElement.classList.add("settled");
      return;
    }

    const id = state.id;
    if (reduced.matches) {
      const from = still(source);
      const to = still(target, 0);
      const step = (now) => {
        if (run !== id) return;
        const t = Math.min(1, (now - state.start) / 1200);
        from.style.opacity = 1 - t;
        to.style.opacity = t;
        if (t < 1) requestAnimationFrame(step); else { state.phase = "done"; render(); }
      };
      requestAnimationFrame(step);
      return;
    }

    const random = seeded(state.seed);
    // positions relative to the centre, scaled so the swirl fills the screen as an ellipse
    const rx = width / 2;
    const ry = height / 2;
    const polar = (p) => {
      const u = (p.x - centre.x) / rx;
      const v = (p.y - centre.y) / ry;
      return { r: Math.hypot(u, v), a: Math.atan2(v, u) };
    };
    const somewhere = () => ({ x: centre.x + Math.cos(random() * TAU) * rx * (0.5 + random() * 0.4),
      y: centre.y + Math.sin(random() * TAU) * ry * (0.5 + random() * 0.4), scale: 0 });
    const colourOf = new Map(target.map((g, i) => [g, COLORS[i % 3]]));
    const sourceColour = new Map(source.map((g, i) => [g, COLORS[i % 3]]));

    const letters = pair(source, target, random).map(({ from, to }) => {
      const el = document.createElementNS(SVG_NS, "g");
      const a = from && glyph(from.char, sourceColour.get(from));
      const b = to && (!from || to.char !== from.char || colourOf.get(to) !== sourceColour.get(from))
        ? glyph(to.char, colourOf.get(to)) : null;
      if (a) el.append(a);
      if (b) el.append(b);
      sway.append(el);
      const start = from || { ...somewhere() };
      const end = to || { ...somewhere() };
      const p0 = polar(start);
      const p1 = polar(end);
      const turns = 1 + Math.floor(random() * 2);
      return {
        el, a, b, from, to, start, end, p0,
        sweep: ((p1.a - p0.a) % TAU + TAU) % TAU + TAU * turns,
        r1: p1.r,
        bulge: 0.15 + random() * 0.35,
        spin: 360 * (1 + Math.floor(random() * 2)),
        delay: random() * 600,
        duration: 3000 + random() * 900,
      };
    });
    const last = Math.max(...letters.map((l) => l.delay + l.duration));

    const step = (now) => {
      if (run !== id) return;
      const elapsed = now - state.start;
      for (const l of letters) {
        const t = Math.min(1, Math.max(0, (elapsed - l.delay) / l.duration));
        const e = ease(t);
        // the swirl bulges outwards, but not off the screen; start and end stay exact
        const base = lerp(l.p0.r, l.r1, e);
        const r = base + Math.min(l.bulge * Math.sin(Math.PI * t), Math.max(0, 0.85 - base));
        const angle = l.p0.a + l.sweep * e;
        const x = centre.x + Math.cos(angle) * r * rx;
        const y = centre.y + Math.sin(angle) * r * ry;
        const scale = lerp(l.start.scale, l.end.scale, e) * (1 - 0.3 * Math.sin(Math.PI * t));
        l.el.setAttribute("transform", `translate(${x} ${y}) rotate(${l.spin * e}) scale(${scale})`);
        if (l.a && l.b) {
          const mix = smooth(0.44, 0.56, t);
          l.a.style.opacity = 1 - mix;
          l.b.style.opacity = mix;
        }
        if (!l.to) l.el.style.opacity = 1 - smooth(0.5, 0.9, t);
        if (!l.from) l.el.style.opacity = smooth(0.1, 0.5, t);
      }
      if (elapsed < last) requestAnimationFrame(step); else { state.phase = "done"; render(); }
    };
    requestAnimationFrame(step);
  }

  function fromHash() {
    let text = "";
    try {
      text = tidy(decodeURIComponent(location.hash.slice(1)));
    } catch {
      // a malformed escape: show the page as usual
    }
    if (text) play(text); else stop();
  }

  let pending;
  window.addEventListener("resize", () => {
    clearTimeout(pending);
    pending = setTimeout(() => {
      if (!state) return;
      // a swirl laid out for the old size would end in the wrong place
      if (state.phase === "swirl") { run++; state.id = run; state.phase = "done"; }
      render();
    }, 150);
  });
  window.addEventListener("hashchange", fromHash);
  fromHash();

  // the dialog that builds the link
  const dialog = document.getElementById("compose");
  const input = document.getElementById("compose-text");
  const left = document.getElementById("compose-left");
  const share = document.getElementById("compose-share");
  const view = document.getElementById("compose-view");
  input.maxLength = MAX_LENGTH;
  const link = () => `${location.origin}${location.pathname}#${encodeURIComponent(tidy(input.value))}`;
  const update = () => {
    const empty = !tidy(input.value);
    share.disabled = empty;
    view.disabled = empty;
    left.textContent = `noch ${MAX_LENGTH - input.value.length} Zeichen`;
    share.textContent = "Link teilen";
  };
  input.addEventListener("input", update);
  document.getElementById("compose-open").addEventListener("click", () => {
    update();
    dialog.showModal();
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  share.addEventListener("click", async () => {
    const url = link();
    if (navigator.share) {
      try { await navigator.share({ url }); } catch { /* cancelled */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      share.textContent = "Kopiert!";
    } catch {
      window.prompt("Link kopieren:", url);
    }
  });
  document.getElementById("compose-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (view.disabled) return;
    dialog.close();
    const hash = `#${encodeURIComponent(tidy(input.value))}`;
    if (location.hash === hash) fromHash(); else location.hash = hash;
  });
})();
