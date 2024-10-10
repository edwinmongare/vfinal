import type { Metadata } from "next";
import { Genos } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { Toaster } from "sonner";
import Footer from "@/components/Footer";

const genos = Genos({ subsets: ["latin"], weight: "500", display: "fallback" });

export const metadata: Metadata = {
  title: "Pacesetters",
  description:
    "Streamlining State of Origin Certification for Your Convenience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className={cn("relative h-full font-sans antialiased", genos.className)}
      >
        <main className="relative flex flex-col min-h-screen">
          <Providers>
            <Navbar />
            <div className="flex-grow flex-1">{children}</div>
            <Footer />
          </Providers>
        </main>
        <Toaster duration={10000} position="top-right" richColors />
      </body>
    </html>
  );
}
