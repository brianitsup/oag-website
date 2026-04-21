import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Button } from "./button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  retry?: () => void;
}

export function ErrorState({ 
  title = "Error", 
  message = "Something went wrong while fetching data. Please try again later.",
  retry 
}: ErrorStateProps) {
  return (
    <Alert variant="destructive" className="max-w-xl mx-auto my-8">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2 flex flex-col gap-4">
        <p>{message}</p>
        {retry && (
          <Button variant="outline" size="sm" onClick={retry} className="w-fit border-destructive/20 hover:bg-destructive/10">
            Try again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
