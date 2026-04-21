import Image from "next/image";
import { getAllNews, getStrapiURL } from "@/lib/strapi";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "News & Updates",
  description: "Latest news and updates from the Office of the Auditor General.",
};

export const revalidate = 60;

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : '';

  const filters: any = {};
  if (q) {
    filters.title = { $containsi: q };
  }

  const news = await getAllNews({ filters });

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 border-b pb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-4">News & Updates</h1>
          <p className="text-muted-foreground text-lg">
            Stay informed with the latest press releases and announcements.
          </p>
        </div>

        <form className="flex gap-2 w-full md:w-auto">
          <input 
            type="text" 
            name="q" 
            placeholder="Search news..." 
            defaultValue={q}
            className="flex h-10 w-full md:w-64 rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <Button type="submit">Search</Button>
          {q && (
            <Link href="/news" className={buttonVariants({ variant: "ghost" })}>
              Clear
            </Link>
          )}
        </form>
      </div>

      {news.data && news.data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.data.map((article) => (
            <div key={article.id} className="border rounded-xl bg-card overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
              {article.featuredImage?.url ? (
                <div className="aspect-video bg-muted relative">
                  <Image 
                    src={getStrapiURL(article.featuredImage.url)} 
                    alt={article.featuredImage.alternativeText || article.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="aspect-video bg-primary/5 flex items-center justify-center">
                  <span className="text-primary/40 font-bold tracking-widest uppercase">OAG News</span>
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex gap-2 items-center mb-3">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                    {article.category || "General"}
                  </span>
                  <span className="text-xs text-muted-foreground">&bull;</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(article.date || article.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-bold text-xl mb-3 line-clamp-2">{article.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
                  {article.excerpt}
                </p>
                <Link href={`/news/${article.slug}`} className={buttonVariants({ variant: "ghost", className: "w-fit p-0 hover:bg-transparent text-primary hover:text-primary/80" })}>
                  Read Article &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border rounded-xl bg-muted/10">
          <p className="text-muted-foreground text-lg">No news articles found.</p>
        </div>
      )}
    </div>
  );
}
