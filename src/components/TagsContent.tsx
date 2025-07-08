"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PostPreview } from '@/components/PostPreview';
import type { Post } from '@/lib/posts';

export default function TagsContent({ posts }: { posts: Post[] }) {
  const searchParams = useSearchParams();
  const selectedTag = searchParams.get('q');

  const allTags = [...new Set(posts.flatMap(post => post.tags))];
  const tagCounts: { [key: string]: number } = {};
  posts.forEach(post => {
    post.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const filteredPosts = selectedTag
    ? posts.filter(post => post.tags.includes(selectedTag))
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

  return (
    <div className="py-12">
      <div className="mb-12">
        {selectedTag ? (
          <h1 className="text-2xl font-bold text-center">
            # {selectedTag}
            <span className="text-2xl font-normal text-muted-foreground ml-2">({filteredPosts.length})</span>
          </h1>
        ) : (
          <h1 className="text-2xl font-bold text-center">
            Tags <span className="text-2xl font-normal text-muted-foreground ml-2">({allTags.length})</span>
          </h1>
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-4 mt-8 mb-12">
        {allTags.map(tag => (
        <Link
          key={tag}
          href={`/tags?q=${encodeURIComponent(tag)}`}
          className={`px-4 py-2 rounded-full text-lg font-medium transition-colors
          ${selectedTag === tag
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-primary/80 hover:text-primary-foreground'
          }`
          }
        >
          {tag} ({tagCounts[tag]})
        </Link>
        ))}
      </div>
      <div className="space-y-8">
        {displayedPosts.map(post => (
          <PostPreview key={post.id} post={post} />
        ))}
        <div ref={observerRef} style={{ height: '1px' }} />
      </div>
    </div>
  );
}