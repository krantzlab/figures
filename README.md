# Krantz Lab Figures & Visuals

This repository is the central source of truth for all diagrams, scientific figures, and branding assets used by the Krantz Lab.

> **⚠️ IMPORTANT:** Do not manually create PDF or Web versions. Just edit the **Source** file, and our automated robot will generate the Web and Print versions for you.

------------------------------------------------------------------------

## 📂 Where are the files?

This repository is split into two branches to keep things clean:

1.  **`main` Branch (You are here):** Contains the **Source Code**.
    -   📂 `source-svg/` → **EDIT THESE FILES.** Use Inkscape.
2.  **`dist` Branch (The Output):** Contains the **Final Assets**.
    -   📂 `web/` → Optimized SVGs (Use for Websites/Quarto).
    -   📂 `print/` → High-Res PDFs (Use for Manuscripts/Posters).

------------------------------------------------------------------------

## 👩‍🔬 How to Use

### For Websites (HTML)

Use the **CDN Link**. This loads the optimized SVG directly from the `dist` branch. It is fast, cached, and always up to date.

**Pattern:** `https://cdn.jsdelivr.net/gh/krantzlab/figures@dist/web/[FILENAME].svg`

**Example (Copy/Paste into Quarto):**

``` markdown
![Krantz Lab Navbar Logo](https://cdn.jsdelivr.net/gh/krantzlab/figures@dist/web/navbar-logo-krantzlab.svg){width="200"}
```

![](https://cdn.jsdelivr.net/gh/krantzlab/figures@dist/web/navbar-logo-krantzlab.svg){width="200"}
