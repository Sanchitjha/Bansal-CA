import { cn } from "@/lib/utils";

export function FieldError({
  message,
  className,
}: {
  message?: string;
  className?: string;
}) {
  if (!message) return null;
  return (
    <p className={cn("text-xs text-red-600 mt-1", className)} role="alert">
      {message}
    </p>
  );
}
