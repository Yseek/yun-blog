export interface Post {
  id: number;
  title: string;
  date: string;
  summary: string;
  tags: string[];
}

export const posts: Post[] = [
  {
    id: 1,
    title: 'Next.js와 Tailwind CSS로 블로그 만들기',
    date: '2024-05-28',
    summary: '이번 포스트에서는 Next.js와 Tailwind CSS를 사용하여 멋진 블로그를 만드는 과정을 알아봅니다. 기본적인 설정부터 시작하여...',
    tags: ['Next.js', 'Tailwind CSS', 'React'],
  },
  {
    id: 2,
    title: 'TypeScript, 왜 사용해야 할까?',
    date: '2024-05-25',
    summary: 'JavaScript의 슈퍼셋인 TypeScript의 장점과 도입했을 때 얻을 수 있는 이점에 대해 깊이 있게 탐구합니다.',
    tags: ['TypeScript', 'JavaScript'],
  },
  {
    id: 3,
    title: 'React의 상태 관리 라이브러리 비교',
    date: '2024-05-22',
    summary: 'Redux, MobX, Recoil, Zustand 등 다양한 React 상태 관리 라이브러리들의 특징을 비교하고 어떤 상황에 무엇을 사용하면 좋을지 알아봅니다.',
    tags: ['React', 'State Management'],
  },
];