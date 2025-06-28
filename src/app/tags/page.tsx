"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PostPreview } from '@/components/PostPreview';
import { posts } from '@/posts';

export default function TagsPage() {
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
              {tag}
            </Link>
          ))}
        </div>
      </div>
      <hr className="my-12" />
      <div className="space-y-8">
        {filteredPosts.map(post => (
          <PostPreview key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}