# Krantz Lab Figures & Visuals
A single source of truth for diagrams, scientific figures, and branding assets used by the Krantz Lab.

## Table of Contents
- [Branches & Workflow](#branches--workflow)
- [Usage](#usage)
    - [Web / Quarto](#web--quarto)
    - [Local Use](#local-use)
- [Adding Headshots](#adding-headshots)
- [Contributing](#contributing)
- [Automation](#automation)
- [License & Contact](#license--contact)

## Branches & Workflow
- **`main` (Source):** Contains editable source files.
    - Edit files in `source-svg/` and `source-people/`.
- **`dist` (Build output):** Contains auto-generated, optimized assets:
    - `web/` → optimized SVGs for websites and Quarto
    - `print/` → high-resolution PDFs for manuscripts and posters

Workflow: edit source on `main`, push changes, and the automation pipeline updates `dist`.

## Usage

### Web / Quarto (recommended)
Use the CDN link that serves optimized SVGs from the `dist` branch.

Pattern:
`https://cdn.jsdelivr.net/gh/krantzlab/figures@dist/web/[FILENAME].svg`

Example (Quarto / Markdown):

```markdown
![Krantz Lab Navbar Logo](https://cdn.jsdelivr.net/gh/krantzlab/figures@dist/web/navbar-logo-krantzlab.svg){width="200"}
```

### Local Use
- Edit files in `source-svg/` with your vector editor (Inkscape recommended).
- After editing, push to `main`. CI will build and update `dist` automatically.

- Save as Plain SVG
- To be able to utilize animate in Revealjs group SVG into layers (i.e. fragments)
- The svgo.config.js automatically uses the file name to create prefixes so that SVG elements are unique (if use multiple SVG with same element ID, this will cause rendering issues)
- You right click on the layer -> Object Properties -> update the ID to "layer1" (this is the name for the first layer of what appears immediately on slide); then "layer2". The svgo.config.js will append a prefix "fig-name_". Therefore in the .qmd for the revealjs you would use "fig-name_layer2"

## Adding Headshots
1. Crop the photo to square (1:1) and center the face.
2. Minimum resolution: **600×600 px**.
3. Filename: `lastname-firstname.png` (example: `krantz-matt.png`).
4. Upload to `source-people/`.

The automation pipeline will optimize and resize images for web use.

## Contributing
- Edit source SVGs in `source-svg/` (use Inkscape or another vector editor).
- For headshots, add files to `source-people/`.
- Open a pull request against `main` with a short description of your change.
- The automated build will update `dist` after your PR is merged.

## Automation
> ⚠️ IMPORTANT: Do not manually create PDFs or web-optimized versions. Edit only the source files — the automation pipeline generates the Web and Print outputs for you.