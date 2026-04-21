import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getHomeData } from "@/lib/strapi";
import { getStrapiURL } from "@/lib/strapi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ErrorState } from "@/components/ui/ErrorState";
import { FileText, ArrowRight } from "lucide-react";

export const revalidate = 60; // ISR revalidation

export default async function Home() {
  let homeData;
  try {
    homeData = await getHomeData();
  } catch (error) {
    return <ErrorState message="Could not connect to the Strapi backend. Is it running?" />;
  }

  // Fallback hero data
  const title = homeData?.heroTitle || "Ensuring Transparency & Accountability";
  const subtitle = homeData?.heroSubtitle || "The Office of the Auditor General is the Supreme Audit Institution of the Solomon Islands, dedicated to promoting good governance.";
  
  const heroImageUrl = homeData?.heroImage?.url 
    ? getStrapiURL(homeData.heroImage.url)
    : null;

  return (
    <div className="flex flex-col">
      {/* ── Hero Section ────────────────────────────────── */}
      <section className="bg-primary/5 py-24 relative overflow-hidden">
        {heroImageUrl && (
          <div className="absolute inset-0 z-0 opacity-10">
            <Image src={heroImageUrl} alt="Hero Background" fill className="object-cover" unoptimized />
          </div>
        )}
        <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/reports" className={buttonVariants({ size: "lg" })}>
              View Latest Audit Reports
            </Link>
            <Link href="/about" className={buttonVariants({ variant: "outline", size: "lg" })}>
              Learn About Our Mission
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Section ────────────────────────────────── */}
      {homeData?.stats && homeData.stats.length > 0 && (
        <section className="py-12 border-b bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {homeData.stats.map(stat => (
                <div key={stat.id} className="space-y-1">
                  <p className="text-4xl font-bold text-primary">{stat.value}</p>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Audit Reports Section ───────────────── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div className="space-y-2">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border-none px-3">Latest Publications</Badge>
              <h2 className="text-3xl font-bold tracking-tight">Featured Audit Reports</h2>
              <p className="text-muted-foreground">Access our latest independent assessments and reviews.</p>
            </div>
            <Link href="/reports" className={buttonVariants({ variant: "outline", className: "group" })}>
              View All Reports <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {homeData?.featuredReports && homeData.featuredReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {homeData.featuredReports.map(report => (
                <Card key={report.id} className="group hover:border-primary/50 transition-colors flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <FileText className="size-5" />
                      </div>
                      <Badge variant="secondary" className="text-[10px] uppercase font-bold">{report.reportType}</Badge>
                    </div>
                    <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors leading-snug">
                      {report.title}
                    </CardTitle>
                    <CardDescription className="text-xs font-medium">
                      Published: {new Date(report.reportDate || report.publishedAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {report.summary}
                    </p>
                    <div className="mt-6">
                      <Link href={`/reports/${report.slug}`} className="text-sm font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read Report Details <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-2xl bg-muted/10">
              <p className="text-muted-foreground">No featured reports currently selected.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Latest News Section ──────────────────────────── */}
      <section className="py-20 bg-muted/30 border-y">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">News & Updates</h2>
              <p className="text-muted-foreground">Stay informed with the latest from the OAG.</p>
            </div>
            <Link href="/news" className={buttonVariants({ variant: "link", className: "text-primary" })}>
              View all news &rarr;
            </Link>
          </div>
          
          {homeData?.featuredNews && homeData.featuredNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {homeData.featuredNews.map(article => (
                <div key={article.id} className="group bg-background border rounded-xl overflow-hidden flex flex-col hover:shadow-lg transition-all border-transparent hover:border-primary/20">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {article.featuredImage?.url ? (
                      <Image 
                        src={getStrapiURL(article.featuredImage.url)} 
                        alt={article.featuredImage.alternativeText || article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="size-full flex items-center justify-center bg-primary/5 text-primary/30 font-bold uppercase tracking-widest text-xs">
                        OAG News
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-primary border-primary/20">{article.category || "General"}</Badge>
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(article.date || article.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-3 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-6">
                      {article.excerpt}
                    </p>
                    <div className="mt-auto">
                      <Link href={`/news/${article.slug}`} className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">
                        Read Story
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">No recent news available at this time.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
