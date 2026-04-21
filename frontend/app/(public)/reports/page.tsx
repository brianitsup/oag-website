import { getAllAuditReports } from "@/lib/strapi";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audit Reports",
  description: "Browse and download official audit reports published by the OAG.",
};

export const revalidate = 60;

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : '';
  const type = typeof resolvedParams.type === 'string' ? resolvedParams.type : '';

  // Build Strapi filters
  const filters: any = {};
  if (q) {
    filters.title = { $containsi: q };
  }
  if (type) {
    filters.reportType = { $eq: type };
  }

  const reports = await getAllAuditReports({ filters });

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 border-b pb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-4">Audit Reports</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Access our independent assessments of public sector administration and performance.
          </p>
        </div>

        {/* Filter Form */}
        <form className="flex flex-wrap gap-3 w-full md:w-auto">
          <input 
            type="text" 
            name="q" 
            placeholder="Search reports..." 
            defaultValue={q}
            className="flex h-10 w-full md:w-64 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <select 
            name="type" 
            defaultValue={type}
            className="flex h-10 w-full md:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">All Types</option>
            <option value="Financial">Financial</option>
            <option value="Performance">Performance</option>
            <option value="Compliance">Compliance</option>
            <option value="IT">IT</option>
          </select>
          <Button type="submit">Filter</Button>
          { (q || type) && (
            <Link href="/reports" className={buttonVariants({ variant: "ghost" })}>
              Clear
            </Link>
          )}
        </form>
      </div>

      {reports.data && reports.data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.data.map((report) => (
            <div key={report.id} className="border rounded-xl bg-card overflow-hidden hover:shadow-lg transition-all flex flex-col">
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
                    {report.reportType}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(report.reportDate || report.publishedAt).getFullYear()}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{report.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
                  {report.summary}
                </p>
                <Link href={`/reports/${report.slug}`} className={buttonVariants({ variant: "outline", className: "w-full mt-auto" })}>
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border rounded-xl bg-muted/10">
          <p className="text-muted-foreground text-lg">No reports found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
