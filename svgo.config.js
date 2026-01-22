// Get the filename from the environment variable passed by the CI loop
// Fallback to "svg" if for some reason the variable is missing
const currentPrefix = process.env.SVG_FILENAME || 'svg';

module.exports = {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // VITAL: Keep the viewbox for scaling
          removeViewBox: false,
          // VITAL: Don't let default cleanup delete IDs we need to rename later
          cleanupIDs: false,
        },
      },
    },
    
    // 1. Remove fixed dimensions so we can resize in Quarto
    { name: 'removeDimensions' },

    // 2. Add responsive attributes
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

    // 3. THE FIX: Force the prefix using the variable we passed in
    {
      name: 'prefixIds',
      params: {
        prefix: currentPrefix,
        delim: '_',
      }
    }
  ],
};