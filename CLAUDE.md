# SVG Figure Creation Rules

## Overview

This project uses a **separate GitHub repo** (`krantzlab/figures`) as the single source of truth for all SVG figures, branding assets, and headshots. The repo has two branches:

- **`main`** — editable source files in `source-svg/` and `source-people/`
- **`dist`** — auto-generated optimized assets, built by GitHub Actions:
  - `web/` → SVGO-optimized SVGs (for website and slides)
  - `print/` → high-resolution PDFs via Inkscape (for manuscripts and posters)

**Never manually create optimized SVGs or PDFs.** Edit only source files on `main`; the CI pipeline generates all outputs.

### How the Website Consumes Figures

The Quarto website and RevealJS slides load optimized SVGs from the `dist` branch via jsDelivr CDN:

```
https://cdn.jsdelivr.net/gh/krantzlab/figures@dist/web/[FILENAME].svg
```

Locally, figures are also available at `/figures/` in the website repo for slide animation via the `animate` plugin.

## File Naming & Location

- **Source files** go in `source-svg/` on the `main` branch of `krantzlab/figures`
- **Optimized output** lands in `dist/web/` (SVG) and `dist/print/` (PDF) on the `dist` branch — generated automatically, never edited by hand
- Prefix all figure files with `fig-` (e.g., `fig-elispot.svg`, `fig-patch-testing-sites.svg`)
- Use kebab-case for the descriptive portion
- Topic-header illustrations use `topic-` prefix (e.g., `topic-immunogenomics.svg`)
- **Save as Plain SVG** from Inkscape (not Inkscape SVG) to avoid extra Inkscape-specific markup

## Canvas & Dimensions

### Core Principle: Fit Canvas to Content

Do **not** design to a fixed 1600×900 canvas. Instead, size the Inkscape canvas to fit the actual figure content — use **Edit → Resize Page to Selection** (or Document Properties → Resize to Content) to trim the canvas to the drawing bounds.

### General Guidelines

- A typical figure ends up around **1000–1400px wide** and **500–700px tall**, but this varies by content. Let the content dictate the dimensions.
- The `viewBox` should exactly match the content bounds — no extra padding baked into the SVG itself.
- **Source files**: Include `width` and `height` attributes matching the viewBox (for Inkscape and local preview).
- **SVGO strips dimensions**: The `removeDimensions` plugin removes `width` and `height` from the output, leaving only the `viewBox`. Display sizing is handled entirely by CSS.

### How Display Sizing Works

Figure sizing is controlled externally, not by the SVG canvas size:

| Context | CSS Rule | Effect |
|---------|----------|--------|
| **Slides** (animate plugin) | `max-height: 700px; max-width: 1500px; width: auto; height: auto;` | SVG scales to fit within the slide, centered, maintaining aspect ratio |
| **Website** (Quarto markup) | `max-width: min(100%, 600px); height: auto;` | SVG scales to a max of 600px wide, responsive on smaller screens |

Because the CSS handles scaling, the SVG just needs a correct `viewBox` with a reasonable aspect ratio. The figure will look good at any size as long as text remains legible (see Typography section for minimum font sizes).

### Text Legibility Check

Since the same SVG renders at ~600px wide on the website and up to ~1500px wide on slides, ensure text is legible at both extremes. With a canvas around 1200px wide, font sizes of 20px+ in the SVG translate to roughly 10px+ at 600px rendering — still readable.

## Layer Structure (Critical for Animation)

The RevealJS animate plugin targets layers by `id`. The final IDs in the optimized SVG follow this pattern:

```
id="{filename-without-extension}_layer{N}"
```

**However, you do NOT write these prefixed IDs in the source SVG.** The SVGO `prefixIds` plugin automatically prepends the filename. In your source files, use simple IDs.

### Source SVG (in `source-svg/`)

```xml
<g inkscape:groupmode="layer" id="layer1" inkscape:label="layer1">
  <!-- Base content: always visible on slide load -->
</g>
<g inkscape:groupmode="layer" id="layer2" inkscape:label="layer2">
  <!-- Revealed on first fragment advance -->
</g>
<g inkscape:groupmode="layer" id="layer3" inkscape:label="layer3">
  <!-- Revealed on second fragment advance -->
</g>
```

### After SVGO (in `figures/`)

For a file processed as `fig-elispot.svg`, SVGO transforms these to:
- `layer1` → `fig-elispot_layer1`
- `layer2` → `fig-elispot_layer2`
- `layer3` → `fig-elispot_layer3`

The CI pipeline passes the filename (without extension) as the `SVG_FILENAME` environment variable to SVGO, which uses it as the prefix with `_` as the delimiter.

### Rules

1. **Layer 1 is the base layer** — it displays immediately when the slide loads. Never make layer1 a fragment; audiences should never see an empty slide.
2. **Layers 2+ are fragment layers** — they are assigned `class: fragment` via the animate plugin's YAML setup block in the `.qmd` file.
3. **Use simple IDs in source files**: `id="layer1"`, `id="layer2"`, etc. SVGO's `prefixIds` handles the rest. Do NOT manually prefix IDs with the filename in source SVGs — this would result in double-prefixing (e.g., `fig-elispot_fig-elispot_layer1`).
4. **All IDs get prefixed**: Not just layer IDs — every `id` in the SVG is prefixed. This includes gradient IDs, clip-path IDs, symbol IDs, etc. Internal `url(#...)` references are updated automatically by SVGO.
5. **Include Inkscape layer attributes**: `inkscape:groupmode="layer"` and `inkscape:label="layerN"`. These are required for Inkscape compatibility and are preserved through SVGO (`collapseGroups: false`).
6. **Layer order is bottom-up in Inkscape**: In Inkscape's Layers panel, `layer1` is at the bottom and renders first (behind everything). Higher-numbered layers are above it. SVG renders in document order, so layer1 should appear first in the source XML.
7. **Keep layer count reasonable**: 2–5 layers per figure. More than that overwhelms the audience.

### Corresponding QMD Usage

The `.qmd` file references the **post-SVGO prefixed IDs** (since it loads from `figures/`, not `source-svg/`):
```yaml
```yaml { .animate src="/figures/fig-elispot.svg"}
setup:
  - element: "#fig-elispot_layer2"
    modifier: attr
    parameters:
      - class: fragment
  - element: "#fig-elispot_layer3"
    modifier: attr
    parameters:
      - class: fragment
```​
```

For ordered fragments, add `data-fragment-index`:
```yaml
  - element: "#fig-hla-class-1_layer2"
    modifier: attr
    parameters:
      - class: fragment
      - data-fragment-index: "1"
```

## Typography

- **Bold text**: `font-family: Arial-BoldMT, Arial; font-weight: 700`
- **Regular text**: `font-family: ArialMT, Arial`
- Use `<text>` elements with `<tspan>` for multi-line text, not converted paths (keeps files editable and smaller)
- Define font classes in a `<style>` block inside `<defs>` — do not use inline `style` attributes for fonts when possible

### Standard Font Size Classes

Use semantic class names. Common patterns from existing figures:

| Purpose | Class pattern | Size | Weight |
|---------|--------------|------|--------|
| Large heading | `.label-lg` | 28px | 700 |
| Medium heading | `.label-md` | 22px | 700 |
| Small label | `.label-sm` | 20px | 400 |
| Axis label | `.ax-label` | 22px | 700 |
| Axis tick | `.ax-tick` | 20px | 400 |
| Data value | `.bar-value` | 28px | 700 |
| Notes | `.note` | 20px | 400 |
| Notes emphasis | `.note-em` | 20px | 700 |

Adapt these to the figure's needs but stay within the size ranges. Text below 16px becomes illegible on the website view.

## Color Palette

Use these established project colors consistently:

| Color | Hex | Usage |
|-------|-----|-------|
| Brand blue | `#4c86c5` | Headers, accent, time labels, column headers |
| Body text | `#212529` | Primary text |
| Secondary text | `#666` | Lighter labels, descriptions |
| Tertiary text | `#999` | Axis ticks, subtle elements |
| Note text | `#555` | Footnotes, aside text |
| Background | `#f8f9fa` | Slide/page background |
| Positive/alert | `#c0392b` | Drug reactions, positive results |
| Warning | `#e67e22` | Moderate severity |
| Success/safe | `#2d6a4f` | Negative results, normal |
| Skin tone | `#d0c4b5` | Anatomical illustrations |
| Skin outline | `#a89888` | Anatomical illustration strokes |
| Well fill | `#f5f0e8` | Lab plate/well backgrounds |
| Well ring | `#a89888` | Lab plate borders |

Do not introduce new colors without a clear rationale.

## CSS Classes & Styling

- Define all styles in a `<style>` block inside `<defs>` at the top of the SVG
- Use semantic class names that describe purpose, not appearance (`.well-ring` not `.grey-circle`)
- For Illustrator-exported SVGs, the `.st0`, `.st1` pattern is acceptable but should be documented with comments
- Avoid `!important` in SVG internal styles
- Never use CSS custom properties (`var(--color)`) inside SVGs — they won't resolve when the SVG is loaded via the animate plugin

## Animation-Specific Considerations

### Fragment Types

- **Standard fragments**: Layer fades in (default RevealJS behavior)
- **Wipe animation**: Add class `.wipe-dist` for a left-to-right reveal. The CSS uses `clip-path: inset()` with `transform-box: view-box`.

### What NOT to Animate

- **Comparison tables/charts**: Show all data simultaneously. Row-by-row reveal is counterproductive when audiences need to compare across rows.
- **Labels that orient the viewer**: Put axis labels, titles, and legends on layer1 so the audience understands the figure's structure before data appears.

## SVGO Pipeline & CI Workflow

The GitHub Actions workflow (`.github/workflows/optimize-web-print.yml`) triggers on pushes to `main` that touch `source-svg/**`, `svgo.config.js`, or `source-people/**`.

### What the Workflow Does

1. **Web assets**: Loops through `source-svg/*.svg`, sets `SVG_FILENAME` to each file's basename (without `.svg`), and runs SVGO → outputs to `dist/web/`
2. **Print assets**: Converts each source SVG to PDF via Inkscape → outputs to `dist/print/`
3. **Headshots**: Converts `source-people/*.{jpg,png}` to 600×600 WebP → outputs to `dist/web/`
4. **Deploys** the entire `dist/` directory to the `dist` branch via `peaceiris/actions-gh-pages`

### SVGO Config (`svgo.config.js`)

| Plugin | Effect |
|--------|--------|
| `preset-default` (with overrides) | Standard optimizations, but preserves viewBox, IDs, and groups |
| `removeDimensions` | Strips `width` and `height` attributes (CSS controls sizing) |
| `prefixIds` | Prepends `{SVG_FILENAME}_` to every ID in the file |

### Key Overrides in `preset-default`

- `removeViewBox: false` — viewBox is preserved (required for scaling)
- `cleanupIds: false` — IDs are not removed before `prefixIds` runs
- `collapseGroups: false` — Layer `<g>` elements are not collapsed (required for animation targeting)

### Rules for Source SVGs

1. **Use simple IDs**: `id="layer1"`, `id="grad1"`, etc. SVGO prefixes them automatically. Manual prefixing causes double-prefixing (e.g., `fig-elispot_fig-elispot_layer1`).
2. **All IDs are prefixed**: Layers, gradients, clip-paths, filters, symbols — everything. Internal `url(#...)` and `xlink:href="#..."` references are updated automatically.
3. **Inkscape metadata is stripped**: `sodipodi:namedview`, guides, and `inkscape:*` attributes on non-layer elements are removed. The `inkscape:groupmode` and `inkscape:label` on layer `<g>` elements survive because `collapseGroups` is disabled.
4. **Unused `<defs>` entries are removed**: Only define gradients, clip-paths, etc. that are actually referenced.
5. **Do not use `<use>` elements for content that needs to be independently animated** — SVGO may inline them, and the animate plugin targets elements directly.
6. **`multipass: true`** means optimizations run multiple times. Don't rely on ordering tricks to avoid optimization.

## Structural Template

For a new figure, start from this skeleton. Adjust `viewBox`, `width`, and `height` to fit your actual content — these are starting values, not a fixed requirement:

```xml
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
  version="1.1"
  viewBox="0 0 1200 600"
  width="1200"
  height="600"
  id="svg1"
  xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
  xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:svg="http://www.w3.org/2000/svg">

  <defs>
    <style>
      /* Define semantic classes here */
      .label-lg { font-family: Arial-BoldMT, Arial; font-weight: 700; font-size: 28px; fill: #212529; }
      .label-md { font-family: Arial-BoldMT, Arial; font-weight: 700; font-size: 22px; fill: #212529; }
      .label-sm { font-family: ArialMT, Arial; font-size: 20px; fill: #555; }
    </style>
  </defs>

  <!-- Layer 1: Base (always visible) -->
  <g inkscape:groupmode="layer" id="layer1" inkscape:label="layer1">
    <!-- Axes, labels, static structure -->
  </g>

  <!-- Layer 2: First reveal -->
  <g inkscape:groupmode="layer" id="layer2" inkscape:label="layer2">
    <!-- First set of data or annotations -->
  </g>

  <!-- Layer 3: Second reveal (if needed) -->
  <g inkscape:groupmode="layer" id="layer3" inkscape:label="layer3">
    <!-- Additional detail -->
  </g>

</svg>
```

**Note**: Use simple IDs (`layer1`, `layer2`). SVGO's `prefixIds` plugin will transform these to `{filename}_layer1`, etc. during the CI build. Resize the canvas to fit your content before saving — don't leave extra whitespace around the figure.

## Decktape PDF Export

The RevealJS animate plugin interprets loose (ungrouped) SVG paths as individual animation steps. This causes problems:

- **Symptom**: Decktape hangs or generates dozens of duplicate pages during PDF export
- **Cause**: If a complex SVG with many ungrouped paths is on the **last slide**, Decktape enters an infinite loop trying to capture every animation "step"
- **Solution**: Always include a **dummy final slide** (e.g., References, Thank You, or `## {visibility="hidden"}`) at the end of every presentation. This gives Decktape a clear exit target.

**Prevention**: Group all paths into layers. Loose `<path>` elements outside of any `<g inkscape:groupmode="layer">` are what trigger false animation steps.

## Checklist Before Committing

- [ ] File is in `source-svg/` on the `main` branch with `fig-` prefix
- [ ] Saved as **Plain SVG** (not Inkscape SVG)
- [ ] Canvas is resized to fit content (no extra whitespace); `viewBox`, `width`, `height` match
- [ ] Layer IDs are simple (`layer1`, `layer2`) — NOT manually prefixed with the filename
- [ ] All paths are inside layer groups (no loose paths outside `<g>` layers)
- [ ] Layer 1 contains enough context to orient the viewer
- [ ] Fonts use Arial-BoldMT / ArialMT only
- [ ] Colors are from the project palette
- [ ] Styles are in `<defs><style>` with semantic class names
- [ ] Text is legible at 600px wide (website) and 1500px wide (slides)
- [ ] No CSS custom properties (`var()`) used inside the SVG
- [ ] No unused items in `<defs>` (SVGO removes them, but cleaner to not have them)
- [ ] Inkscape namespace declarations are present (for editing compatibility)
- [ ] If this SVG will be on the last slide, ensure the presentation has a dummy final slide after it