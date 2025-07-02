'use client';

import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';

const Giscus = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  const giscusAttributes = {
    src: 'https://giscus.app/client.js',
    'data-repo': 'Yseek/yun-blog',
    'data-repo-id': 'R_kgDOPDM01g',
    'data-category': 'Announcements',
    'data-category-id': 'DIC_kwDOPDM01s4CsXaA',
    'data-mapping': 'pathname',
    'data-strict': '0',
    'data-reactions-enabled': '1',
    'data-emit-metadata': '0',
    'data-input-position': 'bottom',
    'data-lang': 'ko',
    crossOrigin: 'anonymous',
    async: 'true',
  };

  useEffect(() => {
    if (!ref.current) return;

    const giscus = document.createElement('script');
    const theme = resolvedTheme === 'dark' ? 'dark_dimmed' : 'light';

    Object.entries({ ...giscusAttributes, 'data-theme': theme }).forEach(
      ([key, value]) => {
        giscus.setAttribute(key, value);
      }
    );
    
    while (ref.current.firstChild) {
      ref.current.removeChild(ref.current.firstChild);
    }

    ref.current.appendChild(giscus);
  }, [resolvedTheme]);

  return <div ref={ref} />;
};

export default Giscus;