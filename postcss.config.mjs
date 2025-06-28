/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // ◀◀ 이 부분이 맞는지 확인
    'autoprefixer': {},
  },
};

export default config;