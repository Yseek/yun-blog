import { PostPreview } from '@/components/PostPreview';
import { posts } from '@/posts';

export default function Home() {
  return (
    <div className="py-12">
      <div className="space-y-8">
        {posts.map((post) => (
          <PostPreview key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}