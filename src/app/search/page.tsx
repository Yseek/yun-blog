"use client";

import { Suspense } from 'react'; // Suspense를 import 합니다.
import { useSearchParams } from 'next/navigation';
import { PostPreview } from '@/components/PostPreview';
import { posts } from '@/posts';

// URL 파라미터를 읽고 검색 로직을 처리하는 실제 컨텐츠 컴포넌트
function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const filteredPosts = query
    ? posts.filter(post =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.summary.toLowerCase().includes(query.toLowerCase())
      )
    : []; // 검색어가 없을 때는 빈 배열을 반환합니다.

  return (
    <div className="py-12">
      <h1 className="text-3xl font-bold mb-8">
        Search results for: <span className="text-primary">{query}</span>
      </h1>
      <div className="space-y-8">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <PostPreview key={post.id} post={post} />
          ))
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

// Search 페이지의 최종 형태
export default function SearchPage() {
  return (
    // Suspense로 감싸서 빌드 오류를 해결합니다.
    <Suspense fallback={<div>Loading search results...</div>}>
      <SearchContent />
    </Suspense>
  );
}