import { createAuthClient } from "better-auth/react";

function getAuthBaseURL() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
}

export const authClient = createAuthClient({
  baseURL: getAuthBaseURL(),
});
