import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'src', 'posts');

export interface Post {
  id: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  // contentHtml은 getPostData에서만 사용되므로 선택적으로 포함할 수 있습니다.
  contentHtml?: string; 
}

export function getSortedPostsData() {
  // posts 디렉터리의 파일 이름들을 가져옵니다.
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName !== 'about.md')
    .map((fileName) => {
    const id = fileName.replace(/\.md$/, '');

    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const matterResult = matter(fileContents);

    return {
      id,
      ...(matterResult.data as { title: string; date: string; summary: string; tags: string[] }),
    };
  });

  // 날짜순으로 게시물을 정렬합니다.
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getAboutContent() {
  const fullPath = path.join(postsDirectory, 'about.md');
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();
  return {
    contentHtml,
    ...(matterResult.data as { title: string }),
  };
}

export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // gray-matter를 사용하여 메타데이터를 파싱합니다.
  const matterResult = matter(fileContents);

  // remark를 사용하여 마크다운을 HTML로 변환합니다.
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // 데이터를 id 및 contentHtml과 함께 합칩니다.
  return {
    id,
    contentHtml,
    ...(matterResult.data as { title: string; date: string; summary: string; tags: string[] }),
  };
}

export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames.map((fileName) => {
        return {
            params: {
                id: fileName.replace(/\.md$/, ''),
            },
        };
    });
}