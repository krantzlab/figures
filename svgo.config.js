module.exports = {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // 1. VITAL: Keeps the internal "map" so scaling works
          removeViewBox: false,
        },
      },
    },
    // 2. We remove 'removeDimensions' to ensure mobile compatibility
    
    // 3. Systematically add 100% dimensions
    {
      name: 'addAttributesToSVGElement',
      params: {
        attributes: [
          { width: '100%' },
          { height: '100%' },
          { preserveAspectRatio: 'xMidYMid meet' } // Ensures clinical images stay centered and proportional
        ]
      }
    },
    // 4. Clean up the specialized metadata
    {
      name: 'removeAttrs',
      params: {
        attrs: 'data-name|inkscape.*|sodipodi.*',
      },
    },
  ],
};