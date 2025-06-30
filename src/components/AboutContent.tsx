export function AboutContent({ contentHtml }: { contentHtml: string }) {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article
          className="prose dark:prose-invert max-w-none text-lg"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
    </div>
  );
}