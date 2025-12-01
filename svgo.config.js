module.exports = {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // 1. Keep the viewBox so images scale correctly on the web
          removeViewBox: false,
        },
      },
    },
    // 2. Remove width/height so the image is responsive (relies on viewBox)
    'removeDimensions',
    // 3. Clean up the messy metadata (fixed Regex to prevent crashes)
    {
      name: 'removeAttrs',
      params: {
        attrs: 'data-name|inkscape.*|sodipodi.*',
      },
    },
  ],
};