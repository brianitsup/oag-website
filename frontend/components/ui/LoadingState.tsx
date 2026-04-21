import { Skeleton } from "./skeleton";

export function LoadingState() {
  return (
    <div className="w-full space-y-4 p-4">
      <Skeleton className="h-10 w-[250px]" />
      <Skeleton className="h-4 w-[300px]" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
