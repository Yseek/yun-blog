import { Suspense } from 'react';
import TagsContent from '@/components/TagsContent';
import { getSortedPostsData, Post } from '@/lib/posts'; // 데이터 페칭 함수와 타입 import

export default function TagsPage() {
  const posts: Post[] = getSortedPostsData(); // 서버에서 데이터 가져오기

  return (
    <Suspense fallback={<div>Loading tags...</div>}>
      <TagsContent posts={posts} /> {/* props로 데이터 전달 */}
    </Suspense>
  );
}