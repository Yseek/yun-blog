"use client";

import { Suspense } from 'react'; // Suspense를 import 합니다.
import { useSearchParams } from 'next/navigation';
import Link from 'next/link'; // <Link>를 다시 사용합니다.
import { PostPreview } from '@/components/PostPreview';
import { posts } from '@/posts';

// useSearchParams를 사용하는 실제 UI 로직을 별도의 컴포넌트로 분리합니다.
function TagsPageContent() {
  const searchParams = useSearchParams();
  const selectedTag = searchParams.get('q');
  const allTags = [...new Set(posts.flatMap(post => post.tags))];

  const filteredPosts = selectedTag
    ? posts.filter(post => post.tags.includes(selectedTag))
    : posts;

  return (
    <div className="py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-center text-primary sm:text-5xl">
          Tags
        </h1>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {allTags.map(tag => (
            <Link // button 대신 Link를 사용해야 URL이 제대로 변경됩니다.
              key={tag}
              href={`/tags?q=${encodeURIComponent(tag)}`}
              className={`px-4 py-2 rounded-full text-lg font-medium transition-colors
                ${selectedTag === tag 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-primary/80 hover:text-primary-foreground'
                }`
              }
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
      <hr className="my-12" />
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


// 이 부분이 페이지의 최종 형태가 됩니다.
export default function TagsPage() {
  return (
    // Suspense로 감싸주기만 하면 됩니다.
    <Suspense fallback={<div>Loading tags...</div>}>
      <TagsPageContent />
    </Suspense>
  );
}