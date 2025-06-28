import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 이 부분을 비워두거나 삭제합니다.
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}
export default config