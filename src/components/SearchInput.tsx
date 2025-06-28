"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // URL의 쿼리 파라미터로 input의 초기 상태를 설정합니다.
  const [query, setQuery] = useState(searchParams.get('q') || '');

  // 디바운싱을 위한 useEffect
  useEffect(() => {
    // 300ms 지연을 시키는 타이머를 설정합니다.
    const timer = setTimeout(() => {
      // 현재 경로가 /search가 아닐 때만 /search로 이동시킵니다.
      // 이미 /search 페이지에 있다면, URL의 쿼리 파라미터만 교체(replace)합니다.
      if (query) {
        if (pathname !== '/search') {
          router.push(`/search?q=${query}`);
        } else {
          router.replace(`/search?q=${query}`);
        }
      } else if (pathname === '/search') {
        // 검색어가 비어있고 현재 페이지가 /search라면, 검색어 없는 페이지로 이동합니다.
        router.push('/search');
      }
    }, 300); // 300ms 후에 실행

    // 이 useEffect가 다시 실행되기 전에 이전 타이머를 취소합니다.
    // (사용자가 타이핑을 계속하는 동안에는 API 호출이 일어나지 않도록 함)
    return () => clearTimeout(timer);
  }, [query, pathname, router]);


  return (
    <input
      type="search"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="검색..."
      className="px-2 py-1 rounded-md border bg-transparent text-sm w-32 focus:w-40 transition-all"
    />
  );
}