import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[#0B1528] text-white hover:bg-[#16243C] focus-visible:ring-[#0B1528]",
        primary:
          "bg-[#E35A37] text-white hover:bg-[#C84626] focus-visible:ring-[#E35A37]",
        outline:
          "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 focus-visible:ring-slate-400",
        ghost:
          "text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-400",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
