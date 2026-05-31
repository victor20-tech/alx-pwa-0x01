import { ButtonProps } from "@/interfaces";

const Button: React.FC<ButtonProps> = ({
  title,
  action,
  variant = "primary",
  isActive,
  type = "button",
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold tracking-wide transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50";

  const styles: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
      "bg-gradient-to-r from-accent to-accent-2 text-background shadow-[0_12px_40px_rgba(45,212,191,0.25)] hover:brightness-110 active:scale-[0.98]",
    outline:
      "border border-white/15 bg-white/5 text-foreground backdrop-blur-sm hover:border-accent/50 hover:bg-accent-dim",
    ghost:
      "border border-transparent bg-white/5 text-foreground/90 hover:bg-white/10 hover:text-foreground",
  };

  const activeGhost =
    isActive &&
    "border-accent/40 bg-accent-dim text-accent shadow-[0_0_0_1px_rgba(45,212,191,0.35)]";

  return (
    <button
      type={type}
      onClick={action}
      className={`${base} ${styles[variant]} ${variant === "ghost" && isActive ? activeGhost : ""}`}
    >
      {title}
    </button>
  );
};

export default Button;
