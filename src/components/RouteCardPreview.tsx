import type { RouteCard } from "@/types/route-card";

type RouteCardPreviewProps = {
  card: RouteCard;
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b border-ink/[0.08] pb-3 last:border-b-0 last:pb-0 sm:grid-cols-[9rem_1fr]">
      <p className="text-xs font-semibold uppercase text-bearing-blue">{label}</p>
      <p className="text-pretty text-sm leading-6 text-ink">{value}</p>
    </div>
  );
}

function TagList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full bg-bearing-blue/10 px-3 py-1 text-sm font-medium text-bearing-blue"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-1 text-sm leading-6 text-slate-700">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-bearing-gold" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function RouteCardPreview({ card }: RouteCardPreviewProps) {
  return (
    <article className="rounded-lg border border-ink/[0.12] bg-paper p-4 shadow-soft sm:p-5">
      <div className="flex flex-col gap-3 border-b border-ink/10 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-bearing-rust">
            BuildBearing Route Card
          </p>
          <h2 className="mt-2 text-2xl font-semibold leading-tight text-ink">
            {card.title}
          </h2>
        </div>
        <div className="grid gap-1 text-xs font-medium uppercase text-slate-600 sm:text-right">
          <span>Bearing check complete</span>
          <span>MVP boundary set</span>
          <span>Next actions ready</span>
        </div>
      </div>

      <section className="mt-4 rounded-lg border border-ink/10 bg-white/[0.55] p-4">
        <div className="grid gap-3">
          <DetailRow label="Project idea" value={card.ideaSummary} />
          <DetailRow label="Target user" value={card.targetUser} />
          <DetailRow label="Problem" value={card.problem} />
          <DetailRow label="Core promise" value={card.corePromise} />
        </div>
      </section>

      <div className="mt-3 grid gap-3 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-lg border border-bearing-gold/[0.35] bg-bearing-gold/[0.12] p-3">
          <p className="text-xs font-semibold uppercase text-bearing-rust">
            Best first format
          </p>
          <p className="mt-1 text-sm font-semibold text-ink">
            {card.bestFirstFormat}
          </p>
        </section>
        <section className="rounded-lg border border-ink/10 bg-white/[0.55] p-3">
          <p className="text-xs font-semibold uppercase text-bearing-blue">
            Suggested screens or workflow
          </p>
          <div className="mt-2">
            <BulletList items={card.suggestedScreensOrWorkflow} />
          </div>
        </section>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-lg border border-ink/10 bg-white/[0.55] p-3">
          <p className="text-xs font-semibold uppercase text-bearing-rust">
            Build first
          </p>
          <div className="mt-2">
            <TagList items={card.buildFirst} />
          </div>
        </section>
        <section className="rounded-lg border border-ink/10 bg-white/[0.55] p-3">
          <p className="text-xs font-semibold uppercase text-bearing-rust">
            Not yet
          </p>
          <div className="mt-2">
            <BulletList items={card.notYet} />
          </div>
        </section>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <section className="rounded-lg border border-ink/10 bg-white/[0.55] p-3">
          <p className="text-xs font-semibold uppercase text-bearing-blue">
            MVP scope
          </p>
          <div className="mt-2">
            <BulletList items={card.mvpScope} />
          </div>
        </section>
        <section className="rounded-lg border border-ink/10 bg-white/[0.55] p-3">
          <p className="text-xs font-semibold uppercase text-bearing-blue">
            Key risks
          </p>
          <div className="mt-2">
            <BulletList items={card.keyRisks} />
          </div>
        </section>
        <section className="rounded-lg border border-ink/10 bg-white/[0.55] p-3">
          <p className="text-xs font-semibold uppercase text-bearing-blue">
            Launch readiness notes
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {card.launchReadinessNotes}
          </p>
        </section>
      </div>

      {card.assumptions?.length ? (
        <section className="mt-3 rounded-lg border border-ink/10 bg-white/[0.55] p-3">
          <p className="text-xs font-semibold uppercase text-bearing-blue">
            Assumptions
          </p>
          <div className="mt-2">
            <BulletList items={card.assumptions} />
          </div>
        </section>
      ) : null}

      <section className="mt-3 rounded-lg border border-ink/10 bg-[#28303d] p-3 text-white">
        <p className="text-xs font-semibold uppercase text-bearing-gold">
          Next 3 actions
        </p>
        <ol className="mt-3 grid gap-2 text-sm leading-6 text-white/90 lg:grid-cols-3">
          {card.nextActions.map((action, index) => (
            <li key={action} className="flex gap-2">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-bearing-gold text-xs font-bold text-ink">
                {index + 1}
              </span>
              <span>{action}</span>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}
