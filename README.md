# Krantz Lab Figures & Visuals

A single source of truth for diagrams, scientific figures, and branding assets used by the Krantz Lab.

## Table of Contents

- [Branches & Workflow](#branches--workflow)
- [Usage](#usage)
- [Creating & Editing SVGs](#creating--editing-svgs)
- [Adding Headshots](#adding-headshots)
- [Contributing](#contributing)
- [Automation](#automation)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Citation](#citation)

## Branches & Workflow

- **`main` (Source):** Contains editable source files.
  - `source-svg/` → source SVG figures
  - `source-people/` → headshot photos
- **`dist` (Build output):** Contains auto-generated, optimized assets. **Do not edit directly.**
  - `web/` → SVGO-optimized SVGs for websites and Quarto
  - `print/` → high-resolution PDFs for manuscripts and posters

**Workflow:** Edit source files on `main` → push → GitHub Actions builds and deploys optimized assets to `dist`.

## Usage

### Web / Quarto (Recommended)

Use the jsDelivr CDN link that serves optimized SVGs from the `dist` branch:

```
https://cdn.jsdelivr.net/gh/krantzlab/figures@dist/web/[FILENAME].svg
```

Example in Quarto / Markdown:

```markdown
![Krantz Lab Logo](https://cdn.jsdelivr.net/gh/krantzlab/figures@dist/web/navbar-logo-krantzlab.svg){width="200"}
```

Example for a website figure page:

```markdown
![](/figures/fig-elispot.svg){fig-align="center" style="max-width:min(100%, 600px); height:auto;"}
```

### RevealJS Slides (Animated SVGs)

Figures with multiple layers can be animated using the RevealJS `animate` plugin:

````markdown
{{< animate fig-elispot.svg >}}
````

The animate plugin targets layers by their SVGO-prefixed IDs. See [Creating & Editing SVGs](#layer-setup-for-animation) below for layer conventions.

## Creating & Editing SVGs

### Canvas Sizing

**Fit the canvas to your content** — do not use a fixed canvas size. In Inkscape, use **Edit → Resize Page to Selection** to trim the canvas to the drawing bounds after you finish your figure.

A typical figure ends up around 1000–1400 px wide and 500–700 px tall, but the exact dimensions should be dictated by the content. Display sizing is controlled externally by CSS:

| Context | CSS Rule | Effect |
|---------|----------|--------|
| Slides | `max-height: 700px; max-width: 1500px` | Scales to fit within the slide |
| Website | `max-width: min(100%, 600px)` | Scales to 600 px wide max, responsive |

### File Conventions

- **File prefix**: `fig-` for figures, `topic-` for header illustrations
- **Naming**: kebab-case (e.g., `fig-patch-testing-sites.svg`)
- **Location**: `source-svg/` on the `main` branch only
- **Save as**: Plain SVG (not Inkscape SVG)

### Layer Setup for Animation

To use layer-based animation in RevealJS slides, organize your SVG content into Inkscape layers:

1. In Inkscape, create layers via **Layer → Add Layer**
2. Right-click each layer → **Object Properties** → set the ID:
   - `layer1` — base layer (visible immediately when the slide loads)
   - `layer2` — first fragment (revealed on advance)
   - `layer3`, `layer4`, etc. — subsequent fragments
3. The `svgo.config.js` automatically prefixes all IDs with the filename during CI. For example, `layer2` in `fig-elispot.svg` becomes `fig-elispot_layer2` in the optimized output.
4. In your `.qmd` slide file, reference the **prefixed** ID: `"#fig-elispot_layer2"`

**Layer ordering is bottom-up in Inkscape:** `layer1` is at the bottom of the Layers panel and renders first (behind everything). Higher-numbered layers appear on top.

> ⚠️ **Do not manually prefix layer IDs with the filename** — this causes double-prefixing (e.g., `fig-elispot_fig-elispot_layer1`). Use simple IDs like `layer1`, `layer2`.

### ID Prefixing

The SVGO pipeline prefixes **every** ID in the SVG (not just layers) with the filename. This prevents ID collisions when multiple SVGs are embedded on the same page. Internal references like `url(#gradient1)` are updated automatically.

## Adding Headshots

1. Crop the photo to **square (1:1)** and center the face.
2. Minimum resolution: **600×600 px**.
3. Filename: `lastname-firstname.png` (e.g., `krantz-matt.png`).
4. Upload to `source-people/`.

The automation pipeline will convert and resize images to 600×600 WebP for web use.

## Contributing

1. Edit source SVGs in `source-svg/` (Inkscape recommended) or add headshots to `source-people/`.
2. Open a pull request against `main` with a short description of your change.
3. The automated build will update `dist` after your PR is merged.

## Automation

> ⚠️ **Do not manually create PDFs or web-optimized versions.** Edit only the source files — the GitHub Actions pipeline generates all outputs automatically.

The workflow (`.github/workflows/optimize-web-print.yml`) triggers on pushes to `main` that modify `source-svg/`, `svgo.config.js`, or `source-people/`. It:

1. Optimizes each SVG via SVGO with filename-based ID prefixing → `dist/web/`
2. Converts each SVG to PDF via Inkscape → `dist/print/`
3. Converts headshots to 600×600 WebP → `dist/web/`
4. Deploys the `dist/` directory to the `dist` branch

## Troubleshooting

### Decktape PDF Export Hangs

**Symptom:** Decktape hangs or generates dozens of duplicate pages when exporting slides to PDF.

**Cause:** The RevealJS `animate` plugin interprets loose (ungrouped) SVG paths as individual animation steps. If a complex SVG with many ungrouped paths is on the last slide, Decktape enters an infinite loop.

**Solution:** Always include a dummy final slide at the end of every presentation (e.g., `## {visibility="hidden"}`). This gives Decktape a clear exit target. Also ensure all paths in your SVGs are grouped inside layers rather than left as loose elements.

## License

This work is licensed under a [Creative Commons Attribution-NonCommercial 4.0 International License](LICENSE). See [LICENSE](LICENSE) for details.

## Citation

If you use these figures in your work, please cite this repository. See [CITATION.cff](CITATION.cff) for a machine-readable citation.