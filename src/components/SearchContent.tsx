"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { PostPreview } from '@/components/PostPreview';
import { posts } from '@/posts';

export default function SearchContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  // 동적 검색을 위한 디바운싱
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(`${pathname}?q=${query}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, pathname, router]);

  // 검색어가 있으면 필터링하고, 없으면 모든 게시물을 보여줍니다.
  const filteredPosts = query
    ? posts.filter(post =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.summary.toLowerCase().includes(query.toLowerCase())
      )
    : posts;

  return (
    <div className="py-12">
      <div className="mb-12 text-center">
        <div className="mb-12">
            <p className="text-center text-lg text-muted-foreground">
            {query
                ? `총 ${filteredPosts.length}개의 포스트를 찾았습니다.`
                : `총 ${posts.length}개의 포스트가 있습니다.`
            }
            </p>
        </div>
        <div className="mt-8 max-w-md mx-auto">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색어를 입력하세요..."
            className="w-full px-4 py-2 text-lg rounded-md border"
          />
        </div>
      </div>
      
      <div className="space-y-8">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <PostPreview key={post.id} post={post} />
          ))
        ) : (
          // 검색어가 있는데 결과가 없을 때만 "결과 없음" 메시지를 보여줍니다.
          query && <p className="text-center">검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
}