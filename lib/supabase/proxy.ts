import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Runs on every non-asset request (see matcher in proxy.ts).
 *
 * Its job is to refresh the Supabase auth token:
 * 1. It verifies/refreshes the token via supabase.auth.getClaims().
 * 2. It writes refreshed tokens back onto the request (so Server Components
 *    don't refresh again — refreshing twice signs the user out).
 * 3. It writes refreshed tokens onto the response (so the browser gets them).
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Skip until Supabase credentials exist in .env.local — lets the app run
  // before the Supabase project is connected.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not run code between createServerClient and supabase.auth.getClaims():
  // it can cause users to be randomly signed out.
  await supabase.auth.getClaims();

  // Auth-protected route redirects are added in the authentication step.
  return supabaseResponse;
}
