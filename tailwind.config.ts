// tailwind.config.ts

import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class', // ◀◀ 배열이 아닌 문자열로 수정
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}
export default config