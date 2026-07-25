import { createServerSupabase } from "./supabase/server";
import { PLANS, type GenerationMode } from "./constants";

export interface PlanEnforcementResult {
  allowed: boolean;
  reason?: string;
  userId?: string;
  plan?: string;
  generationMode?: GenerationMode;
}

/**
 * Shared helper for server-side plan enforcement in generation API routes.
 * 
 * Does NOT trust any client-sent values for plan or generationMode.
 * Instead, it:
 * 1. Verifies the user's session
 * 2. Fetches the user's actual plan from the database
 * 3. Looks up the video record by videoId to get the generationMode
 * 4. Checks if the mode is allowed for their plan
 * 5. For free tier: enforces monthly video limit with 30-day period reset
 */
export async function validateGenerationRequest(
  videoId: string,
  supabase?: Awaited<ReturnType<typeof createServerSupabase>> | null
): Promise<PlanEnforcementResult> {
  // If no supabase client provided, create one for auth verification
  const serverSupabase = supabase ?? await createServerSupabase();
  
  if (!serverSupabase) {
    return { allowed: false, reason: "Server not configured" };
  }

  // 1. Verify user session
  const { data: { user } } = await serverSupabase.auth.getUser();
  if (!user) {
    return { allowed: false, reason: "Unauthorized" };
  }

  // 2. Get user's profile from DB (source of truth for plan)
  const { data: profile, error: profileError } = await serverSupabase
    .from("profiles")
    .select("id, plan, monthly_video_count, period_start")
    .eq("id", user.id)
    .maybeSingle();

  console.error("[Plan Enforcement] Profile query result:", { userId: user.id, profile, profileError });

  if (profileError || !profile) {
    console.error("[Plan Enforcement] Profile not found:", { userId: user.id, profileError });
    return { allowed: false, reason: "User profile not found" };
  }

  // 3. Get video record to determine generationMode from settings JSONB (never trust client)
  const { data: video, error: videoError } = await serverSupabase
    .from("videos")
    .select("settings")
    .eq("id", videoId)
    .maybeSingle();

  if (videoError || !video) {
    console.error("[Plan Enforcement] Video not found:", { videoId, videoError });
    return { allowed: false, reason: "Video not found" };
  }

  // Extract generationMode from settings JSONB
  const settings = video.settings as Record<string, unknown> | null;
  const generationMode = (settings?.generationMode as GenerationMode) ?? "stock_only";
  const plan = profile.plan as "free" | "creator" | "pro" | "agency";

  // 4. Check if generationMode is allowed for this plan
  const planConfig = PLANS.find((p) => p.id === plan);
  if (!planConfig) {
    return { allowed: false, reason: `Unknown plan: ${plan}` };
  }

  if (!planConfig.allowedModes.includes(generationMode)) {
    return { 
      allowed: false, 
      reason: `Generation mode "${generationMode}" not allowed on ${planConfig.name} plan` 
    };
  }

  // 5. Free tier: enforce monthly video limit with 30-day period reset
  if (plan === "free") {
    const monthlyLimit = 3;
    let monthlyCount = profile.monthly_video_count ?? 0;
    const periodStart = profile.period_start ? new Date(profile.period_start) : null;
    const now = new Date();

    // Check if period has expired (30+ days since period_start)
    if (periodStart) {
      const daysSincePeriodStart = (now.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSincePeriodStart >= 30) {
        // Period expired - reset count
        monthlyCount = 0;
        // Reset in DB
        await serverSupabase
          .from("profiles")
          .update({ monthly_video_count: 0, period_start: now.toISOString() })
          .eq("id", user.id);
      }
    }

    if (monthlyCount >= monthlyLimit) {
      return { 
        allowed: false, 
        reason: `Free plan limit reached: ${monthlyLimit} videos per month. Upgrade to continue.` 
      };
    }
  }

  return { 
    allowed: true, 
    userId: user.id, 
    plan, 
    generationMode 
  };
}

/**
 * Increment the free user's monthly video count after successful generation.
 * Called after a video completes successfully (not at generation start).
 */
export async function incrementFreeTierCount(
  userId: string,
  supabase?: Awaited<ReturnType<typeof createServerSupabase>> | null
): Promise<void> {
  const serverSupabase = supabase ?? await createServerSupabase();
  if (!serverSupabase) return;

  const { data: profile } = await serverSupabase
    .from("profiles")
    .select("monthly_video_count, plan")
    .eq("id", userId)
    .maybeSingle();

  if (profile && (profile.plan === "free")) {
    await serverSupabase
      .from("profiles")
      .update({ monthly_video_count: (profile.monthly_video_count ?? 0) + 1 })
      .eq("id", userId);
  }
}