import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { MeteorsDemo } from "@/components/bentoGrid";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <MaxWidthWrapper>
        <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            State of Origin Certificate
            <span className="text-red-600"> Request Portal</span>.
          </h1>
          <p className="mt-6 text-lg max-w-prose text-muted-foreground">
            Streamlining State of Origin Certification for Your Convenience
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link href="/create-order" className={buttonVariants()}>
              Get your Origin Certificate now &rarr;
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>

      <section className="border-t border-gray-200 bg-gray-50">
        <MaxWidthWrapper className=" mt-5 pb-20">
          <MeteorsDemo />
          {/* <Features /> */}
        </MaxWidthWrapper>
      </section>
    </>
  );
}
