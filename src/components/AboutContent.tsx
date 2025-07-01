export function AboutContent({ contentHtml }: { contentHtml: string }) {
  return (
    <article
      className="prose dark:prose-invert max-w-none py-12 text-lg"
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
}