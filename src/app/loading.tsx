import * as React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex flex-col items-center gap-2 justify-center">
      <Loader2 className="animate-spin h-8 w-8 text-red-700" />
      <h3 className="font-semibold text-xl">Loading...</h3>
    </div>
  );
}
