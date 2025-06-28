import type { Metadata } from 'next';
import Link from 'next/link';
import { posts } from '@/posts';

export const metadata: Metadata = {
  title: 'Tags | Yun Blog',
  description: '블로그의 모든 태그 목록',
};

export default function TagsPage() {
  const allTags = [...new Set(posts.flatMap(post => post.tags))];

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
          Tags
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
          태그 별로 게시물을 모아보세요.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {allTags.map(tag => (
          <Link 
            key={tag} 
            href={`/tags/${encodeURIComponent(tag)}`}
            className="bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground px-4 py-2 rounded-full text-lg font-medium transition-colors"
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
}