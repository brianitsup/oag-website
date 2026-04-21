import Image from "next/image";
import { getAuditReportBySlug, getStrapiURL } from "@/lib/strapi";
import { ErrorState } from "@/components/ui/ErrorState";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const report = await getAuditReportBySlug(resolvedParams.slug);
  return {
    title: report?.title || "Audit Report",
    description: report?.summary || "Read this audit report from the OAG.",
  };
}

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params;
  const report = await getAuditReportBySlug(resolvedParams.slug);

  if (!report) {
    return <ErrorState title="Report Not Found" message="The report you are looking for does not exist or has been removed." />;
  }

  const fileUrl = report.fullReport?.url ? getStrapiURL(report.fullReport.url) : null;
  const coverUrl = report.coverImage?.url ? getStrapiURL(report.coverImage.url) : null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <Link href="/reports" className="text-sm text-primary hover:underline flex items-center gap-2">
          &larr; Back to all reports
        </Link>
      </div>

      <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
        {coverUrl && (
          <div className="w-full h-64 md:h-80 relative bg-muted">
            <Image src={coverUrl} alt={report.title} fill className="object-cover" unoptimized />
          </div>
        )}
        
        <div className="p-8 md:p-12">
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold bg-primary/10 text-primary">
              {report.reportType}
            </span>
            <span className="inline-flex items-center rounded-full border px-3 py-1 text-sm text-muted-foreground bg-muted/50">
              Published: {new Date(report.reportDate || report.publishedAt).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-8">
            {report.title}
          </h1>

          <div className="prose prose-blue max-w-none mb-10">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Executive Summary</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {report.summary}
            </p>
          </div>

          {fileUrl ? (
            <div className="bg-muted/30 p-6 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
                  PDF
                </div>
                <div>
                  <p className="font-semibold text-foreground">Full Report Document</p>
                  <p className="text-sm text-muted-foreground">Download to read the complete audit details.</p>
                </div>
              </div>
              <a href={fileUrl} target="_blank" rel="noopener noreferrer" className={buttonVariants({ size: "lg", className: "w-full sm:w-auto shrink-0" })}>
                Download PDF
              </a>
            </div>
          ) : (
            <div className="bg-muted/30 p-6 rounded-xl border text-center text-muted-foreground">
              <p>The full report document is not available for download at this time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
