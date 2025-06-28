import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

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
          <Link href="/search" className="p-2 rounded-md hover:bg-muted" aria-label="Search">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}