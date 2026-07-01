import Link from "next/link";

type ButtonProps = {
  href?: string;
  variant?: "primary" | "secondary" | "ink";
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

export function Button({
  href,
  variant = "primary",
  children,
  className = "",
  disabled = false,
}: ButtonProps) {
  const base =
    "inline-flex min-h-11 items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 motion-reduce:transform-none";
  const styles = {
    primary: "button-primary bg-white text-[#161616] shadow-lg shadow-black/20 hover:-translate-y-0.5 hover:opacity-90",
    secondary:
      "button-secondary border border-white bg-transparent text-white hover:-translate-y-0.5 hover:bg-white/10",
    ink: "button-ink bg-[#161616] text-white hover:-translate-y-0.5 hover:bg-[#183247]",
  }[variant];
  const classes = `${base} ${styles} ${disabled ? "pointer-events-none cursor-not-allowed opacity-50" : ""} ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        style={{ color: variant === "primary" ? "#161616" : "#ffffff" }}
        aria-disabled={disabled || undefined}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      className={classes}
      style={{ color: variant === "primary" ? "#161616" : "#ffffff" }}
    >
      {children}
    </button>
  );
}
