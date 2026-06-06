"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, Input, Select, Field, Toggle, Badge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { PillGroup } from "@/components/create/controls";
import {
  SETTINGS_SECTIONS,
  COUNTRIES,
  FORMATS,
  LENGTHS,
  TONES,
  MEDIA_TYPES,
  PHOTO_STYLES,
  CAPTION_STYLES,
  VOICES,
  LANGUAGES,
  SPEEDS,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const router = useRouter();
  const { profile, updateProfile, logout } = useApp();
  const [section, setSection] = useState("profile");

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
      <PageHeader title="Settings" subtitle="Manage your account, defaults and integrations." />

      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Left nav */}
        <nav className="flex gap-2 overflow-x-auto pb-2 no-scrollbar lg:flex-col lg:overflow-visible lg:pb-0">
          {SETTINGS_SECTIONS.map((s) => {
            const active = section === s.id;
            const danger = s.id === "danger";
            return (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                className={cn(
                  "flex shrink-0 items-center gap-3 rounded-[10px] px-3.5 py-2.5 text-sm font-medium transition-colors lg:w-full",
                  active
                    ? danger
                      ? "bg-pink/10 text-pink"
                      : "bg-panel-2 text-ink"
                    : "text-muted hover:bg-panel-2/60 hover:text-ink"
                )}
              >
                <Icon name={s.icon as IconName} size={17} />
                {s.label}
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <div className="min-w-0">
          {section === "profile" && <ProfileSection profile={profile} updateProfile={updateProfile} />}
          {section === "security" && <SecuritySection />}
          {section === "defaults" && <DefaultsSection />}
          {section === "voice" && <VoiceSection />}
          {section === "notifications" && <NotificationsSection />}
          {section === "connections" && <ConnectionsSection />}
          {section === "danger" && (
            <DangerSection
              onDelete={() => {
                logout();
                router.push("/");
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function SectionShell({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <Card className="p-6 sm:p-7 animate-fade-up">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <p className="mt-1 text-sm text-muted">{desc}</p>
      <div className="mt-6 space-y-6">{children}</div>
    </Card>
  );
}

/* ---- Profile ---- */
function ProfileSection({
  profile,
  updateProfile,
}: {
  profile: ReturnType<typeof useApp>["profile"];
  updateProfile: ReturnType<typeof useApp>["updateProfile"];
}) {
  const [name, setName] = useState(profile?.full_name ?? "");
  const [country, setCountry] = useState(profile?.country ?? "United States");
  const [brand, setBrand] = useState(profile?.brand_name ?? "");
  const [saved, setSaved] = useState(false);
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  return (
    <SectionShell title="Profile" desc="Update your personal information and brand.">
      <div className="flex items-center gap-5">
        <span className="flex h-20 w-20 items-center justify-center rounded-full gradient-bg text-2xl font-bold text-white">
          {initials || "U"}
        </span>
        <div>
          <Button variant="secondary" size="sm">
            <Icon name="upload" size={15} />
            Change avatar
          </Button>
          <p className="mt-2 text-xs text-muted">JPG or PNG, max 5MB</p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Email">
          <Input value={profile?.email ?? ""} disabled />
        </Field>
        <Field label="Country">
          <Select value={country} onChange={(e) => setCountry(e.target.value)}>
            {COUNTRIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
        </Field>
        <Field label="Brand / channel name">
          <Input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Your channel" />
        </Field>
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={() => {
            updateProfile({ full_name: name, country, brand_name: brand });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          }}
        >
          Save changes
        </Button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-success">
            <Icon name="check" size={15} /> Saved
          </span>
        )}
      </div>
    </SectionShell>
  );
}

/* ---- Security ---- */
function SecuritySection() {
  const [twoFA, setTwoFA] = useState(false);
  const sessions = [
    { device: "Chrome · macOS", where: "San Francisco, US", current: true },
    { device: "Safari · iPhone", where: "San Francisco, US", current: false },
  ];
  return (
    <SectionShell title="Security" desc="Protect your account.">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink">Change password</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Current password">
            <Input type="password" placeholder="••••••••" />
          </Field>
          <div />
          <Field label="New password">
            <Input type="password" placeholder="••••••••" />
          </Field>
          <Field label="Confirm new password">
            <Input type="password" placeholder="••••••••" />
          </Field>
        </div>
        <Button className="mt-4" size="sm">
          Update password
        </Button>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-edge bg-canvas p-4">
        <div>
          <p className="text-sm font-medium text-ink">Two-factor authentication</p>
          <p className="text-xs text-muted">Add an extra layer of security at login.</p>
        </div>
        <Toggle checked={twoFA} onChange={setTwoFA} />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink">Active sessions</h3>
        <div className="space-y-2">
          {sessions.map((s) => (
            <div key={s.device} className="flex items-center justify-between rounded-xl border border-edge bg-canvas p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-panel-2 text-muted">
                  <Icon name="shield" size={16} />
                </span>
                <div>
                  <p className="text-sm font-medium text-ink">{s.device}</p>
                  <p className="text-xs text-muted">{s.where}</p>
                </div>
              </div>
              {s.current ? (
                <Badge tone="success">This device</Badge>
              ) : (
                <Button variant="ghost" size="sm">
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

/* ---- Video defaults ---- */
function DefaultsSection() {
  const [format, setFormat] = useState<"9:16" | "16:9">("9:16");
  const [length, setLength] = useState("short");
  const [tone, setTone] = useState("Energetic");
  const [media, setMedia] = useState("both");
  const [style, setStyle] = useState("cinematic");
  const [caption, setCaption] = useState("bold-pop");

  return (
    <SectionShell title="Video defaults" desc="Pre-fill the create wizard with your favourite settings.">
      <Field label="Default format">
        <PillGroup value={format} onChange={setFormat} options={FORMATS.map((f) => ({ value: f.value, label: f.label }))} />
      </Field>
      <Field label="Default length">
        <PillGroup value={length} onChange={setLength} options={LENGTHS.map((l) => ({ value: l.value, label: l.label }))} />
      </Field>
      <Field label="Default tone">
        <Select value={tone} onChange={(e) => setTone(e.target.value)}>
          {TONES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </Select>
      </Field>
      <Field label="Default media type">
        <PillGroup value={media} onChange={setMedia} options={MEDIA_TYPES.map((m) => ({ value: m.value, label: m.label }))} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Default photo style">
          <Select value={style} onChange={(e) => setStyle(e.target.value)}>
            {PHOTO_STYLES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Default caption style">
          <Select value={caption} onChange={(e) => setCaption(e.target.value)}>
            {CAPTION_STYLES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Button size="sm">Save defaults</Button>
    </SectionShell>
  );
}

/* ---- Voice ---- */
function VoiceSection() {
  const [voice, setVoice] = useState("nova");
  const [language, setLanguage] = useState("en");
  const [speed, setSpeed] = useState("normal");
  const [stability, setStability] = useState(50);
  const [clarity, setClarity] = useState(75);

  return (
    <SectionShell title="Voice" desc="Set your default narrator and delivery.">
      <Field label="Default voice">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {VOICES.map((v) => (
            <button
              key={v.value}
              onClick={() => setVoice(v.value)}
              className={cn(
                "flex flex-col items-start gap-1.5 rounded-xl border p-3 text-left transition-all",
                voice === v.value ? "border-accent/70 bg-accent/10" : "border-edge bg-canvas hover:border-edge-strong"
              )}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full text-white" style={{ background: v.swatch }}>
                <Icon name="mic" size={14} />
              </span>
              <span className="text-sm font-semibold text-ink">{v.name}</span>
              <span className="text-[11px] text-muted">{v.accent}</span>
            </button>
          ))}
        </div>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Language">
          <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.flag} {l.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Speed">
          <PillGroup value={speed} onChange={setSpeed} options={SPEEDS.map((s) => ({ value: s.value, label: s.label }))} />
        </Field>
      </div>

      <Slider label="Stability" value={stability} onChange={setStability} />
      <Slider label="Clarity + similarity" value={clarity} onChange={setClarity} />

      <div className="flex items-center justify-between rounded-xl border border-edge bg-canvas p-4 opacity-90">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-panel-2 text-muted">
            <Icon name="lock" size={16} />
          </span>
          <div>
            <p className="text-sm font-medium text-ink">Voice cloning</p>
            <p className="text-xs text-muted">Clone your own voice from a 30s sample.</p>
          </div>
        </div>
        <Badge tone="accent">Pro</Badge>
      </div>
      <Button size="sm">Save voice settings</Button>
    </SectionShell>
  );
}

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-ink">{label}</span>
        <span className="text-sm text-accent-soft">{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-edge accent-[#7f77dd]"
        style={{
          background: `linear-gradient(90deg, #7f77dd ${value}%, #21262d ${value}%)`,
        }}
      />
    </div>
  );
}

/* ---- Notifications ---- */
function NotificationsSection() {
  const groups = [
    {
      title: "Email notifications",
      items: ["Video ready to download", "Low credit balance", "Weekly usage summary", "Product updates & tips"],
    },
    {
      title: "Browser notifications",
      items: ["Generation complete", "Render failures", "New feature announcements"],
    },
  ];
  const [state, setState] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    groups.forEach((g) => g.items.forEach((i, idx) => (init[`${g.title}-${i}`] = idx < 2)));
    return init;
  });

  return (
    <SectionShell title="Notifications" desc="Choose what we ping you about.">
      {groups.map((g) => (
        <div key={g.title}>
          <h3 className="mb-3 text-sm font-semibold text-ink">{g.title}</h3>
          <div className="space-y-2">
            {g.items.map((item) => {
              const key = `${g.title}-${item}`;
              return (
                <div key={key} className="flex items-center justify-between rounded-xl border border-edge bg-canvas px-4 py-3">
                  <span className="text-sm text-ink">{item}</span>
                  <Toggle checked={!!state[key]} onChange={(v) => setState((s) => ({ ...s, [key]: v }))} />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </SectionShell>
  );
}

/* ---- Connections ---- */
function ConnectionsSection() {
  const conns: { name: string; icon: IconName; desc: string; connected: boolean }[] = [
    { name: "YouTube", icon: "video", desc: "Publish directly to your channel", connected: true },
    { name: "Instagram", icon: "image", desc: "Share Reels in one click", connected: false },
    { name: "TikTok", icon: "music" as IconName, desc: "Auto-post your Shorts", connected: false },
    { name: "Google Drive", icon: "upload", desc: "Back up renders automatically", connected: false },
  ];
  const [state, setState] = useState(() => Object.fromEntries(conns.map((c) => [c.name, c.connected])));

  return (
    <SectionShell title="Connections" desc="Connect your accounts to publish faster.">
      <div className="space-y-2">
        {conns.map((c) => (
          <div key={c.name} className="flex items-center justify-between rounded-xl border border-edge bg-canvas p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg gradient-bg-soft text-accent-soft">
                <Icon name={c.icon} size={18} />
              </span>
              <div>
                <p className="text-sm font-medium text-ink">{c.name}</p>
                <p className="text-xs text-muted">{c.desc}</p>
              </div>
            </div>
            <Button
              variant={state[c.name] ? "secondary" : "outline"}
              size="sm"
              onClick={() => setState((s) => ({ ...s, [c.name]: !s[c.name] }))}
            >
              {state[c.name] ? "Disconnect" : "Connect"}
            </Button>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

/* ---- Danger zone ---- */
function DangerSection({ onDelete }: { onDelete: () => void }) {
  const [confirm, setConfirm] = useState("");
  return (
    <Card className="border-pink/30 p-6 sm:p-7 animate-fade-up">
      <h2 className="text-lg font-semibold text-pink">Danger zone</h2>
      <p className="mt-1 text-sm text-muted">Irreversible and destructive actions.</p>

      <div className="mt-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-edge bg-canvas p-4">
          <div>
            <p className="text-sm font-medium text-ink">Export your data</p>
            <p className="text-xs text-muted">Download all your videos and account data.</p>
          </div>
          <Button variant="secondary" size="sm">
            <Icon name="download" size={15} />
            Export
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-edge bg-canvas p-4">
          <div>
            <p className="text-sm font-medium text-ink">Cancel subscription</p>
            <p className="text-xs text-muted">You&apos;ll keep access until the end of the billing period.</p>
          </div>
          <Button variant="outline" size="sm">
            Cancel plan
          </Button>
        </div>

        <div className="rounded-xl border border-pink/40 bg-pink/5 p-4">
          <p className="text-sm font-medium text-pink">Delete account</p>
          <p className="mt-1 text-xs text-muted">
            This permanently deletes your account, videos and credits. Type <b>DELETE</b> to confirm.
          </p>
          <div className="mt-3 flex gap-2">
            <Input value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="DELETE" className="max-w-[160px]" />
            <Button variant="danger" disabled={confirm !== "DELETE"} onClick={onDelete}>
              <Icon name="trash" size={15} />
              Delete my account
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
