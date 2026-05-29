import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <article
      className={`rounded-lg border border-ink/10 bg-paper/80 p-6 shadow-soft backdrop-blur ${className}`}
    >
      {children}
    </article>
  );
}
