import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { ErrorState } from '@/components/ui/ErrorState';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h2 className="text-6xl font-extrabold text-primary mb-4">404</h2>
      <ErrorState 
        title="Page Not Found"
        message="The page you are looking for doesn't exist or has been moved."
      />
      <Link href="/" className={buttonVariants({ size: "lg", className: "mt-8" })}>
        Return to Homepage
      </Link>
    </div>
  );
}
