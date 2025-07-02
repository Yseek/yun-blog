import { PostHeader } from '@/components/PostHeader';
import { ProfileCard } from '@/components/ProfileCard';
import { Toc } from '@/components/Toc';
import { getPostData, getAllPostIds } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Giscus from '@/components/Giscus';

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
    <div>
      <article className="py-12">
        <PostHeader post={postData} />
        <div 
          id="prose-content"
          className="prose dark:prose-invert max-w-none mt-8"
          dangerouslySetInnerHTML={{ __html: postData.contentHtml || '' }}
        />
        <div className='mt-16'>
          <ProfileCard />
        </div>
        <div className="mt-16">
          <Giscus />
        </div>
      </article>
      <Toc headings={postData.headings || []} proseContainerId="prose-content" />
    </div>
  );
}