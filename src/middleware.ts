import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const DASHBOARD_ROUTES = [
  "/dashboard",
  "/create",
  "/generate",
  "/videos",
  "/settings",
  "/credits",
  "/analytics",
];

function isDashboardRoute(pathname: string): boolean {
  return DASHBOARD_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
}

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!url && !!key && !url.startsWith("your_") && !key.startsWith("your_") && url.length > 10 && key.length > 10;
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );

  // CSP for inline styles/scripts needed by Next.js + all external services
  // NOTE: This must be kept in sync with all external API/CDN calls in the app.
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      // Scripts: Next.js needs unsafe-eval/inline; GA/GTM; Chatzy widget
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://chatzy-kb-store.s3.amazonaws.com https://app.chatzy.ai",
      // Styles: inline styles (Next.js, Tailwind); Google Fonts; Chatzy widget
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://chatzy-kb-store.s3.amazonaws.com https://app.chatzy.ai",
      // Fonts: Google Fonts + gstatic
      "font-src 'self' data: https://fonts.gstatic.com",
      // Images: self, data URIs, blobs, Supabase storage, Pexels CDN, fal.ai media, Chatzy icons, ElevenLabs, Google OAuth avatars, placeholder images, JSON2Video S3 CDN
      "img-src 'self' data: blob: https://*.supabase.co https://images.pexels.com https://videos.pexels.com https://fal.media https://v3.fal.media https://chatzy-kb-store.s3.amazonaws.com https://mock.elevenlabs.io https://api.us.elevenlabs.io https://lh3.googleusercontent.com https://storage.googleapis.com https://picsum.photos https://*.json2video.com https://json2video-cdn*.s3.amazonaws.com",
      // Media (video/audio): Supabase storage, Pexels videos, ElevenLabs previews (GCS + API), JSON2Video S3 CDN
      "media-src 'self' data: blob: https://*.supabase.co https://videos.pexels.com https://api.us.elevenlabs.io https://storage.googleapis.com https://*.json2video.com https://json2video-cdn*.s3.amazonaws.com",
      // Connect: Supabase (auth + realtime + storage), fal.ai, ElevenLabs (both regions), Pexels API, JSON2Video, GA/GTM, OpenAI (captions), Chatzy widget
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://fal.run https://api.elevenlabs.io https://api.us.elevenlabs.io https://api.pexels.com https://api.json2video.com https://api.openai.com https://www.google-analytics.com https://www.googletagmanager.com https://app.chatzy.ai",
      // Frames: YouTube embeds
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
      // Base URI & form actions
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ")
  );

  // HSTS
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );

  // Remove server header
  response.headers.delete("x-powered-by");

  // Auth protection for dashboard routes - only when Supabase is configured
  if (isSupabaseConfigured() && isDashboardRoute(request.nextUrl.pathname)) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Check for active session
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api/og).*)",
  ],
};