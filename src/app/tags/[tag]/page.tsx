import { PostPreview } from '@/components/PostPreview';
import { posts } from '@/posts';
import type { Post } from '@/posts';

// 동적 메타데이터 생성
export async function generateMetadata({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag);
  return {
    title: `Posts tagged with "${tag}" | Yun Blog`,
  };
}

export default function TagPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag);
  const filteredPosts = posts.filter(post => post.tags.includes(tag));

  return (
    <div className="py-12">
      <h1 className="text-3xl font-bold mb-8">
        Posts tagged with: <span className="text-primary">{tag}</span>
      </h1>
      <div>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post: Post) => (
            <PostPreview key={post.id} post={post} />
          ))
        ) : (
          <p>해당 태그를 가진 게시물이 없습니다.</p>
        )}
      </div>
    </div>
  );
}