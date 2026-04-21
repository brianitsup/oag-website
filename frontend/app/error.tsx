'use client';

import { useEffect } from 'react';
import { ErrorState } from '@/components/ui/ErrorState';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Next.js caught error:', error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <ErrorState 
        title="Application Error"
        message={error.message || "An unexpected error occurred."}
        retry={reset}
      />
    </div>
  );
}
