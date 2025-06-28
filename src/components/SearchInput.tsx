"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SearchInput() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${query.trim()}`);
    }
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="검색..."
        className="px-2 py-1 rounded-md border bg-transparent text-sm w-32 focus:w-40 transition-all"
      />
    </form>
  );
}