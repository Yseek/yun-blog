import { PostHeader } from '@/components/PostHeader';
import { ProfileCard } from '@/components/ProfileCard';
import { getPostData, getAllPostIds } from '@/lib/posts';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths.map(path => ({
    id: path.params.id,
  }));
}

export default async function Post({ params: paramsPromise }: Props) {
  const params = await paramsPromise;
  const { id } = params;

  const postData = await getPostData(id);

  if (!postData) {
    notFound();
  }

  return (
    <article className="prose dark:prose-invert max-w-none py-12">
      <PostHeader post={postData} />
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      <ProfileCard />
      <hr className="border-muted/30" />
    </article>
  );
}