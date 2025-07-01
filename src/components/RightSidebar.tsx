import Link from 'next/link';
import type { Post } from '@/lib/posts';

export function RightSidebar({ posts }: { posts: Post[] }) {
  const allTags = [...new Set(posts.flatMap(post => post.tags))].sort();

  const tagCounts: { [key: string]: number } = {};
  allTags.forEach(tag => {
    tagCounts[tag] = posts.filter(p => p.tags.includes(tag)).length;
  });

  return (
    <aside className="sticky top-24 h-screen">
      <h2 className="text-lg font-bold mb-4">TAG LIST</h2>
      <ul className="space-y-2">
        <li>
          <Link href="/tags/" className="text-muted-foreground hover:text-primary transition-colors">
            all ({posts.length})
          </Link>
        </li>
        {allTags.map(tag => (
          <li key={tag}>
            <Link
              href={`/tags/?q=${encodeURIComponent(tag)}`}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {tag} ({tagCounts[tag]})
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}