import { Suspense } from 'react';
import TagsContent from '@/components/TagsContent'; // 새로 만들 컴포넌트

export default function TagsPage() {
  return (
    <Suspense fallback={<div>Loading tags...</div>}>
      <TagsContent />
    </Suspense>
  );
}