import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Middleware: frischt bei jedem Request die Supabase-Session-Cookies, damit
// Server Components die aktuelle Session lesen können, ohne selbst Cookies
// schreiben zu müssen. Ohne diesen Refresh laufen lange Sessions irgendwann aus.
export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options: CookieOptions }[]
        ) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set({ name, value, ...options });
          });
        },
      },
    }
  );

  // getUser() löst den Refresh aus, falls das Access-Token abgelaufen ist.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    // alles außer statischen Assets
    "/((?!_next/static|_next/image|favicon.ico|logos/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
