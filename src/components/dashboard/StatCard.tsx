import { Card } from "@/components/ui/primitives";
import { Icon, type IconName } from "@/components/ui/Icon";

export function StatCard({
  icon,
  label,
  value,
  sub,
  tone = "accent",
}: {
  icon: IconName;
  label: string;
  value: string | number;
  sub?: string;
  tone?: "accent" | "pink" | "success" | "warning";
}) {
  const toneMap: Record<string, { icon: string; bar: string; glow: string }> = {
    accent: { icon: "bg-accent/15 text-accent-soft", bar: "from-accent to-accent-soft", glow: "rgba(127,119,221,0.08)" },
    pink: { icon: "bg-pink/15 text-pink", bar: "from-pink to-pink/60", glow: "rgba(212,83,126,0.08)" },
    success: { icon: "bg-success/15 text-success", bar: "from-success to-success/60", glow: "rgba(29,158,117,0.08)" },
    warning: { icon: "bg-warning/15 text-warning", bar: "from-warning to-warning/60", glow: "rgba(186,117,23,0.08)" },
  };
  const t = toneMap[tone];
  return (
    <Card hover className="p-5 relative overflow-hidden" style={{ background: `radial-gradient(ellipse at top right, ${t.glow}, transparent 70%)` }}>
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${t.bar}`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted uppercase tracking-wider">{label}</p>
          <p className="mt-2 text-3xl font-bold text-ink tracking-tight">{value}</p>
        </div>
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${t.icon}`}>
          <Icon name={icon} size={20} />
        </span>
      </div>
      {sub && <p className="mt-3 text-xs text-muted">{sub}</p>}
    </Card>
  );
}
