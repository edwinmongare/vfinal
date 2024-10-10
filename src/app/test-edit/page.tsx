import VerifyEmail from "@/components/VerifyEmail";
import Image from "next/image";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const VerifyEmailPage = () => {
  return (
    <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex h-full flex-col items-center justify-center space-y-1">
          <div className="relative mb-4 h-60 w-60 text-muted-foreground">
            <Image src="/thumbnail.png" fill alt="pacesetter image" />
          </div>

          <h3 className="font-semibold text-2xl">Check your email</h3>

          <p className="text-muted-foreground text-center">
            We&apos;ve sent a verification link to{" "}
            <span className="font-semibold"></span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
