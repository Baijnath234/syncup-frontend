"use client";

import { useSocketNotifications } from "@/hooks/useSocketNotifications";
import { useAppSelector } from "@/redux/hooks";

export function NotificationBell() {
  useSocketNotifications();
  const notifications = useAppSelector((state) => state.auth.notifications);
  const unread = notifications.filter((item) => !item.read).length;

  return (
    <div className="relative">
      <button className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100" title="Notifications">
        Bell
        {unread > 0 && (
          <span className="ml-2 rounded-full bg-teal-700 px-2 py-0.5 text-xs font-semibold text-white">{unread}</span>
        )}
      </button>
    </div>
  );
}
