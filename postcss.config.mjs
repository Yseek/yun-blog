/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, 
    autoprefixer: {}, // 브라우저 호환성을 위한 접두사를 자동으로 붙여줍니다.
  },
};

export default config;