import { getFunctionsData } from "@/lib/strapi";
import { ErrorState } from "@/components/ui/ErrorState";
import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Landmark,
  ClipboardCheck,
  TrendingUp,
  Building,
  Briefcase,
  Search,
  CheckCircle2,
  HelpCircle
} from "lucide-react";

export const metadata: Metadata = {
  title: "Core Functions & Responsibilities",
  description: "Learn about the core audit functions and constitutional responsibilities of the OAG.",
};

export const revalidate = 60;

const iconMap: Record<string, React.ReactNode> = {
  "landmark": <Landmark className="size-6" />,
  "clipboard-check": <ClipboardCheck className="size-6" />,
  "trending-up": <TrendingUp className="size-6" />,
  "building": <Building className="size-6" />,
  "briefcase": <Briefcase className="size-6" />,
  "search": <Search className="size-6" />,
};

export default async function FunctionsPage() {
  let functionsData;

  try {
    functionsData = await getFunctionsData();
  } catch (error) {
    console.error('Error fetching Functions page data:', error);
    return <ErrorState message="Content for the Functions page is currently unavailable." />;
  }

  if (!functionsData) {
    return <ErrorState message="Content for the Functions page is currently unavailable." />;
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      {/* Header Section */}
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          {functionsData.title || "Our Core Functions"}
        </h1>
        {functionsData.description && (
          <div className="max-w-3xl mx-auto text-lg text-muted-foreground leading-relaxed">
            {typeof functionsData.description === 'string' ? (
              <p>{functionsData.description}</p>
            ) : (
              // Fallback for blocks if ever used
              <div dangerouslySetInnerHTML={{ __html: JSON.stringify(functionsData.description) }} />
            )}
          </div>
        )}
      </div>

      {/* Functions Grid */}
      {functionsData.functions && functionsData.functions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {functionsData.functions.map((func) => (
            <Card key={func.id} className="group hover:shadow-lg transition-all duration-300 border-t-4 border-t-primary/20 hover:border-t-primary">
              <CardHeader className="pb-4">
                <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  {func.icon ? (iconMap[func.icon] || <CheckCircle2 className="size-6" />) : <CheckCircle2 className="size-6" />}
                </div>
                <CardTitle className="text-xl font-bold">{func.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {func.text}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed">
          <HelpCircle className="size-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Function details are being updated. Please check back soon.</p>
        </div>
      )}

      {/* Statutory Mandate Note */}
      <div className="mt-20 p-8 bg-primary/5 rounded-2xl border border-primary/10 flex flex-col md:flex-row items-center gap-8">
        <div className="size-16 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
          <Landmark className="size-8 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">Constitutional Mandate</h3>
          <p className="text-muted-foreground leading-relaxed">
            All functions of the Office of the Auditor General are carried out under the authority of Section 108 of the Constitution of Solomon Islands and the Public Finance Management Act. We are committed to providing independent assurance to the Parliament and the people of Solomon Islands.
          </p>
        </div>
      </div>
    </div>
  );
}
