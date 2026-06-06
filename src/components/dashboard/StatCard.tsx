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
  const toneMap: Record<string, string> = {
    accent: "bg-accent/15 text-accent-soft",
    pink: "bg-pink/15 text-pink",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
  };
  return (
    <Card hover className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted">{label}</p>
          <p className="mt-1.5 text-2xl font-bold text-ink">{value}</p>
        </div>
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneMap[tone]}`}>
          <Icon name={icon} size={20} />
        </span>
      </div>
      {sub && <p className="mt-3 text-xs text-muted">{sub}</p>}
    </Card>
  );
}
