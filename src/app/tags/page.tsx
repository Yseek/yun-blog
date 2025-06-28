import { Suspense } from 'react';
import TagsContent from '@/components/TagsContent'; // 새로 만들 컴포넌트

// 이 파일은 이제 서버 컴포넌트입니다. "use client"가 없습니다.
export default function TagsPage() {
  return (
    // Suspense로 클라이언트 전용 컴포넌트를 감싸줍니다.
    // fallback은 TagsContent가 로드될 동안 보여줄 UI입니다.
    <Suspense fallback={<div>Loading tags...</div>}>
      <TagsContent />
    </Suspense>
  );
}