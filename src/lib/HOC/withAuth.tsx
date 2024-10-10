import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getServerSideUser } from "../../lib/payload-utils"; // Import your utility function

type Props = {
  children?: React.ReactNode;
};

const withAuth = (WrappedComponent: React.ComponentType<any>) => {
  const AuthWrapper: React.FC<Props> = (props) => {
    const { children, ...rest } = props;
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        const isAuthenticated = await checkUserAuthentication();
        if (!isAuthenticated) {
          router.replace(`/sign-in?origin=${router.asPath}`); // Redirect to sign-in page if not authenticated
        } else {
          setIsAuthenticated(true);
        }
        setLoading(false);
      };
      checkAuth();
    }, [router]);

    const checkUserAuthentication = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/check-auth`,
          {
            credentials: "include", // Include cookies
          }
        );
        if (response.ok) {
          const data = await response.json();
          return data.isAuthenticated;
        } else {
          return false;
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        return false;
      }
    };

    if (loading) {
      return <p>Loading...</p>; // Show a loading state while checking authentication
    }

    if (!isAuthenticated) {
      return null; // Render nothing if not authenticated (optional)
    }

    return <WrappedComponent {...rest}>{children}</WrappedComponent>;
  };

  return AuthWrapper;
};

export default withAuth;
