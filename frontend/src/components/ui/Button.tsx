import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "danger";

type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[#5B4B8A] text-white hover:bg-[#4F417A] active:bg-[#46396D] shadow-[0_6px_18px_rgba(91,75,138,0.14)]",

  secondary:
    "bg-[#F1EDF7] text-[#5B4B8A] hover:bg-[#E9E3F1] active:bg-[#E1D9EB]",

  ghost:
    "bg-transparent text-[#706A78] hover:bg-[#F6F3F8] hover:text-[#5B4B8A] active:bg-[#EEEAF2]",

  outline:
    "border border-[#DDD7E4] bg-white text-[#625B69] hover:border-[#C9C0D4] hover:bg-[#FBFAFC] hover:text-[#5B4B8A] active:bg-[#F6F3F8]",

  danger:
    "border border-[#E8DADA] bg-white text-[#8A6D6D] hover:border-[#DCC5C5] hover:bg-[#FBF5F5] active:bg-[#F7EEEE]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 rounded-full px-4 text-[9px]",
  md: "h-10 rounded-full px-5 text-[10px]",
  lg: "h-12 rounded-full px-6 text-[11px]",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  icon,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const classes = [
    "inline-flex items-center justify-center gap-2",
    "font-medium tracking-[-0.01em]",
    "transition-all duration-200",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B4B8A]/20",
    "disabled:pointer-events-none disabled:opacity-45",
    variants[variant],
    sizes[size],
    fullWidth ? "w-full" : "w-fit",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}

        {icon && (
          <span className="shrink-0">
            {icon}
          </span>
        )}
      </Link>
    );
  }

  return (
    <button
      {...props}
      disabled={disabled}
      className={classes}
    >
      {children}

      {icon && (
        <span className="shrink-0">
          {icon}
        </span>
      )}
    </button>
  );
}