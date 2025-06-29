"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PostPreview } from '@/components/PostPreview';
import type { Post } from '@/lib/posts'; // 타입만 import

// props로 posts를 받도록 수정
export default function TagsContent({ posts }: { posts: Post[] }) {
  const searchParams = useSearchParams();
  const selectedTag = searchParams.get('q');

  // allTags와 tagCounts는 props로 받은 posts를 기반으로 계산
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

  return (
    <div className="py-12">
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
            {filteredPosts.map(post => (
                <PostPreview key={post.id} post={post} />
            ))}
        </div>
    </div>
  );
}