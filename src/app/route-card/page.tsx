import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { RouteCardForm } from "@/components/RouteCardForm";

export const metadata: Metadata = {
  title: "Route Card Generator | BuildBearing",
  description:
    "Turn a fuzzy app, website, tool, workflow, or AI-helper idea into a structured BuildBearing Route Card.",
};

export default function RouteCardPage() {
  return (
    <main className="min-h-screen bg-field text-ink">
      <header className="border-b border-ink/[0.08] bg-field/[0.92] backdrop-blur">
        <Container className="flex min-h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3" aria-label="BuildBearing home">
            <span className="flex size-9 items-center justify-center rounded-md bg-bearing-gold text-sm font-bold text-ink shadow-sm shadow-ink/10">
              BB
            </span>
            <span className="text-base font-semibold">BuildBearing</span>
          </Link>
          <Link
            href="/#route-card"
            className="rounded-md border border-ink/15 px-4 py-2 text-sm font-semibold text-ink transition hover:border-bearing-rust hover:text-bearing-rust"
          >
            View sample
          </Link>
        </Container>
      </header>

      <section className="border-b border-ink/[0.08] bg-[linear-gradient(180deg,#f6f0e5_0%,#fbf6ea_100%)] py-14 sm:py-16">
        <Container>
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase text-bearing-rust">
              Route Card generator
            </p>
            <h1 className="mt-4 text-balance text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              Turn the messy idea into a builder-ready Route Card.
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-lg leading-8 text-slate-700">
              Start with a rough app, website, tool, workflow, or AI-helper idea.
              BuildBearing turns it into a clearer first-build direction with
              scope, risks, and next actions.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-12">
        <Container>
          <RouteCardForm />
        </Container>
      </section>
    </main>
  );
}
