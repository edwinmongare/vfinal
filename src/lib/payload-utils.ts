import { User } from "../payload-types";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { NextRequest } from "next/server";

export const getServerSideUser = async (
  cookies: NextRequest["cookies"] | ReadonlyRequestCookies
) => {
  const token = cookies.get("payload-token")?.value;

  if (!token) {
    console.error("No token found in cookies");
    return { user: null };
  }

  const meRes = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,
    {
      headers: {
        Authorization: `JWT ${token}`,
      },
    }
  );

  // Check if the response status is OK
  if (!meRes.ok) {
    console.error("Failed to fetch user. Status:", meRes.status);
    return { user: null }; // Return null or handle error
  }

  try {
    const { user } = (await meRes.json()) as {
      user: User | null;
    };
    return { user };
  } catch (error) {
    // Log error if JSON parsing fails
    console.error("Error parsing JSON:", error);

    // Optional: Log the response text for further debugging
    const responseText = await meRes.text();
    console.log("Response Text:", responseText);

    return { user: null };
  }
};
