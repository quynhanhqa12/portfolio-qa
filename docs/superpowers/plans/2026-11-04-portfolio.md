# Portfolio Quỳnh Anh — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Static multi-page portfolio built from the Figma design, all content read at runtime from one `data.json` that a non-developer edits on github.com.

**Architecture:** Five HTML pages share one header module and one boot function (`bootPage`) that fetches `data.json`, validates it, renders the header and hands the data to a page renderer. Pure logic (data lookup, URL building, JSON error location, Hanoi clock) lives in `js/core/` and is unit-tested with Node's built-in test runner; DOM rendering lives in `js/ui/` and `js/pages/` and is verified in the browser.

**Tech Stack:** HTML, CSS, vanilla JavaScript ES modules (no framework, no build, no npm dependencies). Node 22 `node --test` for unit tests. `python3 -m http.server` for local preview. Figma MCP for tokens and asset export.

**Spec:** `portfolio-qa/docs/superpowers/specs/2026-11-04-portfolio-design.md` — read it before any task.

## Global Constraints

- Project root: `/Users/ngocsangair/Documents/voice/portfolio-qa/`. All paths below are relative to it.
- Figma file key `gXl7FNrqXRYnto6xjqxxif`. Page nodes: Home `2796:61531`, Works+About `2796:61567`, Contact `2796:61498`, Project detail `2796:61649`.
- Before calling Figma `get_design_context`, load skill `figma:figma-design-to-code`. Figma MCP is flaky ("connection lost"): retry the same call up to 3 times before reporting.
- **Never flatten UI into images.** Text, buttons, menu, the "QA" logo, headings, tags and layout blocks are real HTML/CSS. Only bitmap photos and line illustrations are image files. Small icons (arrows, download icon) are inline SVG.
- No hard-coded content in HTML: every visible string except fixed UI labels (menu "Works/About/Contact", "Resume", "Works"/"About"/"Contact" page titles, "Got a project in mind? Let's talk.", "Let's start your project today. Drop me a line.", "All rights reserved", "Available for work") comes from `data.json`.
- All URLs relative (no leading `/`) — site must work under `https://<user>.github.io/<repo>/`.
- Fonts: Google Fonts if the Figma font exists there; otherwise the closest Google Font with Vietnamese subset, and note the substitution in the task report.
- Colors/sizes come from Figma; define them once as CSS custom properties in `css/base.css` and never repeat raw hex values elsewhere.
- Desktop design width 1920; content max-width per Figma (side margins 200px at 1920); above 1920 center the page. Breakpoints: desktop ≥1280, tablet 481–1279, mobile ≤480.
- Hanoi clock uses time zone `Asia/Ho_Chi_Minh`, format `HH:MM AM` (e.g. `08:32 AM`), updated every minute.
- User-facing error/warning messages are in Vietnamese; site content is English.
- Git: `git init` inside `portfolio-qa/` (not the parent `voice/`). Commit locally after each task; never push (no GitHub account yet).

## Review Focus

1. **Quỳnh Anh breaks `data.json` syntax** (trailing comma, missing quote) → page shows a Vietnamese message with the line number (or without it on Safari, whose error has no position) instead of a blank page. Tests in Task 2.
2. **Image file name wrong, missing, or empty string** → light-grey placeholder box of the same size, layout unchanged. `resolveImage` tests in Task 1; browser check in Task 4.
3. **A project whose `category` is not in `categories`, or two projects with the same `id`** → Vietnamese warning banner; unknown-category project is skipped, for duplicate ids the first wins. `validateData` tests in Task 1.
4. **Site served from a sub-path `/<repo>/`** → every link, image and data fetch still works. `resolveImage` strips leading `/` (Task 1); sub-path browser run in Task 9.
5. **Edit on GitHub not showing because of browser cache** → `loadData` fetches with `cache: 'no-cache'`. Stubbed-fetch test in Task 2.

---

## File Structure

```
portfolio-qa/
  index.html  works.html  about.html  contact.html  project.html
  data.json                 # all content (Quỳnh Anh edits this)
  HUONG-DAN.md              # Vietnamese editing guide
  .nojekyll                 # serve files as-is on GitHub Pages
  images/                   # content images referenced from data.json
  files/cv.pdf              # placeholder CV
  assets/illustrations/     # fixed decorative illustrations from Figma
  css/base.css              # tokens, fonts, reset, header, shared components
  css/home.css works.css about.css contact.css project.css
  js/core/model.js          # data lookup + validation (pure)
  js/core/url.js            # query params + link builders (pure)
  js/core/json-error.js     # JSON parse with error location (pure)
  js/core/clock.js          # Hanoi time formatting (pure)
  js/core/data.js           # loadData(fetch)
  js/ui/shell.js            # bootPage, header, error/warning banners, img helper
  js/pages/home.js works.js about.js contact.js project.js
  tests/*.test.js           # node --test
  package.json              # only {"type":"module","scripts":{"test":"node --test tests/"}}
```

---

### Task 1: Skeleton, sample data, pure data model

**Files:**
- Create: `package.json`, `.nojekyll`, `.gitignore` (`.DS_Store`), `data.json`, `js/core/model.js`, `js/core/url.js`, `tests/model.test.js`, `tests/url.test.js`, `tests/data-file.test.js`

**Interfaces:**
- Produces (`js/core/model.js`):
  - `filterProjects(projects: Project[], categoryId: string|null): Project[]` — `null`, `''`, `'all'` or an id not in the list given → all; preserves order.
  - `normalizeCategory(data, categoryId: string|null): string|null` — returns the id if it exists in `data.categories`, else `null`.
  - `findProject(data, id: string): Project|undefined`
  - `getCategory(data, id: string): {id,name}|undefined`
  - `cardShape(index: number): 'square'|'wide'` — even index `square`, odd `wide` (Figma row: square, wide, square, wide).
  - `formatMeta(project): string` — `"2025 . Viettel Telecom"`.
  - `resolveImage(path: unknown): string|null` — trims; empty/non-string → `null`; strips leading `/` and `./`.
  - `validateData(data): {data: Data, warnings: string[]}` — returns a copy with unknown-category projects removed and duplicate ids (after the first) removed; one Vietnamese warning per problem, naming the project `id`. Also warns if `site`, `categories` or `projects` is missing (substitutes `{}`/`[]`).
- Produces (`js/core/url.js`):
  - `getParam(search: string, name: string): string|null`
  - `worksUrl(categoryId: string|null): string` — `'works.html'` or `'works.html?category=<encoded>'`
  - `projectUrl(id: string): string` — `'project.html?id=<encoded>'`

- [ ] **Step 1: Init repo and config files**

`git init` in `portfolio-qa/`; create `package.json` exactly `{"name":"portfolio-qa","private":true,"type":"module","scripts":{"test":"node --test tests/"}}`, empty `.nojekyll`, `.gitignore`.

- [ ] **Step 2: Write `data.json` sample data**

Schema (field names are final; later tasks rely on them):
- `site`: `name` "Quỳnh Anh", `heroName` "Quynh Anh", `titles` ["Senior Graphic Designer","Visual Artist"], `email` "quynhanh.qa1236@gmail.com", `resume` "files/cv.pdf", `location` "Hanoi, VN", `availableForWork` true, `social` = Behance, Dribbble, Instagram, LinkedIn each with `"url": ""`.
- `home.photo` "images/home-portrait.jpg"; `works.intro` = Figma text "Below are selected projects I have worked on over the past few years, featuring both personal designs and corporate client work. Each project presents a unique challenge, yet they all share a consistent approach: trusting the process while staying creatively flexible. The goal is always to deliver optimal design solutions that fully satisfy the brief and meet the project timeline."
- `about.bio` = Figma text "I am Quỳnh Anh, a Senior Graphic Designer and Visual Artist specializing in brand identity, social media design, print, digital illustration, and creative advertising. I believe every project has its own unique \"personality.\" Whether collaborating with corporate brands or individuals, I adapt flexibly while staying true to my signature style: modern, clean, and spacious. My design highlight is the balance between neat layouts and a playful approach to colors and patterns. Every visual element I choose aims to guide the viewer's emotions, creating striking yet highly accessible designs that help the message connect naturally and memorably."; `about.photo` "images/about-photo.jpg"; `about.services` = the 4 from Figma node `2796:61625` in order Digital Illustration, Brand Identity, Print & Creative Ads, Digital & Social Design, with their Figma descriptions verbatim.
- `categories`: `brand-identity` Brand Identity, `digital-illustration` Digital Illustration, `digital-social-design` Digital & Social Design, `photography` Photography.
- `projects` (11, this order), id = `<project-slug>-<category-id>`: Habitify/brand-identity, Nami Innovation/brand-identity, Tendoo/brand-identity, Good Moods/digital-illustration, Nami Innovation/digital-illustration, Tendoo/digital-illustration, Sci Labs/digital-illustration, Habitify/digital-social-design, Nami Innovation/digital-social-design, Tendoo/digital-social-design, Habitify/photography. Years/companies: Habitify 2019 Unstatic Co.; Nami Innovation 2024 Nami Foundation; Tendoo 2025 Viettel Telecom; Good Moods 2024 Good Moods; Sci Labs 2024 Nami Innovation. `tags` per Figma: brand-identity → ["Brand Identity","Logo Design"]; digital-illustration → ["Digital Illustration","Visual Design"]; digital-social-design → ["Digital Design","Social Design"]; photography → ["Photography"]. Each project: `cover` `images/<id>/cover.jpg`, `intro` = 2 short placeholder paragraphs, `introImages` 4 paths, `sections` 2 items `{ "text": "...", "images": [2 paths] }` (optional `"fit": "contain"` documented in guide). Image files do not exist yet — that is intentional (placeholders render grey).

- [ ] **Step 3: Write failing tests**

`tests/model.test.js` (import a small inline fixture, not `data.json`):
- `filterProjects` with `null`, `'all'`, `'nope'` → all 3 fixture items in order; with `'photography'` → only that item.
- `normalizeCategory(data,'nope')` → `null`; `'photography'` → `'photography'`.
- `cardShape(0)==='square'`, `(1)==='wide'`, `(2)==='square'`, `(5)==='wide'`.
- `formatMeta({year:2025,company:'Viettel Telecom'})==='2025 . Viettel Telecom'`.
- `resolveImage('')===null`, `('  ')===null`, `(undefined)===null`, `('/images/a.jpg')==='images/a.jpg'`, `('./images/a.jpg')==='images/a.jpg'`, `('images/a.jpg')==='images/a.jpg'`.
- `validateData`: fixture with one project `category:'unknown'` and two with `id:'dup'` → result has 2 projects (first `dup` kept), `warnings.length===2`, each warning contains the offending id; `validateData({})` → `data.projects` is `[]`, warnings mention `projects`.

`tests/url.test.js`: `getParam('?id=a%20b','id')==='a b'`, missing → `null`; `worksUrl(null)==='works.html'`; `worksUrl('brand-identity')==='works.html?category=brand-identity'`; `projectUrl('tendoo-brand-identity')==='project.html?id=tendoo-brand-identity'`.

`tests/data-file.test.js`: reads real `data.json` with `fs`, `JSON.parse` succeeds, `validateData` returns 0 warnings, 11 projects, every `project.category` in categories.

- [ ] **Step 4: Run tests — expect FAIL** (`npm test` → module not found)

- [ ] **Step 5: Implement `js/core/model.js` and `js/core/url.js`** per Interfaces.

- [ ] **Step 6: Run `npm test` — expect all PASS**

- [ ] **Step 7: Commit** `feat: project skeleton, sample data and data model`

---

### Task 2: Loading data and JSON error reporting

**Files:**
- Create: `js/core/json-error.js`, `js/core/data.js`, `tests/json-error.test.js`, `tests/data.test.js`

**Interfaces:**
- Produces (`js/core/json-error.js`):
  - `locateJsonError(text: string, errorMessage: string): {line:number, column:number}|null` — understands `position N` (Chrome/Node: convert offset to 1-based line/column) and `line L column C` (Firefox, Node 22 wording); otherwise `null` (Safari).
  - `parseJson(text: string): {ok:true, data} | {ok:false, line:number|null, column:number|null}`
  - `jsonErrorMessageVi(result): string` — with location: `"File data.json đang bị lỗi ở dòng {line}, cột {column}. Hãy kiểm tra dấu phẩy, dấu ngoặc kép và dấu ngoặc ở quanh vị trí đó."`; without: `"File data.json đang bị lỗi cú pháp. Hãy kiểm tra dấu phẩy, dấu ngoặc kép và dấu ngoặc."`
- Produces (`js/core/data.js`):
  - `class DataError extends Error` with `userMessage: string` (Vietnamese).
  - `loadData(url = 'data.json', fetchFn = fetch): Promise<Data>` — calls `fetchFn(url, {cache:'no-cache'})`; non-OK → `DataError` "Không tải được file data.json (mã lỗi {status})."; network failure → `DataError` "Không tải được file data.json. Kiểm tra kết nối mạng hoặc đường dẫn."; parse failure → `DataError` with `jsonErrorMessageVi`. Returns parsed (unvalidated) data.

- [ ] **Step 1: Write failing tests**

`json-error.test.js`:
- `parseJson('{"a":1}')` → `{ok:true,data:{a:1}}`.
- Trailing comma on line 3: text `'{\n  "a": 1,\n  "b": 2,\n}'` → `ok:false`, `line===4` (where `}` is).
- Missing comma: `'{\n  "a": 1\n  "b": 2\n}'` → `line===3`.
- `locateJsonError('ab\ncd', 'Unexpected token in JSON at position 4')` → `{line:2,column:2}`.
- `locateJsonError(x, 'JSON.parse: expected , at line 7 column 3 of the JSON data')` → `{line:7,column:3}`.
- `locateJsonError(x, 'JSON Parse error: Expected \'}\'')` → `null`.
- `jsonErrorMessageVi({ok:false,line:4,column:1})` contains `"dòng 4"`; with `line:null` contains `"lỗi cú pháp"`.

`data.test.js` (stub `fetchFn`):
- passes `{cache:'no-cache'}` and the url to the stub.
- OK response with valid text → returns object.
- `{ok:false,status:404}` → rejects `DataError`, `userMessage` contains `"404"`.
- stub throws → `DataError` with network message.
- invalid JSON text → `DataError`, `userMessage` contains `"dòng"`.

- [ ] **Step 2: `npm test` — expect FAIL**
- [ ] **Step 3: Implement both modules** (read body with `response.text()` then `parseJson`, so the location comes from our parser not `response.json()`).
- [ ] **Step 4: `npm test` — expect PASS**
- [ ] **Step 5: Commit** `feat: data loading with Vietnamese JSON error messages`

---

### Task 3: Design tokens, fonts and assets from Figma

**Files:**
- Create: `css/base.css`, `assets/illustrations/*.png`, `images/home-portrait.jpg`, `images/about-photo.jpg`, `files/cv.pdf`, `.claude/launch.json` in the parent `voice/` folder
- Test: manual checks listed below

**Interfaces:**
- Produces CSS custom properties in `:root` of `css/base.css` that every page CSS uses: `--color-bg`, `--color-text`, `--color-accent` (orange), `--color-placeholder` (grey image box), `--font-display` (serif headings), `--font-script` (handwritten initial letters), `--font-body`, `--page-max` (1920px), `--gutter` (200px desktop, scaled down at breakpoints), plus type-scale vars named `--fs-hero`, `--fs-title-initial`, `--fs-title`, `--fs-h3`, `--fs-body`, `--fs-small` with Figma values.
- Produces shared classes: `.page` (centered max-width container with `--gutter` side padding), `.img-box` (grey placeholder background, `overflow:hidden`; child `img` is `width:100%;height:100%;object-fit:cover`; modifier `.img-box--contain`), `.title-initial` (the big script capital + small-caps rest pattern used in "Works", "About", "Contact", "Art"/"Anh").
- Produces asset file names (kebab-case of Figma layer names): `01-co-gai-cam-ipad.png`, `02-con-mat-viewfinder.png`, `03-khoi-cube.png`, `04-co-gai-thinking.png`, `03-chat-bubble.png`, `01-email-bay.png`, `06-click.png`, `03-macbook-mo-gap.png`, `06-bang-mau-hoa-si.png`, `02-ipad-va-apple-pencil.png`, `04-poster-bay.png`, `01-chom-sao-y-tuong.png`, `05-sparkle-cam.png`, `03-chat-bubble-cam.png`, `02-co-gai-chup-anh-say-hi.png`.

- [ ] **Step 1: Read tokens from Figma** — `get_design_context` on `2796:61531` and `2796:61649` (and `get_variable_defs` if available). Record font families/weights/sizes/line-heights and colors.
- [ ] **Step 2: Write `css/base.css`** — Google Fonts `@import` with `&subset=vietnamese` where available, tokens, minimal reset, `body{background:var(--color-bg)}`, `.page`, `.img-box`, `.title-initial`, `[hidden]{display:none!important}`.
- [ ] **Step 3: Export assets** — for each layer above (search by name in the Figma metadata; Home/About/Contact frames contain them) export PNG at 2× display size via the Figma MCP asset URLs/`download_assets`; save to `assets/illustrations/`. Export portrait `image 3191` from `2796:61531` → `images/home-portrait.jpg` and `image 3191` from `2796:61614` → `images/about-photo.jpg`. Downscale anything wider than 1600px with `sips -Z 1600`.
- [ ] **Step 4: Placeholder CV** — write a one-page PDF with the text "CV – sẽ cập nhật" to `files/cv.pdf` (a small Python script using only the standard library, hand-assembled PDF, kept in the scratchpad, not the repo).
- [ ] **Step 5: Preview config** — create `/Users/ngocsangair/Documents/voice/.claude/launch.json` with two configs: `portfolio` = `python3 -m http.server 8080 --directory portfolio-qa` (port 8080) and `portfolio-subpath` = `python3 -m http.server 8081` (port 8081, run from `voice/`, site at `/portfolio-qa/`).
- [ ] **Step 6: Verify** — `ls assets/illustrations | wc -l` → 15; every PNG opens (Read it) and shows the illustration with transparent/cream background, not a whole screen; `grep -c '#' css/*.css` shows hex colors only inside `:root` of base.css. Report font substitutions if any.
- [ ] **Step 7: Commit** `feat: design tokens, fonts and Figma assets`

---

### Task 4: Shared shell (header, boot, banners) + Home page

**Files:**
- Create: `js/ui/shell.js`, `index.html`, `css/home.css`, `js/pages/home.js`

**Interfaces:**
- Consumes: `loadData`, `DataError` (Task 2); `validateData`, `resolveImage` (Task 1).
- Produces (`js/ui/shell.js`):
  - `bootPage(page: 'home'|'works'|'about'|'contact'|'project', render: (data, root: HTMLElement) => void, {header = true} = {}): Promise<void>` — loads + validates data; if `header`, renders header into `<header id="site-header">`; shows warnings banner; calls `render(data, document.getElementById('app'))`; any `DataError` → `renderFatal(err.userMessage)`; any other error → `renderFatal('Đã có lỗi khi hiển thị trang. Mở Console để xem chi tiết.')` and `console.error`.
  - `renderHeader(el, site, activePage)` — menu Works/About/Contact (links `works.html`, `about.html`, `contact.html`, `aria-current="page"` on active), center logo "QA" as text linking `index.html`, right "Resume" link with inline download SVG, `href=site.resume`, `download` attribute; hidden when `resolveImage(site.resume)` is null.
  - `renderFatal(message)` — replaces `#app` with a centered Vietnamese message panel.
  - `renderWarnings(warnings: string[])` — dismissible banner at top listing warnings (none → nothing).
  - `imageBox(path, alt, {className = '', fit = 'cover'} = {}): HTMLElement` — `.img-box` div; if `resolveImage(path)` null → empty grey box; else `<img loading="lazy">` whose `error` handler removes the img (box stays grey).
  - `el(tag, attrs, ...children): HTMLElement` — tiny DOM helper used by all pages.
- Every page HTML has: `<link>` to `css/base.css` + its page CSS, `<header id="site-header">`, `<main id="app">`, `<script type="module" src="js/pages/<page>.js">`, a `<noscript>` Vietnamese note.

- [ ] **Step 1: Read Home layout** — `get_design_context` on `2796:61531`.
- [ ] **Step 2: Implement `shell.js`, `index.html`, `home.js`, `home.css`** — hero text built from `site.heroName` ("QUYNH ANH" via CSS uppercase with script initial on the second word's first letter as in Figma) and fixed "Welcome to Art space of"; portrait `imageBox(home.photo)`; illustrations cluster (cube, girl-with-iPad, eye) as `<img>` from `assets/`; round arrow button → `works.html`; bottom line `site.titles[0]` + script "&" + `site.titles[1]`.
- [ ] **Step 3: Start preview** (`preview_start` name `portfolio`), open `/index.html` at desktop 1920×1080, compare with Figma screenshot of `2796:61531`; fix differences.
- [ ] **Step 4: Responsive** — at tablet 768 and mobile 375: no horizontal scroll (`document.documentElement.scrollWidth <= innerWidth` via `javascript_tool`), hero text not overlapped by illustrations, header usable (menu may collapse into a toggle).
- [ ] **Step 5: Failure checks in browser** — (a) temporarily rename `home.photo` to a missing file → grey box same size; (b) temporarily add a trailing comma to `data.json` → Vietnamese message with line number; (c) set `resume` to `""` → Resume button hidden. Revert all three; `git diff data.json` empty.
- [ ] **Step 6: Commit** `feat: shared shell and home page`

---

### Task 5: Works page (filter, staggered grid, marquee)

**Files:**
- Create: `works.html`, `css/works.css`, `js/pages/works.js`

**Interfaces:**
- Consumes: `bootPage`, `el`, `imageBox` (Task 4); `filterProjects`, `normalizeCategory`, `getCategory`, `cardShape`, `formatMeta` (Task 1); `getParam`, `worksUrl`, `projectUrl` (Task 1).

- [ ] **Step 1: Read layout** — `get_design_context` on the Works part of `2796:61567` (title group `2796:61568`, cards `2796:61574`/`61580`/`61592`/`61586`, intro `2796:61605`, marquee `2796:61599`, email box `2796:61603`).
- [ ] **Step 2: Implement** — title "Works" (`.title-initial`), `works.intro`; filter bar: "All" + each category name as `<button>` with `aria-pressed`; initial selection from `normalizeCategory(data, getParam(location.search,'category'))`; clicking updates `history.replaceState` with `worksUrl(id)` and re-renders the grid without reload. Grid: for each filtered project at position `i`, card `<a href=projectUrl(id)>` containing ". {category name}" label, `imageBox(cover)` square (1:1) or wide (441:300) per `cardShape(i)`, name, `formatMeta`. 4 columns at desktop with Figma's vertical stagger, 2 at tablet, 1 at mobile. Empty filter result → text "Chưa có dự án nào trong mảng này." Bottom: marquee repeating "Got a project in mind? Let's talk." (CSS animation, pauses on `prefers-reduced-motion`), then email box `mailto:site.email`.
- [ ] **Step 3: Browser verify at 1920** against Figma; click each filter: Brand Identity shows 3 cards, Digital Illustration 4, Digital & Social Design 3, Photography 1, All 11; URL updates; reloading `works.html?category=photography` keeps the filter; `works.html?category=xyz` shows All.
- [ ] **Step 4: Responsive at 768 and 375** — no horizontal scroll, filter buttons wrap, marquee does not overflow page width.
- [ ] **Step 5: Commit** `feat: works page with category filter`

---

### Task 6: Project detail page

**Files:**
- Create: `project.html`, `css/project.css`, `js/pages/project.js`

**Interfaces:**
- Consumes: `bootPage`, `el`, `imageBox` (Task 4); `findProject`, `formatMeta` (Task 1); `getParam`, `worksUrl` (Task 1).

- [ ] **Step 1: Read layout** — `get_design_context` on `2796:61649`.
- [ ] **Step 2: Implement** — `document.title = "{project} – {category name} | {site.name}"`. Big "Works" title (links `worksUrl(project.category)`); left: project name (accent, uppercase), `formatMeta`, `intro` paragraphs; right top: tags as ". Tag"; 2×2 grid of `introImages` (450×450 squares at 1920); then each `sections[i]`: full-width text then a 2-column row of square `imageBox(..., {fit: section.fit})`. Any number of intro images/section images renders (odd count → last cell alone, still square). Unknown id → message "Không tìm thấy dự án." + link "← Quay lại Works" to `works.html`.
- [ ] **Step 3: Browser verify** — `project.html?id=habitify-brand-identity` at 1920 matches Figma `2796:61649` layout with grey boxes; `?id=tendoo-digital-illustration` shows Tendoo tags Digital Illustration/Visual Design; `?id=xyz` and no `id` → not-found message; card click from Works lands here.
- [ ] **Step 4: Responsive at 768 and 375** — single column below 768, images keep square ratio, no horizontal scroll.
- [ ] **Step 5: Commit** `feat: project detail page`

---

### Task 7: About page

**Files:**
- Create: `about.html`, `css/about.css`, `js/pages/about.js`

**Interfaces:**
- Consumes: `bootPage`, `el`, `imageBox` (Task 4).

- [ ] **Step 1: Read layout** — `get_design_context` on About part of `2796:61567` (title `2796:61571`, bio+illustration group `2796:61614`, services `2796:61625`, sparkle `2796:61640`, chat bubble `2796:61641`, say-hi girl `2796:61613`).
- [ ] **Step 2: Implement** — title "About"; bio text from `about.bio`; center photo `imageBox(about.photo)`; decorative illustrations positioned as in Figma (absolute within a relative container at desktop); services from `about.services` in 2 columns (name + description); say-hi illustration.
- [ ] **Step 3: Browser verify at 1920** against Figma.
- [ ] **Step 4: Responsive at 768 and 375** — illustrations scale down or reflow so none covers the bio text; services 1 column on mobile; no horizontal scroll.
- [ ] **Step 5: Commit** `feat: about page`

---

### Task 8: Contact page and Hanoi clock

**Files:**
- Create: `js/core/clock.js`, `tests/clock.test.js`, `contact.html`, `css/contact.css`, `js/pages/contact.js`

**Interfaces:**
- Produces (`js/core/clock.js`): `formatHanoiTime(date: Date): string` via `Intl.DateTimeFormat('en-US',{timeZone:'Asia/Ho_Chi_Minh',hour:'2-digit',minute:'2-digit',hour12:true})`.
- Consumes: `bootPage(..., {header:false})`, `el`, `imageBox` (Task 4).

- [ ] **Step 1: Failing test** — `formatHanoiTime(new Date('2026-01-01T01:32:00Z'))==='08:32 AM'`; `('2026-01-01T13:05:00Z')==='08:05 PM'`; `('2026-01-01T17:00:00Z')==='12:00 AM'`.
- [ ] **Step 2: `npm test` — expect FAIL; implement; `npm test` — expect PASS**
- [ ] **Step 3: Read layout** — `get_design_context` on `2796:61498`.
- [ ] **Step 4: Implement page (no site header)** — top-left: social list (uppercase names) each with diagonal arrow SVG; `url` non-empty → `<a target="_blank" rel="noopener">`, empty → plain text with same style. Top center: "QA" logo linking `index.html`. Center: "Contact" title, "Let's start your project today. Drop me a line.", `mailto:` email. Illustrations (thinking girl, chat bubble, flying email, click) as in Figma. Footer row: "© {current year} {site.name}. All rights reserved" — "{site.location} — {formatHanoiTime(now)}" refreshed on the next minute boundary then every 60 s — "● Available for work" only when `site.availableForWork` is true.
- [ ] **Step 5: Browser verify** — at 1920 matches Figma; clock equals current Hanoi time; setting `availableForWork:false` hides the badge (revert after); header absent; logo returns to Home.
- [ ] **Step 6: Responsive at 768 and 375** — footer row stacks, no horizontal scroll.
- [ ] **Step 7: Commit** `feat: contact page with live Hanoi clock`

---

### Task 9: Editing guide and final checks

**Files:**
- Create: `HUONG-DAN.md`

- [ ] **Step 1: Write `HUONG-DAN.md`** (Vietnamese, plain language, no jargon beyond what's needed): what each top-level part of `data.json` controls (with the field names); how to edit on github.com (open file → pencil icon → edit → Commit changes) and wait ~1 minute; how to upload images into `images/<id>/` and reference them; how to replace `files/cv.pdf`; how to add/remove/reorder a project (copy a whole `{ … }` block, change `id`, keep `category` one of the 4 ids); optional `"fit": "contain"` for sections; the 4 common JSON mistakes (comma after last item, missing comma, curly quotes “ ”, unescaped `"` inside text → `\"`) and that the website will show the line number; a link to an online JSON checker is NOT added (keep it self-contained).
- [ ] **Step 2: Static checks** — `grep -rnE '(href|src)="/' *.html js/` → no matches; `grep -rn "fetch('/" js/` → none; `npm test` → all PASS.
- [ ] **Step 3: Sub-path run** — `preview_start` name `portfolio-subpath`, open `http://localhost:8081/portfolio-qa/index.html`; click through Home → Works → filter → a project → About → Contact → logo → Home; no 404s in `read_network_requests`, no console errors.
- [ ] **Step 4: Full pass at 375, 768, 1920** for all 5 pages: no horizontal scroll, no overlapping text, `read_console_messages` with `onlyErrors` empty.
- [ ] **Step 5: Commit** `docs: Vietnamese editing guide`
