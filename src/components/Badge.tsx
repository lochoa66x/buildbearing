import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
};

export function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-bearing-gold/30 bg-paper/[0.85] px-3 py-1 text-sm font-semibold text-ink shadow-sm shadow-ink/5 backdrop-blur">
      {children}
    </span>
  );
}
