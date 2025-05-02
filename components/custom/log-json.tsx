"use client";

import { useState } from "react";
import { Code, X } from "lucide-react";
import { cn } from "@/lib/utils";

type LogJSONProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  iconSize?: number;
  className?: string;
};

export default function LogJSON({
  data,
  position = "bottom-right",
  iconSize = 24,
  className,
}: LogJSONProps) {
  const [isOpen, setIsOpen] = useState(false);

  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
  };

  return (
    <>
      {/* Floating Icon Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed z-50 flex items-center justify-center rounded-full bg-slate-800 p-3 text-white shadow-lg transition-all hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2",
          positionClasses[position],
          className,
        )}
        aria-label="View JSON data"
      >
        <Code size={iconSize} />
      </button>

      {/* JSON Viewer Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-auto rounded-lg bg-white p-6 shadow-xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
              aria-label="Close JSON viewer"
            >
              <X size={24} />
            </button>
            <h3 className="mb-4 text-lg font-medium">JSON Data</h3>
            <div className="rounded-md bg-slate-50 p-4">
              <pre className="max-h-[70vh] overflow-auto text-sm text-slate-800">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
