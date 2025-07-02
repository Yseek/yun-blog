"use client";

import { useState, useEffect, useRef } from 'react';
import type { Heading } from '@/lib/posts';

export function Toc({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(
      (entries) => {
        const visibleHeadings = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        
        if (visibleHeadings.length > 0) {
          setActiveId(visibleHeadings[0].target.id);
        }
      },
      { rootMargin: '0px 0px -75% 0px' } 
    );

    const elements = headings.map(({ id }) => document.getElementById(id)).filter(Boolean);
    elements.forEach((el) => observer.current?.observe(el!));

    return () => observer.current?.disconnect();
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="sticky top-24 ml-12 w-64">
      <ul className="space-y-2">
        {headings.map(({ id, text, level }) => (
          <li key={id} style={{ marginLeft: `${(level - 1) * 0.75}rem` }}>
            <a
              href={`#${id}`}
              className={`block py-1 transition-colors ${
                activeId === id
                  ? 'text-primary font-bold'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}