"use client"; // 클라이언트 컴포넌트로 전환!

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PostPreview } from '@/components/PostPreview';
import { posts } from '@/posts';

export default function TagsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL 쿼리 파라미터에서 현재 선택된 태그를 가져옵니다.
  const selectedTag = searchParams.get('q');

  // 모든 태그 목록을 미리 준비합니다.
  const allTags = [...new Set(posts.flatMap(post => post.tags))];

  // 선택된 태그에 따라 보여줄 게시물을 필터링합니다.
  const filteredPosts = selectedTag
    ? posts.filter(post => post.tags.includes(selectedTag))
    : posts; // 태그가 선택되지 않으면 모든 글을 보여줍니다.

  const handleTagClick = (tag: string) => {
    // 페이지를 새로고침하는 대신 URL만 변경합니다.
    router.push(`/tags?q=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-center text-primary sm:text-5xl">
          Tags
        </h1>
        {/* 태그 목록 UI */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-4 py-2 rounded-full text-lg font-medium transition-colors
                ${selectedTag === tag 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-primary/80 hover:text-primary-foreground'
                }`
              }
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <hr className="my-12" />

      {/* 게시물 목록 UI */}
      <div className="space-y-8">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <PostPreview key={post.id} post={post} />
          ))
        ) : (
          <p>해당 태그를 가진 게시물이 없습니다.</p>
        )}
      </div>
    </div>
  );
}