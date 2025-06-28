"use client"; // Header 자체도 클라이언트 컴포넌트로 만드는 것이 안전합니다.

import Link from 'next/link';
import dynamic from 'next/dynamic'; // dynamic import를 가져옵니다.

const SearchInput = dynamic(() => import('@/components/SearchInput').then(mod => mod.SearchInput), { ssr: false });
const ThemeToggle = dynamic(() => import('@/components/ThemeToggle').then(mod => mod.ThemeToggle), { ssr: false });

export function Header() {
  return (
    <header className="py-6">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link href="/" className="text-2xl font-bold">
          Yun Blog
        </Link>
        <div className="flex items-center space-x-4">
          <nav className="hidden sm:flex space-x-4">
            <Link href="/about" className="text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link href="/posts" className="text-muted-foreground hover:text-foreground">
              Posts
            </Link>
            <Link href="/tags" className="text-muted-foreground hover:text-foreground">
              Tags
            </Link>
          </nav>
          <SearchInput />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}