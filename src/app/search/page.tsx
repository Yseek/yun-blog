"use client";

import { useSearchParams } from 'next/navigation';
import { PostPreview } from '@/components/PostPreview';
import { posts } from '@/posts';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(query.toLowerCase()) ||
    post.summary.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="py-12">
      <h1 className="text-3xl font-bold mb-8">
        Search results for: <span className="text-primary">{query}</span>
      </h1>
      <div>
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