// "Nach Feenzauber": the night sky with stars, glints and fireflies, a few fairies trailing dust,
// shooting stars, fairy dust behind the pointer and a burst of sparkles when the night begins.
// Everything runs only while the html element carries data-theme="night".
(() => {
  const root = document.documentElement;
  const sky = document.getElementById("night-sky");
  const dust = document.getElementById("fairy-dust");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const DUST_COLOURS = ["#fff6c2", "#ffe58a", "#ffb3e6", "#b9d3ff", "#d9c8ff"];
  const GLOW_COLOURS = ["#ffe58a", "#ffb3e6", "#b9d3ff", "#c9b5ff"];
  const WING_COLOURS = [["#bfe3ff", "#ffd1f0"], ["#ffd1f0", "#e2d4ff"], ["#d6ffe9", "#bfe3ff"]];
  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  const isNight = () => root.dataset.theme === "night";

  function element(tag, className, css) {
    const el = document.createElement(tag);
    el.className = className;
    if (css) el.style.cssText = css;
    return el;
  }

  // one particle of fairy dust that drifts down, fades and removes itself
  const MAX_DUST = 160;
  function sprinkle(x, y, spread = 6, fall = 40) {
    if (dust.childElementCount >= MAX_DUST) return;
    const size = 2 + Math.random() * 4;
    const star = Math.random() < 0.3;
    const p = element("span", star ? "dust dust-star" : "dust",
      `left:${x + (Math.random() - 0.5) * spread}px;top:${y + (Math.random() - 0.5) * spread}px;` +
      `--s:${(star ? size * 2.2 : size).toFixed(1)}px;--c:${pick(DUST_COLOURS)};` +
      `--dx:${((Math.random() - 0.5) * 30).toFixed(0)}px;--dy:${(fall * (0.5 + Math.random())).toFixed(0)}px;` +
      `--life:${(0.9 + Math.random() * 0.9).toFixed(2)}s`);
    p.addEventListener("animationend", () => p.remove());
    dust.append(p);
  }

  // stars, glints and fireflies are laid out once per size, the CSS keeps them twinkling
  function drawSky() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const area = width * height;
    const nodes = [];
    for (let i = 0, n = Math.round(Math.min(140, Math.max(50, area / 12000))); i < n; i++) {
      nodes.push(element("span", "star",
        `left:${(Math.random() * 100).toFixed(2)}%;top:${(Math.random() * 100).toFixed(2)}%;` +
        `--s:${(1 + Math.random() * 1.8).toFixed(1)}px;--t:${(2 + Math.random() * 5).toFixed(1)}s;` +
        `--delay:-${(Math.random() * 7).toFixed(1)}s`));
    }
    for (let i = 0, n = Math.round(Math.min(36, Math.max(14, area / 40000))); i < n; i++) {
      nodes.push(element("span", "glint",
        `left:${(Math.random() * 100).toFixed(2)}%;top:${(Math.random() * 100).toFixed(2)}%;` +
        `--s:${(10 + Math.random() * 16).toFixed(0)}px;--c:${pick(["#fff6c2", "#ffffff", "#ffd1f0"])};` +
        `--t:${(3 + Math.random() * 4).toFixed(1)}s;--delay:-${(Math.random() * 7).toFixed(1)}s`));
    }
    for (let i = 0, n = Math.round(Math.min(50, Math.max(20, area / 35000))); i < n; i++) {
      nodes.push(element("span", "firefly",
        `left:${(Math.random() * 100).toFixed(2)}%;top:${(Math.random() * 100).toFixed(2)}%;` +
        `--s:${(2 + Math.random() * 4).toFixed(1)}px;--c:${pick(GLOW_COLOURS)};` +
        `--t:${(2.5 + Math.random() * 4).toFixed(1)}s;--f:${(6 + Math.random() * 8).toFixed(1)}s;` +
        `--delay:-${(Math.random() * 8).toFixed(1)}s;` +
        `--fx:${((Math.random() - 0.5) * 60).toFixed(0)}px;--fy:${((Math.random() - 0.5) * 60).toFixed(0)}px`));
    }
    sky.replaceChildren(...nodes);
  }

  // a fairy: glowing body, head and two pairs of flapping wings
  function fairyNode() {
    const [upper, lower] = pick(WING_COLOURS);
    const el = element("div", "fairy");
    el.innerHTML = `<svg viewBox="-20 -20 40 40" aria-hidden="true">
      <g class="wing">
        <ellipse cx="-8" cy="-6" rx="9" ry="5.5" transform="rotate(-30 -8 -6)" fill="${upper}"/>
        <ellipse cx="-6" cy="3" rx="6" ry="3.5" transform="rotate(25 -6 3)" fill="${lower}"/>
        <ellipse cx="8" cy="-6" rx="9" ry="5.5" transform="rotate(30 8 -6)" fill="${upper}"/>
        <ellipse cx="6" cy="3" rx="6" ry="3.5" transform="rotate(-25 6 3)" fill="${lower}"/>
      </g>
      <path d="M0 -3 C3 -3 4 6 3 10 L-3 10 C-4 6 -3 -3 0 -3 Z" fill="#fff6c2"/>
      <circle cx="0" cy="-7" r="3.4" fill="#ffffff"/>
    </svg>`;
    return el;
  }

  // each fairy wanders on a sum of slow sines, so paths loop without ever repeating exactly
  let fairies = [];
  function createFairies() {
    const count = window.innerWidth * window.innerHeight < 500000 ? 2 : 3;
    fairies.forEach((f) => f.el.remove());
    fairies = Array.from({ length: count }, () => {
      const el = fairyNode();
      dust.before(el);
      const r = () => 0.00008 + Math.random() * 0.00014;
      return {
        el, fx: [r(), r() * 2.3], fy: [r(), r() * 1.9],
        px: [Math.random() * 7, Math.random() * 7], py: [Math.random() * 7, Math.random() * 7],
        size: 30 + Math.random() * 14, lastX: 0, nextDust: 0,
      };
    });
  }

  function placeFairies(now) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    for (const f of fairies) {
      const nx = 0.5 + 0.32 * Math.sin(now * f.fx[0] + f.px[0]) + 0.13 * Math.sin(now * f.fx[1] + f.px[1]);
      const ny = 0.5 + 0.3 * Math.sin(now * f.fy[0] + f.py[0]) + 0.12 * Math.cos(now * f.fy[1] + f.py[1]);
      const x = nx * width;
      const y = ny * height;
      const facing = x < f.lastX ? -1 : 1;
      f.lastX = x;
      f.el.style.width = `${f.size}px`;
      f.el.style.transform = `translate(${(x - f.size / 2).toFixed(1)}px, ${(y - f.size / 2).toFixed(1)}px) scaleX(${facing})`;
      if (now >= f.nextDust) {
        sprinkle(x, y + f.size * 0.25, 4, 30);
        f.nextDust = now + 70 + Math.random() * 90;
      }
    }
  }

  let frame = 0;
  const tick = (now) => {
    placeFairies(now);
    frame = requestAnimationFrame(tick);
  };

  let shootingTimer = 0;
  function shootingStar() {
    const width = window.innerWidth;
    const fromLeft = Math.random() < 0.5;
    const s = element("span", "shooting-star",
      `left:${(fromLeft ? 0.05 + Math.random() * 0.4 : 0.55 + Math.random() * 0.4) * width}px;` +
      `top:${(0.04 + Math.random() * 0.3) * window.innerHeight}px;` +
      `--angle:${fromLeft ? 20 + Math.random() * 15 : 145 + Math.random() * 15}deg;` +
      `--len:${(0.25 + Math.random() * 0.2) * width}px`);
    s.addEventListener("animationend", () => s.remove());
    sky.append(s);
    shootingTimer = setTimeout(shootingStar, 5000 + Math.random() * 9000);
  }

  let lastTrail = 0;
  function trail(event) {
    if (event.timeStamp - lastTrail < 24) return;
    lastTrail = event.timeStamp;
    sprinkle(event.clientX, event.clientY, 10, 50);
  }

  function burst(x, y) {
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 20 + Math.random() * 120;
      sprinkle(x + Math.cos(angle) * distance, y + Math.sin(angle) * distance, 8, 80);
    }
  }

  let running = false;
  function start() {
    if (running) return;
    running = true;
    drawSky();
    if (reduced.matches) return;
    createFairies();
    frame = requestAnimationFrame(tick);
    shootingTimer = setTimeout(shootingStar, 1500);
    window.addEventListener("pointermove", trail, { passive: true });
  }
  function stop() {
    if (!running) return;
    running = false;
    cancelAnimationFrame(frame);
    clearTimeout(shootingTimer);
    window.removeEventListener("pointermove", trail);
    fairies.forEach((f) => f.el.remove());
    fairies = [];
    sky.replaceChildren();
    dust.replaceChildren();
  }

  new MutationObserver(() => {
    if (!isNight()) return stop();
    const wasRunning = running;
    start();
    if (!wasRunning && !reduced.matches) {
      const button = document.getElementById("theme-toggle").getBoundingClientRect();
      burst(button.left + button.width / 2, button.top + button.height / 2);
    }
  }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });

  let pending;
  window.addEventListener("resize", () => {
    clearTimeout(pending);
    pending = setTimeout(() => {
      if (!running) return;
      drawSky();
      if (!reduced.matches) createFairies();
    }, 150);
  });

  if (isNight()) start();
})();
