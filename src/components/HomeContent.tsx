"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ProfileCard } from '@/components/ProfileCard';
import { AboutContent } from '@/components/AboutContent';
import { PostsList } from '@/components/PostsList';

export default function HomePage() {
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
      
      {/* 3. 탭에 따라 동적으로 바뀌는 컨텐츠 */}
      <div>
        {isAboutView ? <AboutContent /> : <PostsList />}
      </div>
    </div>
  );
}