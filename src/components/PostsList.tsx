import { PostPreview } from '@/components/PostPreview';
import { posts } from '@/posts';

export function PostsList() {
  return (
    <div className="space-y-8 py-12">
      {posts.map((post) => (
        <PostPreview key={post.id} post={post} />
      ))}
    </div>
  );
}