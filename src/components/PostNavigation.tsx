import Link from 'next/link';
import { Post } from '@/lib/posts';

type PostNavigationProps = {
  previousPost: Post | null;
  nextPost: Post | null;
};

export const PostNavigation = ({ previousPost, nextPost }: PostNavigationProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-18 mb-4">
      <div className="text-left">
        {previousPost && (
          <Link href={`/posts/${previousPost.id}`}>
            <div className="p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <p className="text-sm text-gray-500 dark:text-gray-400">이전 글</p>
              <p className="font-semibold">{previousPost.title}</p>
            </div>
          </Link>
        )}
      </div>
      <div className="text-right">
        {nextPost && (
          <Link href={`/posts/${nextPost.id}`}>
            <div className="p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <p className="text-sm text-gray-500 dark:text-gray-400">다음 글</p>
              <p className="font-semibold">{nextPost.title}</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};