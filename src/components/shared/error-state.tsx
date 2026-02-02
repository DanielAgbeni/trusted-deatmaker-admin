import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";

interface ErrorData {
  success?: boolean;
  message?: string;
  timestamp?: string;
  [key: string]: any;
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  errorData?: ErrorData | null;
  retry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Error",
  message,
  errorData,
  retry,
  className,
}: ErrorStateProps) {
  // Determine the error message to display
  // Priority: Direct message prop > errorData.message > Generic fallback
  const displayMessage =
    message || errorData?.message || "An unexpected system error occurred";

  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2 flex flex-col gap-4">
        <p>{displayMessage}</p>
        
        {retry && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={retry} 
            className="w-fit gap-2 border-destructive/20 text-destructive hover:bg-destructive/10"
          >
            <RefreshCcw className="h-4 w-4" />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
