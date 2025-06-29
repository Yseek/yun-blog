import { Suspense } from 'react';
import HomeContent from '@/components/HomeContent';
import { getSortedPostsData, Post } from '@/lib/posts'; // Post 타입을 import 합니다.

export default function HomePage() {
  const posts: Post[] = getSortedPostsData(); // 서버 컴포넌트에서 데이터 페칭

  return (
    <Suspense fallback={<div>Loading home...</div>}>
      <HomeContent posts={posts} />
    </Suspense>
  );
}