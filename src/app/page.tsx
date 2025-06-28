import { PostPreview } from '@/components/PostPreview';
import { posts } from '@/posts';

export default function Home() {
  return (
    <div>
      {posts.map((post) => (
        <PostPreview key={post.id} post={post} />
      ))}
    </div>
  );
}