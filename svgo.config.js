module.exports = {
  multipass: true, // Runs multiple passes to squeeze out every byte
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // IMPORTANT: Do not remove the viewBox, or scaling breaks!
          removeViewBox: false,
        },
      },
    },
    // Remove width/height attributes so the SVG expands to fit the container
    'removeDimensions', 
    // Remove Inkscape/Adobe metadata
    {
      name: 'removeAttrs',
      params: {
        attrs: '(data-name|inkscape:.*|sodipodi:.*)',
      },
    },
  ],
};