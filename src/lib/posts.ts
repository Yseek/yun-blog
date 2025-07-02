import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from 'rehype-slug';
import { visit } from 'unist-util-visit';
import { toText } from 'hast-util-to-text';
import { type Element, type Root } from 'hast';

const postsDirectory = path.join(process.cwd(), 'src', 'posts');

export interface Heading {
  level: number;
  id: string;
  text: string;
}

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
  const fullPath = path.join(postsDirectory, "about.md");
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(remarkRehype)
    .use(rehypePrettyCode)
    .use(rehypeStringify)
    .process(matterResult.content);

  const contentHtml = processedContent.toString();
  return {
    contentHtml,
    ...(matterResult.data as { title: string }),
  };
}

export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const matterResult = matter(fileContents);

  // 헤딩 목록을 저장할 배열
  const headings: Heading[] = [];

  const processedContent = await remark()
    .use(remarkRehype, { allowDangerousHtml: true }) // allowDangerousHtml 옵션 추가
    .use(rehypeSlug) // 헤딩에 id 추가
    .use(() => (tree: Root) => { // 헤딩 추출 로직 추가
      visit(tree, 'element', (node: Element) => {
        if (['h1', 'h2', 'h3'].includes(node.tagName)) {
          headings.push({
            level: parseInt(node.tagName.substring(1), 10),
            id: node.properties?.id as string,
            text: toText(node),
          });
        }
      });
    })
    .use(rehypePrettyCode) // 옵션 전달 방식 수정
    .use(rehypeStringify, { allowDangerousHtml: true }) // allowDangerousHtml 옵션 추가
    .process(matterResult.content);

  const contentHtml = processedContent.toString();

  // 이전/다음 게시물 정보 추가
  const allPosts = getSortedPostsData();
  const postIndex = allPosts.findIndex((p) => p.id === id);

  // 날짜 내림차순 정렬이므로, index가 작을수록 최신 게시물입니다.
  const nextPost = postIndex > 0 ? allPosts[postIndex - 1] : null;
  const previousPost = postIndex < allPosts.length - 1 ? allPosts[postIndex + 1] : null;

  return {
    id,
    contentHtml,
    headings, // 추출한 headings 반환
    previousPost,
    nextPost,
    ...(matterResult.data as {
      title: string;
      date: string;
      summary: string;
      tags: string[];
    }),
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