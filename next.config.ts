import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * 정적 사이트(Static Site)로 빌드하기 위한 설정입니다.
   * GitHub Pages는 정적 페이지만 호스팅할 수 있습니다.
   */
  output: 'export',
  /**
   * GitHub Pages 배포를 위한 경로 설정입니다.
   * "https://<사용자이름>.github.io/<리포지토리이름>" 형태로 주소가 만들어지기 때문에,
   * CSS나 이미지 같은 자원들을 올바르게 불러오려면 리포지토리 이름을 명시해야 합니다.
   * 'yun-blog'는 본인의 리포지토리 이름으로 바꿔주세요.
   */
  basePath: '/yun-blog',
  assetPrefix: '/yun-blog/',
  /**
   * Next.js의 이미지 최적화 기능은 GitHub Pages에서 지원되지 않으므로 비활성화합니다.
   */
  images: {
    unoptimized: true,
  },
};

export default nextConfig;