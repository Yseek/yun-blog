"use client"; // 클라이언트 컴포넌트임을 명시

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
  
  const filteredPosts = query
    ? posts.filter(post =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.summary.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="py-12">
        <div className="mb-12 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
              Search Posts
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
              블로그의 모든 글을 검색해보세요.
            </p>
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
            {query && filteredPosts.length === 0 && (
              <p className="text-center">검색 결과가 없습니다.</p>
            )}
            {filteredPosts.map(post => (
              <PostPreview key={post.id} post={post} />
            ))}
        </div>
    </div>
  );
}