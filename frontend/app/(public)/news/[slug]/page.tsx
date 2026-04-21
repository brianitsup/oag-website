import Image from "next/image";
import { getNewsBySlug, getStrapiURL } from "@/lib/strapi";
import { ErrorState } from "@/components/ui/ErrorState";
import Link from "next/link";
import { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await getNewsBySlug(resolvedParams.slug);
  return {
    title: article?.title || "News Article",
    description: article?.excerpt || "Read this news article from the OAG.",
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params;
  const article = await getNewsBySlug(resolvedParams.slug);

  if (!article) {
    return <ErrorState title="Article Not Found" message="The news article you are looking for does not exist." />;
  }

  const imageUrl = article.featuredImage?.url ? getStrapiURL(article.featuredImage.url) : null;

  return (
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-8">
        <Link href="/news" className="text-sm text-primary hover:underline flex items-center gap-2">
          &larr; Back to all news
        </Link>
      </div>

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold text-primary bg-primary/10">
            {article.category || "General News"}
          </span>
          <span className="text-muted-foreground text-sm">
            {new Date(article.date || article.publishedAt).toLocaleDateString()}
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
          {article.title}
        </h1>

        {article.author && (
          <p className="text-muted-foreground font-medium">By {article.author}</p>
        )}
      </header>

      {imageUrl && (
        <div className="w-full aspect-video md:aspect-[21/9] relative rounded-2xl overflow-hidden mb-12 shadow-sm border">
          <Image src={imageUrl} alt={article.title} fill className="object-cover" unoptimized />
        </div>
      )}

      <div className="prose prose-blue prose-lg max-w-none text-muted-foreground leading-relaxed">
        {article.content ? (
          Array.isArray(article.content) ? (
            article.content.map((block: any, i: number) => {
              if (block.type === 'paragraph') {
                return <p key={i} className="mb-6">{block.children?.map((c: any) => c.text).join('')}</p>;
              }
              // Basic handling for other blocks could go here
              return null;
            })
          ) : (
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          )
        ) : (
          <p>{article.excerpt}</p>
        )}
      </div>
    </article>
  );
}
