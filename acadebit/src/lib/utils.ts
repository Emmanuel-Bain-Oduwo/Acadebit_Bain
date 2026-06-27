import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatKES(amount: number): string {
  return `KES ${amount.toLocaleString("en-KE")}`;
}

export function competencyColor(code: string): string {
  switch (code) {
    case "EE": return "#22c55e";
    case "ME": return "#3b82f6";
    case "AE": return "#f59e0b";
    case "BE": return "#ef4444";
    default: return "#64748b";
  }
}

export function competencyLabel(code: string): string {
  switch (code) {
    case "EE": return "Exceeds";
    case "ME": return "Meets";
    case "AE": return "Approaching";
    case "BE": return "Below";
    default: return code;
  }
}

export function statusColor(status: string): string {
  switch (status) {
    case "present": case "completed": case "complete": return "#22c55e";
    case "absent": case "DEFERRED": case "pending": return "#ef4444";
    case "leave": case "processing": case "partial": return "#f59e0b";
    case "PASSED": return "#22c55e";
    case "shipped": return "#3b82f6";
    default: return "#64748b";
  }
}
