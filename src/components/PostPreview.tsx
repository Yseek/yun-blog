import Link from 'next/link';
import type { Post } from '@/posts';

export function PostPreview({ post }: { post: Post }) {
  return (
    <article>
      <Link href={`/posts/${post.id}`} className="hover:underline">
        <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
      </Link>
      <p className="text-muted-foreground text-sm mb-2">{post.date}</p>
      <p className="mb-4">{post.summary}</p>
      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Link 
            key={tag}
            href={`/tags?q=${encodeURIComponent(tag)}`}
            className="bg-muted text-muted-foreground text-xs font-semibold px-2.5 py-0.5 rounded-full hover:bg-primary hover:text-primary-foreground"
          >
            {tag}
          </Link>
        ))}
      </div>
    </article>
  );
}