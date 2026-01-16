module.exports = {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // VITAL: Keeps the internal coordinate system
          removeViewBox: false, 
        },
      },
    },
    // 1. MUST REMOVE existing fixed width/height (e.g., "1182px") 
    // so they don't conflict with the 100% we add below.
    {
      name: 'removeDimensions',
    },
    // 2. Add the responsive attributes back
    {
      name: 'addAttributesToSVGElement',
      params: {
        attributes: [
          { width: '100%' },
          { height: '100%' },
          { preserveAspectRatio: 'xMidYMid meet' } 
        ]
      }
    },
    // 3. Clean up Inkscape/Sodipodi bloat while keeping IDs for Quarto
    {
      name: 'removeAttrs',
      params: {
        // We keep 'id' but remove the specific Inkscape/Adobe metadata
        attrs: 'data-name|inkscape:(?!label).*|sodipodi:.*',
      },
    },
  ],
};