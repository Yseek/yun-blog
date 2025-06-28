// tailwind.config.ts (새로 만드는 파일)

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"], // 다크 모드 사용을 위해 필수
  content: [
    // 우리 프로젝트의 어떤 파일들을 스캔해서 Tailwind 클래스를 적용할지 경로를 지정합니다.
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 나중에 여기에 커스텀 디자인(색상, 폰트 등)을 추가할 수 있습니다.
    },
  },
  plugins: [
    require("@tailwindcss/typography"), // 블로그 글 스타일링을 위한 플러그인
  ],
};
export default config;