import { getOpportunities, getStrapiURL } from "@/lib/strapi";
import { Button, buttonVariants } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Opportunities",
  description: "Job openings and tender opportunities at the Office of the Auditor General.",
};

export const revalidate = 60;

export default async function OpportunitiesPage() {
  const opps = await getOpportunities();

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-12 border-b pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-4">Opportunities</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Join our team or partner with us. Browse current job openings and active tenders.
        </p>
      </div>

      {opps.data && opps.data.length > 0 ? (
        <div className="space-y-6">
          {opps.data.map((opp) => {
            const isExpired = new Date(opp.deadline) < new Date();
            
            return (
              <div key={opp.id} className={`border p-6 md:p-8 rounded-xl bg-card shadow-sm flex flex-col md:flex-row gap-6 ${isExpired ? 'opacity-60' : ''}`}>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded ${opp.type === 'Job' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {opp.type}
                    </span>
                    {isExpired ? (
                      <span className="text-xs font-semibold text-destructive px-2 py-1 bg-destructive/10 rounded">Closed</span>
                    ) : (
                      <span className="text-xs font-medium text-muted-foreground">
                        Deadline: {new Date(opp.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-2xl mb-3">{opp.title}</h3>
                  
                  <div className="prose prose-sm prose-blue text-muted-foreground mb-4 max-w-none line-clamp-3">
                    {typeof opp.description === 'string' ? opp.description : 'Details available in the attached document.'}
                  </div>
                </div>
                
                <div className="md:border-l md:pl-6 flex flex-col justify-center shrink-0">
                  {opp.attachment?.url ? (
                    <a href={getStrapiURL(opp.attachment.url)} target="_blank" rel="noopener noreferrer" className={buttonVariants({ size: "lg", variant: isExpired ? "outline" : "default" })}>
                      {isExpired ? 'View Document' : 'Apply / Download Details'}
                    </a>
                  ) : (
                    <Button disabled size="lg">No Document Attached</Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 border rounded-xl bg-muted/10">
          <p className="text-muted-foreground text-lg">There are currently no open opportunities.</p>
        </div>
      )}
    </div>
  );
}
