"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { ProfileCard } from '@/components/ProfileCard';
import { AboutContent } from '@/components/AboutContent';
import { PostsList } from '@/components/PostsList';
import { RightSidebar } from '@/components/RightSidebar';
import type { Post } from '@/lib/posts';

export default function HomeContent({
  posts,
  aboutContentHtml
}: {
  posts: Post[],
  aboutContentHtml: string
}) {
  const [view, setView] = useState('posts');
  const [visibleCount, setVisibleCount] = useState(5);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(() => {
    setVisibleCount(prevCount => prevCount + 5);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < posts.length) {
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
  }, [loadMore, visibleCount, posts.length]);


  const displayedPosts = posts.slice(0, visibleCount);

  return (
    <div>
      <ProfileCard />
      <div className="flex justify-center border-b border-muted-foreground/20 mb-8">
        <button
          onClick={() => setView('posts')}
          className={`px-6 py-3 font-semibold border-b-2 transition-colors ${view === 'posts' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-primary'}`}
        >
          POSTS ({posts.length})
        </button>
        <button
          onClick={() => setView('about')}
          className={`px-6 py-3 font-semibold border-b-2 transition-colors ${view === 'about' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-primary'}`}
        >
          ABOUT
        </button>
      </div>

      <div>
        {view === 'about' ? (
          <AboutContent contentHtml={aboutContentHtml} />
        ) : (
          <div className="relative">
            <PostsList posts={displayedPosts} />
            <div ref={observerRef} style={{ height: '1px' }}/>
            <div className="absolute top-12 left-full ml-12 w-56 hidden xl:block">
              <RightSidebar posts={posts} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}