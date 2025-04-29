"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 p-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-center text-2xl font-bold text-gray-900">
          Something went wrong
        </h2>
        <p className="text-center text-gray-600">
          We encountered an error while processing your request. Our team has
          been notified.
        </p>
        {error.digest && (
          <p className="text-center text-xs text-gray-500">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex justify-center">
          <Button onClick={reset} className="px-4 py-2">
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
