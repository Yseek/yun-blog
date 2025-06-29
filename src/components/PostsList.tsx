import { PostPreview } from '@/components/PostPreview';
import type { Post } from '@/lib/posts'; // lib/posts.ts 또는 다른 곳에서 타입을 가져옵니다.

// posts를 props로 받도록 수정
export function PostsList({ posts }: { posts: Post[] }) {
  return (
    <div className="space-y-8 py-12">
      {posts.map((post) => (
        <PostPreview key={post.id} post={post} />
      ))}
    </div>
  );
}