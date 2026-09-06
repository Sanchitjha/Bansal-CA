import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-all focus:border-[#0B1528] focus:outline-none focus:ring-2 focus:ring-[#0B1528]/15 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50",
        className
      )}
      style={{ border: "1px solid #cbd5e1", ...props.style }}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
