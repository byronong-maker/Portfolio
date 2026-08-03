# Byron Ong — Portfolio

Personal portfolio site. Live at <https://byronong-maker.github.io/Portfolio/>

## Repo notes

**GitHub Pages serves the `master` branch**, not `main`. A `main` branch also
exists on the remote and is far behind. Always work on `master`.

```
index.html    single page, all sections
style.css     dark "systems" theme, driven by :root custom properties
script.js     nav, scroll handling, reveal observer, count-up, terminal typing
assets/       images, OG cover, favicon, CV PDF
pages/        real landing pages linked from the Projects section
```

## Sections

Hero → About → Stats → Experience → Skills → Projects → Education → References → Contact

## Things worth knowing before editing

**Theming is centralised.** Colours come from the `:root` block at the top of
`style.css`. The variable *names* are legacy (`--white`, `--bg-light`,
`--text-dark`) but their *values* are dark — they were repointed rather than
renamed so every existing rule inherited the theme. Change the palette there,
not in individual rules.

`--primary-color` is used for backgrounds and borders. Text accents use
`--accent-color` / `--accent-light`. Keep that split — collapsing them makes
text unreadable against the dark cards.

**Scroll reveal has a failsafe.** Sections and cards start at `opacity: 0` and
are revealed by the IntersectionObserver in `script.js`. Two fallbacks stop the
page rendering blank if that never happens:

- the `<noscript>` block in `index.html` (JavaScript disabled)
- a timed CSS animation in `style.css` (JavaScript on, but `script.js` failed
  to load)

If you add a new element that starts hidden, add it to both.

**The navbar carries `!important` rules.** They are load-bearing. `.nav-links a`
also needs `position: relative` for the active-state underline to sit correctly.

## Outstanding

- Video Resume section removed — the embedded Drive file returns 404. Its CSS is
  still in `style.css` so it can be restored once a working link exists.
- Several project cards still use Unsplash stock images rather than real work.
- References list names but no quotes.
