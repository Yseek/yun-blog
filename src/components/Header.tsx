import Link from 'next/link';

export function Header() {
  return (
    <header className="py-8">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link href="/" className="text-2xl font-bold">
          Yun Blog
        </Link>
        <nav className="flex space-x-4">
          <Link href="/about" className="text-muted-foreground hover:text-foreground">
            About
          </Link>
          <Link href="/posts" className="text-muted-foreground hover:text-foreground">
            Posts
          </Link>
          {/* 다크 모드 토글 버튼 등 추가 가능 */}
        </nav>
      </div>
    </header>
  );
}