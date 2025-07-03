import Link from 'next/link';
import type { Post } from '@/lib/posts';

export function PostHeader({ post }: { post: Post }) {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-3">{post.title}</h1>
      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6 mt-6">
        <Link href="/" className="font-semibold hover:underline text-foreground">
          Yun
        </Link>
        <span>{post.date}</span>
      </div>
      <div className="flex flex-wrap gap-2 mt-6 mb-6">
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
      <hr className='text-muted-foreground mb-4'/>
    </div>
  );
}