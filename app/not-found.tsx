import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 p-6">
        <div className="flex flex-col items-center space-y-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Page Not Found
          </h2>
          <p className="text-center text-gray-600">
            The tenant or resource {`you're`} looking for {`doesn't`} exist or
            has been moved.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
