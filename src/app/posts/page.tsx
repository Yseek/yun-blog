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
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
          All Posts
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
          제가 작성한 모든 글들을 확인해보세요.
        </p>
      </div>
      
      <div>
        {posts.map((post) => (
          <PostPreview key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}