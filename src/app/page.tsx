import { Suspense } from 'react';
import HomeContent from '@/components/HomeContent';
// getAboutContent 함수를 추가로 import 합니다.
import { getSortedPostsData, getAboutContent, Post } from '@/lib/posts';

export default async function HomePage() {
  const posts: Post[] = getSortedPostsData();
  const aboutData = await getAboutContent();

  return (
    <Suspense fallback={<div>Loading home...</div>}>
      <HomeContent posts={posts} aboutContentHtml={aboutData.contentHtml} />
    </Suspense>
  );
}