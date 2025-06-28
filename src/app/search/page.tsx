import { Suspense } from 'react';
import SearchContent from '@/components/SearchContent'; // 새로 만들 컴포넌트

export default function SearchPage() {
  return (
    // Suspense로 감싸서 "내용물은 나중에 채울게!" 라고 Next.js에 알려줍니다.
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}