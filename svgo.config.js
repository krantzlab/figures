module.exports = {
  multipass: true, // Run plugins multiple times to ensure cleanliness
  plugins: [
    // 1. Standard Cleanup (Disabled ID stripping so we can rename them instead)
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false, // Keep the viewbox!
          cleanupIDs: false,    // DOMINANT: Do not let default preset touch IDs
        },
      },
    },

    // 2. Remove Dimensions (Fixes the layout)
    { name: 'removeDimensions' },

    // 3. Add Responsive Size
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

    // 4. Force Unique IDs (The Fix)
    // Placed LAST to ensure it runs on the final cleaned structure
    {
      name: 'prefixIds',
      params: {
        prefix: false, // Use filename as prefix
        delim: '_',
      }
    },
  ],
};