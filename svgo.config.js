module.exports = {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // VITAL: Keeps the internal coordinate system
          removeViewBox: false, 
          // Stop SVGO from stripping IDs you need for animation
          cleanupIDs: false, 
        },
      },
    },
    
    // --- THE FIX FOR COLLIDING SVGS ---
    {
      name: 'prefixIds',
      params: {
        // "false" uses the filename as the prefix automatically.
        // This ensures "fig-hla.svg" gets "fig-hla_layer1", etc.
        prefix: false, 
        delim: '_',
        // Optional: minify the IDs to make file smaller, but harder to read
        // prefixClassNames: false, 
      }
    },

    // 1. MUST REMOVE existing fixed width/height
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

    // 3. Clean up Inkscape/Sodipodi bloat
    {
      name: 'removeAttrs',
      params: {
        attrs: 'data-name|inkscape:(?!label).*|sodipodi:.*',
      },
    },
  ],
};