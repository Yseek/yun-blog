"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { PostPreview } from '@/components/PostPreview';
import type { Post } from '@/lib/posts';

export default function SearchContent({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const filteredPosts = query
    ? posts.filter(post =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.summary.toLowerCase().includes(query.toLowerCase())
      )
    : posts;

  const [visibleCount, setVisibleCount] = useState(5);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(() => {
    setVisibleCount(prevCount => prevCount + 5);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredPosts.length) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    const currentObserverRef = observerRef.current;
    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [loadMore, visibleCount, filteredPosts.length]);

  const displayedPosts = filteredPosts.slice(0, visibleCount);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (query) {
        params.set('q', query);
      } else {
        params.delete('q');
      }
      router.replace(`${pathname}?${params.toString()}`);
      setVisibleCount(5);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, pathname, router]);

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
        {displayedPosts.length > 0 ? (
          displayedPosts.map(post => (
            <PostPreview key={post.id} post={post} />
          ))
        ) : (
          query && <p className="text-center">검색 결과가 없습니다.</p>
        )}
        <div ref={observerRef} style={{ height: '1px' }} />
      </div>
    </div>
  );
}