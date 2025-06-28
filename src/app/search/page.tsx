import { Suspense } from 'react';
import SearchContent from '@/components/SearchContent'; // 새로 만들 컴포넌트

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}