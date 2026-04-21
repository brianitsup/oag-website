import { Suspense } from "react";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { getAllAuditReports } from "@/lib/strapi";

async function TestData() {
  const reports = await getAllAuditReports({ pagination: { limit: 1 } });
  
  return (
    <div className="p-4 border rounded-md bg-muted/10 mt-4">
      <h3 className="font-bold mb-2">Strapi Connection Successful!</h3>
      <p>Fetched {reports.data?.length || 0} reports.</p>
      <pre className="text-xs bg-black text-green-400 p-4 rounded mt-4 overflow-auto">
        {JSON.stringify(reports, null, 2)}
      </pre>
    </div>
  );
}

export default function TestPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">System Test Page</h1>
      
      <h2 className="text-xl font-semibold mt-8 mb-4">1. Loading State UI</h2>
      <div className="border rounded-xl p-4 bg-card">
        <LoadingState />
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4">2. Error State UI</h2>
      <ErrorState 
        title="Simulated Error" 
        message="This is how an error will look when Strapi is unreachable or data fails to load."
      />

      <h2 className="text-xl font-semibold mt-8 mb-4">3. Live Fetch Test</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Below component uses React Suspense to show a loader while fetching from Strapi API.
      </p>
      
      <Suspense fallback={<LoadingState />}>
        <TestData />
      </Suspense>
    </div>
  );
}
