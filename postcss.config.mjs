/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // This is the corrected line
    'autoprefixer': {}
  }
};

export default config;