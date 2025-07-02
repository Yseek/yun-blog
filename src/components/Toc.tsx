"use client";

import { useState, useEffect, useRef } from 'react';
import type { Heading } from '@/lib/posts';

export function Toc({ headings, proseContainerId }: { headings: Heading[]; proseContainerId: string }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [positionStyle, setPositionStyle] = useState<React.CSSProperties>({});
  const tocRef = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const proseContainer = document.getElementById(proseContainerId);
    console.log("proseContainer" , proseContainer);
    if (!proseContainer) return;

    const calculatePosition = () => {
      const proseRect = proseContainer.getBoundingClientRect();
      const leftPosition = proseRect.right + 60;
      
      if (leftPosition + 256 < window.innerWidth) {
        setPositionStyle({
          position: 'fixed',
          top: '6rem',
          left: `${leftPosition}px`,
          display: 'block',
        });
      } else {
        setPositionStyle({ display: 'none' });
      }
    };

    calculatePosition();
    window.addEventListener('resize', calculatePosition);

    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(
      (entries) => {
        const visibleHeadings = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        
        if (visibleHeadings.length > 0) {
          setActiveId(visibleHeadings[0].target.id);
        }
      },
      { rootMargin: '0px 0px -80% 0px' }
    );
    const elements = headings.map(({ id }) => document.getElementById(id)).filter(Boolean);
    elements.forEach((el) => observer.current?.observe(el!));

    return () => {
      window.removeEventListener('resize', calculatePosition);
      observer.current?.disconnect();
    };
  }, [headings, proseContainerId]);

  if (headings.length === 0) return null;

  return (
    <div ref={tocRef} style={positionStyle} className="w-64">
      <nav className="max-h-[calc(100vh-8rem)] overflow-y-auto">
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
    </div>
  );
}