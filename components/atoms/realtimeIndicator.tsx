"use client";

import { Activity } from "lucide-react";
import { useUsers } from "@/services/users/query";
import { useEffect, useState, useRef } from "react";

export function RealtimeIndicator() {
  const { dataUpdatedAt } = useUsers();
  const [displayTime, setDisplayTime] = useState("");
  const [justUpdated, setJustUpdated] = useState(false);
  const prevUpdatedAt = useRef(dataUpdatedAt);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date(dataUpdatedAt);
      const timeString = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setDisplayTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [dataUpdatedAt]);

  // Trigger animation when data updates - using queueMicrotask to defer state update
  useEffect(() => {
    if (dataUpdatedAt && dataUpdatedAt !== prevUpdatedAt.current) {
      prevUpdatedAt.current = dataUpdatedAt;

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Defer state update to avoid synchronous setState in effect
      queueMicrotask(() => {
        setJustUpdated(true);
        timeoutRef.current = setTimeout(() => setJustUpdated(false), 2000);
      });
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [dataUpdatedAt]);

  return (
    <div className="flex items-center gap-2 text-sm text-zinc-500 bg-white/70 px-4 py-2 rounded-xl border border-zinc-200/60 backdrop-blur-sm shadow-sm">
      <span className={`relative flex h-2.5 w-2.5`}>
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            justUpdated ? "bg-emerald-500" : "bg-blue-500"
          }`}
        ></span>
        <span
          className={`relative inline-flex rounded-full h-2.5 w-2.5 transition-colors duration-300 ${
            justUpdated ? "bg-emerald-500" : "bg-blue-500"
          }`}
        ></span>
      </span>
      <Activity className="h-4 w-4 text-zinc-400" />
      <span className="font-medium">{displayTime}</span>
      {justUpdated && (
        <span className="text-xs text-emerald-600 font-semibold animate-pulse">Updated!</span>
      )}
    </div>
  );
}
