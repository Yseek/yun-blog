import type { Metadata } from 'next';
import { PostPreview } from '@/components/PostPreview';
import { posts } from '@/posts';

export const metadata: Metadata = {
  title: 'All Posts | Yun Blog',
  description: '전체 게시물 목록',
};

export default function PostsPage() {
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