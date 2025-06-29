import { Suspense } from 'react';
import HomeContent from '@/components/HomeContent'; 

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading home...</div>}>
      <HomeContent />
    </Suspense>
  );
}