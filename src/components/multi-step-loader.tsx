"use client";
import React, { useState, useEffect } from "react";
import { MultiStepLoader as Loader } from "./ui/multi-step-loader";
import { IconSquareRoundedX } from "@tabler/icons-react";

// Define the loading steps
const loadingStates = [
  { text: "Submitting Data..." },
  { text: "Processing Payment Information..." },
  { text: "Opening Payment Window..." },
];

// Loader component that loads immediately
export function MultiStepLoaderDemo() {
  const [loading, setLoading] = useState(true);

  // Automatically stop loading after all steps are complete
  useEffect(() => {
    const duration = loadingStates.length * 2000; // adjust for each step's duration
    const timer = setTimeout(() => setLoading(false), duration);
    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, []);

  return (
    <div className="w-full h-[60vh] flex items-center justify-center">
      {/* Core Loader Modal */}
      <Loader loadingStates={loadingStates} loading={loading} duration={2000} />

      {/* Close button to manually stop the loader (optional) */}
      {loading && (
        <button
          className="fixed top-4 right-4 text-black dark:text-white z-[120]"
          onClick={() => setLoading(false)}
        >
          <IconSquareRoundedX className="h-10 w-10" />
        </button>
      )}
    </div>
  );
}
