import { AlertTriangle, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Alert } from "@/types/fintrack";

const CONFIG = {
  warn: {
    icon: AlertTriangle,
    bg: "bg-yellow-500/10 border-yellow-500/30",
    text: "text-yellow-400",
  },
  danger: {
    icon: XCircle,
    bg: "bg-destructive/10 border-destructive/30",
    text: "text-destructive",
  },
  info: {
    icon: Info,
    bg: "bg-ft-blue/10 border-ft-blue/30",
    text: "text-ft-blue",
  },
} as const;

interface AlertBannerProps {
  alerts: Alert[];
}

export function AlertBanner({ alerts }: AlertBannerProps) {
  if (!alerts.length) return null;

  return (
    <div className="space-y-2">
      {alerts.map((alert, i) => {
        const { icon: Icon, bg, text } = CONFIG[alert.type];
        return (
          <div
            key={i}
            className={cn("flex items-start gap-3 rounded-xl border px-4 py-3", bg)}
          >
            <Icon size={16} className={cn("mt-0.5 shrink-0", text)} />
            <p className={cn("text-sm font-medium", text)}>{alert.message}</p>
          </div>
        );
      })}
    </div>
  );
}
