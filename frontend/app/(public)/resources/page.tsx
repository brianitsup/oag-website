import { getResources, getStrapiURL } from "@/lib/strapi";
import { Button, buttonVariants } from "@/components/ui/button";
import { Metadata } from "next";
import { ErrorState } from "@/components/ui/ErrorState";

export const metadata: Metadata = {
  title: "Resources & Guidelines",
  description: "Download official guidelines, manuals, and templates.",
};

export const revalidate = 60;

export default async function ResourcesPage() {
  let resources;

  try {
    resources = await getResources();
  } catch (error) {
    console.error('Error fetching resources:', error);
    return <ErrorState message="Resources are temporarily unavailable. Please try again shortly." />;
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-4">Resources</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Access our library of official guidelines, operational manuals, and templates designed to promote better public sector administration.
        </p>
      </div>

      {resources.data && resources.data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.data.map((resource) => (
            <div key={resource.id} className="border bg-card p-6 rounded-xl shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
                  {resource.category || "General"}
                </span>
              </div>
              <h3 className="font-bold text-xl mb-2">{resource.title}</h3>
              <p className="text-muted-foreground text-sm mb-6 flex-1">{resource.description}</p>
              
              {resource.file?.url ? (
                <a href={getStrapiURL(resource.file.url)} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "outline", className: "w-fit" })}>
                  Download File
                </a>
              ) : (
                <Button disabled variant="outline" className="w-fit">
                  File Unavailable
                </Button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border rounded-xl bg-muted/10">
          <p className="text-muted-foreground text-lg">No resources available at this moment.</p>
        </div>
      )}
    </div>
  );
}
