import React from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export const NotificationToast = ({ notifications }) => {
  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0">
      {notifications.map((n) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
          danger: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
          info: <Info className="w-5 h-5 text-blue-500 shrink-0" />
        };

        const bgColors = {
          success: "border-emerald-500/20 bg-emerald-50/90 dark:bg-emerald-950/20",
          warning: "border-amber-500/20 bg-amber-50/90 dark:bg-amber-950/20",
          danger: "border-red-500/20 bg-red-50/90 dark:bg-red-950/20",
          info: "border-blue-500/20 bg-blue-50/90 dark:bg-blue-950/20"
        };

        return (
          <div
            key={n.id}
            className={`flex items-start gap-3 p-4 rounded-xl border glass shadow-lg transition-all duration-300 transform translate-y-0 animate-slide-up ${bgColors[n.type]}`}
          >
            {icons[n.type]}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-foreground leading-tight">
                {n.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {n.message}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
