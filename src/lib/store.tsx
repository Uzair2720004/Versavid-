"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "./supabase/client";
import { FREE_CREDITS } from "./constants";
import { uid, placeholderImage } from "./utils";
import type {
  Profile,
  Credits,
  VideoRecord,
  Transaction,
  VideoSettings,
} from "./types";

/**
 * VersaVid data layer.
 *
 * When Supabase is configured (real credentials present) this provider reads
 * and writes the live `profiles`, `videos`, `credits` and `transactions`
 * tables, keyed off the authenticated session. When credentials are absent it
 * transparently falls back to a fully-functional local demo store persisted to
 * localStorage, so the product remains usable without a backend.
 */

const STORAGE_KEY = "versavid:state:v1";

const EMPTY_STATE: PersistedState = {
  profile: null,
  credits: null,
  videos: [],
  transactions: [],
};

interface PersistedState {
  profile: Profile | null;
  credits: Credits | null;
  videos: VideoRecord[];
  transactions: Transaction[];
}

interface AppContextValue extends PersistedState {
  ready: boolean;
  isAuthed: boolean;
  // auth
  signup: (input: { fullName: string; email: string; password: string }) => Promise<Profile>;
  login: (input: { email: string; password: string }) => Promise<Profile>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  // profile
  updateProfile: (patch: Partial<Profile>) => void;
  // videos
  addVideo: (video: VideoRecord) => void;
  updateVideo: (id: string, patch: Partial<VideoRecord>) => void;
  deleteVideo: (id: string) => void;
  // credits
  deductCredits: (amount: number, description: string) => void;
  addCredits: (amount: number, opts: { type: Transaction["type"]; amount$: number; description: string }) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

// ---------------------------------------------------------------------------
// Local-demo seed data (only used when Supabase is not configured)
// ---------------------------------------------------------------------------

function defaultCredits(userId: string): Credits {
  return {
    id: uid("cr"),
    user_id: userId,
    balance: FREE_CREDITS,
    total_purchased: 0,
    total_used: 0,
    monthly_allowance: 120,
    updated_at: new Date().toISOString(),
  };
}

function seedVideos(userId: string): VideoRecord[] {
  const now = Date.now();
  const make = (
    i: number,
    title: string,
    topic: string,
    format: VideoRecord["format"],
    status: VideoRecord["status"],
    style: string,
    credits: number,
    ageHrs: number,
    duration: number
  ): VideoRecord => ({
    id: uid("vid"),
    user_id: userId,
    title,
    topic,
    format,
    status,
    script: `Scene 1: ${topic}…`,
    video_url: status === "ready" ? "/demo/sample.mp4" : null,
    thumbnail_url: placeholderImage(i + 11, format === "9:16" ? 450 : 800, format === "9:16" ? 800 : 450),
    credits_used: credits,
    duration,
    created_at: new Date(now - ageHrs * 3600_000).toISOString(),
    settings: {
      scriptMode: "ai",
      topic,
      format,
      length: duration > 60 ? "long" : duration > 30 ? "medium" : "short",
      tone: "Energetic",
      mediaType: "both",
      photoStyle: style,
      videoStyle: "realistic",
      voice: "nova",
      language: "en",
      speed: "normal",
      captionStyle: "bold-pop",
      captionPosition: "bottom",
      music: "uplifting",
    } as VideoSettings,
  });

  return [
    make(1, "5 AI tools that feel illegal to know", "AI productivity tools", "9:16", "ready", "cinematic", 5, 4, 42),
    make(2, "How black holes actually work", "Astrophysics explainer", "16:9", "ready", "photoreal", 9, 28, 142),
    make(3, "Morning routine of top creators", "Creator habits", "9:16", "ready", "minimal", 3, 52, 28),
    make(4, "The truth about passive income", "Personal finance", "9:16", "generating", "cinematic", 5, 1, 38),
  ];
}

function seedTransactions(userId: string): Transaction[] {
  const now = Date.now();
  return [
    {
      id: uid("txn"),
      user_id: userId,
      amount: 0,
      credits: FREE_CREDITS,
      type: "bonus",
      status: "completed",
      payment_id: null,
      description: "Welcome bonus — 5 free credits",
      created_at: new Date(now - 72 * 3600_000).toISOString(),
    },
    {
      id: uid("txn"),
      user_id: userId,
      amount: 15,
      credits: 100,
      type: "purchase",
      status: "completed",
      payment_id: "demo_pi_1029",
      description: "Creator pack — 100 credits",
      created_at: new Date(now - 50 * 3600_000).toISOString(),
    },
    {
      id: uid("txn"),
      user_id: userId,
      amount: 0,
      credits: -5,
      type: "usage",
      status: "completed",
      payment_id: null,
      description: "Video render — 5 AI tools that feel illegal to know",
      created_at: new Date(now - 4 * 3600_000).toISOString(),
    },
  ];
}

function freshState(profile: Profile): PersistedState {
  const credits = defaultCredits(profile.id);
  // reflect the seeded usage/purchase in the balance so dashboards add up
  credits.balance = FREE_CREDITS + 100 - 5;
  credits.total_purchased = 100;
  credits.total_used = 5;
  return {
    profile,
    credits,
    videos: seedVideos(profile.id),
    transactions: seedTransactions(profile.id),
  };
}

// ---------------------------------------------------------------------------
// Supabase loaders
// ---------------------------------------------------------------------------

async function loadUserData(
  supabase: SupabaseClient,
  userId: string
): Promise<PersistedState> {
  const [profileRes, creditsRes, videosRes, txnRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase.from("credits").select("*").eq("user_id", userId).maybeSingle(),
    supabase.from("videos").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    supabase.from("transactions").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
  ]);

  return {
    profile: (profileRes.data as Profile | null) ?? null,
    credits: (creditsRes.data as Credits | null) ?? null,
    videos: (videosRes.data as VideoRecord[] | null) ?? [],
    transactions: (txnRes.data as Transaction[] | null) ?? [],
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  // Create the browser Supabase client once. Null when not configured, which
  // selects the local-demo code paths below.
  const [supabase] = useState<SupabaseClient | null>(() => createClient());

  const [state, setState] = useState<PersistedState>(EMPTY_STATE);
  const [ready, setReady] = useState(false);

  // mirror latest state in a ref so callbacks can read it without stale closures
  const stateRef = useRef(state);

  // ---- bootstrap: live session or local hydration ----
  useEffect(() => {
    let active = true;

    if (!supabase) {
      // Local demo: hydrate from localStorage.
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client hydration
        if (raw) setState(JSON.parse(raw));
      } catch {
        /* ignore corrupt state */
      }
      setReady(true);
      return;
    }

    // Live: read the current session, then load that user's rows.
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (active && session?.user) {
        const next = await loadUserData(supabase, session.user.id);
        if (active) setState(next);
      }
      if (active) setReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setState(EMPTY_STATE);
        return;
      }
      if (event === "SIGNED_IN" && session?.user) {
        loadUserData(supabase, session.user.id).then((next) => {
          if (active) setState(next);
        });
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  // ---- keep ref in sync + persist (local-demo mode only) ----
  useEffect(() => {
    stateRef.current = state;
    if (!ready || supabase) return; // live data lives in Supabase, not localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full / unavailable */
    }
  }, [state, ready, supabase]);

  const signup: AppContextValue["signup"] = useCallback(
    async ({ fullName, email, password }) => {
      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        const user = data.user;
        if (!user) throw new Error("Sign-up did not return a user");
        // The `handle_new_user` trigger provisions the profile, credits and
        // welcome transaction. If a session was issued (email confirmation
        // disabled) we can load it immediately.
        if (data.session) {
          try {
            const next = await loadUserData(supabase, user.id);
            setState(next);
            if (next.profile) return next.profile;
          } catch (_) {}
        }
        return {
          id: user.id,
          email,
          full_name: fullName,
          avatar_url: null,
          created_at: user.created_at ?? new Date().toISOString(),
        };
      }

      const profile: Profile = {
        id: uid("user"),
        email,
        full_name: fullName,
        avatar_url: null,
        country: "United States",
        brand_name: "",
        created_at: new Date().toISOString(),
      };
      setState(freshState(profile));
      return profile;
    },
    [supabase]
  );

  const login: AppContextValue["login"] = useCallback(
    async ({ email, password }) => {
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (!data.user) throw new Error("Login did not return a user");
        const next = await loadUserData(supabase, data.user.id);
        setState(next);
        if (next.profile) return next.profile;
        return {
          id: data.user.id,
          email: data.user.email ?? email,
          full_name: (data.user.user_metadata?.full_name as string) ?? "",
          avatar_url: null,
          created_at: data.user.created_at ?? new Date().toISOString(),
        };
      }

      // demo: accept any credentials, reusing the last session when the email
      // matches, otherwise starting a fresh demo account.
      const existing = stateRef.current.profile;
      if (existing && existing.email === email && stateRef.current.credits) {
        return existing;
      }
      const profile: Profile = {
        id: uid("user"),
        email,
        full_name: email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        avatar_url: null,
        country: "United States",
        brand_name: "",
        created_at: new Date().toISOString(),
      };
      setState(freshState(profile));
      return profile;
    },
    [supabase]
  );

  const loginWithGoogle: AppContextValue["loginWithGoogle"] = useCallback(async () => {
    if (supabase) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback?next=/dashboard` },
      });
      if (error) throw error;
      // The browser is redirected to Google; the callback route finishes login.
      return;
    }

    const profile: Profile = {
      id: uid("user"),
      email: "creator@gmail.com",
      full_name: "Alex Rivera",
      avatar_url: null,
      country: "United States",
      brand_name: "Rivera Studio",
      created_at: new Date().toISOString(),
    };
    setState(freshState(profile));
  }, [supabase]);

  const logout = useCallback(() => {
    if (supabase) {
      supabase.auth.signOut().catch(() => {});
      setState(EMPTY_STATE);
      return;
    }
    setState(EMPTY_STATE);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, [supabase]);

  const updateProfile = useCallback(
    (patch: Partial<Profile>) => {
      setState((prev) => (prev.profile ? { ...prev, profile: { ...prev.profile, ...patch } } : prev));
      if (supabase) {
        const id = stateRef.current.profile?.id;
        if (id) {
          // Never let id/email/created_at be overwritten from the client.
          const { id: _id, email: _email, created_at: _ca, ...safe } = patch;
          void _id;
          void _email;
          void _ca;
          supabase.from("profiles").update(safe).eq("id", id).then(({ error }) => {
            if (error) console.error("updateProfile failed:", error.message);
          });
        }
      }
    },
    [supabase]
  );

  const addVideo = useCallback(
    (video: VideoRecord) => {
      const userId = stateRef.current.profile?.id;
      const record: VideoRecord = { ...video, user_id: userId ?? video.user_id };
      setState((prev) => ({ ...prev, videos: [record, ...prev.videos] }));
      if (supabase && userId) {
        supabase
          .from("videos")
          .insert({
            id: record.id,
            user_id: userId,
            title: record.title,
            topic: record.topic,
            format: record.format,
            status: record.status,
            script: record.script,
            video_url: record.video_url,
            thumbnail_url: record.thumbnail_url,
            credits_used: record.credits_used,
            duration: record.duration,
            settings: record.settings,
            created_at: record.created_at,
          })
          .then(({ error }) => {
            if (error) console.error("addVideo failed:", error.message);
          });
      }
    },
    [supabase]
  );

  const updateVideo = useCallback(
    (id: string, patch: Partial<VideoRecord>) => {
      setState((prev) => ({
        ...prev,
        videos: prev.videos.map((v) => (v.id === id ? { ...v, ...patch } : v)),
      }));
      if (supabase) {
        const { id: _id, user_id: _uid, created_at: _ca, ...safe } = patch;
        void _id;
        void _uid;
        void _ca;
        supabase.from("videos").update(safe).eq("id", id).then(({ error }) => {
          if (error) console.error("updateVideo failed:", error.message);
        });
      }
    },
    [supabase]
  );

  const deleteVideo = useCallback(
    (id: string) => {
      setState((prev) => ({ ...prev, videos: prev.videos.filter((v) => v.id !== id) }));
      if (supabase) {
        supabase.from("videos").delete().eq("id", id).then(({ error }) => {
          if (error) console.error("deleteVideo failed:", error.message);
        });
      }
    },
    [supabase]
  );

  const deductCredits = useCallback(
    async (amount: number, description: string) => {
      const prev = stateRef.current;
      if (!prev.credits || !prev.profile) return;

      if (!supabase) {
        // Local demo mode: no server to call, mutate local state directly.
        const credits: Credits = {
          ...prev.credits,
          balance: Math.max(0, prev.credits.balance - amount),
          total_used: prev.credits.total_used + amount,
          updated_at: new Date().toISOString(),
        };
        const txn: Transaction = {
          id: crypto.randomUUID(),
          user_id: prev.profile.id,
          amount: 0,
          credits: -amount,
          type: "usage",
          status: "completed",
          payment_id: null,
          description,
          created_at: new Date().toISOString(),
        };
        setState((p) => ({ ...p, credits, transactions: [txn, ...p.transactions] }));
        return;
      }

      try {
        const res = await fetch("/api/credits/deduct", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: prev.profile.id, amount, description }),
        });
        const data = await res.json();

        if (!res.ok) {
          console.error("deductCredits failed:", data.error);
          return;
        }

        const credits: Credits = {
          ...prev.credits,
          balance: data.balance,
          total_used: data.total_used,
          updated_at: new Date().toISOString(),
        };
        setState((p) => ({ ...p, credits }));
      } catch (err) {
        console.error("deductCredits request failed:", err);
      }
    },
    [supabase]
  );

  const addCredits = useCallback<AppContextValue["addCredits"]>(
    (amount, opts) => {
      const prev = stateRef.current;
      if (!prev.credits || !prev.profile) return;
      const credits: Credits = {
        ...prev.credits,
        balance: prev.credits.balance + amount,
        total_purchased:
          opts.type === "purchase" ? prev.credits.total_purchased + amount : prev.credits.total_purchased,
        updated_at: new Date().toISOString(),
      };
      const txn: Transaction = {
        id: crypto.randomUUID(),
        user_id: prev.profile.id,
        amount: opts.amount$,
        credits: amount,
        type: opts.type,
        status: "completed",
        payment_id: opts.type === "purchase" ? `demo_pi_${Math.floor(1000 + Math.random() * 9000)}` : null,
        description: opts.description,
        created_at: new Date().toISOString(),
      };
      setState((p) => ({ ...p, credits, transactions: [txn, ...p.transactions] }));
      if (supabase) {
        supabase
          .from("credits")
          .update({
            balance: credits.balance,
            total_purchased: credits.total_purchased,
            updated_at: credits.updated_at,
          })
          .eq("user_id", prev.profile.id)
          .then(({ error }) => {
            if (error) console.error("addCredits (credits) failed:", error.message);
          });
        supabase.from("transactions").insert(txn).then(({ error }) => {
          if (error) console.error("addCredits (transaction) failed:", error.message);
        });
      }
    },
    [supabase]
  );

  const value: AppContextValue = {
    ...state,
    ready,
    isAuthed: !!state.profile,
    signup,
    login,
    loginWithGoogle,
    logout,
    updateProfile,
    addVideo,
    updateVideo,
    deleteVideo,
    deductCredits,
    addCredits,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within <AppProvider>");
  return ctx;
}



