"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ProfileCard } from '@/components/ProfileCard';
import { AboutContent } from '@/components/AboutContent';
import { PostsList } from '@/components/PostsList';
import type { Post } from '@/lib/posts';

export default function HomeContent({ posts }: { posts: Post[] }) {
  const searchParams = useSearchParams();
  const view = searchParams.get('view');

  const isAboutView = view === 'about';

  return (
    <div>
      <ProfileCard />

      <div className="flex justify-center border-b mb-8">
        <Link
          href="/"
          className={`px-6 py-3 font-semibold border-b-2 transition-colors
            ${!isAboutView
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-primary'
            }`
          }
        >
          POSTS
        </Link>
        <Link
          href="/?view=about"
          className={`px-6 py-3 font-semibold border-b-2 transition-colors
            ${isAboutView
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-primary'
            }`
          }
        >
          ABOUT
        </Link>
      </div>

      <div>
        {isAboutView ? <AboutContent /> : <PostsList posts={posts} />}
      </div>
    </div>
  );
}