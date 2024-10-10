import { NextRequest, NextResponse } from "next/server";
import { getServerSideUser } from "./lib/payload-utils";

export async function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;
  console.log("Middleware triggered:", nextUrl.pathname); // Debugging line
  const { user } = await getServerSideUser(cookies);
  console.log("User fetched:", user); // Debugging line

  // Define an array of protected routes
  const protectedRoutes = ["/create-order", "/view-orders", "/analytics"];

  // Check if the user is authenticated
  const isAuthenticated = !!user;
  console.log("Is Authenticated:", isAuthenticated); // Debugging line

  // Redirect unauthenticated users away from protected routes
  if (!isAuthenticated && protectedRoutes.includes(nextUrl.pathname)) {
    console.log("Redirecting to sign-in"); // Debugging line
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/sign-in?origin=${nextUrl.pathname}`
    );
  }

  // Redirect authenticated users away from the sign-in page
  if (isAuthenticated && nextUrl.pathname === "/sign-in") {
    console.log("Redirecting to home"); // Debugging line
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/`);
  }

  // For superadmin, allow access to analytics
  if (user?.role === "superadmin" && nextUrl.pathname === "/analytics") {
    console.log("Superadmin accessing analytics"); // Debugging line
    return NextResponse.next();
  }

  // For all other cases, proceed to the route handler
  console.log("Proceeding to route handler"); // Debugging line
  return NextResponse.next();
}

// Add a matcher configuration to specify the paths this middleware should run on
export const config = {
  matcher: ["/create-order", "/view-orders", "/analytics", "/sign-in"],
};
