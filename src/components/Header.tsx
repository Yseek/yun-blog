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
          <Link href="/tags" className="p-2 rounded-md hover:bg-muted" aria-label="Tags">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M9 5H2v7l6.29 6.29c.94.94 2.48.94 3.42 0l3.58-3.58c.94-.94.94-2.48 0-3.42L9 5Z"/>
              <path d="M6 9.01V9"/>
              <path d="m15 5 6.3 6.3a2.65 2.65 0 0 1 0 3.72L18.8 17.5"/>
            </svg>
          </Link>
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