import Image from "next/image";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";

const problemPoints = [
  {
    label: "Too much momentum",
    title: "The build starts before the idea is clear.",
    description:
      "A fuzzy prompt becomes screens, features, accounts, dashboards, and edge cases before anyone has named the first useful version.",
  },
  {
    label: "Scope drift",
    title: "Everything feels important too early.",
    description:
      "Without a boundary, the idea collects nice-to-haves, future versions, and platform decisions that slow down the first real test.",
  },
  {
    label: "Unclear handoff",
    title: "Builders need a better starting artifact.",
    description:
      "AI builders, developers, designers, and founders all work better from a concise route card than from a vague paragraph of hope.",
  },
];

const routeSummary = [
  {
    label: "Project idea",
    value:
      "A simple app that helps seniors check suspicious messages before they click.",
  },
  {
    label: "Target user",
    value:
      "Seniors and less tech-savvy people who receive suspicious texts, emails, links, or screenshots.",
  },
  {
    label: "Problem",
    value:
      "People often do not know whether a message is safe, suspicious, or urgent.",
  },
  {
    label: "Core promise",
    value: "Before you click, check it first.",
  },
];

const buildFirst = [
  "Paste message",
  "Paste link",
  "Upload screenshot",
  "Show a calm result page",
  "Provide next steps",
];

const notYet = [
  "Accounts",
  "Payments",
  "Browser extension",
  "Community features",
  "Complex dashboards",
];

const mvpScope = [
  "Input screen",
  "Preview screen",
  "Result screen",
  "Safety tips",
  "Share-with-trusted-person flow",
];

const risks = [
  "False confidence",
  "Scary wording",
  "Privacy concerns",
  "Unclear results",
];

const nextActions = [
  "Test with 10 real scam examples.",
  "Improve the result copy so it feels calm and specific.",
  "Create a simple privacy page.",
];

const howItWorks = [
  {
    label: "01",
    title: "Messy idea",
    description:
      "Start with the plain-language thought, half-formed concept, screenshot, note, or rough build wish.",
  },
  {
    label: "02",
    title: "Bearing check",
    description:
      "Clarify who it is for, what problem it solves, what should wait, and whether it is worth building now.",
  },
  {
    label: "03",
    title: "First useful version",
    description:
      "Shrink the idea into a format, workflow, and MVP boundary that can be tested without dragging in the whole future.",
  },
  {
    label: "04",
    title: "Route Card",
    description:
      "Leave with a builder-ready artifact that can guide Codex, Cursor, Replit, Lovable, a designer, or your own next session.",
  },
];

const decisions = [
  "Should this be an app, website, internal tool, AI helper, or no-build test?",
  "Who is the first real user, and what will they try to do first?",
  "What belongs in V1, and what should stay out of the way?",
  "What result should the first screen, page, or workflow make obvious?",
  "What could create false confidence, confusion, or avoidable risk?",
  "What are the next three actions before anyone builds more?",
];

const useCases = [
  {
    label: "Scope the workflow",
    title: "App idea",
    description:
      "Turn a loose product concept into a first workflow, screen list, and MVP boundary.",
  },
  {
    label: "Map the pages",
    title: "Website",
    description:
      "Clarify the audience, offer, page map, proof, and launch-ready first version.",
  },
  {
    label: "Define the handoff",
    title: "Internal tool",
    description:
      "Map the repeated workflow, inputs, outputs, review steps, and adoption risks.",
  },
  {
    label: "Set guardrails",
    title: "AI helper",
    description:
      "Define the job, guardrails, handoff moments, and places where human review matters.",
  },
  {
    label: "Choose first format",
    title: "Small business project",
    description:
      "Choose the simplest useful format before spending time on a full platform.",
  },
];

const fieldNotes = [
  {
    tag: "Bearing check",
    title: "The first question is not what to build.",
    description:
      "It is what the first useful outcome should be for one specific person.",
  },
  {
    tag: "MVP boundary",
    title: "A good V1 says no out loud.",
    description:
      "The Route Card makes the not-yet list visible so the build can stay small.",
  },
  {
    tag: "Launch notes",
    title: "Readiness is more than feature count.",
    description:
      "The first release should be understandable, calm, testable, and honest about risk.",
  },
];

function RouteCardPreview() {
  return (
    <article className="rounded-lg border border-ink/[0.12] bg-paper p-4 shadow-soft sm:p-5">
      <div className="flex flex-col gap-3 border-b border-ink/10 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-bearing-rust">
            BuildBearing Route Card
          </p>
          <h3 className="mt-2 text-2xl font-semibold leading-tight text-ink">
            Message Safety Checker
          </h3>
        </div>
        <div className="grid gap-1 text-xs font-medium uppercase text-slate-600 sm:text-right">
          <span>BRG 042</span>
          <span>Bearing check complete</span>
          <span>First useful version</span>
        </div>
      </div>

      <section className="mt-4 rounded-lg border border-ink/10 bg-white/[0.55] p-4">
        <div className="grid gap-3">
          {routeSummary.map((item) => (
            <div
              key={item.label}
              className="grid gap-1 border-b border-ink/[0.08] pb-3 last:border-b-0 last:pb-0 sm:grid-cols-[9rem_1fr]"
            >
              <p className="text-xs font-semibold uppercase text-bearing-blue">
                {item.label}
              </p>
              <p className="text-pretty text-sm leading-6 text-ink">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-3 grid gap-3 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-lg border border-bearing-gold/[0.35] bg-bearing-gold/[0.12] p-3">
          <p className="text-xs font-semibold uppercase text-bearing-rust">
            Best first format
          </p>
          <p className="mt-1 text-sm font-semibold text-ink">
            Mobile-friendly checker prototype.
          </p>
        </div>
        <div className="rounded-lg border border-ink/10 bg-white/[0.55] p-3">
          <p className="text-xs font-semibold uppercase text-bearing-blue">
            MVP boundary
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-700">
            Keep the first test to input, preview, result, safety tips, and a
            trusted-person handoff.
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-lg border border-ink/10 bg-white/[0.55] p-3">
          <p className="text-xs font-semibold uppercase text-bearing-rust">
            Build first
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {buildFirst.map((item) => (
              <span
                key={item}
                className="rounded-full bg-bearing-blue/10 px-3 py-1 text-sm font-medium text-bearing-blue"
              >
                {item}
              </span>
            ))}
          </div>
        </section>
        <section className="rounded-lg border border-ink/10 bg-white/[0.55] p-3">
          <p className="text-xs font-semibold uppercase text-bearing-rust">
            Not yet
          </p>
          <ul className="mt-2 grid gap-1 text-sm leading-6 text-slate-700">
            {notYet.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-bearing-gold" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <section className="rounded-lg border border-ink/10 bg-white/[0.55] p-3">
          <p className="text-xs font-semibold uppercase text-bearing-blue">
            MVP scope
          </p>
          <ul className="mt-2 grid gap-1 text-sm leading-6 text-slate-700">
            {mvpScope.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-lg border border-ink/10 bg-white/[0.55] p-3">
          <p className="text-xs font-semibold uppercase text-bearing-blue">
            Key risks
          </p>
          <ul className="mt-2 grid gap-1 text-sm leading-6 text-slate-700">
            {risks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-lg border border-ink/10 bg-white/[0.55] p-3">
          <p className="text-xs font-semibold uppercase text-bearing-blue">
            Launch notes
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Share only after the result language is calm, privacy expectations are
            clear, and the flow has been tested with realistic scam examples.
          </p>
        </section>
      </div>

      <section className="mt-3 rounded-lg border border-ink/10 bg-[#28303d] p-3 text-white">
        <p className="text-xs font-semibold uppercase text-bearing-gold">
          Next 3 actions
        </p>
        <ol className="mt-3 grid gap-2 text-sm leading-6 text-white/90 lg:grid-cols-3">
          {nextActions.map((item, index) => (
            <li key={item} className="flex gap-2">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-bearing-gold text-xs font-bold text-ink">
                {index + 1}
              </span>
              {item}
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}

export default function Home() {
  return (
    <main className="overflow-hidden bg-field text-ink">
      <header className="border-b border-ink/[0.08] bg-field/[0.92] backdrop-blur">
        <Container className="flex min-h-16 items-center justify-between gap-4">
          <a href="#" className="flex items-center gap-3" aria-label="BuildBearing home">
            <span className="flex size-9 items-center justify-center rounded-md bg-bearing-gold text-sm font-bold text-ink shadow-sm shadow-ink/10">
              BB
            </span>
            <span className="text-base font-semibold">BuildBearing</span>
          </a>
          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
            <a href="#problem" className="transition hover:text-bearing-rust">
              Problem
            </a>
            <a href="#route-card" className="transition hover:text-bearing-rust">
              Route Card
            </a>
            <a href="#decisions" className="transition hover:text-bearing-rust">
              Decisions
            </a>
            <a href="#use-cases" className="transition hover:text-bearing-rust">
              Use cases
            </a>
          </nav>
          <a
            href="/route-card"
            className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-bearing-rust"
          >
            Request card
          </a>
        </Container>
      </header>

      <section className="relative border-b border-ink/[0.08]">
        <Image
          src="/images/buildbearing-field-guide-hero.png"
          alt="A warm navigation map with route lines, checkpoints, and compass details."
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_center]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#f6f0e5_0%,rgba(246,240,229,0.96)_38%,rgba(246,240,229,0.76)_64%,rgba(246,240,229,0.36)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-field to-transparent" />
        <Container className="relative grid min-h-[68svh] items-center gap-10 py-8 lg:min-h-[64svh] lg:grid-cols-[0.9fr_1.1fr] lg:py-8">
          <div className="max-w-3xl">
            <Badge>Pre-build clarity platform</Badge>
            <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.02] text-ink sm:text-5xl lg:text-6xl">
              Get your bearing before you build.
            </h1>
            <p className="mt-5 text-balance text-xl font-semibold leading-snug text-bearing-blue sm:text-2xl">
              Turn a fuzzy idea into a clear Route Card before you build the
              wrong thing.
            </p>
            <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-slate-700 sm:text-lg">
              Use it for apps, websites, tools, workflows, and AI helpers when
              you need to decide what to build, what not to build, and what the
              first useful version should be.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-xs font-semibold uppercase text-slate-600">
              <span className="border-l-2 border-bearing-gold pl-3">
                Bearing check
              </span>
              <span className="border-l-2 border-bearing-blue pl-3">
                MVP boundary
              </span>
              <span className="border-l-2 border-bearing-rust pl-3">
                Next 3 actions
              </span>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="/route-card"
                className="inline-flex min-h-12 items-center justify-center rounded-md bg-bearing-gold px-6 text-base font-semibold text-ink shadow-soft transition hover:bg-[#d99a2a]"
              >
                Generate a Route Card
              </a>
              <a
                href="#problem"
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-ink/[0.15] bg-paper/[0.78] px-6 text-base font-semibold text-ink transition hover:border-bearing-rust hover:text-bearing-rust"
              >
                Why it matters
              </a>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute -inset-3 rounded-lg border border-bearing-gold/20 bg-paper/30" />
            <Card className="relative bg-paper/[0.92] p-4">
              <div className="flex items-start justify-between gap-4 border-b border-ink/10 pb-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-bearing-rust">
                    Route Card
                  </p>
                  <h2 className="mt-2 text-xl font-semibold leading-tight text-ink">
                    Senior message safety checker
                  </h2>
                </div>
                <span className="rounded-full bg-bearing-gold/[0.18] px-3 py-1 text-xs font-semibold text-ink">
                  BRG 042
                </span>
              </div>
              <div className="mt-4 grid gap-2 text-sm leading-6">
                <div className="rounded-md bg-white/60 p-3">
                  <p className="font-semibold text-bearing-blue">Core promise</p>
                  <p className="text-slate-700">Before you click, check it first.</p>
                </div>
                <div className="rounded-md bg-white/60 p-3">
                  <p className="font-semibold text-bearing-blue">Best first format</p>
                  <p className="text-slate-700">Mobile-friendly checker prototype.</p>
                </div>
                <div className="rounded-md bg-white/60 p-3">
                  <p className="font-semibold text-bearing-blue">Not yet</p>
                  <p className="text-slate-700">
                    Accounts, payments, browser extension, dashboards.
                  </p>
                </div>
              </div>
              <div className="mt-4 rounded-md bg-ink p-3 text-white">
                <p className="text-xs font-semibold uppercase text-bearing-gold">
                  Next action
                </p>
                <p className="mt-2 text-sm leading-6 text-white/[0.85]">
                  Test the flow with 10 real scam examples before adding more
                  features.
                </p>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      <section id="problem" className="relative py-20 sm:py-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(32,37,50,0.22),transparent)]" />
        <Container>
          <SectionHeader
            eyebrow="The pre-build problem"
            title="Most projects do not fail because people start too slowly. They fail because they start too blurry."
            description="BuildBearing gives the idea a practical boundary before uncertainty becomes screens, features, and scope drift."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {problemPoints.map((item, index) => (
              <Card key={item.title}>
                <div className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase text-bearing-rust">
                  <span className="flex size-7 items-center justify-center rounded-full border border-bearing-gold/[0.45] bg-bearing-gold/15 text-ink">
                    {index + 1}
                  </span>
                  {item.label}
                </div>
                <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                <p className="mt-3 text-pretty leading-7 text-slate-600">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section
        id="route-card"
        className="border-y border-ink/[0.08] bg-[#fbf6ea] py-20 sm:py-24"
      >
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.55fr_1.45fr] lg:items-start">
            <div>
              <SectionHeader
                eyebrow="Primary output"
                title="The Route Card is the thing you leave with."
                description="It is a concise build artifact that names the idea, boundary, risks, first version, and next actions in one place."
              />
              <div className="mt-8 rounded-lg border border-ink/10 bg-paper/80 p-5">
                <p className="text-sm font-semibold uppercase text-bearing-rust">
                  Route line
                </p>
                <div className="mt-5 grid gap-4">
                  {[
                    "Bearing check complete",
                    "MVP boundary set",
                    "Risks visible",
                    "Next actions ready",
                  ].map((item, index) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-bearing-gold/20 text-xs font-bold text-ink">
                        {index + 1}
                      </span>
                      <span className="h-px flex-1 bg-ink/[0.12]" />
                      <span className="text-sm font-semibold text-slate-700">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <RouteCardPreview />
          </div>
        </Container>
      </section>

      <section id="how-it-works" className="py-20 sm:py-24">
        <Container>
          <SectionHeader
            eyebrow="How it works"
            title="A short path from fuzzy idea to builder-ready brief."
            description="The pipeline stays intentionally short. The goal is not to teach everything. The goal is to make the next build decision clear."
          />
          <div className="mt-8 rounded-lg border border-ink/10 bg-paper/80 p-4 shadow-sm shadow-ink/5">
            <div className="grid gap-3 text-sm font-semibold text-ink sm:grid-cols-4">
              {["Messy idea", "Bearing check", "First useful version", "Route Card"].map(
                (item, index, list) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-bearing-gold/20 text-xs text-ink">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                    {index < list.length - 1 ? (
                      <span className="ml-auto hidden text-bearing-rust sm:inline">
                        →
                      </span>
                    ) : null}
                  </div>
                ),
              )}
            </div>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-4">
            {howItWorks.map((step) => (
              <Card key={step.title} className="relative overflow-hidden">
                <span className="absolute left-0 top-0 h-full w-1 bg-bearing-gold/70" />
                <p className="text-sm font-semibold uppercase text-bearing-rust">
                  {step.label}
                </p>
                <h3 className="mt-4 text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-3 text-pretty leading-7 text-slate-600">
                  {step.description}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section
        id="decisions"
        className="border-y border-ink/[0.08] bg-[#efe4d2] py-20 sm:py-24"
      >
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <SectionHeader
              eyebrow="Decisions BuildBearing helps with"
              title="The quiet questions that save the build."
              description="Before you generate pages, screens, code, or project plans, the Route Card answers the practical decisions that shape everything after."
            />
            <div className="grid gap-3">
              {decisions.map((decision, index) => (
                <div
                  key={decision}
                  className="grid gap-4 rounded-lg border border-ink/10 bg-paper/80 p-4 shadow-sm shadow-ink/5 sm:grid-cols-[3rem_1fr]"
                >
                  <span className="flex size-10 items-center justify-center rounded-full bg-bearing-blue/10 text-sm font-bold text-bearing-blue">
                    {index + 1}
                  </span>
                  <p className="self-center text-pretty font-semibold leading-7 text-ink">
                    {decision}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section id="use-cases" className="py-20 sm:py-24">
        <Container>
          <SectionHeader
            eyebrow="Use cases"
            title="Use it before the first serious build session."
            description="BuildBearing is useful when there is enough energy to make something, but not enough clarity to know the right first version."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {useCases.map((item) => (
              <Card key={item.title}>
                <p className="text-sm font-semibold uppercase text-bearing-blue">
                  {item.label}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-ink">{item.title}</h3>
                <p className="mt-3 text-pretty leading-7 text-slate-600">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section id="field-notes" className="border-y border-ink/[0.08] bg-[#fbf6ea] py-20 sm:py-24">
        <Container>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeader
              eyebrow="Supporting field notes"
              title="Quick notes when a build decision needs a second look."
              description="Use field notes for sharper prompts, safer scope choices, and calmer launch decisions without turning the process into homework."
            />
            <a
              href="/route-card"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-ink/[0.15] px-5 text-sm font-semibold text-ink transition hover:border-bearing-rust hover:text-bearing-rust"
            >
              Request first card
            </a>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {fieldNotes.map((note) => (
              <Card key={note.title}>
                <p className="text-sm font-semibold text-bearing-blue">{note.tag}</p>
                <h3 className="mt-3 text-lg font-semibold leading-snug text-ink">
                  {note.title}
                </h3>
                <p className="mt-3 leading-7 text-slate-600">{note.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section id="start" className="bg-ink py-20 text-white sm:py-24">
        <Container className="text-center">
          <p className="text-sm font-semibold uppercase text-bearing-gold">
            Ready for a bearing check
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl text-balance text-3xl font-semibold leading-tight sm:text-4xl">
            Request your first Route Card before you build.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-7 text-white/[0.78] sm:text-lg sm:leading-8">
            Start with the fuzzy version of the idea. Leave with the project
            boundary, first format, risks, and next three actions.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/route-card"
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-bearing-gold px-6 text-base font-semibold text-ink transition hover:bg-[#d99a2a]"
            >
              Generate your first Route Card
            </a>
            <a
              href="#route-card"
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/25 px-6 text-base font-semibold text-white transition hover:border-bearing-gold hover:text-bearing-gold"
            >
              Review the sample
            </a>
          </div>
        </Container>
      </section>

      <footer className="border-t border-ink/[0.08] py-8">
        <Container className="flex flex-col justify-between gap-3 text-sm text-slate-600 sm:flex-row">
          <p>(c) 2026 BuildBearing. Get your bearing before you build.</p>
          <p>Pre-build clarity for apps, websites, tools, and workflows.</p>
        </Container>
      </footer>
    </main>
  );
}
