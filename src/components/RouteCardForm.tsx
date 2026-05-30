"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { routeCardToCodexPrompt } from "@/lib/route-card-codex-prompt";
import { routeCardToMarkdown } from "@/lib/route-card-markdown";
import type { RouteCard } from "@/types/route-card";
import { RouteCardPreview } from "@/components/RouteCardPreview";

type FormState = {
  idea: string;
  audience: string;
  uncertainty: string;
  constraints: string;
};

type CopyTarget = "markdown" | "codex";
type CopyState = {
  target: CopyTarget;
  status: "success" | "error";
} | null;

const initialFormState: FormState = {
  idea: "",
  audience: "",
  uncertainty: "",
  constraints: "",
};

const COPY_RESET_DELAY_MS = 2000;

export function RouteCardForm() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [card, setCard] = useState<RouteCard | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [copyState, setCopyState] = useState<CopyState>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const copyResetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ideaLength = form.idea.trim().length;
  const markdown = useMemo(() => (card ? routeCardToMarkdown(card) : ""), [card]);
  const codexPrompt = useMemo(
    () => (card ? routeCardToCodexPrompt(card) : ""),
    [card],
  );

  useEffect(() => {
    return () => {
      if (copyResetTimeout.current) {
        clearTimeout(copyResetTimeout.current);
      }
    };
  }, []);

  function resetCopyFeedback() {
    if (copyResetTimeout.current) {
      clearTimeout(copyResetTimeout.current);
      copyResetTimeout.current = null;
    }

    setCopyState(null);
  }

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setStatus("");
    resetCopyFeedback();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    resetCopyFeedback();

    if (ideaLength < 20) {
      setError("Give the idea at least 20 characters so the bearing check has something to work with.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/route-card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Something went wrong while creating the Route Card.");
        return;
      }

      setCard(data.card);
      setStatus("Route Card ready.");
    } catch {
      setError("Could not create the Route Card. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function copyText(target: CopyTarget, value: string) {
    if (!value) return;

    resetCopyFeedback();

    try {
      await navigator.clipboard.writeText(value);
      setCopyState({ target, status: "success" });
      copyResetTimeout.current = setTimeout(() => {
        setCopyState(null);
        copyResetTimeout.current = null;
      }, COPY_RESET_DELAY_MS);
    } catch {
      setCopyState({ target, status: "error" });
    }
  }

  function startOver() {
    setForm(initialFormState);
    setCard(null);
    setError("");
    setStatus("");
    resetCopyFeedback();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-ink/10 bg-paper/85 p-5 shadow-soft"
      >
        <div className="border-b border-ink/10 pb-5">
          <p className="text-sm font-semibold uppercase text-bearing-rust">
            Bearing check
          </p>
          <h2 className="mt-2 text-2xl font-semibold leading-tight text-ink">
            Start with the messy version.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            No account required. Start with a rough idea and leave with a clearer
            first-build direction.
          </p>
        </div>

        <div className="mt-5 grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="route-card-idea" className="text-sm font-semibold text-ink">
              Idea
            </label>
            <textarea
              id="route-card-idea"
              required
              minLength={20}
              value={form.idea}
              onChange={(event) => updateField("idea", event.target.value)}
              placeholder="Example: A simple app that helps seniors check suspicious messages before they click."
              aria-describedby="route-card-idea-help"
              className="min-h-36 rounded-md border border-ink/15 bg-white/75 px-3 py-3 text-base leading-7 text-ink outline-none transition placeholder:text-slate-400 focus:border-bearing-gold focus:ring-2 focus:ring-bearing-gold/20"
            />
            <span id="route-card-idea-help" className="text-xs text-slate-500">
              {ideaLength}/20 characters minimum
            </span>
          </div>

          <div className="grid gap-2">
            <label htmlFor="route-card-audience" className="text-sm font-semibold text-ink">
              Audience
            </label>
            <input
              id="route-card-audience"
              value={form.audience}
              onChange={(event) => updateField("audience", event.target.value)}
              placeholder="Who is this for?"
              className="rounded-md border border-ink/15 bg-white/75 px-3 py-3 text-base text-ink outline-none transition placeholder:text-slate-400 focus:border-bearing-gold focus:ring-2 focus:ring-bearing-gold/20"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="route-card-uncertainty" className="text-sm font-semibold text-ink">
              Uncertainty
            </label>
            <textarea
              id="route-card-uncertainty"
              value={form.uncertainty}
              onChange={(event) => updateField("uncertainty", event.target.value)}
              placeholder="What feels unclear, risky, or too broad?"
              className="min-h-24 rounded-md border border-ink/15 bg-white/75 px-3 py-3 text-base leading-7 text-ink outline-none transition placeholder:text-slate-400 focus:border-bearing-gold focus:ring-2 focus:ring-bearing-gold/20"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="route-card-constraints" className="text-sm font-semibold text-ink">
              Constraints
            </label>
            <textarea
              id="route-card-constraints"
              value={form.constraints}
              onChange={(event) => updateField("constraints", event.target.value)}
              placeholder="Time, budget, tech, privacy, launch, or scope constraints."
              className="min-h-24 rounded-md border border-ink/15 bg-white/75 px-3 py-3 text-base leading-7 text-ink outline-none transition placeholder:text-slate-400 focus:border-bearing-gold focus:ring-2 focus:ring-bearing-gold/20"
            />
          </div>
        </div>

        {error ? (
          <p
            role="alert"
            className="mt-5 rounded-md border border-bearing-rust/30 bg-bearing-rust/10 px-4 py-3 text-sm font-medium text-ink"
          >
            {error}
          </p>
        ) : null}

        {status ? (
          <p
            aria-live="polite"
            className="mt-5 rounded-md border border-bearing-blue/25 bg-bearing-blue/10 px-4 py-3 text-sm font-medium text-ink"
          >
            {status}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-bearing-gold px-5 text-base font-semibold text-ink transition hover:bg-[#d99a2a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Finding the bearing..." : "Generate Route Card"}
          </button>
          <button
            type="button"
            onClick={startOver}
            className="inline-flex min-h-12 items-center justify-center rounded-md border border-ink/15 px-5 text-base font-semibold text-ink transition hover:border-bearing-rust hover:text-bearing-rust"
          >
            Start over
          </button>
        </div>
      </form>

      <div className="grid gap-4">
        {card ? (
          <>
            <div className="flex flex-col justify-between gap-3 rounded-lg border border-ink/10 bg-paper/80 p-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-semibold uppercase text-bearing-rust">
                  Preview ready
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Your Route Card is ready to review or copy.
                </p>
              </div>
              <div className="grid gap-2 sm:justify-items-end">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => copyText("markdown", markdown)}
                    className="inline-flex min-h-11 items-center justify-center rounded-md bg-ink px-4 text-sm font-semibold text-white transition hover:bg-bearing-rust"
                  >
                    {copyState?.target === "markdown" &&
                    copyState.status === "success"
                      ? "Markdown copied"
                      : "Copy as Markdown"}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyText("codex", codexPrompt)}
                    className="inline-flex min-h-11 items-center justify-center rounded-md border border-ink/15 px-4 text-sm font-semibold text-ink transition hover:border-bearing-rust hover:text-bearing-rust"
                  >
                    {copyState?.target === "codex" && copyState.status === "success"
                      ? "Codex prompt copied"
                      : "Copy as Codex Prompt"}
                  </button>
                </div>
                <p
                  aria-live="polite"
                  className={`min-h-5 text-xs font-medium ${
                    copyState?.status === "error" ? "text-bearing-rust" : "text-slate-600"
                  }`}
                >
                  {copyState?.status === "success"
                    ? "Copied to clipboard."
                    : copyState?.status === "error"
                      ? "Could not copy. Please try again."
                      : ""}
                </p>
              </div>
            </div>
            <RouteCardPreview card={card} />
          </>
        ) : (
          <div className="rounded-lg border border-dashed border-ink/20 bg-paper/70 p-6 shadow-soft">
            <p className="text-sm font-semibold uppercase text-bearing-rust">
              Route Card preview
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-ink">
              Your build artifact will appear here.
            </h2>
            <p className="mt-3 max-w-xl text-pretty leading-7 text-slate-600">
              Enter the messy version of the idea. BuildBearing will return a
              structured Route Card with a first format, MVP boundary, not-yet
              list, risks, and exactly three next actions.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              {["Idea", "Boundary", "Risks", "Actions"].map((item, index) => (
                <div
                  key={item}
                  className="rounded-md border border-ink/10 bg-white/55 p-3"
                >
                  <span className="flex size-7 items-center justify-center rounded-full bg-bearing-gold/20 text-xs font-bold text-ink">
                    {index + 1}
                  </span>
                  <p className="mt-3 text-sm font-semibold text-ink">{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
