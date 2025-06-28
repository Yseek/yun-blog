import { PostPreview } from '@/components/PostPreview';
import { posts } from '@/posts';
import type { Post } from '@/posts';

type Props = {
  params: {
    tag: string;
  };
};

// 1. generateStaticParams 함수 추가
// 이 함수는 빌드 시점에 모든 태그 경로를 미리 생성하도록 Next.js에 알려줍니다.
export async function generateStaticParams() {
  const allTags = [...new Set(posts.flatMap(post => post.tags))];
  
  return allTags.map(tag => ({
    tag: encodeURIComponent(tag),
  }));
}

export async function generateMetadata({ params }: Props) {
  const tag = decodeURIComponent(params.tag);
  return {
    title: `Posts tagged with "${tag}" | Yun Blog`,
  };
}

export default function TagPage({ params }: Props) {
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