import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useAuth = () => {
  const router = useRouter();

  const signOut = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error();

      toast.success("Signed out successfully");

      router.push("/sign-in");
      router.refresh();
    } catch (err) {
      toast.error("Couldn't sign out, please try again.");
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/forgot-password`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      );

      if (!req.ok) {
        throw new Error("Failed to initiate forgot password process");
      }

      const data = await req.json();

      // Handle the response data as needed (e.g., show a success message)
      toast.success("Forgot password process initiated successfully");
    } catch (err) {
      console.error("Error during forgot password:", err);
      toast.error(
        "Couldn't initiate forgot password process, please try again."
      );
    }
  };

  return { signOut, forgotPassword };
};
