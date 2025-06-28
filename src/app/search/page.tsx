"use client";

import { useState } from 'react';
import { PostPreview } from '@/components/PostPreview';
import { posts } from '@/posts';

export default function SearchPage() {
  // 검색어를 관리하기 위한 상태(state)
  const [query, setQuery] = useState('');

  // 사용자가 입력할 때마다 query 상태에 따라 실시간으로 게시물을 필터링합니다.
  const filteredPosts = query
    ? posts.filter(post =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.summary.toLowerCase().includes(query.toLowerCase())
      )
    : []; // 처음에는 아무것도 보여주지 않습니다.

  return (
    <div className="py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
          Search Posts
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
          블로그의 모든 글을 검색해보세요.
        </p>
        
        {/* 검색 입력창 */}
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

      {/* 동적 검색 결과 */}
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