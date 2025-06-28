import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { SearchInput } from './SearchInput';
import { Suspense } from 'react';

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
          <Suspense fallback={<div></div>}>
            <SearchInput />
          </Suspense>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}