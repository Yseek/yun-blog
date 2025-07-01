"use client";

import { useState } from 'react';
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

  return (
    <div>
      {/* 프로필 카드와 탭은 기존 레이아웃을 그대로 유지합니다. */}
      <ProfileCard />
      <div className="flex justify-center border-b mb-8">
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
            <PostsList posts={posts} />
            
            <div className="absolute top-12 left-full ml-12 w-56 hidden xl:block">
              <RightSidebar posts={posts} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}