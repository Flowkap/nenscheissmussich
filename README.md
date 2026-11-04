# 'Nen Scheiss muss ich!

**→ [nenscheissmussi.ch](https://nenscheissmussi.ch)**

Pink unicorns lounging on bitten sprinkle donuts, drifting on the waves. Nothing else.

Whenever you feel like you just have to tell someone "Nope, not doing that" — this is the page
to send them.

The picture is based upon a drawing of [Flowkap](https://flowkap.dev)
([original](graphics/original/original.png)). The page and the vector graphics were built
together with [Claude Code](https://claude.com/claude-code).

## How it works

- Plain static HTML, CSS and a bit of JavaScript in `index.html`. No build step, no Jekyll
  (`.nojekyll`), no CI.
- On every page load a small script scatters the waves and places 5–7 unicorns of mixed sizes
  so that they never overlap each other, the lettering or the footer. Each unicorn bobs, tilts and
  drifts at its own pace. Visitors who prefer reduced motion get a still page.
- The ✎ button builds a link with your own text in the URL hash, e.g.
  `nenscheissmussi.ch/#Die%20Steuererkl%C3%A4rung%20machen`. Whoever opens it sees that text in the
  lettering style for five seconds; then the letters swirl around the screen, turn into the letters
  of "'Nen Scheiss muss ich!" on the way and settle into it. Surplus letters vanish in the swirl,
  missing ones appear from it. Up to 80 characters: letters A–Z, Ä, Ö, Ü, ẞ, digits and common
  punctuation; anything else is dropped. With reduced motion the text simply fades over.
- Installable as a web app (PWA): `manifest.webmanifest` plus a network-first service worker
  (`sw.js`) that only serves from cache when offline.

## Structure

```
index.html              the page
letters.js              glyphs, layout and swirl for a custom text from the URL hash
manifest.webmanifest    web app manifest
sw.js                   service worker
CNAME                   custom domain for GitHub Pages
graphics/
  unicorn/              unicorn on its donut float
  lettering/            "'NEN SCHEISS MUSS ICH!" in one line and stacked for portrait screens
  background/           static wave background (not used by the page, which draws its own waves)
  icon/                 favicon and app icons (unicorn head)
  original/             photo of the hand-drawn original
```

## Deployment

GitHub Pages serves the `main` branch from the repository root. Every push to `main` is live at
[nenscheissmussi.ch](https://nenscheissmussi.ch) after about a minute.

## Local preview

Open `index.html` directly in a browser. The service worker only registers when the page is served
over HTTP, for example:

```sh
python3 -m http.server 8000
```

## License

[Coffeeware](LICENSE), for everything in this repository. Use it as you like — if you like it,
buy Flowkap a coffee ☕
