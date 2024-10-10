import Header from "@/components/layout/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pacesetter Dashboard",
  description: "pacesetter dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header
        id={""}
        updatedAt={""}
        createdAt={""}
        email={""}
        password={null}
      />
      <div className="flex h-screen overflow-hidden">
        {/* <Sidebar /> */}
        <main className="w-full pt-2 px-6 mb-6">{children}</main>
      </div>
    </>
  );
}
