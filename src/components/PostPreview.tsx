import Link from 'next/link';

export interface Post {
    id: string;
    title: string;
    date: string;
    summary: string;
    tags: string[];
}

export function PostPreview({ post }: { post: Post }) {
  return (
    <article className='mb-12'>
      <Link href={`/posts/${post.id}`} className="hover:underline">
        <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
      </Link>
      <p className="text-muted-foreground text-sm mb-4">{post.date}</p>
      <p className="mb-6">{post.summary}</p>
      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Link
            key={tag}
            href={`/tags?q=${encodeURIComponent(tag)}`}
            className="bg-muted text-muted-foreground text-xs px-2.5 py-0.5 rounded-full hover:bg-primary hover:text-primary-foreground"
          >
            {tag}
          </Link>
        ))}
      </div>
      <hr className='mt-16 border-muted-foreground/20'/>
    </article>
  );
}